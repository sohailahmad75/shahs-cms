import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import SettingsPanel from "../components/storeSettingSideBar";
import { inviovesidebarMenuList, settingsidebarMenuList, transcationsidebarMenuList } from "../constants";
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

  const openSettingsPanel = () => {
    setActivePanel(prev => (prev === "settings" ? null : "settings"));
    if (isMobile) setIsSidebarOpen(true);
  };

  const openInvoicesPanel = () => {
    setActivePanel(prev => (prev === "invoice" ? null : "invoice"));
    if (isMobile) setIsSidebarOpen(true);
  };

  const openTransactionsPanel = () => {
    setActivePanel(prev => (prev === "transactions" ? null : "transactions"));
    if (isMobile) setIsSidebarOpen(true);
  };

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      if (width >= 768 && width < 1024) {
        setIsCollapsed(true);
      } else if (width >= 1024) {
        setIsCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

   useEffect(() => {
    if (isSidebarOpen && activePanel) {
      let menu: typeof settingsidebarMenuList | null = null;

      if (activePanel === "settings") menu = settingsidebarMenuList;
      if (activePanel === "invoice") menu = inviovesidebarMenuList;
      if (activePanel === "transactions") menu = transcationsidebarMenuList;

      if (menu && menu.length > 0) {
        const firstItem = menu[0];
        const defaultLink = firstItem.link ?? firstItem.children?.[0]?.link;
        if (defaultLink) {
          navigate(defaultLink);
        }
      }
    }
  }, [activePanel, isSidebarOpen, navigate]);

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

        {activePanel === "settings" && (
          <SettingsPanel
            isOpen={isSidebarOpen}
            setIsOpen={setIsSidebarOpen}
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
            isMobile={isMobile}
            menuItems={settingsidebarMenuList}
            panelTitle="Settings"
            panelIcon={<SettingIcon />}
          />
        )}

        {activePanel === "invoice" && (
          <SettingsPanel
            isOpen={isSidebarOpen}
            setIsOpen={setIsSidebarOpen}
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
            isMobile={isMobile}
            menuItems={inviovesidebarMenuList}
            panelTitle="Invoices"
            panelIcon={<InvoiceIcon />}
          />
        )}

        {activePanel === "transactions" && (
          <SettingsPanel
            isOpen={isSidebarOpen}
            setIsOpen={setIsSidebarOpen}
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
            isMobile={isMobile}
            menuItems={transcationsidebarMenuList} 
            panelTitle="Transactions"
            panelIcon={<TransactionIcon />}
          />
        )}
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header
          isMobile={isMobile}
          openSidebar={() => setIsSidebarOpen(true)}
        />
        <main className={`flex-1 overflow-y-auto p-4 ${isDarkMode ? 'bg-slate-950' : 'bg-gary-900' } ${isDarkMode ? 'text-white' : 'text-black' } `}>{children}</main>
      </div>
    </div>
  );
}
