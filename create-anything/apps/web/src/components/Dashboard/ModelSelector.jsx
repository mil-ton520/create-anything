import { useState, useEffect, useRef } from "react";
import { ChevronDown, Zap } from "lucide-react";
import { models } from "@/constants/models";

export function ModelSelector({
  selectedModel,
  onModelSelect,
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousemove", handleClickOutside);
  }, []);

  const selectedModelData =
    models.find((m) => m.id === selectedModel) || models[0];

  const filteredModels = models.filter((model) => {
    if (activeTab === "gratis") return model.category === "Grátis";
    if (activeTab === "baratos")
      return ["Ultra Baratos", "Económicos"].includes(model.category);
    if (activeTab === "programacao") return model.category === "Programação";
    if (activeTab === "raciocinio") return model.category === "Raciocínio";
    if (activeTab === "multimodal") return model.category === "Multimodal";
    return true; // "all" tab
  });

  // Group by category for display
  const modelsByCategory = filteredModels.reduce((groups, model) => {
    const category = model.category || "Outros";
    if (!groups[category]) groups[category] = [];
    groups[category].push(model);
    return groups;
  }, {});

  const getBadgeColor = (badge) => {
    switch (badge) {
      case "Grátis":
        return "bg-green-100 text-green-700";
      case "Ultra Barato":
        return "bg-blue-100 text-blue-700";
      case "Económico":
        return "bg-cyan-100 text-cyan-700";
      case "Equilibrado":
        return "bg-yellow-100 text-yellow-700";
      case "Poderoso":
        return "bg-orange-100 text-orange-700";
      case "Premium":
        return "bg-purple-100 text-purple-700";
      case "Programação":
        return "bg-indigo-100 text-indigo-700";
      case "Raciocínio":
        return "bg-pink-100 text-pink-700";
      case "Criativo":
        return "bg-rose-100 text-rose-700";
      case "Visão":
        return "bg-emerald-100 text-emerald-700";
      case "Áudio":
        return "bg-teal-100 text-teal-700";
      case "Chinês":
        return "bg-red-100 text-red-700";
      case "Inteligente":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleModelSelect = (model) => {
    onModelSelect(model.id);
    setIsOpen(false);
  };

  if (!selectedModelData) return null;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 bg-[#F4F5F7] border border-[#E5E7EB] rounded-lg hover:bg-[#E5E7EB] transition-colors duration-150"
      >
        <span className="text-lg">{selectedModelData.icon}</span>
        <div className="text-left">
          <div className="font-semibold text-[#0A0A0A] text-sm">
            {selectedModelData.name}
          </div>
          <div className="text-xs text-[#6B7280]">
            {selectedModelData.badge}
          </div>
        </div>
        <ChevronDown size={16} className="text-[#6B7280]" />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-[480px] bg-white border border-[#E5E7EB] rounded-xl shadow-lg py-4 z-20 max-h-[500px] overflow-y-auto">
          {/* Tabs */}
          <div className="px-4 mb-4">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "all"
                    ? "bg-[#FF7A1A] text-white"
                    : "bg-[#F4F5F7] text-[#6B7280] hover:bg-[#E5E7EB]"
                }`}
              >
                🌟 Todos
              </button>
              <button
                onClick={() => setActiveTab("gratis")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "gratis"
                    ? "bg-[#FF7A1A] text-white"
                    : "bg-[#F4F5F7] text-[#6B7280] hover:bg-[#E5E7EB]"
                }`}
              >
                🆓 Grátis
              </button>
              <button
                onClick={() => setActiveTab("baratos")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "baratos"
                    ? "bg-[#FF7A1A] text-white"
                    : "bg-[#F4F5F7] text-[#6B7280] hover:bg-[#E5E7EB]"
                }`}
              >
                💰 Baratos
              </button>
              <button
                onClick={() => setActiveTab("programacao")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "programacao"
                    ? "bg-[#FF7A1A] text-white"
                    : "bg-[#F4F5F7] text-[#6B7280] hover:bg-[#E5E7EB]"
                }`}
              >
                💻 Código
              </button>
              <button
                onClick={() => setActiveTab("raciocinio")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "raciocinio"
                    ? "bg-[#FF7A1A] text-white"
                    : "bg-[#F4F5F7] text-[#6B7280] hover:bg-[#E5E7EB]"
                }`}
              >
                🧠 Raciocínio
              </button>
              <button
                onClick={() => setActiveTab("multimodal")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "multimodal"
                    ? "bg-[#FF7A1A] text-white"
                    : "bg-[#F4F5F7] text-[#6B7280] hover:bg-[#E5E7EB]"
                }`}
              >
                👁️ Visão
              </button>
            </div>
          </div>

          {/* Models by Category */}
          <div className="px-4 space-y-3">
            {Object.entries(modelsByCategory).map(
              ([category, categoryModels]) => (
                <div key={category}>
                  {/* Category header */}
                  <div className="text-xs font-semibold text-[#6B7280] mb-2 px-2">
                    {category === "Auto"
                      ? "🤖 " + category
                      : category === "Grátis"
                        ? "🆓 " + category
                        : category === "Ultra Baratos"
                          ? "💰 " + category
                          : category === "Económicos"
                            ? "💸 " + category
                            : category === "Equilibrados"
                              ? "⚖️ " + category
                              : category === "Poderosos"
                                ? "💪 " + category
                                : category === "Programação"
                                  ? "👨‍💻 " + category
                                  : category === "Raciocínio"
                                    ? "🧠 " + category
                                    : category === "Criativo"
                                      ? "🎭 " + category
                                      : category === "Multimodal"
                                        ? "👁️ " + category
                                        : category === "Premium"
                                          ? "🏆 " + category
                                          : category === "Regional"
                                            ? "🌍 " + category
                                            : category === "Especializado"
                                              ? "🔬 " + category
                                              : category}
                  </div>

                  {/* Models grid */}
                  <div className="grid grid-cols-2 gap-2">
                    {categoryModels.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => handleModelSelect(model)}
                        className={`p-3 rounded-lg border-2 transition-all duration-150 text-left ${
                          selectedModel === model.id
                            ? "border-[#FF7A1A] bg-orange-50"
                            : "border-[#E5E7EB] hover:border-[#FF7A1A]"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm">{model.icon}</span>
                          <div className="font-semibold text-[#0A0A0A] text-xs truncate">
                            {model.name}
                          </div>
                        </div>
                        <div className="text-xs text-[#6B7280] mb-2 line-clamp-2">
                          {model.description}
                        </div>
                        <div className="flex items-center justify-between">
                          <div
                            className={`px-2 py-1 text-xs rounded-full ${getBadgeColor(model.badge)}`}
                          >
                            {model.badge}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      )}
    </div>
  );
}
