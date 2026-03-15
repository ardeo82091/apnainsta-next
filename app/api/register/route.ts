import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import User from "@/models/User"
import Credential from "@/models/Auth"
import { connectDB } from "@/lib/mongodb"

export async function POST(request: Request) {

  try {

    const { email, password, userName, dob, fullName, phoneNumber } = await request.json()

    await connectDB()

    const existingEmail = await Credential.findOne({ email })

    if(existingEmail){
      return NextResponse.json({
        success:false,
        message:"Email already exists"
      })
    }

    const existingUsername = await Credential.findOne({ userName })
    if (existingUsername) {
      return NextResponse.json({
        success:false,
        message:"Username already exists"
      })
    }

    const hashedPassword = await bcrypt.hash(password,10)

    const newUser = await User.create({
      email,
      password: hashedPassword,
      userName,
      dob,
      fullName,
      phoneNumber,
      profilePic:"",
      isActive:true,
      role:"user",
      friendAndRequests:{
        requests:[],
        followers:[],
        followings:[]
      },
      chatPerson:[],
      posts:[],
      notifications:[],
      viewedBy:[]
    })

    await Credential.create({
      userId:newUser._id,
      userName,
      email,
      password:hashedPassword
    })

    return NextResponse.json({
      success:true,
      user:newUser,
      message:"Account Registered Successfully"
    })

  } catch(error) {

    console.error("Registration error:",error)

    return NextResponse.json({
      success:false,
      message:"Server error"
    })
  }
}