import { MongoClient, Db } from 'mongodb';
import { config } from '../config';

class DatabaseConnection {
  private static instance: DatabaseConnection;
  private client: MongoClient | null = null;
  private db: Db | null = null;

  private constructor() {}

  static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  async connect(): Promise<Db> {
    if (this.db) {
      return this.db;
    }

    if (!config.db.url) {
      throw new Error('MONGODB_URL environment variable is not set');
    }

    try {
      this.client = new MongoClient(config.db.url);
      await this.client.connect();
      this.db = this.client.db(); // Uses database name from connection string
      console.log('[DB] Connected to MongoDB successfully');
      return this.db;
    } catch (error) {
      console.error('[DB] Failed to connect to MongoDB:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
      console.log('[DB] Disconnected from MongoDB');
    }
  }

  getDb(): Db | null {
    return this.db;
  }
}

export const dbConnection = DatabaseConnection.getInstance();