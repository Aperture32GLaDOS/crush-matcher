'use client';

import { Divider } from "@nextui-org/divider"
import {Input} from "@nextui-org/input";
import {Button } from "@nextui-org/button";
import { FormEvent } from 'react'
import { argon2id, sha256 } from 'hash-wasm'
import GlobalNavbar from "@/components/navbar";

export default function Register() {
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
 
    var formData = new FormData(event.currentTarget)
    const username = formData.get("username") as string
    const password = formData.get("password") as string
    const secret = formData.get("secret") as string
    const usernameSecretlyHashed = await argon2id({
      password: username,
      salt: secret,
      parallelism: 1,
      iterations: 256,
      memorySize: 512,
      hashLength: 32,
      outputType: "hex",
    })
    const hashedPassword = await argon2id({
      password: password,
      salt: secret,
      parallelism: 1,
      iterations: 256,
      memorySize: 512,
      hashLength: 32,
      outputType: 'hex',
    })
    const toSend = new FormData()
    toSend.set('usernameSecret', usernameSecretlyHashed)
    toSend.set('password', hashedPassword)
    toSend.set("cf-turnstile-response", formData.get("cf-turnstile-response") as string)

    const response = await fetch('/api/register', {
      method: 'POST',
      body: toSend,
    })
    const usernameHash = await sha256(username)
    if (response.status == 200) {
      window.sessionStorage.setItem("username", usernameSecretlyHashed)
      window.sessionStorage.setItem("usernameUnsecure", usernameHash)
    }
  }

  return (
    <main>
    <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" defer></script>
    <GlobalNavbar pageTitle="login" isLoggedIn={"false"} />
    <Divider className="my-4"/>
    <form onSubmit={onSubmit} className="flex w-full flex-wrap md:flex-nowrap gap-4">
      <Input type="text" name="username" label="Username"/>
      <Input type="password" name="password" label="Password"/>
      <Input type="password" name="secret" label="Secret"/>
      <div className="cf-turnstile" data-sitekey="0x4AAAAAAAh_Zm3Jr3Wm49_X"></div>
      <Button type="submit" color="primary">Log In</Button>
    </form>
    </main>
  )
}
