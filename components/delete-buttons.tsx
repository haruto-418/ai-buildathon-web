"use client";

import { BsTrash } from "react-icons/bs";
import { Button } from "./ui/button";

type DeleteButtonProps = {
  onClick: () => void;
};
export function DeleteButton({ onClick }: DeleteButtonProps) {
  return (
    <Button
      variant="destructive"
      onClick={() => {
        if (confirm("本当に削除しますか？")) {
          onClick();
        }
      }}
    >
      <BsTrash size={16} />
    </Button>
  );
}
