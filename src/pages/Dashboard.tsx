import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { SavingsBanner } from "@/components/dashboard/SavingsBanner";
import { ModeSelector } from "@/components/forms/ModeSelector";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useApp } from "@/context/AppContext";
import { mockApi } from "@/services/mockApi";
import { PredictionResult, WastageZone } from "@/services/calculations";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Zap,
  IndianRupee,
  Leaf,
  AlertTriangle,
} from "lucide-react";

const CHART_COLORS = [
  "hsl(160, 84%, 39%)",
  "hsl(174, 62%, 47%)",
  "hsl(45, 93%, 58%)",
  "hsl(201, 96%, 47%)",
  "hsl(280, 65%, 60%)",
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { adminData, preferences, isOnboardingComplete, isLoading } = useApp();
  const [dashboardData, setDashboardData] = useState<PredictionResult | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (!isLoading && !isOnboardingComplete) {
      navigate("/setup");
      return;
    }

    if (adminData) {
      const fetchData = async () => {
        setIsLoadingData(true);
        const data = await mockApi.getDashboardData(adminData, preferences);
        setDashboardData(data);
        setIsLoadingData(false);
      };
      fetchData();
    }
  }, [adminData, preferences, isOnboardingComplete, isLoading, navigate]);

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

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const consumptionData = dashboardData?.wastageZones.map((zone) => ({
    name: zone.name,
    value: zone.percentage,
    kWh: zone.kWh,
  })) || [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <SavingsBanner />

      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Energy Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time insights for your {adminData.type} • Last updated just now
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {/* Predicted Bill */}
          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Predicted Next Bill
              </CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoadingData ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {formatCurrency(dashboardData?.predictedBill || 0)}
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <TrendingDown className="h-3 w-3 text-primary" />
                    {dashboardData?.savingsPercentage.toFixed(1)}% potential savings
                  </p>
                </>
              )}
            </CardContent>
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-full" />
          </Card>

          {/* Savings Estimate */}
          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Estimated Savings
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              {isLoadingData ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-primary">
                    {formatCurrency(dashboardData?.savingsEstimate || 0)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    With current {preferences.mode} mode settings
                  </p>
                </>
              )}
            </CardContent>
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-full" />
          </Card>

          {/* Energy Usage */}
          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Predicted Consumption
              </CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoadingData ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {dashboardData?.predictedConsumption.toLocaleString()} kWh
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    vs {adminData.monthlyConsumption.toLocaleString()} kWh current
                  </p>
                </>
              )}
            </CardContent>
            <div className="absolute top-0 right-0 w-20 h-20 bg-secondary/5 rounded-bl-full" />
          </Card>

          {/* CO2 Reduction */}
          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                CO₂ Reduction
              </CardTitle>
              <Leaf className="h-4 w-4 text-eco" />
            </CardHeader>
            <CardContent>
              {isLoadingData ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-eco">
                    {dashboardData?.co2Reduction.toFixed(0)} kg
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Equivalent to planting {Math.round((dashboardData?.co2Reduction || 0) / 20)} trees
                  </p>
                </>
              )}
            </CardContent>
            <div className="absolute top-0 right-0 w-20 h-20 bg-eco/5 rounded-bl-full" />
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {/* Consumption Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Consumption Breakdown</CardTitle>
              <CardDescription>Energy distribution by category</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingData ? (
                <div className="h-64 flex items-center justify-center">
                  <Skeleton className="h-48 w-48 rounded-full" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={consumptionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                      labelLine={false}
                    >
                      {consumptionData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CHART_COLORS[index % CHART_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number, name: string, props: any) => [
                        `${props.payload.kWh?.toFixed(0)} kWh (${value}%)`,
                        name,
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Wastage Zones */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-accent" />
                <CardTitle>Wastage Zones</CardTitle>
              </div>
              <CardDescription>Areas with highest savings potential</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingData ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart
                    data={dashboardData?.wastageZones}
                    layout="vertical"
                    margin={{ left: 20 }}
                  >
                    <XAxis type="number" domain={[0, 50]} unit="%" />
                    <YAxis type="category" dataKey="name" width={100} />
                    <Tooltip
                      formatter={(value: number) => [`${value}%`, "Wastage"]}
                    />
                    <Bar
                      dataKey="percentage"
                      fill="hsl(45, 93%, 58%)"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Mode Selector */}
        <ModeSelector />
      </main>
    </div>
  );
}
