import React, { useState } from "react";
import Modal from "../../components/Modal";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import { useCreateCategoryMutation } from "../../services/menuApi";
import { toast } from "react-toastify";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  menuId: string;
};

const AddCategoryModal: React.FC<Props> = ({ isOpen, onClose, menuId }) => {
  const [form, setForm] = useState({ name: "", image: "" });
  const [createCategory, { isLoading }] = useCreateCategoryMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) return toast.error("Category name is required");

    try {
      await createCategory({ menuId, payload: form }).unwrap();
      toast.success("Category created");
      onClose();
      setForm({ name: "", image: "" });
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create category");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Category">
      <div className="flex flex-col h-full min-h-[300px] space-y-4">
        <div className="space-y-4 flex-1 mt-10">
          <InputField
            name="name"
            placeholder="Category name"
            value={form.name}
            onChange={handleChange}
          />
          <InputField
            name="image"
            placeholder="Image URL"
            value={form.image}
            onChange={handleChange}
          />
        </div>

        {/* Always sticks to bottom */}
        <Button onClick={handleSubmit} loading={isLoading} className="w-full">
          Create Category
        </Button>
      </div>
    </Modal>
  );
};

export default AddCategoryModal;
