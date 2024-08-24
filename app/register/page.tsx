'use client';

import {Link} from "@nextui-org/link";
import {
  Navbar, 
  NavbarBrand, 
  NavbarContent, 
  NavbarItem,
} from "@nextui-org/navbar";
import { Divider } from "@nextui-org/divider"
import {Input} from "@nextui-org/input";
import {Button} from "@nextui-org/button";
import { FormEvent } from 'react'
import { argon2id, sha256 } from 'hash-wasm'

export default function Register() {
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
 
    var formData = new FormData(event.currentTarget)
    const username = formData.get("username") as string
    const crush = formData.get("crush") as string
    const password = formData.get("password") as string
    const secret = formData.get("secret") as string
    const userCrush = username! + crush!
    const crushUser = crush! + username!
    const maxNum = (2 ** 64) - 1
    const usernameSecretlyHashed = await argon2id({
      password: username,
      salt: secret,
      parallelism: 1,
      iterations: 256,
      memorySize: 512,
      hashLength: 32,
      outputType: "hex",
    })
    // TODO: simply hashing username with sha256 is vulnerable to rainbow tables, think of something better
    const usernameHashed = await sha256(username)
    const hashedPassword = await argon2id({
      password: password,
      salt: secret,
      parallelism: 1,
      iterations: 256,
      memorySize: 512,
      hashLength: 32,
      outputType: 'hex',
    })
    var derivedUserCrushSalt = 1;
    username.split('').forEach(letter => {
      derivedUserCrushSalt = derivedUserCrushSalt * (letter.charCodeAt(0) + 1) % maxNum
    })
    crush.split('').forEach(letter => {
      derivedUserCrushSalt = derivedUserCrushSalt * (letter.charCodeAt(0) + 1) % maxNum
    })
    const userCrushSalt = await sha256(String(derivedUserCrushSalt))
    const hashedUserCrush = await argon2id( {
      password: userCrush,
      salt: userCrushSalt,
      parallelism: 1,
      iterations: 256,
      memorySize: 512,
      hashLength: 32,
      outputType: 'hex',
    })
    const hashedCrushUser = await argon2id( {
      password: crushUser,
      salt: userCrushSalt,
      parallelism: 1,
      iterations: 256,
      memorySize: 512,
      hashLength: 32,
      outputType: 'hex',
    })
    const toSend = new FormData()
    toSend.set('usernameSecret', usernameSecretlyHashed)
    toSend.set('username', usernameHashed)
    toSend.set('password', hashedPassword)
    toSend.set('userCrush', hashedUserCrush)
    toSend.set('crushUser', hashedCrushUser)



    const response = await fetch('/api/register', {
      method: 'POST',
      body: toSend,
    })
 
    // Handle response if necessary
    const data = await response.json()
    // ...
  }

  return (
    <main>
    <Navbar>
      <NavbarBrand>
        <p className="font-bold text-inherit">Crush Matcher</p>
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem>
          <Link href="/" color="foreground">Home Page</Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="#">Register</Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/login" color="foreground">Login</Link>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
    <Divider className="my-4"/>
    <form onSubmit={onSubmit} className="flex w-full flex-wrap flex-col md:flex-nowrap gap-4">
      <Input type="text" name="username" label="Username"/>
      <Input type="text" name="crush" label="Crush's Username"/>
      <Input type="password" name="password" label="Password"/>
      <Input type="password" name="secret" label="Secret"/>
      <Button type="submit" color="primary">Submit</Button>
    </form>
    </main>
  )
}
