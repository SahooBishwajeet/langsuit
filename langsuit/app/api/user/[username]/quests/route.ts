import  db from '@/db/drizzle';  // Adjusted based on the tree structure
import { userQuests, Quests } from '@/db/schema';  // Adjusted path
import { eq } from 'drizzle-orm';

export async function GET(req: Request, { params }: { params: { username: string } }) {
    const { username } = params;

    
    const userQuestsData = await db
        .select({
            id: Quests.id,
            title: Quests.title,
            description: Quests.description,
            rewardPoints: Quests.rewardPoints,
            expiresAt: Quests.expiresAt,
            progress: userQuests.progress,
            completed: userQuests.completed,
        })
        .from(userQuests)
        .leftJoin(Quests, eq(userQuests.questId, Quests.id))
        .where(eq(userQuests.userId, username));  
        
    return new Response(JSON.stringify(userQuestsData));
}