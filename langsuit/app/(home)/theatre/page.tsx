"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Play, BookOpen, Clock, ChevronRight } from "lucide-react";
import { RootState, AppDispatch } from "@/redux/store";
import { setSearchQuery } from "@/redux/filterSlice";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Guidance {
  id: string;
  name: string;
  description: string | null;
  level: "Beginner" | "Intermediate" | "Advanced" | null;
  price: number | null;
  visits: number | null;
  instructorId: number;
  category: string;
}

export default function TheaterPage() {
  const [guidances, setGuidances] = useState<Guidance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchQuery = useSelector(
    (state: RootState) => state.courseFilter.searchQuery,
  );
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  useEffect(() => {
    const fetchGuidances = async () => {
      try {
        const response = await fetch("/api/guidance/available");
        const rawData = await response.json();
        const guidancesData = Array.isArray(rawData)
          ? rawData
          : rawData.guidances
            ? rawData.guidances
            : rawData.data;
        console.log(guidancesData);
        const validGuidances = guidancesData.filter(
          (guidance) => guidance && typeof guidance.name === "string",
        );

        if (validGuidances.length === 0) {
          throw new Error("No valid guidances found");
        }

        setGuidances(validGuidances);
        setLoading(false);
      } catch (err) {
        console.error("Guidances fetch error:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
        setLoading(false);
      }
    };

    fetchGuidances();
  }, []);

  const handleGuidanceSelect = (guidance: Guidance) => {
    router.push(`/theatre/${guidance.id}`);
  };

  const filteredGuidances = guidances.filter((guidance) =>
    guidance.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-red-500">
        <div className="text-center">
          <h2 className="text-2xl mb-4">Error Loading Guidances</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (filteredGuidances.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="text-center">
          <h2 className="text-2xl mb-4">No Guidances Found</h2>
          <p>Try adjusting your search query.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-300 text-yellow">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Available Guidances
        </h1>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search guidances by title"
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="w-full p-3 rounded border border-gray-300"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuidances.map((guidance) => (
            <Card
              key={guidance.id}
              className="bg-gray-900 border-gray-800 hover:border-blue-600 transition-all duration-300"
            >
              <CardHeader className="p-4">
                <CardTitle className="text-xl text-white">
                  {guidance.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center text-gray-400 space-x-2">
                    <BookOpen className="w-5 h-5" />
                    <span>{guidance.category}</span>
                    <Clock className="w-5 h-5 ml-4" />
                    <span>${guidance.price || 0}</span>
                  </div>
                  <p className="text-gray-300 line-clamp-3">
                    {guidance.description || "No description available"}
                  </p>
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-sm",
                        guidance.level === "Beginner" &&
                          "bg-green-900 text-green-300",
                        guidance.level === "Intermediate" &&
                          "bg-yellow-900 text-yellow-300",
                        guidance.level === "Advanced" &&
                          "bg-red-900 text-red-300",
                      )}
                    >
                      {/* {guidance.level || 'Unknown'} */}
                    </span>
                    <Button
                      onClick={() => handleGuidanceSelect(guidance)}
                      className="group"
                    >
                      Start Guidance
                      <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
