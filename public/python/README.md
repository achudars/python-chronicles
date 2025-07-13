# Python Chronicles - Python Modules

This directory contains the Python source files and their corresponding test suites for the Python Chronicles project.

## Directory Structure

```
python/
├── src/                    # Source Python files
│   ├── hello.py           # Hello world demonstration script
│   └── add.py             # Addition operations demonstration script
├── tests/                 # Test files (following pytest conventions)
│   ├── test_hello.py      # Tests for hello.py
│   └── test_add.py        # Tests for add.py
└── README.md              # This file
```

## File Descriptions

### Source Files (`src/`)

- **`hello.py`**: Demonstrates basic Python concepts including loops, string formatting, and list operations
- **`add.py`**: Showcases addition operations, functions, and mathematical calculations

### Test Files (`tests/`)

- **`test_hello.py`**: Unit tests for hello.py functionality including output validation and calculation tests
- **`test_add.py`**: Unit tests for add.py functionality including function tests and mathematical operation validation

## Testing Convention

- Test files follow the `test_*.py` naming convention
- Each source file has a corresponding test file (e.g., `hello.py` → `test_hello.py`)
- Tests include both functionality validation and output verification
- Tests can be run individually or as a suite

## Usage

The Python files in this structure are loaded dynamically by the CodeEditor component and executed using Pyodide (Python in WebAssembly) in the browser.

## Adding New Files

When adding new Python files:

1. Place source files in `src/`
2. Create corresponding test files in `tests/` with the `test_` prefix
3. Update the navigation in the main application to include the new file
4. Follow the existing code structure and documentation patterns
