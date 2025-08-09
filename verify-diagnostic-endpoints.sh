#!/bin/bash

# This script is used to verify the diagnostic endpoints before deployment
# Usage: ./verify-diagnostic-endpoints.sh [base_url]

# Set default base URL if not provided
BASE_URL=${1:-http://localhost:3000}

# Colors for terminal output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}   Diagnostic Endpoints Verification    ${NC}"
echo -e "${BLUE}=========================================${NC}"
echo -e "Testing against: ${YELLOW}${BASE_URL}${NC}\n"

# Function to test an endpoint
test_endpoint() {
  local endpoint=$1
  local name=$2
  
  echo -e "${YELLOW}Testing: ${name}${NC}"
  echo -e "${YELLOW}URL: ${BASE_URL}${endpoint}${NC}"
  
  # Get HTTP status code
  status=$(curl -s -o response.json -w "%{http_code}" "${BASE_URL}${endpoint}")
  
  # Check if status is success (2xx)
  if [[ $status -ge 200 && $status -lt 300 ]]; then
    echo -e "${GREEN}✓ Success (HTTP ${status})${NC}"
    
    # Check if the response is JSON
    if grep -q "^{" response.json; then
      echo -e "${GREEN}✓ Valid JSON response${NC}"
      
      # Display some info from the response
      if command -v jq &> /dev/null; then
        echo -e "\nResponse summary:"
        # Extract useful information based on the endpoint
        case "$endpoint" in
          "/api/diagnostic")
            jq -r '{ status, environment: .environment, timestamp }' response.json
            ;;
          "/api/debug-connection")
            jq -r '{ environment, dbConnectionTest, tablesCount: (.tables | length) }' response.json
            ;;
          "/api/debug-db")
            jq -r '{ status, tablesCount: (.tables | length) }' response.json
            ;;
          "/api/debug-design")
            jq -r '{ designTableExists, designCount }' response.json
            ;;
          "/api/debug-comprehensive")
            jq -r '{ timestamp, dbConnection: .databaseConnection.success, tablesFound: (.tableStructure.success // false) }' response.json
            ;;
          *)
            jq -r '. | keys' response.json
            ;;
        esac
      else
        echo "Install jq for better JSON formatting"
        head -n 10 response.json
      fi
    else
      echo -e "${RED}✗ Response is not valid JSON${NC}"
      cat response.json
    fi
  else
    echo -e "${RED}✗ Failed (HTTP ${status})${NC}"
    cat response.json
  fi
  
  echo -e "\n${BLUE}----------------------------------------${NC}\n"
}

# Test all diagnostic endpoints
test_endpoint "/api/diagnostic" "Basic API Diagnostic"
test_endpoint "/api/debug-connection" "Database Connection Test"
test_endpoint "/api/debug-db" "Database Information"
test_endpoint "/api/debug-design" "Design Table Check"
test_endpoint "/api/debug-comprehensive" "Comprehensive System Diagnostic"

# Clean up
rm -f response.json

echo -e "${BLUE}=========================================${NC}"
echo -e "${GREEN}Verification Completed${NC}"
echo -e "${BLUE}=========================================${NC}"

# Instructions for deployment
echo -e "\n${YELLOW}Next Steps:${NC}"
echo -e "1. Deploy to Vercel"
echo -e "2. Run this script against your Vercel deployment:"
echo -e "   ${GREEN}./verify-diagnostic-endpoints.sh https://your-app.vercel.app${NC}"
echo -e "3. Check for any failed endpoints and investigate using the error messages"
echo -e "4. Fix any issues identified and redeploy if necessary\n"
