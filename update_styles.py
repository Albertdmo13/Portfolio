import os
import re

directory = '/home/visilab/Alberto/repos/Portfolio/src'

for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith(('.css', '.jsx', '.js')):
            filepath = os.path.join(root, file)
            with open(filepath, 'r') as f:
                content = f.read()
            
            new_content = content
            
            if file.endswith('.css'):
                new_content = re.sub(r'border-radius:\s*[^;]+;', 'border-radius: 0;', new_content)
                new_content = re.sub(r'box-shadow:\s*[^;]+;', 'box-shadow: none;', new_content)
                new_content = re.sub(r'text-shadow:\s*[^;]+;', 'text-shadow: none;', new_content)
                new_content = re.sub(r'backdrop-filter:\s*[^;]+;', 'backdrop-filter: none;', new_content)
                new_content = re.sub(r'-webkit-backdrop-filter:\s*[^;]+;', '-webkit-backdrop-filter: none;', new_content)
                new_content = re.sub(r'filter:\s*blur\([^)]+\);', 'filter: none;', new_content)
                
                new_content = re.sub(r'--glass-blur:\s*[^;]+;', '--glass-blur: none;', new_content)
                new_content = re.sub(r'--glass-shadow:\s*[^;]+;', '--glass-shadow: none;', new_content)
                new_content = re.sub(r'--glass-shadow-hover:\s*[^;]+;', '--glass-shadow-hover: none;', new_content)
            
            if file.endswith(('.jsx', '.js')):
                new_content = re.sub(r'blur=\{[^}]+\}', 'blur={0}', new_content)
                new_content = re.sub(r'blur=\{[^}]+\}', 'blur={0}', new_content)
                new_content = re.sub(r'borderRadius:\s*[^,]+,', 'borderRadius: 0,', new_content)
                new_content = re.sub(r'boxShadow:\s*[^,]+,', 'boxShadow: "none",', new_content)
                new_content = re.sub(r'textShadow:\s*[^,]+,', 'textShadow: "none",', new_content)
                
            if new_content != content:
                with open(filepath, 'w') as f:
                    f.write(new_content)
                print(f"Updated {filepath}")
