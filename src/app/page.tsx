"use client";
import CRMDashboard from "@/components/dashboard/crm-dashboard";
import { MessageThreadCollapsible } from "@/components/ui/message-thread-collapsible";
import { useEffect, useState } from "react";

export default function Home() {
  const [threadId, setThreadId] = useState<string>("");

  // Generate thread ID
  useEffect(() => {
    if (!threadId) {
      setThreadId(`crm-thread-${Date.now()}`);
    }
  }, [threadId]);

  return (
    <main>
      <CRMDashboard />
      <MessageThreadCollapsible contextKey={threadId} />
    </main>
  );
}
