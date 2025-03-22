"use client";

import AddLeadForm from "@/components/searchable-components/add-lead-form";
import EditLeadForm from "@/components/searchable-components/edit-lead-form";
import LeadList from "@/components/searchable-components/lead-list";
import LeadDetails from "@/components/searchable-components/lead-details";
import LeadNotes from "@/components/searchable-components/lead-notes";
import AddMeetingForm from "@/components/searchable-components/add-meeting-form";
import EditMeetingForm from "@/components/searchable-components/edit-meeting-form";
import MeetingsList from "@/components/searchable-components/meetings-list";
import MeetingDetails from "@/components/searchable-components/meeting-details";
import AddMessageForm, {
  MessageSchema,
} from "@/components/searchable-components/add-message-form";
import MessagesList from "@/components/searchable-components/messages-list";
import MessageDetails from "@/components/searchable-components/message-details";
import {
  LeadSchema,
  LeadFiltersSchema,
  MessageFiltersSchema,
} from "@/schemas/lead";
import {
  MeetingSchema,
  MeetingFormSchema,
  MeetingFiltersSchema,
} from "@/schemas/meeting";
import { wrapZodSchema } from "@/utils/zodToCompleteSchema";

/**
 * Tambo components array for use with TamboProvider's components prop
 */
export const tamboComponents = [
  // Lead Management components
  {
    component: AddLeadForm,
    name: "add-lead-form",
    description:
      "A form for adding new leads. Use the users message to fill in lead info.",
    propsDefinition: wrapZodSchema(LeadSchema, "lead"),
  },
  {
    component: EditLeadForm,
    name: "edit-lead-form",
    description:
      "A form for editing existing leads. Use the users message to update lead info.",
    propsDefinition: wrapZodSchema(LeadSchema, "lead"),
  },
  {
    component: LeadList,
    name: "lead-list",
    description: "A list of leads with filtering capabilities.",
    propsDefinition: wrapZodSchema(LeadFiltersSchema, "filters"),
  },
  {
    component: LeadDetails,
    name: "lead-details",
    description: "Detailed view of a lead's information.",
    propsDefinition: wrapZodSchema(LeadSchema, "lead"),
  },
  {
    component: LeadNotes,
    name: "lead-notes",
    description: "Component for adding and viewing notes on a lead.",
    propsDefinition: wrapZodSchema(LeadSchema, "lead"),
  },

  // Meeting Management components
  {
    component: AddMeetingForm,
    name: "add-meeting-form",
    description: "A form for scheduling meetings with leads.",
    propsDefinition: wrapZodSchema(MeetingFormSchema),
  },
  {
    component: EditMeetingForm,
    name: "edit-meeting-form",
    description: "A form for editing meeting details.",
    propsDefinition: wrapZodSchema(MeetingSchema, "meeting"),
  },
  {
    component: MeetingsList,
    name: "meetings-list",
    description: "A list of meetings with filtering capabilities.",
    propsDefinition: wrapZodSchema(MeetingFiltersSchema, "filters"),
  },
  {
    component: MeetingDetails,
    name: "meeting-details",
    description: "Detailed view of a meeting's information.",
    propsDefinition: wrapZodSchema(MeetingSchema, "meeting"),
  },

  // Message Management components
  {
    component: AddMessageForm,
    name: "add-message-form",
    description: "A form for creating messages/emails.",
    propsDefinition: wrapZodSchema(MessageSchema),
  },
  {
    component: MessagesList,
    name: "messages-list",
    description: "A list of messages with filtering capabilities.",
    propsDefinition: wrapZodSchema(MessageFiltersSchema, "filters"),
  },
  {
    component: MessageDetails,
    name: "message-details",
    description: "Detailed view of a message's information.",
    propsDefinition: wrapZodSchema(MessageSchema, "message"),
  },
];
