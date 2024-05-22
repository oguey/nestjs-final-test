# Évaluation finale NestJS
 
# Noms des participants

Oumou Khairy GUEYE, Maxime Loic NKWEMI


# Commande pour lancer le serveur
Pour lancer le serveur, utilisez le script npm :  npm run start:postgres

#  Communication  avec la base de données

Pour pouvoir communiquer avec notre base de données depuis notre projet NestJS, nous avons configuré l'outil d'ORM Prisma

# Commande pour lancer les tests
Pour lancer les tests, utilisez le script npm :  npm run test:e2e:postgres



### 💾 Base de données

* PostgreSQL via Docker


:
1. Installez [Docker Desktop](https://www.docker.com/products/docker-desktop/) sur votre machine
2. Lancez-le
 ou `npm run start:postgres` (ces scripts démarrent une base de données, puis lancent le serveur en watch mode)

Pour pouvoir communiquer  l'outil d'ORM 

* [Prisma](https://docs.nestjs.com/recipes/prisma)

### 🧪 Tests
Les tests utilisés pour vous noter sont localisés dans le dossier `test`. Considérez-les comme les spécifications du projet, vous n'aurez d'autre choix que de les respecter à la lettre.

🚨 **Il est interdit de modifier les tests.**

Pour lancer ces tests, utilisez le script npm de votre choix : `npm run test:e2e:mongodb` ou `npm run test:e2e:postgres` (ces scripts démarrent une base de données, puis lancent les tests e2e).

NB : Pour les besoins de cette évaluation, vous noterez peut-être que le code des tests e2e n'est pas spécialement clean. Ne faites pas ça chez vous.
