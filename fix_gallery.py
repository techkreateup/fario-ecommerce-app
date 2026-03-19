import re

path = r'C:\Users\A-MATRIX\Downloads\fario-ecommerce-app-main\fario-ecommerce-app-main\components\home\HomeGallery.tsx'

with open(path, 'rb') as f:
    content = f.read()

# The BEL character \x07 replaced the backtick+a from `absolute
# The corrupted pattern is: cls={\x07bsolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out }
old = b'cls={\x07bsolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out }\n            px={0}\n            />'
new = b"cls={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out ${isHovered ? 'scale-110' : 'scale-150 grayscale-[0.3]'}`} \n                px={0}\n            />"

if old in content:
    content = content.replace(old, new)
    print('Fix applied successfully!')
else:
    print('Pattern not found, trying alternative...')
    # Try without the surrounding context
    old2 = b'cls={\x07bsolute'
    new2 = b'cls={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out ${isHovered ? \'scale-110\' : \'scale-150 grayscale-[0.3]\'}`}'
    idx = content.find(b'cls={\x07')
    if idx != -1:
        # Find the end of this prop (next newline after the })
        end = content.find(b'px={0}', idx)
        replacement = b"cls={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out ${isHovered ? 'scale-110' : 'scale-150 grayscale-[0.3]'}`} \n                px={0}"
        content = content[:idx] + replacement + content[end + len(b'px={0}'):]
        print('Alternative fix applied!')
    else:
        print('ERROR: Could not find pattern to fix!')

with open(path, 'wb') as f:
    f.write(content)

print('File saved.')

# Verify
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()
print('Line 74:', repr(lines[73]))
