set BRANCH=%1
if "%BRANCH%"=="" set BRANCH=development

git checkout %BRANCH% || (
   -echo Failed to checkout branch %BRANCH%.
   pause
   exit /b 1
)

git pull origin %BRANCH% || (
   echo Failed to pull from origin/%BRANCH%.
   pause
   exit /b 1
)

npx roblox-ts || (
   echo roblox-ts build failed.
   pause
   exit /b 1
)