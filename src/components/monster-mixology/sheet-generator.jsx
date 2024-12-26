import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import PrintableSheet, {
  generateMonsterMixologyPDF,
} from "@/app/mvp/monstermixology/page";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export const MonsterMixologyGenerator = ({
  paperSize,
  monsterConfig,
  configurations,
}) => {
  useEffect(() => {
    console.log("MonsterMixologyGenerator mounted with:", {
      paperSize,
      monsterConfig,
      configurations,
    });
  }, [paperSize, monsterConfig, configurations]);

  return (
    <div
      className="bg-white"
      style={{
        width: "1123px",
        height: "794px",
        position: "relative",
        border: "1px solid black", // For debugging
      }}
    >
      {/* Add some test content to verify rendering */}
      <div style={{ padding: "20px" }}>
        <h1>Monster Mixology Sheet</h1>
        <p>Paper Size: {paperSize}</p>
        <p>Monster Config: {monsterConfig}</p>
        {/* Your actual game content here */}
      </div>
    </div>
  );
};
