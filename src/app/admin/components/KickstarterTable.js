import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function KickstarterTable({ kickstarterInfo }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Kickstarter Campaigns</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-2 text-sm">
          Backer: {kickstarterInfo.isBacker ? "Yes" : "No"}
        </p>
        {kickstarterInfo.isBacker && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Campaign</TableHead>
                <TableHead className="text-xs">Total Spent</TableHead>
                <TableHead className="text-xs">Tier</TableHead>
                <TableHead className="text-xs">Game</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {kickstarterInfo.backedCampaigns.map((campaign, index) => (
                <TableRow key={index}>
                  <TableCell className="text-xs">
                    <a
                      href={campaign.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {campaign.id}
                    </a>
                  </TableCell>
                  <TableCell className="text-xs">
                    ${campaign.totalSpent}
                  </TableCell>
                  <TableCell className="text-xs">
                    {campaign.tierBacked}
                  </TableCell>
                  <TableCell className="text-xs">{campaign.game}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
