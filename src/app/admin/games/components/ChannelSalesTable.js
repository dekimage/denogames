import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ChannelSalesTable({ channelSales }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Channel Sales</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Channel</TableHead>
            <TableHead>Sales</TableHead>
            <TableHead>% of Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {channelSales.map((channel, index) => (
            <TableRow key={index}>
              <TableCell>{channel.channel}</TableCell>
              <TableCell>{channel.sales}</TableCell>
              <TableCell>{channel.percentage}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
