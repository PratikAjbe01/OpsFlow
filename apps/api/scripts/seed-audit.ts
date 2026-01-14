// apps/api/scripts/seed-audit.ts

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Form from '../src/modules/forms/form.model'; // Adjust path if needed
import Submission from '../src/modules/forms/submission.model'; // Adjust path if needed

// 👇 CONFIGURATION: PASTE YOUR IDs HERE
const USER_ID = '6964aeea3304059229e1d4a6'; 
const WORKSPACE_ID = '6964af253304059229e1d4bb'; 

dotenv.config();

const seed = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('✅ Connected.');

    // 1. Define the Form Structure
    const formFields = [
      {
        id: 'name',
        type: 'text',
        label: 'Employee Name',
        required: true,
        placeholder: 'John Doe',
      },
      {
        id: 'dept',
        type: 'select',
        label: 'Department',
        required: true,
        options: ['Engineering', 'Sales', 'Marketing', 'HR', 'Product', 'Design'],
      },
      {
        id: 'status',
        type: 'radio',
        label: 'Employment Status',
        required: true,
        options: ['Full-time', 'Contractor', 'Intern'],
      },
      {
        id: 'satisfaction',
        type: 'number',
        label: 'Job Satisfaction Score (1-10)',
        required: true,
        placeholder: '10',
      },
      {
        id: 'meetings',
        type: 'number',
        label: 'Weekly Meeting Hours',
        required: true,
        placeholder: '5',
      },
      {
        id: 'tools',
        type: 'checkbox',
        label: 'Tools You Use',
        required: false,
        options: ['Slack', 'Jira', 'Notion', 'Figma', 'VS Code', 'Zoom'],
      },
      {
        id: 'date',
        type: 'date',
        label: 'Audit Date',
        required: true,
      },
      {
        id: 'feedback',
        type: 'textarea',
        label: 'Improvement Feedback',
        required: false,
        placeholder: 'Tell us more...',
      },
    ];

    // 2. Create the Form
    console.log('📝 Creating Form...');
    const form = await Form.create({
      name: '360 Operations Audit',
      workspaceId: WORKSPACE_ID,
      creatorId: USER_ID,
      content: formFields,
      isPublished: true,
      settings: {
        collectEmails: false,
        limitOneResponse: false,
      },
      submissionsCount: 10, // Pre-filling the count
    });
    console.log(`✅ Form Created: ${form._id}`);

    // 3. Define the Test Data
    const mockData = [
      {
        name: 'Sarah Jenkins',
        dept: 'Engineering',
        status: 'Full-time',
        satisfaction: 9,
        meetings: 5,
        tools: ['Slack', 'Jira', 'VS Code', 'Zoom'],
        date: '2023-10-01',
        feedback: 'Things are going great. I love the new async culture.',
      },
      {
        name: 'David Ross',
        dept: 'Product',
        status: 'Full-time',
        satisfaction: 4,
        meetings: 25,
        tools: ['Slack', 'Notion', 'Zoom', 'Figma'],
        date: '2023-10-02',
        feedback: 'Way too many meetings. I can\'t get deep work done.',
      },
      {
        name: 'Emily Chen',
        dept: 'Marketing',
        status: 'Intern',
        satisfaction: 8,
        meetings: 10,
        tools: ['Slack', 'Notion', 'Figma'],
        date: '2023-10-03',
        feedback: 'Learning a lot! Onboarding was helpful.',
      },
      {
        name: 'Michael Scott',
        dept: 'Sales',
        status: 'Full-time',
        satisfaction: 7,
        meetings: 15,
        tools: ['Slack', 'Zoom'],
        date: '2023-10-04',
        feedback: 'Need better CRM integration.',
      },
      {
        name: 'Alex V.',
        dept: 'Design',
        status: 'Contractor',
        satisfaction: 6,
        meetings: 2,
        tools: ['Figma', 'Slack'],
        date: '2023-10-05',
        feedback: 'VPN access is slow.',
      },
      {
        name: 'Linda Hayes',
        dept: 'HR',
        status: 'Full-time',
        satisfaction: 8,
        meetings: 20,
        tools: ['Slack', 'Zoom', 'Notion'],
        date: '2023-10-06',
        feedback: 'Employee engagement is up.',
      },
      {
        name: 'Kevin O\'Leary',
        dept: 'Engineering',
        status: 'Full-time',
        satisfaction: 3,
        meetings: 12,
        tools: ['VS Code', 'Jira', 'Slack'],
        date: '2023-10-07',
        feedback: 'Legacy code is a nightmare. Technical debt is piling up.',
      },
      {
        name: 'Jessica Alba',
        dept: 'Design',
        status: 'Full-time',
        satisfaction: 9,
        meetings: 8,
        tools: ['Figma', 'Notion', 'Slack'],
        date: '2023-10-08',
        feedback: 'Love the new design system.',
      },
      {
        name: 'Tom Cruise',
        dept: 'Sales',
        status: 'Full-time',
        satisfaction: 5,
        meetings: 30,
        tools: ['Zoom', 'Slack', 'Notion'],
        date: '2023-10-09',
        feedback: 'Meeting fatigue is real. Need an SDR.',
      },
      {
        name: 'Rachel Green',
        dept: 'Marketing',
        status: 'Full-time',
        satisfaction: 10,
        meetings: 12,
        tools: ['Slack', 'Notion', 'Figma', 'Zoom'],
        date: '2023-10-10',
        feedback: 'Best quarter ever! 200% above KPIs.',
      },
    ];

    const submissions = mockData.map((row) => ({
      formId: form._id,
      // 👇 CHANGE THIS: 'answers' -> 'data' to match your Mongoose Schema
      data: { 
        name: row.name,
        dept: row.dept,
        status: row.status,
        satisfaction: row.satisfaction,
        meetings: row.meetings,
        tools: row.tools, 
        date: row.date,
        feedback: row.feedback,
      },
      submittedAt: new Date(row.date),
    }));


    await Submission.insertMany(submissions);
    console.log('✨ Success! Added 10 submissions.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seed();