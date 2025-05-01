"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogCancel,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Users, Lock } from "lucide-react";
import { useParams } from "next/navigation";
const combineClasses = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

const TicketModal = ({
  seat,
  price,
  isOpen,
  onClose,
  onConfirm,
  userId,
  guidanceId,
}) => {
  const handleConfirm = async () => {
    const [row, column] = seat.split("");
    try {
      console.log(userId);
      const response = await fetch("http://localhost:3000/api/ticket/buy", {
        method: "POST",
        body: JSON.stringify({ userId, guidanceId, row, column }),
      });

      if (response.status === 200) {
        alert("Ticket booked successfully!");
        onConfirm();
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error booking ticket:", error);
      alert("Failed to book the ticket. Please try again.");
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-[url('/api/placeholder/600/300')] bg-cover p-0 max-w-xl overflow-hidden">
        <div className="bg-black/80 p-6 backdrop-blur-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-bold text-amber-500">ADMIT ONE</h3>
              <p className="text-gray-400">Premium Seating</p>
            </div>
            <div className="text-right">
              <div className="text-xl font-mono text-white">
                #
                {Math.floor(Math.random() * 10000)
                  .toString()
                  .padStart(4, "0")}
              </div>
              <div className="text-gray-400">Valid Today Only</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-gray-400 text-sm mb-1">SEAT</p>
              <p className="text-2xl font-mono text-white">{seat}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">PRICE</p>
              <p className="text-2xl font-mono text-white">${price}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">TIME</p>
              <p className="text-lg text-white">19:30</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">DATE</p>
              <p className="text-lg text-white">
                {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6 p-3 bg-gray-800/50 rounded-lg">
            <Users className="text-amber-500 w-6 h-6" />
            <div>
              <div className="text-white">Current Attendees</div>
              <div className="text-sm text-gray-400">143 people attending</div>
            </div>
          </div>

          <AlertDialogFooter className="border-t border-gray-700 pt-4">
            <AlertDialogCancel className="bg-gray-800 text-white hover:bg-gray-700">
              Cancel
            </AlertDialogCancel>
            <Button
              onClick={handleConfirm}
              className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
            >
              Confirm Booking
            </Button>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const SeatGrid = ({
  rows = 5,
  seatsPerRow = 6,
  price = 49.99,
  onSeatSelect = (seat) => console.log(`Selected seat: ${seat}`),
}) => {
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [animatingSeats, setAnimatingSeats] = useState(new Set());
  const [bookedSeats, setBookedSeats] = useState(["A1", "B3", "C4"]);
  const [loading, setLoading] = useState(true);
  const { guidanceId } = useParams();
  const [userId, setUserId] = useState();

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/user/id", {
          method: "GET",
        });
        const data = await response.json();
        setUserId(data.userId);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserId();
  });

  useEffect(() => {
    const fetchBookedSeats = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/ticket/booked",
          {
            method: "POST",
            body: JSON.stringify({ guidanceId }),
          },
        );
        const data = await response.json();
        setBookedSeats(data.bookedTickets);
      } catch (error) {
        console.error("Failed to fetch booked seats:", error);
        setBookedSeats(["A1", "B3", "C4"]);
      } finally {
        setLoading(false);
      }
    };
    if (guidanceId) fetchBookedSeats();
  }, [guidanceId, isModalOpen]);

  const getSeatLabel = (row, seat) => {
    return `${String.fromCharCode(65 + row)}${seat + 1}`;
  };

  const isSeatBooked = (seatLabel) => {
    return bookedSeats.includes(seatLabel);
  };

  const handleSeatClick = (seatLabel) => {
    if (!isSeatBooked(seatLabel)) {
      setAnimatingSeats(new Set([...animatingSeats, seatLabel]));
      setTimeout(() => {
        setAnimatingSeats((prev) => {
          const next = new Set(prev);
          next.delete(seatLabel);
          return next;
        });
      }, 500);

      setSelectedSeat(seatLabel);
      setIsModalOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-amber-500">Loading seats...</div>
      </div>
    );
  }

  return (
    <div className="!max-w-full mx-auto p-6 bg-gray-900 rounded-xl shadow-2xl">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-amber-500 mb-2">
          Select Your Seat
        </h2>
        <div className="text-gray-400">
          Available seats: {rows * seatsPerRow - bookedSeats.length}
        </div>
      </div>

      <div className="w-3/4 h-12 mx-auto mb-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 to-transparent rounded-t-full blur-md"></div>
        <div className="w-full h-2 bg-blue-500/40 rounded-t-full"></div>
        <div className="text-center text-blue-400 text-sm mt-4">SCREEN</div>
      </div>

      <div className="grid gap-8 perspective-1000">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="grid grid-cols-6 gap-4 justify-items-center transform rotate-x-1"
          >
            {Array.from({ length: seatsPerRow }).map((_, seatIndex) => {
              const seatLabel = getSeatLabel(rowIndex, seatIndex);
              const isBooked = isSeatBooked(seatLabel);
              const isSelected = selectedSeat === seatLabel;
              const isAnimating = animatingSeats.has(seatLabel);

              return (
                <Card
                  key={seatLabel}
                  className={combineClasses(
                    "w-16 h-16 cursor-pointer relative group transition-all duration-300",
                    "hover:scale-110 hover:-translate-y-1",
                    isBooked
                      ? "bg-gray-800 cursor-not-allowed overflow-hidden"
                      : "bg-gray-700",
                    isSelected
                      ? "ring-2 ring-amber-500 shadow-amber-500/50 shadow-lg"
                      : "",
                    isAnimating ? "animate-pulse" : "",
                  )}
                  onClick={() => handleSeatClick(seatLabel)}
                >
                  <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                    {seatLabel}
                  </div>

                  {isBooked && (
                    <>
                      <div className="absolute inset-0 flex justify-around">
                        {[...Array(6)].map((_, i) => (
                          <div
                            key={i}
                            className="w-px h-full bg-gray-600"
                            style={{
                              backgroundImage:
                                "linear-gradient(0deg, transparent 0%, gray 30%, gray 70%, transparent 100%)",
                            }}
                          />
                        ))}
                      </div>

                      <div className="absolute inset-0 flex flex-col justify-around">
                        {[...Array(6)].map((_, i) => (
                          <div
                            key={i}
                            className="w-full h-px bg-gray-600"
                            style={{
                              backgroundImage:
                                "linear-gradient(90deg, transparent 0%, gray 30%, gray 70%, transparent 100%)",
                            }}
                          />
                        ))}
                      </div>

                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <Lock className="w-6 h-6 text-gray-500" />
                      </div>
                    </>
                  )}

                  {!isBooked && (
                    <div
                      className={combineClasses(
                        "absolute inset-0 bg-amber-500/80 flex items-center justify-center",
                        "opacity-0 transition-all duration-300 scale-90",
                        "group-hover:opacity-100 group-hover:scale-100 rounded-lg",
                      )}
                    >
                      <div className="text-black font-medium">${price}</div>
                    </div>
                  )}

                  {!isBooked && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="absolute w-2 h-2 bg-amber-400/30 rounded-full animate-ping"></div>
                      <div className="absolute w-1 h-1 bg-amber-400/20 rounded-full animate-ping delay-100"></div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        ))}
      </div>

      <TicketModal
        seat={selectedSeat}
        price={price}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => {
          onSeatSelect(selectedSeat);
          setIsModalOpen(false);
        }}
        guidanceId={guidanceId}
        userId={userId}
      />
    </div>
  );
};

export default SeatGrid;
