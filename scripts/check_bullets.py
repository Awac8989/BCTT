import sys
sys.stdout.reconfigure(encoding='utf-8')
import docx

doc = docx.Document('BAO_CAO_THUC_TAP_100_TRANG_DOAN_MINH_QUAN.docx')
bullet_chars = ['•', '●', '○', '■', '◆', '▪', '▫', '–', '—', '*', '\u2022', '\u25cf', '\u25cb', '\u25aa']

count = 0
found_examples = []
for i, p in enumerate(doc.paragraphs):
    t = p.text.strip()
    for bc in bullet_chars:
        if t.startswith(bc):
            count += 1
            if len(found_examples) < 15:
                found_examples.append((i, bc, t[:60]))
            break

print(f"Total paragraphs starting with bullet characters: {count}")
for idx, bc, snippet in found_examples:
    print(f"  P[{idx}] bullet='{bc}': {snippet}")
