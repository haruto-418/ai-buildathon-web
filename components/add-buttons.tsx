"use client";

import Link from "next/link";
import { Dispatch, SetStateAction } from "react";
import { BsPlus } from "react-icons/bs";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type AddButtonProps = {
  label?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick?: () => any;
};
export function AddButton({ label, onClick }: AddButtonProps) {
  return (
    <Button
      variant={"ghost"}
      className={cn("border border-gray-500", "flex items-center gap-2")}
    >
      <BsPlus
        size={24}
        className="font-bold text-black"
        onClick={() => {
          alert();
          if (onClick) {
            onClick();
          }
        }}
      />
      {label}
    </Button>
  );
}

type AddLinkButtonProps = {
  href: string;
  label?: string;
};
export function AddLinkButton({ href, label }: AddLinkButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        buttonVariants({ variant: "ghost" }),
        "border border-gray-500",
        "flex items-center gap-2",
      )}
    >
      <BsPlus size={24} className="font-bold text-black" />
      {label}
    </Link>
  );
}

type AddDialogButtonProps = {
  label?: string;
  title?: string;
  children: React.ReactNode;
  open?: boolean;
  setOpen?: Dispatch<SetStateAction<boolean>>;
};
export function AddDialogButton({
  label,
  children,
  title,
  open,
  setOpen,
}: AddDialogButtonProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "border border-gray-500",
          "flex items-center gap-2",
        )}
      >
        <BsPlus size={24} className="font-bold text-black" />
        {label}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
