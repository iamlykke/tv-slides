import Link from "next/link";

export default function AdminHome() {
  return (
    <div className="p-10 flex flex-col items-center gap-4">
      <h1 className="text-3xl font-bold">Choose location</h1>
      <div className="flex gap-6">
        <Link href="/admin/cy" className="btn btn-primary text-lg px-6">
          CY
        </Link>
        <Link href="/admin/ru" className="btn btn-primary text-lg px-6">
          RU
        </Link>
      </div>
    </div>
  );
}
