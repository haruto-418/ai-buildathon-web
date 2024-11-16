"use client";

import { Button } from "@/components/ui/button";
import { locales } from "@/lib/locales";
import { handoverSchema, localeSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { updateHandoverSuccessorIdByEmail } from "@/utils/interfaces/handovers/update";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { BsPlus } from "react-icons/bs";
import { toast } from "sonner";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

const formSchema = z.object({ email: z.string().email() });

const propsSchema = z.object({
  handover: handoverSchema,
  locale: localeSchema,
});
type Props = z.infer<typeof propsSchema>;
export function SuccessorForm(props: Props) {
  const {
    handover: { successorId, id: handoverId },
    locale,
  } = propsSchema.parse(props);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  const router = useRouter();

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      await updateHandoverSuccessorIdByEmail({
        handoverId,
        email: data.email,
      });

      toast.success(`${locales[locale].successMessages.add}`);
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error(`${locales[locale].errorMessages.addSuccessorError}`);
    }
  }

  if (successorId) {
    return null;
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col items-center gap-4 rounded-md border border-gray-200 bg-card p-4 md:grid md:grid-cols-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="col-span-3">
              <FormLabel>{locales[locale].successorEmail}</FormLabel>
              <FormControl>
                <Input
                  placeholder={`${locales[locale].successorEmail}...`}
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {locales[locale].emailInputDescription}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          variant={"ghost"}
          className={cn(
            "border border-gray-500",
            "flex items-center gap-2",
            "w-full",
          )}
        >
          <BsPlus size={24} className="font-bold text-black" />
          {locales[locale].add}
        </Button>
      </form>
    </Form>
  );
}
