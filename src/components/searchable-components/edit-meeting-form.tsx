import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Meeting } from "@/services/leads-service";
import { useLeadStore } from "@/store/lead-store";
import React, { useEffect, useState } from "react";
import { FormWrapper, FormField } from "@/components/ui/form-wrapper";

interface EditMeetingFormProps {
  meeting: Meeting;
  leadId: number;
  onClose?: () => void;
}

export default function EditMeetingForm({
  meeting,
  leadId,
  onClose,
}: EditMeetingFormProps) {
  const [date, setDate] = useState(meeting.date);
  const [time, setTime] = useState(meeting.time);
  const [description, setDescription] = useState(meeting.description);
  const [submitState, setSubmitState] = useState<
    "idle" | "loading" | "success"
  >("idle");

  useEffect(() => {
    setDate(meeting.date);
    setTime(meeting.time);
    setDescription(meeting.description);
  }, [meeting]);

  const { updateExistingLead, leads } = useLeadStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitState("loading");

    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    const updatedMeetings = lead.meetings.map((m) =>
      m.id === meeting.id ? { ...m, date, time, description } : m
    );

    await updateExistingLead(leadId, { ...lead, meetings: updatedMeetings });

    setSubmitState("success");
    setTimeout(() => {
      setSubmitState("idle");
      onClose?.();
    }, 500);
  };

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
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="h-10 rounded-md"
          required
        />
      </FormField>

      <FormField label="Time" htmlFor="time">
        <Input
          type="time"
          id="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="h-10 rounded-md"
          required
        />
      </FormField>

      <FormField label="Description" htmlFor="description">
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[100px] rounded-md resize-none"
          placeholder="Meeting details..."
          required
        />
      </FormField>
    </FormWrapper>
  );
}
