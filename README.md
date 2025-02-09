# Supabase Schema Updates for Dimension Tag

To implement the dimension tag functionality, the following updates are needed in the Supabase database schema:

## `sessions` Table

*   **`dimension`** (`TEXT`): Stores the selected dimension tag for the session (e.g., 'working', 'studying').

## SQL Migration

Here's an example SQL migration script to apply these changes:

```sql
-- Add dimension column to sessions table
ALTER TABLE sessions
ADD COLUMN dimension TEXT;
```

## Considerations

*   **Predefined Tags**: The application will use a set of predefined tags. There will be no option to add custom tags.
*   **Session Level**: The dimension tag is associated with the session.
