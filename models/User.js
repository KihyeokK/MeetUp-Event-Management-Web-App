const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
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
      eventId: {
        type: Schema.Types.ObjectId,
        ref: "Event",
        required: true,
      },
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
