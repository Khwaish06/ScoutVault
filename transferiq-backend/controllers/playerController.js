import Player from "../models/player.js";

export const createPlayer = async (req, res) => {
  try {
    const player = new Player(req.body);
    await player.save();
    res.status(201).json(player);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getPlayers = async (req, res) => {
  try {
    const { name, team, minValue, maxValue } = req.query;

    let query = {};

    // 🔍 Search by name (case-insensitive)
    if (name) {
      query.name = { $regex: name, $options: "i" };
    }

    // 🏟️ Filter by team
    if (team) {
      query.team = { $regex: team, $options: "i" };
    }

    // 💰 Filter by predicted value range
    if (minValue || maxValue) {
      query["predictions.0.value"] = {};
      if (minValue) query["predictions.0.value"].$gte = Number(minValue);
      if (maxValue) query["predictions.0.value"].$lte = Number(maxValue);
    }

    const players = await Player.find(query);
    res.json(players);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



export const updatePlayer = async (req, res) => {
  try {
    const cleanId = req.params.id.trim(); // remove spaces/newlines
    const player = await Player.findByIdAndUpdate(cleanId, req.body, { new: true });
    if (!player) return res.status(404).json({ error: "Player not found" });
    res.json(player);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deletePlayer = async (req, res) => {
  try {
    const cleanId = req.params.id.trim();
    const player = await Player.findByIdAndDelete(cleanId);
    if (!player) return res.status(404).json({ error: "Player not found" });
    res.json({ message: "Player deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const getPlayerById = async (req, res) => {
  try {
    const cleanId = req.params.id.trim();
    const player = await Player.findById(cleanId);
    if (!player) return res.status(404).json({ error: "Player not found" });
    res.json(player);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};