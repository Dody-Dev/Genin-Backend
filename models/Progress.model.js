import mongoose from "mongoose";

const progressReportSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    problems_solved: {
      type: Number,
      required: true,
    },
    total_score: {
      type: Number,
      required: true,
    },
    last_solved_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const ProgressReport = mongoose.model("ProgressReport", progressReportSchema);

export default ProgressReport;


// - user_id
// - category_id
// - problems_solved
// - total_score
// - last_solved_at