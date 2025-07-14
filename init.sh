#!/bin/bash
# This script cleans the Git history to completely remove large, unwanted
# directories like `.firebase`, `.next`, and `node_modules`. This is necessary
# when these files were accidentally committed in the past.

# --- WARNING ---
# This script REWRITES your Git history.
# This is a safe operation if you are the only one working on the repo,
# but be cautious if you are collaborating with others.

echo "Starting deep clean of Git history..."

# Ensure we have the latest .gitignore rules applied
git add .gitignore
git commit -m "chore: Update .gitignore before history cleanup" --no-verify || echo "No changes to .gitignore."

# Step 1: Remove the large directories from all of your Git history.
# This command goes through every commit and removes the specified folders.
git filter-branch --force --index-filter \
  "git rm -r --cached --ignore-unmatch .firebase .next node_modules" \
  --prune-empty --tag-name-filter cat -- --all

echo "History rewritten. Large directories have been removed."

# Step 2: Clean up Git's internal references
git for-each-ref --format='delete %(refname)' refs/original | git update-ref --stdin
git reflog expire --expire=now --all
git gc --prune=now

echo "Git cleanup complete."
echo ""
echo "-------------------"
echo "  NEXT STEPS (VERY IMPORTANT)"
echo "-------------------"
echo "1. The history of your local branch has been changed."
echo "2. You MUST now 'force push' to update the remote repository on GitHub."
echo ""
echo "   Run this command now:"
echo "   git push --force"
echo ""
echo "After this, your push issues will be resolved."
