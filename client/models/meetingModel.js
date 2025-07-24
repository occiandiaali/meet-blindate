const mongoose = require("mongoose");

// const meetingSchema = new mongoose.Schema({
//   roomId: { type: String, required: true },
//   environment: { type: String, required: true },
//   meetingDay: { type: Date, required: true },
//   duration: { type: String }, // e.g. "5" (300000 in milliseconds)
//   startTime: { type: String }, // e.g., "10:00 AM"
//   endTime: { type: String }, // e.g., "10:05 AM"
//   crush: { type: String, required: true },
//   sender: { type: String, required: true },
// });

// const Meeting = mongoose.model("Meeting", meetingSchema);

// const meetingSchema = new mongoose.Schema({
//   roomId: String,
//   environment: String,
//   meetingDay: Date,
//   duration: String,
//   participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
// });

// const bookingSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   meetingId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Meeting",
//     required: true,
//   },
// });

// module.exports = {
//   Meeting: mongoose.model("Meeting", meetingSchema),
//   Booking: mongoose.model("Booking", bookingSchema),
// };

const meetingSchema = new mongoose.Schema({
  roomId: String,
  environment: String,
  meetingDay: Date,
  // startTime: String,
  // endTime: String,
  duration: String,
  //participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  participants: [{ type: String, ref: "User" }],
  crushphoto: String,
});

const Meeting = mongoose.model("Meeting", meetingSchema);

module.exports = Meeting;
