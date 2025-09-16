
import mongoose from "mongoose";
import slugify from "slugify";

const testCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  output: { type: String, required: true },
  isHidden: { type: Boolean, default: false },
  weight: { type: Number, default: 1 }
}, { _id: false });

const mcqOptionSchema = new mongoose.Schema({
  option: { type: String, required: true },
  isCorrect: { type: Boolean, required: true }
}, { _id: false });

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Assignment title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters long"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      validate: {
        validator: function(slug) {
          return /^[a-z0-9-]+$/.test(slug);
        },
        message: "Slug can only contain lowercase letters, numbers, and hyphens"
      }
    },
    problem_statement: {
      type: String,
      required: [true, "Problem statement is required"],
      minlength: [10, "Problem statement must be at least 10 characters long"],
      maxlength: [5000, "Problem statement cannot exceed 5000 characters"],
    },
    problem_type: {
      type: String,
      enum: {
        values: ["coding", "mcq", "project", "theory"],
        message: "Problem type must be coding, mcq, project, or theory"
      },
      required: [true, "Problem type is required"],
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
      required: [true, "Category is required"],
      index: true,
    },
    difficulty: {
      type: String,
      enum: {
        values: ["easy", "medium", "hard"],
        message: "Difficulty must be easy, medium, or hard"
      },
      required: [true, "Difficulty level is required"],
    },
    score: {
      type: Number,
      required: [true, "Score is required"],
      min: [1, "Score must be at least 1"],
      max: [100, "Score cannot exceed 100"],
      validate: {
        validator: Number.isInteger,
        message: "Score must be an integer"
      }
    },
    test_cases: {
      type: [testCaseSchema],
      validate: {
        validator: function(testCases) {
          if (this.problem_type !== 'coding') return true;
          return testCases && testCases.length > 0;
        },
        message: "Coding problems must have at least one test case"
      }
    },
    mcq_options: {
      type: [mcqOptionSchema],
      validate: {
        validator: function(options) {
          if (this.problem_type !== 'mcq') return true;
          if (!options || options.length < 2) return false;
          const correctOptions = options.filter(opt => opt.isCorrect);
          return correctOptions.length >= 1;
        },
        message: "MCQ must have at least 2 options with at least 1 correct answer"
      }
    },
    time_limit: {
      type: Number, // in seconds
      min: [30, "Time limit must be at least 30 seconds"],
      max: [7200, "Time limit cannot exceed 2 hours"],
    },
    memory_limit: {
      type: Number, // in MB
      min: [32, "Memory limit must be at least 32 MB"],
      max: [512, "Memory limit cannot exceed 512 MB"],
      default: 256
    },
    allowed_languages: {
      type: [String],
      enum: ["javascript", "python", "java", "cpp", "c"],
      default: ["javascript", "python"]
    },
    solution_code: {
      type: String,
      select: false,
      maxlength: [10000, "Solution code cannot exceed 10000 characters"],
    },
    solution_video: {
      type: String,
      validate: {
        validator: function(url) {
          if (!url) return true;
          return /^https?:\/\/.+/.test(url);
        },
        message: "Solution video must be a valid URL"
      }
    },
    solution_explanation: {
      type: String,
      maxlength: [3000, "Solution explanation cannot exceed 3000 characters"],
    },
    hints: {
      type: [String],
      validate: {
        validator: function(hints) {
          return hints.length <= 5;
        },
        message: "Maximum 5 hints are allowed"
      },
      default: [],
    },
    max_attempts: {
      type: Number,
      min: [1, "Must allow at least 1 attempt"],
      max: [10, "Cannot exceed 10 attempts"],
      default: 3
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    tags: {
      type: [String],
      validate: {
        validator: function(tags) {
          return tags.length <= 10;
        },
        message: "Maximum 10 tags are allowed"
      }
    },
    estimated_time: {
      type: Number, // in minutes
      min: [1, "Estimated time must be at least 1 minute"],
      max: [180, "Estimated time cannot exceed 3 hours"],
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for performance
assignmentSchema.index({ slug: 1 });
assignmentSchema.index({ category_id: 1, difficulty: 1 });
assignmentSchema.index({ problem_type: 1, is_active: 1 });

// Pre-save middleware to generate slug
assignmentSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

const Assignment = mongoose.model("Assignment", assignmentSchema);
export default Assignment;