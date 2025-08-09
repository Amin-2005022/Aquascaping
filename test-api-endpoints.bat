@echo off
setlocal enabledelayedexpansion

REM This script tests the API endpoints in a production environment
REM Usage: test-api-endpoints.bat [base_url]

REM Default to localhost if no URL is provided
set BASE_URL=%1
if "%BASE_URL%"=="" set BASE_URL=http://localhost:3000

echo Testing API endpoints on %BASE_URL%
echo ===============================================

REM Check if curl is available
where curl >nul 2>&1
if %ERRORLEVEL% neq 0 (
  echo Error: curl command not found. Please install curl.
  exit /b 1
)

REM Function to test an endpoint
:test_endpoint
set endpoint=%~1
set description=%~2

echo.
echo Testing: %description% (%endpoint%)
echo ----------------------------------------------

REM Send the request and capture response
curl -s -o response.json "%BASE_URL%%endpoint%"
if %ERRORLEVEL% equ 0 (
  echo Success: Endpoint is accessible
  echo Response preview:
  type response.json | findstr /N "." | findstr /B "^[1-9]:" 
  echo ... (response may be truncated)
) else (
  echo Failed: Could not access endpoint
)

echo ----------------------------------------------
goto :eof

REM Main test execution
call :test_endpoint "/api/diagnostic" "Basic API diagnostic (no DB dependency)"
call :test_endpoint "/api/debug-comprehensive" "Comprehensive debug (with DB)"
call :test_endpoint "/api/debug-connection" "Database connection test"
call :test_endpoint "/api/debug-design" "Design table debugging"
call :test_endpoint "/api/debug-db" "Database information"
call :test_endpoint "/api/designs" "Designs API endpoint"

echo.
echo All tests completed

REM Clean up
del response.json

endlocal
