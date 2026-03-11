"use client";

import { useTheme } from "next-themes";
import { Sun01Icon, Moon02Icon, ComputerIcon } from "hugeicons-react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type Theme = "light" | "dark" | "system";

const THEMES: { value: Theme; label: string; icon: React.ReactNode }[] = [
  { value: "light", label: "Light", icon: <Sun01Icon size={14} /> },
  { value: "dark", label: "Dark", icon: <Moon02Icon size={14} /> },
  { value: "system", label: "System", icon: <ComputerIcon size={14} /> },
];



export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <ToggleGroup variant="outline" size="sm">
      {THEMES.map(({ value, label, icon }) => (
        <Tooltip key={value}>
          <TooltipTrigger
            render={
              <ToggleGroupItem
                aria-label={`${label} theme`}
                pressed={theme === value}
                onClick={() => setTheme(value)}
              />
            }
          >
            {icon}
          </TooltipTrigger>
          <TooltipContent>{label}</TooltipContent>
        </Tooltip>
      ))}
    </ToggleGroup>
  );
};
