with open('src/routes/ho-so/$id.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('Chính sách trợ cấp ưu đãi theo Nghị định 75/2021/NĐ-CP', 'Chính sách trợ cấp ưu đãi theo Nghị định 77/2024/NĐ-CP (áp dụng từ 01/07/2024)')
text = text.replace('2.055.000 đ/tháng', '2.789.000 đ/tháng')
text = text.replace('1.0 lần mức chuẩn theo quy định', '1.0 lần mức chuẩn theo Nghị định 77/2024/NĐ-CP (2.789.000 đ/tháng)')

with open('src/routes/ho-so/$id.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated ho-so/$id.tsx legal rates successfully!')

