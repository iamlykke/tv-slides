"use client";

import { useEffect, useState } from "react";

type Slide = {
  id: string;
  imageUrl: string;
  expiresAt: string;
  isHidden: boolean;
};

export default function SlideList({
  location,
  refreshToken,
}: {
  location: "ru" | "cy";
  refreshToken?: number; // меняем значение для триггера
}) {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlides = async () => {
      setLoading(true);
      const res = await fetch(`/api/slides/${location}`);
      const data = await res.json();
      setSlides(data);
      setLoading(false);
    };

    fetchSlides();
  }, [location, refreshToken]); // перезапуск при смене refreshToken

  if (loading) return <p>Загрузка...</p>;
  if (slides.length === 0) return <p>Нет слайдов</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      {slides.map((slide) => (
        <div key={slide.id} className="border rounded p-2">
          <img
            src={slide.imageUrl}
            alt="Слайд"
            className="w-full h-48 object-cover rounded"
          />
          <p className="text-sm mt-2">
            ⏳ до: {new Date(slide.expiresAt).toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">
            {slide.isHidden ? "🙈 Скрыт" : "✅ Показывается"}
          </p>
        </div>
      ))}
    </div>
  );
}
