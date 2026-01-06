-- Confirm the demo user's email
UPDATE auth.users 
SET email_confirmed_at = now(), 
    updated_at = now()
WHERE email = 'studixa@gmail.com';