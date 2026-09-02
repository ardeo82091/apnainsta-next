import { Schema, model, models } from "mongoose"

const HighlightSchema = new Schema({
  userName: { type: String, required: true, index: true },
  title: { type: String, required: true, maxlength: 30 },
  storyIds: [{ type: Schema.Types.ObjectId, ref: "Story", required: true }],
  coverUrl: String
}, { timestamps: true })

export default models.Highlight || model("Highlight", HighlightSchema)
