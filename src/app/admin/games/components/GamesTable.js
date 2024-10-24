import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function GamesTable({ games, onGameClick }) {
  return (
    <Table className="w-full bg-white">
      <TableHeader>
        <TableRow>
          <TableHead>Image</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Sold Copies</TableHead>
          <TableHead>Total Sales</TableHead>
          <TableHead>Channel</TableHead>
          <TableHead>Downloads</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {games.map((game) => (
          <TableRow
            key={game.id}
            onClick={() => onGameClick(game)}
            className="cursor-pointer hover:bg-muted/50"
          >
            <TableCell>
              <Image
                src={game.image}
                alt={game.name}
                width={50}
                height={50}
                className="rounded-md"
              />
            </TableCell>
            <TableCell className="font-medium">{game.name}</TableCell>
            <TableCell>{game.type}</TableCell>
            <TableCell>{game.soldCopies.toLocaleString()}</TableCell>
            <TableCell>${game.totalSales.toLocaleString()}</TableCell>
            <TableCell>{game.channel}</TableCell>
            <TableCell>{game.downloads.toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
