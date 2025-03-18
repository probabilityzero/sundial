# Supabase Row Level Security (RLS) Policies

## `user_settings` Table

*   **Policy Name**: `Enable read access for users based on user_id`
*   **Policy Expression**: `auth.uid() = user_id`
*   **Description**: This policy allows users to read their own `user_settings` data.

*   **Policy Name**: `Enable update access for users based on user_id`
*   **Policy Expression**: `auth.uid() = user_id`
*   **Description**: This policy allows users to update their own `user_settings` data.

## `sessions` Table

*   **Policy Name**: `Enable read access for users based on user_id`
*   **Policy Expression**: `auth.uid() = user_id`
*   **Description**: This policy allows users to read `sessions` data that they created.

*   **Policy Name**: `Enable insert access for users`
*   **Policy Expression**: `auth.uid() = user_id`
*   **Description**: This policy allows users to insert `sessions` data, setting the `user_id` to their own user ID.

*   **Policy Name**: `Enable update access for users based on user_id`
*   **Policy Expression**: `auth.uid() = user_id`
*   **Description**: This policy allows users to update `sessions` data that they created.

*   **Policy Name**: `Enable delete access for users based on user_id`
*   **Policy Expression**: `auth.uid() = user_id`
*   **Description**: This policy allows users to delete `sessions` data that they created.
