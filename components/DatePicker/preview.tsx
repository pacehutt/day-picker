import React, { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import {
  add,
  getDay,
  getDaysInMonth,
  isSameMonth,
  isBefore,
  isSameDay,
  isSameYear,
  addDays,
  startOfMonth,
  addMonths,
  isAfter,
  addWeeks,
  addYears,
  endOfMonth,
  setDay,
} from "date-fns";
import { FrequencyTypes, RecurrenceTypes } from "@/types/datepicker";
import "react-day-picker/style.css";

interface CustomRecurrence {
  every: number;
  type: FrequencyTypes;
}

interface PreviewCalenderProps {
  startDate: Date;
  endDate: Date | null;
  recurrencePattern: string;
  customRecurrence: CustomRecurrence | null;
}

const PreviewCalender: React.FC<PreviewCalenderProps> = ({
  startDate,
  endDate,
  recurrencePattern,
  customRecurrence,
}) => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [currentMonth, setCurrentMonth] = useState<Date>(startDate);
  const [prevMonth, setPrevMonth] = useState<Date>(startDate);

  const generateCustomDates = (currentDate: Date): Date[] => {
    // Return an empty array if the recurrence pattern is not properly defined
    if (!(customRecurrence?.every && customRecurrence?.type)) {
      return [];
    }

    if (endDate && isAfter(currentDate, endDate)) {
      console.log("end date reached");
      return [];
    }

    console.log("end date not reached");
    const { every, type } = customRecurrence;
    const dates: Date[] = [];
    let lastDate = currentDate;

    // Handle daily recurrence with respect to the last selected date
    if (
      selectedDates.length > 0 &&
      isAfter(currentDate, selectedDates[selectedDates.length - 1]) &&
      type === FrequencyTypes.DAY
    ) {
      lastDate = addDays(selectedDates[selectedDates.length - 1], every);
    }

    const lastOfMonth = endOfMonth(currentDate);

    // Process different recurrence types
    if (type === FrequencyTypes.DAY) {
      // Generate daily dates
      while (isBefore(lastDate, lastOfMonth)) {
        if (endDate && isAfter(lastDate, endDate)) {
          break;
        }
        dates.push(new Date(lastDate));
        lastDate = addDays(lastDate, every);

        console.log("last date", dates);
      }
    } else if (type === FrequencyTypes.WEEK) {
      let targetDay;
      // Weekly recurrence logic
      if (lastDate == startDate) {
        targetDay = getDay(lastDate);
      } else {
        targetDay = getDay(selectedDates[selectedDates.length - 1]);
        lastDate = selectedDates[selectedDates.length - 1];
      }

      // Generate weekly dates
      while (isBefore(lastDate, lastOfMonth)) {
        if (endDate && isAfter(lastDate, endDate)) {
          break;
        }

        dates.push(new Date(lastDate));
        lastDate = addWeeks(lastDate, every);

        // Ensure the week day matches the target day
        if (getDay(lastDate) !== targetDay) {
          lastDate = setDay(lastDate, targetDay, { weekStartsOn: 0 });
        }
      }
    } else {
      // Monthly or yearly recurrence logic
      if (lastDate === startDate) {
        dates.push(new Date(lastDate));
      } else {
        const lastSelectedDate = selectedDates[selectedDates.length - 1];
        let nextDate = lastSelectedDate;
        nextDate =
          type === FrequencyTypes.MONTH
            ? addMonths(lastSelectedDate, every)
            : addYears(lastSelectedDate, every);

        if (!(endDate && isAfter(nextDate, endDate))) {
          dates.push(new Date(nextDate));
        }
      }
    }

    return dates;
  };

  const generateDates = (targetDate: Date, currentMonth: Date): Date[] => {
    const dates: Date[] = [];
    let currentDate = new Date(targetDate);

    // If the target date is before the start date, no dates are generated
    if (isBefore(currentDate, startDate)) {
      return [];
    }

    // Loop through the current month to generate dates based on the recurrence pattern
    while (
      isSameMonth(currentDate, currentMonth) &&
      (!endDate ||
        isBefore(currentDate, endDate) ||
        isSameDay(currentDate, endDate))
    ) {
      if (recurrencePattern === "DAILY") {
        // Daily recurrence
        dates.push(new Date(currentDate));
        currentDate = add(currentDate, { days: 1 });
      } else if (recurrencePattern === "WEEKLY") {
        // Weekly recurrence
        if (getDay(currentDate) === getDay(targetDate)) {
          dates.push(new Date(currentDate));
        }
        currentDate = add(currentDate, { days: 1 });
      } else if (recurrencePattern === "MONTHLY") {
        // Monthly recurrence
        if (
          currentDate.getDate() === targetDate.getDate() &&
          currentDate.getDate() <= getDaysInMonth(currentDate)
        ) {
          dates.push(new Date(currentDate));
        }
        currentDate = add(currentDate, { days: 1 });
      } else if (recurrencePattern === "YEARLY") {
        // Yearly recurrence
        if (
          currentDate.getDate() === targetDate.getDate() &&
          currentDate.getMonth() === targetDate.getMonth() &&
          isSameYear(currentDate, targetDate)
        ) {
          dates.push(new Date(currentDate));
        }
        currentDate = add(currentDate, { days: 1 });
      }
    }

    return dates;
  };

  const handleMonthChange = (newMonth: Date): void => {
    // Prevent changing to a month before the previous month or after the end date
    if (
      isBefore(newMonth, prevMonth) ||
      (endDate && isAfter(newMonth, endDate))
    ) {
      return;
    }

    const targetDay = getDay(startDate); // Extract the day of the week from startDate
    let nextMonthDate = startOfMonth(newMonth);

    // Handle different recurrence patterns (weekly, monthly, yearly, custom)
    if (recurrencePattern === RecurrenceTypes.WEEKLY) {
      while (getDay(nextMonthDate) !== targetDay) {
        nextMonthDate = addDays(nextMonthDate, 1);
      }
    } else if (recurrencePattern === RecurrenceTypes.MONTHLY) {
      nextMonthDate = addMonths(prevMonth, 1);
    } else if (recurrencePattern === RecurrenceTypes.YEARLY) {
      nextMonthDate = addMonths(prevMonth, 12);
      setSelectedDates((prev) => [...prev, nextMonthDate]);
    } else if (recurrencePattern === RecurrenceTypes.CUSTOM) {
      nextMonthDate = addMonths(prevMonth, 1);

      const nextDates = generateCustomDates(nextMonthDate);
      setSelectedDates((prev) => [...prev, ...nextDates]);
    }

    setPrevMonth(nextMonthDate);

    // If not yearly or custom recurrence, generate regular recurring dates
    if (
      recurrencePattern !== RecurrenceTypes.YEARLY &&
      recurrencePattern !== RecurrenceTypes.CUSTOM
    ) {
      const newDates = generateDates(nextMonthDate, newMonth);
      setSelectedDates((prev) => [...prev, ...newDates]);
    }
  };
  useEffect(() => {
    if (recurrencePattern === RecurrenceTypes.CUSTOM) {
      console.log("custom recurrence");
      if (customRecurrence?.every && customRecurrence?.type) {
        setSelectedDates([]);
        setSelectedDates(generateCustomDates(startDate));
        setCurrentMonth(startOfMonth(startDate));
        setPrevMonth(startDate);
      }
      return;
    }

    if (startDate) {
      const nextDates = generateDates(startDate, currentMonth);
      setSelectedDates(nextDates);
      setCurrentMonth(startOfMonth(startDate));
      setPrevMonth(startDate);
    }
  }, [startDate, endDate, recurrencePattern, customRecurrence]);

  return (
    <div>
      <DayPicker
        mode="multiple"
        selected={selectedDates}
        onMonthChange={handleMonthChange}
        month={currentMonth}
        styles={{
          day_button: {
            pointerEvents: "none",
          },
        }}
      />
    </div>
  );
};

export default PreviewCalender;
