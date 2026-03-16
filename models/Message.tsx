import mongoose from "mongoose"

const MessageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
    required: true
  },
  sender: String,
  recipient: String,
  content: String,
  read: {
    type: Boolean,
    default: false
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.models.Message || mongoose.model("Message", MessageSchema)