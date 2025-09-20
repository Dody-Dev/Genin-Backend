import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    amount: {
      type: Number,
      required: [true, "Payment amount is required"],
      min: [1, "Payment amount must be at least 1 paisa"],
      validate: {
        validator: Number.isInteger,
        message: "Amount must be in paisa (integer)"
      }
    },
    currency: {
      type: String,
      default: "INR",
      enum: {
        values: ["INR", "USD"],
        message: "Currency must be INR or USD"
      }
    },
    razorpay_order_id: {
      type: String,
      required: [true, "Razorpay order ID is required"],
      unique: true,
      validate: {
        validator: function(orderId) {
          return /^order_[A-Za-z0-9]{14}$/.test(orderId);
        },
        message: "Invalid Razorpay order ID format"
      }
    },
    razorpay_payment_id: {
      type: String,
      required: function() {
        return this.status === 'success';
      },
      unique: true,
      sparse: true,
      validate: {
        validator: function(paymentId) {
          if (!paymentId) return true;
          return /^pay_[A-Za-z0-9]{14}$/.test(paymentId);
        },
        message: "Invalid Razorpay payment ID format"
      }
    },
    razorpay_signature: {
      type: String,
      required: function() {
        return this.status === 'success';
      },
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "success", "failed", "refunded", "partially_refunded"],
        message: "Invalid payment status"
      },
      required: [true, "Payment status is required"],
      index: true,
    },
    plan_type: {
      type: String,
      enum: {
        values: ["one-time", "monthly", "quarterly", "yearly"],
        message: "Invalid plan type"
      },
      required: [true, "Plan type is required"],
    },
    plan_duration: {
      type: Number, // in days
      required: true,
      min: [1, "Plan duration must be at least 1 day"],
    },
    invoice_id: {
      type: String,
      unique: true,
      sparse: true,
    },
    receipt_number: {
      type: String,
      unique: true,
      sparse: true,
    },
    payment_method: {
      type: String,
      enum: ["card", "netbanking", "upi", "wallet", "emi"],
    },
    refund_amount: {
      type: Number,
      default: 0,
      min: [0, "Refund amount cannot be negative"],
    },
    refund_id: {
      type: String,
    },
    refund_status: {
      type: String,
      enum: ["none", "pending", "processed", "failed"],
      default: "none"
    },
    retry_count: {
      type: Number,
      default: 0,
      min: [0, "Retry count cannot be negative"],
    },
    failure_reason: {
      type: String,
      maxlength: [500, "Failure reason cannot exceed 500 characters"],
    },
    notes: {
      type: Map,
      of: String, // Additional metadata
    },
    ip_address: {
      type: String,
      validate: {
        validator: function(ip) {
          if (!ip) return true;
          return /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(ip) || 
                 /^(?:[A-F0-9]{1,4}:){7}[A-F0-9]{1,4}$/i.test(ip);
        },
        message: "Invalid IP address format"
      }
    },
    gst_amount: {
      type: Number,
      default: 0,
      min: [0, "GST amount cannot be negative"],
    },
    discount_amount: {
      type: Number,
      default: 0,
      min: [0, "Discount amount cannot be negative"],
    },
    coupon_code: {
      type: String,
      uppercase: true,
      trim: true,
    }
  },
  { 
    timestamps: true 
  }
);

// Indexes for performance
paymentSchema.index({ razorpay_order_id: 1 });
paymentSchema.index({ razorpay_payment_id: 1 });
paymentSchema.index({ user_id: 1, status: 1 });
paymentSchema.index({ status: 1, createdAt: -1 });

// Virtual for net amount (after discount and before GST)
paymentSchema.virtual('net_amount').get(function() {
  return this.amount - this.discount_amount;
});

// Virtual for total amount (including GST)
paymentSchema.virtual('total_amount').get(function() {
  return this.amount - this.discount_amount + this.gst_amount;
});

// Generate invoice ID
paymentSchema.pre('save', function(next) {
  if (this.status === 'success' && !this.invoice_id) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.random().toString(36).substr(2, 6).toUpperCase();
    this.invoice_id = `INV-${year}${month}-${random}`;
    this.receipt_number = `RCP-${Date.now()}`;
  }
  next();
});

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
