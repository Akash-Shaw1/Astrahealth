"use client";

import { useState, useEffect, useRef } from "react";
import {
  TrendingUp,
  Heart,
  Activity,
  Droplets,
  Thermometer,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/dashboard-layout";
import {
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

export default function HealthStreakTracker() {
  const [sensorData, setSensorData] = useState({
    bpm: 0,
    avgBpm: 0,
    spO2: 0,
    temp: 0,
    fingerDetected: false,
  });

  const [showData, setShowData] = useState(false);
  const chartDataRef = useRef<any[]>([]); // persistent buffer that won’t trigger rerenders
  const [, forceUpdate] = useState({}); // manual state tick to update chart visually

  // Efficient continuous fetch and append
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://10.34.228.45/data");
        const data = await res.json();
        setSensorData(data);

        const newPoint = {
          time: new Date().toLocaleTimeString("en-US", { hour12: false }),
          bpm: data.avgBpm,
          spO2: data.spO2,
          temp: data.temp,
        };

        // clone safely instead of mutating directly
        const updated = [...(chartDataRef.current || []), newPoint].slice(-100);
        chartDataRef.current = updated;

        // lightweight re-render trigger
        forceUpdate({});
      } catch (err) {
        console.error("Failed to fetch sensor data", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  // Show data after 5s stable finger reading
  useEffect(() => {
    if (sensorData.fingerDetected) {
      const t = setTimeout(() => setShowData(true), 5000);
      return () => clearTimeout(t);
    } else setShowData(false);
  }, [sensorData.fingerDetected]);

  const isAtRisk =
    showData &&
    (sensorData.avgBpm < 60 || sensorData.avgBpm > 100) &&
    sensorData.avgBpm !== 0;

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Health Monitor Dashboard
          </h1>
          <p className="text-gray-600">
            Live patient vitals from IoT Health Monitor
          </p>
        </div>

        {/* Top Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {/* Heartbeat */}
          <Card className="bg-gradient-to-br from-red-500 to-pink-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Heart className="w-8 h-8" />
                <Badge className="bg-white/20 text-white">
                  {sensorData.fingerDetected ? "Active" : "No Finger"}
                </Badge>
              </div>
              {showData ? (
                <>
                  <div className="text-3xl font-bold mb-1">
                    {sensorData.avgBpm}
                  </div>
                  <div className="text-pink-100">BPM</div>
                </>
              ) : (
                <div className="text-gray-300 text-sm">
                  Waiting for stable reading...
                </div>
              )}
            </CardContent>
          </Card>

          {/* SpO2 */}
          <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Droplets className="w-8 h-8" />
                <Badge className="bg-white/20 text-white">Oxygen</Badge>
              </div>
              {showData ? (
                <>
                  <div className="text-3xl font-bold mb-1">
                    {sensorData.spO2}%
                  </div>
                  <div className="text-blue-100">SpO₂ Level</div>
                </>
              ) : null}
            </CardContent>
          </Card>

          {/* Temp */}
          <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Thermometer className="w-8 h-8" />
                <Badge className="bg-white/20 text-white">Body Temp</Badge>
              </div>
              {showData ? (
                <>
                  <div className="text-3xl font-bold mb-1">
                    {sensorData.temp}°C
                  </div>
                  <div className="text-green-100">Temperature</div>
                </>
              ) : null}
            </CardContent>
          </Card>

          {/* Heart Risk */}
          <Card
            className={`${
              showData
                ? isAtRisk
                  ? "bg-gradient-to-br from-red-600 to-orange-600 animate-pulse"
                  : "bg-gradient-to-br from-gray-700 to-gray-900"
                : "bg-gradient-to-br from-gray-500 to-gray-700"
            } text-white border-0`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Activity className="w-8 h-8" />
                <Badge className="bg-white/20 text-white">Heart Risk</Badge>
              </div>
              {showData ? (
                <>
                  <div className="text-[17px] font-bold mb-1">
                    {isAtRisk
                      ? "Unusual Heartbeat Detected"
                      : "Heartbeat in Safe Range"}
                  </div>
                  <div className="text-yellow-100">
                    {isAtRisk ? "⚠️ At Risk" : "✅ Normal"}
                  </div>
                </>
              ) : null}
            </CardContent>
          </Card>
        </div>

        {/* Continuous Graph */}
        <Card className="mt-6 bg-white/60 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Live Health Data (Continuous Stream)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartDataRef.current}>
                  <XAxis dataKey="time" hide />
                  <YAxis
                    domain={[0, "auto"]}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white/90 p-3 rounded-lg shadow border text-xs">
                            <p className="font-medium text-gray-800 mb-1">
                              {payload[0].payload.time}
                            </p>
                            {payload.map((entry, i) => (
                              <p key={i} style={{ color: entry.color }}>
                                {entry.name}: {entry.value}
                              </p>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    wrapperStyle={{
                      fontSize: "0.85rem",
                      color: "#374151",
                      paddingBottom: "0.5rem",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="bpm"
                    name="BPM"
                    stroke="#EF4444"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="spO2"
                    name="SpO₂"
                    stroke="#06B6D4"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="temp"
                    name="Temp (°C)"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
