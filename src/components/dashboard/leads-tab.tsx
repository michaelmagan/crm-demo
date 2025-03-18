import { useLeadStore } from "@/store/lead-store";
import React, { useEffect } from "react";
import LeadDetails from "../searchable-components/lead-details";
import LeadList from "../searchable-components/lead-list";
import AddLeadForm from "../searchable-components/add-lead-form";
import { Modal, useModal } from "@/components/ui/modal";

export default function LeadsTab() {
  const { leads } = useLeadStore();
  const [selectedLeadId, setSelectedLeadId] = React.useState<number | null>(
    null
  );
  const { isOpen, close } = useModal();

  useEffect(() => {
    if (leads && leads.length > 0) {
      setSelectedLeadId(leads[0].id);
    }
  }, [leads]);

  return (
    <>
      <div className="flex gap-4 w-full">
        <LeadList leads={leads ?? []} onSelectLead={setSelectedLeadId} />
        {selectedLeadId && <LeadDetails leadId={selectedLeadId} />}
      </div>

      <Modal isOpen={isOpen} onClose={close}>
        <AddLeadForm onClose={close} />
      </Modal>
    </>
  );
}
