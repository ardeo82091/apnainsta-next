import mongoose from "mongoose"

const ChatSchema = new mongoose.Schema({
  participants: {
    type: [String],
    required: true,
  },

  lastMessage: {
    text: String,
    sender: String,
    timestamp: Date,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.models.Chat ||
  mongoose.model("Chat", ChatSchema)