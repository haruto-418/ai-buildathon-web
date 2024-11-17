"use client";

import { BsSlack } from "react-icons/bs";
import { Button } from "./ui/button";

export function ConnectSlackButton() {
  return (
    <Button
      variant={"outline"}
      className="border border-gray-500 bg-transparent"
      onClick={() => {
        alert("Under development / 実装中です");
      }}
    >
      <BsSlack />
    </Button>
  );
}
