TP 1 : Fondamentaux, Routing & SSR

1.2 Explorer la structure

Q1 : Différences de structure entre Vite et Next.js

Routing : En Vite, on utilise une bibliothèque externe (react-router-dom) et le routing est défini par le code. En Next.js, c'est le système de fichiers (App Router) : un dossier = une route.

Points d'entrée : main.tsx devient layout.tsx (le cadre global) et App.tsx devient page.tsx (le contenu spécifique).

2.2 Page Login

Q2 : Combien de fichiers pour cette route ?

Next.js : 1 seul fichier (app/login/page.tsx).

React Router : 3 étapes au moins (créer le composant, l'importer dans App.tsx, ajouter la balise <Route />).

2.4 Route dynamique

Q3 : Récupération de l'ID (params)

Différence : En React, useParams() est un hook côté client. En Next.js, params est une Promise passée en propriété au composant côté serveur. Cela permet de récupérer l'ID avant même que le navigateur ne reçoive la page.

4.1 Server Component - Fetch

Q5 : Lignes de code pour charger les données

React (CSR) : ~15-20 lignes (2 hooks useState, 1 useEffect, gestion du loading, du fetch et des erreurs).

Next.js (SSR) : ~3-5 lignes. C'est une simple fonction async.

Q6 : Requête dans l'onglet Network (F12)

Réponse : Non, on ne voit pas la requête GET /projects.

Pourquoi : La requête est faite par le serveur de Next.js directement vers le backend. Le navigateur reçoit le HTML final "déjà rempli".

5.1 Client Component

Q7 : Pourquoi 'use client' pour le Login ?

Le Dashboard n'est que de l'affichage (Server Component).

Le Login utilise des hooks (useState) et des événements (onSubmit), ce qui nécessite du JavaScript interactif dans le navigateur.

Q8 : Équivalent de useNavigate()

C'est le hook useRouter() importé de next/navigation.

6.1 View Source (Preuve)

Q9 (React SPA) : On voit un HTML vide (<div id="root"></div>) et un script. Pas de noms de projets.
Q10 (Next.js) : On voit tout le texte et les noms des projets directement dans le code source. C'est la magie du SSR (Server Side Rendering).

TP 2 : Server Actions, API & Auth

1.3 Server Action

Q1 : Mise à jour du Dashboard après ajout

React SPA : Il fallait manuellement mettre à jour le state (setProjects([...])).

Next.js : On utilise revalidatePath('/dashboard'). Le serveur recharge les données et met à jour l'interface automatiquement.

2.3 Boutons Rename/Delete

Q3 : Pourquoi un  et pas un onClick ?

Le Dashboard est un Server Component. Les Server Components ne supportent pas le JavaScript interactif (onClick). Le formulaire est le moyen natif du Web pour envoyer des actions au serveur sans avoir besoin de JS.

3.2 API Routes

Q4 : Test de /api/projects

On voit le JSON brut. L'application Next.js fait maintenant office de Backend.

Q5 : API Route vs Server Action

API Route : Un endpoint URL public (ex: pour une app mobile).

Server Action : Une fonction serveur appelée directement depuis un formulaire (plus simple, pas besoin de gérer des URLs).

4.2 Auth & Cookies

Q6 : Simplification du Login

On gagne beaucoup de useState grâce à useActionState qui gère automatiquement l'état du formulaire et les erreurs renvoyées par le serveur.

Q7 : Cookie session & HttpOnly

Oui, on voit le cookie dans l'onglet Application. Mais si on tape document.cookie en console, il est invisible/illisible. C'est une protection contre les attaques XSS.

5.1 Middleware

Q8 : Redirection (Flash effect)

React SPA : On voyait le dashboard une fraction de seconde (fuite de contenu).

Next.js : Zéro flash. Le middleware bloque l'accès côté serveur. Le navigateur ne reçoit rien s'il n'est pas autorisé.

Q9 : Emplacement du middleware

Il doit être à la racine pour intercepter toutes les requêtes entrant dans l'application, avant même qu'elles n'atteignent le dossier app/.

6.2 Layout & User

Q10 : Lecture du user dans Layout

React SPA : On utilisait un AuthContext.Provider.

Next.js : On lit directement les cookies via la fonction cookies() de Next.js (Server Side).

7.1 Réflexion Finale

Q12 : Avantage Sécurité

Les cookies HttpOnly empêchent le vol de session par JavaScript. Le Middleware empêche l'affichage de données sensibles avant même que la page ne soit générée.

Q13 : Indépendance de json-server

Oui, les API Routes fonctionnent toujours car elles lisent/écrivent directement dans db.json via le module fs de Node.js, sans passer par un serveur tiers.

Q14 : Cookie & XSS

Non. Un script malveillant injecté (XSS) ne peut pas accéder à un cookie marqué HttpOnly. C'est le standard de sécurité le plus élevé pour l'authentification web.
