"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ChevronUp, ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function DeliveryPage() {
  const [csvData, setCsvData] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [processingStatus, setProcessingStatus] = useState({
    total: 0,
    processed: 0,
    matched: 0,
  });
  const [backers, setBackers] = useState([]);
  const [backersLoading, setBackersLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const [filters, setFilters] = useState({
    status: "all", // 'all', 'claimed', 'unclaimed'
    productId: "",
    email: "",
    source: "all",
    campaignName: "",
  });
  const [sorting, setSorting] = useState({
    field: "email",
    direction: "asc", // or 'desc'
  });

  useEffect(() => {
    fetchBackers();
  }, [currentPage, filters, sorting]);

  const fetchBackers = async () => {
    setBackersLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        ...filters,
        sortField: sorting.field,
        sortDirection: sorting.direction,
      });

      const response = await fetch(`/api/admin/backers?${queryParams}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      setBackers(data.backers);
      setTotalPages(Math.ceil(data.total / ITEMS_PER_PAGE));
    } catch (err) {
      setError("Failed to fetch backers: " + err.message);
    } finally {
      setBackersLoading(false);
    }
  };

  const handleFileUpload = (event) => {
    setError(null);
    setSuccess(null);
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target.result;
          const rows = text.split("\n");
          const headers = rows[0].split(",").map((header) => header.trim());

          const parsedData = rows
            .slice(1)
            .map((row) => {
              const values = row.split(",").map((value) => value.trim());
              const rowData = {};
              headers.forEach((header, index) => {
                if (header === "productIds") {
                  rowData[header] = values[index]
                    .split(";")
                    .map((id) => id.trim());
                } else {
                  rowData[header] = values[index];
                }
              });
              rowData.uniqueCode = generateUniqueCode();
              rowData.isClaimed = false;
              return rowData;
            })
            .filter((row) => row.email); // Filter out empty rows

          setCsvData(parsedData);
          setPreviewData(parsedData.slice(0, 5)); // Show first 5 rows in preview
          setSuccess("CSV file parsed successfully!");
        } catch (err) {
          setError("Error parsing CSV file. Please check the format.");
          console.error(err);
        }
      };
      reader.readAsText(file);
    }
  };

  const generateUniqueCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return Array.from({ length: 6 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join("");
  };

  const uploadToFirestore = async () => {
    if (!csvData) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/admin/backers/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ backers: csvData }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      setSuccess("Data uploaded to Firestore successfully!");
      refreshBackers();
      setProcessingStatus({
        total: csvData.length,
        processed: data.processed,
        uploaded: data.uploaded,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const matchUsers = async () => {
    if (!csvData) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/admin/backers/match", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      setSuccess(`Matched ${data.matched} users with backers!`);
      refreshBackers();
      setProcessingStatus((prev) => ({
        ...prev,
        matched: data.matched,
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshBackers = () => {
    setCurrentPage(1);
    fetchBackers();
  };

  const handleSort = (field) => {
    setSorting((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "-";
    try {
      // Get the date object regardless of timestamp type
      const date = timestamp._seconds
        ? new Date(timestamp._seconds * 1000)
        : timestamp.seconds
        ? new Date(timestamp.seconds * 1000)
        : new Date(timestamp);

      // Return if invalid date
      if (!(date instanceof Date) || isNaN(date)) return "-";

      // Get day with ordinal indicator
      const day = date.getDate();
      const ordinal = (day) => {
        if (day > 3 && day < 21) return "th";
        switch (day % 10) {
          case 1:
            return "st";
          case 2:
            return "nd";
          case 3:
            return "rd";
          default:
            return "th";
        }
      };

      // Format: "January 21st 2024"
      return date
        .toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
        .replace(/(\d+)/, `$1${ordinal(day)}`);
    } catch (error) {
      console.log("Date error:", error, "timestamp:", timestamp);
      return "-";
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Delivery Management</h1>

      <div className="mb-8">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="mb-4"
        />

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {previewData.length > 0 && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">
              Preview (First 5 rows)
            </h2>
            <Table>
              <TableHeader>
                <TableRow>
                  {Object.keys(previewData[0]).map((header) => (
                    <TableHead key={header}>{header}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {previewData.map((row, index) => (
                  <TableRow key={index}>
                    {Object.values(row).map((value, i) => (
                      <TableCell key={i}>
                        {Array.isArray(value) ? value.join(", ") : value}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="flex gap-4">
          <Button onClick={uploadToFirestore} disabled={!csvData || loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload to Firestore"
            )}
          </Button>

          <Button onClick={matchUsers} disabled={!csvData || loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Matching...
              </>
            ) : (
              "Match Users"
            )}
          </Button>
        </div>

        {processingStatus.total > 0 && (
          <div className="mt-4">
            <p>Total records: {processingStatus.total}</p>
            <p>Processed: {processingStatus.processed}</p>
            <p>Matched users: {processingStatus.matched}</p>
          </div>
        )}
      </div>

      <div className="mb-4 flex gap-4 flex-wrap">
        <Select
          value={filters.status}
          onValueChange={(value) =>
            setFilters((prev) => ({ ...prev, status: value }))
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="claimed">Claimed</SelectItem>
            <SelectItem value="unclaimed">Unclaimed</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.source}
          onValueChange={(value) =>
            setFilters((prev) => ({ ...prev, source: value }))
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            <SelectItem value="kickstarter">Kickstarter</SelectItem>
            <SelectItem value="gamefound">Gamefound</SelectItem>
            <SelectItem value="backerkit">Backerkit</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="Filter by campaign"
          value={filters.campaignName}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, campaignName: e.target.value }))
          }
          className="w-[200px]"
        />

        <Input
          placeholder="Filter by product ID"
          value={filters.productId}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, productId: e.target.value }))
          }
          className="w-[200px]"
        />

        <Input
          placeholder="Filter by email"
          value={filters.email}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, email: e.target.value }))
          }
          className="w-[200px]"
        />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">All Backers</h2>
        {backersLoading ? (
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    onClick={() => handleSort("email")}
                    className="cursor-pointer"
                  >
                    Email{" "}
                    {sorting.field === "email" &&
                      (sorting.direction === "asc" ? (
                        <ChevronUp className="inline" />
                      ) : (
                        <ChevronDown className="inline" />
                      ))}
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort("campaignName")}
                    className="cursor-pointer"
                  >
                    Campaign{" "}
                    {sorting.field === "campaignName" &&
                      (sorting.direction === "asc" ? (
                        <ChevronUp className="inline" />
                      ) : (
                        <ChevronDown className="inline" />
                      ))}
                  </TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead
                    onClick={() => handleSort("source")}
                    className="cursor-pointer"
                  >
                    Source{" "}
                    {sorting.field === "source" &&
                      (sorting.direction === "asc" ? (
                        <ChevronUp className="inline" />
                      ) : (
                        <ChevronDown className="inline" />
                      ))}
                  </TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead
                    onClick={() => handleSort("isClaimed")}
                    className="cursor-pointer"
                  >
                    Status{" "}
                    {sorting.field === "isClaimed" &&
                      (sorting.direction === "asc" ? (
                        <ChevronUp className="inline" />
                      ) : (
                        <ChevronDown className="inline" />
                      ))}
                  </TableHead>
                  <TableHead>Claimed By</TableHead>
                  <TableHead
                    onClick={() => handleSort("claimedAt")}
                    className="cursor-pointer"
                  >
                    Claimed At{" "}
                    {sorting.field === "claimedAt" &&
                      (sorting.direction === "asc" ? (
                        <ChevronUp className="inline" />
                      ) : (
                        <ChevronDown className="inline" />
                      ))}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {backers.map((backer) => (
                  <TableRow key={backer.id}>
                    <TableCell>{backer.email}</TableCell>
                    <TableCell>{backer.campaignName || "-"}</TableCell>
                    <TableCell>
                      {Array.isArray(backer.productIds)
                        ? backer.productIds.join(", ")
                        : backer.productIds}
                    </TableCell>
                    <TableCell>{backer.source}</TableCell>
                    <TableCell>{backer.uniqueCode}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          backer.isClaimed
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {backer.isClaimed ? "Claimed" : "Unclaimed"}
                      </span>
                    </TableCell>
                    <TableCell>{backer.claimedBy || "-"}</TableCell>
                    <TableCell>{formatDate(backer.claimedAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex justify-center gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="py-2">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
