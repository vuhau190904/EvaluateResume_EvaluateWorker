import { Worker } from 'bullmq';
import dotenv from 'dotenv';
import redisClient from '../database/redis.js';
import prisma from '../database/prisma.js';
import geminiService from './geminiService.js';
import Constant from '../util/constant.js';
import prompt from '../util/prompt.js';
import { LayoutSchema, ResumeSchema, JobDescriptionSchema, EvaluationSchema } from '../util/structureOutput.js';

dotenv.config();

class EvaluateService {
  constructor() {
    this.worker = null;
    this.queueName = process.env.EVALUATE_QUEUE_NAME || 'evaluate';
    this.evaluationChannel = process.env.EVALUATION_CHANNEL || 'evaluation';
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
    console.log('🔄 Processing job:', job.data);
    const { resumeId, resumeText, jobDescription } = job.data;

    try {
      const cvStandardized = await geminiService.extractData(prompt.prompt_standardize_cv(resumeText), ResumeSchema);
      const jdStandardized = await geminiService.extractData(prompt.prompt_standardize_jd(jobDescription), JobDescriptionSchema);
      const evaluationResult = await geminiService.extractData(prompt.prompt_evaluate_resume(cvStandardized, jdStandardized), EvaluationSchema);
      const layoutResult = await geminiService.evaluateLayout(resumeId, prompt.prompt_evaluate_layout(), LayoutSchema);
      const evaluate_result = {
        cvStandardized,
        jdStandardized,
        evaluationResult,
        layoutResult
      };

      console.log('🔄 Evaluate result:', evaluate_result);

      await prisma.resumes.update({
        where: { id: resumeId },
        data: { evaluation_result: evaluate_result, status: Constant.COMPLETED }
      });

      await redisClient.client.publish(this.evaluationChannel, JSON.stringify(resumeId));

      return evaluate_result;

    } catch (error) {
      await this.handleError(resumeId, error);
      throw error;
    }
  }

  async handleError(resumeId, error) {
    console.error(`[Worker] ❌ Error processing resume ${resumeId}:`, error);
    try {
      await prisma.resumes.update({
        where: { id: resumeId },
        data: {
          status: Constant.FAILED,
          evaluation_result: {
            error: error.message,
          },
        },
      });
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

const evaluateService = new EvaluateService();

export default evaluateService;
