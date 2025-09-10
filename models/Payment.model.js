import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    razorpay_order_id: {
      type: String,
      required: true,
    },
    razorpay_payment_id: {
      type: String,
      required: true,
    },
    razorpay_signature: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      required: true,
    },
    plan_type: {
      type: String,
      enum: ["one-time", "monthly", "yearly"],
      required: true,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;


// - id
// - user_id
// - amount(=>paisae)
// - currency (Default rupees)
// - razorpay_order_id
// - razorpay_payment_id
// - razorpay_signature
// - status (pending/success/failed)
// - plan_type (one-time/ monthly / yearly)
// - created_at