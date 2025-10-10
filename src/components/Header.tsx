import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SelectField from "../components/SelectField";
import { useAdmin } from "../hooks/useAuth";
import { ROLES } from "../helper";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import DropdownMenu from "./DropdownMenu"; // Your location dropdown
import { useTheme } from "../context/themeContext";

interface Props {
  isMobile: boolean;
  openSidebar: () => void;
}

const locationOptions = [
  { label: "Harrow", value: "harrow" },
  { label: "Ilford", value: "ilford" },
  { label: "Croydon", value: "croydon" },
  { label: "Watford", value: "watford" },
];

export default function Header({ isMobile, openSidebar }: Props) {
  const { admin: activeAdmin } = useAdmin();
  const [selectedLocation, setSelectedLocation] = useState("harrow");
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  return (
    <header
      className={`flex justify-end ${isDarkMode ? "bg-slate-900" : "bg-white"}   ${isDarkMode ? "text-white" : "text-black"} px-4 py-3 shadow-sm`}
    >
      {isMobile && (
        <button onClick={openSidebar}>
          <img
            src="/assets/img/icons/menu.svg"
            className="h-6 w-6"
            alt="Menu"
          />
        </button>
      )}

      <div className="flex items-center gap-4">
        {activeAdmin.admin.role === ROLES.STORE_MANAGER && (
          <div className="w-60">
            <SelectField
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              options={locationOptions}
              placeholder="Select Location"
            />
          </div>
        )}

        <DropdownMenu
          trigger={
            <div className="flex items-center gap-2">
              {activeAdmin.admin.imageUrl ? (
                <img
                  src={activeAdmin.admin.imageUrl}
                  alt="User"
                  className="w-8 h-8 rounded-full border object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-orange-100 text-white flex items-center justify-center text-sm font-semibold uppercase border">
                  {activeAdmin.admin.firstName?.charAt(0) || "U"}
                </div>
              )}
              <span className="text-sm font-medium">Sohail</span>
            </div>
          }
          items={[
            {
              label: "Profile",
              onClick: () => {
                navigate("/setting/profile-settings");
              },
            },
            {
              label: "Logout",
              danger: true,
              onClick: () => {
                dispatch(logout());
                navigate("/login");
              },
            },
          ]}
        />
      </div>
    </header>
  );
}
