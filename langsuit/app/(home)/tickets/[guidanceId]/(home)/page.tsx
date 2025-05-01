"use client";
import { useEffect, useRef } from "react";
import SeatGrid from "../_components/SeatGrid";

export default function Counter() {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  }, []);

  const handleOnSeatSelect = (seat) => {
    console.log(`Selected seat: ${seat}`);
  };

  return (
    <div className="relative min-h-screen">
      <video
        ref={videoRef}
        autoPlay
        loop={true}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        onEnded={(e) => {
          e.target.play();
        }}
      >
        <source src="/BehindTheScenes.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="absolute inset-0 bg-black/70"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <SeatGrid
          rows={5}
          seatsPerRow={6}
          price={49.99}
          onSeatSelect={handleOnSeatSelect}
        />
      </div>
    </div>
  );
}
