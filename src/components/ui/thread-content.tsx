"use client";

import { cn } from "@/lib/utils";
import { TamboThreadMessage, useTambo } from "@tambo-ai/react";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import * as React from "react";

const threadContentVariants = cva("flex flex-col gap-4", {
  variants: {
    variant: {
      default: "",
      solid: [
        "shadow shadow-zinc-900/10 dark:shadow-zinc-900/20",
        "bg-muted dark:bg-muted",
      ].join(" "),
      bordered: ["border-2", "border-border"].join(" "),
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

/**
 * Represents a thread content component
 * @property {string} className - Optional className for custom styling
 * @property {VariantProps<typeof threadContentVariants>["variant"]} variant - Optional variant for custom styling
 */

export interface ThreadContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: VariantProps<typeof threadContentVariants>["variant"];
}

const ThreadContent = React.forwardRef<HTMLDivElement, ThreadContentProps>(
  ({ className, variant, ...props }, ref) => {
    const { thread } = useTambo();
    const messages = thread?.messages ?? [];

    const renderMessageContent = (message: TamboThreadMessage) => {
      if (typeof message.content === "string") {
        return message.content;
      } else if (Array.isArray(message.content)) {
        // Handle array of content parts by extracting text content
        return message.content
          .map((part) => {
            if (typeof part === "string") return part;
            if (part && typeof part === "object" && "text" in part)
              return part.text;
            return "";
          })
          .join("");
      }
      return "";
    };

    const isAssistantOrHydra = (role: string) => {
      return role === "assistant" || role === "hydra";
    };

    return (
      <div
        ref={ref}
        className={cn(threadContentVariants({ variant }), className)}
        {...props}
      >
        {messages.map((message) => (
          <div
            key={
              message.id ??
              `${message.role}-${
                message.createdAt ?? Date.now()
              }-${message.content?.toString().substring(0, 10)}`
            }
            className={cn(
              "animate-in fade-in-0 slide-in-from-bottom-2",
              "duration-200 ease-in-out"
            )}
            style={{ animationDelay: `${messages.indexOf(message) * 40}ms` }}
          >
            <div
              className={cn(
                "flex flex-col gap-1.5",
                message.role === "user" ? "items-end" : "items-start",
                message.role === "user" ? "ml-12" : "mr-12",
                isAssistantOrHydra(message.role) && message.renderedComponent
                  ? "w-full max-w-full"
                  : "max-w-[85%]"
              )}
            >
              <div
                className={cn(
                  "relative inline-block rounded-lg px-3 py-2 text-[15px] leading-relaxed transition-all duration-200 font-medium max-w-full",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted text-foreground hover:bg-muted/90"
                )}
              >
                <p className="break-words whitespace-pre-wrap">
                  {renderMessageContent(message)}
                </p>
              </div>
              {isAssistantOrHydra(message.role) &&
                message.renderedComponent && (
                  <div className="mt-2 w-full">{message.renderedComponent}</div>
                )}
            </div>
          </div>
        ))}
      </div>
    );
  }
);
ThreadContent.displayName = "ThreadContent";

export { ThreadContent, threadContentVariants };
