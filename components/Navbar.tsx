import { Linden_Hill } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <header>
      <nav>
        <Link href="/" className="logo">
          <Image alt="logl" src="/icons/logo.png" width={24} height={24} />
          <p>DevEvents</p>
        </Link>
        <ul>
          <Link href="/">Home</Link>
          <Link href="/">Events</Link>
          <Link href="/">Create Events</Link>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
