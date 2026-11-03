import os
import zipfile
import xml.etree.ElementTree as ET
import csv

def generate_accounts_excel(output_path="DANH_SACH_TAI_KHOAN_DANG_NHAP_HE_THONG.xlsx"):
    accounts = [
        {
            "stt": "1",
            "ho_ten": "TS. Nguyễn Văn Hùng",
            "chuc_vu": "Phó Giám đốc Sở LĐTBXH tỉnh Bình Dương",
            "don_vi": "Ban Giám đốc Sở LĐ-TB&XH tỉnh Bình Dương",
            "username": "admin.so",
            "email": "admin.so@binhduong.gov.vn",
            "password": "BinhDuong@2026",
            "vai_tro": "ADMIN_SO",
            "ten_vai_tro": "Lãnh đạo Ban Giám đốc Sở (Sếp)",
            "quyen_han": "Toàn quyền chỉ đạo điều hành vĩ mô, phê duyệt hồ sơ, ký số quyết định trợ cấp, giám sát ngân sách. (Không can thiệp kỹ thuật/CSDL/báo lỗi)",
        },
        {
            "stt": "2",
            "ho_ten": "KS. Lê Văn Khoa",
            "chuc_vu": "Kỹ sư An toàn thông tin & Quản trị CSDL",
            "don_vi": "Trung tâm CNTT & Truyền thông - Sở LĐTBXH",
            "username": "admin.kythuat",
            "email": "admin.kythuat@binhduong.gov.vn",
            "password": "BinhDuong@2026",
            "vai_tro": "ADMIN_TECH",
            "ten_vai_tro": "Quản trị viên Kỹ thuật & CSDL (DevOps / DBA)",
            "quyen_han": "Độc quyền truy cập Trung tâm Kỹ thuật (/ky-thuat), tiếp nhận xử lý báo lỗi website, rà soát dữ liệu, thực thi lệnh SQL UPDATE sửa lỗi CSDL 3NF, giám sát LGSP/VNeID",
        },
        {
            "stt": "3",
            "ho_ten": "Nguyễn Thị Minh Thảo",
            "chuc_vu": "Chuyên viên thụ lý Một cửa & CSXH",
            "don_vi": "Phòng LĐ-TB&XH TP. Thủ Dầu Một",
            "username": "admin.phong",
            "email": "admin.phong@thudaumot.binhduong.gov.vn",
            "password": "BinhDuong@2026",
            "vai_tro": "ADMIN_PHONG",
            "ten_vai_tro": "Cán bộ Thụ lý Cấp Phòng",
            "quyen_han": "Tiếp nhận và thẩm định hồ sơ Người có công, lập danh sách chi trả trợ cấp hàng tháng qua ATM/Ngân hàng, quản lý điều dưỡng và dụng cụ chỉnh hình",
        },
        {
            "stt": "4",
            "ho_ten": "Vũ Đình Cường",
            "chuc_vu": "Chuyên viên Văn hóa - Thông tin & CĐS",
            "don_vi": "UBND Phường Phú Cường, TP. Thủ Dầu Một",
            "username": "cb.thongtin",
            "email": "vdcuong.phucuong@thudaumot.binhduong.gov.vn",
            "password": "BinhDuong@2026",
            "vai_tro": "CB_THONG_TIN",
            "ten_vai_tro": "Cán bộ Thông tin, Truyền thông & CĐS",
            "quyen_han": "Quản lý hệ thống truyền thanh thông minh, bảng tin điện tử công cộng, Cổng TTĐT, mạng lưới Tổ công nghệ số cộng đồng tại khu phố",
        },
        {
            "stt": "5",
            "ho_ten": "Lê Hoàng Nam",
            "chuc_vu": "Công chức Văn hóa - Xã hội (LĐ-TB&XH)",
            "don_vi": "UBND Phường Phú Cường, TP. Thủ Dầu Một",
            "username": "cb.ansinh",
            "email": "lhnam.phucuong@thudaumot.binhduong.gov.vn",
            "password": "BinhDuong@2026",
            "vai_tro": "CB_AN_SINH",
            "ten_vai_tro": "Cán bộ Lao động & An sinh Xã hội",
            "quyen_han": "Quản lý hồ sơ Người có công cấp phường, chi trả trợ cấp bảo trợ xã hội (NĐ 20), rà soát hộ nghèo/cận nghèo, dữ liệu trẻ em và an toàn lao động",
        },
        {
            "stt": "6",
            "ho_ten": "ThS. Trần Thị Kim Oanh",
            "chuc_vu": "Công chức phụ trách Giáo dục - Đào tạo",
            "don_vi": "UBND Phường Phú Cường, TP. Thủ Dầu Một",
            "username": "cb.giaoduc",
            "email": "ttkoanh.phucuong@thudaumot.binhduong.gov.vn",
            "password": "BinhDuong@2026",
            "vai_tro": "CB_GIAO_DUC",
            "ten_vai_tro": "Cán bộ Giáo dục & Đào tạo cơ sở",
            "quyen_han": "Thẩm định cấp phép nhóm trẻ, mầm non tư thục, phối hợp tuyển sinh đầu cấp, phổ cập giáo dục và quản lý Trung tâm Học tập cộng đồng",
        },
        {
            "stt": "7",
            "ho_ten": "Nguyễn Thanh Tùng",
            "chuc_vu": "Công chức Văn hóa - Xã hội (Văn hóa, Thể thao)",
            "don_vi": "UBND Phường Phú Cường, TP. Thủ Dầu Một",
            "username": "cb.vanhoa",
            "email": "nttung.phucuong@thudaumot.binhduong.gov.vn",
            "password": "BinhDuong@2026",
            "vai_tro": "CB_VAN_HOA",
            "ten_vai_tro": "Cán bộ Văn hóa, Thể thao & Đời sống",
            "quyen_han": "Bình xét Gia đình văn hóa, Khu phố văn hóa (NĐ 86/2023), quản lý di tích lịch sử, cơ sở kinh doanh dịch vụ văn hóa (Karaoke/Biển hiệu)",
        },
    ]

    # Also generate CSV with UTF-8 BOM
    csv_path = os.path.splitext(output_path)[0] + ".csv"
    with open(csv_path, "w", encoding="utf-8-sig", newline="") as f:
        writer = csv.writer(f)
        writer.writerow([
            "STT", "Họ và tên", "Chức vụ", "Đơn vị công tác", "Tên đăng nhập", 
            "Email công vụ", "Mật khẩu", "Mã vai trò", "Tên vai trò", "Phạm vi cấp quyền"
        ])
        for a in accounts:
            writer.writerow([
                a["stt"], a["ho_ten"], a["chuc_vu"], a["don_vi"], a["username"],
                a["email"], a["password"], a["vai_tro"], a["ten_vai_tro"], a["quyen_han"]
            ])

    # Generate XLSX (OpenXML zip)
    content_types_xml = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
</Types>'''

    rels_xml = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>'''

    wb_rels_xml = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>'''

    workbook_xml = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="Danh Sách Tài Khoản" sheetId="1" r:id="rId1"/>
  </sheets>
</workbook>'''

    styles_xml = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="3">
    <font><name val="Calibri"/><sz val="11"/></font>
    <font><b/><color rgb="FFFFFFFF"/><name val="Calibri"/><sz val="11"/></font>
    <font><b/><color rgb="FFDD4B39"/><name val="Calibri"/><sz val="14"/></font>
  </fonts>
  <fills count="3">
    <fill><patternFill patternType="none"/></fill>
    <fill><patternFill patternType="gray125"/></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFC82333"/></patternFill></fill>
  </fills>
  <borders count="2">
    <border><left/><right/><top/><bottom/><diagonal/></border>
    <border>
      <left style="thin"><color rgb="FFD2D6DE"/></left>
      <right style="thin"><color rgb="FFD2D6DE"/></right>
      <top style="thin"><color rgb="FFD2D6DE"/></top>
      <bottom style="thin"><color rgb="FFD2D6DE"/></bottom>
    </border>
  </borders>
  <cellStyleXfs count="1">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>
  </cellStyleXfs>
  <cellXfs count="4">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
    <xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1">
      <alignment horizontal="center" vertical="center" wrapText="1"/>
    </xf>
    <xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1">
      <alignment vertical="center"/>
    </xf>
    <xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1">
      <alignment horizontal="center" vertical="center"/>
    </xf>
  </cellXfs>
</styleSheet>'''

    # Build worksheet sheet1.xml
    def escape_xml(s):
        return (str(s).replace("&", "&amp;")
                      .replace("<", "&lt;")
                      .replace(">", "&gt;")
                      .replace('"', "&quot;")
                      .replace("'", "&apos;"))

    rows_xml = []
    # Row 1: Title
    rows_xml.append('<row r="1" ht="35" customHeight="1">')
    rows_xml.append('<c r="A1" s="3" t="inlineStr"><is><t>DANH SÁCH TÀI KHOẢN VÀ MẬT KHẨU CÔNG VỤ - HỆ THỐNG SLĐTBXH BÌNH DƯƠNG</t></is></c>')
    rows_xml.append('</row>')

    # Row 2: Subtitle
    rows_xml.append('<row r="2" ht="20" customHeight="1">')
    rows_xml.append('<c r="A2" s="0" t="inlineStr"><is><t>Áp dụng nguyên tắc Phân tách nhiệm vụ (Separation of Duties - Nghị định 85/2016/NĐ-CP &amp; NĐ 13/2023/NĐ-CP)</t></is></c>')
    rows_xml.append('</row>')

    # Row 3: Blank
    rows_xml.append('<row r="3" ht="15"/>')

    # Row 4: Headers
    headers = [
        ("A4", "STT"),
        ("B4", "Họ và tên"),
        ("C4", "Chức vụ"),
        ("D4", "Đơn vị công tác"),
        ("E4", "Tên đăng nhập"),
        ("F4", "Email công vụ"),
        ("G4", "Mật khẩu khởi tạo"),
        ("H4", "Mã vai trò (Role)"),
        ("I4", "Tên vai trò hệ thống"),
        ("J4", "Phạm vi cấp quyền & Phân hệ"),
    ]
    rows_xml.append('<row r="4" ht="28" customHeight="1">')
    for cell_ref, h_txt in headers:
        rows_xml.append(f'<c r="{cell_ref}" s="1" t="inlineStr"><is><t>{escape_xml(h_txt)}</t></is></c>')
    rows_xml.append('</row>')

    # Data Rows (starting from 5)
    row_num = 5
    for a in accounts:
        rows_xml.append(f'<row r="{row_num}" ht="26" customHeight="1">')
        cols = [
            ("A", a["stt"]),
            ("B", a["ho_ten"]),
            ("C", a["chuc_vu"]),
            ("D", a["don_vi"]),
            ("E", a["username"]),
            ("F", a["email"]),
            ("G", a["password"]),
            ("H", a["vai_tro"]),
            ("I", a["ten_vai_tro"]),
            ("J", a["quyen_han"]),
        ]
        for col_letter, val in cols:
            cell_ref = f"{col_letter}{row_num}"
            rows_xml.append(f'<c r="{cell_ref}" s="2" t="inlineStr"><is><t>{escape_xml(val)}</t></is></c>')
        rows_xml.append('</row>')
        row_num += 1

    sheet1_xml = f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <cols>
    <col min="1" max="1" width="6" customWidth="1"/>
    <col min="2" max="2" width="24" customWidth="1"/>
    <col min="3" max="3" width="30" customWidth="1"/>
    <col min="4" max="4" width="35" customWidth="1"/>
    <col min="5" max="5" width="18" customWidth="1"/>
    <col min="6" max="6" width="32" customWidth="1"/>
    <col min="7" max="7" width="18" customWidth="1"/>
    <col min="8" max="8" width="16" customWidth="1"/>
    <col min="9" max="9" width="30" customWidth="1"/>
    <col min="10" max="10" width="65" customWidth="1"/>
  </cols>
  <sheetData>
    {''.join(rows_xml)}
  </sheetData>
</worksheet>'''

    # Write to zip file (.xlsx)
    with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        zipf.writestr('[Content_Types].xml', content_types_xml)
        zipf.writestr('_rels/.rels', rels_xml)
        zipf.writestr('xl/_rels/workbook.xml.rels', wb_rels_xml)
        zipf.writestr('xl/workbook.xml', workbook_xml)
        zipf.writestr('xl/styles.xml', styles_xml)
        zipf.writestr('xl/worksheets/sheet1.xml', sheet1_xml)

    print(f"XLSX exported successfully to: {output_path}")
    print(f"CSV exported successfully to: {csv_path}")

if __name__ == "__main__":
    generate_accounts_excel("DANH_SACH_TAI_KHOAN_DANG_NHAP_HE_THONG.xlsx")
    # Also save to public for browser download
    os.makedirs("public", exist_ok=True)
    generate_accounts_excel("public/DANH_SACH_TAI_KHOAN_DANG_NHAP_HE_THONG.xlsx")

