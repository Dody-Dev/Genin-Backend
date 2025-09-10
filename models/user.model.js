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
      select:false
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
    ip_addresses: {
      type: [String],
      default: [],
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


// - id (primary key)
// - email (unique)
// - password (hashed)
// - name
// - phone (unique - for device tracking)
// - email_verified (boolean)
// - verification_token
// - ip_addresses (JSON array - track IPs)
// - payment_status (trial/paid/expired)
// - payment_expiry (date)
// - created_at, updated_at
// - last_login