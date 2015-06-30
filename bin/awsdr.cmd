@SETLOCAL
@SET PATHEXT=%PATHEXT:;.JS;=;%
node  "%~dp0\awsdr" %*
