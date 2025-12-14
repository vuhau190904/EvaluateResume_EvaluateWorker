import dotenv from 'dotenv';
import { connectDatabase, disconnectDatabase } from './database/prisma.js';
import redisClient from './database/redis.js';
import evaluateService from './service/evaluateService.js';
import suggestService from './service/suggestService.js';
dotenv.config();

async function start() {
  try {
    console.log('🚀 Starting Resume Evaluation Worker...');
    
    await connectDatabase();
    await redisClient.connect();
    await evaluateService.start();
    await suggestService.start();
    
    console.log('✅ Worker is running');
    console.log('🔄 Waiting for jobs...\n');

  } catch (error) {
    console.error('❌ Failed to start:', error);
    process.exit(1);
  }
}

async function shutdown() {
  console.log('\n🛑 Shutting down...');
  try {
    await evaluateService.close();
    await disconnectDatabase();
    console.log('✅ Shutdown completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Shutdown error:', error);
    process.exit(1);
  }
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

start();
