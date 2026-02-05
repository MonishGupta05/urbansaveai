import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import {
  Zap,
  TrendingDown,
  Brain,
  BarChart3,
  Lightbulb,
  Building2,
  GraduationCap,
  Home,
  ArrowRight,
  Leaf,
  IndianRupee,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Predictions",
    description:
      "Advanced algorithms predict your next month's bill and identify wastage zones before they impact your budget.",
  },
  {
    icon: TrendingDown,
    title: "Smart Savings",
    description:
      "Get personalized recommendations that adapt to your usage patterns and sustainability goals.",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description:
      "Beautiful dashboards show consumption breakdown, trends, and optimization opportunities.",
  },
  {
    icon: Lightbulb,
    title: "What-If Simulations",
    description:
      "Test different scenarios and see predicted impact on your bills before implementing changes.",
  },
];

const adminTypes = [
  {
    icon: GraduationCap,
    label: "Campus",
    savings: "₹4.5L+",
    description: "Universities & Schools",
  },
  {
    icon: Home,
    label: "Society",
    savings: "₹1.8L+",
    description: "Residential Complexes",
  },
  {
    icon: Building2,
    label: "Building",
    savings: "₹1.2L+",
    description: "Commercial Buildings",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Animated background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-background" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse-slow delay-1000" />
        </div>

        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium animate-fade-in">
              <Leaf className="h-4 w-4" />
              AI-Powered Sustainability Platform
            </div>

            {/* Main heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight animate-fade-in-up">
              <span className="text-gradient-primary">Predict, Optimize</span>
              <br />
              <span className="text-foreground">& Save Energy</span>
            </h1>

            {/* Tagline */}
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up delay-100">
              Transform your energy management with AI-driven predictions and smart recommendations for{" "}
              <span className="text-primary font-semibold">campus</span>,{" "}
              <span className="text-secondary font-semibold">society</span>, and{" "}
              <span className="text-accent font-semibold">building</span> administrators.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-200">
              <Button
                asChild
                size="lg"
                className="gradient-primary border-0 text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <Link to="/setup" className="flex items-center gap-2">
                  Get Started Free
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 rounded-xl hover:bg-primary/5"
              >
                <Link to="/insights">View Demo Insights</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 animate-fade-in-up delay-300">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary">₹28L+</div>
                <div className="text-sm text-muted-foreground mt-1">Total Savings</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-secondary">380K</div>
                <div className="text-sm text-muted-foreground mt-1">kWh Reduced</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-accent">1,247</div>
                <div className="text-sm text-muted-foreground mt-1">Active Users</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Admin Types Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Built for Every Administrator</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Whether you manage a university campus, residential society, or commercial building,
              UrbanSave AI adapts to your unique energy patterns.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {adminTypes.map((type, index) => (
              <Card
                key={type.label}
                className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <type.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-1">{type.label}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{type.description}</p>
                  <div className="flex items-center justify-center gap-1 text-primary font-bold text-lg">
                    <IndianRupee className="h-4 w-4" />
                    <span>{type.savings}</span>
                    <span className="text-sm font-normal text-muted-foreground">/year avg</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful Features for <span className="text-gradient-primary">Smarter Energy</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Leverage cutting-edge AI to understand, predict, and optimize your energy consumption
              like never before.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                className="group border hover:border-primary/30 hover:shadow-xl transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-secondary/5 to-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Start Saving?
            </h2>
            <p className="text-lg text-muted-foreground">
              Join 1,000+ administrators who are already reducing their energy costs with UrbanSave AI.
              Setup takes less than 5 minutes.
            </p>
            <Button
              asChild
              size="lg"
              className="gradient-primary border-0 text-lg px-12 py-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <Link to="/setup" className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Start Your Setup
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <span className="font-semibold">UrbanSave AI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 UrbanSave AI. Empowering sustainable energy management.
          </p>
        </div>
      </footer>
    </div>
  );
}
