import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card";
import { XIcon } from "lucide-react";
import { Button } from "./button";
import { Loader2 } from "lucide-react";

interface FormWrapperProps {
  title: string;
  onClose?: () => void;
  onSubmit: (e: React.FormEvent) => void;
  submitLabel: string;
  submitState: "idle" | "loading" | "success";
  successLabel?: string;
  children: React.ReactNode;
  formClassName?: string;
  width?: string;
}

export function FormWrapper({
  title,
  onClose,
  onSubmit,
  submitLabel,
  submitState,
  successLabel = "Success!",
  children,
  formClassName,
  width = "500px",
}: FormWrapperProps) {
  return (
    <Card
      className={`${width} max-w-full relative shadow-lg border border-gray-200`}
    >
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
              aria-label="Close"
            >
              <XIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </CardHeader>
      <form onSubmit={onSubmit} className={formClassName}>
        <CardContent className="space-y-6">{children}</CardContent>
        <CardFooter className="pt-2 pb-6">
          <Button
            type="submit"
            className={`w-full h-11 font-medium rounded-md transition-all duration-300 ease-in-out ${
              submitState === "loading"
                ? "w-12 p-0"
                : submitState === "success"
                ? "w-24 bg-green-500 hover:bg-green-600"
                : ""
            }`}
            disabled={submitState !== "idle"}
          >
            {submitState === "idle" && submitLabel}
            {submitState === "loading" && (
              <Loader2 className="h-5 w-5 animate-spin" />
            )}
            {submitState === "success" && successLabel}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

export function FormField({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </label>
      {children}
    </div>
  );
}
