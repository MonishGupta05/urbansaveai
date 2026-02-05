import { useEffect, useState } from "react";
import { mockApi } from "@/services/mockApi";
import { TrendingUp, Zap } from "lucide-react";

export function SavingsBanner() {
  const [stats, setStats] = useState({ saved: 0, kwhReduced: 0 });
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      const data = await mockApi.getCommunityCounter();
      setStats(data);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 500);
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString();
  };

  return (
    <div className="w-full gradient-primary py-3 px-4">
      <div className="container flex items-center justify-center gap-6 text-primary-foreground">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          <span className="text-sm font-medium">Community Impact:</span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm opacity-90">Saved</span>
            <span
              className={`font-bold text-lg transition-all ${
                isAnimating ? "animate-counter-up" : ""
              }`}
            >
              ₹{formatNumber(stats.saved)}
            </span>
          </div>
          
          <div className="h-4 w-px bg-primary-foreground/30" />
          
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span
              className={`font-bold text-lg transition-all ${
                isAnimating ? "animate-counter-up" : ""
              }`}
            >
              {formatNumber(stats.kwhReduced)} kWh
            </span>
            <span className="text-sm opacity-90">reduced</span>
          </div>
        </div>
      </div>
    </div>
  );
}
