"use client";

import { Slide, SlideShow } from "@/components/SlideShow";
import { use, useEffect, useState } from "react";

export default function Location({
  params,
}: {
  params: Promise<{ location: "ru" | "cy" }>;
}) {
  const location = use(params).location;

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
  }, []);
  return <SlideShow slides={slides} loading={loading} />;
}
