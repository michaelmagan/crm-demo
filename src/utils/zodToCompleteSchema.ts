import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

/**
 * A simple utility to wrap a Zod schema in a parent object with a specified property name.
 * This helps LLMs understand that the schema should be returned as a complete object
 * under the specified property name, rather than as individual fields.
 *
 * @param schema The Zod schema to convert
 * @param assignedPropName The property name to use for the wrapper (e.g., "lead")
 * @returns A JSON schema that wraps the original schema
 */
export function wrapZodSchema<T extends z.ZodTypeAny>(
  schema: T,
  assignedPropName?: string
): Record<string, unknown> {
  const convertedSchema = zodToJsonSchema(schema);

  if (!assignedPropName) {
    return convertedSchema;
  }

  return {
    title: `${assignedPropName} Object Input`,
    description: `This schema expects a complete object to be passed as the '${assignedPropName}' property.`,
    type: "object",
    properties: {
      [assignedPropName]: convertedSchema,
    },
    required: [assignedPropName],
  };
}

// Simple usage example:
// import { LeadSchema } from '@/schemas/lead';
// const wrappedSchema = wrapZodSchema(LeadSchema, "lead");
