/*
  # Add updated_at column to app_state table

  1. Changes
    - Add `updated_at` column to `app_state` table with automatic timestamp updates
    - Set default value to current timestamp
    - Ensure not null constraint

  2. Notes
    - Uses timestamptz for timezone-aware timestamps
    - Automatically updates on each record change
*/

ALTER TABLE app_state 
ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- Update trigger to handle the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';