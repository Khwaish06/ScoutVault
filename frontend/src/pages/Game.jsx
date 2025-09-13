import { useState, useEffect, useRef } from "react";
import { Trophy, Target, Zap, Clock, BarChart3, Info, Play, Home, RotateCcw } from "lucide-react";

function Game() {
  const [gameState, setGameState] = useState("menu"); // menu, rules, playing, gameOver
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [goaliePosition, setGoaliePosition] = useState("center");
  const [targetPosition, setTargetPosition] = useState(null);
  const [isShootingAnimation, setIsShootingAnimation] = useState(false);
  const [gameResult, setGameResult] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [highScore, setHighScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [powerLevel, setPowerLevel] = useState(50);
  const [isPowerCharging, setIsPowerCharging] = useState(false);
  const [showPowerBar, setShowPowerBar] = useState(false);
  
  // New challenging mechanics
  const [windDirection, setWindDirection] = useState("none");
  const [windStrength, setWindStrength] = useState(0);
  const [isRaining, setIsRaining] = useState(false);
  const [goalieDistraction, setGoalieDistraction] = useState(false);
  const [pressureLevel, setPressureLevel] = useState(0);
  const [goalieForm, setGoalieForm] = useState("normal");
  const [ballCurve, setBallCurve] = useState(0);
  const [timeLimit, setTimeLimit] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [goalieSize, setGoalieSize] = useState("normal");
  const [fakePowerBar, setFakePowerBar] = useState(false);
  const [shotHistory, setShotHistory] = useState([]);

  const powerIntervalRef = useRef(null);
  const countdownRef = useRef(null);

  // Generate random challenging conditions for each shot
  const generateShotConditions = () => {
    const difficultyFactor = difficulty === "easy" ? 0.3 : difficulty === "medium" ? 0.6 : 1.0;
    
    // Wind conditions
    if (Math.random() < 0.4 * difficultyFactor) {
      setWindDirection(Math.random() < 0.5 ? "left" : "right");
      setWindStrength(Math.floor(Math.random() * 50 + 10));
    } else {
      setWindDirection("none");
      setWindStrength(0);
    }
    
    // Weather effects
    setIsRaining(Math.random() < 0.25 * difficultyFactor);
    
    // Goalkeeper form (affects reflexes)
    const formRandom = Math.random();
    if (formRandom < 0.2 * difficultyFactor) setGoalieForm("excellent");
    else if (formRandom < 0.4) setGoalieForm("poor");
    else setGoalieForm("normal");
    
    // Goalkeeper size variation
    const sizeRandom = Math.random();
    if (sizeRandom < 0.15 * difficultyFactor) setGoalieSize("large");
    else if (sizeRandom < 0.3) setGoalieSize("small");
    else setGoalieSize("normal");
    
    // Crowd pressure increases with attempts
    setPressureLevel(Math.min(attempts * 15 + Math.random() * 20, 100));
    
    // Time pressure (hard mode only)
    if (difficulty === "hard" && Math.random() < 0.4) {
      const newTimeLimit = 3 + Math.random() * 2;
      setTimeLimit(newTimeLimit);
      setCountdown(newTimeLimit);
    } else {
      setTimeLimit(null);
      setCountdown(null);
    }
    
    // Fake power bar occasionally
    setFakePowerBar(Math.random() < 0.15 * difficultyFactor);
    
    // Goalie distraction
    setGoalieDistraction(Math.random() < 0.2 * difficultyFactor);
  };

  // Load high scores from memory
  const [savedData, setSavedData] = useState({ highScore: 0, bestStreak: 0 });

  useEffect(() => {
    setHighScore(savedData.highScore);
    setBestStreak(savedData.bestStreak);
  }, []);

  // Generate new conditions for each shot
  useEffect(() => {
    if (gameState === "playing" && !isShootingAnimation && !isPowerCharging) {
      generateShotConditions();
    }
  }, [attempts, gameState]);

  // Countdown timer effect
  useEffect(() => {
    if (timeLimit && countdown > 0 && !isShootingAnimation) {
      countdownRef.current = setTimeout(() => {
        setCountdown(prev => prev - 0.1);
      }, 100);
    } else if (countdown <= 0 && timeLimit && !isShootingAnimation) {
      // Time's up! Force a miss
      setGameResult("⏰ TIME'S UP!");
      setStreak(0);
      setAttempts(prev => {
        const newAttempts = prev + 1;
        if (newAttempts >= 10) setGameState("gameOver");
        return newAttempts;
      });
      setTimeout(() => {
        setGameResult("");
        setTimeLimit(null);
        setCountdown(null);
      }, 1500);
    }
    
    return () => {
      if (countdownRef.current) clearTimeout(countdownRef.current);
    };
  }, [countdown, timeLimit, isShootingAnimation]);

  // Save high scores
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      setSavedData(prev => ({ ...prev, highScore: score }));
    }
    if (streak > bestStreak) {
      setBestStreak(streak);
      setSavedData(prev => ({ ...prev, bestStreak: streak }));
    }
  }, [score, streak, highScore, bestStreak]);

  // Enhanced Goalie AI with smarter movement patterns
  useEffect(() => {
    if (gameState === "playing" && !isShootingAnimation) {
      const positions = ["left", "center", "right"];
      
      // Goalkeeper gets smarter based on difficulty and your patterns
      const speed = difficulty === "easy" ? 1800 : difficulty === "medium" ? 1200 : 800;
      
      const intervalId = setInterval(() => {
        // Smart goalie - sometimes stays in position to fake you out
        const stayChance = difficulty === "easy" ? 0.1 : difficulty === "medium" ? 0.2 : 0.35;
        
        if (Math.random() < stayChance) {
          return; // Goalie doesn't move - stays in current position
        }
        
        // Weighted movement - goalkeeper favors certain positions based on game state
        let weights = [1, 1, 1]; // equal probability initially
        
        // Late game pressure - goalkeeper anticipates corners more
        if (attempts >= 6) {
          weights = [1.3, 0.8, 1.3]; // Favor corners
        }
        
        // If player has been shooting to same side, goalie learns
        if (streak >= 2 && targetPosition) {
          const lastShotIndex = targetPosition === "left" ? 0 : targetPosition === "center" ? 1 : 2;
          weights[lastShotIndex] *= 1.4; // Favor the side you've been using
        }
        
        // Weighted random selection
        const totalWeight = weights.reduce((a, b) => a + b, 0);
        const randomNum = Math.random() * totalWeight;
        let weightSum = 0;
        
        for (let i = 0; i < positions.length; i++) {
          weightSum += weights[i];
          if (randomNum <= weightSum) {
            setGoaliePosition(positions[i]);
            break;
          }
        }
      }, speed);

      return () => clearInterval(intervalId);
    }
  }, [gameState, difficulty, isShootingAnimation, attempts, streak, targetPosition]);

  const playSound = (file) => {
    // For local development, sounds should be in public/sounds/ folder
    try {
      const audio = new Audio(`/sounds/${file}`);
      audio.volume = 0.3; // Adjust volume (0.0 to 1.0)
      audio.play().catch(e => console.log('Audio play failed:', e));
    } catch (error) {
      console.log(`Could not play sound: ${file}`, error);
    }
  };

  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setAttempts(0);
    setStreak(0);
    setGoaliePosition("center");
    setTargetPosition(null);
    setGameResult("");
    setShotHistory([]);
  };

  const showRules = () => {
    setGameState("rules");
  };

  const startPowerCharge = () => {
    if (timeLimit && countdown <= 0) return;
    
    setShowPowerBar(true);
    setIsPowerCharging(true);
    setPowerLevel(0);

    powerIntervalRef.current = setInterval(() => {
      setPowerLevel((prev) => (prev >= 100 ? 0 : prev + 2));
    }, 30);
  };

  const getMissType = (shootPosition, goaliePos, power) => {
    if (power < 20) {
      return { message: "😴 TOO WEAK!", type: "weak" };
    }
    
    if (power > 95) {
      const missOptions = ["🚀 OVER THE BAR!", "⬆️ SKY HIGH!", "🎯 TOO POWERFUL!"];
      return { message: missOptions[Math.floor(Math.random() * missOptions.length)], type: "over" };
    }

    if (shootPosition === goaliePos) {
      const saveOptions = ["🧤 GREAT SAVE!", "❌ GOALKEEPER'S CATCH!", "🛡️ BLOCKED!", "👐 BRILLIANT SAVE!"];
      return { message: saveOptions[Math.floor(Math.random() * saveOptions.length)], type: "saved" };
    }

    const random = Math.random();
    
    if (random < 0.4) {
      const wideOptions = ["📏 WIDE OF THE POST!", "➡️ MISSED THE TARGET!", "🎯 JUST WIDE!", "📐 OFF TARGET!"];
      return { message: wideOptions[Math.floor(Math.random() * wideOptions.length)], type: "wide" };
    } else if (random < 0.7) {
      const postOptions = ["🏗️ HIT THE POST!", "⚡ CROSSBAR!", "🔨 SO CLOSE!", "🎯 POST DENIED YOU!"];
      return { message: postOptions[Math.floor(Math.random() * postOptions.length)], type: "post" };
    } else {
      const lastSecondSaves = ["🤾 DIVING SAVE!", "💨 FINGERTIP SAVE!", "🦸 HEROIC SAVE!", "⚡ LIGHTNING REFLEXES!"];
      return { message: lastSecondSaves[Math.floor(Math.random() * lastSecondSaves.length)], type: "dive" };
    }
  };

  const shoot = (position) => {
    if (isShootingAnimation || !isPowerCharging || (timeLimit && countdown <= 0)) return;

    setIsPowerCharging(false);
    setShowPowerBar(false);
    if (powerIntervalRef.current) clearInterval(powerIntervalRef.current);
    if (countdownRef.current) clearTimeout(countdownRef.current);

    playSound("kick.wav");

    setTargetPosition(position);
    setIsShootingAnimation(true);

    const isGoal = calculateGoal(position, goaliePosition, powerLevel);

    setTimeout(() => {
      if (isGoal) {
        setScore((prev) => prev + 1);
        setStreak((prev) => prev + 1);
        setGameResult("⚽ GOAL!");
        playSound("goal.wav");
      } else {
        const missType = getMissType(position, goaliePosition, powerLevel);
        setGameResult(missType.message);
        setStreak(0);
        playSound("miss.ogg");
      }

      setAttempts((prev) => {
        const newAttempts = prev + 1;
        if (newAttempts >= 10) setGameState("gameOver");
        return newAttempts;
      });

      setTimeout(() => {
        setIsShootingAnimation(false);
        setTargetPosition(null);
        setGameResult("");
        setPowerLevel(50);
        setTimeLimit(null);
        setCountdown(null);
      }, 1500);
    }, 800);
  };

  const calculateGoal = (shootPosition, goaliePos, power) => {
    // Track shooting pattern
    setShotHistory(prev => [...prev, { position: shootPosition, power, attempt: attempts }]);
    
    // Base realistic chances
    let baseChance = shootPosition === goaliePos ? 0.12 : 0.58;
    
    // Advanced goalkeeper intelligence
    const recentShots = shotHistory.slice(-3);
    const samePositionCount = recentShots.filter(shot => shot.position === shootPosition).length;
    if (samePositionCount >= 2) {
      baseChance *= 0.4; // Goalkeeper expects this position
    }
    
    // Power system with narrow sweet spots
    let powerMultiplier = 1;
    const realPower = fakePowerBar ? Math.max(0, Math.min(100, power + (Math.random() - 0.5) * 30)) : power;
    
    if (realPower < 15 || realPower > 92) powerMultiplier = 0.2;
    else if (realPower < 35 || realPower > 85) powerMultiplier = 0.5;
    else if (realPower >= 68 && realPower <= 78) powerMultiplier = 1.4;
    else powerMultiplier = 0.75;
    
    // Difficulty multipliers
    const difficultyMultiplier = difficulty === "easy" ? 0.7 : difficulty === "medium" ? 0.5 : 0.35;
    
    // Weather conditions
    let weatherMultiplier = 1;
    if (isRaining) weatherMultiplier *= 0.7;
    
    // Wind effects
    let windMultiplier = 1;
    if (windDirection !== "none") {
      const windEffect = windStrength / 100;
      if ((windDirection === "left" && shootPosition === "right") || 
          (windDirection === "right" && shootPosition === "left")) {
        windMultiplier *= (1 - windEffect * 0.3);
      } else if ((windDirection === "left" && shootPosition === "left") || 
                 (windDirection === "right" && shootPosition === "right")) {
        windMultiplier *= (1 + windEffect * 0.2);
      }
    }
    
    // Goalkeeper form affects saves
    const goalieFormMultiplier = goalieForm === "excellent" ? 0.6 : 
                                goalieForm === "poor" ? 1.3 : 1.0;
    
    // Goalkeeper size affects coverage
    const goalieSizeMultiplier = goalieSize === "large" ? 0.8 :
                                goalieSize === "small" ? 1.2 : 1.0;
    
    // Pressure from crowd and attempts
    const pressureMultiplier = Math.max(0.5, 1 - (pressureLevel / 200));
    
    // Streak pressure
    let streakPressure = 1;
    if (streak >= 3) streakPressure = 0.9 - ((streak - 3) * 0.08);
    else if (streak > 0) streakPressure = 1 + (streak * 0.02);
    
    // Goalie distraction can help player
    const distractionBonus = goalieDistraction ? 1.2 : 1.0;
    
    // Ball curve effect
    setBallCurve((Math.random() - 0.5) * 4);
    const curveEffect = Math.abs(ballCurve) > 1.5 ? 0.9 : 1.0;
    
    const finalChance = baseChance * powerMultiplier * difficultyMultiplier * 
                       weatherMultiplier * windMultiplier * goalieFormMultiplier *
                       goalieSizeMultiplier * pressureMultiplier * streakPressure *
                       distractionBonus * curveEffect;
    
    return Math.random() < Math.min(Math.max(finalChance, 0.05), 0.65);
  };

  const resetGame = () => {
    setGameState("menu");
    setScore(0);
    setAttempts(0);
    setStreak(0);
    setGoaliePosition("center");
    setTargetPosition(null);
    setGameResult("");
    setPowerLevel(50);
    setShowPowerBar(false);
    setIsPowerCharging(false);
    setShotHistory([]);
  };

  const difficultyConfig = {
    easy: { color: "emerald", icon: "😊", desc: "Moderate conditions, some challenges - 25-45%" },
    medium: { color: "amber", icon: "😐", desc: "Variable weather, smart goalie - 15-35%" },
    hard: { color: "red", icon: "😤", desc: "Extreme conditions, time limits - 10-25%" }
  };
  const colorClasses = {
    emerald: "bg-emerald-500 border-emerald-600",
    amber: "bg-amber-500 border-amber-600",
    red: "bg-red-500 border-red-600",
  };

  return (
  <div className="relative min-h-screen w-full bg-gradient-to-br from-green-200 via-blue-100 to-purple-200 h-screen overflow-y-scroll">


      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/3 w-48 h-48 bg-emerald-300/10 rounded-full blur-2xl animate-pulse delay-2000"></div>
      </div>

      {/* Stadium Atmosphere */}
      <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-gray-900/90 to-transparent flex items-center justify-center text-yellow-300 font-bold text-lg z-10">
        <div className="flex items-center space-x-4 animate-pulse">
          <span>🎉</span>
          <span className="hidden sm:inline">EXTREME PENALTY CHALLENGE</span>
          <span className="sm:hidden">EXTREME CHALLENGE</span>
          <span>🎉</span>
        </div>
      </div>

      <div className="relative z-20 p-4 pt-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-4 drop-shadow-2xl tracking-tight">
              <span className="inline-block animate-bounce">⚽</span>
              <span className="bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent ml-2">
                Penalty Shootout
              </span>
            </h1>
            <p className="text-blue-500 text-lg sm:text-xl font-medium">
              Face the ultimate challenge with dynamic conditions
            </p>
          </div>

          {/* MENU */}
          {gameState === "menu" && (
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 max-w-3xl mx-auto border border-white/20">
              <div className="text-center mb-8">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
                  Ready for the Ultimate Test? 🔥
                </h2>
                <p className="text-gray-600 text-lg">
                  Dynamic weather, smart AI, and extreme pressure await
                </p>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white text-center transform hover:scale-105 transition-all">
                  <Trophy className="w-8 h-8 mx-auto mb-3 text-yellow-300" />
                  <h3 className="font-semibold text-sm opacity-90 mb-1">High Score</h3>
                  <p className="text-3xl font-bold">{highScore}<span className="text-lg opacity-75">/10</span></p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl text-white text-center transform hover:scale-105 transition-all">
                  <Target className="w-8 h-8 mx-auto mb-3 text-yellow-300" />
                  <h3 className="font-semibold text-sm opacity-90 mb-1">Best Streak</h3>
                  <p className="text-3xl font-bold">{bestStreak}</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-2xl text-white text-center transform hover:scale-105 transition-all">
                  <BarChart3 className="w-8 h-8 mx-auto mb-3 text-yellow-300" />
                  <h3 className="font-semibold text-sm opacity-90 mb-1">Success Rate</h3>
                  <p className="text-3xl font-bold">
                    {highScore > 0 ? Math.round((highScore / 10) * 100) : 0}<span className="text-lg opacity-75">%</span>
                  </p>
                </div>
              </div>

              {/* Difficulty Selection */}
              <div className="mb-8">
      <h3 className="text-xl font-bold text-gray-800 text-center mb-6">
        Choose Your Challenge Level
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {["easy", "medium", "hard"].map((level) => {
          const config = difficultyConfig[level];
          return (
            <button
              key={level}
              onClick={() => setDifficulty(level)}
              className={`p-6 rounded-2xl font-medium transition-all transform hover:scale-105 border-2 ${
                difficulty === level
                  ? `${colorClasses[config.color]} text-white shadow-lg`
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200"
              }`}
            >
              <div className="text-3xl mb-2">{config.icon}</div>
              <div className="text-lg font-bold capitalize mb-1">{level}</div>
              <div className="text-sm opacity-75">{config.desc}</div>
            </button>
          );
        })}
      </div>
    </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
                <button
                  onClick={showRules}
                  className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold text-lg rounded-full hover:from-gray-700 hover:to-gray-800 transition-all transform hover:scale-105 shadow-lg"
                >
                  <Info className="w-6 h-6 mr-2" />
                  How to Play
                </button>
                <button
                  onClick={startGame}
                  className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-xl rounded-full hover:from-emerald-600 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  <Play className="w-6 h-6 mr-2" />
                  Start Challenge
                </button>
              </div>
            </div>
          )}

          {/* RULES */}
          {gameState === "rules" && (
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 max-w-4xl mx-auto border border-white/20">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Extreme Challenge Rules</h2>
                <p className="text-gray-600">Master these conditions to become a legend!</p>
              </div>

              <div className="space-y-8">
                {/* Basic Rules */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-2xl">
                  <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
                    <Target className="w-6 h-6 mr-2" />
                    Extreme Challenge Objective
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Score as many goals as possible in 10 penalty attempts under constantly changing, challenging conditions. Dynamic weather, smart AI, and pressure will test your skills!
                  </p>
                </div>

                {/* New Challenge Features */}
                <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-2xl">
                  <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center">
                    <Zap className="w-6 h-6 mr-2" />
                    Dynamic Challenge System
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div><strong>🌧️ Weather:</strong> Rain makes ball slippery</div>
                      <div><strong>💨 Wind:</strong> Affects ball trajectory</div>
                      <div><strong>🧤 AI Form:</strong> Goalkeeper has good/bad days</div>
                      <div><strong>📏 Size Variation:</strong> Goalkeepers change size</div>
                    </div>
                    <div className="space-y-2">
                      <div><strong>⏰ Time Pressure:</strong> Limited time in hard mode</div>
                      <div><strong>📢 Crowd Pressure:</strong> Increases with attempts</div>
                      <div><strong>🎯 Pattern Learning:</strong> AI remembers your shots</div>
                      <div><strong>⚡ Power Glitches:</strong> Sometimes power bar lies</div>
                    </div>
                  </div>
                </div>

                {/* Strategy */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl">
                  <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center">
                    <Clock className="w-6 h-6 mr-2" />
                    Extreme Difficulty Levels
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                    <div className="bg-emerald-100 p-4 rounded-lg">
                      <h4 className="font-bold text-emerald-800 mb-2">😊 Moderate Challenge</h4>
                      <p className="text-gray-700">Some weather effects, basic AI learning. Success rate: 25-45%</p>
                    </div>
                    <div className="bg-amber-100 p-4 rounded-lg">
                      <h4 className="font-bold text-amber-800 mb-2">😐 Hardcore Mode</h4>
                      <p className="text-gray-700">All conditions active, smart AI. Success rate: 15-35%</p>
                    </div>
                    <div className="bg-red-100 p-4 rounded-lg">
                      <h4 className="font-bold text-red-800 mb-2">😤 Legendary Challenge</h4>
                      <p className="text-gray-700">Extreme conditions, time limits. Success rate: 10-25%</p>
                    </div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <p className="text-red-800 font-semibold text-sm">
                      ⚠️ <strong>Warning:</strong> This is an elite-level challenge. Scoring 3+ goals is impressive, 5+ is exceptional, 7+ is legendary!
                    </p>
                  </div>
                </div>

                {/* Controls */}
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-2xl">
                  <h3 className="text-xl font-bold text-emerald-800 mb-4 flex items-center">
                    <Zap className="w-6 h-6 mr-2" />
                    Precision Controls
                  </h3>
                  <div className="space-y-3 text-gray-700">
                    <div className="flex items-start">
                      <span className="text-emerald-600 font-bold mr-3">1.</span>
                      <span><strong>Hold</strong> "Charge Power" and watch conditions carefully</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-emerald-600 font-bold mr-3">2.</span>
                      <span><strong>Optimal Power:</strong> 68-78% (very narrow sweet spot!)</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-emerald-600 font-bold mr-3">3.</span>
                      <span><strong>Click</strong> goal area considering wind and conditions</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-emerald-600 font-bold mr-3">4.</span>
                      <span><strong>Adapt:</strong> AI learns your patterns - stay unpredictable!</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back Button */}
              <div className="flex justify-center">
                <button
                  onClick={() => setGameState("menu")}
                  className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold text-lg rounded-full hover:from-gray-700 hover:to-gray-800 transition-all transform hover:scale-105 shadow-lg"
                >
                  <Home className="w-6 h-6 mr-2" />
                  Back to Menu
                </button>
              </div>
            </div>
          )}

          {/* GAME PLAY */}
          {gameState === "playing" && (
            <div className="space-y-6">
              {/* Score Header */}
              <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-800">{score}</div>
                      <div className="text-sm text-gray-600">Goals</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-800">{attempts}/10</div>
                      <div className="text-sm text-gray-600">Attempts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{streak}</div>
                      <div className="text-sm text-gray-600">Streak</div>
                    </div>
                  </div>
                  
                  {/* Conditions Display */}
                  <div className="flex flex-wrap gap-2">
                    {isRaining && <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">🌧️ Raining</div>}
                    {windDirection !== "none" && (
                      <div className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                        💨 Wind {windDirection} {windStrength}%
                      </div>
                    )}
                    {goalieForm !== "normal" && (
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        goalieForm === "excellent" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                      }`}>
                        🧤 {goalieForm === "excellent" ? "Sharp" : "Sluggish"} Keeper
                      </div>
                    )}
                    {pressureLevel > 50 && (
                      <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                        📢 High Pressure
                      </div>
                    )}
                    {timeLimit && (
                      <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                        ⏰ {countdown ? Math.ceil(countdown) : 0}s
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Soccer Field */}
              <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
                <div className="relative bg-gradient-to-b from-green-400 to-green-500 rounded-2xl p-8 min-h-96 overflow-hidden">
                  {/* Field markings */}
                  <div className="absolute inset-0 bg-green-400 opacity-20">
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-20 border-2 border-white rounded-t-lg"></div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-12 border-2 border-white rounded-t-lg"></div>
                  </div>

                  {/* Goal */}
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-64 h-32 bg-gray-800 rounded-lg shadow-2xl">
                    <div className="w-full h-full bg-gradient-to-b from-gray-700 to-gray-900 rounded-lg border-4 border-white relative overflow-hidden">
                      {/* Net pattern */}
                      <div className="absolute inset-0 opacity-30">
                        {[...Array(8)].map((_, i) => (
                          <div key={i} className="absolute bg-white h-px w-full" style={{ top: `${i * 12.5}%` }}></div>
                        ))}
                        {[...Array(16)].map((_, i) => (
                          <div key={i} className="absolute bg-white w-px h-full" style={{ left: `${i * 6.25}%` }}></div>
                        ))}
                      </div>
                      
                      {/* Goalkeeper */}
                      <div 
                        className={`absolute bottom-2 transition-all duration-500 transform ${
                          goaliePosition === "left" ? "left-4" : goaliePosition === "right" ? "right-4" : "left-1/2 -translate-x-1/2"
                        } ${goalieSize === "large" ? "scale-125" : goalieSize === "small" ? "scale-75" : ""}`}
                      >
                        <div className={`text-4xl ${goalieDistraction ? "animate-bounce" : ""} ${
                          goalieForm === "excellent" ? "text-red-400" : goalieForm === "poor" ? "text-green-400" : "text-yellow-400"
                        }`}>
                          🥅
                        </div>
                        {goalieDistraction && (
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs text-yellow-300 animate-pulse">
                            Distracted!
                          </div>
                        )}
                      </div>

                      {/* Target indicators during animation */}
                      {targetPosition && isShootingAnimation && (
                        <div className={`absolute bottom-4 w-8 h-8 bg-yellow-400 rounded-full animate-ping ${
                          targetPosition === "left" ? "left-8" : targetPosition === "right" ? "right-8" : "left-1/2 transform -translate-x-1/2"
                        }`}></div>
                      )}
                    </div>
                  </div>

                  {/* Ball */}
                  <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
                    <div className={`text-4xl transition-all duration-300 ${isShootingAnimation ? "animate-bounce" : ""}`}>
                      ⚽
                    </div>
                  </div>

                  {/* Shooting zones */}
                  {!isShootingAnimation && !isPowerCharging && (
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4">
                      <button
                        onClick={startPowerCharge}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-full hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
                      >
                        <Zap className="w-5 h-5 mr-2 inline" />
                        Charge Power
                      </button>
                    </div>
                  )}

                  {/* Power charging interface */}
                  {isPowerCharging && showPowerBar && (
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-80">
                      <div className="bg-white/90 rounded-2xl p-6 shadow-lg">
                        <div className="text-center mb-4">
                          <h3 className="font-bold text-gray-800 mb-2">Power: {Math.round(powerLevel)}%</h3>
                          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-75 ${
                                powerLevel >= 68 && powerLevel <= 78 ? "bg-green-500" :
                                powerLevel >= 35 && powerLevel <= 85 ? "bg-yellow-500" : "bg-red-500"
                              }`}
                              style={{ width: `${powerLevel}%` }}
                            ></div>
                          </div>
                          {fakePowerBar && (
                            <div className="text-xs text-red-600 mt-1 animate-pulse">Power reading unstable!</div>
                          )}
                        </div>
                        
                        <div className="flex justify-center space-x-3">
                          <button
                            onClick={() => shoot("left")}
                            className="px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-all transform hover:scale-105"
                          >
                            ← Left
                          </button>
                          <button
                            onClick={() => shoot("center")}
                            className="px-4 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-all transform hover:scale-105"
                          >
                            ↑ Center
                          </button>
                          <button
                            onClick={() => shoot("right")}
                            className="px-4 py-2 bg-purple-500 text-white font-bold rounded-lg hover:bg-purple-600 transition-all transform hover:scale-105"
                          >
                            Right →
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Game result overlay */}
                  {gameResult && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black/80 text-white text-2xl sm:text-4xl font-bold px-8 py-4 rounded-2xl shadow-2xl animate-pulse">
                        {gameResult}
                      </div>
                    </div>
                  )}

                  {/* Weather effects */}
                  {isRaining && (
                    <div className="absolute inset-0 pointer-events-none">
                      {[...Array(50)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-0.5 h-4 bg-blue-200 opacity-60 animate-pulse"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 2}s`
                          }}
                        ></div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* GAME OVER */}
          {gameState === "gameOver" && (
           <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 max-w-3xl mx-auto border border-white/20 ">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">Challenge Complete! 🏆</h2>
                <div className="text-6xl mb-6">
                  {score >= 7 ? "🏆" : score >= 5 ? "🥇" : score >= 3 ? "🥈" : "💪"}
                </div>
                <p className="text-xl text-gray-600 mb-2">
                  {score >= 7 ? "LEGENDARY PERFORMANCE!" :
                   score >= 5 ? "EXCEPTIONAL SKILL!" :
                   score >= 3 ? "IMPRESSIVE SHOWING!" :
                   "Keep Training!"}
                </p>
                <p className="text-gray-500">
                  {score >= 7 ? "You've mastered the extreme challenge!" :
                   score >= 5 ? "Outstanding precision under pressure!" :
                   score >= 3 ? "Solid performance in tough conditions!" :
                   "The conditions were brutal - try again!"}
                </p>
              </div>

              {/* Final Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                  <div className="text-3xl font-bold text-blue-600">{score}/10</div>
                  <div className="text-sm text-gray-600">Final Score</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                  <div className="text-3xl font-bold text-purple-600">{Math.round((score/10) * 100)}%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl">
                  <div className="text-3xl font-bold text-emerald-600">{score > highScore ? "NEW!" : highScore}</div>
                  <div className="text-sm text-gray-600">High Score</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
                  <div className="text-3xl font-bold text-orange-600">{streak > bestStreak ? "NEW!" : bestStreak}</div>
                  <div className="text-sm text-gray-600">Best Streak</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={startGame}
                  className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-lg rounded-full hover:from-emerald-600 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  <RotateCcw className="w-6 h-6 mr-2" />
                  Try Again
                </button>
                <button
                  onClick={resetGame}
                  className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold text-lg rounded-full hover:from-gray-700 hover:to-gray-800 transition-all transform hover:scale-105 shadow-lg"
                >
                  <Home className="w-6 h-6 mr-2" />
                  Main Menu
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Game;