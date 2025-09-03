// import * as Yup from "yup";
// import { StoreTypeEnum } from "../../../common/enums/status.enum";

// export const TIME_OPTIONS = Array.from({ length: 96 }, (_, i) => {
//   const hour = Math.floor(i / 4);
//   const minute = (i % 4) * 15;

//   const date = new Date();
//   date.setHours(hour, minute, 0);

//   const label = date.toLocaleTimeString([], {
//     hour: "numeric",
//     minute: "2-digit",
//     hour12: true,
//   });

//   return {
//     label,
//     value: label,
//   };
// });

// export const getFsaBadgeUrl = (rating: string) => {
//   switch (rating) {
//     case "5":
//     case "4":
//     case "3":
//     case "2":
//     case "1":
//       return `https://ratings.food.gov.uk/images/badges/fhrs/3/fhrs-badge-${rating}.svg`;
//     case "AwaitingInspection":
//     case "Exempt":
//     case "AwaitingPublication":
//       return `https://ratings.food.gov.uk/images/badges/fhrs/1/fhrs-badge-${rating}.svg`;
//     default:
//       return null;
//   }
// };

// export const CreateStoreSchema = Yup.object().shape({
//   name: Yup.string().required("Name is required"),
//   email: Yup.string().email("Invalid email").required("Email is required"),
//   phone: Yup.string().required("Phone is required"),
//   street: Yup.string().required("Street is required"),
//   city: Yup.string().required("City is required"),
//   postcode: Yup.string().required("Postcode is required"),
//   country: Yup.string().required("Country is required"),
//   storeType: Yup.number().required("Store type is required"),
//   companyName: Yup.string().required("Company Name is required"),
//   companyNumber: Yup.string().required("Company Number is required"),
//   bankDetails: Yup.array().of(
//     Yup.object().shape({
//       bankName: Yup.string().required("Bank name is required"),
//       accountNumber: Yup.string()
//         .matches(/^\d+$/, "Account number must be digits only")
//         .required("Account number is required"),
//       sortCode: Yup.string()
//         .matches(/^\d{6}$/, "Sort code must be 6 digits")
//         .required("Sort code is required"),
//     }),
//   ),
// });

// export const createStoreInitialValues = {
//   name: "",
//   email: "",
//   phone: "",
//   street: "",
//   city: "",
//   postcode: "",
//   country: "United Kingdom",
//   uberStoreId: "",
//   deliverooStoreId: "",
//   justEatStoreId: "",
//   vatNumber: "",
//   googlePlaceId: "",
//   fsaId: "",
//   companyName: "",
//   companyNumber: "",
//   storeType: StoreTypeEnum.SHOP,
//   bankDetails: [{ bankName: "", accountNumber: "", sortCode: "" }],
//   lat: "",
//   lon: "",
// };

// export const defaultDays = [
//   "Sunday",
//   "Monday",
//   "Tuesday",
//   "Wednesday",
//   "Thursday",
//   "Friday",
//   "Saturday",
// ];



// store-helper.ts
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

export const CreateStoreSchema = Yup.object().shape({
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
        .required("Account number is required"),
      sortCode: Yup.string()
        .matches(/^\d{6}$/, "Sort code must be 6 digits")
        .required("Sort code is required"),
    }),
  ),
});

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
  lat: "",
  lon: "",
  documents: {},
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
  documents: ["documents"],
};

export const defaultDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];