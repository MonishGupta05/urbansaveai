import { useEffect, useState } from "react";
import { backend } from "@/services/backend";
import { Brain, Sparkles, TrendingUp } from "lucide-react";

export function LearningIndicator() {
  const [stats, setStats] = useState<{
    total: number;
    applied: number;
    skipped: number;
    appliedPercentage: number;
  } | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      const feedbackStats = await backend.getFeedbackStats();
      setStats(feedbackStats);
      setIsVisible(feedbackStats.total > 0);
    };
    fetchStats();

    // Refresh periodically
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!isVisible || !stats) return null;

  return (
    <div className="fixed top-20 right-4 z-40 animate-fade-in-up">
      <div className="relative group">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
        
        {/* Main indicator */}
        <div className="relative flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm border border-primary/30 shadow-lg">
          {/* Animated brain icon */}
          <div className="relative">
            <Brain className="h-5 w-5 text-primary" />
            <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-primary animate-pulse" />
          </div>
          
          {/* Text */}
          <div className="text-sm">
            <span className="font-medium">AI Learning</span>
            <span className="text-muted-foreground ml-1">
              • {stats.total} feedback{stats.total !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Success rate badge */}
          {stats.total >= 2 && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
              <TrendingUp className="h-3 w-3" />
              {stats.appliedPercentage}%
            </div>
          )}
        </div>

        {/* Hover tooltip */}
        <div className="absolute top-full right-0 mt-2 w-56 p-3 rounded-lg bg-popover border shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <p className="text-xs font-medium mb-2">Learning Status</p>
          <div className="space-y-1.5 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Recommendations applied:</span>
              <span className="font-medium text-primary">{stats.applied}</span>
            </div>
            <div className="flex justify-between">
              <span>Recommendations skipped:</span>
              <span className="font-medium">{stats.skipped}</span>
            </div>
            <div className="pt-1 mt-1 border-t text-[11px]">
              System adapts priority based on your feedback patterns
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
