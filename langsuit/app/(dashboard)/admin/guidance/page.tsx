import db from "@/db/drizzle";
import { guidance } from "@/db/schema";
import { eq } from "drizzle-orm";
import { GuidanceList } from "./_components/guidance-list";

const GuidancePage = async () => {
  const guidances = await db.query.guidance.findMany({
    with: {
      instructor: {
        with: {
          user: true,
        },
      },
    },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Guidance Management</h1>
      <GuidanceList guidances={guidances} /> 
    </div>
  );
};

export default GuidancePage; 