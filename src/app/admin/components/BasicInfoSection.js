import { useState } from "react";
import { ChevronDown, ChevronUp, Mail, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BasicInfoSection({ basicInfo, customer }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState(basicInfo.notes);

  return (
    // <Card className="w-full">
    //   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    //     <CardTitle className="text-xl font-bold">Basic Info</CardTitle>
    //     <Button variant="ghost" onClick={() => setIsExpanded(!isExpanded)}>
    //       {isExpanded ? (
    //         <ChevronUp className="h-4 w-4" />
    //       ) : (
    //         <ChevronDown className="h-4 w-4" />
    //       )}
    //     </Button>
    //   </CardHeader>
    //   {isExpanded && (
    //     <CardContent>

    //     </CardContent>
    //   )}
    // </Card>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Account & Contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-1">Email</h3>
            <p>{basicInfo.email.address}</p>
            <p className="text-xs">
              Subscribed: {basicInfo.email.isSubscribed ? "Yes" : "No"}
            </p>
            <Button variant="outline" size="sm" className="mt-1">
              <Mail className="mr-1 h-3 w-3" />
              Send Email
            </Button>
          </div>

          <div>
            <h3 className="font-semibold mb-1">Discord</h3>
            <p>Member: {basicInfo.discord.isMember ? "Yes" : "No"}</p>
            {basicInfo.discord.isMember && (
              <p className="text-xs">
                {basicInfo.discord.username}#{basicInfo.discord.tag}
              </p>
            )}
            <Button variant="outline" size="sm" className="mt-1">
              Open Discord DM
            </Button>
          </div>

          <div>
            <h3 className="font-semibold mb-1">Instagram</h3>
            <p>{basicInfo.instagram.username || "N/A"}</p>
            {basicInfo.instagram.username && (
              <Button variant="outline" size="sm" className="mt-1">
                Open Instagram DM
              </Button>
            )}
          </div>

          <div>
            <h3 className="font-semibold mb-1">Account Status</h3>
            <Badge
              variant={
                customer?.accountStatus === "active"
                  ? "success"
                  : customer?.accountStatus === "inactive"
                  ? "secondary"
                  : "destructive"
              }
            >
              {customer?.accountStatus || "Unknown"}
            </Badge>
          </div>

          <div>
            <h3 className="font-semibold mb-1">Last Login</h3>
            <p className="text-xs">
              {customer?.lastLogin
                ? formatDistanceToNow(customer.lastLogin, {
                    addSuffix: true,
                  })
                : "N/A"}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-1">Linked Accounts</h3>
            <p className="text-xs">
              Google Account:{" "}
              {customer?.hasGoogleAccountLinked ? (
                <Badge variant="success">Linked</Badge>
              ) : (
                <Badge variant="secondary">Not Linked</Badge>
              )}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Customer Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-1 text-xs">Level & XP</h3>
            <p className="text-2xl font-bold mb-1">Level {basicInfo.level}</p>
            <div className="flex items-center space-x-2">
              <Progress
                value={(basicInfo.xp.current / basicInfo.xp.max) * 100}
                className="w-full h-2"
              />
              <span className="text-xs">
                {basicInfo.xp.current}/{basicInfo.xp.max} XP
              </span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-1 text-xs">Customer Value</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs mb-1">Lifetime Value</p>
                <p className="text-xl font-bold">
                  ${customer?.lifetimeValue?.toFixed(2) || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs mb-1">Avg Order Value</p>
                <p className="text-xl font-bold">
                  ${customer?.averageOrderValue?.toFixed(2) || "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-1 text-xs">Login Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs mb-1">Logins</p>
                <p className="text-xl font-bold">
                  {customer?.loginsCount || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs mb-1">Logouts</p>
                <p className="text-xl font-bold">
                  {customer?.logoutsCount || "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-1 text-xs">Notes</h3>
            <div className="flex justify-between items-center mb-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingNotes(!isEditingNotes)}
              >
                <Edit className="h-3 w-3 mr-1" />
                {isEditingNotes ? "Save" : "Edit"}
              </Button>
            </div>
            {isEditingNotes ? (
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full text-xs"
              />
            ) : (
              <p className="text-xs">{notes || "No notes available."}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
