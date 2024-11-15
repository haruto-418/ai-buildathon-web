"use server";

import { currentUser } from "@clerk/nextjs/server";

import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { createUserInFirestore } from "@/utils/interfaces/users/create";

export async function ServerDevelopments() {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  async function createUserOnSubmit() {
    "use server";

    const user = await currentUser();

    if (!user) {
      console.error("No user found");
      return;
    }

    try {
      await createUserInFirestore({ user });
      return;
    } catch (err) {
      console.error(err);
      return;
    }
  }

  return (
    <div>
      <form action={createUserOnSubmit}>
        <Input
          type="submit"
          value="ユーザーをFirestoreに作成"
          className={cn(buttonVariants({ variant: "ghost" }), "bg-transparent")}
        />
      </form>
    </div>
  );
}
