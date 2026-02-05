import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Zap, BarChart2, Settings, Lightbulb, Map, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: BarChart2 },
  { path: "/recommendations", label: "Recommendations", icon: Lightbulb },
  { path: "/insights", label: "Insights", icon: Map },
  { path: "/setup", label: "Settings", icon: Settings },
];

export function Header() {
  const { isOnboardingComplete } = useApp();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="relative">
            <div className="absolute inset-0 gradient-primary blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
            <Zap className="relative h-8 w-8 text-primary" />
          </div>
          <span className="font-bold text-xl tracking-tight">
            <span className="text-gradient-primary">UrbanSave</span>
            <span className="text-muted-foreground ml-1">AI</span>
          </span>
        </Link>

        {isOnboardingComplete && (
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                asChild
                className="text-muted-foreground hover:text-foreground hover:bg-primary/5"
              >
                <Link to={item.path} className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </Button>
            ))}
          </nav>
        )}

        <div className="flex items-center space-x-2">
          {!isOnboardingComplete && (
            <Button asChild variant="default" size="sm" className="gradient-primary border-0">
              <Link to="/setup">Get Started</Link>
            </Button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
