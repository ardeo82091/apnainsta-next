import NextAuth, { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import User from "@/models/User"
import { connectDB } from "@/lib/mongodb"

export const authOptions: AuthOptions = {

  providers: [

    CredentialsProvider({

      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },

      async authorize(credentials) {

        await connectDB()

        const user = await User.findOne({
          email: credentials?.email
        })

        if (!user) return null

        const isValid = await bcrypt.compare(
          credentials!.password,
          user.password
        )

        if (!isValid) return null

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.fullName
        }

      }

    })

  ],

  session: {
    strategy: "jwt"
  }

}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }