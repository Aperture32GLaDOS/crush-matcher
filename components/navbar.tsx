import {Link} from "@nextui-org/link";
import {
  Navbar, 
  NavbarBrand, 
  NavbarContent, 
  NavbarItem
} from "@nextui-org/navbar";


export default function GlobalNavbar({ pageTitle, isLoggedIn } : {pageTitle: string, isLoggedIn: string} ) {
  const loggedIn = isLoggedIn == "true"
  return (
    <Navbar>
      <NavbarBrand>
        <p className="font-bold text-inherit">Crush Matcher</p>
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem>
          { (pageTitle == "home") && <Link href="#">Home Page</Link>}
          { (pageTitle != "home") && <Link href="/" color="foreground">Home Page</Link>}
        </NavbarItem>
        { // Only show if not logged in
          !loggedIn && 
          <>
          <NavbarItem>
            { (pageTitle == "register") && <Link href="#">Register</Link>}
            { (pageTitle != "register") && <Link href="/register" color="foreground">Register</Link>}
          </NavbarItem>
          <NavbarItem>
            <Link href="/login" color="foreground">Login</Link>
          </NavbarItem>
          </>
        }
        { // Only show if logged in
          loggedIn && 
          <>
          <NavbarItem>
            { (pageTitle == "check") && <Link href="#">Check Crush</Link>}
            { (pageTitle != "check") && <Link href="/check" color="foreground">Check Crush</Link>}
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
  )
}
