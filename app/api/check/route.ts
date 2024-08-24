import type { NextRequest } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  const DB = getRequestContext().env.DB
  const formData = await request.formData()
  const username = formData.get("username") as string
  // Check that the user exists
  const users = (await DB.prepare("SELECT * FROM Users WHERE username = ?1").bind(username).run()).results
  if (users.length < 1) {
    return new Response("", {status: 404})
  }
  const user = users.at(0)!
  const matchFound = (await DB.prepare("SELECT * FROM Users WHERE user_crush = ?1 AND crush_user = ?2").bind(user.crush_user, user.user_crush).run()).results.length > 0
  if (matchFound) {
    return new Response("")
  }
  return new Response("", {status: 404})
}
