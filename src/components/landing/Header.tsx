import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const menuItems = [
    { label: 'ARTICLES', href: '#articles' },
    { label: 'SHOP', href: '#shop' },
    { label: 'SUBMIT', href: '#submit' },
  ];

  return (
    <header className="relative bg-[#222222]">
      <div className="w-full h-[1px] bg-white/20" />
      <nav className="container mx-auto px-4 py-5">
        <div className="flex items-center justify-between">
          {/* Left Navigation */}
          <div className="hidden md:flex items-center space-x-12">
            {menuItems.slice(0, Math.ceil(menuItems.length / 2)).map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm tracking-wider text-white hover:text-white/70 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Center Logo Space */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <span className="text-lg font-light tracking-wider text-white">EcoStep</span>
          </div>

          {/* Right Navigation */}
          <div className="hidden md:flex items-center space-x-12">
            {menuItems.slice(Math.ceil(menuItems.length / 2)).map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm tracking-wider text-white hover:text-white/70 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white hover:text-white/70 transition-colors"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4"
            >
              <div className="py-4 space-y-4 bg-black/30">
                {menuItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="block text-center text-sm tracking-wider text-white hover:text-white/70 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      <div className="w-full h-[1px] bg-white/20" />
    </header>
  );
} 