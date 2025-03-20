"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useTamboSuggestions } from "@tambo-ai/react";

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
  const keyCombo = `${modKey}+${altKey}+`;

  return (
    <div className={cn("px-3 py-1 border-t", className)} {...props}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-row gap-2 overflow-x-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.id}
              className={cn(
                "px-2 py-1 rounded-md text-xs cursor-pointer transition-colors flex items-center gap-1.5",
                "hover:bg-muted/70 whitespace-nowrap",
                selectedSuggestionId === suggestion.id
                  ? "bg-muted border-l-2 border-primary"
                  : "bg-muted/30"
              )}
              onClick={() => accept({ suggestion, shouldSubmit: true })}
            >
              <span>{suggestion.title}</span>
              <span className="inline-flex items-center justify-center h-5 w-5 rounded bg-primary/20 font-medium">
                {index + 1}
              </span>
            </div>
          ))}
        </div>
        <div className="text-xs text-muted-foreground whitespace-nowrap px-1 py-0.5 rounded border bg-muted/30">
          {keyCombo}#
        </div>
      </div>
    </div>
  );
}
