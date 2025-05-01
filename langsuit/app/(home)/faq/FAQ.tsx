"use client";

import { Loader } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

interface FAQData {
  _id: string;
  question: string;
  answer: string;
}

export default function FAQSearch() {
  const [faqData, setFaqData] = useState<FAQData[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFAQData();
  }, []);

  const fetchFAQData = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/seed-faq"); // Ensure this matches your API route
      if (!response.ok) {
        throw new Error("Failed to fetch FAQ data");
      }
      const data = await response.json();
      setFaqData(data.data); // Assuming the response is in a 'data' field
    } catch (err) {
      setError("Failed to fetch FAQ data");
      setFaqData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70">
          <Loader className="h-12 w-12 text-muted-foreground animate-spin" />
        </div>
      )}
      {error && <p className="text-red-500 text-xl">{error}</p>}

      {faqData && (
        <div>
          <h2 className="text-3xl font-semibold mb-6">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible>
            {faqData.map((faq) => (
              <AccordionItem key={faq._id} value={`item-${faq._id}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  );
}
