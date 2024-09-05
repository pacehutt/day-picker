import { render, screen, fireEvent } from "@testing-library/react";
import { RepeatTypes } from "@/types/datepicker";
import { format } from "date-fns";
import Picker from "@/components/DatePicker/picker";

import "@testing-library/jest-dom";

// Mock data
const mockStartDate = new Date(2024, 8, 1); // Sept 1, 2024
const mockEndDate = new Date(2024, 8, 30); // Sept 30, 2024

describe("Picker Component", () => {
  let setStartDateMock: jest.Mock;
  let setEndDateMock: jest.Mock;

  beforeEach(() => {
    setStartDateMock = jest.fn();
    setEndDateMock = jest.fn();
  });

  test("renders Start Date input with correct value", () => {
    render(
      <Picker
        startDate={mockStartDate}
        endDate={null}
        repeat={RepeatTypes.CUSTOM} // Just using CUSTOM for this test
        setStartDate={setStartDateMock}
        setEndDate={setEndDateMock}
      />
    );

    const startDateInput = screen.getByTestId(/start-date/i);
    expect(startDateInput).toHaveValue(format(mockStartDate, "yyyy-MM-dd"));
  });

  test("calls setStartDate when Start Date is changed", () => {
    render(
      <Picker
        startDate={mockStartDate}
        endDate={null}
        repeat={RepeatTypes.CUSTOM}
        setStartDate={setStartDateMock}
        setEndDate={setEndDateMock}
      />
    );

    const newStartDate = "2024-10-01";
    const startDateInput = screen.getByTestId(/start-date/i);

    fireEvent.change(startDateInput, { target: { value: newStartDate } });
    expect(setStartDateMock).toHaveBeenCalledWith(new Date(newStartDate));
  });

  test("renders End Date input when RepeatType is CUSTOM", () => {
    render(
      <Picker
        startDate={mockStartDate}
        endDate={mockEndDate}
        repeat={RepeatTypes.CUSTOM}
        setStartDate={setStartDateMock}
        setEndDate={setEndDateMock}
      />
    );

    const endDateInput = screen.getByTestId(/end-date/i);
    expect(endDateInput).toBeInTheDocument();
    expect(endDateInput).toHaveValue(format(mockEndDate, "yyyy-MM-dd"));
  });

  test("does not render End Date input when RepeatType is ENDLESS", () => {
    render(
      <Picker
        startDate={mockStartDate}
        endDate={mockEndDate}
        repeat={RepeatTypes.ENDLESS}
        setStartDate={setStartDateMock}
        setEndDate={setEndDateMock}
      />
    );

    const endDateInput = screen.queryByLabelText(/end date/i);
    expect(endDateInput).not.toBeInTheDocument();
  });

  test("calls setEndDate when End Date is changed", () => {
    render(
      <Picker
        startDate={mockStartDate}
        endDate={mockEndDate}
        repeat={RepeatTypes.CUSTOM}
        setStartDate={setStartDateMock}
        setEndDate={setEndDateMock}
      />
    );

    const newEndDate = "2024-10-01";
    const endDateInput = screen.getByTestId(/end-date/i);

    fireEvent.change(endDateInput, { target: { value: newEndDate } });
    expect(setEndDateMock).toHaveBeenCalledWith(new Date(newEndDate));
  });
});
