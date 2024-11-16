"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { locales } from "@/lib/locales";
import { handoverSchema, localeSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { updateHandover } from "@/utils/interfaces/handovers/update";
import { MdEdit } from "react-icons/md";
import { Button, buttonVariants } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

const formSchema = z.object({
  handover: handoverSchema.pick({ title: true }),
});

const propsSchema = z.object({
  handover: handoverSchema,
  locale: localeSchema,
  className: z.string().optional(),
});
type Props = z.infer<typeof propsSchema>;
export function HandoverEditForm(props: Props) {
  const { handover, locale, className } = propsSchema.parse(props);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { handover: { title: handover.title ?? "" } },
  });

  const router = useRouter();

  const [open, setOpen] = useState<boolean>(false);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      await updateHandover({
        handover: {
          id: handover.id,
          title: data.handover.title,
        },
      });

      toast.success(`${locales[locale].successMessages.save}`);
      router.refresh();
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error(`${locales[locale].errorMessages.saveError}`);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "border border-gray-500",
          "flex items-center gap-2",
          className,
        )}
      >
        <MdEdit size={24} className="text-black" />
        {locales[locale].edit}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle />
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="handover.title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{locales[locale].title}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={locales[locale].title}
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">{locales[locale].save}</Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
