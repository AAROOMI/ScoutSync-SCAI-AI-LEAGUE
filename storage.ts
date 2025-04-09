import {
  users, players, playerMetrics, videos, f1Drivers, f1Races, f1Predictions,
  footballTeams, footballMatches, footballPredictions, footballTeamStats,
  type User, type InsertUser, type Player, type InsertPlayer,
  type PlayerMetrics, type InsertPlayerMetrics, type Video, type InsertVideo,
  type F1Driver, type InsertF1Driver, type F1Race, type InsertF1Race,
  type F1Prediction, type InsertF1Prediction, type FootballTeam, 
  type InsertFootballTeam, type FootballMatch, type InsertFootballMatch,
  type FootballPrediction, type InsertFootballPrediction,
  type FootballTeamStat, type InsertFootballTeamStat
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Player operations
  getPlayer(id: number): Promise<Player | undefined>;
  getPlayers(): Promise<Player[]>;
  getTopPlayers(limit: number): Promise<(Player & { metrics: PlayerMetrics | null })[]>;
  createPlayer(player: InsertPlayer): Promise<Player>;
  updatePlayer(id: number, player: Partial<InsertPlayer>): Promise<Player | undefined>;
  
  // Player metrics operations
  getPlayerMetrics(playerId: number): Promise<PlayerMetrics | undefined>;
  createPlayerMetrics(metrics: InsertPlayerMetrics): Promise<PlayerMetrics>;
  updatePlayerMetrics(id: number, metrics: Partial<InsertPlayerMetrics>): Promise<PlayerMetrics | undefined>;
  
  // Video operations
  getVideo(id: number): Promise<Video | undefined>;
  getVideosByPlayer(playerId: number): Promise<Video[]>;
  getRecentVideos(limit: number): Promise<Video[]>;
  createVideo(video: InsertVideo): Promise<Video>;
  updateVideo(id: number, video: Partial<InsertVideo>): Promise<Video | undefined>;
  deleteVideo(id: number): Promise<boolean>;
  
  // Formula 1 operations
  getF1Driver(id: number): Promise<F1Driver | undefined>;
  getF1Drivers(): Promise<F1Driver[]>;
  createF1Driver(driver: InsertF1Driver): Promise<F1Driver>;
  
  getF1Race(id: number): Promise<F1Race | undefined>;
  getUpcomingF1Races(): Promise<F1Race[]>;
  createF1Race(race: InsertF1Race): Promise<F1Race>;
  
  getF1Predictions(raceId: number): Promise<(F1Prediction & { driver: F1Driver })[]>;
  createF1Prediction(prediction: InsertF1Prediction): Promise<F1Prediction>;
  
  // Football operations
  getFootballTeam(id: number): Promise<FootballTeam | undefined>;
  getFootballTeams(): Promise<FootballTeam[]>;
  createFootballTeam(team: InsertFootballTeam): Promise<FootballTeam>;
  
  getFootballMatch(id: number): Promise<FootballMatch | undefined>;
  getUpcomingFootballMatches(): Promise<FootballMatch[]>;
  createFootballMatch(match: InsertFootballMatch): Promise<FootballMatch>;
  
  getFootballPrediction(matchId: number): Promise<FootballPrediction | undefined>;
  createFootballPrediction(prediction: InsertFootballPrediction): Promise<FootballPrediction>;
  
  // Football team stats operations
  getFootballTeamStat(teamId: number): Promise<FootballTeamStat | undefined>;
  getFootballTeamStats(league?: string): Promise<FootballTeamStat[]>;
  createFootballTeamStat(teamId: number, stat: Omit<InsertFootballTeamStat, 'teamId'>): Promise<FootballTeamStat>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private players: Map<number, Player>;
  private playerMetrics: Map<number, PlayerMetrics>;
  private videos: Map<number, Video>;
  private f1Drivers: Map<number, F1Driver>;
  private f1Races: Map<number, F1Race>;
  private f1Predictions: Map<number, F1Prediction>;
  private footballTeams: Map<number, FootballTeam>;
  private footballMatches: Map<number, FootballMatch>;
  private footballPredictions: Map<number, FootballPrediction>;
  private footballTeamStats: Map<number, FootballTeamStat>;
  
  private currentIds: {
    user: number;
    player: number;
    playerMetrics: number;
    video: number;
    f1Driver: number;
    f1Race: number;
    f1Prediction: number;
    footballTeam: number;
    footballMatch: number;
    footballPrediction: number;
    footballTeamStat: number;
  };

  constructor() {
    this.users = new Map();
    this.players = new Map();
    this.playerMetrics = new Map();
    this.videos = new Map();
    this.f1Drivers = new Map();
    this.f1Races = new Map();
    this.f1Predictions = new Map();
    this.footballTeams = new Map();
    this.footballMatches = new Map();
    this.footballPredictions = new Map();
    this.footballTeamStats = new Map();
    
    this.currentIds = {
      user: 1,
      player: 1,
      playerMetrics: 1,
      video: 1,
      f1Driver: 1,
      f1Race: 1,
      f1Prediction: 1,
      footballTeam: 1,
      footballMatch: 1,
      footballPrediction: 1,
      footballTeamStat: 1
    };
    
    // Initialize with demo data - this is an async operation but we're not awaiting it
    // in the constructor since constructors can't be async
    this.initializeDemoData().catch(err => {
      console.error('Error initializing demo data:', err);
    });
  }
  
  private async initializeDemoData() {
    try {
      // Create a demo user
      const demoUser = await this.createUser({
        username: "demo",
        password: "password",
        fullName: "John Carter",
        role: "Head Scout",
        avatarUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
      });
      
      // Create some demo players
      const messi = await this.createPlayer({
        name: "Lionel Messi",
        age: 36,
        team: "Inter Miami CF",
        position: "Forward",
        description: "One of the greatest footballers of all time. Known for his exceptional dribbling skills, vision, and goalscoring ability.",
        avatarUrl: "/assets/player-images/messi.jpg",
        recruitmentMatch: 99
      });

      await this.createPlayerMetrics({
        playerId: messi.id,
        speed: 88,
        agility: 95,
        ballControl: 98,
        pace: 87,
        technique: 97,
        finishing: 94,
        passing: 96,
        vision: 95,
        stamina: 85,
        tackling: 48,
        strength: 72,
        positioning: 93
      });

      const haaland = await this.createPlayer({
        name: "Erling Haaland",
        age: 23,
        team: "Manchester City",
        position: "Forward",
        description: "Phenomenal striker with incredible speed, strength and finishing ability. Natural goalscorer with great positioning.",
        avatarUrl: "/assets/player-images/haaland.jpg",
        recruitmentMatch: 96
      });

      await this.createPlayerMetrics({
        playerId: haaland.id,
        speed: 92,
        agility: 85,
        ballControl: 86,
        pace: 90,
        technique: 85,
        finishing: 95,
        passing: 75,
        vision: 82,
        stamina: 88,
        tackling: 45,
        strength: 94,
        positioning: 92
      });

      const bellingham = await this.createPlayer({
        name: "Jude Bellingham",
        age: 20,
        team: "Real Madrid",
        position: "Midfielder",
        description: "Complete midfielder with exceptional technical ability and game intelligence. Natural leader with great potential.",
        avatarUrl: "/assets/player-images/bellingham.jpg",
        recruitmentMatch: 95
      });

      await this.createPlayerMetrics({
        playerId: bellingham.id,
        speed: 84,
        agility: 88,
        ballControl: 90,
        pace: 83,
        technique: 89,
        finishing: 82,
        passing: 88,
        vision: 87,
        stamina: 92,
        tackling: 85,
        strength: 86,
        positioning: 88
      });

      const mbappe = await this.createPlayer({
        name: "Kylian Mbappé",
        age: 25,
        team: "Paris Saint-Germain",
        position: "Forward",
        description: "Explosive forward with blistering pace and clinical finishing. Modern complete forward with great potential.",
        avatarUrl: "/assets/player-images/mbappe.jpg",
        recruitmentMatch: 97
      });

      await this.createPlayerMetrics({
        playerId: mbappe.id,
        speed: 97,
        agility: 93,
        ballControl: 89,
        pace: 96,
        technique: 90,
        finishing: 91,
        passing: 83,
        vision: 85,
        stamina: 88,
        tackling: 42,
        strength: 78,
        positioning: 90
      });
      
      // Add Cristiano Ronaldo as a player for Al Nassr
      const ronaldo = await this.createPlayer({
        name: "Cristiano Ronaldo",
        age: 40,
        team: "Al Nassr FC",
        position: "Forward",
        description: "One of the greatest footballers of all time. Known for his goalscoring ability, athleticism, and leadership on the field. Currently plays in the Roshn Saudi League for Al Nassr FC.",
        avatarUrl: "/assets/player-images/cristiano.jpg",
        recruitmentMatch: 98
      });
      
      await this.createPlayerMetrics({
        playerId: ronaldo.id,
        speed: 85,
        agility: 83,
        ballControl: 90,
        pace: 84,
        technique: 92,
        finishing: 95,
        passing: 83,
        vision: 87,
        stamina: 88,
        tackling: 52,
        strength: 88,
        positioning: 94
      });
      
      await this.createPlayer({
        name: "Sarah Williams",
        age: 24,
        team: "Chelsea FC",
        position: "Forward",
        description: "Exceptional speed and finishing ability. Excellent movement off the ball.",
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
        recruitmentMatch: 94
      });
      
      await this.createPlayer({
        name: "David Chen",
        age: 26,
        team: "Arsenal FC",
        position: "Midfielder",
        description: "Great vision and passing range. Controls the tempo of the game.",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
        recruitmentMatch: 91
      });
      
      await this.createPlayer({
        name: "Alex Morgan",
        age: 25,
        team: "Liverpool FC",
        position: "Defender",
        description: "Strong in the tackle with excellent positional awareness.",
        avatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
        recruitmentMatch: 89
      });
      
      // Create demo videos
      await this.createVideo({
        title: "Training_Session_June15.mp4",
        fileName: "Training_Session_June15.mp4",
        fileSize: 10200000, // 10.2 MB
        duration: 300, // 5 minutes
        playerId: 1,
        uploadedById: 1,
        status: "completed",
        analysisResults: { speed: 86, agility: 78, ballControl: 92 }
      });
      
      await this.createVideo({
        title: "Match_Highlights_FC_Barcelona.mp4",
        fileName: "Match_Highlights_FC_Barcelona.mp4",
        fileSize: 32700000, // 32.7 MB
        duration: 480, // 8 minutes
        playerId: 1,
        uploadedById: 1,
        status: "completed",
        analysisResults: { speed: 84, agility: 76, ballControl: 90 }
      });
      
      // Formula 1 drivers
      const f1Driver1 = await this.createF1Driver({
        name: "Max Verstappen",
        team: "Red Bull Racing",
        number: 1,
        avatarUrl: ""
      });
      
      const f1Driver2 = await this.createF1Driver({
        name: "Lewis Hamilton",
        team: "Mercedes",
        number: 44,
        avatarUrl: ""
      });
      
      const f1Driver3 = await this.createF1Driver({
        name: "Charles Leclerc",
        team: "Ferrari",
        number: 16,
        avatarUrl: ""
      });
      
      // Formula 1 races - 2025 season
      const monacoRace = await this.createF1Race({
        name: "Monaco Grand Prix",
        location: "Monte Carlo, Monaco",
        date: new Date(2025, 4, 24), // May 24, 2025
        status: "upcoming"
      });
      
      await this.createF1Race({
        name: "Saudi Arabian Grand Prix",
        location: "Jeddah, Saudi Arabia",
        date: new Date(2025, 3, 15), // April 15, 2025
        status: "upcoming"
      });
      
      await this.createF1Race({
        name: "Australian Grand Prix",
        location: "Melbourne, Australia",
        date: new Date(2025, 2, 23), // March 23, 2025
        status: "upcoming"
      });
      
      await this.createF1Race({
        name: "Spanish Grand Prix",
        location: "Barcelona, Spain",
        date: new Date(2025, 5, 8), // June 8, 2025
        status: "upcoming"
      });
      
      // Formula 1 predictions
      await this.createF1Prediction({
        raceId: monacoRace.id,
        driverId: f1Driver1.id,
        position: 1,
        winProbability: 68,
        factors: { 
          trackTemperature: "28°C", 
          weather: "Clear Skies", 
          tireStrategy: "Medium → Hard",
          trackType: "Street Circuit",
          downforceLevel: "Maximum",
          engineMode: "High Performance"
        }
      });
      
      await this.createF1Prediction({
        raceId: monacoRace.id,
        driverId: f1Driver2.id,
        position: 2,
        winProbability: 53,
        factors: { 
          trackTemperature: "28°C", 
          weather: "Clear Skies", 
          tireStrategy: "Soft → Medium",
          trackType: "Street Circuit",
          downforceLevel: "Maximum",
          engineMode: "Balanced"
        }
      });
      
      await this.createF1Prediction({
        raceId: monacoRace.id,
        driverId: f1Driver3.id,
        position: 3,
        winProbability: 42,
        factors: { 
          trackTemperature: "28°C", 
          weather: "Clear Skies", 
          tireStrategy: "Medium → Hard",
          trackType: "Street Circuit",
          downforceLevel: "High",
          engineMode: "Fuel Saving"
        }
      });
      
      // Premier League Teams
      const manCity = await this.createFootballTeam({
        name: "Manchester City",
        league: "Premier League",
        logoUrl: "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg"
      });
      
      const liverpool = await this.createFootballTeam({
        name: "Liverpool",
        league: "Premier League",
        logoUrl: "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg"
      });
      
      // Roshn Saudi League Teams
      const alHilal = await this.createFootballTeam({
        name: "Al Hilal",
        league: "Roshn Saudi League",
        logoUrl: "https://upload.wikimedia.org/wikipedia/en/a/a9/Al_Hilal_FC_logo.svg"
      });
      
      const alNassr = await this.createFootballTeam({
        name: "Al Nassr",
        league: "Roshn Saudi League",
        logoUrl: "https://upload.wikimedia.org/wikipedia/en/a/a0/Al_Nassr_FC.png"
      });
      
      const alAhli = await this.createFootballTeam({
        name: "Al Ahli",
        league: "Roshn Saudi League",
        logoUrl: "https://upload.wikimedia.org/wikipedia/en/e/eb/Al_Ahli_Saudi_FC_logo.png"
      });
      
      const alIttihad = await this.createFootballTeam({
        name: "Al Ittihad",
        league: "Roshn Saudi League",
        logoUrl: "https://upload.wikimedia.org/wikipedia/en/2/24/Ittihad_FC.png"
      });
      
      // Premier League Matches
      const premierLeagueMatch = await this.createFootballMatch({
        homeTeamId: manCity.id,
        awayTeamId: liverpool.id,
        date: new Date(2025, 3, 12), // April 12, 2025
        status: "upcoming",
        homeScore: null,
        awayScore: null
      });
      
      // Roshn Saudi League Matches for 2025
      const saudiMatch1 = await this.createFootballMatch({
        homeTeamId: alHilal.id,
        awayTeamId: alNassr.id,
        date: new Date(2025, 2, 15), // March 15, 2025
        status: "upcoming",
        homeScore: null,
        awayScore: null
      });
      
      const saudiMatch2 = await this.createFootballMatch({
        homeTeamId: alAhli.id,
        awayTeamId: alIttihad.id,
        date: new Date(2025, 3, 5), // April 5, 2025
        status: "upcoming",
        homeScore: null,
        awayScore: null
      });
      
      const saudiMatch3 = await this.createFootballMatch({
        homeTeamId: alNassr.id,
        awayTeamId: alAhli.id,
        date: new Date(2025, 4, 20), // May 20, 2025
        status: "upcoming",
        homeScore: null,
        awayScore: null
      });
      
      const saudiMatch4 = await this.createFootballMatch({
        homeTeamId: alIttihad.id,
        awayTeamId: alHilal.id,
        date: new Date(2025, 5, 10), // June 10, 2025
        status: "upcoming",
        homeScore: null,
        awayScore: null
      });
      
      // Football predictions
      await this.createFootballPrediction({
        matchId: premierLeagueMatch.id,
        predictedHomeScore: 3,
        predictedAwayScore: 1,
        winProbability: 62,
        drawProbability: 26,
        lossProbability: 12,
        confidence: 87,
        stats: { 
          possession: [58, 42], 
          expectedGoals: [2.4, 1.1], 
          shotsOnTarget: [7, 4]
        }
      });
      
      // Saudi League Predictions
      await this.createFootballPrediction({
        matchId: saudiMatch1.id,
        predictedHomeScore: 2,
        predictedAwayScore: 2,
        winProbability: 38,
        drawProbability: 40,
        lossProbability: 22,
        confidence: 75,
        stats: { 
          possession: [45, 55], 
          expectedGoals: [1.8, 2.0], 
          shotsOnTarget: [5, 6]
        }
      });
      
      await this.createFootballPrediction({
        matchId: saudiMatch2.id,
        predictedHomeScore: 1,
        predictedAwayScore: 3,
        winProbability: 28,
        drawProbability: 25,
        lossProbability: 47,
        confidence: 82,
        stats: { 
          possession: [40, 60], 
          expectedGoals: [1.2, 2.6], 
          shotsOnTarget: [4, 8]
        }
      });
      
      // League winning predictions (Saudi League)
      // Create team stats for Saudi League teams
      console.log('Creating team stats for Saudi League teams...');
      
      // Debug logging
      console.log('Team IDs:', {
        alHilal: alHilal.id,
        alNassr: alNassr.id, 
        alAhli: alAhli.id,
        alIttihad: alIttihad.id
      });
      
      // Al Hilal team stats
      const hilalStats = await this.createFootballTeamStat(alHilal.id, {
        leaguePosition: 1,
        winProbability: 45,
        form: "WWDWW",
        goalDifference: 28,
        points: 72,
        recentResults: [
          { opponent: "Al Nassr", result: "W", score: "3-1" },
          { opponent: "Al Ahli", result: "W", score: "2-0" },
          { opponent: "Al Ittihad", result: "D", score: "1-1" },
          { opponent: "Al Shabab", result: "W", score: "3-0" },
          { opponent: "Al Taawoun", result: "W", score: "2-1" }
        ]
      });
      console.log('Al Hilal stats created:', hilalStats);
      
      // Al Nassr team stats
      const nassrStats = await this.createFootballTeamStat(alNassr.id, {
        leaguePosition: 2,
        winProbability: 30,
        form: "WLWWW",
        goalDifference: 22,
        points: 68,
        recentResults: [
          { opponent: "Al Hilal", result: "L", score: "1-3" },
          { opponent: "Al Ahli", result: "W", score: "2-1" },
          { opponent: "Al Ittihad", result: "W", score: "3-0" },
          { opponent: "Al Shabab", result: "W", score: "2-1" },
          { opponent: "Al Taawoun", result: "W", score: "3-2" }
        ]
      });
      console.log('Al Nassr stats created:', nassrStats);
      
      // Al Ahli team stats
      const ahliStats = await this.createFootballTeamStat(alAhli.id, {
        leaguePosition: 3,
        winProbability: 15,
        form: "LWWLD",
        goalDifference: 18,
        points: 61,
        recentResults: [
          { opponent: "Al Hilal", result: "L", score: "0-2" },
          { opponent: "Al Nassr", result: "L", score: "1-2" },
          { opponent: "Al Ittihad", result: "W", score: "2-1" },
          { opponent: "Al Shabab", result: "W", score: "2-0" },
          { opponent: "Al Taawoun", result: "D", score: "1-1" }
        ]
      });
      console.log('Al Ahli stats created:', ahliStats);
      
      // Al Ittihad team stats
      const ittihadStats = await this.createFootballTeamStat(alIttihad.id, {
        leaguePosition: 4,
        winProbability: 10,
        form: "WDLWW",
        goalDifference: 15,
        points: 58,
        recentResults: [
          { opponent: "Al Hilal", result: "D", score: "1-1" },
          { opponent: "Al Nassr", result: "L", score: "0-3" },
          { opponent: "Al Ahli", result: "L", score: "1-2" },
          { opponent: "Al Shabab", result: "W", score: "2-0" },
          { opponent: "Al Taawoun", result: "W", score: "2-1" }
        ]
      });
      console.log('Al Ittihad stats created:', ittihadStats);
    } catch (error) {
      console.error('Error in initializeDemoData:', error);
      throw error;
    }
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentIds.user++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Player operations
  async getPlayer(id: number): Promise<Player | undefined> {
    return this.players.get(id);
  }
  
  async getPlayers(): Promise<Player[]> {
    return Array.from(this.players.values());
  }
  
  async getTopPlayers(limit: number): Promise<(Player & { metrics: PlayerMetrics | null })[]> {
    const players = Array.from(this.players.values())
      .sort((a, b) => (b.recruitmentMatch || 0) - (a.recruitmentMatch || 0))
      .slice(0, limit);
      
    return Promise.all(players.map(async (player) => {
      const metrics = await this.getPlayerMetrics(player.id);
      return { ...player, metrics: metrics || null };
    }));
  }
  
  async createPlayer(player: InsertPlayer): Promise<Player> {
    const id = this.currentIds.player++;
    const timestamp = new Date();
    const newPlayer: Player = { ...player, id, createdAt: timestamp };
    this.players.set(id, newPlayer);
    return newPlayer;
  }
  
  async updatePlayer(id: number, player: Partial<InsertPlayer>): Promise<Player | undefined> {
    const existingPlayer = this.players.get(id);
    if (!existingPlayer) return undefined;
    
    const updatedPlayer = { ...existingPlayer, ...player };
    this.players.set(id, updatedPlayer);
    return updatedPlayer;
  }
  
  // Player metrics operations
  async getPlayerMetrics(playerId: number): Promise<PlayerMetrics | undefined> {
    return Array.from(this.playerMetrics.values()).find(
      (metrics) => metrics.playerId === playerId,
    );
  }
  
  async createPlayerMetrics(metrics: InsertPlayerMetrics): Promise<PlayerMetrics> {
    const id = this.currentIds.playerMetrics++;
    const timestamp = new Date();
    const newMetrics: PlayerMetrics = { ...metrics, id, createdAt: timestamp };
    this.playerMetrics.set(id, newMetrics);
    return newMetrics;
  }
  
  async updatePlayerMetrics(id: number, metrics: Partial<InsertPlayerMetrics>): Promise<PlayerMetrics | undefined> {
    const existingMetrics = this.playerMetrics.get(id);
    if (!existingMetrics) return undefined;
    
    const updatedMetrics = { ...existingMetrics, ...metrics };
    this.playerMetrics.set(id, updatedMetrics);
    return updatedMetrics;
  }
  
  // Video operations
  async getVideo(id: number): Promise<Video | undefined> {
    return this.videos.get(id);
  }
  
  async getVideosByPlayer(playerId: number): Promise<Video[]> {
    return Array.from(this.videos.values())
      .filter((video) => video.playerId === playerId);
  }
  
  async getRecentVideos(limit: number): Promise<Video[]> {
    return Array.from(this.videos.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }
  
  async createVideo(video: InsertVideo): Promise<Video> {
    const id = this.currentIds.video++;
    const timestamp = new Date();
    const newVideo: Video = { ...video, id, createdAt: timestamp };
    this.videos.set(id, newVideo);
    return newVideo;
  }
  
  async updateVideo(id: number, video: Partial<InsertVideo>): Promise<Video | undefined> {
    const existingVideo = this.videos.get(id);
    if (!existingVideo) return undefined;
    
    const updatedVideo = { ...existingVideo, ...video };
    this.videos.set(id, updatedVideo);
    return updatedVideo;
  }
  
  async deleteVideo(id: number): Promise<boolean> {
    return this.videos.delete(id);
  }
  
  // Formula 1 operations
  async getF1Driver(id: number): Promise<F1Driver | undefined> {
    return this.f1Drivers.get(id);
  }
  
  async getF1Drivers(): Promise<F1Driver[]> {
    return Array.from(this.f1Drivers.values());
  }
  
  async createF1Driver(driver: InsertF1Driver): Promise<F1Driver> {
    const id = this.currentIds.f1Driver++;
    const newDriver: F1Driver = { ...driver, id };
    this.f1Drivers.set(id, newDriver);
    return newDriver;
  }
  
  async getF1Race(id: number): Promise<F1Race | undefined> {
    return this.f1Races.get(id);
  }
  
  async getUpcomingF1Races(): Promise<F1Race[]> {
    return Array.from(this.f1Races.values())
      .filter((race) => race.status === "upcoming")
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }
  
  async createF1Race(race: InsertF1Race): Promise<F1Race> {
    const id = this.currentIds.f1Race++;
    const newRace: F1Race = { ...race, id };
    this.f1Races.set(id, newRace);
    return newRace;
  }
  
  async getF1Predictions(raceId: number): Promise<(F1Prediction & { driver: F1Driver })[]> {
    const predictions = Array.from(this.f1Predictions.values())
      .filter((prediction) => prediction.raceId === raceId)
      .sort((a, b) => a.position - b.position);
      
    return Promise.all(predictions.map(async (prediction) => {
      const driver = await this.getF1Driver(prediction.driverId);
      return { ...prediction, driver: driver! };
    }));
  }
  
  async createF1Prediction(prediction: InsertF1Prediction): Promise<F1Prediction> {
    const id = this.currentIds.f1Prediction++;
    const timestamp = new Date();
    const newPrediction: F1Prediction = { ...prediction, id, createdAt: timestamp };
    this.f1Predictions.set(id, newPrediction);
    return newPrediction;
  }
  
  // Football operations
  async getFootballTeam(id: number): Promise<FootballTeam | undefined> {
    return this.footballTeams.get(id);
  }
  
  async getFootballTeams(): Promise<FootballTeam[]> {
    return Array.from(this.footballTeams.values());
  }
  
  async createFootballTeam(team: InsertFootballTeam): Promise<FootballTeam> {
    const id = this.currentIds.footballTeam++;
    const newTeam: FootballTeam = { ...team, id };
    this.footballTeams.set(id, newTeam);
    return newTeam;
  }
  
  async getFootballMatch(id: number): Promise<FootballMatch | undefined> {
    return this.footballMatches.get(id);
  }
  
  async getUpcomingFootballMatches(): Promise<FootballMatch[]> {
    return Array.from(this.footballMatches.values())
      .filter((match) => match.status === "upcoming")
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }
  
  async createFootballMatch(match: InsertFootballMatch): Promise<FootballMatch> {
    const id = this.currentIds.footballMatch++;
    const newMatch: FootballMatch = { ...match, id };
    this.footballMatches.set(id, newMatch);
    return newMatch;
  }
  
  async getFootballPrediction(matchId: number): Promise<FootballPrediction | undefined> {
    return Array.from(this.footballPredictions.values()).find(
      (prediction) => prediction.matchId === matchId,
    );
  }
  
  async createFootballPrediction(prediction: InsertFootballPrediction): Promise<FootballPrediction> {
    const id = this.currentIds.footballPrediction++;
    const timestamp = new Date();
    const newPrediction: FootballPrediction = { ...prediction, id, createdAt: timestamp };
    this.footballPredictions.set(id, newPrediction);
    return newPrediction;
  }
  
  // Football team stats operations
  async getFootballTeamStat(teamId: number): Promise<FootballTeamStat | undefined> {
    return Array.from(this.footballTeamStats.values()).find(
      (stat) => stat.teamId === teamId
    );
  }
  
  async getFootballTeamStats(league?: string): Promise<FootballTeamStat[]> {
    let stats = Array.from(this.footballTeamStats.values())
      .sort((a, b) => a.leaguePosition - b.leaguePosition);
      
    if (league) {
      // Get IDs of teams in the specified league
      const teamsInLeague = Array.from(this.footballTeams.values())
        .filter(team => team.league === league)
        .map(team => team.id);
      
      // Only include stats for teams in the specified league
      stats = stats.filter(stat => teamsInLeague.includes(stat.teamId));
      
      // For debugging
      console.log(`Teams in league "${league}":`, teamsInLeague);
      console.log(`Filtered stats:`, stats.map(s => s.teamId));
    }
    
    return stats;
  }
  
  async createFootballTeamStat(teamId: number, stat: Omit<InsertFootballTeamStat, 'teamId'>): Promise<FootballTeamStat> {
    const id = this.currentIds.footballTeamStat++;
    const timestamp = new Date();
    const newStat: FootballTeamStat = { ...stat, id, teamId, createdAt: timestamp };
    this.footballTeamStats.set(id, newStat);
    return newStat;
  }
}

export const storage = new MemStorage();
