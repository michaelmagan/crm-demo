"use client";
import { useLeadStore } from "@/store/lead-store";
import { Calendar, Mail, Users } from "lucide-react";
import { useEffect, useState } from "react";
import LeadsTab from "./leads-tab";
import MeetingsTab from "./meetings-tab";
import MessagesTab from "./messages-tab";

export default function CRMDashboard() {
  const [activeTab, setActiveTab] = useState("leads");
  const { fetchLeads } = useLeadStore();

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const renderActiveTab = () => {
    switch (activeTab) {
      case "leads":
        return <LeadsTab />;
      case "meetings":
        return <MeetingsTab />;
      case "mail":
        return <MessagesTab />;
      default:
        return null;
    }
  };

  return (
    <div className="flex w-full h-screen">
      <div className="w-20 bg-gray-800 flex flex-col items-center py-6 space-y-10">
        <div
          className={`flex flex-col items-center cursor-pointer ${
            activeTab === "leads" ? "text-white" : "text-gray-400"
          }`}
          onClick={() => setActiveTab("leads")}
        >
          <Users size={28} />
          <span className="mt-1 text-xs">Leads</span>
        </div>
        <div
          className={`flex flex-col items-center cursor-pointer ${
            activeTab === "meetings" ? "text-white" : "text-gray-400"
          }`}
          onClick={() => setActiveTab("meetings")}
        >
          <Calendar size={28} />
          <span className="mt-1 text-xs">Meetings</span>
        </div>
        <div
          className={`flex flex-col items-center cursor-pointer ${
            activeTab === "mail" ? "text-white" : "text-gray-400"
          }`}
          onClick={() => setActiveTab("mail")}
        >
          <Mail size={28} />
          <span className="mt-1 text-xs">Messages</span>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="w-full mx-auto bg-[#F0F0F0] p-6 min-h-full">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            {activeTab === "leads"
              ? "Leads"
              : activeTab === "meetings"
              ? "Meetings"
              : "Messages"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderActiveTab()}
          </div>
        </div>
      </div>
    </div>
  );
}
