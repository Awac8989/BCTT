import re

with open('src/routes/ho-so/index.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Imports
old_import = 'import { QuyetDinhModal } from "@/components/QuyetDinhModal";'
new_import = '''import { QuyetDinhModal } from "@/components/QuyetDinhModal";
import { BienBanNiemYetModal } from "@/components/BienBanNiemYetModal";
import { QuyetDinhMaiTangPhiModal } from "@/components/QuyetDinhMaiTangPhiModal";
import { Calendar, CreditCard } from "lucide-react";'''

if old_import in content:
    content = content.replace(old_import, new_import, 1)

# 2. Add states in HoSoIndex
old_state = '  const [selectedQdHoSo, setSelectedQdHoSo] = useState<HoSo | null>(null);'
new_state = '''  const [selectedQdHoSo, setSelectedQdHoSo] = useState<HoSo | null>(null);
  const [selectedNiemYetHoSo, setSelectedNiemYetHoSo] = useState<HoSo | null>(null);
  const [selectedMaiTangHoSo, setSelectedMaiTangHoSo] = useState<HoSo | null>(null);'''

if old_state in content:
    content = content.replace(old_state, new_state, 1)

# 3. Add buttons in table actions
old_actions = '''                        <button
                          type="button"
                          onClick={() => setSelectedGiayHenHoSo(h)}
                          title="In Giấy tiếp nhận hồ sơ & Hẹn trả kết quả (kèm Mã QR Đánh giá)"
                          className="size-6 rounded-[2px] bg-[#00a65a] hover:bg-[#008d4c] text-white flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                        >
                          <Printer className="size-3.5" />
                        </button>'''

new_actions = '''                        <button
                          type="button"
                          onClick={() => setSelectedGiayHenHoSo(h)}
                          title="In Giấy tiếp nhận hồ sơ & Hẹn trả kết quả (kèm Mã QR Đánh giá)"
                          className="size-6 rounded-[2px] bg-[#00a65a] hover:bg-[#008d4c] text-white flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                        >
                          <Printer className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedNiemYetHoSo(h)}
                          title="Xem & In Biên bản Niêm yết công khai 15 ngày tại cấp Xã/Phường"
                          className="size-6 rounded-[2px] bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                        >
                          <Calendar className="size-3.5" />
                        </button>'''

if old_actions in content:
    content = content.replace(old_actions, new_actions, 1)

# Also add Mai táng phí button if isTuTran
old_tu_tran = '''                        {!h.isTuTran && (
                          <button
                            type="button"
                            onClick={() => setBaoGiamHoSo(h)}
                            title="Thủ tục Báo giảm đối tượng từ trần & Cấp Quyết định Mai táng phí"
                            className="size-6 rounded-[2px] bg-[#dd4b39] hover:bg-[#c82333] text-white flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                          >
                            <UserMinus className="size-3.5" />
                          </button>
                        )}'''

new_tu_tran = '''                        {!h.isTuTran ? (
                          <button
                            type="button"
                            onClick={() => setBaoGiamHoSo(h)}
                            title="Thủ tục Báo giảm đối tượng từ trần & Cấp Quyết định Mai táng phí"
                            className="size-6 rounded-[2px] bg-[#dd4b39] hover:bg-[#c82333] text-white flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                          >
                            <UserMinus className="size-3.5" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setSelectedMaiTangHoSo(h)}
                            title="Quyết định hưởng trợ cấp Mai táng phí (23.4 triệu đ) & Trợ cấp một lần"
                            className="size-6 rounded-[2px] bg-rose-700 hover:bg-rose-800 text-white flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                          >
                            <CreditCard className="size-3.5" />
                          </button>
                        )}'''

if old_tu_tran in content:
    content = content.replace(old_tu_tran, new_tu_tran, 1)

# 4. Mount modals before </AppShell>
old_end = '''      {/* Modal Quyết định hưởng trợ cấp chuẩn Nghị định 30/2020 & NĐ 131/2021 */}
      {selectedQdHoSo && (
        <QuyetDinhModal
          hoSo={selectedQdHoSo}
          isOpen={!!selectedQdHoSo}
          onClose={() => setSelectedQdHoSo(null)}
        />
      )}
    </AppShell>'''

new_end = '''      {/* Modal Quyết định hưởng trợ cấp chuẩn Nghị định 30/2020 & NĐ 131/2021 */}
      {selectedQdHoSo && (
        <QuyetDinhModal
          hoSo={selectedQdHoSo}
          isOpen={!!selectedQdHoSo}
          onClose={() => setSelectedQdHoSo(null)}
        />
      )}

      {/* Modal Biên bản Niêm yết công khai 15 ngày tại cấp Xã/Phường */}
      <BienBanNiemYetModal
        isOpen={Boolean(selectedNiemYetHoSo)}
        onClose={() => setSelectedNiemYetHoSo(null)}
        hoSo={selectedNiemYetHoSo}
      />

      {/* Modal Quyết định hưởng trợ cấp Mai táng phí & Trợ cấp một lần */}
      <QuyetDinhMaiTangPhiModal
        isOpen={Boolean(selectedMaiTangHoSo)}
        onClose={() => setSelectedMaiTangHoSo(null)}
        hoSo={selectedMaiTangHoSo}
      />
    </AppShell>'''

if old_end in content:
    content = content.replace(old_end, new_end, 1)

with open('src/routes/ho-so/index.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("src/routes/ho-so/index.tsx successfully patched!")

