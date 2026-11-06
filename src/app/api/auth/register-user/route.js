// src/app/api/register-user/route.js
import { registerUser } from "@/lib/auth";

export async function POST(req) {
  const body = await req.json();
  try {
    await registerUser(body);
    return new Response(
      JSON.stringify({ message: "Registration successfull" }),
      {
        status: 201,
      }
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: "Registration failed" }), {
      status: 500,
    });
  }
}
