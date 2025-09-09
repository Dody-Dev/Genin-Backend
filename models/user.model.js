import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6, 
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      unique: true,
    },
    email_verified: {
      type: Boolean,
      default: false,
    },
    verification_token: {
      type: String,
    },
    device_fingerprints: {
      type: [String], 
      default: [],
    },
    ip_addresses: {
      type: [String],
      default: [],
    },
    max_devices: {
      type: Number,
      default: 1,
    },
    payment_status: {
      type: String,
      enum: ["trial", "paid", "expired"],
      default: "trial",
    },
    payment_expiry: {
      type: Date,
    },
    last_login: {
      type: Date,
    },
  },
  { timestamps: true } 
);

const User = mongoose.model("User", userSchema);

export default User;