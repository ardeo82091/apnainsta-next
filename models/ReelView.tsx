import { Schema, model, models } from "mongoose"

const ReelViewSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  postId: { type: Schema.Types.ObjectId, ref: "Post", required: true, index: true },
  watchedAt: { type: Date, default: Date.now },
  completed: { type: Boolean, default: false }
}, { timestamps: true })

ReelViewSchema.index({ userId: 1, postId: 1 }, { unique: true })

export default models.ReelView || model("ReelView", ReelViewSchema)
