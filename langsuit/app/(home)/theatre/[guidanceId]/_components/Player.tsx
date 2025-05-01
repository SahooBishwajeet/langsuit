import React, { useRef, useState, useEffect } from "react";

const Player = ({
  playlist = [],
  isAuthenticated,
  hasAccess,
  onProgressUpdate,
}) => {
  const videoRef = useRef(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setLoadingProgress((prev) => (prev < 100 ? prev + 10 : 100));
    }, 200);
    return () => clearInterval(interval);
  }, [currentVideoIndex]);

  const handleVideoEnd = () => {
    if (currentVideoIndex < playlist.length - 1) {
      setCurrentVideoIndex((prev) => prev + 1);
    }
  };

  const handleVideoPlay = () => setIsPlaying(true);
  const handleVideoPause = () => setIsPlaying(false);

  const handleProgressUpdate = () => {
    const video = videoRef.current;
    if (video && onProgressUpdate) {
      const progress = {
        currentTime: video.currentTime,
        duration: video.duration,
        percentage: (video.currentTime / video.duration) * 100,
      };
      onProgressUpdate(progress);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="p-8 bg-gray-800 rounded-lg shadow-2xl border border-blue-500">
          <p className="text-blue-400 text-xl">
            Please login to access the video.
          </p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="p-8 bg-gray-800 rounded-lg shadow-2xl border border-blue-500">
          <p className="text-blue-400 text-xl">
            Access is restricted. Please purchase the course.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900 relative overflow-hidden">
      {/* Ambient Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-gray-900" />

      {/* Dynamic Neon Lines */}
      <div className="absolute inset-0">
        <div
          className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 opacity-75 animate-pulse"
          style={{
            boxShadow: "0 0 20px #3b82f6, 0 0 40px #3b82f6, 0 0 60px #3b82f6",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 opacity-75 animate-pulse"
          style={{
            boxShadow: "0 0 20px #3b82f6, 0 0 40px #3b82f6, 0 0 60px #3b82f6",
          }}
        />
      </div>

      {/* Video Player Section */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-4xl">
          <h1 className="text-blue-400 text-2xl mb-6 font-bold text-center relative">
            {playlist[currentVideoIndex]?.title || "Course Video"}
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
          </h1>

          <div className="relative rounded-lg overflow-hidden shadow-2xl">
            {/* Loading Progress Bar */}
            {loadingProgress < 100 && (
              <div className="absolute inset-0 bg-gray-900/80 flex items-center justify-center z-20">
                <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${loadingProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Video Element */}
            <video
              ref={videoRef}
              className="w-full aspect-video bg-gray-900"
              controls
              onEnded={handleVideoEnd}
              onTimeUpdate={handleProgressUpdate}
              onPlay={handleVideoPlay}
              onPause={handleVideoPause}
              src={playlist[currentVideoIndex]?.videoUrl}
            />

            {/* Play State Indicator */}
            <div
              className={`absolute top-4 right-4 flex items-center space-x-2 ${isPlaying ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
            >
              <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-blue-400 text-sm">
                {isPlaying ? "Playing" : "Paused"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Playlist Section */}
      <div className="w-80 bg-gray-900/95 border-l border-blue-900/50 overflow-y-auto backdrop-blur">
        <h2 className="text-lg font-semibold text-blue-400 p-4 border-b border-blue-900/50">
          Playlist
        </h2>
        <ul className="divide-y divide-blue-900/30">
          {playlist.map((video, index) => (
            <li key={video.id}>
              <button
                onClick={() => setCurrentVideoIndex(index)}
                className={`block w-full text-left p-4 transition-colors duration-200 
                  ${
                    currentVideoIndex === index
                      ? "bg-blue-900/30 text-blue-400"
                      : "text-gray-400 hover:bg-blue-900/20 hover:text-blue-300"
                  }`}
              >
                <span className="block truncate">{video.title}</span>
                {currentVideoIndex === index && (
                  <div className="mt-2 h-0.5 bg-gradient-to-r from-blue-500 to-transparent" />
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Player;
