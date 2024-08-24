import type { NextRequest } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { argon2id, sha256 } from 'hash-wasm'
import { pki, random } from 'node-forge'
import { ResponseCookies } from 'next/dist/compiled/@edge-runtime/cookies'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  const DB = getRequestContext().env.DB
  const formData = await request.formData()
  const usernameSecret = formData.get("usernameSecret") as string
  const username = formData.get("username") as string
  const userCrush = formData.get("userCrush") as string
  const crushUser = formData.get("crushUser") as string
  const password = formData.get("password") as string
  const usernameExists = (await DB.prepare("SELECT * FROM Usernames WHERE username = ?1").bind(username).run()).results.length > 0
  // TODO: actual http error codes
  if (usernameExists) {
    return new Response("false")
  }
  var result = await DB.prepare("INSERT INTO Users (username, password, user_crush, crush_user) VALUES (?1, ?2, ?3, ?4)").bind(usernameSecret, password, userCrush, crushUser).run()

  return new Response(String(result.success))
}
