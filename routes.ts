import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertPlayerSchema, 
  insertPlayerMetricsSchema, 
  insertVideoSchema,
  insertF1DriverSchema,
  insertF1RaceSchema,
  insertF1PredictionSchema,
  insertFootballTeamSchema,
  insertFootballMatchSchema,
  insertFootballPredictionSchema,
  insertFootballTeamStatSchema
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Error handling middleware
  const handleError = (err: any, res: Response) => {
    if (err instanceof ZodError) {
      return res.status(400).json({ message: fromZodError(err).message });
    }
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  };

  // Player routes
  app.get("/api/players", async (_req, res) => {
    try {
      const players = await storage.getPlayers();
      res.json(players);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  // Endpoint for handling player image uploads
  app.post("/api/players/image-upload", async (req, res) => {
    try {
      // In a real implementation, we would handle file upload here
      // For now, we'll just return a success response with a path to the static image
      res.json({ 
        success: true,
        imageUrl: "/assets/player-images/ronaldo.jpg" 
      });
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.get("/api/players/top", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 5;
      const topPlayers = await storage.getTopPlayers(limit);
      res.json(topPlayers);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.get("/api/players/:id", async (req, res) => {
    try {
      const playerId = parseInt(req.params.id);
      const player = await storage.getPlayer(playerId);
      
      if (!player) {
        return res.status(404).json({ message: "Player not found" });
      }
      
      const metrics = await storage.getPlayerMetrics(playerId);
      res.json({ ...player, metrics: metrics || null });
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.post("/api/players", async (req, res) => {
    try {
      const playerData = insertPlayerSchema.parse(req.body);
      const player = await storage.createPlayer(playerData);
      res.status(201).json(player);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.patch("/api/players/:id", async (req, res) => {
    try {
      const playerId = parseInt(req.params.id);
      const playerData = insertPlayerSchema.partial().parse(req.body);
      const updatedPlayer = await storage.updatePlayer(playerId, playerData);
      
      if (!updatedPlayer) {
        return res.status(404).json({ message: "Player not found" });
      }
      
      res.json(updatedPlayer);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  // Player metrics routes
  app.post("/api/player-metrics", async (req, res) => {
    try {
      const metricsData = insertPlayerMetricsSchema.parse(req.body);
      const metrics = await storage.createPlayerMetrics(metricsData);
      res.status(201).json(metrics);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.patch("/api/player-metrics/:id", async (req, res) => {
    try {
      const metricsId = parseInt(req.params.id);
      const metricsData = insertPlayerMetricsSchema.partial().parse(req.body);
      const updatedMetrics = await storage.updatePlayerMetrics(metricsId, metricsData);
      
      if (!updatedMetrics) {
        return res.status(404).json({ message: "Metrics not found" });
      }
      
      res.json(updatedMetrics);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  // Video routes
  app.get("/api/videos/recent", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 5;
      const videos = await storage.getRecentVideos(limit);
      res.json(videos);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.get("/api/videos/player/:playerId", async (req, res) => {
    try {
      const playerId = parseInt(req.params.playerId);
      const videos = await storage.getVideosByPlayer(playerId);
      res.json(videos);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.post("/api/videos", async (req, res) => {
    try {
      const videoData = insertVideoSchema.parse(req.body);
      const video = await storage.createVideo(videoData);
      res.status(201).json(video);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.patch("/api/videos/:id", async (req, res) => {
    try {
      const videoId = parseInt(req.params.id);
      const videoData = insertVideoSchema.partial().parse(req.body);
      const updatedVideo = await storage.updateVideo(videoId, videoData);
      
      if (!updatedVideo) {
        return res.status(404).json({ message: "Video not found" });
      }
      
      res.json(updatedVideo);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.delete("/api/videos/:id", async (req, res) => {
    try {
      const videoId = parseInt(req.params.id);
      const deleted = await storage.deleteVideo(videoId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Video not found" });
      }
      
      res.status(204).end();
    } catch (err) {
      handleError(err, res);
    }
  });
  
  // Formula 1 routes
  app.get("/api/f1/drivers", async (_req, res) => {
    try {
      const drivers = await storage.getF1Drivers();
      res.json(drivers);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.get("/api/f1/races/upcoming", async (_req, res) => {
    try {
      const races = await storage.getUpcomingF1Races();
      res.json(races);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.get("/api/f1/predictions/:raceId", async (req, res) => {
    try {
      const raceId = parseInt(req.params.raceId);
      const predictions = await storage.getF1Predictions(raceId);
      res.json(predictions);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.post("/api/f1/drivers", async (req, res) => {
    try {
      const driverData = insertF1DriverSchema.parse(req.body);
      const driver = await storage.createF1Driver(driverData);
      res.status(201).json(driver);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.post("/api/f1/races", async (req, res) => {
    try {
      const raceData = insertF1RaceSchema.parse(req.body);
      const race = await storage.createF1Race(raceData);
      res.status(201).json(race);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.post("/api/f1/predictions", async (req, res) => {
    try {
      const predictionData = insertF1PredictionSchema.parse(req.body);
      const prediction = await storage.createF1Prediction(predictionData);
      res.status(201).json(prediction);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  // Football routes
  app.get("/api/football/teams", async (_req, res) => {
    try {
      const teams = await storage.getFootballTeams();
      res.json(teams);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.get("/api/football/matches/upcoming", async (_req, res) => {
    try {
      const matches = await storage.getUpcomingFootballMatches();
      res.json(matches);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.get("/api/football/predictions/:matchId", async (req, res) => {
    try {
      const matchId = parseInt(req.params.matchId);
      const prediction = await storage.getFootballPrediction(matchId);
      
      if (!prediction) {
        return res.status(404).json({ message: "Prediction not found" });
      }
      
      res.json(prediction);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.post("/api/football/teams", async (req, res) => {
    try {
      const teamData = insertFootballTeamSchema.parse(req.body);
      const team = await storage.createFootballTeam(teamData);
      res.status(201).json(team);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.post("/api/football/matches", async (req, res) => {
    try {
      const matchData = insertFootballMatchSchema.parse(req.body);
      const match = await storage.createFootballMatch(matchData);
      res.status(201).json(match);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.post("/api/football/predictions", async (req, res) => {
    try {
      const predictionData = insertFootballPredictionSchema.parse(req.body);
      const prediction = await storage.createFootballPrediction(predictionData);
      res.status(201).json(prediction);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  // Football team stats routes
  app.get("/api/football/team-stats", async (req, res) => {
    try {
      const league = req.query.league as string;
      const stats = await storage.getFootballTeamStats(league);
      res.json(stats);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.get("/api/football/team-stats/:teamId", async (req, res) => {
    try {
      const teamId = parseInt(req.params.teamId);
      const stats = await storage.getFootballTeamStat(teamId);
      
      if (!stats) {
        return res.status(404).json({ message: "Team stats not found" });
      }
      
      res.json(stats);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.post("/api/football/team-stats/:teamId", async (req, res) => {
    try {
      const teamId = parseInt(req.params.teamId);
      const statData = insertFootballTeamStatSchema.omit({ teamId: true }).parse(req.body);
      const stats = await storage.createFootballTeamStat(teamId, statData);
      res.status(201).json(stats);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  const httpServer = createServer(app);
  return httpServer;
}
