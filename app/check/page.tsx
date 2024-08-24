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
import GlobalNavbar from "@/components/navbar";

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
    formData.set("username", window.sessionStorage.getItem("username")!)
    formData.set("userCrush", window.sessionStorage.getItem("userCrush")!)
    formData.set("crushUser", window.sessionStorage.getItem("crushUser")!)

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
    <GlobalNavbar pageTitle="check" isLoggedIn={loggedIn.toString()}/>
    <Divider className="my-4"/>
    <form onSubmit={onSubmit}>
      <Button type="submit" color="primary">Check</Button>
    </form>
    </main>
  );
}
