import * as Yup from "yup";
import { UserRole, type UserInfoTypes } from "./users.types";

export const userSchema = (documentsList: any[]) =>
  Yup.object({
    firstName: Yup.string().required("First name is required"),
    surName: Yup.string().required("Surname is required"),
    email: Yup.string().email("Enter a valid email").required("Email is required"),
    phone: Yup.string().required("Phone is required"),
    street: Yup.string().required("Street is required"),
    city: Yup.string().required("City is required"),
    postcode: Yup.string().required("Postcode is required"),
    dateOfBirth: Yup.mixed().required("Date of birth is required"),
    cashInRate: Yup.number().min(0).required("Cash-in rate is required"),
    niRate: Yup.number().min(0).required("NI rate is required"),
    shareCode: Yup.string().required("Share Code is required"),
    type: Yup.mixed().oneOf(["staff", "owner"]).required("Type is required"),

    bankDetails: Yup.array().of(
      Yup.object().shape({
        bankName: Yup.string().required("Bank name is required"),

        accountNumber: Yup.string()
          .required("Account Number is required")
          .matches(/^\d+$/, "Account number must be digits only")
          .matches(/^\d{16}$/, "Account Number must be exactly 16 digits"),

        sortCode: Yup.string()
          .required("Sort Code is required")
          .matches(/^\d{6}$/, "Sort Code must be exactly 6 digits"),
      })
    ),

    openingHours: Yup.array().optional(),
    sameAllDays: Yup.boolean().optional(),

    documents: Yup.object(
      documentsList.reduce((acc: any, doc: any) => {
        acc[doc.id] = Yup.object({
          fileS3Key: doc.isMandatory
            ? Yup.string().required(`${doc.name} Document is required`)
            : Yup.string().nullable(),
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
        });
        return acc;
      }, {})
    ),
  });


export const userEmptyInitialValues: UserInfoTypes = {
  firstName: "",
  surName: "",
  email: "",
  phone: null,
  street: "",
  city: "",
  postcode: "",
  dateOfBirth: "",
  cashInRate: null,
  niRate: null,
  type: null,
  shareCode: "",
  // niNumber: "",
  bankDetails: [{ bankName: "", accountNumber: "", sortCode: "" }],

  openingHours: [
    {
      day: "Sunday", open: "09:00", close: "17:00", closed: false,
      id: undefined
    },
    {
      day: "Monday", open: "09:00", close: "17:00", closed: false,
      id: undefined
    },
    {
      day: "Tuesday", open: "09:00", close: "17:00", closed: false,
      id: undefined
    },
    {
      day: "Wednesday", open: "09:00", close: "17:00", closed: false,
      id: undefined
    },
    {
      day: "Thursday", open: "09:00", close: "17:00", closed: false,
      id: undefined
    },
    {
      day: "Friday", open: "09:00", close: "17:00", closed: false,
      id: undefined
    },
    {
      day: "Saturday", open: "09:00", close: "17:00", closed: false,
      id: undefined
    },
  ],
  sameAllDays: false,

  fileS3Key: "",
  fileType: "",
  expiresAt: "",
  remindBeforeDays: 7,
  role: UserRole.OWNER,
  documents: {},
  availabilityHours: []
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
    "dateOfBirth",
    "cashInRate",
    "niRate",
    "type",
    "shareCode",
    "niNumber",
  ],
  account: ["bankDetails"],
  availability: ["openingHours", "sameAllDays"],
  documents: ["documents"],
} as const;
