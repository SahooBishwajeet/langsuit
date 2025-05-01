"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const messages = [
  "Entering Quests",
  "Creating Personalized Selection",
  "Generating Challenges",
  "Wait For A Minute",
  "Entering A New World!!!",
];

const getRandomMessage = () => {
  return messages[Math.floor(Math.random() * messages.length)];
};

const WaitingPage = () => {
  const [message, setMessage] = useState(getRandomMessage());
  const [dots, setDots] = useState("");
  const router = useRouter();

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessage(getRandomMessage());
    }, 1000); // Change message every 2 seconds

    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500); // Update dots every 0.5 seconds

    const timeout = setTimeout(() => {
      router.push("/lesson");
    }, 6000); // Redirect after 5 seconds

    return () => {
      clearInterval(messageInterval);
      clearInterval(dotsInterval);
      clearTimeout(timeout);
    };
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen text-center">
      <h1 className="text-2xl">
        {message}
        {dots}
      </h1>
    </div>
  );
};

export default WaitingPage;
