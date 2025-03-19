"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useTamboSuggestions } from "@tambo-ai/react";
import { LightbulbIcon, CheckIcon } from "lucide-react";
import { Button } from "./button";

export interface MessageSuggestionsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  maxSuggestions?: number;
}

export function MessageSuggestions({
  className,
  maxSuggestions = 3,
  ...props
}: MessageSuggestionsProps) {
  const { suggestions, selectedSuggestionId, accept } = useTamboSuggestions({
    maxSuggestions,
  });
  const [isMac, setIsMac] = React.useState(false);

  // Detect if user is on Mac or Windows
  React.useEffect(() => {
    const isMacOS =
      typeof navigator !== "undefined" &&
      navigator.platform.toUpperCase().indexOf("MAC") >= 0;
    setIsMac(isMacOS);
  }, []);

  // Add keyboard shortcuts for selecting suggestions
  React.useEffect(() => {
    if (!suggestions || suggestions.length === 0) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Command+Option+Number (Mac) or Ctrl+Alt+Number (Windows/Linux)
      const modifierPressed = isMac
        ? event.metaKey && event.altKey
        : event.ctrlKey && event.altKey;

      if (modifierPressed) {
        // Check if pressed key is a number key (1-9)
        const keyNum = parseInt(event.key);
        if (!isNaN(keyNum) && keyNum > 0 && keyNum <= suggestions.length) {
          event.preventDefault();
          const suggestionIndex = keyNum - 1; // Convert to 0-based index
          accept({ suggestion: suggestions[suggestionIndex] });
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [suggestions, accept, isMac]);

  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  const modKey = isMac ? "⌘" : "Ctrl";
  const altKey = isMac ? "⌥" : "Alt";

  return (
    <div className={cn("px-4 py-2 border-t", className)} {...props}>
      <div className="flex items-center gap-2 mb-2">
        <LightbulbIcon className="h-4 w-4 text-amber-500" />
        <span className="text-sm font-medium">Suggestions</span>
      </div>
      <div className="space-y-2">
        {suggestions.map((suggestion, index) => (
          <div
            key={suggestion.id}
            className={cn(
              "p-2 rounded-md text-sm cursor-pointer transition-colors",
              "hover:bg-muted/70",
              selectedSuggestionId === suggestion.id
                ? "bg-muted border-l-2 border-primary"
                : "bg-muted/30"
            )}
            onClick={() => accept({ suggestion })}
          >
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{suggestion.title}</span>
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono rounded border border-muted-foreground/30 bg-muted/50">
                  {modKey}+{altKey}+{index + 1}
                </kbd>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5"
                onClick={(e) => {
                  e.stopPropagation();
                  accept({ suggestion, shouldSubmit: true });
                }}
              >
                <CheckIcon className="h-3 w-3" />
              </Button>
            </div>
            <p className="text-muted-foreground line-clamp-2">
              {suggestion.detailedSuggestion}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
