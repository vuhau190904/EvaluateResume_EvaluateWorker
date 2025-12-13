class Prompt  {
    constructor() {}
    prompt_standardize_cv(cv) {
        return `
            You are an expert Resume Parser. Your goal is to extract data from the input text and strictly output valid JSON in **ENGLISH**.

            ### CRITICAL INSTRUCTION - FORCE ENGLISH OUTPUT:
            1. **TRANSLATE EVERYTHING**: All extracted content (Job Titles, Descriptions, Skills, Majors, Objectives, etc.) MUST be translated into professional English.
            2. **NO NON-ENGLISH CHARACTERS**: Do not include Vietnamese or other non-English characters in the output values (except for proper names of people).
            3. **PROPER NOUNS**:
            - Keep Candidate Names as is (e.g., "Nguyen Van A").
            - Translate University/Company names if they have a common English equivalent (e.g., "Đại học Bách Khoa" -> "Ho Chi Minh City University of Technology"). If not, keep the original but translate the context.

            ### FORMATTING RULES:
            - Output **ONLY** raw JSON. No markdown formatting (no \`\`\`json). No introductory text.
            - If a field is missing in the text, return \`null\` (for strings) or \`[]\` (for arrays).
            - **Intelligent Parsing**: 
                - Break long paragraphs into bullet points for \`details\` and \`description\` arrays.
                - Classify skills strictly into \`technical\`, \`soft\`, and \`languages\`.

            ### TARGET JSON STRUCTURE:
            {
            "personal_info": {
                "name": "Full Name",
                "email": "Email",
                "phone": "Phone",
                "location": "Address",
                "desired_job": "Job Title (In English)",
                "objective": ["Objective 1 (In English)", "Objective 2 (In English)"]
            },
            "education": [
                {
                "degree": "Degree (e.g., Bachelor of IT)",
                "institution": "School Name (English Name)",
                "field": "Major (In English)",
                "duration": "Year-Year",
                "gpa": "Score",
                "details": ["Detail 1 (In English)", "Detail 2 (In English)"]
                }
            ],
            "work_experience": [
                {
                "position": "Job Title (In English)",
                "company": "Company Name",
                "duration": "Time Period",
                "description": ["Task 1 (Translated)", "Achievement 1 (Translated)"]
                }
            ],
            "skills": {
                "technical": ["Tech Skill 1", "Tech Skill 2"],
                "soft": ["Soft Skill 1 (Translated)", "Soft Skill 2 (Translated)"],
                "languages": ["Language Name (In English)"]
            },
            "projects": [
                {
                "name": "Project Name",
                "link": "URL",
                "description": "Description (Translated)",
                "technologies": ["Tech 1", "Tech 2"],
                "main_tasks": ["Task 1 (Translated)", "Task 2 (Translated)"]
                }
            ],
            "awards": ["Award Name (Translated)"],
            "certificates": [
                {
                "name": "Certificate Name (Translated)",
                "issuer": "Issuer",
                "date": "Date"
                }
            ]
            }

            ### INPUT RESUME TEXT:
            "${cv}"
        `;
    }

    prompt_standardize_jd(jobDescription) {
        return `
            As a top-tier job description analysis expert, your task is to extract and standardize all important information from the job description below, and convert it into a well-structured JSON object in the required format for easy parsing.

            ### INSTRUCTIONS:
            - The job description can be in any language. If it is not in English, first translate all information into English to ensure the JSON output is fully in English.
            - Parse, organize, and summarize information into the target JSON. If any section or value from the format is missing in the original description, keep it as an empty string, empty array, or best-effort placeholder.
            - All string fields must be in English.
            
            ### IMPORTANT OUTPUT RULES:
            - DO NOT write any explanation, greeting, or summary.
            - DO NOT include code blocks (such as \`\`\`json).
            - ONLY return the pure JSON object, nothing else.

            ### JOB DESCRIPTION TO ANALYZE:
            "${jobDescription}"

            ### OUTPUT FORMAT:
            {
                "job_info": {
                    "title": "Job Title (English, e.g. Software Engineer)",
                    "department": "Department Name (English)",
                    "level": "Level (English, e.g. Junior, Mid, Senior, Lead)",
                    "employment_type": "Employment Type (e.g. Full-time, Part-time, Internship)",
                    "location": "Location (English)"
                },
                "requirements": {
                    "education": {
                        "degree": "Degree required (English)",
                        "field": "Field of study (English)",
                        "importance": "Importance level (1-10, number only)"
                    },
                    "experience": {
                        "years": "Years of experience required (number only, e.g. 2, 5)",
                        "specific_domains": ["Domain 1 (English)", "Domain 2 (English)"],
                        "importance": "Importance level (1-10, number only)"
                    },
                    "technical_skills": [
                        {
                            "name": "Technical skill (English)",
                            "level": "Required proficiency (Beginner/Intermediate/Advanced/Expert)",
                            "importance": "Importance level (1-10, number only)"
                        }
                    ],
                    "soft_skills": [
                        {
                            "name": "Soft skill (English)",
                            "importance": "Importance level (1-10, number only)"
                        }
                    ]
                },
                "responsibilities": [
                    {
                        "description": "Main responsibility (English)",
                        "importance": "Importance level (1-10, number only)"
                    }
                ],
                "preferred_qualifications": [
                    {
                        "description": "Preferred qualification (English)",
                        "importance": "Importance level (1-10, number only)"
                    }
                ]
            }
        `;
    }

    prompt_evaluate_layout() {
        return `
            You are a professional recruiter and visual design expert. Your task is to evaluate the layout quality of a candidate's CV based on the provided image.

            ### OBJECTIVE:
            Focus only on the **visual and structural design**, not the content. Assess how well the layout supports readability, clarity, and professional appearance.

            ### SCORING CRITERIA (0-20):
            Evaluate and score the following specific criteria from 0 (very poor) to 20 (excellent):

            1. **header_score**: Is the name and job title prominently and clearly displayed?
            2. **contact_info_score**: Is the contact section easy to find and neatly arranged?
            3. **section_structure_score**: Are the sections (Education, Experience, Skills, etc.) logically ordered and clearly separated?
            4. **alignment_score**: Are the elements (text blocks, headings) consistently aligned throughout the CV?
            5. **font_style_score**: Are font choices consistent and easy to read?
            6. **whitespace_balance_score**: Is there good use of margins and spacing between elements?
            7. **visual_hierarchy_score**: Is there a clear visual distinction between headings, subheadings, and body text?
            8. **overall_layout_score**: How professional and polished is the overall layout?

            ### OUTPUT REQUIREMENTS:
            - Additionally, list any **layout-related issues** (e.g., "Inconsistent indentation in Experience section", "Header font too small").
            - Provide a short summary comment (1-2 sentences).

            ### FORMATTING RULES:
            - **DO NOT** include code blocks like \`\`\`json.
            - **DO NOT** write any greeting or wrapping text.
            - **ONLY** return the pure JSON object.

            ### TARGET JSON FORMAT:
            {
                "header_score": 0,
                "contact_info_score": 0,
                "section_structure_score": 0,
                "alignment_score": 0,
                "font_style_score": 0,
                "whitespace_balance_score": 0,
                "visual_hierarchy_score": 0,
                "overall_layout_score": 0,
                "issues": [ "string describing issue 1", "string describing issue 2" ],
                "comments": "brief summary of layout quality"
            }
        `;
    }

    prompt_evaluate_resume(resume, jobDescription) {
        return `
            You are an expert HR Recruitment AI. Your task is to objectively evaluate the match between a Candidate's Profile and a Job Description (JD).
            
            ### INPUT DATA:
            **1. Candidate Profile (CV):**
            ${JSON.stringify(resume, null, 2)}
            
            **2. Job Description (JD):**
            ${JSON.stringify(jobDescription, null, 2)}
            
            ### SCORING RULES (Scale 0-80):
            Please evaluate based on these strict criteria:
            
            1. **Education (0-10)**:
                - 9-10: Perfect match (Degree + Field + Top Tier School if req).
                - 5-8: Good match (Related field or slightly lower degree).
                - 0-4: No relevant degree or unmatched field.
            
            2. **Experience (0-20)**:
                - 16-20: Exceeds years required + Exact domain match.
                - 10-15: Meets years required + Relevant domain.
                - 0-9: Low experience or irrelevant background.
            
            3. **Technical Skills (0-20)**:
                - 16-20: Matches all "Must-have" keywords & most "Nice-to-have".
                - 8-15: Matches core "Must-have" but misses some advanced tools.
                - 0-7: Missing critical tech stack required by JD.
            
            4. **Soft Skills (0-10)**:
                - Evaluate based on explicit skills listed and implicit traits in descriptions.
            
            5. **Projects & Achievements (0-20)**:
                - Score based on the relevance, scale, and impact of projects listed compared to JD responsibilities.
            
            **TOTAL SCORE**: Sum of the above 5 scores (Max 80).
            
            ### OUTPUT REQUIREMENTS:
            - **Recommendation**: MUST be one of strict Enum: ["Should interview", "Need further consideration", "Not suitable"].
            - **Analysis**: Be specific. Do not say "Good education", say "Master's degree matches the requirement".
            - **Format**: Return ONLY raw JSON. No markdown (\`\`\`json).
            
            ### TARGET JSON STRUCTURE:
            {
                "evaluation": {
                    "education_score": 0, // Integer 0-10
                    "experience_score": 0, // Integer 0-20
                    "technical_skills_score": 0, // Integer 0-20
                    "soft_skills_score": 0, // Integer 0-10
                    "projects_achievements_score": 0, // Integer 0-20
                    "total_score": 0 // Integer 0-80
                },
                "analysis": {
                    "education_analysis": "Detailed comparison of degree/major.",
                    "experience_analysis": "Analysis of years and domain relevance.",
                    "skills_analysis": "Gap analysis of Technical and Soft skills.",
                    "overall_comment": "Summary of the candidate's fit.",
                    "strengths": ["Specific strength 1", "Specific strength 2", "Specific strength 3"],
                    "weaknesses": ["Specific weakness 1", "Specific weakness 2", "Specific weakness 3"],
                    "recommendation": "Should interview" // OR "Need further consideration" OR "Not suitable"
                }
            }
        `;
    }

}

const prompt = new Prompt();
export default prompt;