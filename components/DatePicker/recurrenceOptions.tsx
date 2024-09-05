import React from "react";
import CustomOptions from "./customOptions";
import {
  FrequencyTypes,
  RecurrenceTypes,
  RepeatTypes,
} from "@/types/datepicker";

interface RecurrenceOptionsProps {
  recurrencePattern: RecurrenceTypes;
  setRecurrencePattern: (pattern: RecurrenceTypes) => void;
  repeat: RepeatTypes;
  setRepeat: (repeat: RepeatTypes) => void;
  customRecurrence: { every: number; type: string } | null;
  setCustomRecurrence: (recurrence: {
    every: number;
    type: FrequencyTypes;
  }) => void;
  setEndDate: (date: Date | null) => void;
}

const RecurrenceOptions: React.FC<RecurrenceOptionsProps> = ({
  recurrencePattern,
  setRecurrencePattern,
  repeat,
  setRepeat,
  customRecurrence,
  setCustomRecurrence,
  setEndDate,
}) => {
  const patterns = Object.values(RecurrenceTypes);

  const handleRepeatChange = (value: string) => {
    if (value === RepeatTypes.ENDLESS) {
      setEndDate(null);
    }
    setRepeat(value as RepeatTypes);
  };

  return (
    <div className="w-full max-w-xs space-y-4">
      <div className="space-y-2">
        <div className="flex items-center">
          <input
            id="repeat-custom"
            type="radio"
            name="repeat"
            value={RepeatTypes.CUSTOM}
            checked={repeat === RepeatTypes.CUSTOM}
            onChange={(e) => handleRepeatChange(e.target.value)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="repeat-custom"
            className="ml-2 text-gray-400 font-semibold"
          >
            Repeat Custom
          </label>
        </div>
        <div className="flex items-center">
          <input
            id="repeat-endless"
            type="radio"
            name="repeat"
            value={RepeatTypes.ENDLESS}
            checked={repeat === RepeatTypes.ENDLESS}
            onChange={(e) => handleRepeatChange(e.target.value)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="repeat-endless"
            className="ml-2 text-gray-400 font-semibold"
          >
            Repeat Endless
          </label>
        </div>
      </div>

      <div>
        <label
          className="block text-gray-400 font-semibold mb-2"
          htmlFor="recurrence"
        >
          Recurrence Options
        </label>
        <select
          id="recurrence"
          value={recurrencePattern}
          onChange={(e) => {
            const selectedPattern = e.target.value as RecurrenceTypes;
            console.log("Recurrence pattern: ", selectedPattern);
            setRecurrencePattern(selectedPattern);
          }}
          className="block w-full p-2 text-white bg-gray-500 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {patterns.map((pattern) => (
            <option key={pattern} value={pattern}>
              {pattern.charAt(0).toUpperCase() + pattern.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {recurrencePattern === RecurrenceTypes.CUSTOM && (
        <CustomOptions setCustomRecurrence={setCustomRecurrence} />
      )}
    </div>
  );
};

export default RecurrenceOptions;
