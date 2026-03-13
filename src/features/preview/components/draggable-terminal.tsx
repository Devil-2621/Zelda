"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  X,
  Minimize2,
  Maximize2,
  TerminalSquareIcon,
  CopyIcon,
  MessageCircleIcon,
} from "lucide-react";
import { PreviewTerminal } from "./preview-terminal";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ADD_TO_CHAT_EVENT } from "@/lib/chat-events";

interface DraggableTerminalProps {
  output: string;
  onClose: () => void;
}

type ResizeDirection = 
  | "n" | "s" | "e" | "w" 
  | "ne" | "nw" | "se" | "sw" 
  | null;

export const DraggableTerminal = ({ output, onClose }: DraggableTerminalProps) => {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [size, setSize] = useState({ width: 600, height: 400 });
  const [isDragging, setIsDragging] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<ResizeDirection>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0, posX: 0, posY: 0 });
  const terminalRef = useRef<HTMLDivElement>(null);

  const MIN_WIDTH = 400;
  const MIN_HEIGHT = 200;
  const MINIMIZED_HEIGHT = 100; // Height when minimized (shows ~3 lines)

  const handleCopyTerminal = async () => {
    if (!output) {
      toast.error("No terminal output to copy");
      return;
    }

    try {
      await navigator.clipboard.writeText(output);
      toast.success("Terminal output copied");
    } catch {
      toast.error("Unable to copy terminal output");
    }
  };

  const handleAddTerminalToChat = () => {
    if (!output) {
      toast.error("No terminal output to add");
      return;
    }

    window.dispatchEvent(
      new CustomEvent(ADD_TO_CHAT_EVENT, {
        detail: { text: output, source: "terminal" },
      })
    );
    toast.success("Terminal output added to chat");
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".terminal-header") && 
        !(e.target as HTMLElement).closest("button")) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  }, [position]);

  const handleResizeStart = useCallback((direction: ResizeDirection) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setResizeDirection(direction);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
      posX: position.x,
      posY: position.y,
    });
  }, [size, position]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      }
      
      if (resizeDirection) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        
        let newWidth = resizeStart.width;
        let newHeight = resizeStart.height;
        let newX = resizeStart.posX;
        let newY = resizeStart.posY;

        // Handle horizontal resizing
        if (resizeDirection.includes("e")) {
          newWidth = Math.max(MIN_WIDTH, resizeStart.width + deltaX);
        } else if (resizeDirection.includes("w")) {
          const potentialWidth = resizeStart.width - deltaX;
          if (potentialWidth >= MIN_WIDTH) {
            newWidth = potentialWidth;
            newX = resizeStart.posX + deltaX;
          }
        }

        // Handle vertical resizing
        if (resizeDirection.includes("s")) {
          newHeight = Math.max(MIN_HEIGHT, resizeStart.height + deltaY);
        } else if (resizeDirection.includes("n")) {
          const potentialHeight = resizeStart.height - deltaY;
          if (potentialHeight >= MIN_HEIGHT) {
            newHeight = potentialHeight;
            newY = resizeStart.posY + deltaY;
          }
        }

        setSize({ width: newWidth, height: newHeight });
        setPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setResizeDirection(null);
    };

    if (isDragging || resizeDirection) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = isDragging ? "grabbing" : getCursorStyle(resizeDirection);
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging, resizeDirection, dragOffset, resizeStart]);

  const getCursorStyle = (direction: ResizeDirection): string => {
    switch (direction) {
      case "n":
      case "s":
        return "ns-resize";
      case "e":
      case "w":
        return "ew-resize";
      case "ne":
      case "sw":
        return "nesw-resize";
      case "nw":
      case "se":
        return "nwse-resize";
      default:
        return "default";
    }
  };

  return (
    <div
      ref={terminalRef}
      className="fixed z-50 bg-background border-2 border-border shadow-2xl rounded-lg overflow-hidden"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: isMinimized ? "500px" : `${size.width}px`,
        height: isMinimized ? `${MINIMIZED_HEIGHT}px` : `${size.height}px`,
        cursor: isDragging ? "grabbing" : "default",
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Resize handles - Edges */}
      {!isMinimized && (
        <>
          {/* Top */}
          <div
            className="absolute top-0 left-0 right-0 h-1 cursor-ns-resize hover:bg-primary/20 transition-colors"
            onMouseDown={handleResizeStart("n")}
          />
          {/* Bottom */}
          <div
            className="absolute bottom-0 left-0 right-0 h-1 cursor-ns-resize hover:bg-primary/20 transition-colors"
            onMouseDown={handleResizeStart("s")}
          />
          {/* Left */}
          <div
            className="absolute top-0 bottom-0 left-0 w-1 cursor-ew-resize hover:bg-primary/20 transition-colors"
            onMouseDown={handleResizeStart("w")}
          />
          {/* Right */}
          <div
            className="absolute top-0 bottom-0 right-0 w-1 cursor-ew-resize hover:bg-primary/20 transition-colors"
            onMouseDown={handleResizeStart("e")}
          />
          
          {/* Resize handles - Corners */}
          {/* Top-left */}
          <div
            className="absolute top-0 left-0 w-3 h-3 cursor-nwse-resize hover:bg-primary/30 transition-colors"
            onMouseDown={handleResizeStart("nw")}
          />
          {/* Top-right */}
          <div
            className="absolute top-0 right-0 w-3 h-3 cursor-nesw-resize hover:bg-primary/30 transition-colors"
            onMouseDown={handleResizeStart("ne")}
          />
          {/* Bottom-left */}
          <div
            className="absolute bottom-0 left-0 w-3 h-3 cursor-nesw-resize hover:bg-primary/30 transition-colors"
            onMouseDown={handleResizeStart("sw")}
          />
          {/* Bottom-right */}
          <div
            className="absolute bottom-0 right-0 w-3 h-3 cursor-nwse-resize hover:bg-primary/30 transition-colors"
            onMouseDown={handleResizeStart("se")}
          />
        </>
      )}

      <div className="terminal-header h-9 flex items-center justify-between px-3 bg-sidebar border-b border-border select-none cursor-grab active:cursor-grabbing relative z-10">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <TerminalSquareIcon className="size-3.5" />
          <span className="font-medium">Terminal</span>
          {isMinimized && <span className="text-[10px] opacity-60">(preview)</span>}
        </div>
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 hover:bg-background/80"
            aria-label="Copy terminal output"
            onClick={handleCopyTerminal}
          >
            <CopyIcon className="size-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 hover:bg-background/80"
            aria-label="Add terminal output to chat"
            onClick={handleAddTerminalToChat}
          >
            <MessageCircleIcon className="size-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 hover:bg-background/80"
            onClick={() => setIsMinimized(!isMinimized)}
            title={isMinimized ? "Maximize" : "Minimize"}
          >
            {isMinimized ? (
              <Maximize2 className="size-3" />
            ) : (
              <Minimize2 className="size-3" />
            )}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 hover:bg-destructive/20 hover:text-destructive"
            onClick={onClose}
            title="Close"
          >
            <X className="size-3.5" />
          </Button>
        </div>
      </div>

      <div 
        className="relative" 
        style={{ 
          height: isMinimized ? `${MINIMIZED_HEIGHT - 36}px` : `${size.height - 36}px`,
          opacity: isMinimized ? 0.8 : 1
        }}
      >
        <PreviewTerminal output={output} />
      </div>
    </div>
  );
};
