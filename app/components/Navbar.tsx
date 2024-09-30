"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import '../styles/style.css';
import { RxHamburgerMenu } from 'react-icons/rx';
import { IoClose } from "react-icons/io5";

const Navbar = () => {
  const [activeLink, setActiveLink] = useState<string>('/');
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      setActiveLink(pathname);
    }
  }, [pathname]);

  const handleClick = (link: string) => {
    setActiveLink(link);
    toggleMenu();
  };

  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="burgerMenu display">
        <RxHamburgerMenu onClick={toggleMenu} />
      </div>

      <nav className={`nav-menu ${isOpen ? 'open' : 'closed'}`}>
        <div className="closeMenu display">
          <IoClose onClick={toggleMenu} />
        </div>
        <ul>
          <li id='h1'>
            <h1>Max's Project</h1>
          </li>
          <Link href="/" onClick={() => handleClick('/')}>
            <li className={activeLink === '/' ? 'active' : ''}>
              <p>Accueil</p>
            </li>
          </Link>
          <Link href="/person" onClick={() => handleClick('/person')}>
            <li className={activeLink === '/person' ? 'active' : ''}>
              <p>Liste des personnes</p>
            </li>
          </Link>
          <Link href="/animal" onClick={() => handleClick('/animal')}>
            <li className={activeLink === '/animal' ? 'active' : ''}>
              <p>Liste des animaux</p>
            </li>
          </Link>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
