import { Schema, model, models } from "mongoose"

const LikesSchema = new Schema({
  userName: String
})

const PostSchema = new Schema({

  userName: {
    type: String,
    required: true
  },

  src: {
    type: String
  },

  isVideo: {
    type: Boolean,
    default: false
  },

  media: [{
    src: { type: String, required: true },
    isVideo: { type: Boolean, default: false },
    thumbnail: String,
    order: Number
  }],

  caption: { type: String, trim: true, maxlength: 2200 },

  allowComments: { type: Boolean, default: true },

  isPinned: { type: Boolean, default: false },
  isArchived: { type: Boolean, default: false },
  audience: { type: String, enum: ["everyone", "followers", "selected", "closeFriends"], default: "everyone" },
  hashtags: { type: [String], default: [] },

  likes: [LikesSchema],

}, { timestamps: true })

export default models.Post || model("Post", PostSchema)
