# Utiliser une image officielle Node.js
FROM node:18-alpine

# Installer Python et make pour node-gyp
RUN apk add --no-cache python3 make g++

# Définir le répertoire de travail
WORKDIR /app

# Copier uniquement les fichiers nécessaires pour npm install
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers
COPY . .

# Exposer le port de l'application
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["npm", "start"]
