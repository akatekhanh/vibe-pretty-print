#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting publish process for vibe-pretty-print...${NC}"

# Check if we're on main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo -e "${RED}Error: Must be on main branch to publish. Current branch: $CURRENT_BRANCH${NC}"
    exit 1
fi

Check if working directory is clean
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${RED}Error: Working directory must be clean. Please commit or stash changes.${NC}"
    git status
    exit 1
fi

# Check if version parameter is provided
if [ -z "$1" ]; then
    echo -e "${RED}Error: Version parameter required.${NC}"
    echo "Usage: ./publish.sh <version>"
    echo "Example: ./publish.sh 0.1.2"
    exit 1
fi

VERSION=$1
echo -e "${GREEN}Publishing version: $VERSION${NC}"

# Function to publish Python package
publish_python() {
    echo -e "${YELLOW}Publishing Python package to PyPI...${NC}"
    
    cd python_repos
    
    # Update version in pyproject.toml
    echo "Updating version in pyproject.toml..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/version = \".*\"/version = \"$VERSION\"/" pyproject.toml
    else
        sed -i "s/version = \".*\"/version = \"$VERSION\"/" pyproject.toml
    fi
    
    # Build package
    echo "Building Python package..."
    python -m build
    
    # Check if package builds successfully
    if [ $? -ne 0 ]; then
        echo -e "${RED}Error: Python package build failed${NC}"
        exit 1
    fi
    
    # Upload to PyPI
    echo "Uploading to PyPI..."
    twine upload dist/*
    
    cd ..
    echo -e "${GREEN}Python package published successfully!${NC}"
}

# Function to publish JS package
publish_js() {
    echo -e "${YELLOW}Publishing JS package to npm...${NC}"
    
    cd js_repos
    
    # Update version in package.json
    echo "Updating version in package.json..."
    npm version $VERSION --no-git-tag-version
    
    # Build package
    echo "Building JS package..."
    npm run build
    
    # Check if package builds successfully
    if [ $? -ne 0 ]; then
        echo -e "${RED}Error: JS package build failed${NC}"
        exit 1
    fi
    
    # Publish to npm
    echo "Publishing to npm..."
    npm publish
    
    cd ..
    echo -e "${GREEN}JS package published successfully!${NC}"
}

# Check if required tools are installed
echo "Checking required tools..."

# Check Python
if ! command -v python &> /dev/null; then
    echo -e "${RED}Error: Python is not installed${NC}"
    exit 1
fi

# Check pip
if ! command -v pip &> /dev/null; then
    echo -e "${RED}Error: pip is not installed${NC}"
    exit 1
fi

# Check build tools
if ! python -c "import build" &> /dev/null; then
    echo -e "${YELLOW}Installing build tools...${NC}"
    pip install build twine
fi

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: npm is not installed${NC}"
    exit 1
fi

# Check if user is logged in to npm
if ! npm whoami &> /dev/null; then
    echo -e "${RED}Error: Not logged in to npm. Run 'npm login' first.${NC}"
    exit 1
fi

# Check if user is logged in to PyPI
# if ! cd python_repos && twine check dist/* &> /dev/null; then
#     echo -e "${RED}Error: Not logged in to PyPI. Run 'twine login' first.${NC}"
#     exit 1
# fi

# Confirm before publishing
echo -e "${YELLOW}This will publish version $VERSION to both PyPI and npm.${NC}"
read -p "Are you sure you want to continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Publishing cancelled."
    exit 0
fi

# Run tests before publishing
echo -e "${YELLOW}Running tests before publishing...${NC}"

# Python tests
cd python_repos
if [ -f "pytest.ini" ] || [ -d "tests" ]; then
    echo "Running Python tests..."
    python -m pytest
    if [ $? -ne 0 ]; then
        echo -e "${RED}Error: Python tests failed${NC}"
        exit 1
    fi
fi
cd ..

# JS tests
cd js_repos
if [ -f "package.json" ]; then
    echo "Running JS tests..."
    npm test
    if [ $? -ne 0 ]; then
        echo -e "${RED}Error: JS tests failed${NC}"
        exit 1
    fi
fi
cd ..

# Publish packages
publish_python
publish_js

# Create git tag and push
echo -e "${YELLOW}Creating git tag and pushing...${NC}"
git tag -a v$VERSION -m "Release version $VERSION"
git push origin main
git push origin v$VERSION

echo -e "${GREEN}All packages published successfully! Version $VERSION is now live.${NC}"