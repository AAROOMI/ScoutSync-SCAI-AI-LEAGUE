import { pgTable, text, serial, integer, boolean, timestamp, jsonb, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name"),
  role: text("role").default("scout"),
  avatarUrl: text("avatar_url"),
});

// Players table to store analyzed players
export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  age: integer("age"),
  team: text("team"),
  position: text("position"),
  description: text("description"),
  avatarUrl: text("avatar_url"),
  recruitmentMatch: integer("recruitment_match"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Analysis metrics for each player
export const playerMetrics = pgTable("player_metrics", {
  id: serial("id").primaryKey(),
  playerId: integer("player_id").notNull(),
  pace: real("pace"),
  technique: real("technique"),
  finishing: real("finishing"),
  passing: real("passing"),
  vision: real("vision"),
  stamina: real("stamina"),
  tackling: real("tackling"),
  strength: real("strength"),
  positioning: real("positioning"),
  agility: real("agility"),
  ballControl: real("ball_control"),
  speed: real("speed"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Videos uploaded for analysis
export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size"),
  duration: integer("duration"),
  playerId: integer("player_id"),
  uploadedById: integer("uploaded_by_id"),
  status: text("status").default("pending"), // pending, analyzing, completed
  analysisResults: jsonb("analysis_results"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Formula 1 drivers
export const f1Drivers = pgTable("f1_drivers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  team: text("team").notNull(),
  number: integer("number"),
  avatarUrl: text("avatar_url"),
});

// Formula 1 races
export const f1Races = pgTable("f1_races", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location"),
  date: timestamp("date"),
  status: text("status").default("upcoming"), // upcoming, completed
});

// Formula 1 predictions
export const f1Predictions = pgTable("f1_predictions", {
  id: serial("id").primaryKey(),
  raceId: integer("race_id").notNull(),
  driverId: integer("driver_id").notNull(),
  position: integer("position"),
  winProbability: real("win_probability"),
  factors: jsonb("factors"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Football teams
export const footballTeams = pgTable("football_teams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  league: text("league"),
  logoUrl: text("logo_url"),
});

// Football matches
export const footballMatches = pgTable("football_matches", {
  id: serial("id").primaryKey(),
  homeTeamId: integer("home_team_id").notNull(),
  awayTeamId: integer("away_team_id").notNull(),
  date: timestamp("date"),
  status: text("status").default("upcoming"), // upcoming, completed
  homeScore: integer("home_score"),
  awayScore: integer("away_score"),
});

// Football predictions
export const footballPredictions = pgTable("football_predictions", {
  id: serial("id").primaryKey(),
  matchId: integer("match_id").notNull(),
  predictedHomeScore: integer("predicted_home_score"),
  predictedAwayScore: integer("predicted_away_score"),
  winProbability: real("win_probability"),
  drawProbability: real("draw_probability"),
  lossProbability: real("loss_probability"),
  confidence: integer("confidence"),
  stats: jsonb("stats"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Football team stats (for league rankings and predictions)
export const footballTeamStats = pgTable("football_team_stats", {
  id: serial("id").primaryKey(), 
  teamId: integer("team_id").notNull(),
  leaguePosition: integer("league_position"),
  winProbability: real("win_probability"),
  form: text("form"),
  goalDifference: integer("goal_difference"),
  points: integer("points"),
  recentResults: jsonb("recent_results"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Zod schemas for insertion
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  role: true,
  avatarUrl: true,
});

export const insertPlayerSchema = createInsertSchema(players).pick({
  name: true,
  age: true,
  team: true,
  position: true,
  description: true,
  avatarUrl: true,
  recruitmentMatch: true,
});

export const insertPlayerMetricsSchema = createInsertSchema(playerMetrics).pick({
  playerId: true,
  pace: true,
  technique: true,
  finishing: true,
  passing: true,
  vision: true,
  stamina: true,
  tackling: true,
  strength: true,
  positioning: true,
  agility: true,
  ballControl: true,
  speed: true,
});

export const insertVideoSchema = createInsertSchema(videos).pick({
  title: true,
  fileName: true,
  fileSize: true,
  duration: true,
  playerId: true,
  uploadedById: true,
  status: true,
  analysisResults: true,
});

export const insertF1DriverSchema = createInsertSchema(f1Drivers).pick({
  name: true,
  team: true,
  number: true,
  avatarUrl: true,
});

export const insertF1RaceSchema = createInsertSchema(f1Races).pick({
  name: true,
  location: true,
  date: true,
  status: true,
});

export const insertF1PredictionSchema = createInsertSchema(f1Predictions).pick({
  raceId: true,
  driverId: true,
  position: true,
  winProbability: true,
  factors: true,
});

export const insertFootballTeamSchema = createInsertSchema(footballTeams).pick({
  name: true,
  league: true,
  logoUrl: true,
});

export const insertFootballMatchSchema = createInsertSchema(footballMatches).pick({
  homeTeamId: true,
  awayTeamId: true,
  date: true,
  status: true,
  homeScore: true,
  awayScore: true,
});

export const insertFootballPredictionSchema = createInsertSchema(footballPredictions).pick({
  matchId: true,
  predictedHomeScore: true,
  predictedAwayScore: true,
  winProbability: true,
  drawProbability: true,
  lossProbability: true,
  confidence: true,
  stats: true,
});

export const insertFootballTeamStatSchema = createInsertSchema(footballTeamStats).pick({
  teamId: true,
  leaguePosition: true,
  winProbability: true,
  form: true,
  goalDifference: true,
  points: true,
  recentResults: true,
});

// Type definitions
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Player = typeof players.$inferSelect;
export type InsertPlayer = z.infer<typeof insertPlayerSchema>;

export type PlayerMetrics = typeof playerMetrics.$inferSelect;
export type InsertPlayerMetrics = z.infer<typeof insertPlayerMetricsSchema>;

export type Video = typeof videos.$inferSelect;
export type InsertVideo = z.infer<typeof insertVideoSchema>;

export type F1Driver = typeof f1Drivers.$inferSelect;
export type InsertF1Driver = z.infer<typeof insertF1DriverSchema>;

export type F1Race = typeof f1Races.$inferSelect;
export type InsertF1Race = z.infer<typeof insertF1RaceSchema>;

export type F1Prediction = typeof f1Predictions.$inferSelect;
export type InsertF1Prediction = z.infer<typeof insertF1PredictionSchema>;

export type FootballTeam = typeof footballTeams.$inferSelect;
export type InsertFootballTeam = z.infer<typeof insertFootballTeamSchema>;

export type FootballMatch = typeof footballMatches.$inferSelect;
export type InsertFootballMatch = z.infer<typeof insertFootballMatchSchema>;

export type FootballPrediction = typeof footballPredictions.$inferSelect;
export type InsertFootballPrediction = z.infer<typeof insertFootballPredictionSchema>;

export type FootballTeamStat = typeof footballTeamStats.$inferSelect;
export type InsertFootballTeamStat = z.infer<typeof insertFootballTeamStatSchema>;
