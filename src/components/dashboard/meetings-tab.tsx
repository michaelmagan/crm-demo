import { Meeting } from "@/services/leads-service";
import { useLeadStore } from "@/store/lead-store";
import { useEffect, useState } from "react";
import MeetingDetails from "../searchable-components/meeting-details";
import MeetingsList from "../searchable-components/meetings-list";
import AddMeetingForm from "../searchable-components/add-meeting-form";
import { Modal, useModal } from "@/components/ui/modal";

export default function MeetingsTab() {
  const { leads } = useLeadStore();
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const { isOpen, close } = useModal();

  const allMeetings = leads.flatMap((lead) => lead.meetings);

  useEffect(() => {
    if (allMeetings.length > 0 && !selectedMeeting) {
      setSelectedMeeting(allMeetings[0]);
    }
  }, [allMeetings, selectedMeeting]);

  return (
    <>
      <div className="flex gap-4 w-full">
        <MeetingsList
          meetings={allMeetings}
          onSelectMeeting={setSelectedMeeting}
        />
        {selectedMeeting && (
          <MeetingDetails
            meeting={selectedMeeting}
            leadId={selectedMeeting.leadId}
          />
        )}
      </div>

      <Modal isOpen={isOpen} onClose={close}>
        <AddMeetingForm onClose={close} />
      </Modal>
    </>
  );
}
