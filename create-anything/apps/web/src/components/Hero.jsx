import { useState, useEffect } from "react";
import { ArrowRight, Shield, Clock, Globe } from "lucide-react";

export default function Hero() {
  const [featuresVisible, setFeaturesVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFeaturesVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;600&display=swap"
        rel="stylesheet"
      />

      <section
        className="relative py-20 md:py-32 px-6 bg-gradient-to-b from-[#F4F5F7] to-white"
        style={{ fontFamily: "Inter, system-ui, sans-serif" }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Headline Block */}
          <div className="text-center mb-16">
            <h1
              className="text-4xl md:text-6xl lg:text-7xl leading-tight md:leading-[1.1] text-[#0A0A0A] mb-6 max-w-5xl mx-auto"
              style={{
                fontFamily: "Playfair Display, serif",
                letterSpacing: "-0.02em",
              }}
            >
              Unite <em className="font-bold">all AI models</em> in one 
              <br />
              GDPR-compliant dashboard
            </h1>

            <p className="text-lg md:text-xl text-[#6B7280] mb-8 max-w-3xl mx-auto leading-relaxed">
              Access GPT-4, Claude, Gemini, and Mistral through a single, secure platform. 
              Built for European teams with complete data protection and audit trails.
            </p>

            {/* Primary CTAs */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16">
              <a
                href="/account/signup"
                className="flex items-center gap-3 px-8 py-4 bg-[#FF7A1A] hover:bg-[#E6691A] text-white rounded-xl font-semibold text-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#FF7A1A] focus:ring-offset-2 shadow-lg hover:shadow-xl"
              >
                Start 14-Day Free Trial
                <ArrowRight size={20} />
              </a>
              
              <a
                href="#demo"
                className="flex items-center gap-3 px-8 py-4 bg-white border-2 border-[#E5E7EB] hover:border-[#FF7A1A] text-[#0A0A0A] rounded-xl font-semibold text-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#FF7A1A] focus:ring-offset-2"
              >
                Watch Demo
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-[#6B7280] mb-16">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-[#FF7A1A]" />
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe size={16} className="text-[#FF7A1A]" />
                <span>EU Data Processing</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-[#FF7A1A]" />
                <span>&lt;10s Response Time</span>
              </div>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="relative max-w-6xl mx-auto">
            <div className="relative">
              {/* Main Dashboard Frame */}
              <div
                className="relative rounded-2xl border border-[#E5E7EB] overflow-hidden bg-white shadow-2xl"
                style={{ height: "600px" }}
              >
                {/* Dashboard Header */}
                <div className="bg-[#F4F5F7] border-b border-[#E5E7EB] p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-[#FF7A1A] rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-xs">AI</span>
                    </div>
                    <span className="font-semibold text-[#0A0A0A]">EuroAI Hub</span>
                  </div>
                  
                  {/* Model Selector */}
                  <div className="flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-lg px-3 py-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-[#0A0A0A]">Auto Model</span>
                  </div>
                </div>

                {/* Chat Interface */}
                <div className="p-6 space-y-4">
                  {/* Sample Messages */}
                  <div className="bg-[#F4F5F7] rounded-xl p-4 max-w-2xl">
                    <p className="text-[#0A0A0A] text-sm">
                      "Analyze our Q3 marketing performance and suggest improvements for next quarter"
                    </p>
                  </div>
                  
                  <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 ml-8">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-4 h-4 bg-[#FF7A1A] rounded-full"></div>
                      <span className="text-xs text-[#6B7280]">GPT-4 • EU Processing</span>
                    </div>
                    <p className="text-[#0A0A0A] text-sm">
                      Based on your Q3 data, I've identified three key improvement areas for your marketing strategy...
                    </p>
                  </div>

                  {/* Compliance Label */}
                  <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                    <Shield size={12} className="text-green-500" />
                    <span>Conversation logged • GDPR compliant • Frankfurt processing</span>
                  </div>
                </div>

                {/* Floating Feature Callouts */}
                {featuresVisible && (
                  <>
                    {/* Multi-model indicator */}
                    <div
                      className="absolute top-20 right-4 bg-[#FF7A1A] text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg transition-all duration-300 opacity-100 translate-y-0"
                      style={{ transitionDelay: "150ms" }}
                    >
                      4 AI Models
                    </div>

                    {/* GDPR indicator */}
                    <div
                      className="absolute bottom-20 left-4 bg-[#0A0A0A] text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg transition-all duration-300 opacity-100 translate-y-0"
                      style={{ transitionDelay: "200ms" }}
                    >
                      GDPR Ready
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}