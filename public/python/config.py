# Python Chronicles Configuration
# This file defines the available Python modules and their metadata

PYTHON_MODULES = {
    "hello.py": {
        "title": "Hello World Demo",
        "description": "Demonstrates basic Python concepts including loops, string formatting, and list operations",
        "category": "basics",
        "test_file": "test_hello.py"
    },
    "add.py": {
        "title": "Addition Calculator",
        "description": "Showcases addition operations, functions, and mathematical calculations", 
        "category": "math",
        "test_file": "test_add.py"
    }
}

# Available categories
CATEGORIES = {
    "basics": "Basic Python Concepts",
    "math": "Mathematical Operations",
    "data": "Data Structures",
    "algorithms": "Algorithms & Logic"
}

# File paths
PATHS = {
    "src": "/python/src/",
    "tests": "/python/tests/",
    "docs": "/python/README.md"
}
