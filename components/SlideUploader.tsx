"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

type Props = {
  location: "ru" | "cy";
  onUploaded?: () => void;
};

type FormValues = {
  file: FileList;
  expiresAt: string;
  isHidden: boolean;
};

export default function SlideUploader({ location, onUploaded }: Props) {
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    const file = data.file?.[0];
    if (!file || !data.expiresAt) return;

    setUploading(true);

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${location}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("slides")
      .upload(filePath, file);

    if (uploadError) {
      alert("Ошибка загрузки файла: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: publicData } = supabase.storage
      .from("slides")
      .getPublicUrl(filePath);

    const publicUrl = publicData?.publicUrl;

    const res = await fetch(`/api/slides/${location}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageUrl: publicUrl,
        expiresAt: data.expiresAt,
        isHidden: data.isHidden,
      }),
    });

    if (res.ok) {
      alert("Слайд успешно добавлен!");
      reset();
      onUploaded?.();
    }

    setUploading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
      <div>
        <input
          type="file"
          accept="image/*"
          {...register("file", { required: true })}
        />
        {errors.file && <p className="text-red-500 text-sm">Выберите файл</p>}
      </div>

      <div>
        <input
          type="datetime-local"
          {...register("expiresAt", { required: true })}
          className="w-full border px-2 py-1 rounded"
        />
        {errors.expiresAt && (
          <p className="text-red-500 text-sm">Укажите дату окончания</p>
        )}
      </div>

      <label className="flex items-center gap-2">
        <input type="checkbox" {...register("isHidden")} />
        Скрыть слайд
      </label>

      <button
        type="submit"
        disabled={uploading}
        className="bg-blue-500 text-white px-4 py-2 pointer w-full rounded hover:bg-blue-600"
      >
        {uploading ? "Загрузка..." : "Добавить слайд"}
      </button>
    </form>
  );
}
