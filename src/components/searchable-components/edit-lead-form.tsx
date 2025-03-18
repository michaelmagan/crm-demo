import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Lead, LeadStatus } from "@/services/leads-service";
import React, { useEffect, useState } from "react";
import { useLeadStore } from "../../store/lead-store";
import { FormWrapper, FormField } from "@/components/ui/form-wrapper";

interface EditLeadFormProps {
  lead: Lead;
  onClose?: () => void;
}

export default function EditLeadForm({ lead, onClose }: EditLeadFormProps) {
  const [name, setName] = useState(lead.name);
  const [email, setEmail] = useState(lead.email);
  const [company, setCompany] = useState(lead.company);
  const [phone, setPhone] = useState(lead.phone);
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [submitState, setSubmitState] = useState<
    "idle" | "loading" | "success"
  >("idle");

  useEffect(() => {
    setName(lead.name);
    setEmail(lead.email);
    setCompany(lead.company);
    setPhone(lead.phone);
    setStatus(lead.status);
  }, [lead]);

  const { updateExistingLead } = useLeadStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitState("loading");
    await updateExistingLead(lead.id, {
      name,
      email,
      company,
      phone,
      status,
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
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-10 rounded-md"
          required
        />
      </FormField>

      <FormField label="Email" htmlFor="email">
        <Input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-10 rounded-md"
          required
        />
      </FormField>

      <FormField label="Company" htmlFor="company">
        <Input
          id="company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="h-10 rounded-md"
        />
      </FormField>

      <FormField label="Phone" htmlFor="phone">
        <Input
          type="tel"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="h-10 rounded-md"
        />
      </FormField>

      <FormField label="Status" htmlFor="status">
        <Select
          value={status}
          onValueChange={(value) => setStatus(value as LeadStatus)}
        >
          <SelectTrigger className="h-10 rounded-md">
            <SelectValue placeholder="Select a status">
              <span
                style={{
                  backgroundColor: getStatusColor(status),
                  padding: "2px 8px",
                  borderRadius: "4px",
                  display: "inline-block",
                }}
              >
                {status}
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
