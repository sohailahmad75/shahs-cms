// src/features/storeSettings/SettingsPage.tsx
import React, { useState } from "react";
import SettingsPanel from "../index"; 

const SettingsPage = () => {
  const [isOpen, setIsOpen] = useState(true);     
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = false;

  return (
    <SettingsPanel
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      setIsOpen={setIsOpen}
      isCollapsed={isCollapsed}
      setIsCollapsed={setIsCollapsed}
      isMobile={isMobile}
    />
  );
};

export default SettingsPage;
