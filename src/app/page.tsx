"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";

interface ClassInfo {
  id: string;
  name: string;
  day: string;
  time: string;
  duration: string;
  isLab: boolean;
}

export default function Component() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scheduleTitle, setScheduleTitle] = useState("CLASS SCHEDULE");
  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [duration, setDuration] = useState("1");
  const [isLab, setIsLab] = useState(false);
  const [classes, setClasses] = useState<ClassInfo[]>([]);

  const timeSlots = Array.from({ length: 9 }, (_, i) => {
    const hour = i + 10;
    return `${hour}:00`;
  });

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  useEffect(() => {
    drawSchedule();
  }, [scheduleTitle, section, classes]);

  const drawSchedule = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = 1200;
    canvas.height = 800;

    // Draw background
    ctx.fillStyle = "#2d2d2d";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw header
    ctx.fillStyle = "#ffffff";
    // ctx.fillRect(0, 0, canvas.width, 60);
    // ctx.fillStyle = "#000000";
    ctx.font = "bold 32px Arial";
    const titleText = scheduleTitle;
    const titleWidth = ctx.measureText(titleText).width;
    ctx.fillText(titleText, (canvas.width - titleWidth) / 2, 50);

    // Draw section info
    const sectionWidth = 200;
    ctx.fillStyle = "#98fb98";
    ctx.beginPath();
    ctx.roundRect(150, 20, sectionWidth, 40, 8);
    ctx.fill();
    ctx.fillStyle = "#000000";
    ctx.font = "16px Arial";
    ctx.fillText(`Section: ${section || "Not Set"}`, 160, 45);

    // Draw grid
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1;

    // Draw time column
    let startY = 140;
    ctx.fillStyle = "#b0e0e6";
    timeSlots.forEach((time, i) => {
      ctx.beginPath();
      ctx.roundRect(65, startY + i * 70 + 10, 150, 50, 8);
      ctx.fill();
      ctx.fillStyle = "#000000";
      ctx.font = "14px Arial";
      ctx.fillText(time, 75, startY + 30 + i * 70);
      ctx.fillStyle = "#b0e0e6";
    });

    // Draw day headers
    let startX = 240;
    ctx.fillStyle = "#ffa07a";
    days.forEach((day, i) => {
      ctx.beginPath();
      ctx.roundRect(startX + i * 180, startY - 50, 160, 40, 8);
      ctx.fill();
      ctx.fillStyle = "#000000";
      ctx.font = "bold 16px Arial";
      const dayWidth = ctx.measureText(day).width;
      ctx.fillText(day, startX + (160 - dayWidth) / 2 + i * 180, startY - 25);
      ctx.fillStyle = "#ffa07a";
    });

    // Draw grid lines
    for (let i = 0; i <= timeSlots.length; i++) {
      ctx.beginPath();
      ctx.moveTo(50, startY + i * 70);
      ctx.lineTo(1150, startY + i * 70);
      ctx.stroke();
    }

    for (let i = 0; i <= days.length + 1; i++) {
      ctx.beginPath();
      ctx.moveTo(50 + i * 180, startY - 50);
      ctx.lineTo(50 + i * 180, startY + timeSlots.length * 70);
      ctx.stroke();
    }
    classes.forEach((classInfo) => {
      const dayIndex = days.indexOf(classInfo.day);
      const timeIndex = timeSlots.findIndex((time) => time === classInfo.time);
      const durationHours = parseInt(classInfo.duration);

      if (dayIndex === -1 || timeIndex === -1) return;

      ctx.fillStyle = classInfo.isLab ? "#ff9999" : "#98fb98";
      ctx.beginPath();
      ctx.roundRect(
        240 + dayIndex * 180,
        150 + timeIndex * 70,
        160,
        50 * durationHours + (durationHours - 1) * 20,
        8
      );
      ctx.fill();

      ctx.fillStyle = "#000000";
      ctx.font = "16px Arial";
      const text = `${classInfo.name}${classInfo.isLab ? " (Lab)" : ""}`;
      const textWidth = ctx.measureText(text).width;
      ctx.fillText(
        text,
        240 + dayIndex * 180 + (160 - textWidth) / 2,
        150 + timeIndex * 70 + 25
      );
      console.log({
        x: 240 + dayIndex * 180 + (160 - textWidth) / 2,
        y: 150 + timeIndex * 70 + 25,
      });
    });
  };

  const addClass = () => {
    if (!className || !selectedDay || !selectedTime) return;

    const newClass: ClassInfo = {
      id: Date.now().toString(),
      name: className,
      day: selectedDay,
      time: selectedTime,
      duration: duration,
      isLab: isLab,
    };

    setClasses([...classes, newClass]);
    setClassName("");
    setSelectedDay("");
    setSelectedTime("");
    setDuration("1");
    setIsLab(false);
  };

  const removeClass = (id: string) => {
    setClasses(classes.filter((c) => c.id !== id));
  };

  const exportToPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = "class-schedule.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="scheduleTitle">Schedule Title</Label>
          <Input
            id="scheduleTitle"
            value={scheduleTitle}
            onChange={(e) => setScheduleTitle(e.target.value)}
            placeholder="Enter schedule title"
            maxLength={50}
          />
        </div>
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="section">Section</Label>
          <Input
            id="section"
            value={section}
            onChange={(e) => setSection(e.target.value)}
            placeholder="Enter section"
            maxLength={20}
          />
        </div>
        <div className="md:col-span-2 my-4 h-px bg-border" />
        <div className="space-y-2">
          <Label htmlFor="className">Class Name</Label>
          <Input
            id="className"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            placeholder="Enter class name"
            maxLength={30}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="day">Day</Label>
          <Select onValueChange={setSelectedDay} value={selectedDay}>
            <SelectTrigger>
              <SelectValue placeholder="Select day" />
            </SelectTrigger>
            <SelectContent>
              {days.map((day) => (
                <SelectItem key={day} value={day}>
                  {day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="time">Start Time</Label>
          <Select onValueChange={setSelectedTime} value={selectedTime}>
            <SelectTrigger>
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (hours)</Label>
          <Select onValueChange={setDuration} value={duration}>
            <SelectTrigger>
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 hour</SelectItem>
              <SelectItem value="2">2 hours</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="isLab" checked={isLab} onCheckedChange={setIsLab} />
          <Label htmlFor="isLab">Is Lab Session</Label>
        </div>
        <div className="md:col-span-2 flex flex-row gap-4">
          <Button onClick={addClass}>Add Class</Button>
          <Button variant="outline" onClick={exportToPNG}>
            Export to PNG
          </Button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-3/4">
          <canvas ref={canvasRef} className="w-full h-auto border rounded-lg" />
        </div>
        <div className="w-full md:w-1/4 space-y-4">
          <h3 className="text-lg font-semibold">Added Classes</h3>
          {classes.map((classInfo) => (
            <Card key={classInfo.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {classInfo.name}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeClass(classInfo.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  {classInfo.day}, {classInfo.time}, {classInfo.duration}h
                  {classInfo.isLab ? " (Lab)" : ""}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
