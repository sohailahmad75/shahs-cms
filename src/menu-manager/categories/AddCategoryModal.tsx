// import React from "react";
// import Modal from "../../components/Modal";
// import InputField from "../../components/InputField";
// import Button from "../../components/Button";
// import { useCreateCategoryMutation } from "../../services/menuApi";
// import { toast } from "react-toastify";
// import { Formik, Form } from "formik";
// import * as Yup from "yup";

// type Props = {
//   isOpen: boolean;
//   onClose: () => void;
//   menuId: string;
// };

// // Validation schema
// const CategorySchema = Yup.object().shape({
//   name: Yup.string().required("Category name is required"),
//   image: Yup.string().url("Enter a valid image URL").nullable(),
// });

// const AddCategoryModal: React.FC<Props> = ({ isOpen, onClose, menuId }) => {
//   const [createCategory, { isLoading }] = useCreateCategoryMutation();

//   const handleSubmit = async (
//     values: { name: string; image: string },
//     { resetForm }: any,
//   ) => {
//     try {
//       await createCategory({ menuId, payload: values }).unwrap();
//       toast.success("Category created");
//       onClose();
//       resetForm();
//     } catch (err: any) {
//       toast.error(err?.data?.message || "Failed to create category");
//     }
//   };

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} title="Add New Category">
//       <Formik
//         initialValues={{ name: "", image: "" }}
//         validationSchema={CategorySchema}
//         onSubmit={handleSubmit}
//       >
//         {({ values, handleChange, errors, touched }) => (
//           <Form className="flex flex-col h-full space-y-4">
//             <div className="space-y-4 flex-1 mt-10">
//               <InputField
//                 name="name"
//                 placeholder="Category name"
//                 value={values.name}
//                 onChange={handleChange}
//                 error={touched.name && errors.name ? errors.name : ""}
//               />
//               <InputField
//                 name="image"
//                 placeholder="Image URL"
//                 value={values.image}
//                 onChange={handleChange}
//                 error={touched.image && errors.image ? errors.image : ""}
//               />
//             </div>

//             <Button type="submit" loading={isLoading} className="w-full">
//               Create Category
//             </Button>
//           </Form>
//         )}
//       </Formik>
//     </Modal>
//   );
// };

// export default AddCategoryModal;




import React, { useCallback, useState } from "react";
import Modal from "../../components/Modal";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import { useCreateCategoryMutation } from "../../services/menuApi";
import { toast } from "react-toastify";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useDropzone } from 'react-dropzone';
import { ArrowUpTrayIcon, XMarkIcon } from "@heroicons/react/24/outline";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  menuId: string;
};

// Validation schema
const CategorySchema = Yup.object().shape({
  name: Yup.string().required("Category name is required"),
  image: Yup.string().nullable(),
});

const AddCategoryModal: React.FC<Props> = ({ isOpen, onClose, menuId }) => {
  const [createCategory, { isLoading }] = useCreateCategoryMutation();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);

    const previewUrl = URL.createObjectURL(file);
    setPreviewImage(previewUrl);

    // Simulate upload
    setTimeout(() => {
      setIsUploading(false);
    }, 1500);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  const removeImage = () => {
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }
    setPreviewImage(null);
  };

  const handleSubmit = async (
    values: { name: string; image: string },
    { resetForm }: any,
  ) => {
    try {
      // If we have a preview image, use a mock URL (in a real app, you would upload to a server)
      const imageUrl = previewImage ? `https://example.com/uploads/category-${Date.now()}.jpg` : "";

      await createCategory({
        menuId,
        payload: { ...values, image: imageUrl }
      }).unwrap();

      toast.success("Category created");
      onClose();
      resetForm();
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
        setPreviewImage(null);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create category");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        if (previewImage) {
          URL.revokeObjectURL(previewImage);
          setPreviewImage(null);
        }
      }}
      title="Add New Category"
    >
      <Formik
        initialValues={{ name: "", image: "" }}
        validationSchema={CategorySchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, errors, touched, setFieldValue }) => (
          <Form className="flex flex-col h-full space-y-4">
            <div className="space-y-4 flex-1 mt-4">
              <InputField
                name="name"
                label="Category Name"
                placeholder="e.g. Appetizers"
                value={values.name}
                onChange={handleChange}
                error={touched.name && errors.name ? errors.name : ""}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Image
                </label>

                {previewImage ? (
                  <div className="relative group">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-1 shadow-sm transition-all"
                    >
                      <XMarkIcon className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                ) : (
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragActive
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-300 hover:border-indigo-400"
                      }`}
                  >
                    <input {...getInputProps()} />
                    {isUploading ? (
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                        <p className="text-sm text-gray-600">
                          Uploading image...
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="mx-auto h-10 w-10 text-gray-400 mb-2">
                          <ArrowUpTrayIcon />
                        </div>
                        <p className="text-sm text-gray-600">
                          {isDragActive
                            ? "Drop the image here"
                            : "Drag & drop an image here, or click to select"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          JPEG, PNG, WEBP (Max. 5MB)
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            <Button
              type="submit"
              loading={isLoading}
              className="w-full"
              disabled={!values.name}
            >
              Create Category
            </Button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default AddCategoryModal;