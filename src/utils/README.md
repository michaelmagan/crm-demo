# Zod Schema Wrapper Utility

## wrapZodSchema

This simple utility helps solve a common issue when using Zod schemas with LLMs (Large Language Models). It wraps a Zod schema in a parent JSON schema that clearly indicates the schema should be returned as a complete object under a specific property name.

### Problem It Solves

When sending a JSON schema from `zodToJsonSchema` to an LLM, the model typically sees individual properties and might return them separately instead of as a complete object. By wrapping the schema, the LLM will understand that it should return a nested object under the specified property name.

### Usage

```typescript
import { z } from "zod";
import { wrapZodSchema } from "@/utils/zodToCompleteSchema";

// Define your Zod schema
const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
});

// Wrap the schema to indicate it should be returned as a 'user' property
const wrappedSchema = wrapZodSchema(UserSchema, "user");

// Send to LLM
sendToLLM({
  schema: wrappedSchema,
  instructions: "Please create a valid user",
});
```

### Example Output

The wrapped schema will look like this:

```json
{
  "title": "user Object Input",
  "description": "This schema expects a complete object to be passed as the 'user' property.",
  "type": "object",
  "properties": {
    "user": {
      "type": "object",
      "properties": {
        "id": { "type": "number" },
        "name": { "type": "string" },
        "email": { "type": "string", "format": "email" }
      },
      "required": ["id", "name", "email"],
      "additionalProperties": false
    }
  },
  "required": ["user"]
}
```

### Expected LLM Response

When an LLM receives this schema, it should return a response with the structure:

```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

Instead of:

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com"
}
```

### Complete Example With Lead Schema

```typescript
import { LeadSchema } from "@/schemas/lead";
import { wrapZodSchema } from "@/utils/zodToCompleteSchema";

// Wrap the Lead schema to indicate it should be passed as the 'lead' prop
const wrappedLeadSchema = wrapZodSchema(LeadSchema, "lead");

// Use in LLM prompt
const prompt = `
  Please generate data according to this schema:
  ${JSON.stringify(wrappedLeadSchema, null, 2)}
  
  The lead should be for a potential customer in the healthcare industry.
`;

// Send to LLM and use the response
const response = await sendToLLM(prompt);
const lead = response.lead; // Extract the 'lead' property

// Use in your component
<AddLeadForm lead={lead} />;
```

### How It Works

The utility:

1. Converts your Zod schema to a JSON schema
2. Wraps it in a parent object with your specified property name
3. Adds appropriate title and description to guide the LLM
4. Marks the property as required
