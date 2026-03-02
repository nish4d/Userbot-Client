import { Db, Collection } from 'mongodb';
import { Rule, BlacklistEntry, Activity } from '../types';

export class RuleModel {
  private collection: Collection<Rule>;

  constructor(db: Db) {
    this.collection = db.collection<Rule>('rules');
  }

  async getAll(): Promise<Rule[]> {
    try {
      const rules = await this.collection.find({}).toArray();
      return rules;
    } catch (error) {
      console.error('[RuleModel] Error fetching rules:', error);
      throw error;
    }
  }

  async getById(id: string): Promise<Rule | null> {
    try {
      const rule = await this.collection.findOne({ id });
      return rule;
    } catch (error) {
      console.error(`[RuleModel] Error fetching rule ${id}:`, error);
      throw error;
    }
  }

  async create(rule: Omit<Rule, 'id' | 'createdAt' | 'updatedAt'>): Promise<Rule> {
    try {
      const now = new Date();
      // Ensure backward compatibility by setting trigger field if not provided
      const ruleWithTrigger = {
        trigger: null,
        ...rule,
        id: Date.now().toString(),
        createdAt: now,
        updatedAt: now,
      };
      
      await this.collection.insertOne(ruleWithTrigger);
      return ruleWithTrigger;
    } catch (error) {
      console.error('[RuleModel] Error creating rule:', error);
      throw error;
    }
  }

  async update(id: string, updates: Partial<Omit<Rule, 'id' | 'createdAt'>>): Promise<Rule | null> {
    try {
      const result = await this.collection.findOneAndUpdate(
        { id },
        { 
          $set: { 
            ...updates, 
            updatedAt: new Date() 
          } 
        },
        { returnDocument: 'after' }
      );
      
      return result;
    } catch (error) {
      console.error(`[RuleModel] Error updating rule ${id}:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.collection.deleteOne({ id });
      return result.deletedCount === 1;
    } catch (error) {
      console.error(`[RuleModel] Error deleting rule ${id}:`, error);
      throw error;
    }
  }
}

export class BlacklistModel {
  private collection: Collection<BlacklistEntry>;

  constructor(db: Db) {
    this.collection = db.collection<BlacklistEntry>('blacklist');
  }

  async getAll(): Promise<BlacklistEntry[]> {
    try {
      const entries = await this.collection.find({}).toArray();
      return entries;
    } catch (error) {
      console.error('[BlacklistModel] Error fetching blacklist:', error);
      throw error;
    }
  }

  async getByUserId(userId: number): Promise<BlacklistEntry | null> {
    try {
      const entry = await this.collection.findOne({ userId });
      return entry;
    } catch (error) {
      console.error(`[BlacklistModel] Error fetching blacklist entry for user ${userId}:`, error);
      throw error;
    }
  }

  async getById(id: string): Promise<BlacklistEntry | null> {
    try {
      const entry = await this.collection.findOne({ id });
      return entry;
    } catch (error) {
      console.error(`[BlacklistModel] Error fetching blacklist entry ${id}:`, error);
      throw error;
    }
  }

  async create(entry: Omit<BlacklistEntry, 'id' | 'addedAt'>): Promise<BlacklistEntry> {
    try {
      const newEntry: BlacklistEntry = {
        id: Date.now().toString(),
        ...entry,
        addedAt: new Date(),
      };
      
      await this.collection.insertOne(newEntry);
      return newEntry;
    } catch (error) {
      console.error('[BlacklistModel] Error creating blacklist entry:', error);
      throw error;
    }
  }

  async deleteById(id: string): Promise<boolean> {
    try {
      const result = await this.collection.deleteOne({ id });
      return result.deletedCount === 1;
    } catch (error) {
      console.error(`[BlacklistModel] Error deleting blacklist entry ${id}:`, error);
      throw error;
    }
  }

  async deleteByUserId(userId: number): Promise<boolean> {
    try {
      const result = await this.collection.deleteOne({ userId });
      return result.deletedCount === 1;
    } catch (error) {
      console.error(`[BlacklistModel] Error deleting blacklist entry for user ${userId}:`, error);
      throw error;
    }
  }
}

export class ActivityModel {
  private collection: Collection<Activity>;

  constructor(db: Db) {
    this.collection = db.collection<Activity>('activities');
  }

  async getAll(): Promise<Activity[]> {
    try {
      const activities = await this.collection.find({}).sort({ timestamp: -1 }).toArray();
      return activities;
    } catch (error) {
      console.error('[ActivityModel] Error fetching activities:', error);
      throw error;
    }
  }

  async getRecent(limit: number = 10): Promise<Activity[]> {
    try {
      const activities = await this.collection
        .find({})
        .sort({ timestamp: -1 })
        .limit(limit)
        .toArray();
      return activities;
    } catch (error) {
      console.error('[ActivityModel] Error fetching recent activities:', error);
      throw error;
    }
  }

  async create(activity: Omit<Activity, 'id'>): Promise<Activity> {
    try {
      const newActivity: Activity = {
        id: Date.now().toString(),
        ...activity,
        timestamp: new Date(),
      };
      
      await this.collection.insertOne(newActivity);
      return newActivity;
    } catch (error) {
      console.error('[ActivityModel] Error creating activity:', error);
      throw error;
    }
  }

  async getByDateRange(startDate: Date, endDate: Date): Promise<Activity[]> {
    try {
      const activities = await this.collection
        .find({
          timestamp: {
            $gte: startDate,
            $lte: endDate
          }
        })
        .sort({ timestamp: -1 })
        .toArray();
      return activities;
    } catch (error) {
      console.error('[ActivityModel] Error fetching activities by date range:', error);
      throw error;
    }
  }
}