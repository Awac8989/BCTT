import re

with open('src/routes/chi-tra.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Imports
old_imports = 'import { BangKeQua27Thang7Modal } from "@/components/BangKeQua27Thang7Modal";'
new_imports = '''import { BangKeQua27Thang7Modal } from "@/components/BangKeQua27Thang7Modal";
import { SoChiTraTroCapModal } from "@/components/SoChiTraTroCapModal";
import { QuyetDinhMaiTangPhiModal } from "@/components/QuyetDinhMaiTangPhiModal";'''

if old_imports in content:
    content = content.replace(old_imports, new_imports, 1)

# 2. Add state
old_state = '  const [showQua277Modal, setShowQua277Modal] = useState(false);'
new_state = '''  const [showQua277Modal, setShowQua277Modal] = useState(false);
  const [showSoChiTraModal, setShowSoChiTraModal] = useState(false);
  const [selectedHoSoForMaiTang, setSelectedHoSoForMaiTang] = useState<any | null>(null);'''

if old_state in content:
    content = content.replace(old_state, new_state, 1)

# 3. Add buttons in action bar
old_btn = '''          {/* Nút xem Bảng kê Quà tặng 27/7 & Thờ cúng liệt sĩ */}
          <button
            type="button"
            onClick={() => setShowQua277Modal(true)}'''

new_btn = '''          {/* Nút xem Sổ theo dõi Chi trả Trợ cấp Mẫu C70b-HD */}
          <button
            type="button"
            onClick={() => setShowSoChiTraModal(true)}
            className="flex items-center gap-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 px-4 py-1.5 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer"
            title="Sổ theo dõi chi trả trợ cấp ưu đãi người có công Mẫu C70b-HD (A4 ngang)"
          >
            <FileSpreadsheet className="size-3.5" />
            Sổ Chi trả Mẫu C70b-HD
          </button>

          {/* Nút Quyết định Mai táng phí & Trợ cấp 1 lần */}
          <button
            type="button"
            onClick={() => {
              const tuTran = hoSoList.find(h => h.isTuTran) || hoSoList[0];
              setSelectedHoSoForMaiTang(tuTran);
            }}
            className="flex items-center gap-1.5 rounded-full bg-rose-700 hover:bg-rose-800 px-4 py-1.5 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer"
            title="Quyết định hưởng trợ cấp mai táng phí (10 tháng lương cơ sở = 23.4 triệu đ) và trợ cấp 1 lần khi NCC từ trần"
          >
            <CreditCard className="size-3.5" />
            QĐ Mai táng phí &amp; Một lần
          </button>

          {/* Nút xem Bảng kê Quà tặng 27/7 & Thờ cúng liệt sĩ */}
          <button
            type="button"
            onClick={() => setShowQua277Modal(true)}'''

if old_btn in content:
    content = content.replace(old_btn, new_btn, 1)

# 4. Mount modals before </AppShell>
old_modals_end = '''      {/* Modal Bảng kê Quà tặng 27/7 & Thờ cúng Liệt sĩ hàng năm */}
      <BangKeQua27Thang7Modal
        isOpen={showQua277Modal}
        onClose={() => setShowQua277Modal(false)}
        kyChiTra={kyChiTra}
      />
    </AppShell>'''

new_modals_end = '''      {/* Modal Bảng kê Quà tặng 27/7 & Thờ cúng Liệt sĩ hàng năm */}
      <BangKeQua27Thang7Modal
        isOpen={showQua277Modal}
        onClose={() => setShowQua277Modal(false)}
        kyChiTra={kyChiTra}
      />

      {/* Modal Sổ theo dõi Chi trả Trợ cấp Mẫu C70b-HD */}
      <SoChiTraTroCapModal
        isOpen={showSoChiTraModal}
        onClose={() => setShowSoChiTraModal(false)}
        hoSoList={hoSoList}
        thangChiTra={`Tháng ${kyChiTra}`}
      />

      {/* Modal Quyết định Hưởng Trợ cấp Mai táng phí & Trợ cấp một lần */}
      <QuyetDinhMaiTangPhiModal
        isOpen={Boolean(selectedHoSoForMaiTang)}
        onClose={() => setSelectedHoSoForMaiTang(null)}
        hoSo={selectedHoSoForMaiTang}
      />
    </AppShell>'''

if old_modals_end in content:
    content = content.replace(old_modals_end, new_modals_end, 1)

with open('src/routes/chi-tra.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("src/routes/chi-tra.tsx successfully patched!")

