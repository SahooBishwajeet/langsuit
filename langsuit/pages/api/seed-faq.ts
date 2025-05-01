import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../lib/mongodb";
import FAQ from "../../models/faq";
const predefinedFaqs = [
  {
    question: "What is Langsuit?",
    answer:
      "Langsuit is a language learning app that offers lessons in multiple languages through interactive exercises, helping you learn vocabulary, grammar, and speaking skills.",
  },
  {
    question: "Is Langsuit free to use?",
    answer:
      "Yes, Langsuit is free to use. It provides a wide range of language courses without any charge. There is also a premium version, langsuit Plus, with additional features like offline access and an ad-free experience.",
  },
  {
    question: "How many languages can I learn on Langsuit?",
    answer:
      "Langsuit offers over 30 languages, including popular ones like Spanish, French, German, and Japanese, as well as less commonly spoken languages like Navajo and Hawaiian.",
  },
  {
    question: "Does Langsuit offer a certificate or diploma?",
    answer:
      "Langsuit does not provide official certificates or diplomas for completing its courses. However, langsuit English Test offers an English proficiency certificate that can be used for college admissions or job applications.",
  },
  {
    question: "How does Langsuit track my progress?",
    answer:
      "Langsuit uses a system of levels, skill trees, and experience points (XP) to track your progress. You can see how many lessons you've completed and how well you've mastered each skill.",
  },
  {
    question: "How do I use Langsuit for speaking practice?",
    answer:
      "Langsuit provides speaking exercises that prompt you to repeat words and sentences using voice recognition. These exercises help improve your pronunciation and speaking confidence.",
  },
  {
    question: "What is Langsuit's 'Streak' feature?",
    answer:
      "Langsuit's 'Streak' feature motivates users to practice daily by rewarding you for consecutive days of study. A streak is counted as the number of days you've logged in a row, and it resets if you miss a day.",
  },
  {
    question: "Does Langsuit have a mobile app?",
    answer:
      "Yes, Langsuit has a mobile app available for both iOS and Android devices. You can learn languages on-the-go, making it convenient to practice anytime, anywhere.",
  },
  {
    question: "Does Langsuit offer any personalized features?",
    answer:
      "Yes, Langsuit offers personalized learning by adapting the difficulty of lessons to your performance. It suggests lessons based on your strengths and areas where you need improvement.",
  },
  {
    question: "Can I use Langsuit offline?",
    answer:
      "Yes, with Langsuit Plus, you can download lessons and practice offline. The free version does not offer offline access.",
  },
  {
    question: "How do you protect my personal data?",
    answer:
      "We protect your personal data using advanced encryption techniques and by ensuring that only authorized personnel have access to it.",
  },
  {
    question: "Do you share my personal information with third parties?",
    answer:
      "No, we do not share your personal information with third parties without your consent, except when required by law.",
  },
  {
    question: "Can I delete my account or personal data?",
    answer:
      "Yes, you can delete your account and personal data at any time by contacting our support team, and we will process your request as per the applicable data protection laws.",
  },
  {
    question: "What happens if the Terms and Conditions change?",
    answer:
      "If the Terms and Conditions change, we will notify users via email or on the app/website, and you will have the option to accept the new terms.",
  },
  {
    question: "How do I withdraw my consent to data processing?",
    answer:
      "You can withdraw your consent by updating your preferences in your account settings or by contacting our support team directly.",
  },
];
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    await dbConnect();
    await FAQ.deleteMany({});
    await FAQ.insertMany(predefinedFaqs);
    const faqs = await FAQ.find({});
    res
      .status(200)
      .json({ message: "Database seeded successfully", data: faqs });
  } catch (error) {
    console.error("Error seeding database:", error);
    res.status(500).json({
      message: "Error seeding database",
      error: (error as Error).message,
    });
  }
}
