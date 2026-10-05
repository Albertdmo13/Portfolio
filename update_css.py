import re

with open('src/App.css', 'r') as f:
    content = f.read()

# 1. Foreground element lighter
content = re.sub(r'brightness\(0\.8\)', 'brightness(1)', content)

# 2. Change accent colors from purple to blue
content = content.replace('#a78bfa', '#60a5fa')
content = content.replace('#c084fc', '#3b82f6')
content = content.replace('rgba(167, 139, 250', 'rgba(96, 165, 250')
content = content.replace('rgba(192, 132, 252', 'rgba(59, 130, 246')

# 3. Reduce gradients: Replace the timeline track gradient with a solid color
timeline_track_pattern = re.compile(r'background:\s*linear-gradient\([^)]+\);', re.MULTILINE | re.DOTALL)
content = timeline_track_pattern.sub('background: #60a5fa;', content)

# 4. Less rounded corners
content = content.replace('border-radius: 16px;', 'border-radius: 8px;')
content = content.replace('border-radius: 14px;', 'border-radius: 8px;')
content = content.replace('border-radius: 10px;', 'border-radius: 6px;')
content = content.replace('border-radius: 8px;', 'border-radius: 4px;')
content = content.replace('border-radius: 6px;', 'border-radius: 4px;')
content = content.replace('border-radius: 7px;', 'border-radius: 4px;')

# We keep border-radius: 50% for circles and 9999px for pills.

with open('src/App.css', 'w') as f:
    f.write(content)

print("Applied CSS updates successfully.")
