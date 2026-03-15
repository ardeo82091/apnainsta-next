import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import User from "@/models/User"
import Credentials from "@/models/Auth"
import { connectDB } from "@/lib/mongodb"

export async function POST(request: Request) {

  try {

    const { emailorUserName, password } = await request.json()

    await connectDB()

    // find by email OR username
    const cred = await Credentials.findOne({
      $or: [
        { email: emailorUserName },
        { userName: emailorUserName }
      ]
    })

    if (!cred) {
      return NextResponse.json(
        { success: false, message: "Credentials not found" },
        { status: 404 }
      )
    }

    // check password
    const isValid = await bcrypt.compare(password, cred.password)

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      )
    }
    
    const user = await User.findById(cred.userId)

    return NextResponse.json({
      success:true,
      user
    })

  } catch (error) {

    console.error("Login error:", error)

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    )

  }
}