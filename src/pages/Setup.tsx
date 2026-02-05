import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useApp } from "@/context/AppContext";
import { AdminData } from "@/services/storage";
import { mockApi } from "@/services/mockApi";
import { toast } from "@/hooks/use-toast";
import {
  GraduationCap,
  Home,
  Building2,
  ArrowRight,
  ArrowLeft,
  Zap,
  Check,
  Loader2,
} from "lucide-react";

const adminTypes = [
  {
    type: "campus" as const,
    icon: GraduationCap,
    label: "Campus",
    description: "Universities, schools, educational institutions",
  },
  {
    type: "society" as const,
    icon: Home,
    label: "Society",
    description: "Residential complexes, housing societies",
  },
  {
    type: "building" as const,
    icon: Building2,
    label: "Building",
    description: "Commercial buildings, offices, retail",
  },
];

const appliances = [
  { id: "ac", label: "Air Conditioning" },
  { id: "lighting", label: "Lighting Systems" },
  { id: "elevators", label: "Elevators" },
  { id: "pumps", label: "Water Pumps" },
  { id: "computers", label: "Computers/IT Equipment" },
  { id: "refrigeration", label: "Refrigeration" },
  { id: "heating", label: "Heating Systems" },
  { id: "ventilation", label: "Ventilation/HVAC" },
];

const timeSlots = [
  "6AM-9AM",
  "9AM-12PM",
  "12PM-3PM",
  "3PM-6PM",
  "6PM-9PM",
  "9PM-12AM",
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function Setup() {
  const navigate = useNavigate();
  const { setAdminData, completeOnboarding } = useApp();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [selectedType, setSelectedType] = useState<"campus" | "society" | "building" | null>(null);
  const [consumption, setConsumption] = useState("");
  const [billAmount, setBillAmount] = useState("");
  const [roomsBlocks, setRoomsBlocks] = useState("");
  const [selectedAppliances, setSelectedAppliances] = useState<string[]>([]);
  const [occupancyPattern, setOccupancyPattern] = useState<Record<string, boolean[]>>(() => {
    const pattern: Record<string, boolean[]> = {};
    days.forEach((day) => {
      pattern[day] = Array(6).fill(false);
    });
    return pattern;
  });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const toggleOccupancy = (day: string, slotIndex: number) => {
    setOccupancyPattern((prev) => ({
      ...prev,
      [day]: prev[day].map((v, i) => (i === slotIndex ? !v : v)),
    }));
  };

  const handleSubmit = async () => {
    if (!selectedType) return;

    setIsSubmitting(true);

    const adminData: AdminData = {
      type: selectedType,
      monthlyConsumption: parseFloat(consumption) || 5000,
      lastBillAmount: parseFloat(billAmount) || 35000,
      roomsBlocks: parseInt(roomsBlocks) || 20,
      appliances: selectedAppliances,
      occupancyPattern,
      createdAt: new Date().toISOString(),
    };

    try {
      await mockApi.submitAdminData(adminData);
      setAdminData(adminData);
      completeOnboarding();
      
      toast({
        title: "Setup Complete!",
        description: "Your personalized dashboard is ready.",
      });

      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Setup Failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return selectedType !== null;
      case 2:
        return consumption && billAmount && roomsBlocks;
      case 3:
        return selectedAppliances.length > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container py-8">
        <div className="max-w-3xl mx-auto">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                Step {step} of {totalSteps}
              </span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step 1: Select Type */}
          {step === 1 && (
            <Card className="animate-fade-in-up">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Welcome to UrbanSave AI</CardTitle>
                <CardDescription className="text-lg">
                  What type of property do you manage?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {adminTypes.map((item) => (
                    <button
                      key={item.type}
                      onClick={() => setSelectedType(item.type)}
                      className={`relative p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                        selectedType === item.type
                          ? "border-primary bg-primary/5 shadow-lg"
                          : "border-border hover:border-primary/50 hover:bg-muted/50"
                      }`}
                    >
                      {selectedType === item.type && (
                        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <Check className="h-4 w-4 text-primary-foreground" />
                        </div>
                      )}
                      <div
                        className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${
                          selectedType === item.type ? "gradient-primary" : "bg-muted"
                        }`}
                      >
                        <item.icon
                          className={`h-7 w-7 ${
                            selectedType === item.type ? "text-primary-foreground" : "text-muted-foreground"
                          }`}
                        />
                      </div>
                      <h3 className="font-semibold text-lg mb-1">{item.label}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Consumption Data */}
          {step === 2 && (
            <Card className="animate-fade-in-up">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Consumption Details</CardTitle>
                <CardDescription className="text-lg">
                  Help us understand your current energy usage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="consumption">Monthly Electricity Consumption (kWh)</Label>
                  <Input
                    id="consumption"
                    type="number"
                    placeholder="e.g., 5000"
                    value={consumption}
                    onChange={(e) => setConsumption(e.target.value)}
                    className="text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bill">Last Month's Bill Amount (₹)</Label>
                  <Input
                    id="bill"
                    type="number"
                    placeholder="e.g., 35000"
                    value={billAmount}
                    onChange={(e) => setBillAmount(e.target.value)}
                    className="text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rooms">Number of Rooms/Blocks</Label>
                  <Input
                    id="rooms"
                    type="number"
                    placeholder="e.g., 20"
                    value={roomsBlocks}
                    onChange={(e) => setRoomsBlocks(e.target.value)}
                    className="text-lg"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Appliances */}
          {step === 3 && (
            <Card className="animate-fade-in-up">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Major Appliances</CardTitle>
                <CardDescription className="text-lg">
                  Select the major energy consumers in your property
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {appliances.map((appliance) => (
                    <label
                      key={appliance.id}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        selectedAppliances.includes(appliance.id)
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <Checkbox
                        checked={selectedAppliances.includes(appliance.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedAppliances([...selectedAppliances, appliance.id]);
                          } else {
                            setSelectedAppliances(selectedAppliances.filter((id) => id !== appliance.id));
                          }
                        }}
                      />
                      <span className="font-medium">{appliance.label}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Occupancy Pattern */}
          {step === 4 && (
            <Card className="animate-fade-in-up">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Occupancy Pattern</CardTitle>
                <CardDescription className="text-lg">
                  Select when the property has high occupancy (click cells to toggle)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="p-2 text-left text-sm font-medium text-muted-foreground">Day</th>
                        {timeSlots.map((slot) => (
                          <th key={slot} className="p-2 text-center text-xs font-medium text-muted-foreground">
                            {slot}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {days.map((day) => (
                        <tr key={day}>
                          <td className="p-2 font-medium">{day}</td>
                          {occupancyPattern[day].map((isActive, index) => (
                            <td key={index} className="p-1">
                              <button
                                onClick={() => toggleOccupancy(day, index)}
                                className={`w-full h-10 rounded-lg transition-all duration-200 ${
                                  isActive
                                    ? "gradient-primary shadow-md"
                                    : "bg-muted hover:bg-muted/80"
                                }`}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  This helps us identify potential wastage during low-occupancy periods
                </p>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            {step < totalSteps ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="gap-2 gradient-primary border-0"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="gap-2 gradient-primary border-0"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    Complete Setup
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
