# Tambo Integration Guide

This guide explains how to integrate your React components with Tambo AI, focusing on the initial setup, component registration, and custom tools creation.

## 1. Setup TamboProvider

The first step is to wrap your application with the `TamboProvider` component. This provider enables your application to communicate with Tambo AI services.

```jsx
// In your layout file (e.g., app/layout.tsx or _app.tsx)
import { TamboProvider } from "@tambo-ai/react";

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body>
        <TamboProvider apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY ?? ""}>
          {children}
        </TamboProvider>
      </body>
    </html>
  );
}
```

Make sure to set your Tambo API key in your environment variables (`.env.local` file):

```
NEXT_PUBLIC_TAMBO_API_KEY=your_api_key_here
```

## 2. Create Component Registration Function

Create a function that registers your components with Tambo. This function should use the `useTambo` hook to access the `registerComponent` method.

```jsx
import { useEffect } from "react";
import { useTambo } from "@tambo-ai/react";
import { LeadSchema, LeadFiltersSchema } from "./schemas/lead";

// Import your components
import AddLeadForm from "./components/searchable-components/add-lead-form";
import LeadListContainer from "./components/searchable-components/lead-list-container";
// Import your skeleton components
import { FormSkeleton, LeadListSkeleton } from "./components/skeletons";

export function useRegisterTamboComponents() {
  const { registerComponent } = useTambo();

  useEffect(() => {
    // Register all your components
    registerComponent({
      component: AddLeadForm,
      name: "add-lead-form",
      description: "A form for adding new leads",
      propsDefinition: { lead: JSON.stringify(LeadSchema.shape) },
      loadingComponent: FormSkeleton,
    });

    registerComponent({
      component: LeadListContainer,
      name: "lead-list",
      description:
        "A list of leads with their statuses. Use this when the user wants to view all leads or filter them.",
      propsDefinition: {
        filters: JSON.stringify(LeadFiltersSchema.shape),
      },
      loadingComponent: LeadListSkeleton,
    });

    // Continue registering all your components...
  }, [registerComponent]);
}
```

## 3. Create Custom Tools

Custom tools allow your components to access data and perform operations. Define these tools and associate them with your components.

```jsx
import { TamboTool } from "@tambo-ai/react";
import { getLeads, getMessages } from "./services/data-services";

// Create tools following this pattern
export function useTamboTools() {
  // Tool for fetching leads data
  const getLeadsTool: TamboTool = {
    name: "getLeads",
    description:
      "Get a list of all the leads, which includes meetings, notes, and messages",
    parameters: [],
    execute: async () => {
      return await getLeads();
    },
  };

  // Tool for fetching messages data
  const getMessagesTool: TamboTool = {
    name: "getMessages",
    description: "Get a list of all the messages",
    parameters: [],
    execute: async () => {
      return await getMessages();
    },
  };

  return {
    getLeadsTool,
    getMessagesTool,
  };
}

// Modified registration function to include tools
export function useRegisterTamboComponents() {
  const { registerComponent } = useTambo();
  const tools = useTamboTools();

  useEffect(() => {
    // Register components with associated tools
    registerComponent({
      component: LeadListContainer,
      name: "lead-list",
      description: "A list of leads with their statuses",
      propsDefinition: {
        filters: JSON.stringify(LeadFiltersSchema.shape),
      },
      associatedTools: [tools.getLeadsTool],
      loadingComponent: LeadListSkeleton,
    });

    registerComponent({
      component: MessagesListContainer,
      name: "messages-list",
      description: "A list of messages with their details",
      propsDefinition: {
        filters: JSON.stringify(MessageFiltersSchema.shape),
      },
      associatedTools: [tools.getMessagesTool],
      loadingComponent: MessagesListSkeleton,
    });

    // Continue registering all your components with their associated tools...
  }, [registerComponent, tools]);
}
```

Once you've implemented these three steps, your application will be ready to start using Tambo AI with your custom components. The next steps would involve implementing API call tracking, error handling, and finalizing the integration in your application.
