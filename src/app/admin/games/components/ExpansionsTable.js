import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ExpansionsTable({ expansions }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Expansions Purchased</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Sales</TableHead>
            <TableHead>% of Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expansions.map((expansion) => (
            <TableRow key={expansion.id}>
              <TableCell>
                <Image
                  src={expansion.image}
                  alt={expansion.name}
                  width={40}
                  height={40}
                  className="rounded-md"
                />
              </TableCell>
              <TableCell>{expansion.name}</TableCell>
              <TableCell>{expansion.sales}</TableCell>
              <TableCell>{expansion.percentage}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
