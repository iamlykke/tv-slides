"use client";

import { useEffect, useState } from "react";

export type Slide = {
  id: string;
  imageUrl: string;
};

export function SlideShow({
  slides,
  loading,
}: {
  slides: Slide[];
  loading: boolean;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 15000);
    return () => clearInterval(interval);
  }, [slides]);

  if (loading) return "Loading...";
  if (slides.length === 0) return <div>No slides available</div>;

  return (
    <div className="w-screen h-screen overflow-hidden bg-black flex items-center justify-center">
      <img
        src={slides[index].imageUrl}
        alt="slide"
        className="w-full h-full object-cover transition-opacity duration-500"
      />
    </div>
  );
}
