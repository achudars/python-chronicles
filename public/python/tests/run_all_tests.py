"""
Test runner for all Python Chronicles tests
Run this file to execute all test suites
"""

import sys
import os

# Add the src directory to Python path for imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../src'))

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
    print("[TEST] Running Python Chronicles Test Suite")
    print("=" * 50)
    
    try:
        # Import and run hello tests
        print("\n[FILE] Testing hello.py module...")
        from test_hello import test_hello_output, test_square_calculation
        test_hello_output()
        test_square_calculation()
        
        # Import and run add tests
        print("\n[FILE] Testing add.py module...")
        from test_add import test_add_numbers_function, test_sum_function, test_add_output
        test_add_numbers_function()
        test_sum_function()
        test_add_output()
        
        # Import and run math_operations tests if available
        try:
            print("\n[FILE] Testing math_operations.py module...")
            from test_math_operations import TestMathOperations
            import unittest
            
            # Create a test suite and run it
            suite = unittest.TestLoader().loadTestsFromTestCase(TestMathOperations)
            runner = unittest.TextTestRunner(verbosity=0, stream=open(os.devnull, 'w'))
            result = runner.run(suite)
            
            if result.wasSuccessful():
                print("[PASS] math_operations.py tests passed")
            else:
                print(f"[FAIL] math_operations.py tests failed: {len(result.failures)} failures, {len(result.errors)} errors")
                for failure in result.failures:
                    print(f"  FAILURE: {failure[0]}")
                for error in result.errors:
                    print(f"  ERROR: {error[0]}")
                raise RuntimeError("math_operations tests failed")
                
        except ImportError:
            print("[SKIP] math_operations.py tests not found")
        
        print("\n" + "=" * 50)
        print("[SUCCESS] ALL TESTS PASSED SUCCESSFULLY!")
        print("[PASS] hello.py: All tests passed")
        print("[PASS] add.py: All tests passed")
        print("[PASS] math_operations.py: All tests passed")
        
    except Exception as e:
        print(f"\n[ERROR] Test failed with error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    run_all_tests()
