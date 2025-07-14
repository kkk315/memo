"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const crumbs = [
    { name: "ホーム", href: "/" },
    ...segments.map((seg, i) => ({
      name: seg,
      href: "/" + segments.slice(0, i + 1).join("/")
    }))
  ];
  return (
    <nav className="breadcrumb">
      {crumbs.map((c, i) => (
        <span key={c.href}>
          <Link href={c.href}>{c.name}</Link>
          {i < crumbs.length - 1 && " ＞ "}
        </span>
      ))}
    </nav>
  );
}
