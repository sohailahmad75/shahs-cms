import { Formik, Form } from "formik";
import * as Yup from "yup";
import Modal from "../../../components/Modal";
import InputField from "../../../components/InputField";
import Button from "../../../components/Button";
import SelectField from "../../../components/SelectField";
import CheckboxField from "../../../components/CheckboxField";
import type { UpdateDocumentDto } from "../documentTypes.types";
import { useTheme } from "../../../context/themeContext";


type DocumentTypeRole = "shop" | "owner" | "staff";
type DocumentTypeStaffKind =
  | "full_time"
  | "student"
  | "sponsored"
  | "psw"
  | "asylum"
  | "other";

const ROLE_OPTIONS = [
  { label: "Shop", value: "shop" },
  { label: "Owner", value: "owner" },
  { label: "Staff", value: "staff" },
] as const;

const STAFF_KIND_OPTIONS = [
  { label: "Full-time", value: "full_time" },
  { label: "Student", value: "student" },
  { label: "Sponsored", value: "sponsored" },
  { label: "PSW", value: "psw" },
  { label: "Asylum", value: "asylum" },
  { label: "Other", value: "other" },
] as const;


//   documentName: Yup.string().required("Document Name is required"),
//   documentDescription: Yup.string().nullable(),
//   isMandatory: Yup.boolean().default(false),
//   role: Yup.mixed<DocumentTypeRole>()
//     .oneOf(["shop", "owner", "staff"], "Please select a role")
//     .required("Role is required"),
//   staffKind: Yup.mixed<DocumentTypeStaffKind>()
//     .oneOf(
//       ["full_time", "student", "sponsored", "psw", "asylum", "other"] as const,
//       "Please select a staff type",
//     )
//     .when("role", (role: DocumentTypeRole, schema) =>
//       role === "staff"
//         ? schema.required("Staff Type is required")
//         : schema.optional().nullable(),
//     ),
// });
const DocumentSchema = Yup.object().shape({
  documentName: Yup.string().required("Document Name is required"),
  documentDescription: Yup.string().required("Document Description is required"),
  isMandatory: Yup.boolean().default(false),
  role: Yup.mixed<DocumentTypeRole>()
    .oneOf(["shop", "owner", "staff"], "Please select a role")
    .required("Role is required"),
  staffKind: Yup.mixed<DocumentTypeStaffKind>()
    .oneOf(
      ["full_time", "student", "sponsored", "psw", "asylum", "other"] as const,
      "Please select a staff type",
    )
    .when("role", {
      is: "staff",
      then: (schema) => schema.required("Staff Type is required"),
      otherwise: (schema) => schema.optional().nullable(),
    }),
});
const emptyInitialValues = {
  documentName: "",
  documentDescription: "",
  isMandatory: false,
  role: "" as "" | DocumentTypeRole,
  staffKind: "" as "" | DocumentTypeStaffKind,
};

type FormValues = typeof emptyInitialValues;

const DocumentTypeModal = ({
  isOpen,
  onClose,
  onSubmit,
  editingDocument,
  isSubmitting,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void; 
  editingDocument: UpdateDocumentDto | null | undefined;
  isSubmitting: boolean;
}) => {
  const { isDarkMode } = useTheme();
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingDocument ? "Edit Document Type" : "Add Document Type"}
      width="max-w-2xl"
    >

      <Formik<FormValues>
        initialValues={{
          ...emptyInitialValues,
          ...(editingDocument
            ? {
              documentName: editingDocument.name ?? "",   
              documentDescription: editingDocument.description ?? "", 
              isMandatory: editingDocument.isMandatory ?? false,
              role: (editingDocument.role as DocumentTypeRole) ?? "",
              staffKind:
                editingDocument.role === "staff"
                  ? (editingDocument.staffKind as DocumentTypeStaffKind) ?? ""
                  : "",
            }
            : {}),
        }}
        validationSchema={DocumentSchema}
        enableReinitialize
        onSubmit={(vals) => {
          const payload = {
            documentName: vals.documentName,
            documentDescription: vals.documentDescription,
            isMandatory: vals.isMandatory,
            role: vals.role || null,
            staffKind: vals.role === "staff" ? vals.staffKind : null,
          };
          onSubmit(payload);
        }}
      >

        {({ values, handleChange, setFieldValue, touched, errors }) => (
          <Form className="space-y-8">
            <div className="col-span-2 flex items-center gap-6 mb-6">
              <div className="flex-grow h-px bg-gray-200" />
              <span className={` ${isDarkMode ? "text-slate-600" : "text-orange-100"} text-orange-100 text-md font-medium whitespace-nowrap`}>
                Document Type Details
              </span>
              <div className="flex-grow h-px bg-gray-200" />
            </div>

            <div className="grid grid-cols-1 gap-4">
           
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Name <span className="text-red-500">*</span>
                </label>
                <InputField
                  name="documentName"
                  placeholder="Name"
                  value={values.documentName}
                  onChange={handleChange}
                  error={touched.documentName ? (errors.documentName as string) : ""}
                />
              </div>

         
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Description
                </label>
                <InputField
                  type="textarea"
                  name="documentDescription"
                  placeholder="Enter Description"
                  value={values.documentDescription}
                  onChange={handleChange}
                  error={touched.documentDescription ? (errors.documentDescription as string) : ""}
                />
              </div>

          
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Applies To <span className="text-red-500">*</span>
                </label>
                <SelectField
                  name="role"
                  value={values.role || ""}
                  onChange={(e) => {
                    handleChange(e);
                    if ((e.target as any).value !== "staff") {
                      setFieldValue("staffKind", "");
                    }
                  }}
                  options={
                    ROLE_OPTIONS as unknown as {
                      label: string;
                      value: string | number;
                    }[]
                  }
                  placeholder="Select role"
                  error={touched.role ? (errors.role as string) : ""}
                />
              </div>

             
              {values.role === "staff" && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Staff Type <span className="text-red-500">*</span>
                  </label>
                  <SelectField
                    name="staffKind"
                    value={values.staffKind || ""}
                    onChange={handleChange}
                    options={
                      STAFF_KIND_OPTIONS as unknown as {
                        label: string;
                        value: string | number;
                      }[]
                    }
                    placeholder="Select staff type"
                    error={
                      touched.staffKind ? (errors.staffKind as string) : ""
                    }
                  />
                </div>
              )}

             
              <div className="pt-2">
                <CheckboxField
                  name="isMandatory"
                  label="This document is mandatory"
                  checked={values.isMandatory}
                  onChange={(e) =>
                    setFieldValue("isMandatory", e.target.checked)
                  }
                  className=""
                  size="5"
                  labelClassName="select-none"
                />
                {touched.isMandatory && errors.isMandatory ? (
                  <p className="text-primary-100 text-sm mt-1">
                    {errors.isMandatory as string}
                  </p>
                ) : null}
              </div>
            </div>

            <Button type="submit" className="w-full" loading={isSubmitting}>
              {editingDocument ? "Update Document" : "Create Document"}
            </Button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default DocumentTypeModal;
