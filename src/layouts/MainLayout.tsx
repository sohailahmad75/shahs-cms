import { useEffect, useState, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useTheme } from "../context/themeContext";
import { useNavigate } from "react-router-dom";
import { sidebarMenu } from "../constants/sidebarMenu";

interface Props {
  children: React.ReactNode;
}

export default function MainLayout({ children }: Props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activePanel, setActivePanel] = useState<string | null>(null);

  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const handlePanelToggle = useCallback(
    (panelId: string | null) => {
      setActivePanel((prev) => (prev === panelId ? null : panelId));
      if (isMobile) setIsSidebarOpen(true);
    },
    [isMobile],
  );

  useEffect(() => {
    const applySize = () => {
      const w = window.innerWidth;
      const mobile = w < 768;
      setIsMobile(mobile);
      setIsCollapsed(!mobile && w < 1024);
    };
    applySize();
    window.addEventListener("resize", applySize);
    return () => window.removeEventListener("resize", applySize);
  }, []);

  
  useEffect(() => {
    if (!isSidebarOpen || !activePanel) return;
    const active = sidebarMenu.find((m) => m.id === activePanel);
    const first = active?.panel?.children?.[0];
    if (first?.link) navigate(first.link);
  }, [activePanel, isSidebarOpen, navigate]);

  const mainClasses = `flex-1 overflow-y-auto p-4 ${isDarkMode ? "bg-slate-950 text-white" : "bg-gray-100 text-black"}`;

  return (
    <div className="flex h-screen">
      <div className="flex flex-row h-full">
        <Sidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          isMobile={isMobile}
          activePanel={activePanel}
          setActivePanel={handlePanelToggle}
        />
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
