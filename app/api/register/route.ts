import type { NextRequest } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { argon2id, sha256 } from 'hash-wasm'
import { pki, random } from 'node-forge'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const username = formData.get("username") as string
  const crush = formData.get("crush") as string
  const password = formData.get("password") as string
  const secret = formData.get("secret") as string
  const userCrush = username! + crush!
  const crushUser = crush! + username!
  const passwordSalt = random.getBytesSync(16)
  const maxNum = (2 ** 64) - 1
  const prng = random.createInstance()
  // Use the user's secret as a seed
  prng.seedFileSync = () => secret!
  // Generate the RSA private and public keys using the seed
  const { privateKey, publicKey } = pki.rsa.generateKeyPair({ bits: 4096, prng, workers: 2 })
  const usernameEncrypted = publicKey.encrypt(username)
  const hashedPassword = await argon2id({
    password: password,
    salt: passwordSalt,
    parallelism: 1,
    iterations: 256,
    memorySize: 512,
    hashLength: 32,
    outputType: 'encoded',
  })
  var derivedUserCrushSalt = 1;
  username.split('').forEach(letter => {
    derivedUserCrushSalt = derivedUserCrushSalt * letter.charCodeAt(0) % maxNum
  })
  crush.split('').forEach(letter => {
    derivedUserCrushSalt = derivedUserCrushSalt * letter.charCodeAt(0) % maxNum
  })
  const userCrushSalt = await sha256(String(derivedUserCrushSalt))
  const hashedUserCrush = await argon2id( {
    password: userCrush,
    salt: userCrushSalt,
    parallelism: 1,
    iterations: 256,
    memorySize: 512,
    hashLength: 32,
    outputType: 'encoded',
  })
  const hashedCrushUser = await argon2id( {
    password: crushUser,
    salt: userCrushSalt,
    parallelism: 1,
    iterations: 256,
    memorySize: 512,
    hashLength: 32,
    outputType: 'encoded',
  })
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
  var result = await DB.prepare("INSERT INTO Users (username, password, user_crush, crush_user) VALUES (?1, ?2, ?3, ?4)").bind(usernameEncrypted, hashedPassword, hashedUserCrush, hashedCrushUser).run()

  return new Response(String(result.success))
}
