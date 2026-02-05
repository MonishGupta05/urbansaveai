import { useState } from "react";
import { StateData } from "@/services/mockApi";

interface IndiaHeatmapProps {
  data: StateData[];
}

const intensityColors = {
  low: "hsl(160, 60%, 70%)",
  medium: "hsl(160, 70%, 50%)",
  high: "hsl(160, 80%, 35%)",
  "very-high": "hsl(160, 90%, 25%)",
};

// Simplified India state paths (major states only for demo)
const statePaths: Record<string, string> = {
  MH: "M 180 340 L 220 300 L 280 320 L 300 380 L 260 420 L 200 400 Z",
  DL: "M 220 180 L 235 170 L 250 185 L 240 200 L 225 195 Z",
  KA: "M 160 400 L 200 380 L 240 420 L 220 480 L 160 460 Z",
  TN: "M 200 480 L 260 460 L 280 520 L 240 560 L 180 540 Z",
  GJ: "M 100 280 L 160 260 L 180 320 L 140 360 L 80 340 Z",
  UP: "M 240 200 L 320 180 L 360 240 L 320 280 L 260 260 Z",
  RJ: "M 120 200 L 200 180 L 220 260 L 160 300 L 100 260 Z",
  WB: "M 360 280 L 400 260 L 420 340 L 380 380 L 340 340 Z",
  AP: "M 240 420 L 300 400 L 340 460 L 300 500 L 240 480 Z",
  TS: "M 220 380 L 280 360 L 320 400 L 280 440 L 220 420 Z",
  MP: "M 200 280 L 280 260 L 320 320 L 280 360 L 200 340 Z",
  KL: "M 160 500 L 200 480 L 200 560 L 160 580 Z",
  PB: "M 200 140 L 240 130 L 260 160 L 240 180 L 200 170 Z",
  HR: "M 200 170 L 240 160 L 260 200 L 230 210 L 200 190 Z",
  BR: "M 320 260 L 380 250 L 400 300 L 360 320 L 320 300 Z",
  OR: "M 320 340 L 380 320 L 400 400 L 340 420 L 300 380 Z",
  JH: "M 340 300 L 380 280 L 400 330 L 360 360 L 320 340 Z",
  CT: "M 280 360 L 320 340 L 360 400 L 320 440 L 280 400 Z",
  AS: "M 420 240 L 480 220 L 500 280 L 460 300 L 420 280 Z",
  UK: "M 260 140 L 300 120 L 320 160 L 300 190 L 260 170 Z",
  HP: "M 240 100 L 280 90 L 300 130 L 270 150 L 240 130 Z",
  JK: "M 200 60 L 260 40 L 280 100 L 240 120 L 200 100 Z",
  GA: "M 140 440 L 160 430 L 170 460 L 150 470 Z",
};

export function IndiaHeatmap({ data }: IndiaHeatmapProps) {
  const [hoveredState, setHoveredState] = useState<StateData | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const getStateColor = (stateCode: string) => {
    const stateInfo = data.find((s) => s.code === stateCode);
    if (!stateInfo) return "hsl(var(--muted))";
    return intensityColors[stateInfo.intensity];
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div className="relative">
      <svg
        viewBox="0 0 520 620"
        className="w-full max-w-2xl mx-auto"
        onMouseMove={handleMouseMove}
      >
        {/* Background */}
        <rect
          x="0"
          y="0"
          width="520"
          height="620"
          fill="transparent"
        />

        {/* State paths */}
        {Object.entries(statePaths).map(([code, path]) => {
          const stateInfo = data.find((s) => s.code === code);
          return (
            <path
              key={code}
              d={path}
              fill={getStateColor(code)}
              stroke="hsl(var(--background))"
              strokeWidth="2"
              className="cursor-pointer transition-all duration-200 hover:opacity-80 hover:stroke-primary"
              onMouseEnter={() => setHoveredState(stateInfo || null)}
              onMouseLeave={() => setHoveredState(null)}
            />
          );
        })}

        {/* State labels */}
        {Object.entries(statePaths).map(([code, path]) => {
          // Calculate rough center of each state for label positioning
          const match = path.match(/M\s*(\d+)\s+(\d+)/);
          if (!match) return null;
          const x = parseInt(match[1]) + 30;
          const y = parseInt(match[2]) + 30;
          return (
            <text
              key={`label-${code}`}
              x={x}
              y={y}
              fontSize="10"
              fill="hsl(var(--foreground))"
              textAnchor="middle"
              className="pointer-events-none font-medium"
            >
              {code}
            </text>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-6">
        <span className="text-sm text-muted-foreground">Consumption Intensity:</span>
        {Object.entries(intensityColors).map(([intensity, color]) => (
          <div key={intensity} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: color }}
            />
            <span className="text-xs capitalize">{intensity.replace("-", " ")}</span>
          </div>
        ))}
      </div>

      {/* Tooltip */}
      {hoveredState && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: mousePos.x + 10,
            top: mousePos.y + 10,
          }}
        >
          <div className="bg-popover border border-border rounded-lg shadow-lg p-3 min-w-48">
            <h4 className="font-semibold mb-2">{hoveredState.name}</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Consumption:</span>
                <span className="font-medium">
                  {hoveredState.consumption.toLocaleString()} kWh
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Savings:</span>
                <span className="font-medium text-primary">
                  ₹{hoveredState.savings.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Intensity:</span>
                <span className="font-medium capitalize">
                  {hoveredState.intensity.replace("-", " ")}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
