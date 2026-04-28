import mongoose from "mongoose"

const MessageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
    required: true,
  },

  sender: {
    type: String,
    required: true,
  },

  content: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    enum: ["text", "image", "video"],
    default: "text",
  },

  readBy: {
    type: [String],
    default: [],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.models.Message ||
  mongoose.model("Message", MessageSchema)