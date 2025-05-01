"use client";

import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import React, { useEffect, useState } from "react";

interface LanguageData {
  _id: string;
  language: string;
  alphabets: string[];
  vowels: string[];
  consonants: string[];
}

export default function AlphabetsSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [languageData, setLanguageData] = useState<LanguageData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLanguageData("English");
  }, []);

  const fetchLanguageData = async (lang: string) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `/api/alphabets?lang=${encodeURIComponent(lang)}`,
      );
      if (!response.ok) {
        throw new Error("Language not found");
      }
      const data = await response.json();
      setLanguageData(data.data);
    } catch (err) {
      setError("Failed to fetch language data");
      setLanguageData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      fetchLanguageData(searchTerm);
    }
  };

  const renderAlphabets = (alphabets: string[]) => {
    return alphabets.map((alphabet, index) => (
      <Button key={index} variant="default" className="m-2 text-2xl h-16 w-16">
        {alphabet}
      </Button>
    ));
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="mb-8">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter language name"
          className="border p-4 mr-4 text-xl w-2/3"
        />
        <Button type="submit" variant="primary" className="text-xl px-6 py-4">
          Search
        </Button>
      </form>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70">
          <Loader className="h-12 w-12 text-muted-foreground animate-spin" />
        </div>
      )}
      {error && <p className="text-red-500 text-xl">{error}</p>}

      {languageData && (
        <div>
          <h2 className="text-3xl font-semibold mb-6">
            {languageData.language}
          </h2>
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-4">Alphabets:</h3>
            <div className="grid grid-cols-5 gap-4">
              {renderAlphabets(languageData.alphabets)}
            </div>
          </div>
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-4">Vowels:</h3>
            <div className="grid grid-cols-5 gap-4">
              {renderAlphabets(languageData.vowels)}
            </div>
          </div>
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-4">Consonants:</h3>
            <div className="grid grid-cols-5 gap-4">
              {renderAlphabets(languageData.consonants)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
