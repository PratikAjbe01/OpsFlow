import { Request, Response } from 'express';
import Submission from './submission.model';
import Form from './form.model';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config(); 

export const submitForm = async (req: Request, res: Response) => {
  try {
    const { formId } = req.params;
    const { data, email } = req.body;

   
    const form = await Form.findById(formId);
    if (!form) {
      res.status(404).json({ success: false, message: 'Form not found' });
      return;
    }

    
    if (form.settings.collectEmails) {
      if (!email) {
        res.status(400).json({ success: false, message: 'Email is required for this form.' });
        return;
      }

      
      if (form.settings.limitOneResponse) {
        const existing = await Submission.findOne({ formId, respondentEmail: email });
        if (existing) {
          res.status(409).json({ success: false, message: 'You have already submitted this form.' });
          return;
        }
      }
    }

    
    await Submission.create({
      formId,
      data,
      respondentEmail: email || undefined
    });

    // 4. Increment Submission Count on the Form
    await Form.findByIdAndUpdate(formId, { $inc: { submissionsCount: 1 } });

    res.status(201).json({ success: true, message: 'Form submitted successfully' });

  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Submission failed' });
  }
};




export const getSubmissions = async (req: Request, res: Response) => {
  try {
    const { formId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const skip = (page - 1) * limit;

  
    const form = await Form.findOne({ _id: formId, creatorId: req.user!._id });
    if (!form) {
      res.status(403).json({ success: false, message: 'Unauthorized' });
      return;
    }


    const query: any = { formId };
    
    // Only add search if user actually typed something
    if (search && search.trim() !== '') {
      query.respondentEmail = { $regex: search, $options: 'i' };
    }

    
    const [submissions, total] = await Promise.all([
      Submission.find(query).sort({ submittedAt: -1 }).skip(skip).limit(limit).lean(),
      Submission.countDocuments(query)
    ]);

    const pages = Math.ceil(total / limit);

    res.status(200).json({ 
      success: true, 
      submissions, 
      pagination: { page, limit, total, pages } 
    });

  } catch (error: any) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// ... imports
export const exportSubmissions = async (req: Request, res: Response) => {
  try {
    const { formId } = req.params;
    
    const form = await Form.findOne({ _id: formId, creatorId: req.user!._id });
    if (!form) {
        res.status(403).json({ success: false, message: 'Unauthorized' });
        return;
    }

    const submissions = await Submission.find({ formId }).sort({ submittedAt: -1 });

    const fields = form.content || [];
    
    const headers = [
        "Submission Date", 
        ...fields.map((f: any) => f.label),
        "Respondent Email"
    ];

    const csvRows = [headers.join(',')];

    submissions.forEach(sub => {
        const date = new Date(sub.submittedAt).toLocaleDateString();
        const email = sub.respondentEmail || 'Anonymous';
        
        const answers = fields.map((f: any) => {
            let val = sub.data[f.id] || '';
            if (typeof val === 'string') {
                // FIXED: Properly escaped quotes for CSV
                val = `"${val.replace(/"/g, '""').replace(/\n/g, ' ')}"`;
            }
            return val;
        });

        csvRows.push([date, ...answers, email].join(','));
    });

    const csvString = csvRows.join('\n');

    res.header('Content-Type', 'text/csv');
    res.attachment(`form_export_${formId}.csv`);
    res.send(csvString);

  } catch (error: any) {
    console.error("Export Error:", error);
    res.status(500).json({ message: 'Export failed' });
  }
};



export const getFormAnalytics = async (req: Request, res: Response) => {
  try {
    const { formId } = req.params;
    
    // Check ownership
    const form = await Form.findOne({ _id: formId, creatorId: req.user!._id });
    if (!form) return res.status(403).json({ success: false, message: 'Unauthorized' });

    const submissions = await Submission.find({ formId });

    // A. Submissions Over Time (Line Chart)
    const submissionsByDate = submissions.reduce((acc: any, sub) => {
      const date = new Date(sub.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    const lineChartData = Object.keys(submissionsByDate).map(date => ({
      date,
      count: submissionsByDate[date]
    }));

    // B. Field Distribution (Bar/Pie Charts)
    const distribution: any = {};
    form.content.forEach((field: any) => {
      // Only analyze categorical fields
      if (['select', 'radio', 'checkbox'].includes(field.type)) {
        const counts: any = {};
        submissions.forEach(sub => {
          const val = sub.data[field.id];
          if (val) counts[val] = (counts[val] || 0) + 1;
        });
        distribution[field.id] = Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
      }
    });

    res.status(200).json({ success: true, lineChartData, distribution, total: submissions.length });
  } catch (error: any) {
    res.status(500).json({ message: 'Analytics failed' });
  }
};

// 2. AI Insights (The "Data Scientist" Feature)
export const getAIInsights = async (req: Request, res: Response) => {
  try {

     const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error(" GEMINI_API_KEY is undefined in ai.service.ts");
    throw new Error("API Key missing");
  }
  console.log("✅ API Key found:", apiKey.slice(0, 5) + "...");
    const { formId } = req.params;
    const form = await Form.findOne({ _id: formId, creatorId: req.user!._id });
    if (!form) return res.status(403).json({ message: 'Unauthorized' });

    
    const submissions = await Submission.find({ formId }).limit(50).sort({ submittedAt: -1 });
    
    if (submissions.length === 0) {
        return res.status(200).json({ success: true, insight: "No data to analyze yet." });
    }

    
    const questions = form.content.map((f: any) => `${f.id}: ${f.label}`).join('\n');
    const answers = submissions.map(s => JSON.stringify(s.data)).join('\n');

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

const prompt = `
      Analyze these form responses and provide 3 key insights.
      Focus on trends, common answers, and anomalies.
      
      IMPORTANT: Output strictly valid JSON. Do not include markdown formatting like \`\`\`json.
      The output must be an array of objects:
      [
        { "title": "Dominance of Gmail", "description": "60% of users are using Gmail...", "type": "trend" },
        { "title": "Missing Phone Numbers", "description": "Most users skipped the optional phone field.", "type": "warning" },
        { "title": "High Engagement", "description": "Responses peaked on weekends.", "type": "positive" }
      ]

      Questions Map:
      ${questions}

      Responses Data:
      ${answers}
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean up potential markdown formatting if Gemini adds it
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    res.status(200).json({ success: true, insights: JSON.parse(cleanJson) });

    
  } catch (error: any) {
    console.error("AI Analysis Error:", error);
    res.status(500).json({ message: 'AI Analysis failed' });
  }
};