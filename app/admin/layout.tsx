// app/admin/layout.tsx
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-100 border-r p-4">
        <h2 className="text-lg font-bold mb-4">Админка</h2>
        <h3 className="text-lg font-bold mb-1">CY</h3>
        <nav className="mb-6">
          <Link href="/admin/cy" className="block hover:underline">
            Настройка
          </Link>
          <Link href="/cy" className="block hover:underline">
            Показ
          </Link>
        </nav>

        <h3 className="text-lg font-bold mb-1">RU</h3>

        <nav>
          <Link href="/admin/ru" className="block hover:underline">
            Настройка
          </Link>
          <Link href="/ru" className="block hover:underline">
            Показ
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
