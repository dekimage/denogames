"use client";

import { useState } from "react";
import { observer } from "mobx-react-lite";
import { AnalyticsBox } from "./components/AnalyticsBox";
import { DateRangeSelector } from "./components/DateRangeSelector";
import { StatDetailView } from "./components/StatDetailView";
import {
  DollarSign,
  ShoppingCart,
  Users,
  CreditCard,
  TrendingUp,
  BarChart,
} from "lucide-react";

// Dummy data for analytics boxes
const analyticsData = [
  {
    id: 1,
    label: "Total Sales",
    total: "$284",
    increase: 24,
    icon: DollarSign,
  },
  {
    id: 2,
    label: "Total Orders",
    total: "75",
    increase: 18,
    icon: ShoppingCart,
  },
  { id: 3, label: "New Customers", total: "54", increase: 12, icon: Users },
  {
    id: 4,
    label: "Average Order Value",
    total: "$120",
    increase: 8,
    icon: CreditCard,
  },
  {
    id: 5,
    label: "Conversion Rate",
    total: "3.2%",
    increase: 5,
    icon: TrendingUp,
  },
  {
    id: 6,
    label: "Revenue per Visit",
    total: "$2.50",
    increase: 15,
    icon: BarChart,
  },
];

// Dummy function to simulate data fetching
const fetchData = (dateRange) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(analyticsData);
    }, 1000);
  });
};

const Dashboard = observer(() => {
  const [selectedDateRange, setSelectedDateRange] = useState("today");
  const [selectedStat, setSelectedStat] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDateRangeChange = async (newRange) => {
    setSelectedDateRange(newRange);
    setIsLoading(true);
    await fetchData(newRange);
    setIsLoading(false);
  };

  const handleStatClick = (stat) => {
    setSelectedStat(stat);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
      <DateRangeSelector
        value={selectedDateRange}
        onChange={handleDateRangeChange}
      />
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {analyticsData.map((stat) => (
            <AnalyticsBox
              key={stat.id}
              stat={stat}
              onClick={() => handleStatClick(stat)}
            />
          ))}
        </div>
      )}
      {selectedStat && (
        <StatDetailView
          stat={selectedStat}
          onClose={() => setSelectedStat(null)}
        />
      )}
    </div>
  );
});

export default Dashboard;
