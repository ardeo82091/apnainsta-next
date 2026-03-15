import mongoose, { Schema, model, models } from "mongoose"

const MessageSchema = new Schema({

  sender: {
    type: String,
    required: true
  },

  recipient: {
    type: String,
    required: true
  },

  content: {
    type: String,
    required: true
  },

  read: {
    type: Boolean,
    default: false
  },

  timestamp: {
    type: Date,
    default: Date.now
  }

})

export default models.Message || model("Message", MessageSchema)