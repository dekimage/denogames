import { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Dummy data for the table
const dummyTableData = {
  "Total Sales": {
    columns: ["Date", "Sales", "Products Sold", "Average Sale"],
    data: [
      {
        Date: "2023-03-01",
        Sales: "$1,234",
        "Products Sold": 56,
        "Average Sale": "$22.04",
      },
      {
        Date: "2023-03-02",
        Sales: "$2,345",
        "Products Sold": 78,
        "Average Sale": "$30.06",
      },
      {
        Date: "2023-03-03",
        Sales: "$3,456",
        "Products Sold": 90,
        "Average Sale": "$38.40",
      },
    ],
  },
  "Total Orders": {
    columns: ["Hour", "Orders", "Average Units Ordered", "Average Order Value"],
    data: [
      {
        Hour: "09:00",
        Orders: 12,
        "Average Units Ordered": 2.5,
        "Average Order Value": "$45.00",
      },
      {
        Hour: "10:00",
        Orders: 18,
        "Average Units Ordered": 3.2,
        "Average Order Value": "$52.00",
      },
      {
        Hour: "11:00",
        Orders: 24,
        "Average Units Ordered": 2.8,
        "Average Order Value": "$48.00",
      },
    ],
  },
};

// Dummy function to simulate API call
const fetchDetailData = (statLabel) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(dummyTableData[statLabel] || { columns: [], data: [] });
    }, 1000);
  });
};

export const StatDetailView = observer(({ stat, onClose }) => {
  const [detailData, setDetailData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const data = await fetchDetailData(stat.label);
      setDetailData(data);
      setIsLoading(false);
    };
    loadData();
  }, [stat]);

  return (
    <Dialog open={!!stat} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{stat.label} Details</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {detailData.columns.map((column, index) => (
                  <TableHead key={index}>{column}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {detailData.data.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {detailData.columns.map((column, colIndex) => (
                    <TableCell key={colIndex}>{row[column]}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  );
});
