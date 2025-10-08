import * as Yup from "yup";
import { StoreTypeEnum } from "../../../common/enums/status.enum";

export const TIME_OPTIONS = Array.from({ length: 96 }, (_, i) => {
  const hour = Math.floor(i / 4);
  const minute = (i % 4) * 15;

  const date = new Date();
  date.setHours(hour, minute, 0);

  const label = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return {
    label,
    value: label,
  };
});

export const getFsaBadgeUrl = (rating: string) => {
  switch (rating) {
    case "5":
    case "4":
    case "3":
    case "2":
    case "1":
      return `https://ratings.food.gov.uk/images/badges/fhrs/3/fhrs-badge-${rating}.svg`;
    case "AwaitingInspection":
    case "Exempt":
    case "AwaitingPublication":
      return `https://ratings.food.gov.uk/images/badges/fhrs/1/fhrs-badge-${rating}.svg`;
    default:
      return null;
  }
};

export const CreateStoreSchema = (documentsList: any[]) =>
  Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string().required("Phone is required"),
    street: Yup.string().required("Street is required"),
    city: Yup.string().required("City is required"),
    postcode: Yup.string().required("Postcode is required"),
    country: Yup.string().required("Country is required"),
    storeType: Yup.number().required("Store type is required"),
    companyName: Yup.string().required("Company Name is required"),
    companyNumber: Yup.string().required("Company Number is required"),
    bankDetails: Yup.array().of(
      Yup.object().shape({
        bankName: Yup.string().required("Bank name is required"),
        accountNumber: Yup.string()
          .matches(/^\d+$/, "Account number must be digits only")
          .matches(/^\d{16}$/, "Account Number must be exactly 16 digits")
          .required("Account number is required"),

        sortCode: Yup.string()
          .matches(/^\d{6}$/, "Sort code must be 6 digits")
          .required("Sort code is required"),
      }),
    ),
    documents: Yup.object(
      documentsList.reduce((acc: any, doc: any) => {
        acc[doc.id] = Yup.object({
          fileS3Key: doc.isMandatory
            ? Yup.string().required(`${doc.name} Document is required`)
            : Yup.string().nullable(),

          fileType: Yup.string().when('fileS3Key', {
            is: (v: string) => !!v,
            then: (schema) => schema.required('File type is required'),
            otherwise: (schema) => schema.strip(),
          }),

          expiresAt: Yup.mixed()
            .nullable()
            .optional()
            .when('fileS3Key', {
              is: (v: string) => !!v,
              then: (schema) => schema,
              otherwise: (schema) => schema.strip(),
            }),

          remindBeforeDays: Yup.number()
            .typeError('Must be a number')
            .min(0, 'Cannot be negative')
            .nullable()
            .optional()
            .when('fileS3Key', {
              is: (v: string) => !!v,
              then: (schema) => schema,
              otherwise: (schema) => schema.strip(),
            }),
        }).nullable().optional();

        return acc;
      }, {})
    ).nullable().optional(),
  });


export const defaultDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const createStoreInitialValues = {
  name: "",
  email: "",
  phone: "",
  street: "",
  city: "",
  postcode: "",
  country: "United Kingdom",
  uberStoreId: "",
  deliverooStoreId: "",
  justEatStoreId: "",
  vatNumber: "",
  googlePlaceId: "",
  fsaId: "",
  companyName: "",
  companyNumber: "",
  storeType: StoreTypeEnum.SHOP,
  bankDetails: [{ bankName: "", accountNumber: "", sortCode: "" }],
  storeAvailability: defaultDays.map((day) => ({
    day,
    open: "11:00 am",
    close: "11:00 pm",
    closed: false,
  })),
  lat: "",
  lon: "",
  storeDocuments: {},
};

export const storeStepFieldKeys = {
  basic: [
    "name",
    "email",
    "phone",
    "street",
    "city",
    "postcode",
    "country",
    "companyName",
    "companyNumber",
    "storeType",
  ],
  account: ["bankDetails"],
  availability: ["openingHours"],
  additional: [
    "vatNumber",
    "googlePlaceId",
    "uberStoreId",
    "deliverooStoreId",
    "justEatStoreId",
    "fsaId",
    "lat",
    "lon",
  ],
  storeDocuments: ["documents"],
};