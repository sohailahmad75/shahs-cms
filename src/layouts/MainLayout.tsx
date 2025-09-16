import type { ReactNode } from "react";
import { useEffect, useMemo, useState, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import SettingsPanel from "../components/storeSettingSideBar";
import {
  inventorySidebarMenuList,
  inviovesidebarMenuList,
  settingsidebarMenuList,
  transcationsidebarMenuList,
} from "../constants";
import SettingIcon from "../assets/styledIcons/SettingIcon";
import InvoiceIcon from "../assets/styledIcons/InvoiceIcon";
import TransactionIcon from "../assets/styledIcons/TransactionIcon";
import { useTheme } from "../context/themeContext";
import { useNavigate } from "react-router-dom";

interface Props {
  children: ReactNode;
}

type PanelType = "settings" | "invoice" | "transactions" | null;

export default function MainLayout({ children }: Props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activePanel, setActivePanel] = useState<PanelType>(null);

  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  // Central config for side panels
  const PANEL_CONFIG = useMemo(
    () => ({
      settings: {
        menu: settingsidebarMenuList,
        title: "Settings",
        icon: <SettingIcon />,
      },
      invoice: {
        menu: inviovesidebarMenuList,
        title: "Invoices",
        icon: <InvoiceIcon />,
      },
      inventory: {
        menu: inventorySidebarMenuList,
        title: "Inventory",
        icon: <InvoiceIcon />,
      },
      transactions: {
        menu: transcationsidebarMenuList,
        title: "Transactions",
        icon: <TransactionIcon />,
      },
    }),
    [],
  );

  // Single handler to toggle any panel
  const handlePanelToggle = useCallback(
    (panel: Exclude<PanelType, null>) => {
      setActivePanel((prev) => (prev === panel ? null : panel));
      if (isMobile) setIsSidebarOpen(true);
    },
    [isMobile],
  );

  // Pass these to Sidebar
  const openSettingsPanel = useCallback(
    () => handlePanelToggle("settings"),
    [handlePanelToggle],
  );
  const openInvoicesPanel = useCallback(
    () => handlePanelToggle("invoice"),
    [handlePanelToggle],
  );
  const openTransactionsPanel = useCallback(
    () => handlePanelToggle("transactions"),
    [handlePanelToggle],
  );

  // Responsive behavior
  useEffect(() => {
    const applySize = () => {
      const w = window.innerWidth;
      const mobile = w < 768;
      setIsMobile(mobile);
      // Tablet collapsed, desktop expanded
      setIsCollapsed(!mobile && w < 1024);
    };
    applySize();
    window.addEventListener("resize", applySize);
    return () => window.removeEventListener("resize", applySize);
  }, []);

  // Auto-navigate to the first item of the active panel
  useEffect(() => {
    if (!isSidebarOpen || !activePanel) return;
    const cfg = PANEL_CONFIG[activePanel];
    const first = cfg?.menu?.[0];
    const defaultLink = first?.link ?? first?.children?.[0]?.link;
    if (defaultLink) navigate(defaultLink);
  }, [activePanel, isSidebarOpen, navigate, PANEL_CONFIG]);

  const mainClasses = `flex-1 overflow-y-auto p-4 ${
    isDarkMode ? "bg-slate-950 text-white" : "bg-gray-100 text-black"
  }`;

  const activeCfg = activePanel ? PANEL_CONFIG[activePanel] : null;

  return (
    <div className="flex h-screen">
      <div className="flex flex-row h-full">
        <Sidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          isMobile={isMobile}
          openSettingsPanel={openSettingsPanel}
          openInvoicesPanel={openInvoicesPanel}
          openTransactionsPanel={openTransactionsPanel}
          activePanel={activePanel}
          setActivePanel={setActivePanel}
        />

        {activeCfg && (
          <SettingsPanel
            isOpen={isSidebarOpen}
            setIsOpen={setIsSidebarOpen}
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
            isMobile={isMobile}
            menuItems={activeCfg.menu}
            panelTitle={activeCfg.title}
            panelIcon={activeCfg.icon}
          />
        )}
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header
          isMobile={isMobile}
          openSidebar={() => setIsSidebarOpen(true)}
        />
        <main className={mainClasses}>{children}</main>
      </div>
    </div>
  );
}
