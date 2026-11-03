import re

with open('src/components/an-sinh/tabs/BaoTroXaHoiTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Import Printer
old_import = 'import {\n  Users,\n  Search,'
new_import = 'import {\n  Users,\n  Search,\n  Printer,'

if old_import in content:
    content = content.replace(old_import, new_import, 1)

# 2. Add prop
old_props = '''interface BaoTroXaHoiTabProps {
  baoTroList: DoiTuongBaoTroXaHoi[];
  onOpenAddModal: () => void;
  onOpenThoiHuongModal: (item: DoiTuongBaoTroXaHoi) => void;
}'''

new_props = '''interface BaoTroXaHoiTabProps {
  baoTroList: DoiTuongBaoTroXaHoi[];
  onOpenAddModal: () => void;
  onOpenThoiHuongModal: (item: DoiTuongBaoTroXaHoi) => void;
  onOpenQuyetDinhModal?: (item: DoiTuongBaoTroXaHoi) => void;
}'''

if old_props in content:
    content = content.replace(old_props, new_props, 1)

old_fn = '''export function BaoTroXaHoiTab({
  baoTroList,
  onOpenAddModal,
  onOpenThoiHuongModal,
}: BaoTroXaHoiTabProps) {'''

new_fn = '''export function BaoTroXaHoiTab({
  baoTroList,
  onOpenAddModal,
  onOpenThoiHuongModal,
  onOpenQuyetDinhModal,
}: BaoTroXaHoiTabProps) {'''

if old_fn in content:
    content = content.replace(old_fn, new_fn, 1)

# 3. Add button in action column
old_action = '''                    <td className="py-2.5 px-3 text-right">
                      {item.trangThai === "DANG_HUONG" ? (
                        <button
                          onClick={() => onOpenThoiHuongModal(item)}
                          className="px-2.5 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors inline-flex items-center gap-1"
                          title="Ban hành Quyết định thôi hưởng trợ cấp (khi chết hoặc chuyển khẩu)"
                        >
                          <UserX className="size-3 text-rose-600" />
                          Thôi hưởng
                        </button>
                      ) : (
                        <span className="text-[11px] text-gray-400 italic">Đã chốt sổ</span>
                      )}
                    </td>'''

new_action = '''                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onOpenQuyetDinhModal && onOpenQuyetDinhModal(item)}
                          className="px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                          title="Xem & In Quyết định trợ cấp xã hội hàng tháng (Nghị định 76/2024/NĐ-CP)"
                        >
                          <Printer className="size-3 text-blue-600" />
                          <span>Quyết định</span>
                        </button>
                        {item.trangThai === "DANG_HUONG" ? (
                          <button
                            onClick={() => onOpenThoiHuongModal(item)}
                            className="px-2.5 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                            title="Ban hành Quyết định thôi hưởng trợ cấp (khi chết hoặc chuyển khẩu)"
                          >
                            <UserX className="size-3 text-rose-600" />
                            Thôi hưởng
                          </button>
                        ) : (
                          <span className="text-[11px] text-gray-400 italic">Đã chốt sổ</span>
                        )}
                      </div>
                    </td>'''

if old_action in content:
    content = content.replace(old_action, new_action, 1)

with open('src/components/an-sinh/tabs/BaoTroXaHoiTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("BaoTroXaHoiTab.tsx updated successfully!")

