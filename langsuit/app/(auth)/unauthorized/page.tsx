// For 401 Unauthorized errors
import ErrorPage from "@/components/errors/ErrorPage";

export default function UnauthorizedPage() {
  return (
    <ErrorPage
      code="401"
      title="Unauthorized Access"
      message="Please log in to access this page."
      buttonText="Sign In"
      buttonLink="/sign-in"
      theme="blue"
    />
  );
}
