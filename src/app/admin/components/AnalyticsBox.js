import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function AnalyticsBox({ stat, onClick }) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          <span
            className="hover:text-blue-600 hover:underline cursor-pointer"
            onClick={onClick}
          >
            {stat.label}
          </span>
        </CardTitle>
        <stat.icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stat.total}</div>
        <p className="text-xs text-muted-foreground">
          {stat.increase > 0 ? "+" : ""}
          {stat.increase}% from last period
        </p>
        <Button variant="outline" size="sm" className="mt-4" onClick={onClick}>
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}
