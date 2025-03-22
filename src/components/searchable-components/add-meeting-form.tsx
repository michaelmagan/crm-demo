import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLeadStore } from "@/store/lead-store";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { FormWrapper, FormField } from "@/components/ui/form-wrapper";
import { MeetingFormProps } from "@/schemas/meeting";
import {
  useTamboComponentState,
  useTamboStreamingProps,
} from "@tambo-ai/react";
import { z } from "zod";

// 1. Define schema for Tambo registration
export const MeetingSchema = z.object({
  initialDateTimeISO: z.string().optional().default(""),
  initialDescription: z.string().optional().default(""),
  initialLeadId: z.string().optional().default(""),
});

// 2. Define component props derived from schema
export type Meeting = z.infer<typeof MeetingSchema>;
export type AddMeetingFormProps = Meeting & { onClose?: () => void };

interface FormState {
  selectedLeadId: string;
  date: string;
  time: string;
  dateTime: string;
  description: string;
}

export default function AddMeetingForm({
  initialDateTimeISO = "",
  initialDescription = "",
  initialLeadId = "",
  onClose,
}: AddMeetingFormProps) {
  const { leads, addNewMeeting } = useLeadStore();

  const [formState, setFormState] = useTamboComponentState<FormState>(
    "addMeetingForm",
    {
      selectedLeadId: "",
      dateTime: "",
      date: "",
      time: "",
      description: "",
    }
  );

  const [submitState, setSubmitState] = useState<
    "idle" | "loading" | "success"
  >("idle");

  // Process initialDateTimeISO for display
  let initialDate = "";
  let initialTime = "";

  if (initialDateTimeISO) {
    const dateObj = new Date(initialDateTimeISO);
    if (!isNaN(dateObj.getTime())) {
      initialDate = dateObj.toISOString().split("T")[0];
      initialTime = dateObj.toTimeString().slice(0, 5);
    }
  }

  // 3. Connect streaming props to form state
  useTamboStreamingProps(formState, setFormState, {
    selectedLeadId: initialLeadId,
    dateTime: initialDateTimeISO,
    date: initialDate,
    time: initialTime,
    description: initialDescription,
  });

  const handleDateTimeChange = (newDate: string, newTime: string) => {
    if (!formState) return;

    if (newDate && newTime) {
      const isoString = `${newDate}T${newTime}:00`;
      setFormState({
        ...formState,
        dateTime: isoString,
        date: newDate,
        time: newTime,
      });
    } else {
      setFormState({
        ...formState,
        dateTime: "",
        date: newDate,
        time: newTime,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState) return;

    if (
      formState.dateTime &&
      formState.description &&
      formState.selectedLeadId
    ) {
      setSubmitState("loading");

      try {
        const [date, time] = formState.dateTime.split("T");
        await addNewMeeting(parseInt(formState.selectedLeadId), {
          leadId: parseInt(formState.selectedLeadId),
          date,
          time: time.slice(0, 5),
          description: formState.description,
        });

        setSubmitState("success");
        setTimeout(() => {
          setSubmitState("idle");
          if (formState) {
            setFormState({
              selectedLeadId: "",
              dateTime: "",
              date: "",
              time: "",
              description: "",
            });
          }
          onClose?.();
        }, 500);
      } catch (error) {
        console.error("Failed to add meeting:", error);
        setSubmitState("idle");
      }
    }
  };

  if (!formState) return null;

  return (
    <FormWrapper
      title="Schedule Meeting"
      onClose={onClose}
      onSubmit={handleSubmit}
      submitLabel="Schedule Meeting"
      submitState={submitState}
      successLabel="Scheduled!"
    >
      <FormField label="Lead" htmlFor="lead">
        <Select
          value={formState.selectedLeadId}
          onValueChange={(value) =>
            setFormState({
              ...formState,
              selectedLeadId: value,
            })
          }
        >
          <SelectTrigger className="h-10 rounded-md">
            <SelectValue placeholder="Select a lead" />
          </SelectTrigger>
          <SelectContent>
            {leads.map((lead) => (
              <SelectItem key={lead.id} value={lead.id.toString()}>
                {lead.name} - {lead.company}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

      <FormField label="Date" htmlFor="date">
        <Input
          type="date"
          id="date"
          value={formState.date}
          onChange={(e) => {
            handleDateTimeChange(e.target.value, formState.time);
          }}
          className="h-10 rounded-md"
          required
        />
      </FormField>

      <FormField label="Time" htmlFor="time">
        <Input
          type="time"
          id="time"
          value={formState.time}
          onChange={(e) => {
            handleDateTimeChange(formState.date, e.target.value);
          }}
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
