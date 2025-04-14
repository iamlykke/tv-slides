"use client";

import { use, useState } from "react";
import SlideUploader from "@/components/SlideUploader";
import SlideList from "@/components/SlideList";

export default function AdminPage({
  params,
}: {
  params: Promise<{ location: "ru" | "cy" }>;
}) {
  const location = use(params).location;
  const [refreshToken, setRefreshToken] = useState(Date.now());

  const refreshSlides = () => {
    setRefreshToken(Date.now()); // 🔁 триггер SlideList useEffect
  };

  return (
    <div className="p-4 container mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Добавить слайд для {location.toUpperCase()}
      </h1>
      <SlideUploader location={location} onUploaded={refreshSlides} />

      <h2 className="text-xl font-semibold mt-10 mb-2">Текущие слайды</h2>
      <SlideList location={location} refreshToken={refreshToken} />
    </div>
  );
}
