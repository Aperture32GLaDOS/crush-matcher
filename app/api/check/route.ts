import type { NextRequest } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  const DB = getRequestContext().env.DB
  const formData = await request.formData()
  const username = formData.get("username") as string
  const userCrush = formData.get("userCrush") as string
  const crushUser = formData.get("crushUser") as string
  // Check that the user exists, with the specified crush
  const usernameExists = (await DB.prepare("SELECT * FROM Users WHERE username = ?1 AND user_crush = ?1 AND crush_user = ?2").bind(username, userCrush, crushUser).run()).results.length > 1
  if (!usernameExists) {
    return new Response("", {status: 404})
  }
  const matchFound = (await DB.prepare("SELECT * FROM Users WHERE user_crush = ?1 AND crush_user = ?2").bind(crushUser, userCrush).run()).results.length > 0
  if (matchFound) {
    return new Response("")
  }
  return new Response("", {status: 404})
}
