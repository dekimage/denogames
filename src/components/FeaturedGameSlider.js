import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";

const FeaturedGamesSlider = ({ games }) => {
  const [state, setState] = useState({ currentSlide: 0, progress: 0 });
  const sliderRef = useRef(null);
  const intervalRef = useRef(null);

  const nextSlide = useCallback(() => {
    setState((prevState) => {
      const nextSlide = (prevState.currentSlide + 1) % games.length;

      return { currentSlide: nextSlide, progress: 0 };
    });
  }, [games.length]);

  const prevSlide = useCallback(() => {
    setState((prevState) => {
      const prevSlide =
        (prevState.currentSlide - 1 + games.length) % games.length;

      return { currentSlide: prevSlide, progress: 0 };
    });
  }, [games.length]);

  useEffect(() => {
    const updateProgress = () => {
      setState((prevState) => {
        const newProgress = prevState.progress + 1;
        if (newProgress >= 100) {
          const nextSlide = (prevState.currentSlide + 1) % games.length;
          return { currentSlide: nextSlide, progress: 0 };
        }
        return { ...prevState, progress: newProgress };
      });
    };

    intervalRef.current = setInterval(updateProgress, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [games.length]);

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.transform = `translateX(-${
        state.currentSlide * 100
      }%)`;
    }
  }, [state.currentSlide]);

  return (
    <div className="relative w-full h-[70vh] overflow-hidden">
      <div
        ref={sliderRef}
        className="flex h-full transition-transform duration-300 ease-out"
        style={{ width: `${games.length * 100}%` }}
      >
        {games.map((game, index) => (
          <div
            key={game.index || index}
            className="w-full h-full flex-shrink-0 relative"
          >
            <Image
              src={game.imgUrl}
              alt={game.title}
              width={1000}
              height={1000}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-start px-8">
              <div className="text-[70px] text-white font-bold mb-4 font-strike uppercase">
                {game.title}
              </div>
              <p className="text-xl text-white mb-6 font-strike ">
                {game.description}
              </p>
              <Link href={game.link}>
                <Button className="w-52 text-2xl">{game.button}</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Left Arrow */}
      <button
        onClick={prevSlide}
        className="absolute bottom-4 left-4 w-10 h-10 bg-white bg-opacity-50 rounded-full flex items-center justify-center hover:bg-opacity-75 transition-opacity"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path
            fillRule="evenodd"
            d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Right Arrow */}
      <button
        onClick={nextSlide}
        className="absolute bottom-4 right-4 w-10 h-10 bg-white bg-opacity-50 rounded-full flex items-center justify-center hover:bg-opacity-75 transition-opacity"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path
            fillRule="evenodd"
            d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {games.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              state.currentSlide === index ? "bg-white" : "bg-gray-400"
            }`}
            onClick={() => setState({ currentSlide: index, progress: 0 })}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-300 overflow-hidden">
        <div
          className="h-full transition-all duration-100 ease-linear relative"
          style={{
            width: `${state.progress}%`,
            background: "linear-gradient(to right, yellow, brown)",
          }}
        >
          <div
            className="absolute bottom-0 left-0 w-full h-full"
            style={{
              boxShadow: "0 4px 6px -1px rgba(255, 255, 0, 0.5)",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedGamesSlider;
