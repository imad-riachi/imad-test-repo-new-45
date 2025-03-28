import { desc, and, eq, isNull } from 'drizzle-orm';
import { db } from './drizzle';
import {
  activityLogs,
  teamMembers,
  teams,
  users,
  cvData,
  jobDescriptions,
} from './schema';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth/session';

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

export async function getUserLatestCV() {
  const user = await getUser();
  if (!user) {
    return null;
  }

  const result = await db.query.cvData.findMany({
    where: eq(cvData.userId, user.id),
    orderBy: [desc(cvData.createdAt)],
    limit: 1,
  });

  return result.length > 0 ? result[0] : null;
}

// Get the user's active job description
export async function getUserActiveJobDescription() {
  const user = await getUser();
  if (!user) {
    return null;
  }

  const result = await db.query.jobDescriptions.findMany({
    where: and(
      eq(jobDescriptions.userId, user.id),
      eq(jobDescriptions.isActive, true),
    ),
    orderBy: [desc(jobDescriptions.createdAt)],
    limit: 1,
  });

  return result.length > 0 ? result[0] : null;
}

// Save a new job description
export async function saveJobDescription(content: string) {
  const user = await getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  // Get the latest CV for the user
  const latestCV = await getUserLatestCV();
  if (!latestCV) {
    throw new Error('No CV found - please upload your CV first');
  }

  // First, deactivate any existing active job descriptions
  await db
    .update(jobDescriptions)
    .set({
      isActive: false,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(jobDescriptions.userId, user.id),
        eq(jobDescriptions.isActive, true),
      ),
    );

  // Then, create a new active job description
  const result = await db
    .insert(jobDescriptions)
    .values({
      userId: user.id,
      cvId: latestCV.id,
      content,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return result[0];
}

// Delete a job description
export async function deleteJobDescription(id: number) {
  const user = await getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  await db
    .delete(jobDescriptions)
    .where(
      and(eq(jobDescriptions.id, id), eq(jobDescriptions.userId, user.id)),
    );
}
