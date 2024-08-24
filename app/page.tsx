'use client';

import {Link} from "@nextui-org/link";
import {
  Navbar, 
  NavbarBrand, 
  NavbarContent, 
  NavbarItem
} from "@nextui-org/navbar";
import { useRef, useState, useEffect } from 'react'
import { Divider } from "@nextui-org/divider"

function isLoggedIn() {
  return window.sessionStorage.getItem("username") != null
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

export default function Home() {
  const loggedIn = useIsLoggedIn()
  return (
    <main>
    <Navbar>
      <NavbarBrand>
        <p className="font-bold text-inherit">Crush Matcher</p>
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem>
          <Link href="#">Home Page</Link>
        </NavbarItem>
        { // Only show if not logged in
          !loggedIn && 
          <div>
          <NavbarItem>
            <Link href="/register" color="foreground">Register</Link>
          </NavbarItem>
          <NavbarItem>
            <Link href="/login" color="foreground">Login</Link>
          </NavbarItem>
          </div>
        }
        { // Only show if logged in
          loggedIn && 
          <div>
          <NavbarItem>
            <Link href="/check" color="foreground">Check Crush</Link>
          </NavbarItem>
          </div>
        }
      </NavbarContent>
    </Navbar>
    <Divider className="my-4"/>
    <p>Welcome to the crush matcher!</p>
    <p>Support me on <Link href="https://ko-fi.com/eshethelichqueen">Ko-Fi</Link></p>
    </main>
  );
}
