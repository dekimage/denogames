"use client";

import Image from "next/image";
import { useState } from "react";

const data = [
  {
    id: 1,
    title: "Delivery System",
    image: "https://via.placeholder.com/150",
    progress: 75,
    url: "#",
    details: ["Download Variants", "Get as PDF", "Requires Email Logged in"],
  },
  {
    id: 2,
    title: "Lead Magnet Engine",
    image: "https://via.placeholder.com/150",
    progress: 50,
    url: "#",
    details: [
      "Create a Single Page Funnel",
      "Trackable analytics",
      "Integrated with single PDF Download",
    ],
  },
  {
    id: 3,
    title: "Kickstarter Engine Builder",
    image: "https://via.placeholder.com/150",
    progress: 90,
    url: "#",
    details: [
      "Reusable Content Blocks",
      "Easy Theme Swapping",
      "Quality Template",
    ],
  },
  {
    id: 4,
    title: "CRM Engine",
    image: "https://via.placeholder.com/150",
    progress: 100,
    url: "#",
    details: ["Track every Customer", "Automated Actions", "Assitant AI"],
  },
  {
    id: 5,
    title: "MVP Game Factory",
    image: "https://via.placeholder.com/150",
    progress: 100,
    url: "#",
    details: [
      "Icons Renderer",
      "Layout Design Maker",
      "Deck Drawing and Rendering",
      "Rulebooks Crafter",
    ],
  },
  {
    id: 5,
    title: "App Engine",
    image: "https://via.placeholder.com/150",
    progress: 100,
    url: "#",
    details: ["Deck Builder", "Drafting", "Flip", "Push your Luck", "Lootbox"],
  },
];

const activities = [
  {
    id: 1,
    title: "Watch How to play videos",
    image: "https://via.placeholder.com/150",
    url: "#",
  },
  {
    id: 2,
    title: "Watch Gameplay Videos",
    image: "https://via.placeholder.com/150",
    url: "#",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Card Grid</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data.map((item) => (
          <Card key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

function Card({ item }) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <Image
        width={300}
        height={300}
        src={item.image}
        alt={item.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
        <div className="relative h-2 rounded-full bg-gray-200 mb-4">
          <div
            className="absolute h-full rounded-full"
            style={{ width: `${item.progress}%` }}
          >
            {item.progress}%
          </div>
        </div>

        <ul className="list-disc pl-6 text-gray-700">
          {item.details.map((detail, index) => (
            <li key={index}>{detail}</li>
          ))}
        </ul>

        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 block text-center bg-black text-white px-4 py-2 rounded-md "
        >
          Go to Link
        </a>
      </div>
    </div>
  );
}
