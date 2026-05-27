import mongoose, { Schema, model, models } from "mongoose"

const PersonSchema = new Schema({
  userName: { type: String, required: true },
  name: String,
  img: String
})

const ViewerSchema = new Schema({
  username: String,
  name: String,
  img: String,
  viewedAt: Date
})

const NotificationSchema = new Schema({
  type: {
    type: String,
    enum: ["like", "comment", "follow"]
  },
  user: PersonSchema,
  postId: Number,
  comment: String,
  timestamp: Date,
  read: Boolean
})

const FollowersSchema = new Schema({
  person: PersonSchema,
  createdAt: { type: Date, default: Date.now }
})

const FollowingsSchema = new Schema({
  person: PersonSchema,
  createdAt: { type: Date, default: Date.now }
})

const RequestsSchema = new Schema({
  person: PersonSchema,
  type: {
    type: String,
    enum: ["sent", "received"]
  },
  createdAt: { type: Date, default: Date.now }
})

const FriendsAndRequestsSchema = new Schema({
  requests: { type: [RequestsSchema], default: [] },
  followers: { type: [FollowersSchema], default: [] },
  followings: { type: [FollowingsSchema], default: [] }
})

const UserSchema = new Schema({

  userName: {
    type: String,
    required: true,
    unique: true
  },

  fullName: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  profilePic: String,

  bio: String,

  dob: Date,

  phoneNumber: String,

  isActive: {
    type: Boolean,
    default: true
  },

  role: {
    type: String,
    default: "user"
  },

  friendAndRequests: {
    type: FriendsAndRequestsSchema
  },

  notifications: [NotificationSchema],

  viewedBy: [ViewerSchema]

}, { timestamps: true })

export default models.User || model("User", UserSchema)