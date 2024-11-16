"use client";

import { MdLanguage } from "react-icons/md";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { locales } from "@/lib/locales";
import { localeSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { redirect } from "next/navigation";
import { z } from "zod";
import { buttonVariants } from "./ui/button";

const propsSchema = z.object({
  locale: localeSchema,
});
type Props = z.infer<typeof propsSchema>;
export function LanguageSelector(props: Props) {
  const { locale } = propsSchema.parse(props);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(buttonVariants({ variant: "outline" }))}
      >
        <MdLanguage />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          {locales[locale].selectYourLanguage}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            redirect("/ja");
          }}
        >
          日本語
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            redirect("/en");
          }}
        >
          English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
