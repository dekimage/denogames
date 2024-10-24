import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  DollarSign,
  Banknote,
  Trophy,
  Star,
  BookOpen,
  Download,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import StatBox from "./StatBox";
import ChannelSalesTable from "./ChannelSalesTable";
import ExpansionsTable from "./ExpansionsTable";
import ReviewsTable from "./ReviewsTable";

export default function GameDetails({ game, onNextGame, onPreviousGame }) {
  return (
    <Card className="mt-6">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center space-x-4">
            <Image
              src={game.image}
              alt={game.name}
              width={100}
              height={100}
              className="rounded-md"
            />
            <h2 className="text-2xl font-bold">{game.name}</h2>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" onClick={onPreviousGame}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={onNextGame}>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          <StatBox
            name="Sold"
            icon={<DollarSign className="h-5 w-5" />}
            value={game.soldCopies.toLocaleString()}
          />
          <StatBox
            name="Total Sales"
            icon={<Banknote className="h-5 w-5" />}
            value={`$${game.totalSales.toLocaleString()}`}
          />
          <StatBox
            name="Popularity"
            icon={<Trophy className="h-5 w-5" />}
            value={`${game.popularity}rd`}
          />
          <StatBox
            name="Average Rating"
            icon={<Star className="h-5 w-5" />}
            value={game.averageRating.toFixed(1)}
          />
          <StatBox
            name="Rulebook Downloads"
            icon={<BookOpen className="h-5 w-5" />}
            value={game.rulebookDownloads.toLocaleString()}
          />
          <StatBox
            name="Downloads"
            icon={<Download className="h-5 w-5" />}
            value={game.downloads.toLocaleString()}
          />
          <StatBox
            name="Released"
            icon={<Calendar className="h-5 w-5" />}
            value={new Date(game.releaseDate).toLocaleDateString()}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <ChannelSalesTable channelSales={game.channelSales} />
          <ExpansionsTable expansions={game.expansions} />
        </div>

        <div className="mt-6">
          <ReviewsTable reviews={game.reviews} />
        </div>
      </CardContent>
    </Card>
  );
}
