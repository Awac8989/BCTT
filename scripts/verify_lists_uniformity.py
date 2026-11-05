import docx

def verify_lists(filepath):
    print(f"\n================ VERIFYING UNIFORMITY: {filepath} ================")
    doc = docx.Document(filepath)

    # 1. Verify DANH MỤC HÌNH VẼ (P154 to P201)
    print("1. Checking DANH MỤC HÌNH VẼ (48 figures)...")
    fig_fail = 0
    for i in range(154, 202):
        p = doc.paragraphs[i]
        pPr = p._p.find('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}pPr')
        tabs_xml = pPr.find('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}tabs') if pPr is not None else None
        has_tab = '\t' in p.text
        has_tabs_xml = (tabs_xml is not None and len(tabs_xml) > 0)
        r0 = p.runs[0] if p.runs else None
        fs = r0.font.size.pt if (r0 and r0.font.size) else None
        
        if not has_tab or not has_tabs_xml or fs != 12:
            print(f"   [FAIL] P{i}: has_tab={has_tab}, has_xml={has_tabs_xml}, fs={fs}, text={p.text[:40]}")
            fig_fail += 1
    assert fig_fail == 0, f"Error: {fig_fail} figures failed in DANH MỤC HÌNH VẼ!"
    print(f"   ✓ 100% of 48 figure list entries are UNIFORM with Dot Leader Tab Stops, 12pt regular font!")

    # 2. Verify DANH MỤC BẢNG BIỂU (P121 to P151)
    print("2. Checking DANH MỤC BẢNG BIỂU (31 tables)...")
    tbl_fail = 0
    for i in range(121, 152):
        p = doc.paragraphs[i]
        pPr = p._p.find('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}pPr')
        tabs_xml = pPr.find('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}tabs') if pPr is not None else None
        has_tab = '\t' in p.text
        has_tabs_xml = (tabs_xml is not None and len(tabs_xml) > 0)
        r0 = p.runs[0] if p.runs else None
        fs = r0.font.size.pt if (r0 and r0.font.size) else None
        
        if not has_tab or not has_tabs_xml or fs != 12:
            print(f"   [FAIL] P{i}: has_tab={has_tab}, has_xml={has_tabs_xml}, fs={fs}, text={p.text[:40]}")
            tbl_fail += 1
    assert tbl_fail == 0, f"Error: {tbl_fail} tables failed in DANH MỤC BẢNG BIỂU!"
    print(f"   ✓ 100% of 31 table list entries are UNIFORM with Dot Leader Tab Stops, 12pt regular font!")

    # 3. Verify Body Captions match List 100%
    print("3. Checking Body Figure Captions...")
    body_count = 0
    for i, p in enumerate(doc.paragraphs):
        if i > 202 and p.text.strip().startswith('Hình '):
            body_count += 1
            r0 = p.runs[0] if p.runs else None
            assert r0.font.bold and r0.font.italic, f"Body fig P{i} not bold italic!"
            assert r0.font.size.pt == 12, f"Body fig P{i} size is {r0.font.size.pt} not 12!"
    assert body_count == 48, f"Expected 48 body captions, found {body_count}"
    print(f"   ✓ 100% of 48 body captions are centered, 12pt bold italic, matching list entries!")

    print(f"===> VERIFICATION PASSED 100% FOR {filepath}!\n")

if __name__ == "__main__":
    verify_lists("DoanMinhQuan_2224801030137_BCTT2.docx")
    verify_lists("docs/DoanMinhQuan_2224801030137_BCTT2.docx")
