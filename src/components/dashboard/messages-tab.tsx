import { Message } from "@/services/leads-service";
import { useMessageStore } from "@/store/message-store";
import { useEffect, useState } from "react";
import MessageDetails from "../searchable-components/message-details";
import MessagesList from "../searchable-components/messages-list";
import AddMessageForm from "../searchable-components/add-message-form";
import { Modal, useModal } from "@/components/ui/modal";

export default function MessagesTab() {
  const { messages, fetchMessages } = useMessageStore();
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const { isOpen, close } = useModal();

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return (
    <>
      <div className="flex gap-4 w-full">
        <MessagesList
          messages={messages}
          onSelectMessage={setSelectedMessage}
        />
        {selectedMessage && <MessageDetails message={selectedMessage} />}
      </div>

      <Modal isOpen={isOpen} onClose={close}>
        <AddMessageForm onClose={close} />
      </Modal>
    </>
  );
}
