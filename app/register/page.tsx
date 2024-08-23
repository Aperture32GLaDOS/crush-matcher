'use client';

import {Link} from "@nextui-org/link";
import {
  Navbar, 
  NavbarBrand, 
  NavbarContent, 
  NavbarItem, 
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem
} from "@nextui-org/navbar";
import { Divider } from "@nextui-org/divider"
import {Input} from "@nextui-org/input";
import {Button, ButtonGroup} from "@nextui-org/button";
import { FormEvent } from 'react'

export default function Register() {
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
 
    const formData = new FormData(event.currentTarget)
    const response = await fetch('/api/register', {
      method: 'POST',
      body: formData,
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
