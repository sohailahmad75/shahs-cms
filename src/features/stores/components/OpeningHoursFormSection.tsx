import React from "react";
import CheckboxField from "../../../components/CheckboxField";
import ToggleSwitch from "../../../components/ToggleSwitch";
import SelectField from "../../../components/SelectField";
import { TIME_OPTIONS } from "../helper/store-helper";

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
}

const OpeningHoursFormSection: React.FC<Props> = ({
  openingHours,
  setOpeningHours,
  sameAllDays,
  setSameAllDays,
}) => {
  const handleChange = (
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
          i === 0 || item.closed
            ? item
            : { ...item, open: sunday.open, close: sunday.close },
        );
      }
      return updated;
    });
  };

  return (
    <>
      <div className="mb-3 flex items-center justify-end mb-2">
        <CheckboxField
          name="sameAllDays"
          label="Same every day"
          checked={sameAllDays}
          onChange={() => {
            const newValue = !sameAllDays;
            setSameAllDays(newValue);
            const sunday = openingHours[0];
            if (!sunday) return;
            const updated = openingHours.map((item, idx) =>
              idx === 0
                ? item
                : {
                  ...item,
                  open: sunday.open,
                  close: sunday.close,
                  closed: sunday.closed,
                },
            );
            setOpeningHours(updated);
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
        {openingHours.map((h, idx) => (
          <div key={h.day} className="flex flex-col">
            <div className="flex items-center justify-between flex-wrap me-5">
              <div className="me-4 font-medium p-3">{h.day}</div>

              <ToggleSwitch
                checked={!h.closed}
                onChange={() => {
                  const isNowClosed = !h.closed;
                  setOpeningHours((prev) => {
                    const updated = prev.map((item, i) =>
                      i === idx ? { ...item, closed: isNowClosed } : item,
                    );
                    if (sameAllDays && idx === 0) {
                      return updated.map((item, i) =>
                        i === 0 ? item : { ...item, closed: isNowClosed },
                      );
                    }
                    return updated;
                  });
                }}
              />
            </div>

            {!h.closed && (
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                <div className="w-full ">
                  <SelectField
                    value={h.open}
                    onChange={(e) => handleChange(e, idx, "open")}
                    options={TIME_OPTIONS}
                    name={`open-${idx}`}
                    disabled={sameAllDays && idx !== 0}
                  />
                </div>
                <span className="hidden sm:inline">-</span>
                <div className="w-full">
                  <SelectField
                    value={h.close}
                    onChange={(e) => handleChange(e, idx, "close")}
                    options={TIME_OPTIONS}
                    name={`close-${idx}`}
                    disabled={sameAllDays && idx !== 0}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default OpeningHoursFormSection;
