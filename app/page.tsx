import { buttonVariants } from "@/components/ui/button";
import { en, ja } from "@/lib/locales";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <div className="flex flex-col">
        <p className="text-lg font-bold">{ja.selectYourLanguage}</p>
        <p className="text-lg font-bold">{en.selectYourLanguage}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/ja"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "w-full border-gray-400",
          )}
        >
          日本語
        </Link>
        <Link
          href="/en"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "w-full border-gray-400",
          )}
        >
          English
        </Link>
      </div>
    </div>
  );
}
