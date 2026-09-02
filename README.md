# ApnaInsta

Next.js, TypeScript and MongoDB social application with profiles, follow requests, chat, posts and comments.

## Required environment

```env
MONGODB_URI=mongodb://...
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=use-a-long-random-secret
# Optional: enables OpenAI moderation. A conservative local detector is used when omitted.
OPENAI_API_KEY=...
```

## Comment safety policy

Comments are stored in their own `Comment` collection rather than embedded in a post document. This keeps post documents small and allows indexed queries by post.

- A mutual follow (both users follow each other), or a post owner commenting on their own post, is trusted and is not penalized.
- Other comments are checked by OpenAI moderation when `OPENAI_API_KEY` is set; a local abuse detector is the outage/development fallback.
- Abusive comments are rejected. Every 10 rejected abusive comments, across all profiles, applies a strike: 7-day comment suspension, then 30-day suspension, then an admin-review block.
- An admin can unblock a review-blocked user with `PATCH /api/admin/comment-moderation` and `{ "userName": "...", "action": "unblock" }`. The next 10-comment violation after an admin unblock permanently locks commenting.

The comments API never accepts an author name from the browser: it gets the authenticated user from the NextAuth session. A blocked response includes `requiresAdminAppeal: true`, which clients should use to display the appeal dialog/mail link.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
