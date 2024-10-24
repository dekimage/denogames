import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function DateRangeSelector({ value, onChange }) {
  const [isCustom, setIsCustom] = useState(false);
  const [customRange, setCustomRange] = useState({
    from: new Date(),
    to: new Date(),
  });

  const handleSelectChange = (newValue) => {
    if (newValue === "custom") {
      setIsCustom(true);
    } else {
      setIsCustom(false);
      onChange(newValue);
    }
  };

  const handleCustomRangeChange = (range) => {
    setCustomRange(range);
    if (range.from && range.to) {
      onChange(`${range.from.toISOString()} - ${range.to.toISOString()}`);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <Select onValueChange={handleSelectChange} defaultValue={value}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select time range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="week">This Week</SelectItem>
          <SelectItem value="month">This Month</SelectItem>
          <SelectItem value="year">This Year</SelectItem>
          <SelectItem value="custom">Custom Range</SelectItem>
        </SelectContent>
      </Select>
      {isCustom && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              {customRange.from
                ? customRange.from.toDateString()
                : "Pick a date"}{" "}
              - {customRange.to ? customRange.to.toDateString() : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={customRange}
              onSelect={handleCustomRangeChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
