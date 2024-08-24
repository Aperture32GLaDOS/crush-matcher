'use client';

import { Divider } from "@nextui-org/divider"
import {Input} from "@nextui-org/input";
import {Button } from "@nextui-org/button";
import { FormEvent } from 'react'
import GlobalNavbar from "@/components/navbar";

export default function Register() {
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
 
    const formData = new FormData(event.currentTarget)
    const response = await fetch('/api/login', {
      method: 'POST',
      body: formData,
    })
 
    // Handle response if necessary
    const data = await response.json()
    // ...
  }

  return (
    <main>
    <GlobalNavbar pageTitle="login" isLoggedIn={"false"} />
    <Divider className="my-4"/>
    <form onSubmit={onSubmit} className="flex w-full flex-wrap md:flex-nowrap gap-4">
      <Input type="text" name="username" label="Username"/>
      <Input type="password" name="password" label="Password"/>
      <Input type="password" name="Secret" label="Secret"/>
      <Button type="submit" color="primary">Log In</Button>
    </form>
    </main>
  )
}
