import React from "react";
import RecurrenceOptions from "./recurrenceOptions";
import Picker from "./picker";
import PreviewCalendar from "./preview";
import {
  FrequencyTypes,
  RecurrenceTypes,
  RepeatTypes,
} from "@/types/datepicker";

interface DatePickerProps {
  recurrencePattern: RecurrenceTypes;
  startDate: Date;
  endDate: Date | null;
  customRecurrence: { every: number; type: FrequencyTypes } | null;
  repeat: RepeatTypes;
  setRecurrencePattern: (pattern: RecurrenceTypes) => void;
  setStartDate: (date: Date) => void;
  setEndDate: (date: Date | null) => void;
  setCustomRecurrence: (recurrence: {
    every: number;
    type: FrequencyTypes;
  }) => void;
  setRepeat: (repeat: RepeatTypes) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({
  recurrencePattern,
  startDate,
  endDate,
  customRecurrence,
  repeat,
  setRecurrencePattern,
  setStartDate,
  setEndDate,
  setCustomRecurrence,
  setRepeat,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <RecurrenceOptions
        recurrencePattern={recurrencePattern}
        repeat={repeat}
        setRecurrencePattern={setRecurrencePattern}
        setRepeat={setRepeat}
        customRecurrence={customRecurrence}
        setCustomRecurrence={setCustomRecurrence}
        setEndDate={setEndDate}
      />
      <Picker
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        repeat={repeat}
      />
      <PreviewCalendar
        startDate={startDate}
        endDate={endDate}
        recurrencePattern={recurrencePattern}
        customRecurrence={customRecurrence}
      />
    </div>
  );
};

export default DatePicker;
