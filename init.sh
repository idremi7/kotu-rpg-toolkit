#!/bin/bash
# Ce script nettoie le cache de Git pour s'assurer que les fichiers et dossiers
# listés dans .gitignore sont correctement ignorés, même s'ils ont été
# accidentellement ajoutés à l'historique de Git auparavant.

# À exécuter une seule fois à la racine de votre projet.

echo "Nettoyage du cache de Git..."

# Supprime tous les fichiers du cache de Git
git rm -r --cached .

echo "Cache nettoyé."

# Rajoute tous les fichiers en respectant les règles du .gitignore
git add .

echo "Fichiers ré-indexés en respectant .gitignore."

# Crée un nouveau commit pour enregistrer le nettoyage
git commit -m "chore: Nettoyage de l'historique Git et application de .gitignore"

echo "Terminé. Vous pouvez maintenant 'git push' sans les fichiers volumineux."
echo "N'oubliez pas de rendre ce script exécutable avec : chmod +x init.sh"
echo "Puis exécutez-le avec : ./init.sh"
