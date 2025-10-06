import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import TypeSelectorDrawer from "./TypeSelectorDrawer";
import ProductFormDrawer from "./ProductFormDrawer";
import type { Product } from "../product.types";
import {
  useCreateProductMutation,
  useUpdateProductsMutation,
  useGetProductByIdQuery,
} from "../services/productApi";

interface ProductDrawerManagerProps {
  isOpen: boolean;
  onClose: () => void;
  editingProduct?: Partial<Product>;
}

const ProductDrawerManager = ({
  isOpen,
  onClose,
  editingProduct,
}: ProductDrawerManagerProps) => {
  const hasId = Boolean(editingProduct?.id);

  // Fetch latest when editing
  const { data: fetched, isFetching } = useGetProductByIdQuery(
    editingProduct?.id as string,
    {
      skip: !hasId,
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    },
  );

  // Prefer fetched over prop (so edits show most recent server state)
  const productForEdit = useMemo<Partial<Product> | undefined>(
    () => (fetched ?? editingProduct) as Partial<Product> | undefined,
    [fetched, editingProduct],
  );

  // Derive type from the product when editing; otherwise use chosen type on create
  const [selectedType, setSelectedType] = useState<
    "stock" | "non-stock" | "service" | "bundle" | null
  >(editingProduct?.type ?? null);

  useEffect(() => {
    if (!isOpen) return;
    if (productForEdit?.type) {
      setSelectedType(productForEdit.type as any);
    } else if (!hasId) {
      setSelectedType(null); // creating -> show selector first
    }
  }, [isOpen, productForEdit, hasId]);

  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductsMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectType = (
    type: "stock" | "non-stock" | "service" | "bundle",
  ) => setSelectedType(type);

  // Only allow going back to selector for "create new"
  const handleBackToTypeSelector = () => {
    if (!productForEdit) setSelectedType(null);
  };

  const handleSubmit = async (values: Partial<Product>) => {
    setIsSubmitting(true);
    try {
      const payload: Partial<Product> = {
        ...values,
        type: (selectedType ?? values.type) as Product["type"],
        // normalize either code field
        itemCode: values.itemCode,
      };

      if (!payload.type) {
        toast.error("Please choose a type (stock / non-stock / service).");
        return;
      }

      if (productForEdit?.id) {
        await updateProduct({ id: productForEdit.id!, data: payload }).unwrap();
        toast.success("Product updated successfully");
      } else {
        await createProduct(payload).unwrap();
        toast.success("Product created successfully");
      }
      onClose();
    } catch (err: any) {
      console.error("Failed to save product:", err);
      toast.error(err?.data?.message || "Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // --- RENDER ---
  // Editing flow: show loader until we have product OR it’s done fetching.
  if (hasId && !productForEdit && isFetching) {
    return (
      <div
        className="fixed inset-y-0 right-0 z-50 w-full max-w-[600px] bg-white shadow-xl flex items-center justify-center"
        role="dialog"
        aria-modal="true"
      >
        <span className="text-sm text-gray-500">Loading product…</span>
      </div>
    );
  }

  console.log(selectedType, productForEdit);
  // If editing (hasId), always show the form (no type selector)
  const shouldShowForm =
    hasId || (selectedType !== null && selectedType !== undefined);

  return (
    <div
      className="fixed inset-y-0 right-0 z-50 w-full max-w-[600px] bg-white shadow-xl"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-drawer-title"
    >
      {shouldShowForm ? (
        <ProductFormDrawer
          selectedType={
            (productForEdit?.type ?? selectedType) as
              | "stock"
              | "non-stock"
              | "service"
          }
          onBack={handleBackToTypeSelector}
          onClose={onClose}
          onSubmit={handleSubmit}
          editingProduct={productForEdit}
          isSubmitting={isSubmitting || isFetching}
        />
      ) : (
        // Create flow only
        <TypeSelectorDrawer onSelect={handleSelectType} onClose={onClose} />
      )}
    </div>
  );
};

export default ProductDrawerManager;
