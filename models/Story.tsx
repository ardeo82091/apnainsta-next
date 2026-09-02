import { Schema, model, models } from "mongoose"

const ViewerSchema = new Schema({ userName: String, viewedAt: { type: Date, default: Date.now } }, { _id: false })

const StorySchema = new Schema({
  userName: { type: String, required: true, index: true },
  mediaUrl: { type: String, required: true },
  mediaType: { type: String, enum: ["image", "video"], default: "image" },
  viewedBy: { type: [ViewerSchema], default: [] },
  likes: { type: [{ userName: String }], default: [] },
  expiresAt: { type: Date, required: true, index: { expires: 0 } }
}, { timestamps: true })

export default models.Story || model("Story", StorySchema)
