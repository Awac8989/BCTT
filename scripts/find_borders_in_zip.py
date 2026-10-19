import sys
sys.stdout.reconfigure(encoding='utf-8')
import zipfile
import xml.etree.ElementTree as ET

with zipfile.ZipFile('V2_DoamMinhQuan_2224801030137_BCTT (2).docx') as z:
    for name in z.namelist():
        if name.endswith('.xml'):
            content = z.read(name).decode('utf-8', errors='ignore')
            if 'border' in content.lower() or 'pgborders' in content.lower():
                print(f"Found border/pgborders in {name}")
                # find snippets
                for tag in ['w:pgBorders', 'pgBorders', 'v:rect', 'v:shape', 'wps:wsp']:
                    if tag in content:
                        print(f"  Tag {tag} found in {name}!")
