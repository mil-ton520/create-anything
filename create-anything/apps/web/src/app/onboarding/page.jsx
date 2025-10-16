"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Check } from "lucide-react";
import useUser from "@/utils/useUser";

export default function OnboardingPage() {
  const { data: user, loading: userLoading } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 2: Company information
  const [companyName, setCompanyName] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [industry, setIndustry] = useState("");
  const [country, setCountry] = useState("");

  // Step 3: Plan selection
  const [selectedPlan, setSelectedPlan] = useState("starter");

  const companySizes = [
    { value: "1-5", label: "1-5 employees" },
    { value: "6-10", label: "6-10 employees" },
    { value: "11-25", label: "11-25 employees" },
    { value: "26-50", label: "26-50 employees" },
    { value: "51-100", label: "51-100 employees" },
    { value: "100+", label: "100+ employees" },
  ];

  const industries = [
    { value: "technology", label: "Technology" },
    { value: "marketing", label: "Marketing & Advertising" },
    { value: "consulting", label: "Consulting" },
    { value: "finance", label: "Finance" },
    { value: "healthcare", label: "Healthcare" },
    { value: "education", label: "Education" },
    { value: "retail", label: "Retail & E-commerce" },
    { value: "manufacturing", label: "Manufacturing" },
    { value: "other", label: "Other" },
  ];

  const countries = [
    { value: "PT", label: "Portugal" },
    { value: "ES", label: "Spain" },
    { value: "FR", label: "France" },
    { value: "DE", label: "Germany" },
  ];

  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: "60",
      description: "Perfect for small teams getting started",
      features: [
        "Up to 10 users",
        "500,000 words/month",
        "All AI models",
        "GDPR compliance",
      ],
    },
    {
      id: "business",
      name: "Business",
      price: "299",
      description: "For growing teams with advanced needs",
      features: [
        "Up to 25 users",
        "Unlimited words",
        "Priority access",
        "SSO/SAML",
      ],
      popular: true,
    },
  ];

  // Redirect if user has already completed onboarding
  useEffect(() => {
    if (!userLoading && user && user.onboarding_completed) {
      window.location.href = "/dashboard";
    }
  }, [user, userLoading]);

  const handleNext = async () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!companyName || !companySize || !industry || !country) {
        alert("Please fill in all fields");
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      await completeOnboarding();
    }
  };

  const completeOnboarding = async () => {
    setLoading(true);
    try {
      // Update user profile
      const profileResponse = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: companyName,
          company_size: companySize,
          industry,
          country,
          locale:
            country === "PT"
              ? "pt-PT"
              : country === "ES"
                ? "es-ES"
                : country === "FR"
                  ? "fr-FR"
                  : "de-DE",
          onboarding_completed: true,
        }),
      });

      if (!profileResponse.ok) {
        throw new Error("Failed to update profile");
      }

      // Create default workspace
      const workspaceResponse = await fetch("/api/workspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${companyName} Workspace`,
          description: "Your default workspace",
          plan_type: selectedPlan,
        }),
      });

      if (!workspaceResponse.ok) {
        throw new Error("Failed to create workspace");
      }

      // Redirect to dashboard
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Onboarding error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-[#F4F5F7] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-[#FF7A1A] rounded-lg animate-pulse mx-auto mb-4"></div>
          <p className="text-[#6B7280]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      <div
        className="min-h-screen bg-[#F4F5F7] py-12 px-6"
        style={{ fontFamily: "Inter, system-ui, sans-serif" }}
      >
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className="w-8 h-8 bg-[#FF7A1A] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <span className="text-[#0A0A0A] font-semibold text-lg">
              EuroAI Hub
            </span>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step < currentStep
                      ? "bg-[#FF7A1A] text-white"
                      : step === currentStep
                        ? "bg-[#FF7A1A] text-white"
                        : "bg-[#E5E7EB] text-[#6B7280]"
                  }`}
                >
                  {step < currentStep ? <Check size={16} /> : step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-12 h-1 mx-2 ${
                      step < currentStep ? "bg-[#FF7A1A]" : "bg-[#E5E7EB]"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <h1 className="text-3xl font-bold text-[#0A0A0A] mb-4">
            {currentStep === 1 && "Welcome to EuroAI Hub"}
            {currentStep === 2 && "Tell us about your company"}
            {currentStep === 3 && "Choose your plan"}
          </h1>

          <p className="text-[#6B7280] text-lg">
            {currentStep === 1 &&
              "Let's get you set up with a GDPR-compliant AI workspace"}
            {currentStep === 2 && "Help us customize your experience"}
            {currentStep === 3 && "Select a plan to start your free trial"}
          </p>
        </div>

        {/* Step content */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#E5E7EB]">
            {/* Step 1: Welcome */}
            {currentStep === 1 && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-[#FF7A1A] rounded-2xl flex items-center justify-center mx-auto">
                  <span className="text-white font-bold text-xl">AI</span>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-[#0A0A0A] mb-4">
                    Welcome, {user?.name}!
                  </h2>
                  <p className="text-[#6B7280] leading-relaxed">
                    You're about to join the most secure and compliant AI
                    platform in Europe. Let's take a few moments to set up your
                    workspace and ensure everything meets your specific
                    requirements.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-left">
                  <div className="flex items-start gap-3">
                    <Check size={20} className="text-[#FF7A1A] mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-[#0A0A0A]">
                        GDPR Compliant
                      </h3>
                      <p className="text-sm text-[#6B7280]">
                        Full European data protection
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check size={20} className="text-[#FF7A1A] mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-[#0A0A0A]">
                        4 AI Models
                      </h3>
                      <p className="text-sm text-[#6B7280]">
                        GPT-4, Claude, Gemini, Mistral
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check size={20} className="text-[#FF7A1A] mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-[#0A0A0A]">
                        EU Processing
                      </h3>
                      <p className="text-sm text-[#6B7280]">
                        All data stays in Frankfurt
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check size={20} className="text-[#FF7A1A] mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-[#0A0A0A]">
                        14-Day Trial
                      </h3>
                      <p className="text-sm text-[#6B7280]">
                        No credit card required
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Company Info */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-[#0A0A0A] mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Enter your company name"
                    className="w-full px-4 py-4 bg-[#F4F5F7] border border-[#E5E7EB] rounded-xl text-[#0A0A0A] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#FF7A1A] focus:border-transparent transition-all duration-150"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#0A0A0A] mb-2">
                    Company Size
                  </label>
                  <select
                    value={companySize}
                    onChange={(e) => setCompanySize(e.target.value)}
                    className="w-full px-4 py-4 bg-[#F4F5F7] border border-[#E5E7EB] rounded-xl text-[#0A0A0A] focus:outline-none focus:ring-2 focus:ring-[#FF7A1A] focus:border-transparent transition-all duration-150"
                  >
                    <option value="">Select company size</option>
                    {companySizes.map((size) => (
                      <option key={size.value} value={size.value}>
                        {size.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#0A0A0A] mb-2">
                    Industry
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-4 py-4 bg-[#F4F5F7] border border-[#E5E7EB] rounded-xl text-[#0A0A0A] focus:outline-none focus:ring-2 focus:ring-[#FF7A1A] focus:border-transparent transition-all duration-150"
                  >
                    <option value="">Select industry</option>
                    {industries.map((ind) => (
                      <option key={ind.value} value={ind.value}>
                        {ind.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#0A0A0A] mb-2">
                    Country
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-4 bg-[#F4F5F7] border border-[#E5E7EB] rounded-xl text-[#0A0A0A] focus:outline-none focus:ring-2 focus:ring-[#FF7A1A] focus:border-transparent transition-all duration-150"
                  >
                    <option value="">Select country</option>
                    {countries.map((country) => (
                      <option key={country.value} value={country.value}>
                        {country.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Step 3: Plan Selection */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`relative rounded-xl border-2 p-6 cursor-pointer transition-all duration-200 ${
                        selectedPlan === plan.id
                          ? "border-[#FF7A1A] bg-orange-50"
                          : "border-[#E5E7EB] hover:border-[#FF7A1A]"
                      }`}
                      onClick={() => setSelectedPlan(plan.id)}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <div className="bg-[#FF7A1A] text-white px-3 py-1 rounded-lg text-sm font-semibold">
                            Popular
                          </div>
                        </div>
                      )}

                      <div className="text-center mb-4">
                        <h3 className="text-xl font-semibold text-[#0A0A0A] mb-2">
                          {plan.name}
                        </h3>
                        <div className="mb-2">
                          <span className="text-3xl font-bold text-[#0A0A0A]">
                            €{plan.price}
                          </span>
                          <span className="text-[#6B7280]">/month</span>
                        </div>
                        <p className="text-sm text-[#6B7280]">
                          {plan.description}
                        </p>
                      </div>

                      <ul className="space-y-2">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <Check size={16} className="text-[#FF7A1A]" />
                            <span className="text-sm text-[#0A0A0A]">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="text-center text-sm text-[#6B7280]">
                  You can change your plan anytime. Your 14-day free trial
                  starts now.
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-[#E5E7EB]">
              <div>
                {currentStep > 1 && (
                  <button
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="px-6 py-3 text-[#6B7280] hover:text-[#0A0A0A] font-semibold transition-colors duration-150"
                  >
                    Back
                  </button>
                )}
              </div>

              <button
                onClick={handleNext}
                disabled={loading}
                className="flex items-center gap-2 px-8 py-4 bg-[#FF7A1A] hover:bg-[#E6691A] disabled:opacity-50 text-white rounded-xl font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#FF7A1A] focus:ring-offset-2"
              >
                {loading
                  ? "Setting up..."
                  : currentStep === 3
                    ? "Complete Setup"
                    : "Continue"}
                {!loading && <ArrowRight size={16} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
