import { Check, ArrowRight } from "lucide-react";

export default function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "60",
      period: "month",
      description: "Perfect for small teams getting started with AI",
      features: [
        "Up to 10 users",
        "500,000 words/month",
        "All AI models (GPT-4, Claude, Gemini, Mistral)",
        "Basic workspace management",
        "GDPR compliance tools",
        "EU data processing",
        "Email support",
        "Audit logs (30 days)"
      ],
      cta: "Start Free Trial",
      ctaLink: "/account/signup",
      popular: false,
    },
    {
      name: "Business",
      price: "299",
      period: "month",
      description: "For growing teams with advanced compliance needs",
      features: [
        "Up to 25 users",
        "Unlimited words",
        "All AI models with priority access",
        "Advanced workspace management",
        "Full GDPR compliance suite",
        "SSO/SAML integration",
        "API access",
        "24/7 priority support",
        "Extended audit logs (2 years)",
        "Custom retention policies",
        "DPA management"
      ],
      cta: "Start Free Trial",
      ctaLink: "/account/signup",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact us",
      description: "For large organizations with custom requirements",
      features: [
        "Unlimited users",
        "Unlimited usage",
        "Dedicated AI model instances",
        "Custom integrations",
        "On-premise deployment options",
        "Advanced audit & reporting",
        "Dedicated account manager",
        "Custom SLA",
        "White-label options",
        "Custom compliance frameworks"
      ],
      cta: "Contact Sales",
      ctaLink: "#contact",
      popular: false,
    },
  ];

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;600&display=swap"
        rel="stylesheet"
      />

      <section id="pricing" className="py-20 md:py-32 px-6 bg-[#F4F5F7]">
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
              Simple, <em className="font-bold">transparent</em> pricing
            </h2>

            <p
              className="text-lg md:text-xl text-[#6B7280] max-w-3xl mx-auto mb-8"
              style={{
                fontFamily: "Inter, system-ui, sans-serif",
              }}
            >
              No surprises, no hidden fees. Start with a 14-day free trial, 
              then choose the plan that fits your team.
            </p>

            {/* Additional user pricing */}
            <div className="inline-flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-xl px-4 py-2 text-sm text-[#6B7280]">
              <span>Additional users: €8/month each</span>
            </div>
          </div>

          {/* Pricing cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`
                  relative rounded-2xl border-2 p-8 bg-white transition-all duration-200 hover:shadow-xl
                  ${
                    plan.popular
                      ? "border-[#FF7A1A] shadow-lg"
                      : "border-[#E5E7EB] hover:border-[#FF7A1A]"
                  }
                `}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-[#FF7A1A] text-white px-4 py-2 rounded-lg text-sm font-semibold">
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Plan header */}
                <div className="text-center mb-8">
                  <h3
                    className="text-2xl font-semibold text-[#0A0A0A] mb-2"
                    style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                  >
                    {plan.name}
                  </h3>
                  
                  <div className="mb-4">
                    <span
                      className="text-4xl font-bold text-[#0A0A0A]"
                      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                    >
                      {plan.price === "Custom" ? "" : "€"}{plan.price}
                    </span>
                    {plan.price !== "Custom" && (
                      <span className="text-[#6B7280] text-lg">/{plan.period}</span>
                    )}
                  </div>
                  
                  <p
                    className="text-[#6B7280] text-sm"
                    style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                  >
                    {plan.description}
                  </p>
                </div>

                {/* Features list */}
                <div className="mb-8">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#FF7A1A] flex items-center justify-center mt-0.5">
                          <Check size={12} className="text-white" strokeWidth={3} />
                        </div>
                        <span
                          className="text-[#0A0A0A] text-sm"
                          style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA button */}
                <a
                  href={plan.ctaLink}
                  className={`
                    flex items-center justify-center gap-2 w-full px-6 py-4 rounded-xl font-semibold text-base transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#FF7A1A] focus:ring-offset-2
                    ${
                      plan.popular
                        ? "bg-[#FF7A1A] hover:bg-[#E6691A] text-white shadow-lg hover:shadow-xl"
                        : "bg-white border-2 border-[#E5E7EB] hover:border-[#FF7A1A] text-[#0A0A0A] hover:bg-[#F4F5F7]"
                    }
                  `}
                  style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                >
                  {plan.cta}
                  {plan.name !== "Enterprise" && <ArrowRight size={16} />}
                </a>
              </div>
            ))}
          </div>

          {/* Bottom section */}
          <div className="text-center mt-16">
            <p
              className="text-[#6B7280] text-lg mb-8"
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              All plans include 14-day free trial • No setup fees • Cancel anytime
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <a
                href="#contact"
                className="text-[#FF7A1A] hover:text-[#E6691A] font-semibold underline focus:outline-none focus:ring-2 focus:ring-[#FF7A1A] focus:ring-offset-2 rounded"
              >
                Need a custom solution?
              </a>
              <span className="text-[#6B7280]">•</span>
              <a
                href="#security"
                className="text-[#FF7A1A] hover:text-[#E6691A] font-semibold underline focus:outline-none focus:ring-2 focus:ring-[#FF7A1A] focus:ring-offset-2 rounded"
              >
                View security & compliance
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}