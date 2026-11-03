import re

with open('src/routes/tham-dinh.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Imports
old_import = 'import { QuyetDinhMaiTangPhiModal } from "@/components/QuyetDinhMaiTangPhiModal";'
new_import = '''import { QuyetDinhMaiTangPhiModal } from "@/components/QuyetDinhMaiTangPhiModal";
import { BienBanXacMinhThucDiaModal } from "@/components/BienBanXacMinhThucDiaModal";
import { MapPin } from "lucide-react";'''

if old_import in content:
    content = content.replace(old_import, new_import, 1)

# 2. Add state
old_state = '  const [selectedHoSoForMaiTang, setSelectedHoSoForMaiTang] = useState<HoSo | null>(null);'
new_state = '''  const [selectedHoSoForMaiTang, setSelectedHoSoForMaiTang] = useState<HoSo | null>(null);
  const [selectedHoSoForXacMinh, setSelectedHoSoForXacMinh] = useState<HoSo | null>(null);'''

if old_state in content:
    content = content.replace(old_state, new_state, 1)

# 3. Add button in table actions
old_actions = '''                        <button
                          type="button"
                          onClick={() => setSelectedHoSoForNiemYet(h)}
                          title="Xem Biên bản niêm yết công khai 15 ngày tại cấp Xã/Phường"
                          className="size-6 rounded bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center transition-colors shadow-2xs"
                        >
                          <Calendar className="size-3.5" />
                        </button>'''

new_actions = '''                        <button
                          type="button"
                          onClick={() => setSelectedHoSoForXacMinh(h)}
                          title="Biên bản kiểm tra hiện trường & xác minh thực địa cấp cơ sở (Mẫu 02/XMTD)"
                          className="size-6 rounded bg-sky-700 hover:bg-sky-800 text-white flex items-center justify-center transition-colors shadow-2xs"
                        >
                          <MapPin className="size-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedHoSoForNiemYet(h)}
                          title="Xem Biên bản niêm yết công khai 15 ngày tại cấp Xã/Phường"
                          className="size-6 rounded bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center transition-colors shadow-2xs"
                        >
                          <Calendar className="size-3.5" />
                        </button>'''

if old_actions in content:
    content = content.replace(old_actions, new_actions, 1)

# 4. Mount modal
old_end = '''      {/* 11. Modal Quyết định hưởng trợ cấp Mai táng phí & Trợ cấp một lần */}
      <QuyetDinhMaiTangPhiModal
        isOpen={Boolean(selectedHoSoForMaiTang)}
        onClose={() => setSelectedHoSoForMaiTang(null)}
        hoSo={selectedHoSoForMaiTang}
      />
    </AppShell>'''

new_end = '''      {/* 11. Modal Quyết định hưởng trợ cấp Mai táng phí & Trợ cấp một lần */}
      <QuyetDinhMaiTangPhiModal
        isOpen={Boolean(selectedHoSoForMaiTang)}
        onClose={() => setSelectedHoSoForMaiTang(null)}
        hoSo={selectedHoSoForMaiTang}
      />

      {/* 12. Modal Biên bản kiểm tra hiện trường & xác minh thực địa */}
      <BienBanXacMinhThucDiaModal
        isOpen={Boolean(selectedHoSoForXacMinh)}
        onClose={() => setSelectedHoSoForXacMinh(null)}
        hoSo={selectedHoSoForXacMinh}
      />
    </AppShell>'''

if old_end in content:
    content = content.replace(old_end, new_end, 1)

with open('src/routes/tham-dinh.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("tham-dinh.tsx updated with BienBanXacMinhThucDiaModal successfully!")

