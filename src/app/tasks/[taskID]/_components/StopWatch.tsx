"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ClassProps } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";
import { LogType } from "@/server/api/routers/logs/types";

type Props = { startTime: Date; endTime?: Date | null } & ClassProps;
export default function LogWatch({ className, startTime, endTime }: Props) {
  const [isRunning, setIsRunning] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);
  const startTimeRef = useRef(0);
  const animationFrameRef = useRef(0);
  const [formattedStartDate, setFormattedStartDate] = useState<string>(() => {
    const formattedDate = startTime.toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      weekday: "long",
      hour12: true,
      hour: "numeric",
      year: "numeric",
      minute: "numeric",
    });

    return formattedDate;
  });

  const [formattedEndDate, setFormattedEndDate] = useState<string>(() => {
    console.log("updated the current time entry");
    const formattedDate =
      endTime?.toLocaleString("en-US", {
        day: "2-digit",
        month: "short",
        weekday: "long",
        hour12: true,
        hour: "numeric",
        year: "numeric",
        minute: "numeric",
      }) ?? "TBD";

    return formattedDate ?? "TBD";
  });

  const updateTime = useCallback(() => {
    if (isRunning) {
      const now = startTime.getTime();
      setElapsedTime(() => startTimeRef.current - now);
      startTimeRef.current = Date.now();
      animationFrameRef.current = requestAnimationFrame(updateTime);
    }
  }, [isRunning]);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now();
      animationFrameRef.current = requestAnimationFrame(updateTime);
    } else {
      cancelAnimationFrame(animationFrameRef.current);
    }

    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [isRunning, updateTime]);

  useEffect(() => {
    setFormattedEndDate(() => {
      const formattedDate =
        endTime?.toLocaleString("en-US", {
          day: "2-digit",
          month: "short",
          weekday: "long",
          hour12: true,
          hour: "numeric",
          year: "numeric",
          minute: "numeric",
        }) ?? "TBD";

      setIsRunning((prevState) => {
        if(startTime && endTime) return false

        return true
      });
      return formattedDate ?? "TBD";
    });
  }, [endTime]);
  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);

    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${centiseconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className={cn(className, "")}>
      <p className="text-xs">
        Start &#8212;{" "}
        <span className="font-mono text-xs">{formattedStartDate}</span>
      </p>
      <p className="text-xs">
        Stop &#8212;{" "}
        <span className="font-mono text-xs">{formattedEndDate}</span>
      </p>

      <div
        className="text-center font-mono text-xl font-semibold"
        aria-live="polite"
      >
        {formatTime(elapsedTime)}
      </div>
    </div>
  );
}
