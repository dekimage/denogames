"use client";

import Image from "next/image";
import { iconMapping, resourceColorMapping } from "../test/page";

const TrackerSheet = () => {
  const handlePrintTracker = () => {
    window.print();
  };

  const renderResourceRow = (resource, label) => {
    return (
      <tr key={resource}>
        <td className="p-1 w-16 h-16">
          <div
            className={`w-10 h-10 rounded-full ${resourceColorMapping[resource]} flex items-center justify-center m-auto`}
          >
            <Image
              src={`/${iconMapping[resource]}`}
              alt={label}
              width={32}
              height={32}
              className="w-8 h-8 object-contain"
            />
          </div>
        </td>
        {Array.from({ length: 10 }, (_, i) => (
          <td key={i} className="border p-2 text-xs relative w-12 h-12">
            <span className="absolute top-1 right-1 text-gray-500">
              {i + 1}
            </span>
          </td>
        ))}
      </tr>
    );
  };

  const renderFactionRow = (faction) => {
    return (
      <tr key={faction}>
        <td className="p-1 w-16 h-16">
          <div
            className={`w-10 h-10 rounded-full  flex items-center justify-center m-auto`}
            // bg-${faction}-500
          >
            <Image  
              src={`/builders-town/${faction}.jpeg`}
              alt={`${faction} faction`}
              width={32}
              height={32}
              className="w-8 h-8 object-contain rounded-full"
            />
          </div>
        </td>
        {Array.from({ length: 10 }, (_, i) => (
          <td key={i} className="border p-2 text-xs relative w-12 h-12">
            <span className="absolute top-1 right-1 text-gray-500">
              {i + 1}
            </span>
          </td>
        ))}
      </tr>
    );
  };

  return (
    <div className="p-4">
      <button
        onClick={handlePrintTracker}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 print:hidden"
      >
        Print Tracker
      </button>

      <table className="w-full table-auto border-collapse">
        {/* <thead>
          <tr>
            <th className="border p-2 w-16"></th>
            {Array.from({ length: 10 }, (_, i) => (
              <th key={i} className="border p-2 w-12">
                {i + 1}
              </th>
            ))}
          </tr>
        </thead> */}

        <tbody>
          <tr>
            <td
              colSpan="11"
              className="text-center font-bold p-1 bg-gray-200 text-xs"
            >
              Basic Goods
            </td>
          </tr>
          {renderResourceRow("wheat", "Wheat")}
          {renderResourceRow("fish", "Fish")}
          {renderResourceRow("water", "Water")}
          {renderResourceRow("meat", "Meat")}

          <tr>
            <td
              colSpan="11"
              className="text-center font-bold p-1 bg-gray-200 text-xs"
            >
              Materials
            </td>
          </tr>
          {renderResourceRow("steel", "Steel")}
          {renderResourceRow("wood", "Wood")}
          {renderResourceRow("bricks", "Bricks")}

          <tr>
            <td
              colSpan="11"
              className="text-center font-bold p-1 bg-gray-200 text-xs"
            >
              Gold
            </td>
          </tr>
          {renderResourceRow("gold", "Gold")}

          <tr>
            <td
              colSpan="11"
              className="text-center font-bold p-1 bg-gray-200 text-xs"
            >
              Factions
            </td>
          </tr>
          {renderFactionRow("red")}
          {renderFactionRow("blue")}
          {renderFactionRow("purple")}
          {renderFactionRow("yellow")}

          <tr>
            <td
              colSpan="11"
              className="text-center font-bold p-1 bg-gray-200 text-xs"
            >
              Victory Points (VP)
            </td>
          </tr>
          {[0, 1].map((rowIndex) => (
            <tr key={rowIndex}>
              {rowIndex === 0 ? (
                <td className="p-1 w-16 h-16">
                  <div className="w-10 h-10 rounded-full bg-yellow-200 flex items-center justify-center m-auto">
                 
                    VP
                  </div>
                </td>
              ) : (
                <td className="w-16"></td>
              )}
              {Array.from({ length: 10 }, (_, i) => (
                <td key={i} className="border p-2 text-xs relative w-12 h-12">
                  <span className="absolute top-1 right-1 text-gray-500">
                    {rowIndex * 10 + i + 1}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TrackerSheet;
