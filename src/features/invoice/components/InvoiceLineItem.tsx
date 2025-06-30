import SelectField from "../../../components/SelectField";
import InputField from "../../../components/InputField";

const productOptions = [
  { label: "Burger", value: "burger" },
  { label: "Fries", value: "fries" },
  { label: "Wrap", value: "wrap" },
];

const InvoiceLineItem = ({
  item,
  index,
  handleChange,
  handleRemove,
  errors,
}) => (
  <div className="grid grid-cols-6 gap-2 mb-2 items-center">
    <SelectField
      name={`items[${index}].product`}
      value={item.product}
      onChange={handleChange}
      options={productOptions}
      placeholder="Product/Service"
      error={errors?.product}
    />
    <InputField
      name={`items[${index}].description`}
      value={item.description}
      onChange={handleChange}
      placeholder="Description"
      error={errors?.description}
    />
    <InputField
      name={`items[${index}].qty`}
      value={item.qty}
      onChange={handleChange}
      type="number"
      placeholder="Qty"
      error={errors?.qty}
    />
    <InputField
      name={`items[${index}].rate`}
      value={item.rate}
      onChange={handleChange}
      type="number"
      placeholder="Rate"
      error={errors?.rate}
    />
    <div className="font-semibold">
      £{(Number(item.qty) * Number(item.rate)).toFixed(2)}
    </div>
    <button
      type="button"
      onClick={handleRemove}
      className="text-red-500 hover:underline"
    >
      Remove
    </button>
  </div>
);

export default InvoiceLineItem;
