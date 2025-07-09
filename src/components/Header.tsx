import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SelectField from "../components/SelectField";
import { useUser } from "../hooks/useAuth";
import { ROLES } from "../helper";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice"; // Your location dropdown

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
  const { user: activeUser } = useUser();
  const [selectedLocation, setSelectedLocation] = useState("harrow");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !(userMenuRef.current as HTMLElement).contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUserAction = (action: string) => {
    setShowUserMenu(false);
    if (action === "logout") {
      dispatch(logout());
      navigate("/login");
    } else if (action === "profile") {
      navigate("/profile");
    }
  };

  return (
    <header className="flex justify-end bg-white text-black px-4 py-3 shadow-sm">
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
        {activeUser.user.role === ROLES.STORE_MANAGER && (
          <div className="w-60">
            <SelectField
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              options={locationOptions}
              placeholder="Select Location"
            />
          </div>
        )}

        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu((prev) => !prev)}
            className="flex items-center gap-2 focus:outline-none cursor-pointer"
          >
            {activeUser.user.imageUrl ? (
              <img
                src={activeUser.user.imageUrl}
                alt="User"
                className="w-8 h-8 rounded-full border object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-orange-100 text-white flex items-center justify-center text-sm font-semibold uppercase border">
                {activeUser.user.firstName?.charAt(0) || "U"}
              </div>
            )}
            <span className="text-sm font-medium">Sohail</span>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-40 z-50 bg-white border border-gray-200 rounded shadow-md max-h-60 overflow-y-auto animate-fadeIn">
              <div
                onClick={() => handleUserAction("profile")}
                className="px-4 py-2 cursor-pointer transition-colors duration-150 text-gray-700 hover:bg-orange-50"
              >
                Profile
              </div>
              <div
                onClick={() => handleUserAction("logout")}
                className="px-4 py-2 cursor-pointer transition-colors duration-150 text-primary-100 hover:bg-orange-50"
              >
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
