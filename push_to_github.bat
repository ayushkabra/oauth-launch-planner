@echo off
echo ========================================================
echo Syncing & Pushing OAuth Launch Planner to GitHub
echo ========================================================
cd /d "%~dp0"

git add .
git commit -m "fix: resolve stray quotes in investigator spec & update README links"
git push origin master

echo.
echo ========================================================
echo Push complete! Check your repository:
echo https://github.com/ayushkabra/oauth-launch-planner
echo ========================================================
pause
