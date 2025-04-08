import { desc, and, eq, isNull } from 'drizzle-orm';
import { db } from './drizzle';
import { activityLogs, teamMembers, teams, users, cvData } from './schema';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth/session';
import type { NewCVData, CVData } from './schema';

export async function getUser() {
  const sessionCookie = (await cookies()).get('session');
  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  const sessionData = await verifyToken(sessionCookie.value);
  if (
    !sessionData ||
    !sessionData.user ||
    typeof sessionData.user.id !== 'number'
  ) {
    return null;
  }

  if (new Date(sessionData.expires) < new Date()) {
    return null;
  }

  const user = await db
    .select()
    .from(users)
    .where(and(eq(users.id, sessionData.user.id), isNull(users.deletedAt)))
    .limit(1);

  if (user.length === 0) {
    return null;
  }

  return user[0];
}

export async function getTeamByStripeCustomerId(customerId: string) {
  const result = await db
    .select()
    .from(teams)
    .where(eq(teams.stripeCustomerId, customerId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function updateTeamSubscription(
  teamId: number,
  subscriptionData: {
    stripeSubscriptionId: string | null;
    stripeProductId: string | null;
    planName: string | null;
    subscriptionStatus: string;
  },
) {
  await db
    .update(teams)
    .set({
      ...subscriptionData,
      updatedAt: new Date(),
    })
    .where(eq(teams.id, teamId));
}

export async function getUserWithTeam(userId: number) {
  const result = await db
    .select({
      user: users,
      teamId: teamMembers.teamId,
    })
    .from(users)
    .leftJoin(teamMembers, eq(users.id, teamMembers.userId))
    .where(eq(users.id, userId))
    .limit(1);

  return result[0];
}

export async function getActivityLogs() {
  const user = await getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  return await db
    .select({
      id: activityLogs.id,
      action: activityLogs.action,
      timestamp: activityLogs.timestamp,
      ipAddress: activityLogs.ipAddress,
      userName: users.name,
    })
    .from(activityLogs)
    .leftJoin(users, eq(activityLogs.userId, users.id))
    .where(eq(activityLogs.userId, user.id))
    .orderBy(desc(activityLogs.timestamp))
    .limit(10);
}

export async function getTeamForUser(userId: number) {
  const result = await db.query.users.findFirst({
    where: eq(users.id, userId),
    with: {
      teamMembers: {
        with: {
          team: {
            with: {
              teamMembers: {
                with: {
                  user: {
                    columns: {
                      id: true,
                      name: true,
                      email: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return result?.teamMembers[0]?.team || null;
}

// CV Data Queries
export async function createCVData(data: NewCVData): Promise<CVData | null> {
  try {
    const result = await db.insert(cvData).values(data).returning();
    return result[0] || null;
  } catch (error) {
    console.error('Error creating CV data:', error);
    return null;
  }
}

export async function getCVDataById(id: number): Promise<CVData | null> {
  try {
    const result = await db
      .select()
      .from(cvData)
      .where(eq(cvData.id, id))
      .limit(1);
    return result[0] || null;
  } catch (error) {
    console.error('Error getting CV data by ID:', error);
    return null;
  }
}

export async function getCVDataByFileId(
  fileId: string,
): Promise<CVData | null> {
  try {
    const result = await db
      .select()
      .from(cvData)
      .where(eq(cvData.fileId, fileId))
      .limit(1);
    return result[0] || null;
  } catch (error) {
    console.error('Error getting CV data by file ID:', error);
    return null;
  }
}

export async function getUserCVData(userId: number): Promise<CVData[]> {
  try {
    return await db
      .select()
      .from(cvData)
      .where(eq(cvData.userId, userId))
      .orderBy(desc(cvData.uploadedAt));
  } catch (error) {
    console.error('Error getting user CV data:', error);
    return [];
  }
}

export async function deleteCVData(id: number): Promise<boolean> {
  try {
    const result = await db.delete(cvData).where(eq(cvData.id, id)).returning();
    return result.length > 0;
  } catch (error) {
    console.error('Error deleting CV data:', error);
    return false;
  }
}
