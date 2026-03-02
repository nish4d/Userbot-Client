#!/usr/bin/env node

/**
 * Script to initialize the database with sample data
 * Run with: npm run init-db
 */

// Load environment variables
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

import { dbConnection } from '../db';
import { RuleModel, BlacklistModel, ActivityModel } from '../db';

async function initDatabase() {
  try {
    console.log('Connecting to database...');
    const db = await dbConnection.connect();
    
    // Create models
    const ruleModel = new RuleModel(db);
    const blacklistModel = new BlacklistModel(db);
    const activityModel = new ActivityModel(db);
    
    // Insert sample rules
    const sampleRules = [
      {
        triggers: ['hello', 'hi', 'hey'],
        response: 'Hi there! How can I help you today?',
        enabled: true,
      },
      {
        triggers: ['help', 'support'],
        response: 'I can help you with various tasks. Try asking me about the weather, news, or just say hello!',
        enabled: true,
      },
      {
        triggers: [],
        response: 'Thanks for your message! I\'ll get back to you soon.',
        enabled: false,
      }
    ];
    
    console.log('Inserting sample rules...');
    for (const rule of sampleRules) {
      await ruleModel.create(rule);
    }
    
    // Insert sample blacklist entries
    const sampleBlacklist = [
      {
        userId: 123456789,
        username: 'spam_bot_1',
      },
      {
        userId: 987654321,
        username: 'annoying_user',
      }
    ];
    
    console.log('Inserting sample blacklist entries...');
    for (const entry of sampleBlacklist) {
      await blacklistModel.create(entry);
    }
    
    // Insert sample activities
    const now = new Date();
    const sampleActivities = [
      {
        type: 'message' as const,
        description: 'Received message from user',
        timestamp: new Date(now.getTime() - 3600000), // 1 hour ago
        userId: 111111111,
        metadata: { message: 'Hello there!' }
      },
      {
        type: 'reply' as const,
        description: 'Sent automated reply',
        timestamp: new Date(now.getTime() - 3590000), // 59 minutes ago
        userId: 111111111,
        metadata: { trigger: 'hello', response: 'Hi there! How can I help you today?' }
      },
      {
        type: 'block' as const,
        description: 'Blocked spam user',
        timestamp: new Date(now.getTime() - 86400000), // 1 day ago
        userId: 123456789,
      }
    ];
    
    console.log('Inserting sample activities...');
    for (const activity of sampleActivities) {
      await activityModel.create(activity);
    }
    
    console.log('Database initialization completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

// Run the initialization
if (require.main === module) {
  initDatabase();
}