import re

with open('src/routes/ho-so/$id.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Imports
old_import = 'import { MauD03TsModal } from "@/components/MauD03TsModal";'
new_import = '''import { MauD03TsModal } from "@/components/MauD03TsModal";
import { BienBanNiemYetModal } from "@/components/BienBanNiemYetModal";
import { QuyetDinhMaiTangPhiModal } from "@/components/QuyetDinhMaiTangPhiModal";'''

if old_import in content:
    content = content.replace(old_import, new_import, 1)

# 2. Add state
old_state = '  const [showD03Ts, setShowD03Ts] = useState(false);'
new_state = '''  const [showD03Ts, setShowD03Ts] = useState(false);
  const [showNiemYet, setShowNiemYet] = useState(false);
  const [showMaiTangPhi, setShowMaiTangPhi] = useState(false);'''

if old_state in content:
    content = content.replace(old_state, new_state, 1)

# 3. Add buttons in action bar
old_btn = '''          <button
            type="button"
            onClick={() => setShowToTrinh(true)}'''

new_btn = '''          <button
            type="button"
            onClick={() => setShowNiemYet(true)}
            className="flex items-center gap-1 rounded-[3px] bg-[#00a65a] hover:bg-[#008d4c] px-3.5 py-1 font-bold text-white shadow-xs cursor-pointer"
            title="Biên bản Niêm yết công khai 15 ngày tại cấp Xã/Phường theo Nghị định 131/2021"
          >
            <Calendar className="size-3.5" />
            Niêm yết 15 ngày
          </button>
          <button
            type="button"
            onClick={() => setShowToTrinh(true)}'''

if old_btn in content:
    content = content.replace(old_btn, new_btn, 1)

# Also add Mai táng phí button if isTuTran
old_tu_tran_btn = '''          {!hoSo.isTuTran && (
            <button
              type="button"
              onClick={() => setShowBaoGiam(true)}
              className="flex items-center gap-1 rounded-[3px] bg-[#dd4b39] hover:bg-[#c82333] px-3.5 py-1 font-bold text-white shadow-xs cursor-pointer"
            >
              <UserMinus className="size-3.5" />
              Báo giảm từ trần
            </button>
          )}'''

new_tu_tran_btn = '''          {!hoSo.isTuTran ? (
            <button
              type="button"
              onClick={() => setShowBaoGiam(true)}
              className="flex items-center gap-1 rounded-[3px] bg-[#dd4b39] hover:bg-[#c82333] px-3.5 py-1 font-bold text-white shadow-xs cursor-pointer"
            >
              <UserMinus className="size-3.5" />
              Báo giảm từ trần
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowMaiTangPhi(true)}
              className="flex items-center gap-1 rounded-[3px] bg-red-700 hover:bg-red-800 px-3.5 py-1 font-bold text-white shadow-xs cursor-pointer"
              title="Quyết định hưởng trợ cấp Mai táng phí (23.4 triệu đ) & Trợ cấp 1 lần"
            >
              <CreditCard className="size-3.5" />
              QĐ Mai táng phí
            </button>
          )}'''

if old_tu_tran_btn in content:
    content = content.replace(old_tu_tran_btn, new_tu_tran_btn, 1)

# 4. Mount modals before </AppShell>
old_end = '''      {/* Modal Mẫu D03-TS cấp thẻ BHYT liên thông BHXH */}
      <MauD03TsModal
        isOpen={showD03Ts}
        onClose={() => setShowD03Ts(false)}
        hoSo={hoSo}
        loaiNghiepVu={hoSo.isTuTran ? "BAO_GIAM" : "CAP_MOI"}
      />
    </AppShell>'''

new_end = '''      {/* Modal Mẫu D03-TS cấp thẻ BHYT liên thông BHXH */}
      <MauD03TsModal
        isOpen={showD03Ts}
        onClose={() => setShowD03Ts(false)}
        hoSo={hoSo}
        loaiNghiepVu={hoSo.isTuTran ? "BAO_GIAM" : "CAP_MOI"}
      />

      {/* Modal Biên bản Niêm yết công khai 15 ngày tại cấp Xã/Phường */}
      <BienBanNiemYetModal
        isOpen={showNiemYet}
        onClose={() => setShowNiemYet(false)}
        hoSo={hoSo}
      />

      {/* Modal Quyết định hưởng trợ cấp Mai táng phí & Trợ cấp một lần */}
      <QuyetDinhMaiTangPhiModal
        isOpen={showMaiTangPhi}
        onClose={() => setShowMaiTangPhi(false)}
        hoSo={hoSo}
      />
    </AppShell>'''

if old_end in content:
    content = content.replace(old_end, new_end, 1)

with open('src/routes/ho-so/$id.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("src/routes/ho-so/$id.tsx successfully patched!")

