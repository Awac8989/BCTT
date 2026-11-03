import docx, io, os, re
from PIL import Image
from docx.shared import Inches, Emu

DOCX_PATH = "docs/DoanMinhQuan_2224801030137_BCTT2.docx"
DIAGRAM_PATH = "docs/diagrams/hinh_3_1_use_case_tong_quat.png"

doc = docx.Document(DOCX_PATH)
p = doc.paragraphs[370]
xml = p._p.xml

# 1. Kiểm tra extent
cx_match = re.search(r'cx="(\d+)"', xml)
cy_match = re.search(r'cy="(\d+)"', xml)
if cx_match and cy_match:
    cx, cy = int(cx_match.group(1)), int(cy_match.group(1))
    print(f"Current extent: cx={cx} EMU ({cx/914400:.2f} in), cy={cy} EMU ({cy/914400:.2f} in)")
else:
    print("No extent found!")

# 2. Kiểm tra blob ảnh
for r in p.runs:
    blips = r._r.xpath('.//a:blip/@r:embed')
    if blips:
        rId = blips[0]
        rel = doc.part.rels[rId]
        blob = rel.target_part._blob
        im = Image.open(io.BytesIO(blob))
        print(f"Blob size: {len(blob)} bytes, Image: {im.size}, Mode: {im.mode}")

        disk_size = os.path.getsize(DIAGRAM_PATH)
        print(f"Disk file size: {disk_size} bytes")

        if len(blob) != disk_size:
            print("MISMATCH! Re-injecting image from disk...")
            with open(DIAGRAM_PATH, "rb") as f:
                rel.target_part._blob = f.read()
            print(f"Injected new blob: {len(rel.target_part._blob)} bytes")
        else:
            print("MATCH! Blob matches disk file.")

# 3. Kiểm tra extent có đủ lớn không
# Width nên là ~6.0 inches = 5486400 EMU
target_width = Inches(6.2)
target_width_emu = int(target_width)
print(f"\nTarget width: {target_width_emu} EMU ({target_width_emu/914400:.2f} in)")

# Sửa extent nếu cần
new_xml = xml
if cx_match:
    old_cx = int(cx_match.group(1))
    if old_cx < 3000000:  # nhỏ hơn ~3.3 inches -> quá nhỏ
        print(f"Width too small ({old_cx} EMU = {old_cx/914400:.2f} in), fixing...")
        # Tính height mới giữ tỷ lệ
        im_disk = Image.open(DIAGRAM_PATH)
        aspect = im_disk.size[1] / im_disk.size[0]
        new_cy = int(target_width_emu * aspect)
        print(f"New extent: cx={target_width_emu}, cy={new_cy}")

doc.save(DOCX_PATH)
print(f"\nSaved: {DOCX_PATH}")
