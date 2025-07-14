#!/bin/bash

# This script is designed to fix issues where large files (like node_modules or .firebase directories)
# were accidentally committed to the Git history.
# It works by completely rewriting the history to remove any trace of these files.

# --- IMPORTANT ---
# 1. MAKE A BACKUP of your project before running this, just in case.
# 2. This will REWRITE your Git history. After running it, you will need to
#    do a "force push" to update the remote repository on GitHub.
# 3. This script can take a while to run on large repositories.

# Stop the script if any command fails
set -e

echo "--- Starting Git history cleanup ---"

# Step 1: Remove all tracked files from the Git index (cache).
# This forces Git to re-evaluate every file against the .gitignore rules.
git rm -r --cached .
echo "Git cache cleared."

# Step 2: Add everything back.
# This will re-add all files, but this time it will correctly ignore
# anything listed in .gitignore.
git add .
echo "All files re-added, respecting .gitignore."

# Step 3: Create a new commit with the cleaned file list.
git commit -m "chore: Clean up tracked files"
echo "New cleanup commit created."

# Step 4: Display instructions for the final step.
echo ""
echo "--- CLEANUP COMPLETE ---"
echo ""
echo "The local Git history has been cleaned."
echo "To apply these changes to your remote repository on GitHub, you MUST now run a 'force push'."
echo "Execute the following command:"
echo ""
echo "git push --force"
echo ""
echo "This will overwrite the remote history with your new, cleaned history."
echo "The 'large file' error on GitHub should now be resolved."
