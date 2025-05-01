import Link from "next/link";

interface ErrorPageProps {
  code: string;
  title: string;
  message: string;
  buttonText?: string;
  buttonLink?: string;
  buttonAction?: () => void;
  imageUrl?: string;
  theme?: "red" | "yellow" | "blue";
}

const themeColors = {
  red: {
    bg: "bg-red-500",
    hover: "hover:bg-red-600",
    text: "text-red-500",
  },
  yellow: {
    bg: "bg-yellow-500",
    hover: "hover:bg-yellow-600",
    text: "text-yellow-500",
  },
  blue: {
    bg: "bg-blue-500",
    hover: "hover:bg-blue-600",
    text: "text-blue-500",
  },
};

export default function ErrorPage({
  code,
  title,
  message,
  buttonText = "Return Home",
  buttonLink = "/",
  buttonAction,
  imageUrl,
  theme = "red",
}: ErrorPageProps) {
  const colors = themeColors[theme];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-xl max-w-md mx-4">
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Error illustration"
            className="w-32 h-32 mx-auto mb-6"
          />
        )}
        <h1 className={`text-6xl font-bold ${colors.text} mb-4`}>{code}</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <Link
          href={buttonLink}
          onClick={buttonAction}
          className={`inline-block ${colors.bg} text-white px-6 py-3 rounded-lg ${colors.hover} transition-colors`}
        >
          {buttonText}
        </Link>
      </div>
    </div>
  );
}
