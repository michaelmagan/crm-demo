"use client";

import { Message } from "@/components/ui/message";
import { cn } from "@/lib/utils";
import { useTambo } from "@tambo-ai/react";
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
                "max-w-[85%]"
              )}
            >
              <Message
                role={
                  message.role === "user" || message.role === "assistant"
                    ? message.role
                    : "user"
                }
                content={
                  Array.isArray(message.content)
                    ? message.content[0]?.text ?? "Empty message"
                    : typeof message.content === "string"
                    ? message.content
                    : "Empty message"
                }
                variant={variant}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }
);
ThreadContent.displayName = "ThreadContent";

export { ThreadContent, threadContentVariants };
