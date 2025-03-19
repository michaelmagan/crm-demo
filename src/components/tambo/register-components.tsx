import { useEffect } from "react";
import { useTambo, TamboTool } from "@tambo-ai/react";

// Import components (adjust import paths as needed)
import AddLeadForm from "../components/leads/add-lead-form";
import EditLeadForm from "../components/leads/edit-lead-form";
import LeadList from "../components/leads/lead-list";
import LeadDetails from "../components/leads/lead-details";
import LeadNotes from "../components/leads/lead-notes";

// Import skeleton components (create these as needed)
import {
  FormSkeleton,
  LeadListSkeleton,
  LeadDetailsSkeleton,
  NotesSkeleton,
} from "../components/skeletons";

// Import services (implement these as needed)
import {
  getLeads,
  getLead,
  createLead,
  updateLead,
  getNotes,
  addNote,
} from "../services/lead-services";

// Schema definitions for component props
const LeadSchema = {
  shape: {
    id: "string",
    name: "string",
    email: "string",
    phone: "string",
    company: "string",
    status: "string",
    source: "string",
    createdAt: "string",
  },
};

const LeadFiltersSchema = {
  shape: {
    status: "string?",
    source: "string?",
    searchTerm: "string?",
    sortBy: "string?",
  },
};

const NoteSchema = {
  shape: {
    id: "string",
    leadId: "string",
    content: "string",
    createdAt: "string",
  },
};

// Custom tools for lead operations
export function useTamboTools() {
  // Tool for fetching leads
  const getLeadsTool: TamboTool = {
    name: "getLeads",
    description: "Get a list of all leads with optional filtering",
    parameters: [
      {
        name: "filters",
        type: "object",
        description: "Optional filters to apply",
        required: false,
      },
    ],
    execute: async (params) => {
      return await getLeads(params?.filters);
    },
  };

  // Tool for fetching a single lead
  const getLeadTool: TamboTool = {
    name: "getLead",
    description: "Get details of a specific lead by ID",
    parameters: [
      {
        name: "id",
        type: "string",
        description: "The ID of the lead to retrieve",
        required: true,
      },
    ],
    execute: async (params) => {
      return await getLead(params.id);
    },
  };

  // Tool for creating a new lead
  const createLeadTool: TamboTool = {
    name: "createLead",
    description: "Create a new lead with the provided information",
    parameters: [
      {
        name: "lead",
        type: "object",
        description: "The lead information to create",
        required: true,
      },
    ],
    execute: async (params) => {
      return await createLead(params.lead);
    },
  };

  // Tool for updating an existing lead
  const updateLeadTool: TamboTool = {
    name: "updateLead",
    description: "Update an existing lead's information",
    parameters: [
      {
        name: "id",
        type: "string",
        description: "The ID of the lead to update",
        required: true,
      },
      {
        name: "lead",
        type: "object",
        description: "The updated lead information",
        required: true,
      },
    ],
    execute: async (params) => {
      return await updateLead(params.id, params.lead);
    },
  };

  // Tool for fetching notes for a lead
  const getNotesTool: TamboTool = {
    name: "getNotes",
    description: "Get all notes for a specific lead",
    parameters: [
      {
        name: "leadId",
        type: "string",
        description: "The ID of the lead to get notes for",
        required: true,
      },
    ],
    execute: async (params) => {
      return await getNotes(params.leadId);
    },
  };

  // Tool for adding a note to a lead
  const addNoteTool: TamboTool = {
    name: "addNote",
    description: "Add a new note to a specific lead",
    parameters: [
      {
        name: "leadId",
        type: "string",
        description: "The ID of the lead to add a note to",
        required: true,
      },
      {
        name: "content",
        type: "string",
        description: "The content of the note",
        required: true,
      },
    ],
    execute: async (params) => {
      return await addNote(params.leadId, params.content);
    },
  };

  return {
    getLeadsTool,
    getLeadTool,
    createLeadTool,
    updateLeadTool,
    getNotesTool,
    addNoteTool,
  };
}

// Component registration function
export function useRegisterTamboComponents() {
  const { registerComponent } = useTambo();
  const tools = useTamboTools();

  useEffect(() => {
    // Register add-lead-form
    registerComponent({
      component: AddLeadForm,
      name: "add-lead-form",
      description: "Form for adding new leads",
      propsDefinition: {
        initialValues: JSON.stringify(LeadSchema.shape),
      },
      loadingComponent: FormSkeleton,
      associatedTools: [tools.createLeadTool],
    });

    // Register edit-lead-form
    registerComponent({
      component: EditLeadForm,
      name: "edit-lead-form",
      description: "Form for editing existing leads",
      propsDefinition: {
        leadId: "string",
        initialValues: JSON.stringify(LeadSchema.shape),
      },
      loadingComponent: FormSkeleton,
      associatedTools: [tools.getLeadTool, tools.updateLeadTool],
    });

    // Register lead-list
    registerComponent({
      component: LeadList,
      name: "lead-list",
      description: "List of leads with filtering capabilities",
      propsDefinition: {
        filters: JSON.stringify(LeadFiltersSchema.shape),
      },
      loadingComponent: LeadListSkeleton,
      associatedTools: [tools.getLeadsTool],
    });

    // Register lead-details
    registerComponent({
      component: LeadDetails,
      name: "lead-details",
      description: "Detailed view of a lead's information",
      propsDefinition: {
        leadId: "string",
      },
      loadingComponent: LeadDetailsSkeleton,
      associatedTools: [tools.getLeadTool],
    });

    // Register lead-notes
    registerComponent({
      component: LeadNotes,
      name: "lead-notes",
      description: "Component for adding/viewing notes on a lead",
      propsDefinition: {
        leadId: "string",
      },
      loadingComponent: NotesSkeleton,
      associatedTools: [tools.getNotesTool, tools.addNoteTool],
    });
  }, [registerComponent, tools]);
}

// Usage example (place in a top-level component)
export function TamboComponentRegistration() {
  useRegisterTamboComponents();
  return null; // This component doesn't render anything
}
