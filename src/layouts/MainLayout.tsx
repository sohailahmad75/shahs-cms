import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

interface Props {
  children: ReactNode;
}

export default function MainLayout({ children }: Props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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
      {" "}
      {/* ✅ NO overflow-hidden here */}
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobile={isMobile}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        {" "}
        {/* ✅ Restrict overflow here */}
        <Header
          isMobile={isMobile}
          openSidebar={() => setIsSidebarOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-4">
          {" "}
          {/* ✅ Makes children scrollable */}
          {children}
        </main>
      </div>
    </div>
  );
}
