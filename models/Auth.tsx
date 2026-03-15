import mongoose, { Schema, model, models } from "mongoose"

const AuthSchema = new Schema({

  userId:{
    type: Schema.Types.ObjectId,
    ref:"User",
    required:true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  userName: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  }

}, { timestamps: true })

export default models.Auth || model("Auth", AuthSchema)