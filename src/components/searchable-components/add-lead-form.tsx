import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Lead, LeadStatus } from "@/services/leads-service";
import React, { useState } from "react";
import { useLeadStore } from "../../store/lead-store";
import { FormWrapper, FormField } from "@/components/ui/form-wrapper";
import {
  useTamboComponentState,
  useTamboStreamingProps,
} from "@tambo-ai/react";
import { z } from "zod";

// 1. Define schema for Tambo registration
export const LeadFormSchema = z.object({
  name: z.string().optional().default(""),
  email: z.string().email().optional().default(""),
  company: z.string().optional().default(""),
  phone: z.string().optional().default(""),
  status: z
    .enum(["New", "Contacted", "Qualified", "Closed"])
    .optional()
    .default("New"),
});

// 2. Define component props derived from schema
export type LeadFormData = z.infer<typeof LeadFormSchema>;
export type AddLeadFormProps = {
  lead?: Lead;
  onClose?: () => void;
};

interface FormState {
  name: string;
  email: string;
  company: string;
  phone: string;
  status: LeadStatus;
}

export default function AddLeadForm({ lead, onClose }: AddLeadFormProps) {
  const [formState, setFormState] = useTamboComponentState<FormState>(
    "addLeadForm",
    {
      name: "",
      email: "",
      company: "",
      phone: "",
      status: "New" as LeadStatus,
    }
  );

  const [submitState, setSubmitState] = useState<
    "idle" | "loading" | "success"
  >("idle");

  // 3. Connect streaming lead prop to form state
  useTamboStreamingProps(formState, setFormState, {
    name: lead?.name || "",
    email: lead?.email || "",
    company: lead?.company || "",
    phone: lead?.phone || "",
    status: lead?.status || "New",
  });

  const { addNewLead } = useLeadStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState) return;

    setSubmitState("loading");

    await addNewLead({
      name: formState.name,
      email: formState.email,
      company: formState.company,
      phone: formState.phone,
      status: formState.status,
      notes: [],
      meetings: [],
    });

    setSubmitState("success");

    setTimeout(() => {
      setSubmitState("idle");
      if (formState) {
        setFormState({
          name: "",
          email: "",
          company: "",
          phone: "",
          status: "New",
        });
      }
      onClose?.();
    }, 500);
  };

  const getStatusColor = (status: LeadStatus): string => {
    switch (status) {
      case "New":
        return "#e5f6fd";
      case "Contacted":
        return "#fff4e5";
      case "Qualified":
        return "#e5ffe5";
      case "Closed":
        return "#ffe5e5";
      default:
        return "transparent";
    }
  };

  if (!formState) return null;

  return (
    <FormWrapper
      title="Add a lead"
      onClose={onClose}
      onSubmit={handleSubmit}
      submitLabel="Create"
      submitState={submitState}
      successLabel="Added!"
    >
      <FormField label="Name" htmlFor="name">
        <Input
          id="name"
          value={formState.name}
          placeholder="Lead Name"
          onChange={(e) =>
            setFormState({
              ...formState,
              name: e.target.value,
            })
          }
          className="h-10 rounded-md"
          required
        />
      </FormField>

      <FormField label="Email" htmlFor="email">
        <Input
          type="email"
          id="email"
          value={formState.email}
          placeholder="Lead Email"
          onChange={(e) =>
            setFormState({
              ...formState,
              email: e.target.value,
            })
          }
          className="h-10 rounded-md"
          required
        />
      </FormField>

      <FormField label="Company" htmlFor="company">
        <Input
          id="company"
          value={formState.company}
          placeholder="Lead Company"
          onChange={(e) =>
            setFormState({
              ...formState,
              company: e.target.value,
            })
          }
          className="h-10 rounded-md"
        />
      </FormField>

      <FormField label="Phone" htmlFor="phone">
        <Input
          type="tel"
          id="phone"
          value={formState.phone}
          placeholder="Lead Phone"
          onChange={(e) =>
            setFormState({
              ...formState,
              phone: e.target.value,
            })
          }
          className="h-10 rounded-md"
        />
      </FormField>

      <FormField label="Status" htmlFor="status">
        <Select
          value={formState.status}
          onValueChange={(value) =>
            setFormState({
              ...formState,
              status: value as LeadStatus,
            })
          }
        >
          <SelectTrigger className="h-10 rounded-md">
            <SelectValue placeholder="Select a status">
              <span
                style={{
                  backgroundColor: getStatusColor(formState.status),
                  padding: "2px 8px",
                  borderRadius: "4px",
                  display: "inline-block",
                }}
              >
                {formState.status}
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {["New", "Contacted", "Qualified", "Closed"].map((statusOption) => (
              <SelectItem key={statusOption} value={statusOption}>
                <span
                  style={{
                    backgroundColor: getStatusColor(statusOption as LeadStatus),
                    padding: "2px 8px",
                    borderRadius: "4px",
                    display: "inline-block",
                  }}
                >
                  {statusOption}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>
    </FormWrapper>
  );
}
