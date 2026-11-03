import re

with open('src/routes/tham-dinh.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Imports
old_import = 'import { MauD03TsModal } from "@/components/MauD03TsModal";'
new_import = '''import { MauD03TsModal } from "@/components/MauD03TsModal";
import { BienBanNiemYetModal } from "@/components/BienBanNiemYetModal";
import { QuyetDinhMaiTangPhiModal } from "@/components/QuyetDinhMaiTangPhiModal";
import { Calendar } from "lucide-react";'''

if old_import in content:
    content = content.replace(old_import, new_import, 1)

# 2. Add states in ThamDinhPage
old_state = '  const [selectedHoSoForD03Ts, setSelectedHoSoForD03Ts] = useState<HoSo | null>(null);'
new_state = '''  const [selectedHoSoForD03Ts, setSelectedHoSoForD03Ts] = useState<HoSo | null>(null);
  const [selectedHoSoForNiemYet, setSelectedHoSoForNiemYet] = useState<HoSo | null>(null);
  const [selectedHoSoForMaiTang, setSelectedHoSoForMaiTang] = useState<HoSo | null>(null);'''

if old_state in content:
    content = content.replace(old_state, new_state, 1)

# 3. Add buttons in table actions
old_actions = '''                        {h.trangThai === "ĐÃ_DUYỆT" && (
                          <button
                            type="button"
                            onClick={() => setSelectedHoSoForD03Ts(h)}
                            title="Danh sách đề nghị cấp thẻ BHYT Người có công (Mẫu D03-TS)"
                            className="size-6 rounded bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center transition-colors shadow-2xs"
                          >
                            <CreditCard className="size-3.5" />
                          </button>
                        )}'''

new_actions = '''                        <button
                          type="button"
                          onClick={() => setSelectedHoSoForNiemYet(h)}
                          title="Xem Biên bản niêm yết công khai 15 ngày tại cấp Xã/Phường"
                          className="size-6 rounded bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center transition-colors shadow-2xs"
                        >
                          <Calendar className="size-3.5" />
                        </button>

                        {h.isTuTran && (
                          <button
                            type="button"
                            onClick={() => setSelectedHoSoForMaiTang(h)}
                            title="Quyết định hưởng trợ cấp Mai táng phí (23.4 triệu đ) & Trợ cấp một lần"
                            className="size-6 rounded bg-rose-700 hover:bg-rose-800 text-white flex items-center justify-center transition-colors shadow-2xs"
                          >
                            <CreditCard className="size-3.5" />
                          </button>
                        )}

                        {h.trangThai === "ĐÃ_DUYỆT" && (
                          <button
                            type="button"
                            onClick={() => setSelectedHoSoForD03Ts(h)}
                            title="Danh sách đề nghị cấp thẻ BHYT Người có công (Mẫu D03-TS)"
                            className="size-6 rounded bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center transition-colors shadow-2xs"
                          >
                            <CreditCard className="size-3.5" />
                          </button>
                        )}'''

if old_actions in content:
    content = content.replace(old_actions, new_actions, 1)

# 4. Mount modals before </AppShell>
old_end = '''      {/* 9. Modal Mẫu D03-TS cấp thẻ BHYT liên thông BHXH */}
      <MauD03TsModal
        isOpen={Boolean(selectedHoSoForD03Ts)}
        onClose={() => setSelectedHoSoForD03Ts(null)}
        hoSo={selectedHoSoForD03Ts}
        loaiNghiepVu={selectedHoSoForD03Ts?.isTuTran ? "BAO_GIAM" : "CAP_MOI"}
      />
    </AppShell>'''

new_end = '''      {/* 9. Modal Mẫu D03-TS cấp thẻ BHYT liên thông BHXH */}
      <MauD03TsModal
        isOpen={Boolean(selectedHoSoForD03Ts)}
        onClose={() => setSelectedHoSoForD03Ts(null)}
        hoSo={selectedHoSoForD03Ts}
        loaiNghiepVu={selectedHoSoForD03Ts?.isTuTran ? "BAO_GIAM" : "CAP_MOI"}
      />

      {/* 10. Modal Biên bản Niêm yết công khai 15 ngày tại cấp Xã/Phường */}
      <BienBanNiemYetModal
        isOpen={Boolean(selectedHoSoForNiemYet)}
        onClose={() => setSelectedHoSoForNiemYet(null)}
        hoSo={selectedHoSoForNiemYet}
      />

      {/* 11. Modal Quyết định hưởng trợ cấp Mai táng phí & Trợ cấp một lần */}
      <QuyetDinhMaiTangPhiModal
        isOpen={Boolean(selectedHoSoForMaiTang)}
        onClose={() => setSelectedHoSoForMaiTang(null)}
        hoSo={selectedHoSoForMaiTang}
      />
    </AppShell>'''

if old_end in content:
    content = content.replace(old_end, new_end, 1)

with open('src/routes/tham-dinh.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("src/routes/tham-dinh.tsx successfully patched!")

