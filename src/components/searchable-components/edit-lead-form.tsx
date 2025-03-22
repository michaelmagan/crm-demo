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
export const EditLeadSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  company: z.string(),
  phone: z.string(),
  status: z.enum(["New", "Contacted", "Qualified", "Closed"]),
  notes: z.array(z.any()),
  meetings: z.array(z.any()),
});

// 2. Define component props derived from schema
export type EditLeadProps = {
  lead: Lead;
  onClose?: () => void;
};

interface FormState {
  name: string;
  email: string;
  company: string;
  phone: string;
  status: LeadStatus;
}

export default function EditLeadForm({ lead, onClose }: EditLeadProps) {
  const [formState, setFormState] = useTamboComponentState<FormState>(
    "editLeadForm",
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
    name: lead.name,
    email: lead.email,
    company: lead.company,
    phone: lead.phone,
    status: lead.status,
  });

  const { updateExistingLead } = useLeadStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState) return;

    setSubmitState("loading");
    await updateExistingLead(lead.id, {
      name: formState.name,
      email: formState.email,
      company: formState.company,
      phone: formState.phone,
      status: formState.status,
      notes: lead.notes,
      meetings: lead.meetings,
    });

    setSubmitState("success");
    setTimeout(() => {
      setSubmitState("idle");
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
      title="Edit lead"
      onClose={onClose}
      onSubmit={handleSubmit}
      submitLabel="Update"
      submitState={submitState}
      successLabel="Updated!"
      width="500px"
    >
      <FormField label="Name" htmlFor="name">
        <Input
          id="name"
          value={formState.name}
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
