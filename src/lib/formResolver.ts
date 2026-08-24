import type { FieldErrors, FieldValues, Resolver } from "react-hook-form";
import type { ZodType } from "zod";

/**
 * Minimal RHF <-> Zod bridge. @hookform/resolvers isn't in the dependency
 * ladder (Tech Stack §2) and this is a handful of lines — no new package
 * for what safeParse already does.
 */
export function zodResolver<T extends FieldValues>(schema: ZodType<T>): Resolver<T> {
  return async (values) => {
    const result = schema.safeParse(values);
    if (result.success) {
      return { values: result.data, errors: {} };
    }

    const errors = {} as FieldErrors<T>;
    for (const issue of result.error.issues) {
      const path = issue.path.join(".") as keyof T;
      if (!errors[path]) {
        (errors as Record<string, unknown>)[path as string] = {
          type: issue.code,
          message: issue.message,
        };
      }
    }
    return { values: {}, errors };
  };
}
