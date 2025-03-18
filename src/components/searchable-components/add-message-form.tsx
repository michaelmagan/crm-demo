import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMessageStore } from "@/store/message-store";
import { useState } from "react";
import { FormWrapper, FormField } from "@/components/ui/form-wrapper";

interface AddMessageFormProps {
  onClose?: () => void;
  initialEmail?: string;
  initialSubject?: string;
  initialContent?: string;
}

export default function AddMessageForm({
  initialEmail = "",
  initialSubject = "",
  initialContent = "",
  onClose,
}: AddMessageFormProps) {
  const [email, setEmail] = useState(initialEmail);
  const [subject, setSubject] = useState(initialSubject);
  const [content, setContent] = useState(initialContent);
  const [submitState, setSubmitState] = useState<
    "idle" | "loading" | "success"
  >("idle");

  const { addNewMessage } = useMessageStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitState("loading");

    await addNewMessage({
      email,
      subject,
      content,
      timestamp: new Date().toISOString(),
    });

    setSubmitState("success");
    setTimeout(() => {
      setSubmitState("idle");
      onClose?.();
    }, 500);
  };

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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="recipient@example.com"
          className="h-10 rounded-md"
          required
        />
      </FormField>

      <FormField label="Subject" htmlFor="subject">
        <Input
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Message subject"
          className="h-10 rounded-md"
          required
        />
      </FormField>

      <FormField label="Message" htmlFor="content">
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type your message here..."
          className="min-h-[120px] rounded-md resize-none"
          required
        />
      </FormField>
    </FormWrapper>
  );
}
