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
  id: Number,
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
  id: Number,
  person: PersonSchema,
  isOnline: Boolean,
  isFollowing: Boolean,
  isFollowed: Boolean
})

const FollowingsSchema = new Schema({
  id: Number,
  person: PersonSchema,
  isOnline: Boolean
})

const RequestsSchema = new Schema({
  id: Number,
  person: PersonSchema,
  isAdded: Boolean,
  isSent: Boolean
})

const FriendsAndRequestsSchema = new Schema({
  requests: [RequestsSchema],
  followers: [FollowersSchema],
  followings: [FollowingsSchema]
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

  friendAndRequests: FriendsAndRequestsSchema,

  notifications: [NotificationSchema],

  viewedBy: [ViewerSchema]

}, { timestamps: true })

export default models.User || model("User", UserSchema)