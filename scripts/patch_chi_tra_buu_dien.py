import re

with open('src/routes/chi-tra.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Imports
old_import = 'import { QuyetDinhMaiTangPhiModal } from "@/components/QuyetDinhMaiTangPhiModal";'
new_import = '''import { QuyetDinhMaiTangPhiModal } from "@/components/QuyetDinhMaiTangPhiModal";
import { BangKeBuuDienModal } from "@/components/BangKeBuuDienModal";'''

if old_import in content:
    content = content.replace(old_import, new_import, 1)

# 2. Add state
old_state = '  const [showSoChiTraModal, setShowSoChiTraModal] = useState(false);'
new_state = '''  const [showSoChiTraModal, setShowSoChiTraModal] = useState(false);
  const [showBuuDienModal, setShowBuuDienModal] = useState(false);'''

if old_state in content:
    content = content.replace(old_state, new_state, 1)

# 3. Action button
old_btn = '''          {/* Nút lập danh sách phát tiền bưu điện */}
          <button
            type="button"
            onClick={() => {
              setHinhThuc("BUU_DIEN");
              toast.info("Đã lọc danh sách chi trả tiền mặt qua Bưu điện VNPost");
            }}
            className="flex items-center gap-1.5 rounded-full bg-[#00a65a] hover:bg-[#008d4c] px-4 py-1.5 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer"
          >
            <Building2 className="size-3.5" />
            Danh sách Bưu điện VNPost
          </button>'''

new_btn = '''          {/* Nút lập danh sách phát tiền bưu điện & Phiếu phát tận nhà */}
          <button
            type="button"
            onClick={() => {
              setHinhThuc("BUU_DIEN");
              setShowBuuDienModal(true);
            }}
            className="flex items-center gap-1.5 rounded-full bg-[#00a65a] hover:bg-[#008d4c] px-4 py-1.5 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer"
            title="Bảng kê chi trả tiền mặt qua Bưu điện VNPost & Phiếu phát tiền tận nhà cho Mẹ VNAH / TB nặng"
          >
            <Building2 className="size-3.5" />
            Bảng kê Bưu điện VNPost (Tiền mặt)
          </button>'''

if old_btn in content:
    content = content.replace(old_btn, new_btn, 1)

# 4. Mount modal
old_modals_end = '''      {/* Modal Quyết định Hưởng Trợ cấp Mai táng phí & Trợ cấp một lần */}
      <QuyetDinhMaiTangPhiModal
        isOpen={Boolean(selectedHoSoForMaiTang)}
        onClose={() => setSelectedHoSoForMaiTang(null)}
        hoSo={selectedHoSoForMaiTang}
      />
    </AppShell>'''

new_modals_end = '''      {/* Modal Quyết định Hưởng Trợ cấp Mai táng phí & Trợ cấp một lần */}
      <QuyetDinhMaiTangPhiModal
        isOpen={Boolean(selectedHoSoForMaiTang)}
        onClose={() => setSelectedHoSoForMaiTang(null)}
        hoSo={selectedHoSoForMaiTang}
      />

      {/* Modal Bảng kê Bưu điện VNPost & Phiếu phát tiền tận nhà */}
      <BangKeBuuDienModal
        isOpen={showBuuDienModal}
        onClose={() => setShowBuuDienModal(false)}
        items={chiTraList}
        kyChiTra={`Tháng ${kyChiTra}`}
      />
    </AppShell>'''

if old_modals_end in content:
    content = content.replace(old_modals_end, new_modals_end, 1)

with open('src/routes/chi-tra.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("chi-tra.tsx updated with BangKeBuuDienModal successfully!")

