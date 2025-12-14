import { tavily } from "@tavily/core";
import geminiService from "./geminiService.js";
import prompt from "../util/prompt.js";
import { searchOptimizeOutputSchema, ListJobSchema } from "../util/structureOutput.js";
import dotenv from "dotenv";

dotenv.config();

class TavilyService {
    constructor() {
        this.apiKey = process.env.TAVILY_API_KEY;
        this.client = new tavily({
            apiKey: this.apiKey,
        });
        this.TRUSTED_JOB_DOMAINS = [
            "linkedin.com",
            "itviec.com",
            "topdev.vn",
            "vietnamworks.com",
            "glints.com",
            "careerbuilder.vn",
            "topcv.vn",
            "indeed.com",
            "glassdoor.com",
            "jobstreet.vn"
        ];
    }

    async suggestJD(input) {
        const optimizeResult = await geminiService.extractData(
            prompt.prompt_search_optimize(input), 
            searchOptimizeOutputSchema
        );
        const optimizedQuery = optimizeResult.search_optimize; 

        const response = await this.client.search(optimizedQuery, {
            search_depth: "advanced",
            include_domains: this.TRUSTED_JOB_DOMAINS,
            max_results: 10, // Tăng số lượng để có nhiều kết quả hơn
            days: 60 
        });
        
        
        // Format data để dễ extract hơn
        const formattedResults = response.results.map((result, index) => ({
            index: index + 1,
            title: result.title || 'No title',
            url: result.url || '',
            content: result.content || '',
            score: result.score || 0,
        }));
        
        const rawData = JSON.stringify(formattedResults, null, 2);
        
        const jobSuggestions = await geminiService.extractData(
            prompt.prompt_suggest_jd(rawData), 
            ListJobSchema 
        );
        
        return jobSuggestions.jobs || [];
    }
}

const tavilyService = new TavilyService();
export default tavilyService;