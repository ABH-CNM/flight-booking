echo off
set arg=%1
shift
start cmd /k call "C:\Program Files\MongoDB\Server\3.2\bin\mongod" --dbpath "your-dbpath"

if "%arg%" == "front" (
    start cmd /k npm run watch-front
    start cmd /k sass --watch --style expanded --cache-location ./tmp/.sass-cache public/scss/style.scss:public/css/style.css
    node server
) else if "%arg%" == "back" (
    npm run watch-back
)
