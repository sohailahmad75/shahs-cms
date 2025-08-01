import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";

export type UserRole = 1 | 2 | 3 | 4;

export const USER_ROLES: { value: UserRole; label: string }[] = [
  { value: 1, label: "Super Admin" },
  { value: 2, label: "Admin" },
  { value: 3, label: "Store Manager" },
  { value: 4, label: "Staff" },
];

export const ROLES = {
  SUPER_ADMIN: 1,
  ADMIN: 2,
  STORE_MANAGER: 3,
  STAFF: 4,
} as const;

export interface SidebarSubMenuItem {
  id: string;
  name: string;
  link: string;
  roles: UserRole[];
}

interface ErrorResponse {
  message?: string;
}

export const getErrorMessage = (
  error: FetchBaseQueryError | SerializedError | string | undefined,
): string => {
  if (!error) return "Something went wrong";

  // If it's already a plain string
  if (typeof error === "string") return error;

  // If it's a FetchBaseQueryError with status
  if ("status" in error) {
    const errData = error.data as ErrorResponse;
    return errData?.message || "An error occurred";
  }

  // If it's a SerializedError (runtime thrown error, e.g. network)
  if ("message" in error) {
    return error.message || "An unexpected error occurred";
  }

  return "Something went wrong";
};
// url,key,method, file
export async function uploadToS3(
  url: string,
  method: string,
  file: File,
): Promise<void> {
  const formData = new FormData();

  // Append the actual file last
  formData.append("file", file);

  const res = await fetch(url, {
    method: method,
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to upload to S3");
  }
}
