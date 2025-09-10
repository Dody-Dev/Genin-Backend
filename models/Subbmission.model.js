import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    submitted_code: {
      type: String,
      required: true,
    },
    result: {
      type: String,
      enum: ["passed", "failed", "partial"],
      required: true,
    },
    score_earned: {
      type: Number,
      required: true,
    },
    test_cases_passed: {
      type: Number,
      required: true,
    },
    total_test_cases: {
      type: Number,
      required: true,
    },
    execution_time: {
      type: Number,
      required: true,
    },
    memory_used: {
      type: Number,
      required: true,
    },
    ai_feedback: {
      type: String,
    },
    submitted_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Submission = mongoose.model("Submission", submissionSchema);

export default Submission;



// - id
// - user_id
// - assignment_id
// - submitted_code (text)
// - result (passed/failed/partial)
// - score_earned
// - test_cases_passed
// - total_test_cases
// - execution_time
// - memory_used
// - ai_feedback (text - from Claude)
// - submitted_at, updated_at