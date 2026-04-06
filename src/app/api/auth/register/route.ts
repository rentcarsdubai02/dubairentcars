import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, password, phone, role } = await req.json();

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    await connectToDatabase();

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user
    const newUser = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone: phone || "",
      role: role || "client", // Default role is client
    });

    return NextResponse.json(
      { message: "User created successfully", user: { id: newUser._id, email: newUser.email } },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
