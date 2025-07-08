import React from 'react';
import Link from "next/link";
import Image from "next/image";

const user = {};

const Navbar = () => {
    return (
       <header className="navbar">
<nav>
    <Link href="/">
        <Image src="/assets/icons/logo.svg" alt="CapCast Logo" width={42} height={42}/>
        <h1>CapCast</h1>
    </Link>
    {user && (
        <figure>
            <button>
                <Image src="/assets/images/dummy.jpg" alt="User Image" width={32} height={32} className="rounded-full aspect-square"/>
            </button>
            <button className="cursor-pointer">
                <Image src="/assets/icons/logout.svg" alt="logout" width={24} height={24} className="rotate-180"></Image>
            </button>
        </figure>
    )}
</nav>
       </header>
    );
};

export default Navbar;