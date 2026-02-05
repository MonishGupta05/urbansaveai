import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useApp } from "@/context/AppContext";
import { Leaf, Scale, Wallet, Check } from "lucide-react";

const modes = [
  {
    id: "eco" as const,
    label: "Eco Mode",
    icon: Leaf,
    description: "Maximum environmental impact",
    color: "eco",
    gradient: "gradient-eco",
    stats: { savings: "15-20%", comfort: "70%", sustainability: "100%" },
  },
  {
    id: "balanced" as const,
    label: "Balanced",
    icon: Scale,
    description: "Optimal comfort & savings",
    color: "balanced",
    gradient: "gradient-balanced",
    stats: { savings: "10-15%", comfort: "90%", sustainability: "70%" },
  },
  {
    id: "budget" as const,
    label: "Budget Mode",
    icon: Wallet,
    description: "Maximum cost savings",
    color: "budget",
    gradient: "gradient-budget",
    stats: { savings: "25-30%", comfort: "60%", sustainability: "50%" },
  },
];

export function ModeSelector() {
  const { preferences, updatePreferences } = useApp();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Energy Mode</CardTitle>
        <CardDescription>
          Select your priority to customize recommendations and savings estimates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-4">
          {modes.map((mode) => {
            const isSelected = preferences.mode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => updatePreferences({ mode: mode.id })}
                className={`relative p-6 rounded-xl border-2 text-left transition-all duration-300 ${
                  isSelected
                    ? `border-${mode.color} shadow-lg`
                    : "border-border hover:border-muted-foreground/50"
                }`}
              >
                {isSelected && (
                  <div
                    className={`absolute top-3 right-3 w-6 h-6 rounded-full ${mode.gradient} flex items-center justify-center`}
                  >
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}

                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    isSelected ? mode.gradient : "bg-muted"
                  }`}
                >
                  <mode.icon
                    className={`h-6 w-6 ${isSelected ? "text-white" : "text-muted-foreground"}`}
                  />
                </div>

                <h3 className="font-semibold text-lg mb-1">{mode.label}</h3>
                <p className="text-sm text-muted-foreground mb-4">{mode.description}</p>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Savings</span>
                    <span className="font-medium">{mode.stats.savings}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Comfort</span>
                    <span className="font-medium">{mode.stats.comfort}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sustainability</span>
                    <span className="font-medium">{mode.stats.sustainability}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
