export const ResumeSchema = {
  type: "object",
  properties: {
    personal_info: {
      type: "object",
      properties: {
        name: { type: "string", nullable: true, description: "Candidate's full name" },
        email: { type: "string", nullable: true, description: "Contact email address" },
        phone: { type: "string", nullable: true, description: "Phone number" },
        location: { type: "string", nullable: true, description: "Current address or city" },
        desired_job: { type: "string", nullable: true, description: "The job title the candidate is looking for" },
        objective: { 
          type: "array", 
          items: { type: "string" },
          description: "Career objectives or summary points"
        }
      },
      required: ["name", "email", "phone", "location", "desired_job", "objective"]
    },
    education: {
      type: "array",
      description: "Educational background",
      items: {
        type: "object",
        properties: {
          degree: { type: "string", nullable: true, description: "Degree name (e.g., Bachelor, Master)" },
          institution: { type: "string", nullable: true, description: "University or School name" },
          field: { type: "string", nullable: true, description: "Field of study or Major" },
          duration: { type: "string", nullable: true, description: "Period of study (e.g., 2018 - 2022)" },
          gpa: { type: "string", nullable: true, description: "GPA score if available" },
          details: { 
            type: "array", 
            items: { type: "string" },
            description: "List of details, thesis, or relevant coursework"
          }
        },
        required: ["degree", "institution", "field", "duration", "gpa", "details"]
      }
    },
    work_experience: {
      type: "array",
      description: "Professional work history",
      items: {
        type: "object",
        properties: {
          position: { type: "string", nullable: true, description: "Job title" },
          company: { type: "string", nullable: true, description: "Company name" },
          duration: { type: "string", nullable: true, description: "Employment period" },
          description: { 
            type: "array", 
            items: { type: "string" },
            description: "Bullet points of responsibilities and achievements"
          }
        },
        required: ["position", "company", "duration", "description"]
      }
    },
    skills: {
      type: "object",
      properties: {
        technical: { 
          type: "array", 
          items: { type: "string" },
          description: "List of hard skills, programming languages, tools"
        },
        soft: { 
          type: "array", 
          items: { type: "string" },
          description: "List of soft skills, leadership, communication"
        },
        languages: { 
          type: "array", 
          items: { type: "string" },
          description: "List of spoken languages"
        }
      },
      required: ["technical", "soft", "languages"]
    },
    projects: {
      type: "array",
      description: "Personal or academic projects",
      items: {
        type: "object",
        properties: {
          name: { type: "string", nullable: true, description: "Project title" },
          link: { type: "string", nullable: true, description: "URL to project demo or repo" },
          description: { type: "string", nullable: true, description: "Brief project overview" },
          technologies: { 
            type: "array", 
            items: { type: "string" },
            description: "Tech stack used in this project"
          },
          main_tasks: { 
            type: "array", 
            items: { type: "string" },
            description: "Specific contributions or features implemented"
          }
        },
        required: ["name", "link", "description", "technologies", "main_tasks"]
      }
    },
    awards: { 
      type: "array", 
      items: { type: "string" },
      description: "List of honors, awards, and achievements"
    },
    certificates: {
      type: "array",
      description: "Professional certifications",
      items: {
        type: "object",
        properties: {
          name: { type: "string", nullable: true, description: "Certificate name" },
          issuer: { type: "string", nullable: true, description: "Organization issuing the certificate" },
          date: { type: "string", nullable: true, description: "Date of issue" }
        },
        required: ["name", "issuer", "date"]
      }
    }
  },
  required: ["personal_info", "education", "work_experience", "skills", "projects", "awards", "certificates"]
};

export const JobDescriptionSchema = {
  type: "object",
  properties: {
    job_info: {
      type: "object",
      properties: {
        title: { type: "string", description: "The official job title" },
        department: { type: "string", nullable: true, description: "Department or Team" },
        level: { type: "string", nullable: true, description: "Job level (e.g., Junior, Senior, Lead)" },
        employment_type: { 
          type: "string",
          enum: ["Full-time", "Part-time", "Contract", "Freelance", "Internship", "Other"],
          nullable: true,
          description: "Type of employment contract"
        },
        location: { type: "string", nullable: true, description: "Office location or Remote" }
      },
      required: ["title", "department", "level", "employment_type", "location"]
    },
    requirements: {
      type: "object",
      properties: {
        education: {
          type: "object",
          properties: {
            degree: { type: "string", nullable: true, description: "Minimum required degree" },
            field: { type: "string", nullable: true, description: "Required field of study" },
            importance: { 
              type: "integer", 
              minimum: 1, 
              maximum: 10, 
              description: "Weight of education requirement (1-10)"
            }
          },
          required: ["degree", "field", "importance"]
        },
        experience: {
          type: "object",
          properties: {
            years: { type: "string", nullable: true, description: "Required years of experience description" },
            specific_domains: { 
              type: "array", 
              items: { type: "string" },
              description: "List of specific domain knowledge required"
            },
            importance: { 
              type: "integer", 
              minimum: 1, 
              maximum: 10, 
              description: "Weight of experience requirement (1-10)"
            }
          },
          required: ["years", "specific_domains", "importance"]
        },
        technical_skills: {
          type: "array",
          description: "List of required technical skills with proficiency levels",
          items: {
            type: "object",
            properties: {
              name: { type: "string", description: "Name of the technical skill" },
              level: { 
                type: "string",
                enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
                description: "Minimum proficiency level required"
              },
              importance: { 
                type: "integer", 
                minimum: 1, 
                maximum: 10, 
                description: "Criticality of this skill (1-10)"
              }
            },
            required: ["name", "level", "importance"]
          }
        },
        soft_skills: {
          type: "array",
          description: "List of required soft skills",
          items: {
            type: "object",
            properties: {
              name: { type: "string", description: "Name of the soft skill" },
              importance: { 
                type: "integer", 
                minimum: 1, 
                maximum: 10, 
                description: "Importance of this soft skill (1-10)"
              }
            },
            required: ["name", "importance"]
          }
        }
      },
      required: ["education", "experience", "technical_skills", "soft_skills"]
    },
    responsibilities: {
      type: "array",
      description: "Key day-to-day responsibilities",
      items: {
        type: "object",
        properties: {
          description: { type: "string", description: "Description of a core responsibility" },
          importance: { 
            type: "integer", 
            minimum: 1, 
            maximum: 10, 
            description: "Importance of this task (1-10)"
          }
        },
        required: ["description", "importance"]
      }
    },
    preferred_qualifications: {
      type: "array",
      description: "Qualifications that are desired but not mandatory",
      items: {
        type: "object",
        properties: {
          description: { type: "string", description: "Description of a nice-to-have qualification" },
          importance: { 
            type: "integer", 
            minimum: 1, 
            maximum: 10, 
            description: "Bonus points weight (1-10)"
          }
        },
        required: ["description", "importance"]
      }
    }
  },
  required: ["job_info", "requirements", "responsibilities", "preferred_qualifications"]
};

export const EvaluationSchema = {
  type: "object",
  properties: {
    evaluation: {
      type: "object",
      properties: {
        education_score: { 
          type: "number", 
          minimum: 0, 
          maximum: 10,
          description: "Score for education relevance and level (Max 10). 0 means no relevant degree."
        },
        experience_score: { 
          type: "number", 
          minimum: 0, 
          maximum: 20,
          description: "Score for years of experience and domain match (Max 20). Based on required years."
        },
        technical_skills_score: { 
          type: "number", 
          minimum: 0, 
          maximum: 20,
          description: "Score for matching technical skills and proficiency (Max 20). Check keyword matches."
        },
        soft_skills_score: { 
          type: "number", 
          minimum: 0, 
          maximum: 10,
          description: "Score for soft skills match (Max 10)."
        },
        projects_achievements_score: { 
          type: "number", 
          minimum: 0, 
          maximum: 20,
          description: "Score for impressive projects or specific achievements (Max 20)."
        },
        total_score: { 
          type: "number", 
          minimum: 0, 
          maximum: 80,
          description: "Sum of all above scores. Strictly calculated: education + experience + technical + soft + projects."
        }
      },
      required: ["education_score", "experience_score", "technical_skills_score", "soft_skills_score", "projects_achievements_score", "total_score"]
    },
    analysis: {
      type: "object",
      properties: {
        education_analysis: { 
          type: "string",
          description: "Explanation of why this education score was given. Compare degree vs requirement."
        },
        experience_analysis: { 
          type: "string",
          description: "Detailed analysis of work history relevance vs job description."
        },
        skills_analysis: { 
          type: "string",
          description: "Analysis of matched vs missing technical and soft skills."
        },
        overall_comment: { 
          type: "string",
          description: "A holistic summary of the candidate's fit."
        },
        strengths: { 
          type: "array", 
          items: { type: "string" },
          description: "List of 3-5 key strong points of the candidate."
        },
        weaknesses: { 
          type: "array", 
          items: { type: "string" },
          description: "List of missing skills or potential red flags."
        },
        recommendation: { 
          type: "string",
          enum: ["Should interview", "Need further consideration", "Not suitable"],
          description: "Final verdict based on total score and critical missing criteria."
        }
      },
      required: ["education_analysis", "experience_analysis", "skills_analysis", "overall_comment", "strengths", "weaknesses", "recommendation"]
    }
  },
  required: ["evaluation", "analysis"]
};

export const LayoutSchema = {
  type: "object",
  properties: {
    header_score: { 
      type: "integer", 
      minimum: 0, 
      maximum: 20,
      description: "Is the name and job title prominently and clearly displayed?"
    },
    contact_info_score: { 
      type: "integer", 
      minimum: 0, 
      maximum: 20,
      description: "Is the contact section easy to find and neatly arranged?"
    },
    section_structure_score: { 
      type: "integer", 
      minimum: 0, 
      maximum: 20,
      description: "Are the sections (Education, Experience, Skills, etc.) logically ordered and clearly separated?"
    },
    alignment_score: { 
      type: "integer", 
      minimum: 0, 
      maximum: 20,
      description: "Are the elements (text blocks, headings) consistently aligned throughout the CV?"
    },
    font_style_score: { 
      type: "integer", 
      minimum: 0, 
      maximum: 20,
      description: "Are font choices consistent and easy to read?"
    },
    whitespace_balance_score: { 
      type: "integer", 
      minimum: 0, 
      maximum: 20,
      description: "Is there good use of margins and spacing between elements?"
    },
    visual_hierarchy_score: { 
      type: "integer", 
      minimum: 0, 
      maximum: 20,
      description: "Is there a clear visual distinction between headings, subheadings, and body text?"
    },
    overall_layout_score: { 
      type: "integer", 
      minimum: 0, 
      maximum: 20,
      description: "How professional and polished is the overall layout?"
    },
    issues: { 
      type: "array", 
      items: { type: "string" },
      description: "List of specific layout-related issues (e.g., inconsistent alignment, cluttered sections). Return [] if perfect."
    },
    comments: { 
      type: "string",
      description: "A brief summary of layout quality (1-2 sentences)."
    }
  },
  required: ["header_score", "contact_info_score", "section_structure_score", "alignment_score", "font_style_score", "whitespace_balance_score", "visual_hierarchy_score", "overall_layout_score", "issues", "comments"]
};

export const searchOptimizeOutputSchema = {
  type: "object",
  properties: {
    search_optimize: {
      type: "string",
      description: "The optimized search query string for Tavily."
    }
  },
  required: ["search_optimize"]
};

export const ListJobSchema = {
  type: "object",
  properties: {
    jobs: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          company: { type: "string" },
          location: { type: "string" },
          description: { type: "string" },
          link: { type: "string" },
          datePosted: { type: "string" }
        },
        required: ["title", "location", "link"]
      }, 
      description: "List of extracted job postings"
    }
  },
  required: ["jobs"]
};

export const QuestionSchema = {
  type: "object",
  properties: {
    questions: {
      type: "array",
      items: { type: "string" },
      description: "List of questions"
    }
  },
  required: ["questions"]
};

export const InterviewFeedbackSchema = {
  type: "object",
  properties: {
    score: {
      type: "number",
      minimum: 0,
      maximum: 100,
      description: "Overall interview score, from 0 to 100"
    },
    feedback: {
      type: "object",
      properties: {
        overall_summary: {
          type: "string",
          description: "Brief summary of the candidate's interview performance."
        },
        strengths: {
          type: "array",
          items: { type: "string" },
          description: "List of strengths demonstrated by the candidate."
        },
        weaknesses: {
          type: "array",
          items: { type: "string" },
          description: "List of weaknesses or areas for improvement."
        },
        question_analysis: {
          type: "array",
          items: {
            type: "object",
            properties: {
              question: { type: "string", description: "The interview question." },
              user_response: { type: "string", description: "The candidate's response." },
              analysis: { type: "string", description: "Evaluation and comment on the answer." },
              rating: { type: "string", enum: ["good", "average", "poor"], description: "Rating of the answer quality." }
            },
            required: ["question", "user_response", "analysis", "rating"]
          },
          description: "Per-question analysis and rating."
        },
        advice: {
          type: "array",
          items: { type: "string" },
          description: "Actionable advice for the candidate."
        }
      },
      required: ["overall_summary", "strengths", "weaknesses", "question_analysis", "advice"],
      description: "Structured feedback for the candidate based on interview responses."
    }
  },
  required: ["score", "feedback"]
};

