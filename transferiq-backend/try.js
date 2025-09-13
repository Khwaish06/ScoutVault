
import mongoose from "mongoose";
import dotenv from "dotenv";
import Player from "./models/player.js";

dotenv.config();

async function cleanupDuplicates() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    let totalRemoved = 0;
    let totalUpdated = 0;

    // 1. Handle abbreviated vs full name duplicates
    console.log("\n🔍 Phase 1: Cleaning abbreviated vs full name duplicates...");
    
    const abbreviatedPlayers = await Player.find({
      name: { $regex: /^[A-Z]\.\s/ }
    }).lean();

    console.log(`Found ${abbreviatedPlayers.length} abbreviated names to check`);

    for (const abbrevPlayer of abbreviatedPlayers) {
      const nameParts = abbrevPlayer.name.split(' ');
      if (nameParts.length >= 2) {
        const firstInitial = nameParts[0].replace('.', '');
        const restOfName = nameParts.slice(1).join(' ');
        
        // Look for full names that match this pattern
        const potentialMatches = await Player.find({
          name: { 
            $regex: new RegExp(`^${firstInitial}[a-zA-Z]+.*${restOfName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'),
            $ne: abbrevPlayer.name
          },
          team: abbrevPlayer.team, // Same team
          age: { $gte: abbrevPlayer.age - 1, $lte: abbrevPlayer.age + 1 } // Similar age
        }).lean();

        if (potentialMatches.length > 0) {
          const fullNamePlayer = potentialMatches[0];
          
          console.log(`🎯 Removing abbreviated: "${abbrevPlayer.name}" in favor of "${fullNamePlayer.name}"`);
          
          // Remove the abbreviated version
          await Player.deleteOne({ _id: abbrevPlayer._id });
          totalRemoved++;
        }
      }
    }

    // 2. Handle exact same player different name formats
    console.log("\n🔍 Phase 2: Handling same players with different name formats...");
    
    // Get all players and group by team for efficiency
    const allPlayers = await Player.find({}).lean();
    const playersByTeam = {};
    
    allPlayers.forEach(player => {
      if (!playersByTeam[player.team]) {
        playersByTeam[player.team] = [];
      }
      playersByTeam[player.team].push(player);
    });

    // Check within each team for potential duplicates
    for (const [team, players] of Object.entries(playersByTeam)) {
      if (players.length <= 1) continue;
      
      const processed = new Set();
      
      for (let i = 0; i < players.length; i++) {
        if (processed.has(i)) continue;
        
        const player1 = players[i];
        const duplicates = [];
        
        for (let j = i + 1; j < players.length; j++) {
          if (processed.has(j)) continue;
          
          const player2 = players[j];
          
          if (arePotentialDuplicates(player1, player2)) {
            duplicates.push({ index: j, player: player2 });
          }
        }
        
        if (duplicates.length > 0) {
          // Keep the player with the most complete name
          const allVersions = [{ index: i, player: player1 }, ...duplicates];
          const bestVersion = selectBestVersion(allVersions);
          
          console.log(`\n🎯 Found duplicate group in ${team}:`);
          allVersions.forEach(({ player }) => {
            console.log(`   "${player.name}" | Age: ${player.age} | ID: ${player._id}`);
          });
          console.log(`   Keeping: "${bestVersion.player.name}"`);
          
          // Remove the others
          for (const { index, player } of allVersions) {
            if (index !== bestVersion.index) {
              await Player.deleteOne({ _id: player._id });
              totalRemoved++;
              processed.add(index);
            }
          }
          processed.add(bestVersion.index);
        }
      }
    }

    // 3. Handle similar surnames that might be the same person
    console.log("\n🔍 Phase 3: Checking similar surnames for potential duplicates...");
    
    // Get players with common surnames
    const surnameGroups = {};
    allPlayers.forEach(player => {
      const nameParts = player.name.trim().split(' ');
      if (nameParts.length > 1) {
        const surname = nameParts[nameParts.length - 1];
        if (surname.length > 2 && /^[A-Z]/.test(surname)) {
          if (!surnameGroups[surname]) {
            surnameGroups[surname] = [];
          }
          surnameGroups[surname].push(player);
        }
      }
    });

    // Focus on surnames with multiple players
    const suspiciousSurnameGroups = Object.entries(surnameGroups)
      .filter(([surname, players]) => players.length > 1 && players.length <= 5); // Not too many to be safe

    for (const [surname, players] of suspiciousSurnameGroups) {
      console.log(`\nChecking surname "${surname}" with ${players.length} players:`);
      
      const processed = new Set();
      
      for (let i = 0; i < players.length; i++) {
        if (processed.has(i)) continue;
        
        const player1 = players[i];
        const potentialDuplicates = [];
        
        for (let j = i + 1; j < players.length; j++) {
          if (processed.has(j)) continue;
          
          const player2 = players[j];
          
          // More strict checking for surname duplicates
          if (areVeryLikelyDuplicates(player1, player2)) {
            potentialDuplicates.push({ index: j, player: player2 });
          }
        }
        
        if (potentialDuplicates.length > 0) {
          const allVersions = [{ index: i, player: player1 }, ...potentialDuplicates];
          const bestVersion = selectBestVersion(allVersions);
          
          console.log(`   🎯 Duplicate group found:`);
          allVersions.forEach(({ player }) => {
            console.log(`      "${player.name}" | ${player.team} | Age: ${player.age}`);
          });
          console.log(`      Keeping: "${bestVersion.player.name}"`);
          
          // Remove duplicates
          for (const { index, player } of allVersions) {
            if (index !== bestVersion.index) {
              await Player.deleteOne({ _id: player._id });
              totalRemoved++;
              processed.add(index);
            }
          }
          processed.add(bestVersion.index);
        }
      }
    }

    // 4. Clean up any remaining obvious issues
    console.log("\n🔍 Phase 4: Final cleanup of obvious duplicates...");
    
    // Remove players with empty or invalid names
    const invalidPlayers = await Player.find({
      $or: [
        { name: { $exists: false } },
        { name: "" },
        { name: null },
        { name: { $regex: /^[\s]*$/ } }
      ]
    });

    if (invalidPlayers.length > 0) {
      console.log(`${DRY_RUN ? 'Would remove' : 'Removing'} ${invalidPlayers.length} players with invalid names`);
      if (!DRY_RUN) {
        await Player.deleteMany({
          $or: [
            { name: { $exists: false } },
            { name: "" },
            { name: null },
            { name: { $regex: /^[\s]*$/ } }
          ]
        });
      }
      totalRemoved += invalidPlayers.length;
    }

    // Final statistics
    const finalCount = await Player.countDocuments();
    
    console.log(`\n📊 Cleanup Summary:`);
    console.log(`   Players removed: ${totalRemoved}`);
    console.log(`   Players updated: ${totalUpdated}`);
    console.log(`   Final player count: ${finalCount.toLocaleString()}`);
    console.log(`   Estimated duplicates cleaned: ${totalRemoved}`);

    // Verify the cleanup worked
    console.log(`\n✅ Running quick verification...`);
    
    const remainingAbbreviated = await Player.countDocuments({
      name: { $regex: /^[A-Z]\.\s/ }
    });
    
    console.log(`   Abbreviated names remaining: ${remainingAbbreviated}`);
    
    if (remainingAbbreviated > 0) {
      console.log(`   (These might be unique players or need manual review)`);
    }

  } catch (error) {
    console.error("❌ Error during cleanup:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB");
  }
}

function arePotentialDuplicates(player1, player2) {
  // Must be same team
  if (player1.team !== player2.team) return false;
  
  // Age must be very close (within 1 year)
  const ageDiff = Math.abs((player1.age || 0) - (player2.age || 0));
  if (ageDiff > 1) return false;
  
  const name1 = normalizeNameForComparison(player1.name);
  const name2 = normalizeNameForComparison(player2.name);
  
  // High similarity threshold for team-based matching
  const similarity = calculateSimilarity(name1, name2);
  return similarity > 0.8;
}

function areVeryLikelyDuplicates(player1, player2) {
  // More strict checking - must be same team and very similar age
  if (player1.team !== player2.team) return false;
  
  const ageDiff = Math.abs((player1.age || 0) - (player2.age || 0));
  if (ageDiff > 0) return false; // Exact age match required
  
  const name1 = normalizeNameForComparison(player1.name);
  const name2 = normalizeNameForComparison(player2.name);
  
  // Very high similarity threshold
  const similarity = calculateSimilarity(name1, name2);
  return similarity > 0.9;
}

function normalizeNameForComparison(name) {
  return name.toLowerCase()
    .replace(/[^a-z\s]/g, '') // Remove punctuation
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
}

function selectBestVersion(versions) {
  // Prefer the version with:
  // 1. Longest name (most complete)
  // 2. No abbreviations
  // 3. Most recent creation date if available
  
  return versions.reduce((best, current) => {
    const bestName = best.player.name;
    const currentName = current.player.name;
    
    // Prefer non-abbreviated names
    const bestIsAbbrev = /^[A-Z]\.\s/.test(bestName);
    const currentIsAbbrev = /^[A-Z]\.\s/.test(currentName);
    
    if (bestIsAbbrev && !currentIsAbbrev) return current;
    if (!bestIsAbbrev && currentIsAbbrev) return best;
    
    // Prefer longer names
    if (currentName.length > bestName.length) return current;
    if (bestName.length > currentName.length) return best;
    
    // If equal, keep the first one
    return best;
  });
}

function calculateSimilarity(str1, str2) {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  if (longer.length === 0) return 1.0;
  
  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

function levenshteinDistance(str1, str2) {
  const matrix = Array(str2.length + 1).fill().map(() => Array(str1.length + 1).fill(0));
  
  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
  
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j - 1][i] + 1,
        matrix[j][i - 1] + 1,
        matrix[j - 1][i - 1] + cost
      );
    }
  }
  
  return matrix[str2.length][str1.length];
}

// Run with safety confirmation
console.log("🚨 This script will permanently remove duplicate players from your database!");
console.log("💡 Make sure you have a backup before running this cleanup.");
console.log("\nTo run the cleanup, uncomment the line below:\n");

// cleanupDuplicates(); // Uncomment this line to run the cleanup