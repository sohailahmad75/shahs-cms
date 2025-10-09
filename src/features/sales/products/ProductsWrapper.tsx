import type { PropsWithChildren } from "react";
import TabbedPageLayout from "../../../components/TabbedPageLayout";

const transactionTabs = [
  // { label: "Invoices", path: "/sales/invoices" },
  // { label: "Products & services", path: "/sales/products" },
  // { label: "Product Categories", path: "/sales/product-categories" },
];

const ProductsWrapper = ({ children }: PropsWithChildren) => {
  return (
    <TabbedPageLayout title="Sales" tabs={transactionTabs}>
      {children}
    </TabbedPageLayout>
  );
};

export default ProductsWrapper;
