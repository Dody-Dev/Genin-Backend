import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Please provide a valid email"],
      index: true, // Add index for faster queries
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      select: false,
      validate: {
        validator: function(password) {
          // At least one uppercase, one lowercase, one number, one special character
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password);
        },
        message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      }
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [50, "Name cannot exceed 50 characters"],
      validate: {
        validator: function(name) {
          return /^[a-zA-Z\s]+$/.test(name);
        },
        message: "Name can only contain letters and spaces"
      }
    },
    phone: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null values
      validate: {
        validator: function(phone) {
          if (!phone) return true; // Optional field
          // Indian phone number validation
          return /^[6-9]\d{9}$/.test(phone);
        },
        message: "Please provide a valid 10-digit Indian phone number"
      }
    },
    email_verified: {
      type: Boolean,
      default: false,
    },
    verification_token: {
      type: String,
      select: false, // Hide by default
    },
    verification_token_expires: {
      type: Date,
      select: false,
    },
    ip_addresses: {
      type: [String],
      default: [],
      validate: {
        validator: function(ips) {
          return ips.length <= 10; // Limit to 10 IPs
        },
        message: "Maximum 10 IP addresses can be stored"
      }
    },
    payment_status: {
      type: String,
      enum: {
        values: ["trial", "paid", "expired"],
        message: "Payment status must be either trial, paid, or expired"
      },
      default: "trial",
    },
    payment_expiry: {
      type: Date,
      validate: {
        validator: function(date) {
          if (!date) return true;
          return date > new Date();
        },
        message: "Payment expiry date must be in the future"
      }
    },
    last_login: {
      type: Date,
    },
    login_attempts: {
      type: Number,
      default: 0,
    },
    account_locked_until: {
      type: Date,
    },
    preferred_language: {
      type: String,
      enum: ["javascript", "python", "java", "cpp", "c"],
      default: "javascript"
    },
    total_problems_solved: {
      type: Number,
      default: 0,
    },
    current_streak: {
      type: Number,
      default: 0,
    },
    max_streak: {
      type: Number,
      default: 0,
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ payment_status: 1, payment_expiry: 1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Instance method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};



const User = mongoose.model("User", userSchema);

export default User;