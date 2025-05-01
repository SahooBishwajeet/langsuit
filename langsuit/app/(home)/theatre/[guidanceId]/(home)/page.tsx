"use client";
import { useState, useEffect } from "react";
import Player from "../_components/Player";
import { useParams } from "next/navigation";

interface Video {
  id: string;
  title: string;
  duration?: string;
  videoUrl: string;
}

const DEFAULT_PLAYLIST: Video[] = [];

const Page = () => {
  const [playlist, setPlaylist] = useState<Video[]>(DEFAULT_PLAYLIST);
  const [videoData, setVideoData] = useState<Video | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(0);

  const { guidanceId } = useParams();

  // Centralized Error Handler
  const handleError = (message: string, err?: unknown) => {
    console.error(message, err);
    setError(message);
    setLoading(false);
  };

  const fetchUserId = async () => {
    try {
      const userIdResponse = await fetch("/api/user/id");
      if (!userIdResponse.ok) throw new Error("Failed to fetch user ID");

      const { userId } = await userIdResponse.json();

      const accessResponse = await fetch("/api/ticket/hasPurchased", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, guidanceId }),
      });

      if (!accessResponse.ok)
        throw new Error("Failed to check guidance access");

      const accessData = await accessResponse.json();
      setHasAccess(accessData?.hasPurchased ?? false);
    } catch (err) {
      handleError("Failed to check access", err);
    }
  };

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const playlistResponse = await fetch("/api/guidance/playlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guidanceId }),
      });

      if (!playlistResponse.ok) throw new Error("Failed to fetch videos");

      const playlistData: Video[] = await playlistResponse.json();

      if (playlistData.length === 0) throw new Error("No videos found");

      setPlaylist(playlistData);
      setVideoData(playlistData[0]);
      setCurrentVideoIndex(0); // Set the first video index
    } catch (err) {
      handleError("Error fetching videos", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (guidanceId) {
      fetchUserId();
      fetchVideos();
    }
  }, [guidanceId]);

  const handleProgressUpdate = async (progress: {
    percentage: number;
    currentTime: number;
  }) => {
    try {
      const videoId = playlist[currentVideoIndex]?.id;
      if (!videoId) return;

      await fetch("/api/progress/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoId,
          progress: progress.percentage,
          currentTime: progress.currentTime,
        }),
      });
    } catch (err) {
      console.error("Error updating progress:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading video...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {error && (
        <div className="p-4 mb-4 text-red-500 bg-red-100 rounded">
          Error: {error}
        </div>
      )}

      {hasAccess ? (
        <Player
          playlist={playlist}
          isAuthenticated={true}
          hasAccess={true}
          onProgressUpdate={handleProgressUpdate}
        />
      ) : (
        <div className="p-4 mb-4 text-red-500 bg-red-100 rounded">
          You do not have access to this guidance.
        </div>
      )}
    </div>
  );
};

export default Page;
