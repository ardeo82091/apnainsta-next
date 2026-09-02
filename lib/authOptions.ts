import { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import Credential from "@/models/Auth"
import User from "@/models/User"
import { connectDB } from "@/lib/mongodb"

export const authOptions: AuthOptions = {
  providers: [CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "text" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials) {
      await connectDB()
      const credential = await Credential.findOne({
        $or: [{ email: credentials?.email }, { userName: credentials?.email }]
      })
      if (!credential || !credentials?.password) return null
      if (!await bcrypt.compare(credentials.password, credential.password)) return null
      const user = await User.findById(credential.userId)
      if (!user || !user.isActive) return null
      return { id: user._id.toString(), email: user.email, name: user.fullName }
    }
  })],
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) session.user.id = token.sub
      return session
    }
  }
}
