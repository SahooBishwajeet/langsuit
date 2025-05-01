"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setSearchQuery } from "@/redux/searchSlice";

// Type definition for Guidance
interface Guidance {
  id: string;
  name: string;
  description: string;
  price: number;
  durationInHours: number;
  instructorName: string;
}

const CourseSelectionPage: React.FC = () => {
  const [guidances, setGuidances] = useState<Guidance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchQuery = useSelector(
    (state: { search: { query: string } }) => state.search.query,
  );
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const fetchAvailableGuidances = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "http://localhost:3000/api/guidance/available",
          {
            method: "GET",
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch guidances");
        }

        const data = await response.json();
        setGuidances(data.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching guidances:", err);
        setError("Unable to load guidances. Please try again later.");
        setLoading(false);
      }
    };

    fetchAvailableGuidances();
  }, []);

  const handleCourseSelect = (guidanceId: string) => {
    router.push(`/tickets/${guidanceId}`);
  };

  // Filter guidances based on search query
  const filteredGuidances = guidances.filter(
    (guidance) =>
      guidance.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guidance.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guidance.instructorName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(event.target.value));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse text-amber-500">
          Loading available guidances...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-amber-500">
        Available Guidances
      </h1>

      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search guidances..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="p-2 rounded-lg border border-gray-300"
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGuidances.map((guidance) => (
          <Card
            key={guidance.id}
            className="bg-gray-900 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-white mb-2">
                {guidance.name}
              </h2>
              <p className="text-gray-400 mb-4">{guidance.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="text-white">{guidance.durationInHours} hours</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Instructor</p>
                <p className="text-white">{guidance.instructorName}</p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-amber-500 font-bold text-lg">
                ${guidance.price}
              </div>
              <Button
                onClick={() => handleCourseSelect(guidance.id)}
                className="bg-amber-500 text-black hover:bg-amber-600"
              >
                Select Guidance
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredGuidances.length === 0 && (
        <div className="text-center text-gray-500">
          No guidances are currently available.
        </div>
      )}
    </div>
  );
};

export default CourseSelectionPage;
