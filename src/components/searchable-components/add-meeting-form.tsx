import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLeadStore } from "@/store/lead-store";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { FormWrapper, FormField } from "@/components/ui/form-wrapper";

interface AddMeetingFormProps {
  initialDateTimeISO?: string;
  initialDescription?: string;
  initialLeadId?: string;
  onClose?: () => void;
}

export default function AddMeetingForm({
  initialDateTimeISO: initialDateTime = "",
  initialDescription = "",
  initialLeadId = "",
  onClose,
}: AddMeetingFormProps) {
  const { leads, addNewMeeting } = useLeadStore();
  const [selectedLeadId, setSelectedLeadId] = useState<string>(initialLeadId);
  const [dateTime, setDateTime] = useState(initialDateTime);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState(initialDescription);
  const [submitState, setSubmitState] = useState<
    "idle" | "loading" | "success"
  >("idle");

  useEffect(() => {
    if (initialDateTime) {
      const dateObj = new Date(initialDateTime);
      setDate(dateObj.toISOString().split("T")[0]);
      setTime(dateObj.toTimeString().slice(0, 5));
    }
  }, [initialDateTime]);

  const handleDateTimeChange = (newDate: string, newTime: string) => {
    if (newDate && newTime) {
      const isoString = `${newDate}T${newTime}:00`;
      setDateTime(isoString);
    } else {
      setDateTime("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (dateTime && description && selectedLeadId) {
      setSubmitState("loading");

      try {
        const [date, time] = dateTime.split("T");
        await addNewMeeting(parseInt(selectedLeadId), {
          leadId: parseInt(selectedLeadId),
          date,
          time: time.slice(0, 5),
          description,
        });

        setSubmitState("success");
        setTimeout(() => {
          setSubmitState("idle");
          setDateTime("");
          setDate("");
          setTime("");
          setDescription("");
          setSelectedLeadId("");
          onClose?.();
        }, 500);
      } catch (error) {
        console.error("Failed to add meeting:", error);
        setSubmitState("idle");
      }
    }
  };

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
        <Select value={selectedLeadId} onValueChange={setSelectedLeadId}>
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
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            handleDateTimeChange(e.target.value, time);
          }}
          className="h-10 rounded-md"
          required
        />
      </FormField>

      <FormField label="Time" htmlFor="time">
        <Input
          type="time"
          id="time"
          value={time}
          onChange={(e) => {
            setTime(e.target.value);
            handleDateTimeChange(date, e.target.value);
          }}
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
