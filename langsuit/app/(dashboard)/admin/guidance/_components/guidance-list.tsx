"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface Guidance {
  id: number;
  name: string;
  description: string;
  price: number;
  durationInHours: number;
  isApproved: boolean;
  instructor: {
    user: {
      username: string;
    };
  };
}

interface GuidanceListProps {
  guidances: Guidance[];
}

export const GuidanceList = ({ guidances }: GuidanceListProps) => {
  const [approvingId, setApprovingId] = useState<number | null>(null);

  const handleApprove = async (guidanceId: number) => {
    setApprovingId(guidanceId);
    
    try {
      const response = await fetch(`/api/guidance/${guidanceId}/approve`, {
        method: "POST",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to approve guidance");
      }

      toast.success("Guidance approved successfully");
      // Optimistically update the UI instead of reloading
      guidances = guidances.map(g => 
        g.id === guidanceId ? { ...g, isApproved: true } : g
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    } finally {
      setApprovingId(null);
    }
  };

  if (guidances.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No guidance sessions available
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {guidances.map((guidance) => (
        <Card key={guidance.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="truncate">{guidance.name}</CardTitle>
            <p className="text-sm text-muted-foreground">
              By {guidance.instructor?.user?.username || "Unknown instructor"}
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <DetailItem label="Description" value={guidance.description} />
            <DetailItem label="Price" value={`$${guidance.price}`} />
            <DetailItem label="Duration" value={`${guidance.durationInHours} hours`} />
            <DetailItem label="Status" value={guidance.isApproved ? "Approved" : "Pending"} />

            {!guidance.isApproved && (
              <Button
                onClick={() => handleApprove(guidance.id)}
                disabled={approvingId === guidance.id}
                variant={approvingId === guidance.id ? "secondary" : "default"}
                className="w-full mt-4"
              >
                {approvingId === guidance.id ? "Approving..." : "Approve"}
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="font-medium text-sm">{label}:</p>
    <p className="text-sm text-muted-foreground truncate" title={value}>
      {value || "-"}
    </p>
  </div>
);
