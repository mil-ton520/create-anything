import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "Security", href: "#security" },
    { name: "Enterprise", href: "#enterprise" },
  ];

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      <header
        className="bg-white border-b border-gray-200 h-16 px-6"
        style={{ fontFamily: "Inter, system-ui, sans-serif" }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between h-full">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[#FF7A1A] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <span className="text-[#0A0A0A] font-semibold text-lg">
              EuroAI Hub
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-[#0A0A0A] opacity-80 hover:opacity-100 hover:text-[#FF7A1A] transition-colors duration-150 font-medium text-base focus:outline-none focus:ring-2 focus:ring-[#FF7A1A] focus:ring-offset-2 rounded-lg px-2 py-1"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="/sign-in"
              className="px-6 py-3 rounded-xl border border-[#E5E7EB] text-[#0A0A0A] font-semibold text-sm hover:bg-[#F4F5F7] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#FF7A1A] focus:ring-offset-2"
            >
              Sign In
            </a>
            <a
              href="/sign-up"
              className="px-6 py-3 rounded-xl bg-[#FF7A1A] hover:bg-[#E6691A] text-white font-semibold text-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#FF7A1A] focus:ring-offset-2"
            >
              Start Free Trial
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-[#0A0A0A] focus:outline-none focus:ring-2 focus:ring-[#FF7A1A] focus:ring-offset-2 rounded-lg"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Panel */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-white z-50 flex flex-col">
            {/* Mobile Header */}
            <div className="flex items-center justify-between h-16 px-6 border-b border-[#E5E7EB]">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[#FF7A1A] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <span className="text-[#0A0A0A] font-semibold text-lg">
                  EuroAI Hub
                </span>
              </div>
              <button
                className="p-2 text-[#0A0A0A] focus:outline-none focus:ring-2 focus:ring-[#FF7A1A] focus:ring-offset-2 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close mobile menu"
              >
                <X size={24} />
              </button>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex-1 px-6 py-6 space-y-4">
              {menuItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block py-3 text-[#0A0A0A] opacity-90 hover:opacity-100 hover:text-[#FF7A1A] transition-colors duration-150 font-medium text-base border-b border-[#E5E7EB] last:border-b-0"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
            </nav>

            {/* Mobile Action Buttons */}
            <div className="px-6 py-6 space-y-3 border-t border-[#E5E7EB]">
              <a
                href="/sign-in"
                className="block w-full px-6 py-3 rounded-xl border border-[#E5E7EB] text-[#0A0A0A] font-semibold text-sm text-center hover:bg-[#F4F5F7] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#FF7A1A] focus:ring-offset-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </a>
              <a
                href="/sign-up"
                className="block w-full px-6 py-3 rounded-xl bg-[#FF7A1A] hover:bg-[#E6691A] text-white font-semibold text-sm text-center transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#FF7A1A] focus:ring-offset-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Start Free Trial
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
