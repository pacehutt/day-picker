import {
  FrequencyTypes,
  RecurrenceTypes,
  RepeatTypes,
} from "@/types/datepicker";
import { create } from "zustand";

interface DatePickerStore {
  recurrencePattern: RecurrenceTypes;
  startDate: Date;
  endDate: Date | null;
  customRecurrence: {
    every: number;
    type: FrequencyTypes;
  } | null;
  repeat: RepeatTypes;

  setRecurrencePattern: (pattern: RecurrenceTypes) => void;
  setStartDate: (date: Date) => void;
  setEndDate: (date: Date | null) => void;
  setCustomRecurrence: (recurrence: any) => void;
  setRepeat: (repeat: RepeatTypes) => void;
}

const useDatePickerStore = create<DatePickerStore>((set) => ({
  recurrencePattern: RecurrenceTypes.DAILY,
  startDate: new Date(),
  endDate: null,
  customRecurrence: null,
  repeat: RepeatTypes.ENDLESS,

  setRecurrencePattern: (pattern) => set({ recurrencePattern: pattern }),
  setStartDate: (date) => set({ startDate: date }),
  setEndDate: (date) => set({ endDate: date }),
  setCustomRecurrence: (recurrence) => set({ customRecurrence: recurrence }),
  setRepeat: (repeat) => set({ repeat }),
}));

export default useDatePickerStore;
