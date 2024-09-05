import React from "react"; // Adjust import based on your enum location
import { format } from "date-fns";
import { RepeatTypes } from "@/types/datepicker";

interface PickerProps {
  startDate: Date;
  endDate: Date | null;
  repeat: RepeatTypes;
  setStartDate: (date: Date) => void;
  setEndDate: (date: Date | null) => void;
}

const Picker: React.FC<PickerProps> = ({
  startDate,
  endDate,
  repeat,
  setStartDate,
  setEndDate,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 justify-center items-center">
        <label>Start Date</label>
        <input
          data-testid="start-date"
          type="date"
          value={format(startDate, "yyyy-MM-dd")}
          onChange={(e) => setStartDate(new Date(e.target.value))}
          className="bg-gray-500 p-2 rounded-md"
        />
      </div>
      {repeat === RepeatTypes.CUSTOM && (
        <div className="flex gap-4 justify-center items-center">
          <label>End Date</label>
          <input
            data-testid="end-date"
            type="date"
            value={endDate ? format(endDate, "yyyy-MM-dd") : ""}
            onChange={(e) => setEndDate(new Date(e.target.value))}
            className="bg-gray-500 p-2 rounded-md"
          />
        </div>
      )}
    </div>
  );
};

export default Picker;
