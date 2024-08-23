import type { NextRequest } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const username = formData.get("username")
  const crush = formData.get("crush")
  const password = formData.get("password")
  const secret = formData.get("secret")
  const userCrush = username + crush
  const crushUser = crush + username
  // How to hash userCrush and crushUser
  // Idea 1: Hash like passwords (with salt)
  //  Problem: in order to search, would need to iterate over every user in the database. Not feasible
  // Idea 2: No salt
  //  Problem: if database is leaked, all hashes could be considered broken. Not even worth hashing if using this method.
  // Idea 3: Encrypt usernames
  //  Encrypt usernames with a user-stored secret, and use no salt for userCrush or crushUser.
  //  Problem: most usernames are still common, and so rainbow tables would still be a problem
  // Final idea: encrypt usernames, and use a derived salt
  //  The salt could be derived (i.e. by the hash of the length of userCrush, or something similar)
  //  This is beneficial because the salt can be derived when retrieving the userCrush values from the database, (and therefore allows O(1) retrieval),
  //  but in the event of a DB breach, no usernames are given away, and therefore no values can be broken!

  const DB = getRequestContext().env.DB

  return new Response("TODO")
}
