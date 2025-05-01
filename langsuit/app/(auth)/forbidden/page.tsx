// For 403 Forbidden errors
import ErrorPage from "@/components/errors/ErrorPage";

export default function ForbiddenPage() {
  return (
    <ErrorPage
      code="403"
      title="Access Forbidden"
      message="You don't have permission to access this resource."
      buttonText="Go Back"
      buttonLink="/"
      theme="yellow"
    />
  );
}
