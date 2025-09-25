set BRANCH
if "%BRANCH%"=="" set BRANCH=development

git checkout %BRANCH%

git pull origin %BRANCH%