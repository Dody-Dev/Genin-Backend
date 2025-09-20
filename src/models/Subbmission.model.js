import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    assignment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: [true, "Assignment ID is required"],
      index: true,
    },
    submitted_code: {
      type: String,
      required: [true, "Submitted code is required"],
      minlength: [1, "Code cannot be empty"],
      maxlength: [50000, "Code cannot exceed 50000 characters"],
    },
    language_used: {
      type: String,
      enum: {
        values: ["javascript", "python", "java", "cpp", "c"],
        message: "Invalid programming language"
      },
      required: [true, "Programming language is required"],
    },
    result: {
      type: String,
      enum: {
        values: ["passed", "failed", "partial", "compile_error", "runtime_error", "time_limit_exceeded"],
        message: "Invalid result status"
      },
      required: [true, "Result status is required"],
    },
    score_earned: {
      type: Number,
      required: [true, "Score earned is required"],
      min: [0, "Score cannot be negative"],
      validate: {
        validator: Number.isInteger,
        message: "Score must be an integer"
      }
    },
    test_cases_passed: {
      type: Number,
      required: [true, "Test cases passed count is required"],
      min: [0, "Test cases passed cannot be negative"],
      validate: {
        validator: Number.isInteger,
        message: "Test cases passed must be an integer"
      }
    },
    total_test_cases: {
      type: Number,
      required: [true, "Total test cases count is required"],
      min: [1, "There must be at least 1 test case"],
      validate: {
        validator: Number.isInteger,
        message: "Total test cases must be an integer"
      }
    },
    test_case_results: [{
      test_case_id: String,
      passed: Boolean,
      execution_time: Number,
      memory_used: Number,
      error_message: String
    }],
    execution_time: {
      type: Number, // in milliseconds
      required: [true, "Execution time is required"],
      min: [0, "Execution time cannot be negative"],
      max: [30000, "Execution time cannot exceed 30 seconds"],
    },
    memory_used: {
      type: Number, // in MB
      required: [true, "Memory usage is required"],
      min: [0, "Memory usage cannot be negative"],
      max: [512, "Memory usage cannot exceed 512 MB"],
    },
    attempt_number: {
      type: Number,
      required: true,
      min: [1, "Attempt number must be at least 1"],
      validate: {
        validator: Number.isInteger,
        message: "Attempt number must be an integer"
      }
    },
    ai_feedback: {
      type: String,
      maxlength: [2000, "AI feedback cannot exceed 2000 characters"],
    },
    compilation_error: {
      type: String,
      maxlength: [1000, "Compilation error message cannot exceed 1000 characters"],
    },
    runtime_error: {
      type: String,
      maxlength: [1000, "Runtime error message cannot exceed 1000 characters"],
    },
    ip_address: {
      type: String,
      validate: {
        validator: function(ip) {
          if (!ip) return true;
          // Basic IP validation (IPv4 or IPv6)
          return /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(ip) || 
                 /^(?:[A-F0-9]{1,4}:){7}[A-F0-9]{1,4}$/i.test(ip);
        },
        message: "Invalid IP address format"
      }
    }
  },
  { 
    timestamps: true 
  }
);

// Compound indexes for performance
submissionSchema.index({ user_id: 1, assignment_id: 1 });
submissionSchema.index({ user_id: 1, createdAt: -1 });
submissionSchema.index({ assignment_id: 1, result: 1 });

// Virtual for success rate
submissionSchema.virtual('success_rate').get(function() {
  if (this.total_test_cases === 0) return 0;
  return (this.test_cases_passed / this.total_test_cases) * 100;
});

// Pre-save validation
submissionSchema.pre('save', function(next) {
  // Ensure test_cases_passed doesn't exceed total_test_cases
  if (this.test_cases_passed > this.total_test_cases) {
    next(new Error('Test cases passed cannot exceed total test cases'));
  }
  next();
});

const Submission = mongoose.model("Submission", submissionSchema);
export default Submission;