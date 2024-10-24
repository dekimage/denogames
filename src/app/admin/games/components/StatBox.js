import { Card, CardContent } from "@/components/ui/card";

export default function StatBox({ name, icon, value }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            {name}
          </span>
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="mt-2 text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
