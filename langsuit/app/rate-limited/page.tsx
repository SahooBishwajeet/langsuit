// For 429 Too Many Requests
import ErrorPage from "@/components/errors/ErrorPage";

export default function RateLimitedPage() {
  return (
    <ErrorPage
      code="429"
      title="Too Many Requests"
      message="Please slow down! You've made too many requests. Try again in a few minutes."
      buttonText="Go Back"
      buttonLink="/"
      theme="yellow"
    />
  );
}
