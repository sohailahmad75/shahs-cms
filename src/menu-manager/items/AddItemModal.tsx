// import React, { useEffect } from "react";
// import Modal from "../../components/Modal";
// import InputField from "../../components/InputField";
// import SelectField from "../../components/SelectField";
// import Button from "../../components/Button";
// import { useCreateItemMutation } from "../../services/menuApi";
// import { toast } from "react-toastify";
// import { Formik, Form } from "formik";
// import * as Yup from "yup";
// import type { MenuCategory } from "../../types";

// type Props = {
//   isOpen: boolean;
//   onClose: () => void;
//   categories: { id: string; name: string }[];
//   selectedCategory: MenuCategory;
// };

// const AddItemSchema = Yup.object().shape({
//   name: Yup.string().required("Item name is required"),
//   price: Yup.number()
//     .typeError("Price must be a number")
//     .required("Price is required"),
//   categoryId: Yup.string().required("Category is required"),
// });

// const AddItemModal: React.FC<Props> = ({
//   isOpen,
//   onClose,
//   categories,
//   selectedCategory,
// }) => {
//   const [createItem, { isLoading }] = useCreateItemMutation();

//   const initialValues = {
//     name: "",
//     description: "",
//     price: "",
//     deliveryPrice: "",
//     image: "",
//     categoryId: selectedCategory?.id || "",
//   };

//   const handleSubmit = async (values: typeof initialValues) => {
//     try {
//       await createItem({
//         categoryId: values.categoryId,
//         payload: {
//           name: values.name,
//           description: values.description,
//           image: values.image,
//           price: parseFloat(values.price),
//           deliveryPrice: parseFloat(values.deliveryPrice),
//         },
//       }).unwrap();

//       toast.success("Item created");
//       onClose();
//     } catch (err: any) {
//       toast.error(err?.data?.message || "Failed to create item");
//     }
//   };

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} title="Add New Item">
//       <Formik
//         initialValues={initialValues}
//         validationSchema={AddItemSchema}
//         enableReinitialize
//         onSubmit={handleSubmit}
//       >
//         {({ values, handleChange, errors, touched }) => (
//           <Form className="space-y-4 h-full flex flex-col justify-between">
//             <div className="space-y-4">
//               <div>
//                 <label className="text-sm font-medium text-gray-700 mb-1 block">
//                   Item name <span className="text-red-500">*</span>
//                 </label>
//                 <InputField
//                   name="name"
//                   placeholder="Item name"
//                   value={values.name}
//                   onChange={handleChange}
//                   error={touched.name ? errors.name : ""}
//                 />
//               </div>

//               <div>
//                 <label className="text-sm font-medium text-gray-700 mb-1 block">
//                   Description
//                 </label>
//                 <InputField
//                   name="description"
//                   placeholder="Description"
//                   value={values.description}
//                   onChange={handleChange}
//                 />
//               </div>

//               <div>
//                 <label className="text-sm font-medium text-gray-700 mb-1 block">
//                   Price <span className="text-red-500">*</span>
//                 </label>
//                 <InputField
//                   name="price"
//                   type="number"
//                   placeholder="Price"
//                   value={values.price}
//                   onChange={handleChange}
//                   error={touched.price ? errors.price : ""}
//                 />
//               </div>

//               <div>
//                 <label className="text-sm font-medium text-gray-700 mb-1 block">
//                   Delivery Price <span className="text-red-500">*</span>
//                 </label>
//                 <InputField
//                   name="deliveryPrice"
//                   type="number"
//                   placeholder="Delivery Price"
//                   value={values.deliveryPrice}
//                   onChange={handleChange}
//                   error={touched.deliveryPrice ? errors.deliveryPrice : ""}
//                 />
//               </div>

//               <div>
//                 <label className="text-sm font-medium text-gray-700 mb-1 block">
//                   Image URL
//                 </label>
//                 <InputField
//                   name="image"
//                   placeholder="Image URL"
//                   value={values.image}
//                   onChange={handleChange}
//                 />
//               </div>

//               <div>
//                 <label className="text-sm font-medium text-gray-700 mb-1 block">
//                   Category <span className="text-red-500">*</span>
//                 </label>
//                 <SelectField
//                   name="categoryId"
//                   value={values.categoryId}
//                   onChange={handleChange}
//                   options={categories.map((c) => ({
//                     label: c.name,
//                     value: c.id,
//                   }))}
//                   placeholder="Select category"
//                   error={touched.categoryId ? errors.categoryId : ""}
//                 />
//               </div>
//             </div>

//             <Button type="submit" className="w-full" loading={isLoading}>
//               Create Item
//             </Button>
//           </Form>
//         )}
//       </Formik>
//     </Modal>
//   );
// };

// export default AddItemModal;




import React, { useCallback, useState } from "react";
import Modal from "../../components/Modal";
import InputField from "../../components/InputField";
import SelectField from "../../components/SelectField";
import Button from "../../components/Button";
import { useCreateItemMutation } from "../../services/menuApi";
import { toast } from "react-toastify";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import type { MenuCategory } from "../../types";
import { useDropzone } from 'react-dropzone';
import { ArrowUpTrayIcon, XMarkIcon } from "@heroicons/react/24/outline";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  categories: { id: string; name: string }[];
  selectedCategory: MenuCategory;
};

const AddItemSchema = Yup.object().shape({
  name: Yup.string().required("Item name is required"),
  price: Yup.number()
    .typeError("Price must be a number")
    .required("Price is required"),
  categoryId: Yup.string().required("Category is required"),
});

const AddItemModal: React.FC<Props> = ({
  isOpen,
  onClose,
  categories,
  selectedCategory,
}) => {
  const [createItem, { isLoading }] = useCreateItemMutation();
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

  const initialValues = {
    name: "",
    description: "",
    price: "",
    deliveryPrice: "",
    image: "",
    categoryId: selectedCategory?.id || "",
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      // If we have a preview image, use a mock URL (in a real app, you would upload to a server)
      const imageUrl = previewImage ? `https://example.com/uploads/item-${Date.now()}.jpg` : values.image;

      await createItem({
        categoryId: values.categoryId,
        payload: {
          name: values.name,
          description: values.description,
          image: imageUrl,
          price: parseFloat(values.price),
          deliveryPrice: parseFloat(values.deliveryPrice),
        },
      }).unwrap();

      toast.success("Item created");
      onClose();
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
        setPreviewImage(null);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create item");
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
      title="Add New Item"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={AddItemSchema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, errors, touched }) => (
          <Form className="space-y-4 h-full flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Item name <span className="text-red-500">*</span>
                </label>
                <InputField
                  name="name"
                  placeholder="Item name"
                  value={values.name}
                  onChange={handleChange}
                  error={touched.name ? errors.name : ""}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Description
                </label>
                <InputField
                  name="description"
                  placeholder="Description"
                  value={values.description}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Price <span className="text-red-500">*</span>
                </label>
                <InputField
                  name="price"
                  type="number"
                  placeholder="Price"
                  value={values.price}
                  onChange={handleChange}
                  error={touched.price ? errors.price : ""}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Delivery Price <span className="text-red-500">*</span>
                </label>
                <InputField
                  name="deliveryPrice"
                  type="number"
                  placeholder="Delivery Price"
                  value={values.deliveryPrice}
                  onChange={handleChange}
                  error={touched.deliveryPrice ? errors.deliveryPrice : ""}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Category <span className="text-red-500">*</span>
                </label>
                <SelectField
                  name="categoryId"
                  value={values.categoryId}
                  onChange={handleChange}
                  options={categories.map((c) => ({
                    label: c.name,
                    value: c.id,
                  }))}
                  placeholder="Select category"
                  error={touched.categoryId ? errors.categoryId : ""}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Item Image
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

            <Button type="submit" className="w-full" loading={isLoading}>
              Create Item
            </Button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default AddItemModal;