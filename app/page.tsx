import { en, ja } from "@/lib/locales";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div>
        <p>{ja.selectYourLanguage}</p>
        <p>{en.selectYourLanguage}</p>
      </div>
      <div className="flex gap-4">
        <Link href="/ja">日本語</Link>
        <Link href="/en">English</Link>
      </div>
    </div>
  );
}
