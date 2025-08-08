import re

# Read the file
with open('prisma/seed.ts', 'r') as f:
    content = f.read()

# Replace dimensions: { ... } with dimensions: JSON.stringify({ ... })
content = re.sub(r'dimensions: ({[^}]*})', r'dimensions: JSON.stringify(\1)', content)

# Replace specifications: { ... } with specifications: JSON.stringify({ ... })
# This is more complex as it can span multiple lines
content = re.sub(r'specifications: {([^}]*(?:\n[^}]*)*)}', lambda m: f'specifications: JSON.stringify({{{m.group(1)}}})', content, flags=re.MULTILINE)

# Write back
with open('prisma/seed.ts', 'w') as f:
    f.write(content)

print("Fixed JSON fields in seed.ts")
