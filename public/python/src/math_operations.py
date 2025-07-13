def multiply(a, b):
    """
    Multiply two numbers and return the result.
    
    Args:
        a: First number
        b: Second number
    
    Returns:
        The product of a and b
    """
    return a * b

def power(base, exponent):
    """
    Calculate base raised to the power of exponent.
    
    Args:
        base: The base number
        exponent: The exponent
    
    Returns:
        base raised to the power of exponent
    """
    return base ** exponent

# Example usage
if __name__ == "__main__":
    print("Multiplication Examples:")
    print(f"5 * 3 = {multiply(5, 3)}")
    print(f"7 * 8 = {multiply(7, 8)}")
    print(f"12 * 4 = {multiply(12, 4)}")
    
    print("\nPower Examples:")
    print(f"2^3 = {power(2, 3)}")
    print(f"5^2 = {power(5, 2)}")
    print(f"3^4 = {power(3, 4)}")
