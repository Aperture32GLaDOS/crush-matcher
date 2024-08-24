'use client';

import {Link} from "@nextui-org/link";
import {
  Navbar, 
  NavbarBrand, 
  NavbarContent, 
  NavbarItem
} from "@nextui-org/navbar";
import { useRef, useState, useEffect, FormEvent } from 'react'
import { Divider } from "@nextui-org/divider"
import {Button} from "@nextui-org/button";

function isLoggedIn() {
  var loggedIn = window.sessionStorage.getItem("username") != null
  if (!loggedIn) {
    window.location.href = "/"
  }
  return loggedIn
}

function useIsLoggedIn() {
  const [loggedIn, setLoggedIn] = useState(false);
  const retrieved = useRef(false)
  useEffect(() => {
    if (retrieved.current) return;
    retrieved.current = true;
    setLoggedIn(isLoggedIn())
  }, [])
  return loggedIn
}


export default function Check() {
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    var formData = new FormData()
    formData.set("userCrush", window.sessionStorage.getItem("userCrush")!)
    formData.set("crushUser", window.sessionStorage.getItem("userCrush")!)

    const response = await fetch('/api/check', {
      method: 'POST',
      body: formData,
    })
    if (response.status == 200) {
      // TODO: display to the user that a match is found
    }
  }
  const loggedIn = useIsLoggedIn()
  return (
    <main>
    {
      // TODO: make the navbar all one component
    }
    <Navbar>
      <NavbarBrand>
        <p className="font-bold text-inherit">Crush Matcher</p>
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem>
          <Link href="/" color="foreground">Home Page</Link>
        </NavbarItem>
        { // Only show if logged in
          loggedIn && 
          <>
          <NavbarItem>
            <Link href="/check">Check Crush</Link>
          </NavbarItem>
          <NavbarItem>
            <Link href="/check" color="foreground">Logout</Link>
          </NavbarItem>
          <NavbarItem>
            {
              // TODO: this link as a button, which will send a POST to /api/delete (or something similar)
            }
            <Link href="#" color="danger">Delete Account</Link>
          </NavbarItem>
          </>
        }
      </NavbarContent>
    </Navbar>
    <Divider className="my-4"/>
    <form onSubmit={onSubmit}>
      <Button type="submit" color="primary">Check</Button>
    </form>
    </main>
  );
}
