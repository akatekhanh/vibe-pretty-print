#!/bin/bash

# Build script for vibe-pretty-print
# Usage: ./build.sh [python|js|both]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PYTHON_DIR="$SCRIPT_DIR/python_repos"
JS_DIR="$SCRIPT_DIR/js_repos"

BLUE='\033[0;34m'
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log() {
    echo -e "${BLUE}[BUILD]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

build_python() {
    log "Building Python package..."
    cd "$PYTHON_DIR"
    
    if [ ! -f "pyproject.toml" ]; then
        error "Python package not found in $PYTHON_DIR"
        exit 1
    fi
    
    # Clean previous builds
    rm -rf dist/ build/ *.egg-info/
    
    # Build package
    python -m build
    
    # Validate package
    if command -v twine >/dev/null 2>&1; then
        twine check dist/*
    else
        warn "twine not found, skipping validation"
    fi
    
    success "Python package built successfully"
    echo "Files created:"
    ls -la dist/
}

build_js() {
    log "Building JavaScript package..."
    cd "$JS_DIR"
    
    if [ ! -f "package.json" ]; then
        error "JavaScript package not found in $JS_DIR"
        exit 1
    fi
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        log "Installing dependencies..."
        npm install
    fi
    
    # Run tests
    log "Running tests..."
    npm test
    
    # Dry run to validate package
    log "Validating package..."
    npm publish --dry-run
    
    success "JavaScript package validated successfully"
}

show_help() {
    echo "Usage: $0 [python|js|both]"
    echo ""
    echo "Commands:"
    echo "  python  - Build only Python package"
    echo "  js      - Build only JavaScript package"
    echo "  both    - Build both packages (default)"
    echo ""
    echo "Examples:"
    echo "  $0 python"
    echo "  $0 js"
    echo "  $0 both"
}

# Main execution
TARGET="${1:-both}"

case "$TARGET" in
    python)
        build_python
        ;;
    js)
        build_js
        ;;
    both)
        build_python
        echo ""
        build_js
        ;;
    help|-h|--help)
        show_help
        ;;
    *)
        error "Invalid target: $TARGET"
        show_help
        exit 1
        ;;
esac

success "Build completed!"