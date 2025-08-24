import * as Yup from "yup";
import { UserRole, type UserInfoTypes } from "./users.types";

export const userSchema = Yup.object({
  firstName: Yup.string().required("First name is required"),
  surName: Yup.string().required("Surname is required"),
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
  phone: Yup.string().required("Phone is required"),
  street: Yup.string().required("Street is required"),
  city: Yup.string().required("City is required"),
  postcode: Yup.string().required("Postcode is required"),
  dob: Yup.mixed().required("Date of birth is required"),
  cashInRate: Yup.number()
    .typeError("Cash-in rate must be a number")
    .min(0, "Cannot be negative")
    .required("Cash-in rate is required"),
  shareCode: Yup.string().required("Share Code is required"),
  // niNumber: Yup.string().required("NI number is required"),
  niRate: Yup.number()
    .typeError("NI rate must be a number")
    .min(0, "Cannot be negative")
    .required("NI rate is required"),
  type: Yup.mixed()
    .oneOf(["staff", "owner"], "Select a type")
    .required("Type is required"),

  // Step 2 — optional (no required fields)
  bankDetails: Yup.array().of(
    Yup.object({
      bankName: Yup.string().optional(),
      accountNumber: Yup.string().optional(),
      sortCode: Yup.string().optional(),
    }),
  ),

  // Step 3 — no required fields (UI-managed)
  openingHours: Yup.array().optional(),
  sameAllDays: Yup.boolean().optional(),

  // Step 4
  // fileS3Key: Yup.string().when("type", {
  //   is: "staff",
  //   then: (s) => s.required("Document is required for staff"),
  //   otherwise: (s) => s.notRequired(),
  // }),
  // fileType: Yup.string().when("fileS3Key", {
  //   is: (v: string) => !!v,
  //   then: (s) => s.required("Select file type"),
  //   otherwise: (s) => s.notRequired(),
  // }),
  // expiresAt: Yup.mixed().nullable().optional(),
  // remindBeforeDays: Yup.number()
  //   .typeError("Must be a number")
  //   .min(0, "Cannot be negative")
  //   .optional(),

  documents: Yup.object({
    cnic: Yup.object({
      fileS3Key: Yup.string().required("CNIC document is required"),
      fileType: Yup.string()
        .required("File type is required"),
      expiresAt: Yup.mixed().nullable().optional(),
      remindBeforeDays: Yup.number()
        .typeError("Must be a number")
        .min(0, "Cannot be negative")
        .optional(),
    }),
    license: Yup.object({
      fileS3Key: Yup.string().nullable(), // optional
      fileType: Yup.string().when("fileS3Key", {
        is: (v: string) => !!v,
        then: (s) => s.required("File type is required"),
        otherwise: (s) => s.notRequired(),
      }),
      expiresAt: Yup.mixed().nullable().optional(),
      remindBeforeDays: Yup.number()
        .typeError("Must be a number")
        .min(0, "Cannot be negative")
        .optional(),
    }),
  })

});

export const userEmptyInitialValues: UserInfoTypes = {
  firstName: "",
  surName: "",
  email: "",
  phone: null,
  street: "",
  city: "",
  postcode: "",
  dob: "",
  cashInRate: null,
  niRate: null,
  type: null,
  shareCode: "",
  // niNumber: "",
  bankDetails: [{ bankName: "", accountNumber: "", sortCode: "" }],

  openingHours: [
    { day: "Sunday", open: "09:00", close: "17:00", closed: false },
    { day: "Monday", open: "09:00", close: "17:00", closed: false },
    { day: "Tuesday", open: "09:00", close: "17:00", closed: false },
    { day: "Wednesday", open: "09:00", close: "17:00", closed: false },
    { day: "Thursday", open: "09:00", close: "17:00", closed: false },
    { day: "Friday", open: "09:00", close: "17:00", closed: false },
    { day: "Saturday", open: "09:00", close: "17:00", closed: false },
  ],
  sameAllDays: false,

  fileS3Key: "",
  fileType: "",
  expiresAt: "",
  remindBeforeDays: 7,
  role: UserRole.OWNER,
  dateOfBirth: "",
  documents: undefined
};

export const userStepFieldKeys = {
  basic: [
    "firstName",
    "surName",
    "email",
    "phone",
    "street",
    "city",
    "postcode",
    "dob",
    "cashInRate",
    "niRate",
    "type",
    "shareCode",
    "niNumber",
  ],
  account: ["bankDetails"],
  availability: ["openingHours", "sameAllDays"],
  documents: ["fileS3Key", "fileType", "expiresAt", "remindBeforeDays"],
} as const;
