import { z } from "zod";

/**
 * Schema for meeting data as used in the database/state
 */
export const MeetingSchema = z.object({
  id: z.number().optional(),
  leadId: z.number(),
  date: z.string(),
  time: z.string(),
  description: z.string(),
});

/**
 * Schema for meeting form props to match the AddMeetingForm component
 */
export const MeetingFormSchema = z.object({
  initialDateTimeISO: z
    .string()
    .optional()
    .describe(
      "ISO formatted date-time string for pre-filling the meeting date and time in UTC"
    ),
  initialDescription: z
    .string()
    .optional()
    .describe("Initial description for the meeting"),
  initialLeadId: z
    .string()
    .optional()
    .describe("ID of the lead to pre-select for the meeting"),
});

/**
 * Schema for meeting filters that can be applied to the meetings list
 */
export const MeetingFiltersSchema = z.object({
  leadId: z.number().optional().describe("Filter meetings for a specific lead"),
  dateFrom: z
    .string()
    .optional()
    .describe("Filter meetings from this date (ISO format)"),
  dateTo: z
    .string()
    .optional()
    .describe("Filter meetings until this date (ISO format)"),
  search: z
    .string()
    .optional()
    .describe(
      "Search meetings by description (case-insensitive partial match)"
    ),
});

export type Meeting = z.infer<typeof MeetingSchema>;
export type MeetingFormProps = z.infer<typeof MeetingFormSchema>;
export type MeetingFilters = z.infer<typeof MeetingFiltersSchema>;
