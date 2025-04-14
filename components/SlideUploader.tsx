"use client";

import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";

type Props = {
  location: "ru" | "cy";
  onUploaded: () => void;
};

export default function SlideUploader({ location, onUploaded }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [expiresAt, setExpiresAt] = useState("");
  const [isHidden, setIsHidden] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file || !expiresAt) return;

    setUploading(true);

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${location}/${fileName}`;

    // Загрузка изображения
    const { error: uploadError } = await supabase.storage
      .from("slides")
      .upload(filePath, file);

    if (uploadError) {
      alert("Ошибка загрузки файла: " + uploadError.message);
      setUploading(false);
      return;
    }

    // Получаем публичный URL
    const { data: publicData } = supabase.storage
      .from("slides")
      .getPublicUrl(filePath);

    const publicUrl = publicData?.publicUrl;

    // Отправка POST-запроса
    const res = await fetch(`/api/slides/${location}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageUrl: publicUrl,
        expiresAt,
        isHidden,
        location,
      }),
    });

    if (res.ok) {
      alert("Слайд успешно добавлен!");
      setFile(null);
      setExpiresAt("");
      setIsHidden(false);

      onUploaded?.(); // вызов обновления после успешной загрузки
    }

    setUploading(false);
  };

  return (
    <div className="space-y-4 max-w-md">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <input
        type="datetime-local"
        value={expiresAt}
        onChange={(e) => setExpiresAt(e.target.value)}
        className="w-full border px-2 py-1 rounded"
      />
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={isHidden}
          onChange={(e) => setIsHidden(e.target.checked)}
        />
        Скрыть слайд
      </label>
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {uploading ? "Загрузка..." : "Добавить слайд"}
      </button>
    </div>
  );
}
