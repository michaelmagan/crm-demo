"use client";

import * as React from "react";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useTamboThreadInput } from "@tambo-ai/react";

const messageInputVariants = cva("w-full", {
  variants: {
    variant: {
      default: "",
      solid: [
        "shadow shadow-zinc-900/10 dark:shadow-zinc-900/20",
        "[&_input]:bg-muted [&_input]:dark:bg-muted",
      ].join(" "),
      bordered: ["[&_input]:border-2", "[&_input]:border-border"].join(" "),
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

/**
 * Represents a message input component
 * @property {string} className - Optional className for custom styling
 * @property {VariantProps<typeof messageInputVariants>["variant"]} variant - Optional variant for custom styling
 */

export interface MessageInputProps
  extends React.HTMLAttributes<HTMLFormElement> {
  variant?: VariantProps<typeof messageInputVariants>["variant"];
  placeholder?: string;
}

interface ThreadMessageInputProps {
  contextKey: string | undefined;
}

const MessageInput = React.forwardRef<
  HTMLInputElement,
  MessageInputProps & ThreadMessageInputProps
>(
  (
    {
      className,
      variant,
      contextKey,
      placeholder = "Type your message...",
      ...props
    },
    ref
  ) => {
    const { value, setValue, submit, isPending, error } =
      useTamboThreadInput(contextKey);
    const [isMac, setIsMac] = React.useState(false);

    // Detect if user is on Mac or Windows
    React.useEffect(() => {
      const isMacOS =
        typeof navigator !== "undefined" &&
        navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      setIsMac(isMacOS);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!value.trim()) return;

      try {
        // Submit the message with streaming enabled
        await submit({ streamResponse: true });
        // Only clear after successful submission
        setValue("");
      } catch (error) {
        console.error("Failed to submit message:", error);
      }
    };

    React.useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
          e.preventDefault();
          if (!value.trim()) return;
          submit({ streamResponse: true });
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [value, submit]);

    const modKey = isMac ? "⌘" : "Ctrl";

    if (contextKey === undefined || contextKey === "") {
      return (
        <p className="text-destructive">
          No context key provided, cannot send messages
        </p>
      );
    }

    return (
      <form
        onSubmit={handleSubmit}
        className={cn(messageInputVariants({ variant }), className)}
        {...props}
      >
        <div className="flex gap-2">
          <input
            ref={ref}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="flex-1 p-2 rounded-lg border bg-background text-foreground border-border"
            disabled={isPending}
            placeholder={placeholder}
            aria-label="Message Input"
          />
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            {isPending ? "..." : "Send"}
          </button>
        </div>
        <div className="flex flex-col items-center mt-2 text-xs">
          <div className="flex items-center gap-1 text-muted-foreground">
            <span>Press</span>
            <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted font-mono text-xs">
              {modKey}
            </kbd>
            <span>+</span>
            <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted font-mono text-xs">
              Enter
            </kbd>
            <span>to send</span>
          </div>
          {error && (
            <p className="text-sm text-destructive mt-1">{error.message}</p>
          )}
        </div>
      </form>
    );
  }
);
MessageInput.displayName = "MessageInput";

export { MessageInput, messageInputVariants };
