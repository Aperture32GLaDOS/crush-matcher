import {Link} from "@nextui-org/link";
import {
  Navbar, 
  NavbarBrand, 
  NavbarContent, 
  NavbarItem
} from "@nextui-org/navbar";

function logout() {
  window.sessionStorage.clear()
}

async function deleteAccount() {
  if (!confirm("Are you sure you want to delete your account? This cannot be undone")) {
    return;
  }
  var formData = new FormData();
  formData.set("username", window.sessionStorage.getItem("username") as string)
  formData.set("usernameUnsecure", window.sessionStorage.getItem("usernameUnsecure") as string)
  const results = await fetch('/api/delete', {
    method: 'POST',
    body: formData
  })
  if (results.status == 200) {
    window.sessionStorage.clear()
  }
}


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
            { (pageTitle == "login") && <Link href="#">Login</Link>}
            { (pageTitle != "login") && <Link href="/login" color="foreground">Login</Link>}
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
            <Link href="/" color="foreground" onClick={logout}>Logout</Link>
          </NavbarItem>
          <NavbarItem>
            {
              // TODO: this link as a button, which will send a POST to /api/delete (or something similar)
            }
            <Link href="/" color="danger" onClick={deleteAccount}>Delete Account</Link>
          </NavbarItem>
          </>
        }
      </NavbarContent>
    </Navbar>
  )
}
