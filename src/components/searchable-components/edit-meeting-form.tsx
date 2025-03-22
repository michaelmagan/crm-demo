import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Meeting } from "@/services/leads-service";
import { useLeadStore } from "@/store/lead-store";
import React, { useState } from "react";
import { FormWrapper, FormField } from "@/components/ui/form-wrapper";
import {
  useTamboComponentState,
  useTamboStreamingProps,
} from "@tambo-ai/react";
import { z } from "zod";

// 1. Define schema for Tambo registration
export const EditMeetingSchema = z.object({
  meetingId: z.number(),
  leadId: z.number(),
  date: z.string(),
  time: z.string(),
  description: z.string(),
});

// 2. Define component props derived from schema
export type EditMeetingProps = {
  meeting: Meeting;
  leadId: number;
  onClose?: () => void;
};

interface FormState {
  date: string;
  time: string;
  description: string;
}

export default function EditMeetingForm({
  meeting,
  leadId,
  onClose,
}: EditMeetingProps) {
  const [formState, setFormState] = useTamboComponentState<FormState>(
    "editMeetingForm",
    {
      date: "",
      time: "",
      description: "",
    }
  );

  const [submitState, setSubmitState] = useState<
    "idle" | "loading" | "success"
  >("idle");

  // 3. Connect streaming props to form state
  useTamboStreamingProps(formState, setFormState, {
    date: meeting.date,
    time: meeting.time,
    description: meeting.description,
  });

  const { updateExistingLead, leads } = useLeadStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState) return;

    setSubmitState("loading");

    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    const updatedMeetings = lead.meetings.map((m) =>
      m.id === meeting.id
        ? {
            ...m,
            date: formState.date,
            time: formState.time,
            description: formState.description,
          }
        : m
    );

    await updateExistingLead(leadId, { ...lead, meetings: updatedMeetings });

    setSubmitState("success");
    setTimeout(() => {
      setSubmitState("idle");
      onClose?.();
    }, 500);
  };

  if (!formState) return null;

  return (
    <FormWrapper
      title="Edit meeting"
      onClose={onClose}
      onSubmit={handleSubmit}
      submitLabel="Update"
      submitState={submitState}
      successLabel="Updated!"
    >
      <FormField label="Date" htmlFor="date">
        <Input
          type="date"
          id="date"
          value={formState.date}
          onChange={(e) =>
            setFormState({
              ...formState,
              date: e.target.value,
            })
          }
          className="h-10 rounded-md"
          required
        />
      </FormField>

      <FormField label="Time" htmlFor="time">
        <Input
          type="time"
          id="time"
          value={formState.time}
          onChange={(e) =>
            setFormState({
              ...formState,
              time: e.target.value,
            })
          }
          className="h-10 rounded-md"
          required
        />
      </FormField>

      <FormField label="Description" htmlFor="description">
        <Textarea
          id="description"
          value={formState.description}
          onChange={(e) =>
            setFormState({
              ...formState,
              description: e.target.value,
            })
          }
          className="min-h-[100px] rounded-md resize-none"
          placeholder="Meeting details..."
          required
        />
      </FormField>
    </FormWrapper>
  );
}
