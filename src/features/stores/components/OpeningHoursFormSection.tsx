import React from "react";
import CheckboxField from "../../../components/CheckboxField";
import ToggleSwitch from "../../../components/ToggleSwitch";
import SelectField from "../../../components/SelectField";
import { TIME_OPTIONS } from "../helper/store-helper";
import { useTheme } from "../../../context/themeContext"; 

interface OpeningHour {
  day: string;
  open: string;
  close: string;
  closed: boolean;
}

interface Props {
  openingHours: OpeningHour[];
  setOpeningHours: React.Dispatch<React.SetStateAction<OpeningHour[]>>;
  sameAllDays: boolean;
  setSameAllDays: (value: boolean) => void;
  isDarkMode?: boolean; 
}

const OpeningHoursFormSection: React.FC<Props> = ({
  openingHours,
  setOpeningHours,
  sameAllDays,
  setSameAllDays,
  isDarkMode = false,
}) => {
  const { isDarkMode: themeDarkMode } = useTheme();
  const finalDarkMode = isDarkMode || themeDarkMode;

  const handleTimeChange = (
    e: React.ChangeEvent<any>,
    index: number,
    field: "open" | "close",
  ) => {
    const value = e.target.value;
    setOpeningHours((prev) => {
      const updated = prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      );
      
  
      if (sameAllDays && index === 0) {
        const sunday = updated[0];
        return updated.map((item, i) =>
          i === 0 || item.closed ? item : { 
            ...item, 
            open: sunday.open, 
            close: sunday.close 
          },
        );
      }
      return updated;
    });
  };

  const handleToggle = (index: number) => {
    const isNowClosed = !openingHours[index].closed;
    setOpeningHours((prev) => {
      const updated = prev.map((item, i) =>
        i === index ? { ...item, closed: isNowClosed } : item,
      );
      
     
      if (sameAllDays && index === 0) {
        return updated.map((item, i) =>
          i === 0 ? item : { ...item, closed: isNowClosed },
        );
      }
      return updated;
    });
  };

  const handleSameAllDaysToggle = () => {
    const newValue = !sameAllDays;
    setSameAllDays(newValue);
    
    if (newValue) {
     
      const sunday = openingHours[0];
      if (sunday) {
        const updated = openingHours.map((item, idx) =>
          idx === 0 ? item : { 
            ...item, 
            open: sunday.open, 
            close: sunday.close,
            closed: sunday.closed 
          },
        );
        setOpeningHours(updated);
      }
    }
  };

  return (
    <div className="space-y-4">
    
      <div className="flex justify-end">
        <CheckboxField
          name="sameAllDays"
          label="Same every day"
          checked={sameAllDays}
          onChange={handleSameAllDaysToggle}
        />
      </div>

   
      <div className="block sm:hidden space-y-3">
        {openingHours.map((hour, index) => (
          <div 
            key={hour.day}
            className={`
              p-4 rounded-lg border
              ${finalDarkMode 
                ? "bg-slate-800 border-slate-700" 
                : "bg-white border-gray-200"
              }
            `}
          >
          
            <div className="flex items-center justify-between mb-3">
              <span className={`
                font-medium text-sm
                ${finalDarkMode ? "text-slate-200" : "text-gray-800"}
              `}>
                {hour.day}
              </span>
              <ToggleSwitch
                checked={!hour.closed}
                onChange={() => handleToggle(index)}
              />
            </div>

           
            {!hour.closed && (
              <div className="flex items-center gap-2">
                <SelectField
                  value={hour.open}
                  onChange={(e) => handleTimeChange(e, index, "open")}
                  options={TIME_OPTIONS}
                  name={`open-${index}`}
                  disabled={sameAllDays && index !== 0}
                  className="flex-1 min-w-0"
                  placeholder="Open"
                />
                <span className={`
                  px-2 text-xs font-medium
                  ${finalDarkMode ? "text-slate-400" : "text-gray-500"}
                `}>
                  to
                </span>
                <SelectField
                  value={hour.close}
                  onChange={(e) => handleTimeChange(e, index, "close")}
                  options={TIME_OPTIONS}
                  name={`close-${index}`}
                  disabled={sameAllDays && index !== 0}
                  className="flex-1 min-w-0"
                  placeholder="Close"
                />
              </div>
            )}
          </div>
        ))}
      </div>

    
      <div className="hidden sm:grid sm:grid-cols-2 gap-4">
        {openingHours.map((hour, index) => (
          <div 
            key={hour.day}
            className={`
              p-4 rounded-lg border
              ${finalDarkMode 
                ? "bg-slate-800 border-slate-700" 
                : "bg-white border-gray-200"
              }
            `}
          >
            
            <div className="flex items-center justify-between mb-3">
              <span className={`
                font-medium text-sm
                ${finalDarkMode ? "text-slate-200" : "text-gray-800"}
              `}>
                {hour.day}
              </span>
              <ToggleSwitch
                checked={!hour.closed}
                onChange={() => handleToggle(index)}
              />
            </div>

       
            {!hour.closed && (
              <div className="flex items-center gap-2">
                <SelectField
                  value={hour.open}
                  onChange={(e) => handleTimeChange(e, index, "open")}
                  options={TIME_OPTIONS}
                  name={`open-${index}`}
                  disabled={sameAllDays && index !== 0}
                  className="flex-1 min-w-0"
                  placeholder="Open"
                />
                <span className={`
                  px-2 text-xs font-medium
                  ${finalDarkMode ? "text-slate-400" : "text-gray-500"}
                `}>
                  -
                </span>
                <SelectField
                  value={hour.close}
                  onChange={(e) => handleTimeChange(e, index, "close")}
                  options={TIME_OPTIONS}
                  name={`close-${index}`}
                  disabled={sameAllDays && index !== 0}
                  className="flex-1 min-w-0"
                  placeholder="Close"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OpeningHoursFormSection;