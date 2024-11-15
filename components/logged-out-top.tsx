import { cn } from "@/lib/utils";
import { SignInButton } from "@clerk/nextjs";
import { buttonVariants } from "./ui/button";

export function LoggedOutTop() {
  return (
    <div>
      <header className="">
        <nav className="flex justify-end py-2 md:px-4">
          <div
            className={cn(
              buttonVariants({ variant: "outline" }),
              "border-gray-400",
            )}
          >
            <SignInButton />
          </div>
        </nav>
      </header>
      <div className="flex justify-center">
        <p>ログアウトしてるよ</p>
      </div>
    </div>
  );
}
