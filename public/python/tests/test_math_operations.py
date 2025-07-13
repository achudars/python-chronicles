import unittest
from math_operations import multiply, power

class TestMathOperations(unittest.TestCase):
    
    def test_multiply(self):
        """Test the multiply function."""
        self.assertEqual(multiply(2, 3), 6)
        self.assertEqual(multiply(5, 4), 20)
        self.assertEqual(multiply(-2, 3), -6)
        self.assertEqual(multiply(0, 5), 0)
        self.assertEqual(multiply(2.5, 2), 5.0)
    
    def test_power(self):
        """Test the power function."""
        self.assertEqual(power(2, 3), 8)
        self.assertEqual(power(5, 2), 25)
        self.assertEqual(power(3, 0), 1)
        self.assertEqual(power(1, 10), 1)
        self.assertEqual(power(2, -1), 0.5)

if __name__ == '__main__':
    unittest.main()
