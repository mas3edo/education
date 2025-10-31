import { NextResponse } from "next/server";
import { addUser, getUser, type User } from "../_db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password, firstName } = body as Partial<User>;

    if (!username || !password || !firstName) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    if (getUser(username)) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    const newUser: User = {
      username,
      password,
      firstName,
      image: "/vercel.svg",
    };

    addUser(newUser);

    return NextResponse.json(
      { message: "User created", user: { username, firstName } },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }
}
