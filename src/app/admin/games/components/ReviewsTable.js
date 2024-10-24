import { Star } from "lucide-react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ReviewsTable({ reviews }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Reviews</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Message</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews.map((review, index) => (
            <TableRow key={index}>
              <TableCell>
                <Link
                  href={`/admin/customers/${review.customerId}`}
                  className="text-blue-600 hover:underline"
                >
                  {review.customer}
                </Link>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  {review.rating}
                  <Star className="h-4 w-4 ml-1 text-yellow-400 fill-current" />
                </div>
              </TableCell>
              <TableCell>{review.message}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
