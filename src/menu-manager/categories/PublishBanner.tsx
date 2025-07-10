import React, { useState } from "react";
import Button from "../../components/Button";
import { CheckIcon } from "lucide-react";
import IconDropdown from "../../components/IconDropdown";
import VerticalDotsIcon from "../../assets/styledIcons/VerticalDotsIcon";
import PublishSitesModal from "./PublishSitesModal";
import UploadIcon from "../../assets/styledIcons/UploadIcon";
import type { StoreSummary } from "../index";

const PublishBanner = ({
  selectedSites = [],
  setSelectedSites,
  onPublish,
  isAssigning,
}: {
  isAssigning: boolean;
  selectedSites: string[];
  setSelectedSites: React.Dispatch<React.SetStateAction<string[]>>;
  onPublish: () => void;
  storeMenus?: StoreSummary[];
}) => {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="relative z-40">
        <div className="fixed bottom-2 md:left-64 md:right-6 left-0 px-2 md:px-4 z-40 w-full md:w-auto">
          <div className="bg-[#2e3333]/90 text-white rounded p-4 md:p-8 flex flex-wrap gap-4 justify-between items-center">
            {/* Left side: Icon + message */}
            <div className="flex items-center gap-3">
              <div className="bg-green-400 p-1 flex items-center justify-center rounded-full">
                <CheckIcon />
              </div>
              <div className="text-sm">
                <p className="font-medium">Your changes are saved,</p>
                <p>but customers won’t see them until you press Publish.</p>
              </div>
            </div>

            {/* Right side: Buttons */}
            <div className="flex items-center ml-auto">
              <Button
                loading={isAssigning}
                variant="outlined"
                disabled={selectedSites.length === 0 || isAssigning}
                onClick={onPublish}
                className="rounded-none rounded-l-md"
              >
                <UploadIcon /> Publish – {selectedSites.length} site
                {selectedSites.length !== 1 && "s"}
              </Button>

              <IconDropdown
                icon={<VerticalDotsIcon />}
                buttonClassName="bg-orange-100 text-gray-800 hover:text-black rounded-none rounded-r-md p-2"
                items={[
                  {
                    label: "Publish to additional sites",
                    onClick: () => setModalOpen(true),
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <PublishSitesModal
          setSelectedSites={setSelectedSites}
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onSave={() => setModalOpen(false)}
          selectedSites={selectedSites}
        />
      )}
    </>
  );
};

export default PublishBanner;
