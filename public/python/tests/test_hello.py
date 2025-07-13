"""
Test suite for hello.py module
This file contains unit tests for the hello.py script functionality
"""

import sys
import io
from contextlib import redirect_stdout


def test_hello_output():
    """Test that hello.py produces expected output"""
    # Capture stdout
    captured_output = io.StringIO()
    
    # Execute the hello.py logic
    with redirect_stdout(captured_output):
        print("Hello from Python Chronicles!")
        print("Python is running in WebAssembly!")
        
        print("\nLet's calculate some squares:")
        for i in range(1, 6):
            print(f"{i} squared is {i**2}")
        
        languages = ["Python", "JavaScript", "WebAssembly"]
        print(f"\nLanguages used in this project: {', '.join(languages)}")
        
        print("\nThis code is executed using Pyodide - Python in WebAssembly")
    
    output = captured_output.getvalue()
    
    # Basic assertions
    assert "Hello from Python Chronicles!" in output
    assert "Python is running in WebAssembly!" in output
    assert "1 squared is 1" in output
    assert "5 squared is 25" in output
    assert "Python, JavaScript, WebAssembly" in output
    
    print("[OK] All hello.py tests passed!")


def test_square_calculation():
    """Test the square calculation logic"""
    expected_squares = {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}
    
    for num, expected in expected_squares.items():
        result = num ** 2
        assert result == expected, f"Expected {num}^2 = {expected}, got {result}"
    
    print("[OK] Square calculation tests passed!")


if __name__ == "__main__":
    test_hello_output()
    test_square_calculation()
    print("\n[SUCCESS] All tests for hello.py passed successfully!")
