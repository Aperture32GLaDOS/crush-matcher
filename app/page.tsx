'use client';

import {Link} from "@nextui-org/link";
import { useRef, useState, useEffect } from 'react'
import { Divider } from "@nextui-org/divider"
import GlobalNavbar from "@/components/navbar";

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
    <GlobalNavbar pageTitle="home" isLoggedIn={loggedIn.toString()} />
    <Divider className="my-4"/>
    <p>Welcome to the crush matcher! This funky little site will figure out if your crush is interested in you, but <i>without revealing that you&apos;re into them.</i> If you wanna know more about how it works, go <Link href="/faq">here</Link></p>
    <p>Support me on <Link href="https://ko-fi.com/eshethelichqueen">Ko-Fi</Link></p>
    </main>
  );
}
