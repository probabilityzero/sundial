# Supabase Schema Updates for User Settings

To implement the user settings functionality, the following updates are needed in the Supabase database schema:

## `sessions` Table

*   **`user_id`** (`UUID REFERENCES auth.users NOT NULL`): Foreign key referencing the `auth.users` table.

## `user_settings` Table

*   **`id`** (`UUID PRIMARY KEY DEFAULT gen_random_uuid()`): Unique identifier for the user settings.
*   **`user_id`** (`UUID REFERENCES auth.users NOT NULL`): Foreign key referencing the `auth.users` table.
*   **`circle_color`** (`TEXT`): Stores the selected circle color (e.g., '#007bff').
*   **`available_tags`** (`TEXT[]`): Stores the list of available tags in the popover.

## SQL Migration

Here's an example SQL migration script to apply these changes:

```sql
-- Add user_id column to sessions table
ALTER TABLE sessions
ADD COLUMN user_id UUID REFERENCES auth.users;

-- Enable RLS on the user_settings table
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Create the read policy
CREATE POLICY "Enable read access for users based on user_id" ON user_settings
AS PERMISSIVE FOR SELECT
TO AUTHENTICATED
USING (auth.uid() = user_id);

-- Create the update policy
CREATE POLICY "Enable update access for users based on user_id" ON user_settings
AS PERMISSIVE FOR UPDATE
TO AUTHENTICATED
USING (auth.uid() = user_id);

-- Enable RLS on the sessions table
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Create the read policy
CREATE POLICY "Enable read access for users based on user_id" ON sessions
AS PERMISSIVE FOR SELECT
TO AUTHENTICATED
USING (auth.uid() = user_id);

-- Create the insert policy
CREATE POLICY "Enable insert access for users" ON sessions
AS PERMISSIVE FOR INSERT
TO AUTHENTICATED
WITH CHECK (auth.uid() = user_id);

-- Create the update policy
CREATE POLICY "Enable update access for users based on user_id" ON sessions
AS PERMISSIVE FOR UPDATE
TO AUTHENTICATED
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create the delete policy
CREATE POLICY "Enable delete access for users based on user_id" ON sessions
AS PERMISSIVE FOR DELETE
TO AUTHENTICATED
USING (auth.uid() = user_id);
```

## Important Considerations

*   **Enable RLS**: Make sure to enable RLS on each table before creating the policies.
*   **`auth.uid()`**: This function returns the UUID of the currently authenticated user.
*   **`user_id` Column**: Ensure that the `user_id` column is correctly set when inserting new data.
*   **Testing**: Thoroughly test your RLS policies to ensure that they are working as expected.
