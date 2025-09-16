import mongoose from "mongoose";
import slugify from "slugify";

const topicSchema = new mongoose.Schema(
  {
    name: {
      type: String, // Changed from [String] to String
      required: [true, "Topic name is required"],
      unique: true,
      trim: true,
      minlength: [2, "Topic name must be at least 2 characters"],
      maxlength: [50, "Topic name cannot exceed 50 characters"],
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
    description: {
      type: String,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    icon: {
      type: String, // URL or icon class name
      validate: {
        validator: function(icon) {
          if (!icon) return true;
          // Check if it's a URL or icon class
          return /^https?:\/\/.+/.test(icon) || /^[a-z-]+$/.test(icon);
        },
        message: "Icon must be a valid URL or icon class name"
      }
    },
    parent_topic_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
      default: null, // For nested topics/subtopics
    },
    order: {
      type: Number,
      default: 0, // For sorting topics
      min: [0, "Order cannot be negative"],
    },
    difficulty_distribution: {
      easy: {
        type: Number,
        default: 0,
        min: [0, "Count cannot be negative"]
      },
      medium: {
        type: Number,
        default: 0,
        min: [0, "Count cannot be negative"]
      },
      hard: {
        type: Number,
        default: 0,
        min: [0, "Count cannot be negative"]
      }
    },
    total_problems: {
      type: Number,
      default: 0,
      min: [0, "Total problems cannot be negative"],
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    tags: {
      type: [String],
      validate: {
        validator: function(tags) {
          return tags.length <= 5;
        },
        message: "Maximum 5 tags are allowed"
      }
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes
topicSchema.index({ slug: 1 });
topicSchema.index({ parent_topic_id: 1 });
topicSchema.index({ order: 1 });

// Pre-save middleware to generate slug
topicSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

// Virtual for checking if it's a parent topic
topicSchema.virtual('is_parent').get(function() {
  return !this.parent_topic_id;
});

const Topic = mongoose.model("Topic", topicSchema);
export default Topic;