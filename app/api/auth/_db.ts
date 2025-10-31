// File-based user store for persistence
import fs from "fs";
import path from "path";

export type User = {
  username: string;
  password: string;
  firstName: string;
  image?: string;
};

const USERS_FILE = path.join(process.cwd(), "app/api/auth/users.json");

function readUsers(): User[] {
  try {
    const data = fs.readFileSync(USERS_FILE, "utf-8");
    return JSON.parse(data) as User[];
  } catch {
    return [];
  }
}

function writeUsers(users: User[]) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
}

export function getUser(username: string): User | undefined {
  return readUsers().find((u) => u.username === username);
}

export function addUser(user: User): boolean {
  const users = readUsers();
  if (users.some((u) => u.username === user.username)) return false;
  users.push(user);
  writeUsers(users);
  return true;
}
