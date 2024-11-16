"use client";

import { RotatingLines } from "react-loader-spinner";

export function ClientLoader() {
  return (
    <div className="flex items-center justify-center">
      <RotatingLines
        visible={true}
        width="96"
        strokeColor="#1e293b"
        strokeWidth="5"
        animationDuration="0.75"
        ariaLabel="rotating-lines-loading"
      />
    </div>
  );
}
