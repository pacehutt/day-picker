import { FrequencyTypes } from "@/types/datepicker";
import React, { useState } from "react";
import { Button } from "react-day-picker";

interface CustomeOptionsProps {
  setCustomRecurrence: (recurrence: {
    every: number;
    type: FrequencyTypes;
  }) => void;
}

const CustomOptions: React.FC<CustomeOptionsProps> = ({
  setCustomRecurrence,
}) => {
  const freqPatterns = Object.values(FrequencyTypes);

  // Local state for 'every' and 'type'
  const [localRecurrence, setLocalRecurrence] = useState({
    every: "",
    type: "",
  });

  const handleApply = () => {
    console.log(localRecurrence);
    if (localRecurrence.every && localRecurrence.type) {
      setCustomRecurrence({
        every: parseInt(localRecurrence.every),
        type: localRecurrence.type as FrequencyTypes,
      });
    }
  };

  return (
    <div className="flex gap-4 items-center justify-center">
      <p>Every</p>
      <input
        type="number"
        className="bg-gray-500 p-2 rounded-md w-20"
        onChange={(e) =>
          setLocalRecurrence({ ...localRecurrence, every: e.target.value })
        }
        value={localRecurrence.every}
      />

      <div>
        <select
          id="recurrence"
          value={localRecurrence.type}
          onChange={(e) =>
            setLocalRecurrence({ ...localRecurrence, type: e.target.value })
          }
          className="block w-full p-2 text-white bg-gray-500 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>
            Select Type
          </option>
          {freqPatterns.map((pattern) => (
            <option key={pattern} value={pattern}>
              {pattern.charAt(0).toUpperCase() + pattern.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <Button
        onClick={handleApply}
        className="bg-blue-400 text-black p-2 rounded-md"
      >
        Apply
      </Button>
    </div>
  );
};

export default CustomOptions;
