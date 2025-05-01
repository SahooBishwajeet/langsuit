"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useParams } from "next/navigation";

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCourse: (course: {
    title: string;
    visits: number;
    price: number;
  }) => void;
}

const AddCourseModal = ({
  isOpen,
  onClose,
  onAddCourse,
}: AddCourseModalProps) => {
  const [title, setTitle] = useState("");
  const [visits, setVisits] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { username } = useParams();

  const handleSubmit = async () => {
    if (!title || !visits || !price || !file) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("visits", visits);
      formData.append("price", (parseInt(price) * 100).toString()); // Convert to cents
      formData.append("username", username);
      formData.append("file", file);

      const response = await fetch("/api/guidance/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to add course");
      }

      const newCourse = await response.json();
      onAddCourse(newCourse);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Course</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Title */}
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Course Title"
            required
          />

          {/* Visits */}
          <Input
            value={visits}
            onChange={(e) => setVisits(e.target.value)}
            placeholder="Number of Visits"
            type="number"
            required
          />

          {/* Price */}
          <Input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price in USD"
            type="number"
            required
          />

          {/* File Upload */}
          <input
            type="file"
            accept=".zip"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
            className="block w-full text-sm text-gray-400
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
          />

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Adding..." : "Add Course"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCourseModal;
