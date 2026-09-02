import { Schema, model, models } from "mongoose"

const CommentSchema = new Schema({
  postId: { type: Schema.Types.ObjectId, ref: "Post", required: true, index: true },
  authorId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  authorUserName: { type: String, required: true, trim: true },
  text: { type: String, required: true, trim: true, minlength: 1, maxlength: 1000 },
  parentCommentId: { type: Schema.Types.ObjectId, ref: "Comment", default: null },
  likes: { type: [{ userName: { type: String, required: true } }], default: [] },
  moderation: {
    source: { type: String, enum: ["trusted_friend", "ai", "local_fallback"], required: true },
    flagged: { type: Boolean, default: false },
    categories: { type: [String], default: [] }
  }
}, { timestamps: true })

CommentSchema.index({ postId: 1, createdAt: -1 })

export default models.Comment || model("Comment", CommentSchema)
