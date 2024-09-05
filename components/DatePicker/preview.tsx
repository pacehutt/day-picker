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
} from "date-fns";
import { FrequencyTypes, RecurrenceTypes } from "@/types/datepicker";
import "react-day-picker/style.css";

interface CustomRecurrence {
  every: number;
  type: string;
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

  const generateCustomDates = (currentDate: Date) => {
    if (!(customRecurrence?.every && customRecurrence?.type)) {
      return [];
    }

    const { every, type } = customRecurrence || {};
    const dates = [];
    let lastDate = currentDate;
    if (
      selectedDates.length > 0 &&
      isAfter(currentDate, selectedDates[selectedDates.length - 1])
    ) {
      lastDate = addDays(selectedDates[selectedDates.length - 1], every);
    }

    const lastOfMonth = endOfMonth(currentDate);
    console.log("Current Date", lastDate);

    while (isBefore(lastDate, lastOfMonth)) {
      switch (type) {
        case FrequencyTypes.DAY:
          dates.push(new Date(lastDate));
          lastDate = add(lastDate, { days: every });
          break;
        case FrequencyTypes.WEEK:
          dates.push(new Date(lastDate));
          lastDate = addWeeks(lastDate, every);
          break;
        case FrequencyTypes.MONTH:
          if (lastDate.getDate() <= getDaysInMonth(lastDate)) {
            dates.push(new Date(lastDate));
          }
          lastDate = addMonths(lastDate, every);
          break;
        case FrequencyTypes.YEAR:
          dates.push(new Date(lastDate));
          lastDate = addYears(lastDate, every);
          break;
      }
    }

    console.log("dates", dates);
    return dates;
  };

  const generateDates = (targetDate: Date, currentMonth: Date) => {
    const dates: Date[] = [];
    let currentDate = new Date(targetDate);

    if (isBefore(currentDate, startDate)) {
      return [];
    }

    // run until the current date is in the same month as the current month or the end date is reached
    while (
      isSameMonth(currentDate, currentMonth) &&
      (!endDate ||
        isBefore(currentDate, endDate) ||
        isSameDay(currentDate, endDate))
    ) {
      if (recurrencePattern === "DAILY") {
        dates.push(new Date(currentDate));
        currentDate = add(currentDate, { days: 1 });
      } else if (recurrencePattern === "WEEKLY") {
        if (getDay(currentDate) === getDay(targetDate)) {
          dates.push(new Date(currentDate));
        }
        currentDate = add(currentDate, { days: 1 });
      } else if (recurrencePattern === "MONTHLY") {
        if (
          currentDate.getDate() === targetDate.getDate() &&
          currentDate.getDate() <= getDaysInMonth(currentDate)
        ) {
          dates.push(new Date(currentDate));
        }
        currentDate = add(currentDate, { days: 1 });
      } else if (recurrencePattern === "YEARLY") {
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

  const handleMonthChange = (newMonth: Date) => {
    if (
      isBefore(newMonth, prevMonth) ||
      (endDate && isAfter(newMonth, endDate))
    ) {
      return;
    }

    const targetDay = getDay(startDate); // Extract the day of the week from startDate
    let nextMonthDate = startOfMonth(newMonth);

    if (recurrencePattern === RecurrenceTypes.WEEKLY)
      while (getDay(nextMonthDate) !== targetDay) {
        nextMonthDate = addDays(nextMonthDate, 1);
      }
    else if (recurrencePattern === RecurrenceTypes.MONTHLY) {
      nextMonthDate = addMonths(prevMonth, 1);
    } else if (recurrencePattern === RecurrenceTypes.YEARLY) {
      nextMonthDate = addMonths(prevMonth, 12);
      setSelectedDates((prev) => [...prev, nextMonthDate]);
    } else if (recurrencePattern === RecurrenceTypes.CUSTOM) {
      nextMonthDate = addMonths(prevMonth, 1);

      console.log("next month date", nextMonthDate);
      const nextDates = generateCustomDates(nextMonthDate);
      setSelectedDates((prev) => [...prev, ...nextDates]);
    }

    setPrevMonth(nextMonthDate);

    if (
      recurrencePattern !== RecurrenceTypes.YEARLY &&
      recurrencePattern !== RecurrenceTypes.CUSTOM
    ) {
      const newDates = generateDates(nextMonthDate, newMonth);
      setSelectedDates((prev) => [...prev, ...newDates]);
      console.log("selected dates inside change month", selectedDates);
    }
  };

  useEffect(() => {
    if (recurrencePattern === RecurrenceTypes.CUSTOM) {
      console.log("custom recurrence");
      if (customRecurrence?.every && customRecurrence?.type) {
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
