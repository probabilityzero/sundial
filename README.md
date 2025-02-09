# Supabase Schema Updates for User Settings

To implement the user settings functionality, the following updates are needed in the Supabase database schema:

## `sessions` Table

*   (No changes)

## `user_settings` Table

*   **`id`** (`UUID PRIMARY KEY DEFAULT gen_random_uuid()`): Unique identifier for the user settings.
*   **`--user_id`** (`UUID REFERENCES auth.users NOT NULL`): Foreign key referencing the `auth.users` table. -- Commented out for now
*   **`circle_color`** (`TEXT`): Stores the selected circle color (e.g., '#007bff').
*   **`available_tags`** (`TEXT[]`): Stores the list of available tags in the popover.

## SQL Migration

Here's an example SQL migration script to apply these changes:

```sql
-- Remove default_tag column from user_settings table
ALTER TABLE user_settings
DROP COLUMN IF EXISTS default_tag;

-- Drop sub_sessions table
DROP TABLE IF EXISTS sub_sessions;
```

## Considerations

*   **User Authentication**: This schema does not implement user authentication. The `user_id` field is commented out.
*   **Default Values**: Default values are provided for each setting.
*   **Data Types**: The `TEXT[]` data type is used to store the list of available tags.
