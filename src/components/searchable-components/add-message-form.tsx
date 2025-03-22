import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMessageStore } from "@/store/message-store";
import { useState } from "react";
import { FormWrapper, FormField } from "@/components/ui/form-wrapper";
import {
  useTamboComponentState,
  useTamboStreamingProps,
} from "@tambo-ai/react";
import { z } from "zod";

// 1. Define schema for Tambo registration
export const MessageSchema = z.object({
  initialEmail: z.string().email().optional().default(""),
  initialSubject: z.string().optional().default(""),
  initialContent: z.string().optional().default(""),
});

export type Message = z.infer<typeof MessageSchema>;

// 2. Define component props derived from schema
export type AddMessageFormProps = Message & { onClose?: () => void };

interface FormState {
  email: string;
  subject: string;
  content: string;
}

export default function AddMessageForm({
  initialEmail = "",
  initialSubject = "",
  initialContent = "",
  onClose,
}: AddMessageFormProps) {
  const [formState, setFormState] = useTamboComponentState<FormState>(
    "addMessageForm",
    {
      email: "",
      subject: "",
      content: "",
    }
  );

  const [submitState, setSubmitState] = useState<
    "idle" | "loading" | "success"
  >("idle");

  // 3. Connect streaming props to form state
  useTamboStreamingProps(formState, setFormState, {
    email: initialEmail,
    subject: initialSubject,
    content: initialContent,
  });

  const { addNewMessage } = useMessageStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState) return;

    setSubmitState("loading");

    await addNewMessage({
      email: formState.email,
      subject: formState.subject,
      content: formState.content,
      timestamp: new Date().toISOString(),
    });

    setSubmitState("success");
    setTimeout(() => {
      setSubmitState("idle");
      onClose?.();
    }, 500);
  };

  if (!formState) return null;

  return (
    <FormWrapper
      title="New Message"
      onClose={onClose}
      onSubmit={handleSubmit}
      submitLabel="Save Draft"
      submitState={submitState}
      successLabel="Saved!"
      width="500px"
    >
      <FormField label="To" htmlFor="email">
        <Input
          id="email"
          type="email"
          value={formState.email}
          onChange={(e) =>
            setFormState({
              ...formState,
              email: e.target.value,
            })
          }
          placeholder="recipient@example.com"
          className="h-10 rounded-md"
          required
        />
      </FormField>

      <FormField label="Subject" htmlFor="subject">
        <Input
          id="subject"
          value={formState.subject}
          onChange={(e) =>
            setFormState({
              ...formState,
              subject: e.target.value,
            })
          }
          placeholder="Message subject"
          className="h-10 rounded-md"
          required
        />
      </FormField>

      <FormField label="Message" htmlFor="content">
        <Textarea
          id="content"
          value={formState.content}
          onChange={(e) =>
            setFormState({
              ...formState,
              content: e.target.value,
            })
          }
          placeholder="Type your message here..."
          className="min-h-[120px] rounded-md resize-none"
          required
        />
      </FormField>
    </FormWrapper>
  );
}
