# CRM Dashboard Application

A simple CRM application built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Leads Management**: Track and manage potential customers
- **Meetings Scheduler**: Schedule and track meetings with leads
- **Messaging System**: Send and track messages with leads
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/yourusername/crm-demo.git
   cd crm-demo
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/src/app` - Main application pages
- `/src/components` - Reusable UI components
- `/src/components/dashboard` - CRM dashboard components
- `/src/components/searchable-components` - Components for each feature of the CRM
- `/src/schemas` - Type definitions and validation schemas
- `/src/services` - Service functions for data fetching
- `/src/store` - State management using Zustand

## Built With

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Zustand](https://github.com/pmndrs/zustand) - State management

## License

This project is licensed under the MIT License - see the LICENSE file for details.
