"use client";
import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import AdminStore from "@/mobx/AdminStore"; // Adjust path if needed
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Loader2,
  RefreshCw,
  Info,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge"; // Using Badge for status

const PatreonsPage = observer(() => {
  useEffect(() => {
    // Fetch patrons when the component mounts
    AdminStore.fetchPatrons().catch((error) => {
      console.error("Failed to load patrons on mount:", error);
      // Show error to user? Maybe set a state here.
    });
  }, []);

  const handleRefresh = () => {
    AdminStore.refreshAllPatrons();
  };

  const formatDate = (isoString) => {
    if (!isoString) return "-";
    try {
      return new Date(isoString).toLocaleString();
    } catch (e) {
      return "Invalid Date";
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "success";
      case "free":
        return "secondary";
      case "none":
        return "outline";
      default:
        return "destructive"; // For 'unknown' or errors
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Patreon Management</h1>
        <Button
          onClick={handleRefresh}
          disabled={AdminStore.loading.refreshingPatrons}
        >
          {AdminStore.loading.refreshingPatrons ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh All Statuses
            </>
          )}
        </Button>
      </div>

      {/* Refresh Status Area */}
      {AdminStore.refreshStatus.message && (
        <Alert
          className="mb-6"
          variant={AdminStore.refreshStatus.error ? "destructive" : "default"}
        >
          {AdminStore.refreshStatus.error ? (
            <AlertCircle className="h-4 w-4" />
          ) : (
            <Info className="h-4 w-4" />
          )}
          <AlertTitle>
            {AdminStore.refreshStatus.error
              ? "Refresh Failed"
              : "Refresh Status"}
          </AlertTitle>
          <AlertDescription>
            {AdminStore.refreshStatus.message}
            {AdminStore.refreshStatus.updatedCount > 0 &&
              ` Updated: ${AdminStore.refreshStatus.updatedCount}.`}
            {AdminStore.refreshStatus.failedCount > 0 &&
              ` Failed: ${AdminStore.refreshStatus.failedCount}.`}
            {AdminStore.refreshStatus.error &&
              ` Error: ${AdminStore.refreshStatus.error}`}
            {/* Optionally list failures */}
            {AdminStore.refreshStatus.failures &&
              AdminStore.refreshStatus.failures.length > 0 && (
                <ul className="mt-2 text-xs list-disc list-inside">
                  {AdminStore.refreshStatus.failures.map((fail) => (
                    <li key={fail.userId}>
                      {fail.name || fail.userId}: {fail.error}
                    </li>
                  ))}
                </ul>
              )}
          </AlertDescription>
        </Alert>
      )}

      {/* Patrons Table */}
      <h2 className="text-xl font-semibold mb-4">
        Connected Patrons ({AdminStore.patrons.length})
      </h2>
      {AdminStore.loading.patrons && !AdminStore.patrons.length ? (
        <div className="flex justify-center items-center p-10">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading patrons...</span>
        </div>
      ) : AdminStore.patrons.length === 0 && !AdminStore.loading.patrons ? (
        <p className="text-muted-foreground">
          No users have connected their Patreon account yet.
        </p>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Pledge Start</TableHead>
                <TableHead>Last Checked</TableHead>
                <TableHead>Patreon Raw Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {AdminStore.patrons.map((patron) => (
                <TableRow key={patron.userId}>
                  <TableCell className="font-medium">{patron.name}</TableCell>
                  <TableCell>{patron.email}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(patron.status)}>
                      {patron.status || "Unknown"}
                    </Badge>
                  </TableCell>
                  <TableCell>{patron.tier?.title || "-"}</TableCell>
                  <TableCell>{formatDate(patron.pledgeStartDate)}</TableCell>
                  <TableCell>{formatDate(patron.lastChecked)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {patron.patronStatusString || "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
});

export default PatreonsPage;
