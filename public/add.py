# Simple Python script to demonstrate adding two numbers
# Click the play button to execute this code

print("Welcome to the Addition Calculator!")
print("This script demonstrates basic addition in Python")

# Define two numbers
num1 = 15
num2 = 27

# Calculate the sum
result = num1 + num2

print(f"\nFirst number: {num1}")
print(f"Second number: {num2}")
print(f"Sum: {num1} + {num2} = {result}")

# Let's try with different numbers
numbers = [5, 10, 3, 8, 12]
total = sum(numbers)

print(f"\nAdding a list of numbers: {numbers}")
print(f"Total sum: {total}")

# Function to add two numbers
def add_numbers(a, b):
    return a + b

# Test the function
x, y = 100, 250
function_result = add_numbers(x, y)
print(f"\nUsing a function: add_numbers({x}, {y}) = {function_result}")

print("\nThis demonstrates basic addition operations in Python!")
