import re

with open('src/components/admin/VanBanDieuHanh.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Import
old_import = 'import { type VanBanDenItem, type VanBanDiItem, type TiepCongDanItem } from "@/data/domain-mock";'
new_import = '''import { type VanBanDenItem, type VanBanDiItem, type TiepCongDanItem } from "@/data/domain-mock";
import { PhieuHuongDanTiepDanModal } from "@/components/PhieuHuongDanTiepDanModal";'''

if old_import in content:
    content = content.replace(old_import, new_import, 1)

# 2. Add state
old_state = '  const [modalSoanVbDi, setModalSoanVbDi] = useState(false);'
new_state = '''  const [modalSoanVbDi, setModalSoanVbDi] = useState(false);
  const [selectedTcdForPrint, setSelectedTcdForPrint] = useState<TiepCongDanItem | null>(null);'''

if old_state in content:
    content = content.replace(old_state, new_state, 1)

# 3. Add table header and column in TIEP_CONG_DAN table
old_th = '<th className="px-4 py-3 text-center">Trạng thái</th>\n                  </tr>'
new_th = '<th className="px-4 py-3 text-center">Trạng thái</th>\n                    <th className="px-4 py-3 text-right">Thao tác</th>\n                  </tr>'

if old_th in content:
    content = content.replace(old_th, new_th, 1)

old_td = '''                      <td className="px-4 py-3 text-center">
                        {tcd.trangThai === "DA_BAN_HANH_TRA_LOI" ? (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                            Đã ban hành trả lời
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800">
                            Đang xác minh
                          </span>
                        )}
                      </td>
                    </tr>'''

new_td = '''                      <td className="px-4 py-3 text-center">
                        {tcd.trangThai === "DA_BAN_HANH_TRA_LOI" ? (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                            Đã ban hành trả lời
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800">
                            Đang xác minh
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedTcdForPrint(tcd)}
                          className="px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold text-[11px] inline-flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                          title="In Phiếu Hướng dẫn &amp; Xử lý đơn thư Tiếp công dân (Mẫu A4 chuẩn)"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>In phiếu</span>
                        </button>
                      </td>
                    </tr>'''

if old_td in content:
    content = content.replace(old_td, new_td, 1)

# 4. Mount PhieuHuongDanTiepDanModal before the last closing </div>
idx = content.rfind('    </div>\n  );\n}')
if idx != -1:
    modal_code = '''      {/* Modal In Phiếu Hướng dẫn & Xử lý đơn thư Tiếp công dân */}
      <PhieuHuongDanTiepDanModal
        isOpen={Boolean(selectedTcdForPrint)}
        onClose={() => setSelectedTcdForPrint(null)}
        item={selectedTcdForPrint}
      />
    </div>
  );
}'''
    content = content[:idx] + modal_code

with open('src/components/admin/VanBanDieuHanh.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("VanBanDieuHanh.tsx updated successfully!")

