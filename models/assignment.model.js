import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true, 
    },
    problem_statement: {
      type: String, 
      required: true,
    },
    problem_type: {
      type: String,
      enum: ["coding", "mcq", "project", "theory"],
      required: true,
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic", 
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    test_cases: {
      type: mongoose.Schema.Types.Mixed, 
    },
    mcq_options: {                                        //type: mongoose.Schema.Types.Mixed, is used to store any data type like array of objects
      type: mongoose.Schema.Types.Mixed, 
    },
    solution_code: {
      type: String,
      select: false, 
    },
    solution_video: {
      type: String, 
    },
    solution_explanation: {
      type: String, 
    },
    hints: {
      type: [String], 
      default: [],
    },
    is_active: {
      type: Boolean,
      default: true, 
    },
  },
  { timestamps: true } 
);

const Assignment = mongoose.model("Assignment", assignmentSchema);

export default Assignment;


// - id
// - title
// - slug (url-friendly)
// - problem_statement (rich text/HTML)
// - problem_type (coding/mcq/project/theory)
// - category_id (foreign key) => topics
// - difficulty (easy/medium/hard)
// - score (points for this problem)
// - test_cases (JSON - for coding)
// - mcq_options (JSON - for MCQ)
// - solution_code (text - hidden)
// - solution_video ()
// - solution_explanation (text)
// - hints (JSON array)
// - is_active (boolean)
// - created_at, updated_at