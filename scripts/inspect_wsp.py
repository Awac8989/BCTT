import sys
sys.stdout.reconfigure(encoding='utf-8')
import zipfile
import re

with zipfile.ZipFile('V2_DoamMinhQuan_2224801030137_BCTT (2).docx') as z:
    content = z.read('word/document.xml').decode('utf-8', errors='ignore')
    matches = re.findall(r'<wps:wsp.*?</wps:wsp>', content, re.DOTALL)
    print(f"Found {len(matches)} wps:wsp elements")
    for i, m in enumerate(matches):
        print(f"=== Shape {i} (length {len(m)}) ===")
        print(m[:500])
        print("...")
        print(m[-300:])
