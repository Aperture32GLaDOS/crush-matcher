import type { NextRequest } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  const DB = getRequestContext().env.DB
  const formData = await request.formData()
  const usernameSecret = formData.get("usernameSecret") as string
  const password = formData.get("password") as string
  const usernameExists = (await DB.prepare("SELECT * FROM Users WHERE username = ?1 AND password = ?2").bind(usernameSecret, password).run()).results.length > 0
  if (!usernameExists) {
    return new Response("", {status: 409})
  }
  return new Response()
}
