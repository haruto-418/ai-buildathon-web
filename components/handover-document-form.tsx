"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { locales } from "@/lib/locales";
import { localeSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { createHandoverDocument } from "@/utils/interfaces/handover-documents/create";
import { DialogTitle } from "@radix-ui/react-dialog";

const propsSchema = z.object({
  locale: localeSchema,
  handoverId: z.string(),
});
type Props = z.infer<typeof propsSchema>;
export function HandoverDocumentForm(props: Props) {
  const { locale, handoverId } = propsSchema.parse(props);

  const router = useRouter();

  const [open, setOpen] = useState<boolean>(false);

  const [uploadingFile, setUploadingFile] = useState<boolean>(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setUploadingFile(true);

    const file = e.target.files?.[0];
    if (!file) {
      toast.error("ファイルが選択されていません");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload-file", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        toast.error("ファイルのアップロードに失敗しました");
        return;
      }

      const data = await res.json();
      const fileUrl = data.file.url;

      try {
        await createHandoverDocument({
          handoverId,
          handoverDocument: {
            id: "",
            title: file.name,
            url: fileUrl,
            createdAt: new Date(),
          },
        });
        console.info(`Handover document ${fileUrl} created`);
      } catch (err) {
        console.error(err);
        toast.error("ファイルのアップロードに失敗しました");
      }

      toast.success("ファイルのアップロードが完了しました");
      console.log("Uploaded file URL:", fileUrl);
      setUploadingFile(false);

      return;
    } catch (err) {
      console.error(err);
      toast.error("ファイルのアップロードに失敗しました");

      setUploadingFile(false);
      return;
    }
  }

  async function onSubmit() {
    if (!uploadingFile) {
      toast.error(locales[locale].errorMessages.fileNotSelected);
      return;
    }

    try {
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
      <DialogTrigger className={cn(buttonVariants({}))}>
        {locales[locale].uploadDocument}
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-8">
        <DialogTitle>{locales[locale].uploadDocument}</DialogTitle>
        <Input
          placeholder={locales[locale].title}
          type="file"
          onChange={handleFileChange}
          disabled={uploadingFile}
        />
        <Button type="button" onClick={onSubmit}>
          {locales[locale].upload}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
