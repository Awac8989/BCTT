with open('src/routes/phan-tich.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('{activeTab === "SO_LIEU" && (\n        <div className="grid gap-3 lg:grid-cols-3">', '{activeTab === "SO_LIEU" && (\n        <>\n          <div className="grid gap-3 lg:grid-cols-3">')

old_end = '''        </div>
      )}

      {/* TAB 2: ĐÁNH GIÁ HIỆU QUẢ ĐỀ TÀI'''

new_end = '''        </div>
        </>
      )}

      {/* TAB 2: ĐÁNH GIÁ HIỆU QUẢ ĐỀ TÀI'''

if old_end in text:
    text = text.replace(old_end, new_end, 1)

with open('src/routes/phan-tich.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated SO_LIEU fragment successfully!')

