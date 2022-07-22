const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdEvents: [
    {
        type: Schema.Types.ObjectId,
        ref: "Event",
        required: true,
    },
  ],
  participatingEvents: [
    {
      eventId: {
        type: Schema.Types.ObjectId,
        ref: "Event",
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
