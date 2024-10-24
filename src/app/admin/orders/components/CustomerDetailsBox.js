import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

export default function CustomerDetailsBox({ customer }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Email</p>
          <p>{customer.email}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Name</p>
          <p>{customer.name}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Customer ID
          </p>
          <p>{customer.id}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Joined</p>
          <p>
            {formatDistanceToNow(new Date(customer.joinedDate), {
              addSuffix: true,
            })}
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Tags</p>
          <div className="flex flex-wrap gap-2">
            {customer.tags.map((tag, index) => (
              <Badge key={index} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Level</p>
          <p>{customer.level}</p>
        </div>
        <Button variant="outline" className="w-full">
          View Customer Profile
        </Button>
      </CardContent>
    </Card>
  );
}
