import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Meeting } from "@/services/leads-service";
import { useLeadStore } from "@/store/lead-store";
import { DateTime } from "luxon";
import EditMeetingForm from "./edit-meeting-form";
import { Modal, useModal } from "@/components/ui/modal";

interface MeetingDetailsProps {
  meeting: Meeting;
  leadId: number;
}

export default function MeetingDetails({
  meeting,
  leadId,
}: MeetingDetailsProps) {
  const { isOpen, open, close } = useModal();
  const { leads } = useLeadStore();

  const lead = leads.find((l) => l.id === leadId);
  const formattedDate = DateTime.fromISO(meeting.date).toFormat("EEE, MMM dd");
  const formattedTime = DateTime.fromISO(meeting.time).toFormat("h:mm a");

  return (
    <>
      <Card className="w-full min-w-[400px] max-w-[800px]">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-semibold">
              {meeting.description}
            </CardTitle>
            {lead && (
              <p className="text-sm text-gray-500 mt-1">
                Meeting with {lead.name}
              </p>
            )}
          </div>
          <Button onClick={open} variant="outline" size="sm">
            Edit
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold">Date</h3>
            <p>{formattedDate}</p>
          </div>
          <div>
            <h3 className="font-semibold">Time</h3>
            <p>{formattedTime}</p>
          </div>
          <div>
            <h3 className="font-semibold">Details</h3>
            <p>{meeting.description}</p>
          </div>
        </CardContent>
      </Card>

      <Modal isOpen={isOpen} onClose={close}>
        <EditMeetingForm meeting={meeting} leadId={leadId} onClose={close} />
      </Modal>
    </>
  );
}
