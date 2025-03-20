"use client";

import * as React from "react";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import * as Collapsible from "@radix-ui/react-collapsible";
import { ThreadContent } from "@/components/ui/thread-content";
import { MessageInput } from "@/components/ui/message-input";
import { ThreadHistory } from "@/components/ui/thread-history";
import { MessageSuggestions } from "@/components/ui/message-suggestions";
import { XIcon } from "lucide-react";
import { Button } from "./button";

const messageThreadCollapsibleVariants = cva(
  "fixed bottom-4 right-4 rounded-lg shadow-lg transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-background border",
        solid: "bg-muted/50 backdrop-blur-sm border",
        bordered: "bg-background border-2",
      },
      state: {
        expanded: "w-full",
        collapsed: "w-auto",
      },
      width: {
        sm: "max-w-xs",
        md: "max-w-sm md:max-w-md",
        lg: "max-w-md md:max-w-lg",
        xl: "max-w-lg md:max-w-xl",
        "2xl": "max-w-xl md:max-w-2xl",
        "3xl": "max-w-2xl md:max-w-3xl",
      },
      height: {
        sm: "[&_div.content-height]:h-[350px]",
        md: "[&_div.content-height]:h-[450px]",
        lg: "[&_div.content-height]:h-[550px]",
        xl: "[&_div.content-height]:h-[650px]",
        "2xl": "[&_div.content-height]:h-[750px]",
      },
    },
    defaultVariants: {
      variant: "default",
      state: "collapsed",
      width: "lg",
      height: "2xl",
    },
    compoundVariants: [
      {
        state: "expanded",
        className:
          "w-[95%] right-[2.5%] left-[2.5%] max-w-[95vw] mx-auto sm:right-4 sm:left-auto",
      },
      {
        state: "expanded",
        width: "sm",
        className: "sm:w-full sm:max-w-xs",
      },
      {
        state: "expanded",
        width: "md",
        className: "sm:w-full sm:max-w-sm md:max-w-md",
      },
      {
        state: "expanded",
        width: "lg",
        className: "sm:w-full sm:max-w-md md:max-w-lg",
      },
      {
        state: "expanded",
        width: "xl",
        className: "sm:w-full sm:max-w-lg md:max-w-xl",
      },
      {
        state: "expanded",
        width: "2xl",
        className: "sm:w-full sm:max-w-xl md:max-w-2xl",
      },
      {
        state: "expanded",
        width: "3xl",
        className: "sm:w-full sm:max-w-2xl md:max-w-3xl",
      },
    ],
  }
);

/**
 * Represents a collapsible message thread component
 * @property {string} className - Optional className for custom styling
 * @property {VariantProps<typeof messageThreadCollapsibleVariants>["variant"]} variant - Optional variant for custom styling
 */

export interface MessageThreadCollapsibleProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: VariantProps<typeof messageThreadCollapsibleVariants>["variant"];
  width?: VariantProps<typeof messageThreadCollapsibleVariants>["width"];
  height?: VariantProps<typeof messageThreadCollapsibleVariants>["height"];
  contextKey?: string;
  defaultOpen?: boolean;
  defaultMessage?: string;
}

const MessageThreadCollapsible = React.forwardRef<
  HTMLDivElement,
  MessageThreadCollapsibleProps
>(
  (
    {
      className,
      variant,
      width,
      height,
      contextKey,
      defaultOpen = false,
      defaultMessage = "How can I help you today?",
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(defaultOpen);
    const [isMac, setIsMac] = React.useState(false);

    // Detect if user is on Mac or Windows
    React.useEffect(() => {
      const isMacOS =
        typeof navigator !== "undefined" &&
        navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      setIsMac(isMacOS);
    }, []);

    // Add keyboard shortcut (Command+K) to toggle the collapsible
    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if ((event.metaKey || event.ctrlKey) && event.key === "k") {
          event.preventDefault();
          setIsOpen((prev) => !prev);
        }
      };

      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, []);

    const shortcutText = isMac ? "⌘K" : "Ctrl+K";

    // Handle thread change
    const handleThreadChange = React.useCallback(() => {
      // Make sure the collapsible stays open when thread changes
      setIsOpen(true);
    }, []);

    return (
      <Collapsible.Root
        ref={ref}
        open={isOpen}
        onOpenChange={setIsOpen}
        className={cn(
          messageThreadCollapsibleVariants({
            variant,
            state: isOpen ? "expanded" : "collapsed",
            width,
            height,
          }),
          className
        )}
        {...props}
      >
        <Collapsible.Trigger asChild>
          <button
            className={cn(
              "flex items-center justify-between p-4",
              "hover:bg-muted/50 transition-colors",
              "border-b",
              isOpen ? "w-full" : "rounded-lg"
            )}
            aria-expanded={isOpen}
            aria-controls="message-thread-content"
          >
            <div className="flex items-center gap-2">
              <span>{isOpen ? "Conversations" : "Use AI"}</span>
              {isOpen && (
                <ThreadHistory
                  contextKey={contextKey}
                  onThreadChange={handleThreadChange}
                />
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground pl-8">
                {isOpen ? "" : `(${shortcutText})`}
              </span>
              {isOpen && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                  }}
                  aria-label="Close"
                >
                  <XIcon className="h-3 w-3" />
                </Button>
              )}
            </div>
          </button>
        </Collapsible.Trigger>
        <Collapsible.Content>
          <div
            className={cn(
              "flex flex-col content-height",
              isOpen ? "h-[500px]" : "h-0"
            )}
          >
            <div className="flex-1 overflow-y-auto p-4">
              <ThreadContent variant={variant} />
            </div>
            <MessageSuggestions />
            <div className="p-4 border-t">
              <MessageInput
                variant={variant}
                contextKey={contextKey}
                placeholder={defaultMessage}
              />
            </div>
          </div>
        </Collapsible.Content>
      </Collapsible.Root>
    );
  }
);
MessageThreadCollapsible.displayName = "MessageThreadCollapsible";

export { MessageThreadCollapsible, messageThreadCollapsibleVariants };
