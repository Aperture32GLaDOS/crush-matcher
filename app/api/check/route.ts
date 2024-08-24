import type { NextRequest } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { ResponseCookies } from 'next/dist/compiled/@edge-runtime/cookies'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  const DB = getRequestContext().env.DB
  const formData = await request.formData()
  const userCrush = formData.get("userCrush") as string
  const crushUser = formData.get("crushUser") as string
  const matchFound = (await DB.prepare("SELECT * FROM Users WHERE user_crush = ?1 AND crush_user = ?2").bind(crushUser, userCrush).run()).results.length > 0
  if (matchFound) {
    return new Response("")
  }
  return new Response("", {status: 404})
}
