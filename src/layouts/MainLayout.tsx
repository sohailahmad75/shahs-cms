import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import SettingsPanel from "../components/storeSettingSideBar";

interface Props {
  children: ReactNode;
}

export default function MainLayout({ children }: Props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const toggleSettingsPanel = () => {
    setIsSettingsOpen(prev => !prev);
    if (isMobile) {
      setIsSidebarOpen(!isSettingsOpen);
    }
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

  return (
    <div className="flex h-screen">
      <div className="flex flex-row h-full">
        <Sidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          isMobile={isMobile}
         toggleSettingsPanel={toggleSettingsPanel} 
          isSettingsOpen={isSettingsOpen}
        />
        {isSettingsOpen && (
          <SettingsPanel
            isOpen={isSidebarOpen}
            setIsOpen={setIsSidebarOpen}
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
            isMobile={isMobile}
          />
        )}
      </div>
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header
          isMobile={isMobile}
          openSidebar={() => setIsSidebarOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  );
}