import { useState } from "react";
import { Button } from "@/components/ui/button";
import { heroesCards } from "./data";
import Image from "next/image";
import { Eye, Download } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { BuildingCard } from "./page"; // Import the BuildingCard component
import { toast } from "@/components/ui/use-toast";

const MONSTER_COUNT = 39; // UPDATE WHEN PUT MONSTER
// Use the same image import logic
const heroImages = Object.fromEntries(
  Array.from({ length: MONSTER_COUNT }, (_, i) => [
    i + 1,
    require(`../../../../public/monstermixology/heroes/h${i + 1}.png`).default,
  ])
);

export const CustomizeCharacters = ({ onGenerateCustomPDF }) => {
  const [selectedHeroes, setSelectedHeroes] = useState([]);
  const [viewingCard, setViewingCard] = useState(null);

  const toggleHeroSelection = (hero) => {
    if (selectedHeroes.find((h) => h.id === hero.id)) {
      setSelectedHeroes((prev) => prev.filter((h) => h.id !== hero.id));
    } else if (selectedHeroes.length < 12) {
      setSelectedHeroes((prev) => [...prev, hero]);
    }
  };

  const openCardDetails = (e, hero) => {
    e.stopPropagation(); // Prevent triggering the parent's onClick
    setViewingCard(hero);
  };

  const handleDownloadRulebook = async (e, fileUrl) => {
    e.preventDefault();
    e.stopPropagation();

    if (!fileUrl) return;

    try {
      // Show loading toast
      const loadingToast = toast({
        title: "Downloading...",
        description: "Please wait while we prepare your download",
      });

      // Use our proxy API for the download
      const proxyUrl = `/api/download?url=${encodeURIComponent(fileUrl)}`;

      // Create an invisible iframe to trigger the download
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      document.body.appendChild(iframe);

      iframe.onload = () => {
        // Remove the iframe and loading toast after download starts
        setTimeout(() => {
          document.body.removeChild(iframe);
          loadingToast.dismiss();
        }, 1000);
      };

      // Navigate the iframe to our proxy URL to start download
      iframe.src = proxyUrl;
    } catch (error) {
      console.error("Download failed:", error);
      toast({
        title: "Download failed",
        description:
          "There was a problem downloading your file. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4 bg-card rounded-lg shadow-lg max-w-4xl mx-auto mb-4">
      <h2 className="text-2xl font-bold">Customize Characters</h2>

      {/* Character Grid */}
      <div className="grid grid-cols-5 gap-4 bg-muted/50 p-4 rounded-lg">
        {heroesCards.map((hero) => (
          <div key={hero.id} className="relative flex flex-col items-center">
            <div
              onClick={() => toggleHeroSelection(hero)}
              className={`relative cursor-pointer transition-all duration-200 transform ${
                selectedHeroes.find((h) => h.id === hero.id)
                  ? "ring-4 ring-primary scale-105"
                  : "hover:scale-105"
              }`}
            >
              <Image
                src={heroImages[hero.id]}
                alt={hero.name}
                width={125}
                height={125}
                className="rounded-lg object-cover border-2 border-border"
              />
              {selectedHeroes.find((h) => h.id === hero.id) && (
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold border-2 border-background">
                  {selectedHeroes.findIndex((h) => h.id === hero.id) + 1}
                </div>
              )}
            </div>

            {/* View button */}
            <div className="flex gap-1 mt-2 w-full">
              <Button
                variant="outline"
                size="sm"
                className="py-0 h-8 flex-1 text-xs"
                onClick={(e) => openCardDetails(e, hero)}
              >
                <Eye className="h-3 w-3 mr-1" /> View
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Characters Counter */}
      <div className="text-lg font-semibold">
        Chosen characters for play: {selectedHeroes.length}/12
      </div>

      {/* Selected Characters Preview */}
      <div className="grid grid-cols-4 gap-4 bg-muted/30 p-4 rounded-lg">
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={index}
            className={`relative ${
              selectedHeroes[index]
                ? ""
                : "border-2 border-dashed border-border w-[125px] h-[125px] rounded-lg"
            }`}
          >
            {selectedHeroes[index] && (
              <Image
                src={heroImages[selectedHeroes[index].id]}
                alt={selectedHeroes[index].name}
                width={125}
                height={125}
                className="rounded-lg object-cover"
              />
            )}
          </div>
        ))}
      </div>

      {/* Generate Button */}
      <div className="text-[13px] uppercase font-strike flex w-full justify-center mb-2 text-foreground">
        After you save your selection, you can download the PDF
      </div>
      <Button
        onClick={() => onGenerateCustomPDF(selectedHeroes.map((h) => h.id))}
        disabled={selectedHeroes.length !== 12}
        variant={selectedHeroes.length === 12 ? "default" : "secondary"}
        className="px-8 py-2 text-lg"
      >
        Save Selection({selectedHeroes.length}/12)
      </Button>

      {/* Card Details Dialog - Dark mode compatible */}
      <Dialog
        open={!!viewingCard}
        onOpenChange={(open) => !open && setViewingCard(null)}
      >
        <DialogContent className="sm:max-w-[425px] flex flex-col items-center bg-card border-border">
          <DialogTitle className="text-center text-foreground">
            {viewingCard?.name}
          </DialogTitle>
          <div className="py-4">
            {viewingCard && (
              <div className="relative bg-white rounded-lg p-4 w-[240px]">
                <BuildingCard
                  card={viewingCard}
                  paperSize="A4"
                  fromApp={true}
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
