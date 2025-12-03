import mongoose from "mongoose";

const rideSchema = new mongoose.Schema(
  {
    // Starting point of ride
    from: {
      type: String,
      required: [true, "Starting location is required"],
      trim: true,
    },

    // Destination
    to: {
      type: String,
      required: [true, "Destination is required"],
      trim: true,
    },

    // Date and time for the ride
    date: {
      type: Date,
      required: [true, "Ride date and time are required"],
    },

    // Number of available seats
    seatsAvailable: {
      type: Number,
      required: [true, "Number of seats is required"],
      min: [1, "At least 1 seat must be available"],
    },

    // Vehicle info or transport type
    vehicle: {
      type: String,
      required: [true, "Vehicle information is required"],
      trim: true,
    },

    // Fare or contribution amount per seat
    fare: {
      type: Number,
      required: [true, "Fare per seat is required"],
      min: [0, "Fare cannot be negative"],
    },

    // Reference to driver (User with role=driver)
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Driver reference is required"],
    },

    // Users who have booked this ride
    passengers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Ride status
    status: {
      type: String,
      enum: ["available", "booked", "completed", "cancelled"],
      default: "available",
    },

    // Mark if the ride has been completed
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Auto-update status if no seats remain
rideSchema.pre("save", function (next) {
  if (this.seatsAvailable <= 0 && this.status !== "completed") {
    this.status = "booked";
  }
  next();
});

export default mongoose.model("Ride", rideSchema);
