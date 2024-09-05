"use client";

import DatePicker from "@/components/DatePicker";
import useDatePickerStore from "@/store/useDatePickerStore";

export default function Home() {
  const {
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
  } = useDatePickerStore();

  return (
    <div className="h-screen flex items-center justify-center">
      <DatePicker
        recurrencePattern={recurrencePattern}
        startDate={startDate}
        endDate={endDate}
        customRecurrence={customRecurrence}
        repeat={repeat}
        setRecurrencePattern={setRecurrencePattern}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        setCustomRecurrence={setCustomRecurrence}
        setRepeat={setRepeat}
      />
    </div>
  );
}
