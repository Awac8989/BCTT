import re

with open('src/routes/dung-cu-chinh-hinh.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add import
old_import = 'import { DigitalSignatureBadge } from "@/components/DigitalSignatureBadge";'
new_import = '''import { DigitalSignatureBadge } from "@/components/DigitalSignatureBadge";
import { PhieuCapDungCuModal } from "@/components/PhieuCapDungCuModal";'''
if old_import in content:
    content = content.replace(old_import, new_import, 1)

# 2. Replace old printItem modal with PhieuCapDungCuModal
# Search for {/* Modal Xem & In Phiếu Cấp Dụng Cụ */} to the end of {printItem && (...)}
modal_start = '{/* Modal Xem & In Phiếu Cấp Dụng Cụ */}'
modal_end = '{/* Modal Xem & In Phiếu Cấp Dụng Cụ */}'

# Let's find index of modal_start
idx = content.find(modal_start)
if idx != -1:
    # find where printItem modal ends
    # The modal starts at idx, and ends before </div>\n    </AppShell>
    rest = content[idx:]
    # it ends right before </div>\n    </AppShell>
    end_tag = '      </div>\n    </AppShell>'
    if end_tag not in rest:
        end_tag = '</div>\n    </AppShell>'
    
    end_idx = content.rfind('</div>\n    </AppShell>')
    if end_idx != -1:
        replaced_section = '''{/* Modal Xem & In Phiếu Cấp Dụng Cụ Chuẩn Phụ Lục V Nghị Định 77/2024/NĐ-CP */}
        <PhieuCapDungCuModal
          isOpen={Boolean(printItem)}
          onClose={() => setPrintItem(null)}
          item={printItem}
        />
      '''
        content = content[:idx] + replaced_section + content[end_idx:]

with open('src/routes/dung-cu-chinh-hinh.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("dung-cu-chinh-hinh.tsx updated successfully!")

