"""
Test runner for all Python Chronicles tests
Run this file to execute all test suites
"""

import sys
import os

# Add the src directory to Python path for imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../src'))

def run_all_tests():
    """Run all test suites"""
    print("🧪 Running Python Chronicles Test Suite")
    print("=" * 50)
    
    try:
        # Import and run hello tests
        print("\n📁 Testing hello.py module...")
        from test_hello import test_hello_output, test_square_calculation
        test_hello_output()
        test_square_calculation()
        
        # Import and run add tests
        print("\n📁 Testing add.py module...")
        from test_add import test_add_numbers_function, test_sum_function, test_add_output
        test_add_numbers_function()
        test_sum_function()
        test_add_output()
        
        print("\n" + "=" * 50)
        print("🎉 ALL TESTS PASSED SUCCESSFULLY!")
        print("✅ hello.py: All tests passed")
        print("✅ add.py: All tests passed")
        
    except Exception as e:
        print(f"\n❌ Test failed with error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    run_all_tests()
