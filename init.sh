#!/bin/bash
# This script cleans the Git cache to ensure that files and folders
# listed in .gitignore are correctly ignored, even if they were
# accidentally committed in the past.

# Run this script once from the root of your project.

echo "Cleaning the Git cache..."

# Remove all files from the Git cache
git rm -r --cached .

echo "Cache cleaned."

# Re-add all files, respecting the .gitignore rules
git add .

echo "Files re-indexed, respecting .gitignore."

# Create a new commit to save the cleanup
git commit -m "chore: Clean git history and apply .gitignore"

echo "Done. You can now 'git push' without the large files."
echo "Remember to make this script executable with: chmod +x init.sh"
echo "Then run it with: ./init.sh"
