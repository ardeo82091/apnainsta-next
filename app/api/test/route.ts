import { connectDB } from "@/lib/mongodb"
import User from "@/models/User"

export async function GET() {

  await connectDB()

  await User.create({
    userName: "ankit",
    fullName: "Ankit Raj"
  })

  return Response.json({ message: "User added" })
}