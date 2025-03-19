"use client";
import CRMDashboard from "@/components/dashboard/crm-dashboard";
import { MessageThreadCollapsible } from "@/components/ui/message-thread-collapsible";

export default function Home() {
  return (
    <main>
      <CRMDashboard />
      <MessageThreadCollapsible />
    </main>
  );
}
