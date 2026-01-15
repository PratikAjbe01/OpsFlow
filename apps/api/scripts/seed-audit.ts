import mongoose from "mongoose";
import dotenv from "dotenv";
import Form from "../src/modules/forms/form.model";
import Submission from "../src/modules/forms/submission.model";

dotenv.config();

// 🔧 CONFIG
const USER_ID = "6964aeea3304059229e1d4a6";
const WORKSPACE_ID = "6964af253304059229e1d4bb";
const TOTAL_SUBMISSIONS = 120;
const CLEAN_PREVIOUS = true; // set false if you want to keep old data

const departments = [
  "Engineering",
  "Sales",
  "Marketing",
  "HR",
  "Product",
  "Design",
];

const statuses = ["Full-time", "Contractor", "Intern"];

const toolsPool = [
  "Slack",
  "Jira",
  "Notion",
  "Figma",
  "VS Code",
  "Zoom",
];

const randomItem = (arr: string[]) =>
  arr[Math.floor(Math.random() * arr.length)];

const randomSubset = (arr: string[]) =>
  arr.filter(() => Math.random() > 0.5);

const gaussian = (mean: number, deviation: number) => {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.round(
    mean + deviation * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
  );
};

const seed = async () => {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("✅ Connected.");

    if (CLEAN_PREVIOUS) {
      console.log("🧹 Cleaning old audit data...");
      await Form.deleteMany({ name: "360 Operations Audit" });
      await Submission.deleteMany({});
    }

    // 📄 FORM STRUCTURE (UNCHANGED)
    const formFields = [
      { id: "name", type: "text", label: "Employee Name", required: true },
      {
        id: "dept",
        type: "select",
        label: "Department",
        required: true,
        options: departments,
      },
      {
        id: "status",
        type: "radio",
        label: "Employment Status",
        required: true,
        options: statuses,
      },
      {
        id: "satisfaction",
        type: "number",
        label: "Job Satisfaction Score (1-10)",
        required: true,
      },
      {
        id: "meetings",
        type: "number",
        label: "Weekly Meeting Hours",
        required: true,
      },
      {
        id: "tools",
        type: "checkbox",
        label: "Tools You Use",
        options: toolsPool,
      },
      { id: "date", type: "date", label: "Audit Date", required: true },
      { id: "feedback", type: "textarea", label: "Feedback" },
    ];

    const form = await Form.create({
      name: "360 Operations Audit",
      workspaceId: WORKSPACE_ID,
      creatorId: USER_ID,
      content: formFields,
      isPublished: true,
      submissionsCount: TOTAL_SUBMISSIONS,
    });

    console.log(`📝 Form created: ${form._id}`);

    // 📊 SUBMISSIONS (HIGH VARIANCE)
    const submissions = Array.from({ length: TOTAL_SUBMISSIONS }).map(
      (_, i) => {
        const daysAgo = Math.floor(Math.random() * 90);
        const submittedAt = new Date();
        submittedAt.setDate(submittedAt.getDate() - daysAgo);

        return {
          formId: form._id,
          data: {
            name: `Employee ${i + 1}`,
            dept:
              Math.random() > 0.45
                ? "Engineering"
                : randomItem(departments),
            status:
              Math.random() > 0.7
                ? "Full-time"
                : randomItem(statuses),
            satisfaction: Math.min(
              10,
              Math.max(1, gaussian(7, 2))
            ),
            meetings: Math.max(1, gaussian(12, 8)),
            tools:
              randomSubset(toolsPool).length > 0
                ? randomSubset(toolsPool)
                : [randomItem(toolsPool)],
            date: submittedAt.toISOString().split("T")[0],
            feedback:
              Math.random() > 0.7
                ? "Too many meetings affecting productivity."
                : Math.random() > 0.4
                ? "Overall workflow is improving."
                : "No major blockers currently.",
          },
          submittedAt,
        };
      }
    );

    await Submission.insertMany(submissions);
    console.log(`✨ Seeded ${TOTAL_SUBMISSIONS} submissions successfully`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
};

seed();
