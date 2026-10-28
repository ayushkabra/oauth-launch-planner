@echo off
echo ========================================================
echo Pushing OAuth Launch Planner to GitHub
echo ========================================================
cd /d "%~dp0"

echo [1/3] Initializing Git repository...
git init

echo [2/3] Adding files and creating initial commit...
git add .
git commit -m "feat: OAuth Launch Planner & Feasibility Engine - Composio APM Integrations"

echo.
echo [3/3] Ready to push to GitHub!
echo.
echo Option A (Using GitHub CLI):
echo    gh repo create oauth-launch-planner --public --source=. --remote=origin --push
echo.
echo Option B (Existing GitHub repository):
echo    git branch -M main
echo    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
echo    git push -u origin main
echo.
echo ========================================================
pause
