# ApnaInsta

A full-stack social media web application built with Next.js, TypeScript, MongoDB, and Socket.IO.

ApnaInsta provides a complete social experience including posts, likes, comments, user connections, real-time chat, notifications, profile discovery, profile-view tracking, and more.

## Features

### User & Profile

- User registration and authentication
- User profiles
- Profile picture and bio
- Profile view tracking
- Recently viewed profiles
- User search
- Recent search functionality

### Posts & Feed

- Create image and video posts
- Social feed
- Like and unlike posts
- Post comments
- Comment replies
- Media viewing
- Post timestamps

### Connections

- Send follow requests
- Receive and manage requests
- Followers and following
- Follow and unfollow users
- Connection activity notifications

### Real-Time Chat

- One-to-one conversations
- Real-time messaging with Socket.IO
- Text messages
- Image and video messages
- Chat history
- Read/unread message tracking
- Last-message preview
- Message timestamps

### Notifications

Notifications for:

- Likes
- Comments
- Follows
- Requests

Notifications support read/unread state and timestamps.

### Profile Discovery

- Search users
- Discover profiles
- Track profile views
- Recently viewed profiles
- Recent searches

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Redux

### Backend

- Next.js
- REST APIs
- Node.js
- Socket.IO

### Database

- MongoDB

### Authentication

- NextAuth
- Credentials authentication
- Password hashing

## Architecture

```text
                    ApnaInsta
                        │
            ┌───────────┴───────────┐
            │                       │
        Next.js                 Socket.IO
            │                       │
     ┌──────┴──────┐                │
     │             │                │
   React        REST APIs      Real-time Chat
     │             │                │
     └─────────────┴────────────────┘
                   │
                   ▼
                MongoDB
```

## Core Data

The application manages entities such as:

- Users
- Posts
- Comments
- Replies
- Likes
- Followers
- Following
- Requests
- Notifications
- Profile Views
- Chats
- Messages

## What I Built

This project was built as a personal full-stack application to explore and implement real-world social application functionality.

It covers:

- Full-stack application architecture
- REST API development
- MongoDB data modeling
- Authentication
- State management
- Real-time communication
- Social relationship management
- Notification systems
- Profile activity tracking
- Search functionality
- Media-based posts
- Responsive UI

## Project Status

Personal project — actively developed.

## Author

**Ankit Raj**

Full-Stack Software Developer

[GitHub](https://github.com/ardeo82091)
