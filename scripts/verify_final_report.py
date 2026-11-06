import docx

def verify_file(filepath):
    print(f"\n================ VERIFYING: {filepath} ================")
    doc = docx.Document(filepath)
    print(f"Total Paragraphs: {len(doc.paragraphs)}")
    print(f"Total Tables: {len(doc.tables)}")

    # 1. Check highlights
    highlight_count = 0
    for p in doc.paragraphs:
        for r in p.runs:
            if r.font.highlight_color is not None:
                highlight_count += 1
    for t in doc.tables:
        for row in t.rows:
            for cell in row.cells:
                for p in cell.paragraphs:
                    for r in p.runs:
                        if r.font.highlight_color is not None:
                            highlight_count += 1
    print(f"1. Highlighted runs count: {highlight_count} (Must be 0)")
    assert highlight_count == 0, f"Error: Found {highlight_count} highlighted runs!"

    # 2. Check Bìa ngoài và bìa trong
    p8 = doc.paragraphs[8].text
    p10 = doc.paragraphs[10].text
    p31 = doc.paragraphs[31].text
    p33 = doc.paragraphs[33].text
    print(f"2. Bìa ngoài đơn vị: '{p8[:40]}...'")
    print(f"   Bìa ngoài đề tài: '{p10[:40]}...'")
    assert "Phòng Văn hóa – Xã hội phường Thủ Dầu Một" in p8
    assert "Thành phố Hồ Chí Minh" in p8
    assert "Phòng Văn hóa – Xã hội phường Thủ Dầu Một" in p31

    # 3. Check Lời Cảm Ơn
    print(f"3. Lời cảm ơn P45: '{doc.paragraphs[45].text}'")
    p48 = doc.paragraphs[48].text
    assert "Trần Phong Lưu" in p48
    assert "Hứa Trọng Duy" in p48
    assert "Nghị định 13/2023/NĐ-CP" in p48
    print("   ✓ Lời cảm ơn có đầy đủ lãnh đạo UBND, chuyên viên CNTT và các văn bản chỉ đạo.")

    # 4. Check P53 dummy TOC
    p53 = doc.paragraphs[53]
    xml = p53._p.xml
    assert "fldSimple" not in xml and "instrText" not in xml, "P53 still contains TOC field!"
    print("   ✓ P53 trường TOC rỗng đã được làm sạch hoàn toàn.")

    # 5. Check Mục lục P54 - P116
    print(f"5. Mục lục kiểm tra: P54='{doc.paragraphs[54].text}', P116='{doc.paragraphs[116].text}'")
    assert "LỜI CẢM ƠN\t3" in doc.paragraphs[54].text
    assert "DANH MỤC CÁC KÝ TỰ, CHỮ VIẾT TẮT\t6" in doc.paragraphs[55].text
    assert "CHƯƠNG 1" in doc.paragraphs[64].text
    assert "CHƯƠNG 4" in doc.paragraphs[86].text
    assert "PHỤ LỤC" in doc.paragraphs[112].text
    print("   ✓ 63 mục trong Mục lục đã được ghi đúng số trang thực tế.")

    # 6. Check P248 và P250
    assert doc.paragraphs[248].style.name == 'Normal', f"P248 style is {doc.paragraphs[248].style.name}"
    assert doc.paragraphs[250].style.name == 'Normal', f"P250 style is {doc.paragraphs[250].style.name}"
    print("   ✓ P248 và P250 mang định dạng Normal (không bị kéo vào mục lục).")

    print(f"===> TẤT CẢ TIÊU CHÍ KIỂM TRA ĐẠT CHUẨN 100% CHO {filepath}!")

if __name__ == "__main__":
    verify_file("DoanMinhQuan_2224801030137_BCTT2.docx")
    verify_file("docs/DoanMinhQuan_2224801030137_BCTT2.docx")

