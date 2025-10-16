export default function Footer() {
  const navigationLinks = [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "Security", href: "/security" },
    { name: "Privacy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
    { name: "DPA", href: "/dpa-download" },
  ];

  const legalLinks = [
    { name: "Terms", href: "/terms" },
    { name: "Privacy", href: "/privacy" },
    { name: "GDPR", href: "/gdpr" },
  ];

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      <footer
        className="bg-[#F4F5F7] border-t border-[#E5E7EB] py-16 px-6"
        style={{ fontFamily: "Inter, system-ui, sans-serif" }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Logo and Brand - Centered */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div className="w-8 h-8 bg-[#FF7A1A] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span
                className="text-[#0A0A0A] text-lg font-semibold"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                EuroAI Hub
              </span>
            </div>

            {/* Navigation Links */}
            <nav>
              <div className="flex flex-wrap items-center justify-center gap-8">
                {navigationLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-[#0A0A0A] opacity-80 hover:opacity-100 hover:text-[#FF7A1A] text-base font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#FF7A1A] focus:ring-offset-2 rounded px-2 py-1"
                    style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </nav>
          </div>

          {/* Bottom row - Copyright and Legal Links */}
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 pt-8 border-t border-[#E5E7EB]">
            {/* Copyright */}
            <div
              className="text-[#6B7280] text-sm font-normal order-2 md:order-1"
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              © 2025 EuroAI Hub. All rights reserved. EU-based AI platform.
            </div>

            {/* Legal Links */}
            <div className="flex items-center order-1 md:order-2">
              {legalLinks.map((link, index) => (
                <div key={link.name} className="flex items-center">
                  <a
                    href={link.href}
                    className="text-[#6B7280] hover:text-[#0A0A0A] text-sm font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#FF7A1A] focus:ring-offset-2 rounded px-2 py-1"
                    style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                  >
                    {link.name}
                  </a>
                  {index < legalLinks.length - 1 && (
                    <span className="text-[#6B7280] text-sm mx-4">|</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}