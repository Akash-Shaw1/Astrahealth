"use client";

import { useState, useEffect } from "react";
import {
  Trophy,
  Target,
  TrendingUp,
  Flame,
  Award,
  Clock,
  CheckCircle2,
  Plus,
  Heart,
  Activity,
  Droplets,
  Moon,
  Edit,
  Trash2,
  MoreHorizontal,
  Thermometer,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import {
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  AreaChart,
  Area,
} from "recharts";
import DashboardLayout from "@/components/dashboard-layout";
import {
  type HealthGoal,
  initialHealthGoals,
  STORAGE_KEYS,
  loadFromStorage,
  saveToStorage,
} from "@/lib/data";

const streakData = [
  { day: "Mon", steps: 8500, water: 6, sleep: 7.5, exercise: 45 },
  { day: "Tue", steps: 10200, water: 8, sleep: 8, exercise: 60 },
  { day: "Wed", steps: 7800, water: 5, sleep: 6.5, exercise: 30 },
  { day: "Thu", steps: 12000, water: 9, sleep: 8.5, exercise: 75 },
  { day: "Fri", steps: 9500, water: 7, sleep: 7, exercise: 50 },
  { day: "Sat", steps: 15000, water: 10, sleep: 9, exercise: 90 },
  { day: "Sun", steps: 11000, water: 8, sleep: 8, exercise: 65 },
];

const achievements = [
  {
    id: 1,
    title: "Week Warrior",
    description: "Complete all goals for 7 days",
    icon: Trophy,
    earned: true,
    date: "Dec 15",
  },
  {
    id: 2,
    title: "Hydration Hero",
    description: "Drink 8+ glasses for 10 days",
    icon: Droplets,
    earned: true,
    date: "Dec 18",
  },
  {
    id: 3,
    title: "Step Master",
    description: "Walk 10,000+ steps for 14 days",
    icon: Activity,
    earned: false,
    progress: 85,
  },
  {
    id: 4,
    title: "Sleep Champion",
    description: "Get 8+ hours sleep for 7 days",
    icon: Moon,
    earned: false,
    progress: 60,
  },
];

const iconMap = {
  Activity,
  Droplets,
  Moon,
  Heart,
};

export default function HealthStreakTracker() {
  const [healthGoals, setHealthGoals] = useState<HealthGoal[]>([]);
  const [currentStreak, setCurrentStreak] = useState(12);
  const [longestStreak, setLongestStreak] = useState(28);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<HealthGoal | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    target: "",
    current: "",
    unit: "",
    icon: "Activity",
    color: "blue",
  });

  const [sensorData, setSensorData] = useState({
    bpm: 0,
    avgBpm: 0,
    spO2: 0,
    temp: 0,
    fingerDetected: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://10.34.228.45/data"); // <-- your ESP32 IP
        const data = await response.json();
        setSensorData(data);
      } catch (err) {
        console.error("Failed to fetch sensor data", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 1000); // fetch every second
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const storedGoals = loadFromStorage(
      STORAGE_KEYS.HEALTH_GOALS,
      initialHealthGoals
    );
    setHealthGoals(storedGoals);
  }, []);

  useEffect(() => {
    if (healthGoals.length > 0) {
      saveToStorage(STORAGE_KEYS.HEALTH_GOALS, healthGoals);
    }
  }, [healthGoals]);

  const totalProgress =
    healthGoals.reduce(
      (acc, goal) => acc + (goal.current / goal.target) * 100,
      0
    ) / healthGoals.length;

  const handleAddGoal = () => {
    if (!formData.title || !formData.target || !formData.unit) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newGoal: HealthGoal = {
      id: Math.max(...healthGoals.map((g) => g.id), 0) + 1,
      title: formData.title,
      target: Number.parseInt(formData.target),
      current: Number.parseInt(formData.current) || 0,
      unit: formData.unit,
      icon: formData.icon,
      color: formData.color,
      streak: 0,
    };

    setHealthGoals([...healthGoals, newGoal]);
    setIsAddDialogOpen(false);
    resetForm();
    toast({
      title: "Success",
      description: "Goal added successfully",
    });
  };

  const handleUpdateGoal = () => {
    if (!editingGoal || !formData.title || !formData.target || !formData.unit) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const updatedGoal: HealthGoal = {
      ...editingGoal,
      title: formData.title,
      target: Number.parseInt(formData.target),
      current: Number.parseInt(formData.current) || 0,
      unit: formData.unit,
      icon: formData.icon,
      color: formData.color,
    };

    setHealthGoals(
      healthGoals.map((g) => (g.id === editingGoal.id ? updatedGoal : g))
    );
    setIsEditDialogOpen(false);
    setEditingGoal(null);
    resetForm();
    toast({
      title: "Success",
      description: "Goal updated successfully",
    });
  };

  const handleDeleteGoal = (goalId: number) => {
    setHealthGoals(healthGoals.filter((g) => g.id !== goalId));
    toast({
      title: "Success",
      description: "Goal deleted successfully",
    });
  };

  const handleEditGoal = (goal: HealthGoal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      target: goal.target.toString(),
      current: goal.current.toString(),
      unit: goal.unit,
      icon: goal.icon,
      color: goal.color,
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      target: "",
      current: "",
      unit: "",
      icon: "Activity",
      color: "blue",
    });
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Health Streak Tracker
              </h1>
              <p className="text-gray-600">
                Track your daily health habits and build lasting streaks
              </p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Goal
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Goal</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Goal Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="e.g., Daily Steps"
                    />
                  </div>
                  <div>
                    <Label htmlFor="target">Target *</Label>
                    <Input
                      id="target"
                      type="number"
                      value={formData.target}
                      onChange={(e) =>
                        setFormData({ ...formData, target: e.target.value })
                      }
                      placeholder="e.g., 10000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="current">Current Progress</Label>
                    <Input
                      id="current"
                      type="number"
                      value={formData.current}
                      onChange={(e) =>
                        setFormData({ ...formData, current: e.target.value })
                      }
                      placeholder="e.g., 8750"
                    />
                  </div>
                  <div>
                    <Label htmlFor="unit">Unit *</Label>
                    <Input
                      id="unit"
                      value={formData.unit}
                      onChange={(e) =>
                        setFormData({ ...formData, unit: e.target.value })
                      }
                      placeholder="e.g., steps, glasses, hours"
                    />
                  </div>
                  <div>
                    <Label htmlFor="icon">Icon</Label>
                    <Select
                      value={formData.icon}
                      onValueChange={(value) =>
                        setFormData({ ...formData, icon: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Activity">Activity</SelectItem>
                        <SelectItem value="Droplets">Droplets</SelectItem>
                        <SelectItem value="Moon">Moon</SelectItem>
                        <SelectItem value="Heart">Heart</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="color">Color</Label>
                    <Select
                      value={formData.color}
                      onValueChange={(value) =>
                        setFormData({ ...formData, color: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blue">Blue</SelectItem>
                        <SelectItem value="cyan">Cyan</SelectItem>
                        <SelectItem value="purple">Purple</SelectItem>
                        <SelectItem value="red">Red</SelectItem>
                        <SelectItem value="green">Green</SelectItem>
                        <SelectItem value="orange">Orange</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddGoal} className="flex-1">
                      Add Goal
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddDialogOpen(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Goal Title *</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., Daily Steps"
                />
              </div>
              <div>
                <Label htmlFor="edit-target">Target *</Label>
                <Input
                  id="edit-target"
                  type="number"
                  value={formData.target}
                  onChange={(e) =>
                    setFormData({ ...formData, target: e.target.value })
                  }
                  placeholder="e.g., 10000"
                />
              </div>
              <div>
                <Label htmlFor="edit-current">Current Progress</Label>
                <Input
                  id="edit-current"
                  type="number"
                  value={formData.current}
                  onChange={(e) =>
                    setFormData({ ...formData, current: e.target.value })
                  }
                  placeholder="e.g., 8750"
                />
              </div>
              <div>
                <Label htmlFor="edit-unit">Unit *</Label>
                <Input
                  id="edit-unit"
                  value={formData.unit}
                  onChange={(e) =>
                    setFormData({ ...formData, unit: e.target.value })
                  }
                  placeholder="e.g., steps, glasses, hours"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleUpdateGoal} className="flex-1">
                  Update Goal
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Streak Overview Cards */}
        {/* <div className="grid grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Flame className="w-8 h-8" />
                <Badge className="bg-white/20 text-white">Active</Badge>
              </div>
              <div className="text-3xl font-bold mb-1">{currentStreak}</div>
              <div className="text-orange-100">Current Streak</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Trophy className="w-8 h-8" />
                <Badge className="bg-white/20 text-white">Record</Badge>
              </div>
              <div className="text-3xl font-bold mb-1">{longestStreak}</div>
              <div className="text-yellow-100">Longest Streak</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Target className="w-8 h-8" />
                <Badge className="bg-white/20 text-white">Today</Badge>
              </div>
              <div className="text-3xl font-bold mb-1">{Math.round(totalProgress)}%</div>
              <div className="text-green-100">Goals Complete</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Award className="w-8 h-8" />
                <Badge className="bg-white/20 text-white">Earned</Badge>
              </div>
              <div className="text-3xl font-bold mb-1">{achievements.filter((a) => a.earned).length}</div>
              <div className="text-blue-100">Achievements</div>
            </CardContent>
          </Card>
        </div> */}

        <div className="grid grid-cols-4 gap-6 mb-8">
          {/* Heartbeat Status */}
          <Card className="bg-gradient-to-br from-red-500 to-pink-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Heart className="w-8 h-8" />
                <Badge className="bg-white/20 text-white">
                  {sensorData.fingerDetected ? "Active" : "No Finger"}
                </Badge>
              </div>
              <div className="text-3xl font-bold mb-1">{sensorData.avgBpm}</div>
              <div className="text-pink-100">BPM</div>
            </CardContent>
          </Card>

          {/* Oxygen Level */}
          <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Droplets className="w-8 h-8" />
                <Badge className="bg-white/20 text-white">Oxygen</Badge>
              </div>
              <div className="text-3xl font-bold mb-1">{sensorData.spO2}%</div>
              <div className="text-blue-100">SpO₂ Level</div>
            </CardContent>
          </Card>

          {/* Temperature */}
          <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Thermometer className="w-8 h-8" />
                <Badge className="bg-white/20 text-white">Body Temp</Badge>
              </div>
              <div className="text-3xl font-bold mb-1">{sensorData.temp}°C</div>
              <div className="text-green-100">Temperature</div>
            </CardContent>
          </Card>

          {/* Heart Risk */}
          <Card
            className={`${
              sensorData.fingerDetected
                ? "bg-gradient-to-br from-red-600 to-orange-600"
                : "bg-gradient-to-br from-gray-500 to-gray-700"
            } text-white border-0`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Activity className="w-8 h-8" />
                <Badge className="bg-white/20 text-white">Heart Risk</Badge>
              </div>
              <div className="text-[17px] font-bold mb-1">
                {sensorData.fingerDetected
                  ? "Unusual Activity Detected"
                  : "No Unusual Activity Detected"}
              </div>
              <div className="text-yellow-100">
                {sensorData.fingerDetected ? "⚠️ At Risk" : "✅ Normal"}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Daily Goals Progress */}
          <Card className="col-span-2 bg-white/60 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Today's Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {healthGoals.map((goal) => {
                  const IconComponent =
                    iconMap[goal.icon as keyof typeof iconMap] || Activity;
                  const progress = (goal.current / goal.target) * 100;
                  const isComplete = progress >= 100;

                  return (
                    <div key={goal.id} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg bg-${goal.color}-100`}
                          >
                            <IconComponent
                              className={`w-5 h-5 text-${goal.color}-600`}
                            />
                          </div>
                          <div>
                            <div className="font-medium">{goal.title}</div>
                            <div className="text-sm text-gray-500">
                              {goal.current} / {goal.target} {goal.unit}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={isComplete ? "default" : "secondary"}
                            className="flex items-center gap-1"
                          >
                            <Flame className="w-3 h-3" />
                            {goal.streak}
                          </Badge>
                          {isComplete ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          ) : (
                            <Clock className="w-5 h-5 text-gray-400" />
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem
                                onClick={() => handleEditGoal(goal)}
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Goal
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteGoal(goal.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Goal
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="bg-white/60 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {achievements.map((achievement) => {
                  const Icon = achievement.icon;
                  return (
                    <div
                      key={achievement.id}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        achievement.earned
                          ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            achievement.earned ? "bg-yellow-100" : "bg-gray-100"
                          }`}
                        >
                          <Icon
                            className={`w-4 h-4 ${
                              achievement.earned
                                ? "text-yellow-600"
                                : "text-gray-400"
                            }`}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">
                            {achievement.title}
                          </div>
                          <div className="text-xs text-gray-500 mb-2">
                            {achievement.description}
                          </div>
                          {achievement.earned ? (
                            <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                              Earned {achievement.date}
                            </Badge>
                          ) : (
                            <div className="space-y-1">
                              <Progress
                                value={achievement.progress}
                                className="h-1"
                              />
                              <div className="text-xs text-gray-500">
                                {achievement.progress}% complete
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Trends */}
        <Card className="mt-6 bg-white/60 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Weekly Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={streakData}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-3 rounded-lg shadow-lg border">
                            <p className="font-medium">{label}</p>
                            {payload.map((entry, index) => (
                              <p
                                key={index}
                                className="text-sm"
                                style={{ color: entry.color }}
                              >
                                {entry.name}: {entry.value}
                              </p>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="steps"
                    stackId="1"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.1}
                  />
                  <Area
                    type="monotone"
                    dataKey="water"
                    stackId="2"
                    stroke="#06B6D4"
                    fill="#06B6D4"
                    fillOpacity={0.1}
                  />
                  <Area
                    type="monotone"
                    dataKey="sleep"
                    stackId="3"
                    stroke="#8B5CF6"
                    fill="#8B5CF6"
                    fillOpacity={0.1}
                  />
                  <Area
                    type="monotone"
                    dataKey="exercise"
                    stackId="4"
                    stroke="#EF4444"
                    fill="#EF4444"
                    fillOpacity={0.1}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
