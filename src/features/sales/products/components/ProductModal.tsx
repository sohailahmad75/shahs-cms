import { useState } from 'react';
import TypeSelectorDrawer from './TypeSelectorDrawer';
import ProductFormDrawer from './ProductFormDrawer';
import type { Product } from '../product.types';
import {
  useCreateProductMutation,
  useUpdateProductsMutation,
} from '../services/productApi';

interface ProductDrawerManagerProps {
  isOpen: boolean;
  onClose: () => void;
  editingProduct?: Partial<Product>;
}

const ProductDrawerManager = ({ isOpen, onClose, editingProduct }: ProductDrawerManagerProps) => {

  const [selectedType, setSelectedType] = useState<string | null>(
    editingProduct ? (editingProduct.isInventoryItem ? 'stock' : 'service') : null
  );

  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductsMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectType = (type: string) => {
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
        
        type: selectedType === 'stock' ? 'stock' :
          selectedType === 'non-stock' ? 'non-stock' :
            selectedType === 'service' ? 'service' : 'bundle',
        item_code: values.itemCode || '', 
        category_id: values.categoryId || '', 
        is_inventory_item: selectedType === 'stock',
    
        sku: values.sku || values.itemCode || '',
        itemCode: values.itemCode || values.sku || '',
      };

     
      Object.keys(payload).forEach(key => {
        if (payload[key] === undefined || payload[key] === null) {
          payload[key] = '';
        }
      });

      if (editingProduct?.id) {
        await updateProduct({ id: editingProduct.id, data: payload }).unwrap();
    
      } else {
        await createProduct(payload).unwrap();
   
      }
      onClose();
    } catch (err: any) {
      console.error('Failed to save product:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  if (!isOpen) return null;

  return (
    <>

      <div
        className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-xl overflow-y-auto lg:w-1/3"
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
          <TypeSelectorDrawer
            onSelect={handleSelectType}
            onClose={onClose}
          />
        )}
      </div>
    </>
  );
};

export default ProductDrawerManager;