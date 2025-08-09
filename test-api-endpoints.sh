#!/bin/bash

# This script tests the API endpoints in a production environment
# Usage: ./test-api-endpoints.sh [base_url]

# Default to localhost if no URL is provided
BASE_URL=${1:-http://localhost:3000}

# Text colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Testing API endpoints on ${BASE_URL}${NC}"
echo "==============================================="

# Function to test an endpoint
test_endpoint() {
  local endpoint=$1
  local description=$2
  
  echo -e "\n${YELLOW}Testing: ${description} (${endpoint})${NC}"
  echo "----------------------------------------------"
  
  # Send the request and capture response code
  response=$(curl -s -o response.json -w "%{http_code}" "${BASE_URL}${endpoint}")
  
  if [ "$response" -ge 200 ] && [ "$response" -lt 300 ]; then
    echo -e "${GREEN}✓ Success (HTTP ${response})${NC}"
    echo "Response preview:"
    # Extract and format the JSON for better readability
    if command -v jq &> /dev/null; then
      jq -r '.' response.json | head -n 15
      lines=$(jq -r '.' response.json | wc -l)
      if [ "$lines" -gt 15 ]; then
        echo -e "${YELLOW}... (${lines} lines total, showing first 15)${NC}"
      fi
    else
      # If jq is not available, use a simple approach
      head -n 15 response.json
    fi
  else
    echo -e "${RED}✗ Failed (HTTP ${response})${NC}"
    cat response.json
  fi
  
  echo "----------------------------------------------"
}

# Test basic diagnostic endpoint (no DB)
test_endpoint "/api/diagnostic" "Basic API diagnostic (no DB dependency)"

# Test comprehensive debug endpoint
test_endpoint "/api/debug-comprehensive" "Comprehensive debug (with DB)"

# Test specific database connection
test_endpoint "/api/debug-connection" "Database connection test"

# Test design-specific debugging
test_endpoint "/api/debug-design" "Design table debugging"

# Test database information
test_endpoint "/api/debug-db" "Database information"

# Test actual design endpoint
test_endpoint "/api/designs" "Designs API endpoint"

echo -e "\n${YELLOW}All tests completed${NC}"

# Clean up
rm -f response.json

exit 0
