
import React, { useState } from 'react';

type Sections = {
  [key: string]: React.RefObject<HTMLElement>;
};

interface HeaderProps {
  sections: Sections;
}

const navLinks = [
  { href: 'home', label: 'Home' },
  { href: 'about', label: 'About' },
  { href: 'skills', label: 'Skills' },
  { href: 'portfolio', label: 'Portfolio' },
  { href: 'top-edits', label: 'My Top Edits' },
  { href: 'contact', label: 'Contact' },
];

const Header: React.FC<HeaderProps> = ({ sections }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleScrollTo = (id: string) => {
    sections[id]?.current?.scrollIntoView({
      behavior: 'smooth',
    });
    setIsNavOpen(false);
  };

  return (
    <header className="bg-gradient-to-br from-[rgba(230,200,215,0.92)] to-[rgba(200,220,240,0.92)] py-5 shadow-lg fixed w-full top-0 z-50 backdrop-blur-md border-b border-white/30 animate-headerSlide">
      <div className="container w-[90%] max-w-7xl mx-auto">
        <nav className="flex justify-between items-center">
          <a href="#home" onClick={(e) => { e.preventDefault(); handleScrollTo('home'); }} className="text-2xl font-bold bg-gradient-to-br from-[#8B5E8E] to-[#C8A8C8] bg-clip-text text-transparent no-underline flex items-center gap-2 transition-transform duration-300 hover:scale-105 hover:drop-shadow-[0_0_15px_rgba(200,168,200,0.4)]">
            <span className="animate-logoTextBounce">Achmad</span>
            <span className="w-2.5 h-2.5 bg-gradient-to-br from-[#E8B4D0] to-[#C8A8C8] rounded-full animate-logoDotPulse shadow-[0_0_10px_rgba(200,168,200,0.6)]"></span>
          </a>
          <ul className={`lg:flex items-center list-none gap-0 ${isNavOpen ? 'flex flex-col absolute top-full right-0 bg-white/90 w-full text-center shadow-lg p-5' : 'hidden'}`}>
            {navLinks.map((link, index) => (
              <li key={link.href} className="my-2 lg:my-0 lg:mx-7">
                <a
                  href={`#${link.href}`}
                  onClick={(e) => { e.preventDefault(); handleScrollTo(link.href); }}
                  className="text-[#5c3d2e] no-underline font-medium text-sm transition-all duration-300 relative hover:text-[#8B5E8E] hover:-translate-y-0.5 after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-[#E8B4D0] after:to-[#C8A8C8] after:transition-all after:duration-300 after:rounded-sm hover:after:w-full"
                  style={isNavOpen ? { animation: `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s` } : {}}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="lg:hidden cursor-pointer flex flex-col gap-1.5" onClick={() => setIsNavOpen(!isNavOpen)}>
            <div className={`w-6 h-0.5 bg-gradient-to-br from-[#E8B4D0] to-[#C8A8C8] transition-all duration-300 rounded-sm ${isNavOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
            <div className={`w-6 h-0.5 bg-gradient-to-br from-[#E8B4D0] to-[#C8A8C8] transition-all duration-300 rounded-sm ${isNavOpen ? 'opacity-0' : ''}`}></div>
            <div className={`w-6 h-0.5 bg-gradient-to-br from-[#E8B4D0] to-[#C8A8C8] transition-all duration-300 rounded-sm ${isNavOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
