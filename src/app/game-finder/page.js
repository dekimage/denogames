"use client";

import React, { useState } from "react";

import {
  Users,
  Gamepad,
  Child,
  User,
  Handshake,
  Sword,
  Compass,
  Briefcase,
  Layers,
  Box,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const GameFinder = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [error, setError] = useState("");

  const questions = [
    {
      question: "Who are you playing with?",
      options: [
        { label: "Gamers", icon: <Gamepad /> },
        { label: "Non-gamers", icon: <Gamepad /> },
        { label: "Kids", icon: <Gamepad /> },
        { label: "Solo", icon: <Gamepad /> },
      ],
    },
    {
      question: "How do you want to do it?",
      options: [
        { label: "Work together", icon: <Gamepad /> },
        { label: "Compete against each other", icon: <Gamepad /> },
      ],
    },
    {
      question: "What's your style?",
      options: [
        { label: "Adventure", icon: <Gamepad /> },
        { label: "Duels", icon: <Gamepad /> },
        { label: "Worker placement", icon: <Gamepad /> },
        { label: "Deck builder", icon: <Gamepad /> },
        { label: "Euro-style", icon: <Gamepad /> },
      ],
    },
    {
      question: "Finding the perfect game for you...",
      options: [],
    },
  ];

  const handleOptionSelect = (option) => {
    setSelectedOptions({ ...selectedOptions, [currentStep]: option });
    setError("");
  };

  const handleNext = () => {
    if (currentStep < 4 && selectedOptions[currentStep]) {
      setCurrentStep(currentStep + 1);
      setError("");
    } else if (currentStep < 4) {
      setError("Please select at least one option");
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError(""); // Clear the error message
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-center mb-8 font-strike uppercase">
        Game Finder Tool
      </h1>

      {/* Progress Bar */}
      <div className="flex mb-8 w-[80%]">
        {questions.map((step, index) => (
          <div
            key={index}
            className={`flex items-center ${
              index === questions.length - 1 ? "" : "flex-1"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                index < currentStep
                  ? "bg-primary text-white"
                  : "bg-blacky text-white"
              }`}
            >
              {index + 1}
            </div>
            {index < questions.length - 1 && (
              <div
                className={`h-1 ${
                  index < currentStep - 1 ? "bg-primary" : "bg-blacky"
                } flex-grow`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Question */}
      <div className="text-2xl font-strike uppercase text-center mt-4 md:mt-16 mb-12">
        {questions[currentStep - 1].question}
      </div>

      {/* Options */}
      <div className="flex md:flex-row flex-col justify-center gap-4 mb-8 w-full">
        {questions[currentStep - 1].options.map((option, index) => (
          <div
            key={index}
            className={`  ${
              selectedOptions[currentStep]?.label === option.label
                ? "bg-primary text-white"
                : "bg-white text-black"
            }`}
            onClick={() => handleOptionSelect(option)}
          >
            <div className="box-shadow w-full">
              <div className="box-combined p-[48px] md:w-[200px] h-[50px] md:h-[200px] w-full flex md:flex-col flex-row gap-4 cursor-pointer items-center justify-center">
                {option.icon}
                <div className="text-md font-strike uppercase text-center">
                  {option.label}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-red-500 font-semibold mb-4 text-center">
          {error}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between gap-4">
        <Button
          variant="reverse"
          className="flex items-center w-[120px]"
          onClick={handlePrevious}
          // disabled={currentStep === 1}
        >
          <ChevronLeft className="mr-2" />
          Previous
        </Button>
        <Button
          variant="reverse"
          className={`flex items-center w-[100px] `}
          // ${!selectedOptions[currentStep] ? "text-gray-400" : "text-primary"}

          onClick={handleNext}
          // disabled={!selectedOptions[currentStep]}
        >
          Next
          <ChevronRight className="ml-2" />
        </Button>
      </div>

      {/* Results Section (only show when all steps are completed) */}
      {currentStep === 4 && (
        <div className="mt-8">
          <h2 className="text-2xl font-strike uppercase mb-4">
            Recommended Games
          </h2>
          {/* Add game recommendations here */}
          <div className="flex justify-center space-x-4 mt-8">
            <Button>Add all to cart</Button>
            <Button variant="reverse" onClick={() => setCurrentStep(1)}>
              Start again
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameFinder;
