import Link from "next/link";
import { useRouter } from "next/router";

type Props = {
  theme: "light" | "dark";
  toggleTheme: () => void;
};

export default function Navbar({ theme, toggleTheme }: Props) {
  const router = useRouter();

  const isActive = (path: string) => router.pathname === path;

  return (
    <nav
      className="
        flex items-center justify-between
        px-8 py-4
        bg-slate-800
        text-white
        shadow-lg
        sticky top-0 z-50
      "
    >
      {/* 🔹 LEFT SIDE */}
      <div className="flex items-center gap-6">

        <Link href="/" className="flex items-center gap-2 text-green-400 font-semibold text-lg">
          🌿 LannaVeg
        </Link>

        <Link
          href="/"
          className={`px-4 py-2 rounded-full transition ${
            isActive("/") ? "bg-green-600" : "hover:bg-slate-700"
          }`}
        >
          หน้าแรก
        </Link>

        <Link
          href="/reviews"
          className={`px-4 py-2 rounded-full transition ${
            isActive("/reviews") ? "bg-green-600" : "hover:bg-slate-700"
          }`}
        >
          รีวิวทั้งหมด
        </Link>

        <Link
          href="/my-reviews"
          className={`px-4 py-2 rounded-full transition ${
            isActive("/my-reviews") ? "bg-green-600" : "hover:bg-slate-700"
          }`}
        >
          ประวัติการรีวิวของฉัน
        </Link>

        <Link
          href="/classify"
          className={`px-4 py-2 rounded-full transition ${
            isActive("/classify") ? "bg-green-600" : "hover:bg-slate-700"
          }`}
        >
          Classify
        </Link>
      </div>

      {/* 🔹 RIGHT SIDE */}
      <div className="flex items-center gap-4">

        {/* Theme Button */}
        <button
          onClick={toggleTheme}
          className="
            px-4 py-2 rounded-full
            bg-gray-200 dark:bg-gray-700
            text-black dark:text-white
            transition
          "
        >
          {theme === "dark" ? "☀ Light" : "🌙 Dark"}
        </button>

      </div>
    </nav>
  );
}
