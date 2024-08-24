'use client';

import {Link} from "@nextui-org/link";
import { Accordion, AccordionItem } from "@nextui-org/react";
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

export default function Faq() {
  const loggedIn = useIsLoggedIn()
  return (
    <main>
    <GlobalNavbar pageTitle="faq" isLoggedIn={loggedIn.toString()} />
    <Divider className="my-4"/>
    <Accordion>
      <AccordionItem key="1" title="How does it work?" aria-label="How does it work?">
        <p>In short: it uses cryptography to match two people&apos;s mutual attraction without revealing anything to either (or the server)</p>
      </AccordionItem>
      <AccordionItem key="2" title="What&apos;s the long explanation?" aria-label="What&apos;s the long explanation?">
        <p>The most crucial aspect of this protocol is the user-stored secret. It&apos;s used as a salt for storing both the username and the password, and it enables the computation to be done on the client-side. A list of hashed usernames is stored on the server, to ensure that only one username may be used at a time (to avoid collisions). Each user has two values stored, userCrush and crushUser. userCrush is the username + their crush&apos;s name. crushUser is their crush&apos;s name, plus their name. Observe that if two people have mutual crushes on each other, their userCrush and crushUser values will coincide. These values are hashed, and stored in the database. When you check, you&apos;re submitting a query to the DB to see if another user exists, but with swapped userCrush and crushUser values.</p>
      </AccordionItem>
      <AccordionItem key="3" title="Will you allow for multiple crushes?" aria-label="Will you allow for multiple crushes?">
        <p>This is definitely a planned feature, but implementing it would require a surprising amount of effort. Since each user could in theory have an arbitrary amount of crushes, an entirely new table would have to be created.</p>
      </AccordionItem>
      <AccordionItem key="4" title="How secure is it?" aria-label="How secure is it?">
        <p>This really depends on both the server, and the user. Your secret should be kept entirely secret, but if it isn&apos;t, then your username and password could be cracked far quicker. This also means, since half the userCrush has been cracked, that cracking who your crush is would be easier too. In the event of a database breach, usernames can be considered insecure, and I would highly recommend deleting your account if you value security. Passwords are still secure, but userCrush and crushUser combinations can be considered insecure, depending on how long your combined usernames are. If you are security conscious, use a very long username and don&apos;t tell many people your username (ideally only your crush, but obviously that might give them an inkling as to your feelings)</p>
      </AccordionItem>
      <AccordionItem key="5" title="Can I change my crush?" aria-label="Can I change my crush?">
        <p>Not currently, but as a workaround you can delete your account and re-create it with the same username</p>
      </AccordionItem>
    </Accordion>
    </main>
  );
}
