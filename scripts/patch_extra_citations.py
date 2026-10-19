import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'scripts/build_full_report.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Add citations to analysis sections
content = content.replace(
    'BigDecimal trong nền tảng Java Spring Boot.',
    'BigDecimal trong nền tảng Java Spring Boot [16].'
)
content = content.replace(
    '(theo Nghị định 75/2021/NĐ-CP và Nghị định 55/2023/NĐ-CP của Chính phủ).',
    '(theo Nghị định 75/2021/NĐ-CP [4] và Nghị định 55/2023/NĐ-CP [5] của Chính phủ).'
)
content = content.replace(
    'Theo quy định tại Thông tư số 101/2018/TT-BTC của Bộ Tài chính hướng dẫn quản lý kinh phí an sinh xã hội',
    'Theo quy định tại Thông tư số 101/2018/TT-BTC của Bộ Tài chính [10] hướng dẫn quản lý kinh phí an sinh xã hội'
)
content = content.replace(
    'theo quy định tại Nghị định 131/2021/NĐ-CP.',
    'theo quy định tại Nghị định 131/2021/NĐ-CP [3].'
)
content = content.replace(
    'xuất Phiếu chi Mẫu C70a-HD chi trả cho thân nhân.',
    'xuất Phiếu chi Mẫu C70a-HD theo Thông tư 101/2018/TT-BTC [10] chi trả cho thân nhân.'
)
content = content.replace(
    'thiết kế trên hệ quản trị CSDL MySQL 8.0 với Storage Engine InnoDB. Toàn bộ lược đồ dữ liệu tuân thủ chuẩn hóa 3NF',
    'thiết kế trên hệ quản trị CSDL MySQL 8.0 [20] với Storage Engine InnoDB theo nguyên lý [18]. Toàn bộ lược đồ dữ liệu tuân thủ chuẩn hóa 3NF [20]'
)

# Appendices citations
content = content.replace(
    'Nghị định số 61/2018/NĐ-CP của Chính phủ):',
    'Nghị định số 61/2018/NĐ-CP của Chính phủ [6]):'
)
content = content.replace(
    'Nghị định số 131/2021/NĐ-CP của Chính phủ):',
    'Nghị định số 131/2021/NĐ-CP của Chính phủ [3]):'
)
content = content.replace(
    'Thông tư số 101/2018/TT-BTC của Bộ Tài chính):',
    'Thông tư số 101/2018/TT-BTC của Bộ Tài chính [10]):'
)
content = content.replace(
    'theo Nghị định 75/2021/NĐ-CP và Nghị định 55/2023/NĐ-CP của Chính phủ:',
    'theo Nghị định 75/2021/NĐ-CP [4] và Nghị định 55/2023/NĐ-CP [5] của Chính phủ:'
)
content = content.replace(
    '"Nghị định 55/2023/NĐ-CP"',
    '"Nghị định 55/2023/NĐ-CP [5]"'
)
content = content.replace(
    '"Pháp lệnh số 02/2020"',
    '"Pháp lệnh số 02/2020 [2]"'
)
content = content.replace(
    '"Nghị định 131/2021/NĐ-CP"',
    '"Nghị định 131/2021/NĐ-CP [3]"'
)
content = content.replace(
    '"Nghị định 75/2021/NĐ-CP"',
    '"Nghị định 75/2021/NĐ-CP [4]"'
)
content = content.replace(
    '"Quyết định 06/QĐ-TTg"',
    '"Quyết định 06/QĐ-TTg [9]"'
)

with open(r'scripts/build_full_report.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("Extra citations patched successfully into build_full_report.py!")
