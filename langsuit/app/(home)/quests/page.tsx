"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, useAnimation } from "framer-motion";
import { BarChart2, Clock, Star, Trophy } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const DUMMY_QUESTS = [
  {
    id: 1,
    title: "Vocabulary Master",
    description: "Learn 50 new words in a week",
    difficulty: "Medium",
    expiresAt: "7 days",
    rewardPoints: 500,
    completed: true,
  },
  {
    id: 2,
    title: "Grammar Guru",
    description: "Complete 10 grammar exercises with 100% accuracy",
    difficulty: "Hard",
    expiresAt: "5 days",
    rewardPoints: 750,
    completed: false,
  },
  {
    id: 3,
    title: "Conversation Champion",
    description: "Participate in 5 language exchange sessions",
    difficulty: "Easy",
    expiresAt: "10 days",
    rewardPoints: 300,
    completed: false,
  },
  {
    id: 4,
    title: "Cultural Explorer",
    description: "Watch 3 foreign language movies and write reviews",
    difficulty: "Medium",
    expiresAt: "14 days",
    rewardPoints: 600,
    completed: true,
  },
];

async function fetchQuests(username: string) {
  try {
    const response = await fetch(`/api/quests/read?username=${username}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Failed to fetch quests. Status:", response.status);
      return DUMMY_QUESTS;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching quests:", error);
    return DUMMY_QUESTS;
  }
}

const getUserProgress = async () => {
  return {
    activeCourse: {
      title: "Spanish",
      imageSrc: "/ES - Spain.svg",
    },
    hearts: 10,
    points: 120,
    hasActiveSubscription: true,
    userName: "Akshat",
  };
};

const getUserSubscription = async () => {
  return {
    isActive: true,
    subscriptionType: "Pro",
  };
};

const FloatingLetter = ({ children, delay = 0 }) => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      y: ["0%", "100%"],
      x: ["0%", `${Math.random() * 100}%`],
      opacity: [0.4, 0],
      scale: [1, 0.8],
      transition: {
        duration: 20 + Math.random() * 15,
        ease: "linear",
        repeat: Infinity,
        delay: delay * 2,
      },
    });
  }, [controls, delay]);

  return (
    <motion.div
      animate={controls}
      className="absolute text-3xl md:text-4xl lg:text-5xl font-bold text-primary/10 pointer-events-none"
      style={{
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
      }}
    >
      {children}
    </motion.div>
  );
};

const QuestsPage = () => {
  const [userProgressData, setUserProgress] = useState<any>();
  const [userSubscriptionData, setUserSubscriptionData] = useState<any>();
  const [quests, setQuests] = useState<any>();

  const router = useRouter();

  useEffect(() => {
    const fetchDetails = async () => {
      const userProgress = await getUserProgress();
      const subscriptions = await getUserSubscription();
      const fetchedQuests = await fetchQuests(userProgress.userName);
      setUserProgress(userProgress);
      setUserSubscriptionData(subscriptions);
      setQuests(fetchedQuests);
    };
    fetchDetails();
  }, []);

  if (!userProgressData || !userProgressData.activeCourse) {
    return null;
  }

  const isPro = !!userSubscriptionData?.isActive;

  const floatingLetters = [
    "A",
    "Б",
    "C",
    "Д",
    "E",
    "Ф",
    "G",
    "Ж",
    "I",
    "Й",
    "K",
    "Л",
    "M",
    "O",
    "П",
    "あ",
    "い",
    "う",
    "え",
    "お",
    "か",
    "き",
    "く",
    "け",
    "こ",
    "さ",
    "し",
    "す",
    "せ",
    "そ",
    "你",
    "我",
    "他",
    "她",
    "它",
    "们",
    "好",
    "是",
    "不",
    "在",
    "有",
    "个",
    "这",
    "那",
    "哪",
    "Ñ",
    "Ç",
    "Ü",
    "Ö",
    "Ş",
    "İ",
    "Ğ",
    "Ą",
    "Ę",
    "Ć",
    "Ł",
    "Ń",
    "Ś",
    "Ź",
    "Ż",
    ,
    "ب",
    "ت",
    "ث",
    "ج",
    "ح",
    "خ",
    "د",
    "ذ",
    "ر",
    "ز",
    "س",
    "ش",
    "ص",
    "ض",
    "β",
    "δ",
    "ε",
    "ζ",
    "η",
    "θ",
    "κ",
    "λ",
    "μ",
    "ξ",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 p-4 md:p-8 relative overflow-hidden">
      {floatingLetters.map((letter, index) => (
        <FloatingLetter key={index} delay={index}>
          {letter}
        </FloatingLetter>
      ))}

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4 tracking-tight">
            Quests
          </h1>
          <p className="text-lg md:text-xl text-primary/80">
            Complete exciting quests, earn points, and unlock achievements!
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {quests &&
            quests.map((quest, index) => {
              const progress = Math.min(
                (userProgressData.points / quest.rewardPoints) * 100,
                100,
              );
              const isCompleted = quest.completed || progress === 100;

              return (
                <motion.div
                  key={quest.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    className={`h-full transition-all backdrop-blur-md ${
                      isCompleted
                        ? "bg-gradient-to-br from-green-100/80 to-green-200/80 border-2 border-green-300"
                        : "bg-background/60 hover:shadow-xl"
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <div
                          className={`p-3 rounded-full mr-4 ${isCompleted ? "bg-green-400" : "bg-primary"}`}
                        >
                          {isCompleted ? (
                            <Trophy className="w-6 h-6 text-white" />
                          ) : (
                            <Image
                              src="/points.svg"
                              alt="Points"
                              width={24}
                              height={24}
                            />
                          )}
                        </div>
                        <h3 className="font-bold text-xl text-primary">
                          {quest.title}
                        </h3>
                      </div>

                      <p className="text-primary/80 mb-4">
                        {quest.description}
                      </p>

                      <div className="flex items-center justify-between text-sm text-primary/60 mb-4">
                        <span className="flex items-center">
                          <Star className="w-4 h-4 mr-1" />
                          {quest.difficulty}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          Expires: {quest.expiresAt}
                        </span>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-primary/80">
                            Progress
                          </span>
                          <span className="text-sm text-primary/80">
                            {userProgressData.points} / {quest.rewardPoints} XP
                          </span>
                        </div>
                        <div className="w-full bg-primary/20 rounded-full h-2.5">
                          <motion.div
                            className={`h-2.5 rounded-full ${isCompleted ? "bg-green-500" : "bg-primary"}`}
                            style={{ width: `${progress}%` }}
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                          />
                        </div>
                      </div>

                      {!isCompleted && (
                        <Button
                          onClick={() => router.push("/anim")}
                          variant="outline"
                          className="w-full mt-2 bg-primary/10 text-primary hover:bg-primary/20"
                        >
                          Start Quest
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
        </div>

        {userProgressData.points === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-12 text-center"
          >
            <Card className="backdrop-blur-md bg-background/60 py-8 px-6">
              <CardContent>
                <BarChart2 className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-primary mb-4">
                  Start Your Quest Journey
                </h2>
                <p className="text-primary/80 mb-6">
                  Begin your adventure, complete quests, and earn amazing
                  rewards!
                </p>
                <Button
                  variant="default"
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Begin Learning Now
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default QuestsPage;
