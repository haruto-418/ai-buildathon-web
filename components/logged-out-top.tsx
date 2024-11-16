import { cn } from "@/lib/utils";
import { SignInButton } from "@clerk/nextjs";
import { ServiceDescription } from "./service-description";
import { buttonVariants } from "./ui/button";

export function LoggedOutTop() {
  return (
    <div>
      <header className="">
        <nav className="flex justify-end px-2 py-2 md:px-4">
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
        <ServiceDescription />
      </div>
    </div>
  );
}
