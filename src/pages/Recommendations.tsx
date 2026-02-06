import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { SavingsBanner } from "@/components/dashboard/SavingsBanner";
import { LearningIndicator } from "@/components/notifications/LearningIndicator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useApp } from "@/context/AppContext";
import { mockApi } from "@/services/mockApi";
import { storage } from "@/services/storage";
import { backend } from "@/services/backend";
import { calculations, Recommendation } from "@/services/calculations";
import { FeedbackPopup } from "@/components/notifications/FeedbackPopup";
import { toast } from "@/hooks/use-toast";
import {
  Lightbulb,
  Zap,
  Clock,
  Thermometer,
  TrendingDown,
  ArrowRight,
  IndianRupee,
  Leaf,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const priorityColors = {
  high: "bg-destructive/10 text-destructive border-destructive/30",
  medium: "bg-accent/10 text-accent-foreground border-accent/30",
  low: "bg-muted text-muted-foreground border-muted",
};

const categoryIcons = {
  behavioral: Lightbulb,
  equipment: Zap,
  scheduling: Clock,
};

export default function Recommendations() {
  const navigate = useNavigate();
  const { adminData, preferences, updatePreferences, feedback, isOnboardingComplete, isLoading } = useApp();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [autoOffMinutes, setAutoOffMinutes] = useState(preferences.autoOffMinutes);
  const [acReduction, setAcReduction] = useState(preferences.acReductionPercent);
  const [whatIfResult, setWhatIfResult] = useState<{
    billReduction: number;
    kwhSaved: number;
    percentageSaved: number;
  } | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentRecommendation, setCurrentRecommendation] = useState<Recommendation | null>(null);
  const [feedbackStats, setFeedbackStats] = useState<{
    appliedIds: string[];
    skippedIds: string[];
  }>({ appliedIds: [], skippedIds: [] });

  useEffect(() => {
    if (!isLoading && !isOnboardingComplete) {
      navigate("/setup");
      return;
    }

    if (adminData) {
      const fetchData = async () => {
        setIsLoadingData(true);
        
        // Get feedback stats for adaptive recommendations
        const stats = storage.getFeedbackStats();
        setFeedbackStats({ appliedIds: stats.appliedIds, skippedIds: stats.skippedIds });
        
        const data = await mockApi.getRecommendations(adminData, preferences, {
          appliedIds: stats.appliedIds,
          skippedIds: stats.skippedIds,
        });
        setRecommendations(data);
        setIsLoadingData(false);

        // Show feedback popup for first recommendation after 3 seconds
        setTimeout(() => {
          if (data.length > 0) {
            // Pick a recommendation that hasn't been rated recently
            const unreviewedRec = data.find(
              (r) => !stats.appliedIds.includes(r.id) && !stats.skippedIds.includes(r.id)
            );
            if (unreviewedRec) {
              setCurrentRecommendation(unreviewedRec);
              setShowFeedback(true);
            }
          }
        }, 3000);
      };
      fetchData();
    }
  }, [adminData, preferences, isOnboardingComplete, isLoading, navigate, feedback]);

  useEffect(() => {
    if (adminData) {
      const result = calculations.calculateWhatIf(adminData, autoOffMinutes, acReduction);
      setWhatIfResult(result);
    }
  }, [adminData, autoOffMinutes, acReduction]);

  const applySettings = async () => {
    updatePreferences({
      autoOffMinutes,
      acReductionPercent: acReduction,
    });
    
    await backend.savePreferences({
      ...preferences,
      autoOffMinutes,
      acReductionPercent: acReduction,
    });
    
    toast({
      title: "Settings Applied!",
      description: "Your dashboard will update with new predictions.",
    });
  };

  const getRecommendationStatus = (recId: string) => {
    if (feedbackStats.appliedIds.includes(recId)) return "applied";
    if (feedbackStats.skippedIds.includes(recId)) return "skipped";
    return null;
  };

  if (isLoading || !adminData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Skeleton className="h-32 w-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <SavingsBanner />
      <LearningIndicator />

      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">AI Recommendations</h1>
          <p className="text-muted-foreground">
            Personalized suggestions based on your {adminData.type} usage patterns
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recommendations List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              Smart Suggestions
            </h2>

            {isLoadingData ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {recommendations.map((rec, index) => {
                  const CategoryIcon = categoryIcons[rec.category];
                  const status = getRecommendationStatus(rec.id);
                  
                  return (
                    <Card
                      key={rec.id}
                      className={`animate-fade-in-up hover:shadow-lg transition-shadow ${
                        status === "applied"
                          ? "border-primary/30 bg-primary/5"
                          : status === "skipped"
                          ? "opacity-70"
                          : ""
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <CategoryIcon className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h3 className="font-semibold">{rec.title}</h3>
                                <Badge
                                  variant="outline"
                                  className={priorityColors[rec.priority]}
                                >
                                  {rec.priority}
                                </Badge>
                                {status === "applied" && (
                                  <Badge
                                    variant="outline"
                                    className="bg-primary/10 text-primary border-primary/30 gap-1"
                                  >
                                    <CheckCircle2 className="h-3 w-3" />
                                    Applied
                                  </Badge>
                                )}
                                {status === "skipped" && (
                                  <Badge
                                    variant="outline"
                                    className="bg-muted text-muted-foreground gap-1"
                                  >
                                    <XCircle className="h-3 w-3" />
                                    Skipped
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">
                                {rec.description}
                              </p>
                              <div className="flex items-center gap-4 text-sm">
                                <span className="flex items-center gap-1 text-primary font-medium">
                                  <IndianRupee className="h-3 w-3" />
                                  {rec.estimatedSavings.toFixed(0)}/month
                                </span>
                                <span className="flex items-center gap-1 text-muted-foreground">
                                  <Zap className="h-3 w-3" />
                                  {rec.estimatedKwhSaved.toFixed(0)} kWh
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant={status ? "outline" : "default"}
                            className={`flex-shrink-0 ${!status ? "gradient-primary border-0" : ""}`}
                            onClick={() => {
                              setCurrentRecommendation(rec);
                              setShowFeedback(true);
                            }}
                          >
                            {status ? "Review" : "Apply"}
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* What-If Simulation */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-primary" />
                  What-If Simulation
                </CardTitle>
                <CardDescription>
                  Adjust settings and see predicted impact
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Auto-off slider */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      Auto-off after idle
                    </label>
                    <span className="text-sm font-bold text-primary">
                      {autoOffMinutes} min
                    </span>
                  </div>
                  <Slider
                    value={[autoOffMinutes]}
                    onValueChange={(value) => setAutoOffMinutes(value[0])}
                    min={5}
                    max={60}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>5 min</span>
                    <span>60 min</span>
                  </div>
                </div>

                {/* AC reduction slider */}
                {adminData.appliances.includes("ac") && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Thermometer className="h-4 w-4 text-muted-foreground" />
                        Reduce AC usage
                      </label>
                      <span className="text-sm font-bold text-primary">
                        {acReduction}%
                      </span>
                    </div>
                    <Slider
                      value={[acReduction]}
                      onValueChange={(value) => setAcReduction(value[0])}
                      min={0}
                      max={50}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0%</span>
                      <span>50%</span>
                    </div>
                  </div>
                )}

                {/* Results */}
                {whatIfResult && (
                  <div className="pt-4 border-t space-y-4">
                    <h4 className="font-medium text-sm text-muted-foreground">
                      Predicted Impact
                    </h4>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-primary/10">
                        <div className="text-2xl font-bold text-primary">
                          ₹{whatIfResult.billReduction.toFixed(0)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Monthly savings
                        </div>
                      </div>
                      <div className="p-4 rounded-xl bg-secondary/10">
                        <div className="text-2xl font-bold text-secondary">
                          {whatIfResult.kwhSaved.toFixed(0)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          kWh saved
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Leaf className="h-4 w-4 text-eco" />
                      <span>
                        {(whatIfResult.kwhSaved * 0.82).toFixed(0)} kg CO₂ reduction
                      </span>
                    </div>

                    <Button onClick={applySettings} className="w-full gradient-primary border-0">
                      Apply These Settings
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Feedback Popup */}
      <FeedbackPopup
        open={showFeedback}
        onClose={() => setShowFeedback(false)}
        recommendation={currentRecommendation}
      />
    </div>
  );
}
