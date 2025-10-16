import { useState } from "react";
import { Zap, Shield, Users, BarChart3, Globe2, Download } from "lucide-react";

export default function Features() {
  const [hoveredCard, setHoveredCard] = useState(null);

  const features = [
    {
      id: "multi-model",
      icon: Zap,
      title: "Multi-Model Chat",
      description: "Access GPT-4, Claude, Gemini, and Mistral with intelligent auto-routing for optimal responses.",
      isActive: true,
    },
    {
      id: "gdpr-compliance",
      icon: Shield,
      title: "GDPR Compliance",
      description: "Complete audit logs, data retention controls, and EU processing ensure full regulatory compliance.",
    },
    {
      id: "workspace-management",
      icon: Users,
      title: "Workspace Management",
      description: "Team collaboration with granular permissions, project folders, and secure conversation sharing.",
    },
    {
      id: "usage-analytics",
      icon: BarChart3,
      title: "Usage Analytics",
      description: "Monitor costs per user and model with 80% threshold alerts to prevent billing surprises.",
    },
    {
      id: "eu-hosting",
      icon: Globe2,
      title: "EU Data Processing",
      description: "All data processed and stored in Frankfurt with complete European data sovereignty.",
    },
    {
      id: "export-compliance",
      icon: Download,
      title: "Export & Compliance",
      description: "One-click conversation exports, DPA downloads, and complete data deletion capabilities.",
    },
  ];

  const isCardActive = (feature) => {
    return feature.isActive || hoveredCard === feature.id;
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;600&display=swap"
        rel="stylesheet"
      />

      <section id="features" className="py-20 md:py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Section heading */}
          <div className="text-center mb-16">
            <h2
              className="text-4xl md:text-6xl leading-tight text-[#0A0A0A] mb-6"
              style={{
                fontFamily: "Playfair Display, serif",
                fontWeight: "700",
              }}
            >
              Everything you need for <em className="font-bold">compliant</em> AI
            </h2>

            <p
              className="text-lg md:text-xl text-[#6B7280] max-w-3xl mx-auto"
              style={{
                fontFamily: "Inter, system-ui, sans-serif",
              }}
            >
              A complete AI platform designed for European businesses with built-in compliance, 
              security, and team collaboration features.
            </p>
          </div>

          {/* Feature cards grid - 3x2 layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => {
              const IconComponent = feature.icon;
              const active = isCardActive(feature);

              return (
                <div
                  key={feature.id}
                  role="button"
                  tabIndex={0}
                  className={`
                    relative p-8 rounded-2xl border-2 transition-all duration-200 ease-out cursor-pointer
                    focus:outline-none focus:ring-2 focus:ring-[#FF7A1A] focus:ring-offset-2
                    ${
                      active
                        ? "bg-[#0A0A0A] border-[#0A0A0A] shadow-xl"
                        : "bg-white border-[#E5E7EB] hover:border-[#FF7A1A] hover:shadow-lg"
                    }
                  `}
                  onMouseEnter={() => setHoveredCard(feature.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Icon container */}
                  <div
                    className={`
                      w-16 h-16 rounded-xl border-2 flex items-center justify-center mb-6 transition-all duration-200 ease-out
                      ${
                        active
                          ? "bg-[#FF7A1A] border-[#FF7A1A]"
                          : "bg-[#F4F5F7] border-[#E5E7EB]"
                      }
                    `}
                  >
                    <IconComponent
                      size={28}
                      strokeWidth={1.5}
                      className={`transition-all duration-200 ease-out ${
                        active
                          ? "text-white"
                          : "text-[#FF7A1A]"
                      }`}
                    />
                  </div>

                  {/* Title */}
                  <h3
                    className={`
                      text-xl font-semibold mb-3 transition-all duration-200 ease-out
                      ${active ? "text-white" : "text-[#0A0A0A]"}
                    `}
                    style={{
                      fontFamily: "Inter, system-ui, sans-serif",
                    }}
                  >
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p
                    className={`
                      text-base leading-relaxed transition-all duration-200 ease-out
                      ${active ? "text-[#E5E7EB]" : "text-[#6B7280]"}
                    `}
                    style={{
                      fontFamily: "Inter, system-ui, sans-serif",
                    }}
                  >
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <a
              href="/account/signup"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#FF7A1A] hover:bg-[#E6691A] text-white rounded-xl font-semibold text-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#FF7A1A] focus:ring-offset-2 shadow-lg hover:shadow-xl"
            >
              Start Free Trial
            </a>
          </div>
        </div>
      </section>
    </>
  );
}