import Link from "next/link";

export default function Home() {
  return (
    <div className="m-50 mx-auto text-center items-center justify-center flex gap-7 flex-col">
      <p>Choose location</p>
      <div className="text-center flex gap-7 flex-row">
        <Link href="/cy">CY</Link>
        <Link href="/ru">RU</Link>
      </div>
      <Link href="/admin">ADMIN</Link>
    </div>
  );
}
