import { useState } from "react";
import { toast } from "react-toastify";
import TypeSelectorDrawer from "./TypeSelectorDrawer";
import ProductFormDrawer from "./ProductFormDrawer";
import type { Product } from "../product.types";
import {
  useCreateProductMutation,
  useUpdateProductsMutation,
} from "../services/productApi";

interface ProductDrawerManagerProps {
  isOpen: boolean;
  onClose: () => void;
  editingProduct?: Partial<Product>;
}

type ProductType = "stock" | "non-stock" | "service";

const ProductDrawerManager = ({
  isOpen,
  onClose,
  editingProduct,
}: ProductDrawerManagerProps) => {

  const [selectedType, setSelectedType] = useState<ProductType | null>(
    editingProduct?.productType as ProductType || null
  );

  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductsMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectType = (type: ProductType) => {
    setSelectedType(type);
  };

  const handleBackToTypeSelector = () => {
    if (!editingProduct) {
      setSelectedType(null);
    }
  };

  const handleSubmit = async (values: Partial<Product>) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...values,
        productType: selectedType,

        itemCode: values.itemCode,
      };

      if (editingProduct?.id) {
        await updateProduct({ id: editingProduct.id, data: payload }).unwrap();
        toast.success("Product updated successfully");
      } else {
        await createProduct(payload).unwrap();
        toast.success("Product created successfully");
      }
      onClose();
    } catch (err: any) {
      console.error("Failed to save product:", err);
      toast.error(err.data?.message || "Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-y-0 right-0 z-50 w-full max-w-[600px] bg-white shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-drawer-title"
      >
        {selectedType ? (
          <ProductFormDrawer
            selectedType={selectedType}
            onBack={handleBackToTypeSelector}
            onClose={onClose}
            onSubmit={handleSubmit}
            editingProduct={editingProduct}
            isSubmitting={isSubmitting}
          />
        ) : (
          <TypeSelectorDrawer onSelect={handleSelectType} onClose={onClose} />
        )}
      </div>
    </>
  );
};

export default ProductDrawerManager;