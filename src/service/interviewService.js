import { Worker } from 'bullmq';
import dotenv from 'dotenv';
import redisClient from '../database/redis.js';
import prisma from '../database/prisma.js';
import geminiService from './geminiService.js';
import prompt from '../util/prompt.js';
import { QuestionSchema, InterviewFeedbackSchema } from "../util/structureOutput.js";
import { v4 as uuidv4 } from 'uuid';
dotenv.config();

class InterviewService {
  constructor() {
    this.worker = null;
    this.queueName = process.env.INTERVIEW_QUEUE_NAME || 'interview';
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
    console.log('Processing job:', job.data);
    const { resumeId, start } = job.data;
    if(start === true) {
        const resume = await prisma.resumes.findUnique({
        where: { id: resumeId },
        });
        console.log('Resume:', resume);
        if (!resume) {
        throw new Error('Resume not found');
        }
        const response = await geminiService.extractData(prompt.prompt_generate_questions(resume.content), QuestionSchema);
        const questions = response.questions;
        console.log('Questions:', questions);
        if (!questions) {
        throw new Error('Questions not found');
        }
        const interviewQuestions = questions.map((question, index) => ({
            id: uuidv4(),
            resumeId: resumeId,
            question: question,
            user_response: null,
            order: index + 1,
        }));
        console.log('Interview Questions:', interviewQuestions);
        await prisma.interview.createMany({
            data: interviewQuestions
        });
    } else {
       const interview = await prisma.interview.findMany({
          where: {
              resumeId: resumeId,
              user_response: {
                  not: null
              }
          }
       });
       console.log('Interview:', interview);
       const interviewQuestions = interview.map((question) => ({
        question: question.question,
        user_response: question.user_response,
       }));
       console.log('Interview Questions:', interviewQuestions);
       const response = await geminiService.extractData(prompt.prompt_evaluate_interview(interviewQuestions), InterviewFeedbackSchema);
       await prisma.resumes.update({
        where: {
            id: resumeId
        },
        data: {
            interview_result: response
        }
       });
       
    }
  }

  async close() {
    if (this.worker) {
      await this.worker.close();
      console.log('✅ Worker closed');
    }
  }
}

const interviewService = new InterviewService();

export default interviewService;
