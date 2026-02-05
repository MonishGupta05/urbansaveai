import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { SavingsBanner } from "@/components/dashboard/SavingsBanner";
import { IndiaHeatmap } from "@/components/visualizations/IndiaHeatmap";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { mockApi, StateData, AggregatedInsight } from "@/services/mockApi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";
import {
  Map,
  BarChart3,
  TrendingUp,
  Building2,
  GraduationCap,
  Home,
  Download,
  AlertTriangle,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const adminTypeIcons = {
  campus: GraduationCap,
  society: Home,
  building: Building2,
};

export default function Insights() {
  const [stateData, setStateData] = useState<StateData[]>([]);
  const [insights, setInsights] = useState<AggregatedInsight[]>([]);
  const [wastageCauses, setWastageCauses] = useState<{ cause: string; percentage: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const [states, aggregated, causes] = await Promise.all([
        mockApi.getStateData(),
        mockApi.getAggregatedInsights(),
        mockApi.getWastageCauses(),
      ]);
      setStateData(states);
      setInsights(aggregated);
      setWastageCauses(causes);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your insights report is being generated...",
    });
    // Mock export functionality
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Report downloaded successfully.",
      });
    }, 2000);
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <SavingsBanner />

      <main className="flex-1 container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Research & Insights</h1>
            <p className="text-muted-foreground">
              Aggregated data and trends across all UrbanSave AI users
            </p>
          </div>
          <Button onClick={handleExport} variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>

        {/* Aggregated Insights Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {isLoading
            ? [1, 2, 3].map((i) => <Skeleton key={i} className="h-40" />)
            : insights.map((insight, index) => {
                const Icon = adminTypeIcons[insight.adminType];
                return (
                  <Card
                    key={insight.adminType}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                          <Icon className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <div>
                          <CardTitle className="text-lg capitalize">
                            {insight.adminType}
                          </CardTitle>
                          <CardDescription>
                            {insight.userCount} active users
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Avg. Savings
                          </span>
                          <span className="font-semibold text-primary">
                            {formatCurrency(insight.averageSavings)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Avg. Consumption
                          </span>
                          <span className="font-medium">
                            {insight.averageConsumption.toLocaleString()} kWh
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Top Wastage
                          </span>
                          <span className="font-medium text-accent">
                            {insight.topWastageCause}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Wastage Causes Chart */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-accent" />
                <CardTitle>Common Wastage Causes</CardTitle>
              </div>
              <CardDescription>
                Most frequent energy waste patterns across all users
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-64" />
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart
                    data={wastageCauses}
                    layout="vertical"
                    margin={{ left: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" domain={[0, 40]} unit="%" />
                    <YAxis type="category" dataKey="cause" width={120} />
                    <Tooltip formatter={(value: number) => [`${value}%`, "Frequency"]} />
                    <Bar
                      dataKey="percentage"
                      fill="hsl(160, 84%, 39%)"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Savings by Admin Type */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <CardTitle>Savings by Admin Type</CardTitle>
              </div>
              <CardDescription>
                Average monthly savings comparison
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-64" />
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart
                    data={insights.map((i) => ({
                      type: i.adminType.charAt(0).toUpperCase() + i.adminType.slice(1),
                      savings: i.averageSavings,
                      consumption: i.averageConsumption / 100,
                    }))}
                    margin={{ top: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip
                      formatter={(value: number, name: string) => {
                        if (name === "savings") return [`₹${value.toLocaleString()}`, "Savings"];
                        return [`${(value * 100).toLocaleString()} kWh`, "Consumption"];
                      }}
                    />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="savings"
                      name="Avg. Savings (₹)"
                      fill="hsl(160, 84%, 39%)"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="consumption"
                      name="Avg. Consumption (×100 kWh)"
                      fill="hsl(174, 62%, 47%)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* India Heatmap */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Map className="h-5 w-5 text-primary" />
              <CardTitle>Energy Consumption by State</CardTitle>
            </div>
            <CardDescription>
              Geographic distribution of energy usage and savings potential across India
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[500px]" />
            ) : (
              <IndiaHeatmap data={stateData} />
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
