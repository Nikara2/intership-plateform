-- Script pour créer un profil d'entreprise pour les utilisateurs existants qui n'en ont pas

-- 1. Vérifier les utilisateurs COMPANY sans profil d'entreprise
SELECT u.id, u.email, u.role 
FROM users u
LEFT JOIN companies c ON c.user_id = u.id
WHERE u.role = 'COMPANY' AND c.id IS NULL;

-- 2. Créer un profil d'entreprise pour ces utilisateurs
-- Remplacez 'USER_ID_HERE' par l'ID de votre utilisateur
-- Vous pouvez obtenir l'ID depuis la requête ci-dessus

INSERT INTO companies (user_id, name, description, created_at, updated_at)
SELECT 
  id,
  CONCAT(UPPER(SUBSTRING(email, 1, 1)), SUBSTRING(SPLIT_PART(email, '@', 1), 2)),
  'Profil à compléter',
  NOW(),
  NOW()
FROM users
WHERE role = 'COMPANY' 
  AND id NOT IN (SELECT user_id FROM companies WHERE user_id IS NOT NULL);
