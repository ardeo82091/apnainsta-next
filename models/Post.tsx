import mongoose, { Schema, model, models } from "mongoose"

const RepliesSchema = new Schema({
  userName: String,
  replies: String
})

const CommentsSchema = new Schema({
  userName: String,
  comment: String,
  replies: [RepliesSchema]
})

const LikesSchema = new Schema({
  userName: String
})

const PostSchema = new Schema({

  userName: {
    type: String,
    required: true
  },

  src: {
    type: String,
    required: true
  },

  isVideo: {
    type: Boolean,
    default: false
  },

  likes: [LikesSchema],

  comments: [CommentsSchema]

}, { timestamps: true })

export default models.Post || model("Post", PostSchema)