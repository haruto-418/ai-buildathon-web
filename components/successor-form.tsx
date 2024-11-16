"use client";

import { Button } from "@/components/ui/button";
import { locales } from "@/lib/locales";
import { handoverSchema, localeSchema } from "@/lib/schemas";
import { updateHandoverSuccessorIdByEmail } from "@/utils/interfaces/handovers/update";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
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
        className="grid grid-cols-4 items-center gap-4 rounded-lg rounded-md border border-gray-200 bg-card p-4"
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
        <Button type="submit">{locales[locale].add}</Button>
      </form>
    </Form>
  );
}
