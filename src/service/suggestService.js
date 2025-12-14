import { Worker } from 'bullmq';
import dotenv from 'dotenv';
import redisClient from '../database/redis.js';
import prisma from '../database/prisma.js';
import tavilyService from './tavilyService.js';
import Constant from '../util/constant.js';

dotenv.config();

class SuggestService {
  constructor() {
    this.worker = null;
    this.queueName = process.env.SUGGEST_QUEUE_NAME || 'suggest';
  }

  async start() {
    try {
      this.worker = new Worker(
        this.queueName,
        async (job) => await this.processJob(job),
        {
          connection: redisClient,
          concurrency: parseInt(process.env.WORKER_CONCURRENCY || '1'),
        }
      );

      console.log(`✅ Worker started for queue: ${this.queueName}`);
    } catch (error) {
      console.error('❌ Failed to start worker:', error);
      throw error;
    }
  }

  async processJob(job) {
    const { searchId } = job.data;
    
    try {
      console.log('🔄 Processing job:', job.data);
      
      // Validate searchId
      if (!searchId) {
        throw new Error('searchId is required in job data');
      }

      const search = await prisma.search.findUnique({
        where: { id: searchId },
      });
      
      
      if (!search) {
        throw new Error(`Search with id ${searchId} not found`);
      }

      if (!search.search_input) {
        throw new Error('Search input is missing');
      }

      const search_result = await tavilyService.suggestJD(search.search_input);
      console.log('🔄 Search Result:', search_result);
      
      await prisma.search.update({
        where: { id: searchId },
        data: { 
          search_result: search_result, 
          status: Constant.COMPLETED 
        },
      });
      
      console.log(`✅ Successfully updated search ${searchId}`);
      
    } catch (error) {
      console.error(`❌ Error processing search ${searchId}:`, error);
      if (searchId) {
        await this.handleError(searchId, error);
      }
      throw error;
    }
  }

  async handleError(searchId, error) {
    if (!searchId) {
      console.error('❌ Cannot handle error: searchId is missing');
      return;
    }

    try {
      await prisma.search.update({
        where: { id: searchId },
        data: {
          status: Constant.FAILED,
          search_result: {
            error: error.message,
            failedAt: new Date().toISOString(),
          },
        },
      });
      console.log(`📝 Updated search ${searchId} status to FAILED`);
    } catch (dbError) {
      console.error(`[Worker] ❌ Failed to update error status:`, dbError);
    }
  }

  async close() {
    if (this.worker) {
      await this.worker.close();
      console.log('✅ Worker closed');
    }
  }
}

const suggestService = new SuggestService();

export default suggestService;
