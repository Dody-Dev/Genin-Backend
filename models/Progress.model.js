import mongoose from "mongoose";

const progressReportSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    topic_id: { // Changed from category_id
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic", // Fixed reference
      required: [true, "Topic ID is required"],
      index: true,
    },
    problems_solved: {
      type: Number,
      required: [true, "Problems solved count is required"],
      min: [0, "Problems solved cannot be negative"],
      validate: {
        validator: Number.isInteger,
        message: "Problems solved must be an integer"
      }
    },
    problems_attempted: {
      type: Number,
      default: 0,
      min: [0, "Problems attempted cannot be negative"],
      validate: {
        validator: Number.isInteger,
        message: "Problems attempted must be an integer"
      }
    },
    total_score: {
      type: Number,
      required: [true, "Total score is required"],
      min: [0, "Total score cannot be negative"],
      validate: {
        validator: Number.isInteger,
        message: "Total score must be an integer"
      }
    },
    average_attempts: {
      type: Number,
      default: 0,
      min: [0, "Average attempts cannot be negative"],
    },
    difficulty_breakdown: {
      easy: {
        solved: { type: Number, default: 0, min: 0 },
        total: { type: Number, default: 0, min: 0 }
      },
      medium: {
        solved: { type: Number, default: 0, min: 0 },
        total: { type: Number, default: 0, min: 0 }
      },
      hard: {
        solved: { type: Number, default: 0, min: 0 },
        total: { type: Number, default: 0, min: 0 }
      }
    },
    time_spent: {
      type: Number, // in minutes
      default: 0,
      min: [0, "Time spent cannot be negative"],
    },
    last_solved_at: {
      type: Date,
      default: Date.now,
    },
    streak_count: {
      type: Number,
      default: 0,
      min: [0, "Streak count cannot be negative"],
    },
    best_streak: {
      type: Number,
      default: 0,
      min: [0, "Best streak cannot be negative"],
    },
    completion_percentage: {
      type: Number,
      default: 0,
      min: [0, "Completion percentage cannot be negative"],
      max: [100, "Completion percentage cannot exceed 100"],
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Compound unique index - one progress record per user per topic
progressReportSchema.index({ user_id: 1, topic_id: 1 }, { unique: true });

// Additional indexes for queries
progressReportSchema.index({ user_id: 1, last_solved_at: -1 });
progressReportSchema.index({ total_score: -1 }); // For leaderboards

// Virtual for success rate
progressReportSchema.virtual('success_rate').get(function() {
  if (this.problems_attempted === 0) return 0;
  return (this.problems_solved / this.problems_attempted) * 100;
});

// Pre-save validation
progressReportSchema.pre('save', function(next) {
  // Ensure problems_solved doesn't exceed problems_attempted
  if (this.problems_solved > this.problems_attempted) {
    this.problems_attempted = this.problems_solved;
  }
  
  // Calculate completion percentage if topic has total problems
  // This would need to be updated based on topic's total problems
  next();
});

const ProgressReport = mongoose.model("ProgressReport", progressReportSchema);
export default ProgressReport;