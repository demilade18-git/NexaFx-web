"use client";

import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface InfoIconProps {
  content: string;
  size?: "sm" | "md" | "lg";
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
}

const sizeClasses = {
  sm: "h-3.5 w-3.5 text-[9px]",
  md: "h-4 w-4 text-[10px]",
  lg: "h-5 w-5 text-xs",
};

export function InfoIcon({
  content,
  size = "sm",
  side = "top",
  className,
}: InfoIconProps) {
  const [open, setOpen] = useState(false);

  return (
    <TooltipProvider>
      <Tooltip open={open} onOpenChange={setOpen}>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            className={cn(
              "inline-flex items-center justify-center rounded-full border border-gray-300 text-gray-400 hover:text-gray-600 hover:border-gray-500 transition-colors cursor-pointer shrink-0",
              sizeClasses[size],
              className,
            )}
            aria-label={content}
          >
            i
          </button>
        </TooltipTrigger>
        <TooltipContent side={side} className="max-w-[220px]">
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
