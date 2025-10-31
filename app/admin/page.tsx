"use client";
import { useEffect, useState } from "react";
import { useAuthStore } from "../(auth)/store/useAuthStore";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const token = useAuthStore((s) => s.token);
  const username = useAuthStore((s) => s.username);
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    if (!token) {
      router.replace("/login");
    } else if (username && username !== "admin") {
      router.replace("/user");
    } else {
      setChecked(true);
    }
  }, [token, username, router]);
  if (!checked)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <svg className="animate-spin h-8 w-8 text-white" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    );
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-4">Welcome to Admin Page</h1>
      <p className="text-lg">You are logged in as admin.</p>
    </div>
  );
}
