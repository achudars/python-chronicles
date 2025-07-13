"""
Test suite for add.py module
This file contains unit tests for the add.py script functionality
"""

import sys
import io
from contextlib import redirect_stdout


def add_numbers(a, b):
    """Function to add two numbers - extracted from add.py for testing"""
    return a + b


def test_add_numbers_function():
    """Test the add_numbers function with various inputs"""
    # Test basic addition
    assert add_numbers(15, 27) == 42
    assert add_numbers(100, 250) == 350
    assert add_numbers(0, 0) == 0
    assert add_numbers(-5, 10) == 5
    assert add_numbers(-3, -7) == -10
    
    print("✓ add_numbers function tests passed!")


def test_sum_function():
    """Test the built-in sum function with lists"""
    numbers = [5, 10, 3, 8, 12]
    expected_total = 38
    result = sum(numbers)
    
    assert result == expected_total, f"Expected sum of {numbers} = {expected_total}, got {result}"
    
    # Test with empty list
    assert sum([]) == 0
    
    # Test with single element
    assert sum([42]) == 42
    
    print("✓ sum function tests passed!")


def test_add_output():
    """Test that add.py produces expected output"""
    captured_output = io.StringIO()
    
    with redirect_stdout(captured_output):
        print("Welcome to the Addition Calculator!")
        print("This script demonstrates basic addition in Python")
        
        # Test the main calculation
        num1 = 15
        num2 = 27
        result = num1 + num2
        
        print(f"\nFirst number: {num1}")
        print(f"Second number: {num2}")
        print(f"Sum: {num1} + {num2} = {result}")
        
        # Test list sum
        numbers = [5, 10, 3, 8, 12]
        total = sum(numbers)
        print(f"\nAdding a list of numbers: {numbers}")
        print(f"Total sum: {total}")
        
        # Test function
        x, y = 100, 250
        function_result = add_numbers(x, y)
        print(f"\nUsing a function: add_numbers({x}, {y}) = {function_result}")
        
        print("\nThis demonstrates basic addition operations in Python!")
    
    output = captured_output.getvalue()
    
    # Assertions
    assert "Welcome to the Addition Calculator!" in output
    assert "Sum: 15 + 27 = 42" in output
    assert "Total sum: 38" in output
    assert "add_numbers(100, 250) = 350" in output
    
    print("✓ add.py output tests passed!")


if __name__ == "__main__":
    test_add_numbers_function()
    test_sum_function()
    test_add_output()
    print("\n🎉 All tests for add.py passed successfully!")
