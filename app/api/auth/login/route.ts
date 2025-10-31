import { NextResponse } from "next/server";
import { getUser } from "../_db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body as {
      username?: string;
      password?: string;
    };

    if (!username || !password) {
      return NextResponse.json(
        { message: "Missing username or password" },
        { status: 400 }
      );
    }

    const user = getUser(username);
    if (!user || user.password !== password) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // return a fake token and minimal user info
    const token = `fake-token-${username}-${Date.now()}`;

    return NextResponse.json({
      firstName: user.firstName,
      username: user.username,
      token,
      image: user.image || "/vercel.svg",
    });
  } catch (err) {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }
}
