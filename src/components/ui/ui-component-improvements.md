# UI Component Improvements

## Component Renaming Guide

The following components should be renamed to remove "Chat" references and use "Message/Thread" terminology:

| Current Name    | New Name           | Current File              | New File                     |
| --------------- | ------------------ | ------------------------- | ---------------------------- |
| ChatHistory     | ThreadHistory      | `ui/chat-history.tsx`     | `ui/thread-history.tsx`      |
| ChatInput       | MessageInput       | `ui/chat-input.tsx`       | `ui/message-input.tsx`       |
| ChatThread      | ThreadContent      | `ui/chat-thread.tsx`      | `ui/thread-content.tsx`      |
| ChatSuggestions | MessageSuggestions | `ui/chat-suggestions.tsx` | `ui/message-suggestions.tsx` |

Also update all imports and references to these components throughout the codebase.

## Message Thread Collapsible

`ui/message-thread-collapsible.tsx`

- **⌘K** (Mac) or **Ctrl+K** (Windows/Linux) to toggle the message thread
- Added an "X" button to close the thread when expanded
- Integrated the ThreadHistory component in the header when expanded
- Shows "Use AI" text when collapsed, "AI Messages" when expanded
- Added spacing between text and keyboard shortcut for better readability
- The component detects the user's platform and shows the appropriate shortcut in the UI
- Keyboard shortcut works globally across the application
- Streamlined UI with cleaner button layout
- Collapsed state is more compact, taking less screen space
- Responsive design with adaptive width based on screen size

## Message Input

`ui/message-input.tsx` (renamed from `chat-input.tsx`)

- **⌘+Enter** (Mac) or **Ctrl+Enter** (Windows/Linux) to send messages
- Platform detection to show the appropriate shortcut based on user's operating system
- Styled keyboard shortcut indicators with `<kbd>` elements for a professional appearance
- Centered helper text beneath the input for better visual balance
- Input field automatically clears after successful message submission
- Error messages are displayed beneath the keyboard shortcut text

## Thread History

`ui/thread-history.tsx` (renamed from `chat-history.tsx`)

- Displays a "+" button with a dropdown menu to access thread history
- Dropdown menu opens to the right side for better space utilization
- Shows a list of previous conversation threads
- Provides the ability to start a new thread with one click
- Supports **Alt+Shift+N** (Windows/Linux) or **Option+Shift+N** (Mac) keyboard shortcut for creating new threads
- Integrated with the Message Thread Collapsible component
- Uses the `useTamboThreads` hook to fetch and display thread data
- Adapts to user's platform to show appropriate keyboard shortcuts

## Message Suggestions

`ui/message-suggestions.tsx` (renamed from `chat-suggestions.tsx`)

- Displays AI-generated suggestions below the thread content
- Shows a lightbulb icon and "Suggestions" header
- Each suggestion shows a title and preview of the content
- Clicking a suggestion adds it to the message input field
- Provides a checkmark button to immediately submit the suggestion
- Supports keyboard shortcuts to quickly select suggestions:
  - **⌘+⌥+[1-9]** (Mac) or **Ctrl+Alt+[1-9]** (Windows/Linux) to select suggestions by number
  - Shortcuts are visibly displayed next to each suggestion
  - Automatically detects user's platform to show appropriate shortcut notation
- Highlights the currently selected suggestion
- Only appears when suggestions are available
- Leverages the `useTamboSuggestions` hook to retrieve suggestions
