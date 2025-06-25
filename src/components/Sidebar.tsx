import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Sidebar.module.scss";

const Sidebar = () => {
  const [openSubmenu, setOpenSubmenu] = useState(null);

  const toggleMenu = (key: any) => {
    setOpenSubmenu(openSubmenu === key ? null : key);
  };

  return (
    <div className={styles.sidebar} id="sidebar">
      <div className={`${styles["sidebar-inner"]} slimscroll`}>
        <div id="sidebar-menu" className={styles["sidebar-menu"]}>
          <ul>
            <li>
              <Link to="/dashboard">
                <img src="assets/img/icons/dashboard.svg" alt="img" />
                <span>Dashboard</span>
              </Link>
            </li>

            {/* Product */}
            <li
              className={`${styles.submenu} ${openSubmenu === "product" ? styles.open : ""}`}
            >
              <span onClick={() => toggleMenu("product")}>
                <img src="assets/img/icons/product.svg" alt="img" />
                <span>Product</span>
                <span className={styles["menu-arrow"]}></span>
              </span>
              <ul>
                <li>
                  <Link to="/products">Product List</Link>
                </li>
                <li>
                  <Link to="/products/add">Add Product</Link>
                </li>
                <li>
                  <Link to="/categories">Category List</Link>
                </li>
                <li>
                  <Link to="/categories/add">Add Category</Link>
                </li>
                <li>
                  <Link to="/subcategories">Sub Category List</Link>
                </li>
                <li>
                  <Link to="/subcategories/add">Add Sub Category</Link>
                </li>
                <li>
                  <Link to="/brands">Brand List</Link>
                </li>
                <li>
                  <Link to="/brands/add">Add Brand</Link>
                </li>
                <li>
                  <Link to="/products/import">Import Products</Link>
                </li>
                <li>
                  <Link to="/barcode">Print Barcode</Link>
                </li>
              </ul>
            </li>

            {/* Sales */}
            <li
              className={`${styles.submenu} ${openSubmenu === "sales" ? styles.open : ""}`}
            >
              <span onClick={() => toggleMenu("sales")}>
                <img src="assets/img/icons/sales1.svg" alt="img" />
                <span>Sales</span>
                <span className={styles["menu-arrow"]}></span>
              </span>
              <ul>
                <li>
                  <Link to="/sales">Sales List</Link>
                </li>
                <li>
                  <Link to="/pos">POS</Link>
                </li>
                <li>
                  <Link to="/sales/new">New Sales</Link>
                </li>
                <li>
                  <Link to="/sales/returns">Sales Return List</Link>
                </li>
                <li>
                  <Link to="/sales/returns/new">New Sales Return</Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
