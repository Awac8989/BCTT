import re

with open('src/routes/ho-so/$id.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Import
old_import = 'import { QuyetDinhMaiTangPhiModal } from "@/components/QuyetDinhMaiTangPhiModal";'
new_import = '''import { QuyetDinhMaiTangPhiModal } from "@/components/QuyetDinhMaiTangPhiModal";
import { BienBanXacMinhThucDiaModal } from "@/components/BienBanXacMinhThucDiaModal";'''

if old_import in content:
    content = content.replace(old_import, new_import, 1)

# 2. Add state
old_state = '  const [showMaiTangPhi, setShowMaiTangPhi] = useState(false);'
new_state = '''  const [showMaiTangPhi, setShowMaiTangPhi] = useState(false);
  const [showXacMinh, setShowXacMinh] = useState(false);'''

if old_state in content:
    content = content.replace(old_state, new_state, 1)

# 3. Add button in action bar
old_btn = '''          <button
            type="button"
            onClick={() => setShowNiemYet(true)}'''

new_btn = '''          <button
            type="button"
            onClick={() => setShowXacMinh(true)}
            className="flex items-center gap-1 rounded-[3px] bg-sky-700 hover:bg-sky-800 px-3.5 py-1 font-bold text-white shadow-xs cursor-pointer"
            title="Biên bản kiểm tra hiện trường &amp; xác minh thực địa cấp cơ sở (Mẫu 02/XMTD)"
          >
            <MapPin className="size-3.5" />
            Xác minh thực địa
          </button>
          <button
            type="button"
            onClick={() => setShowNiemYet(true)}'''

if old_btn in content:
    content = content.replace(old_btn, new_btn, 1)

# 4. Mount modal before </AppShell>
old_end = '''      {/* Modal Quyết định hưởng trợ cấp Mai táng phí & Trợ cấp một lần */}
      <QuyetDinhMaiTangPhiModal
        isOpen={showMaiTangPhi}
        onClose={() => setShowMaiTangPhi(false)}
        hoSo={hoSo}
      />
    </AppShell>'''

new_end = '''      {/* Modal Quyết định hưởng trợ cấp Mai táng phí & Trợ cấp một lần */}
      <QuyetDinhMaiTangPhiModal
        isOpen={showMaiTangPhi}
        onClose={() => setShowMaiTangPhi(false)}
        hoSo={hoSo}
      />

      {/* Modal Biên bản kiểm tra hiện trường & xác minh thực địa */}
      <BienBanXacMinhThucDiaModal
        isOpen={showXacMinh}
        onClose={() => setShowXacMinh(false)}
        hoSo={hoSo}
      />
    </AppShell>'''

if old_end in content:
    content = content.replace(old_end, new_end, 1)

with open('src/routes/ho-so/$id.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("ho-so/$id.tsx updated with BienBanXacMinhThucDiaModal successfully!")

