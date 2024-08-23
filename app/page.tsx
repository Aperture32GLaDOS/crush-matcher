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

export default function Home() {
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
        <NavbarItem>
          <Link href="/register" color="foreground">Register</Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/login" color="foreground">Login</Link>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
    <Divider className="my-4"/>
    <p>Welcome to the crush matcher!</p>
    </main>
  );
}
