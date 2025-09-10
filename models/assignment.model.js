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
      type: mongoose.Schema.Types.Mixed, // Store JSON data for test cases
    },
    mcq_options: {
      type: mongoose.Schema.Types.Mixed, // Store MCQ options as JSON
    },
    solution_code: {
      type: String,
      select: false, // Hidden by default
    },
    solution_video: {
      type: String, // URL for solution video
    },
    solution_explanation: {
      type: String, // Text explanation of the solution
    },
    hints: {
      type: [String], // Array of hints in JSON format
      default: [],
    },
    is_active: {
      type: Boolean,
      default: true, // Whether the assignment is active or not
    },
  },
  { timestamps: true } // Created and Updated At fields will be automatically generated
);

const Assignment = mongoose.model("Assignment", assignmentSchema);

export default Assignment;
