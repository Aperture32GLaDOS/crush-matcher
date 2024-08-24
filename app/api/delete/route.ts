import type { NextRequest } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  const DB = getRequestContext().env.DB
  const formData = await request.formData()
  const username = formData.get("username") as string
  const usernameUnsecure = formData.get("usernameUnsecure") as string
  if (!(await DB.prepare("DELETE FROM Users WHERE username = ?1").bind(username).run()).success) {
    return new Response("", {status: 500})
  }
  await DB.prepare("DELETE FROM Usernames WHERE username = ?1").bind(usernameUnsecure).run()
  return new Response()
}
