// For generic errors (500)
"use client";

import ErrorPage from "@/components/errors/ErrorPage";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorPage
      code="500"
      title="Internal Server Error"
      message="Oops! Something went wrong on our end. We're working to fix it."
      buttonText="Try Again"
      buttonAction={reset}
      theme="red"
    />
  );
}
