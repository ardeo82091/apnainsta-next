import mongoose from "mongoose"

const ChatSchema = new mongoose.Schema({
  participants: [String],
  lastMessage: String,
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.models.Chat || mongoose.model("Chat", ChatSchema)