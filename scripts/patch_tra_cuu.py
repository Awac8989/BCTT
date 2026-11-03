import re

with open('src/routes/tra-cuu.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Imports
old_import = 'import { formatVND, type HoSo } from "@/data/mock";'
new_import = '''import { formatVND, type HoSo } from "@/data/mock";
import { GiayHenModal } from "@/components/GiayHenModal";
import { QuyetDinhModal } from "@/components/QuyetDinhModal";
import { MauD03TsModal } from "@/components/MauD03TsModal";
import { Award } from "lucide-react";'''

if old_import in content:
    content = content.replace(old_import, new_import, 1)

# 2. Add state
old_state = '  const [hasSearched, setHasSearched] = useState(true);'
new_state = '''  const [hasSearched, setHasSearched] = useState(true);
  const [showGiayHen, setShowGiayHen] = useState(false);
  const [showQuyetDinh, setShowQuyetDinh] = useState(false);
  const [showBhyt, setShowBhyt] = useState(false);'''

if old_state in content:
    content = content.replace(old_state, new_state, 1)

# 3. Add buttons in action bar
old_btns = '''                <div className="flex items-center gap-2 self-end sm:self-center">
                  <Link
                    to="/khao-sat"
                    search={{ maHoSo: searchedHoSo.soHoSoTinh || searchedHoSo.id, hoTen: searchedHoSo.hoTen } as any}
                    className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Star className="size-3.5 text-amber-500 fill-amber-400" />
                    Đánh giá dịch vụ công
                  </Link>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded font-semibold text-xs border border-gray-300 flex items-center gap-1"
                  >
                    <Printer className="size-3.5" />
                    In kết quả
                  </button>
                </div>'''

new_btns = '''                <div className="flex items-center gap-2 self-end sm:self-center flex-wrap">
                  <button
                    type="button"
                    onClick={() => setShowGiayHen(true)}
                    className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-300 rounded font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    title="Xem & Tải Giấy tiếp nhận hồ sơ và Hẹn trả kết quả Mẫu 01/NĐ61 có mã QR tra cứu"
                  >
                    <FileText className="size-3.5 text-sky-700" />
                    Giấy hẹn Một cửa (QR)
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowQuyetDinh(true)}
                    className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    title="Xem văn bản Quyết định hưởng trợ cấp ưu đãi điện tử có chữ ký số SmartCA của Lãnh đạo Sở"
                  >
                    <Award className="size-3.5 text-amber-600" />
                    Quyết định trợ cấp
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowBhyt(true)}
                    className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-300 rounded font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    title="Xem Danh sách cấp thẻ BHYT diện Nhà nước đóng 100% Mẫu D03-TS"
                  >
                    <CreditCard className="size-3.5 text-teal-700" />
                    Thẻ BHYT (Mẫu D03-TS)
                  </button>

                  <Link
                    to="/khao-sat"
                    search={{ maHoSo: searchedHoSo.soHoSoTinh || searchedHoSo.id, hoTen: searchedHoSo.hoTen } as any}
                    className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-[#dd4b39] border border-red-300 rounded font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Star className="size-3.5 text-[#dd4b39] fill-[#dd4b39]" />
                    Đánh giá dịch vụ công
                  </Link>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded font-semibold text-xs border border-gray-300 flex items-center gap-1"
                  >
                    <Printer className="size-3.5" />
                    In kết quả
                  </button>
                </div>'''

if old_btns in content:
    content = content.replace(old_btns, new_btns, 1)

# 4. Update Decree 75 to Decree 77/2024
content = content.replace("Xác định mức trợ cấp (NĐ 75)", "Xác định mức trợ cấp (Nghị định 77/2024/NĐ-CP)")

# 5. Mount modals before </main> or at bottom
old_main_end = '</main>'
new_main_end = '''  {/* Modals phục vụ Công dân tải kết quả số hóa */}
        {searchedHoSo && (
          <>
            <GiayHenModal
              hoSo={searchedHoSo}
              isOpen={showGiayHen}
              onClose={() => setShowGiayHen(false)}
            />

            <QuyetDinhModal
              hoSo={searchedHoSo}
              isOpen={showQuyetDinh}
              onClose={() => setShowQuyetDinh(false)}
            />

            <MauD03TsModal
              hoSo={searchedHoSo}
              isOpen={showBhyt}
              onClose={() => setShowBhyt(false)}
            />
          </>
        )}
      </main>'''

if old_main_end in content:
    content = content.replace(old_main_end, new_main_end, 1)

with open('src/routes/tra-cuu.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("tra-cuu.tsx updated successfully!")

