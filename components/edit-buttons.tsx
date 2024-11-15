import Link from "next/link";
import { MdEdit } from "react-icons/md";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type EditLinkButtonProps = {
  href: string;
  label?: string;
};
export function EditLinkButton({ href, label }: EditLinkButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        buttonVariants({ variant: "ghost" }),
        "border border-gray-500",
        "flex items-center gap-2",
      )}
    >
      <MdEdit size={24} className="text-black" />
      {label}
    </Link>
  );
}

type EditButtonProps = {
  label?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick?: () => any;
};
export function EditButton({ label, onClick }: EditButtonProps) {
  return (
    <Button
      variant={"ghost"}
      className={cn("border border-gray-500", "flex items-center gap-2")}
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
    >
      <MdEdit size={24} className="text-black" />
      {label}
    </Button>
  );
}
