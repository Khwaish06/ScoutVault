import express from "express";
import { createPlayer, getPlayers, updatePlayer, deletePlayer,getPlayerById } from "../controllers/playerController.js";

const router = express.Router();

router.post("/", createPlayer);      // Create
router.get("/", getPlayers);         // Read all
router.put("/:id", updatePlayer);    // Update by ID
router.delete("/:id", deletePlayer); // Delete by ID
router.get("/:id", getPlayerById); 

export default router;
