"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4 px-4 text-center">
      <AlertTriangle className="h-12 w-12 text-rose-500" />
      <h2 className="text-2xl font-bold text-slate-900">Something went wrong!</h2>
      <p className="text-slate-600">We apologize for the inconvenience.</p>
      <button
        onClick={() => reset()}
        className="rounded-full bg-brand-rose px-6 py-2 font-medium text-white shadow-md transition-colors hover:bg-rose-500"
      >
        Try again
      </button>
    </div>
  );
}
