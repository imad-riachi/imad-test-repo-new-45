# Job Description Migration Fix

## Issue

We encountered an error when processing job descriptions:

```
Failed to process job description: Error: column job_descriptions.is_active does not exist
```

This happened because our codebase was using the `is_active` column in the `job_descriptions` table, but this column didn't exist in the actual database.

## Analysis

1. The schema definition in `lib/db/schema.ts` included the `isActive` field:

```typescript
export const jobDescriptions = pgTable('job_descriptions', {
  // ...
  isActive: boolean('is_active').notNull().default(true),
  // ...
});
```

2. The database functions in `lib/db/queries.ts` were using this field:

```typescript
// When querying for the active job description
where: and(
  eq(jobDescriptions.userId, user.id),
  eq(jobDescriptions.isActive, true),
)
  // When saving a new job description
  .values({
    // ...
    isActive: true,
    // ...
  });
```

3. But the actual database table did not have this column, as shown in the table inspection:

```
Table "public.job_descriptions"
   Column   |            Type             | Collation | Nullable | Default
------------+-----------------------------+-----------+----------+-------------
 id         | integer                     |           | not null | nextval(...)
 user_id    | integer                     |           | not null |
 cv_id      | integer                     |           | not null |
 content    | text                        |           | not null |
 created_at | timestamp without time zone |           | not null | now()
 updated_at | timestamp without time zone |           | not null | now()
```

## Solution

We added the missing column directly to the database:

```sql
ALTER TABLE job_descriptions ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE;
```

This migration fixed the issue by aligning the database structure with what our code expected.

The `is_active` column is used to track which job description is currently active for a user. When a new job description is created, it's marked as active, and any previously active ones are deactivated.

## Verification

We verified the solution by running a query that shows the column now exists:

```sql
SELECT * FROM job_descriptions LIMIT 1;
```

Output:

```
 id | user_id | cv_id | content | created_at | updated_at | is_active
----+---------+-------+---------+------------+------------+-----------
(0 rows)
```
