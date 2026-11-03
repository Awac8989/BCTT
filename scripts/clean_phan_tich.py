with open('src/routes/phan-tich.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find function PhanTich
start_idx = -1
for i, line in enumerate(lines):
    if 'function PhanTich() {' in line:
        start_idx = i
        break

# Find the second activeTab declaration
# line 73: function PhanTich() {
# line 74: const [activeTab, setActiveTab] ...
# line 111: const [activeTab, setActiveTab] ...

# We want lines from 0 to start_idx + 1 (function PhanTich() {)
# then skip lines until the second activeTab declaration (line 110/111)
second_active_tab = -1
for i in range(start_idx + 1, start_idx + 100):
    if 'const [activeTab, setActiveTab] = useState' in lines[i]:
        if second_active_tab == -1:
            # this is the first one
            pass
        else:
            break
        # mark first one
        first_active_tab = i
        for j in range(i + 1, start_idx + 100):
            if 'const [activeTab, setActiveTab] = useState' in lines[j]:
                second_active_tab = j
                break
        break

print(f"first_active_tab at line {first_active_tab + 1}, second at {second_active_tab + 1}")

# Keep lines[:start_idx + 1] + lines[second_active_tab:]
new_lines = lines[:start_idx + 1] + lines[second_active_tab:]

with open('src/routes/phan-tich.tsx', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("phan-tich.tsx cleaned successfully!")

