import type { NextRequest } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { ResponseCookies } from 'next/dist/compiled/@edge-runtime/cookies'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  const DB = getRequestContext().env.DB
  const formData = await request.formData()
  // Verify with cloudflare turnstile
  const token = formData.get("cf-turnstile-response")!
  const SECRET_KEY = getRequestContext().env.TURNSTILE_SECRET_KEY
  // Validate the token by calling the `/siteverify` API.
  let tokenData = new FormData();
  tokenData.append('secret', SECRET_KEY);
  tokenData.append('response', token);
  const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
  const tokenResult = await fetch(url, {
      body: tokenData,
      method: 'POST',
  });

  const outcome: any = await tokenResult.json();

  if (!outcome.success) {
      return new Response('The provided Turnstile token was not valid!', { status: 401 });
  }
  const usernameSecret = formData.get("usernameSecret") as string
  const username = formData.get("username") as string
  const userCrush = formData.get("userCrush") as string
  const crushUser = formData.get("crushUser") as string
  const password = formData.get("password") as string
  const usernameExists = (await DB.prepare("SELECT * FROM Usernames WHERE username = ?1").bind(username).run()).results.length > 0
  if (usernameExists) {
    return new Response("", {status: 409})
  }
  var result = (await DB.prepare("INSERT INTO Usernames (username) VALUES (?1)").bind(username).run()).success
  result = result && (await DB.prepare("INSERT INTO Users (username, password, user_crush, crush_user) VALUES (?1, ?2, ?3, ?4)").bind(usernameSecret, password, userCrush, crushUser).run()).success

  if (result) {
    return new Response("")
  }
  return new Response("", {status: 500})
}
