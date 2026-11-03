import re

with open('src/routes/dieu-duong.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. State
old_state = '  const [isDoanModalOpen, setIsDoanModalOpen] = useState(false);'
new_state = '''  const [isDoanModalOpen, setIsDoanModalOpen] = useState(false);
  const [selectedRecordForModal, setSelectedRecordForModal] = useState<DieuDuongRecord | null>(null);'''
if old_state in content:
    content = content.replace(old_state, new_state, 1)

# 2. Table row action
old_td = '''                  <td className="px-3 py-2.5 text-center">
                    {r.trangThai === "CHUA_THUC_HIEN" && r.hinhThuc === "TAI_NHA" ? (
                      <button
                        type="button"
                        onClick={() => handlePhatTienTaiNha(r.id)}
                        className="rounded-[2px] bg-[#00a65a] hover:bg-[#008d4c] px-2.5 py-1 text-xs font-bold text-white shadow-2xs cursor-pointer"
                      >
                        Cấp tiền
                      </button>
                    ) : r.trangThai === "CHUA_THUC_HIEN" && r.hinhThuc === "TAP_TRUNG" ? (
                      <button
                        type="button"
                        onClick={() => {
                          setData((prev) =>
                            prev.map((item) =>
                              item.id === r.id ? { ...item, trangThai: "DA_HOAN_THANH" as const } : item,
                            ),
                          );
                          toast.success(`Đã xếp ${r.hoTen} vào đoàn đi Trung tâm điều dưỡng Vũng Tàu!`);
                        }}
                        className="rounded-[2px] bg-[#00c0ef] hover:bg-[#00a7d0] px-2.5 py-1 text-xs font-bold text-white shadow-2xs cursor-pointer"
                      >
                        Xếp đoàn
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-700 font-medium">Hoàn tất</span>
                    )}
                  </td>'''

new_td = '''                  <td className="px-3 py-2.5 text-center">
                    <div className="inline-flex items-center gap-1.5 justify-center">
                      {r.trangThai === "CHUA_THUC_HIEN" && r.hinhThuc === "TAI_NHA" ? (
                        <button
                          type="button"
                          onClick={() => handlePhatTienTaiNha(r.id)}
                          className="rounded-[2px] bg-[#00a65a] hover:bg-[#008d4c] px-2 py-1 text-xs font-bold text-white shadow-2xs cursor-pointer"
                        >
                          Cấp tiền
                        </button>
                      ) : r.trangThai === "CHUA_THUC_HIEN" && r.hinhThuc === "TAP_TRUNG" ? (
                        <button
                          type="button"
                          onClick={() => {
                            setData((prev) =>
                              prev.map((item) =>
                                item.id === r.id ? { ...item, trangThai: "DA_HOAN_THANH" as const } : item,
                              ),
                            );
                            toast.success(`Đã xếp ${r.hoTen} vào đoàn đi Trung tâm điều dưỡng Vũng Tàu!`);
                          }}
                          className="rounded-[2px] bg-[#00c0ef] hover:bg-[#00a7d0] px-2 py-1 text-xs font-bold text-white shadow-2xs cursor-pointer"
                        >
                          Xếp đoàn
                        </button>
                      ) : (
                        <span className="text-xs text-emerald-700 font-medium">Hoàn tất</span>
                      )}
                      <button
                        type="button"
                        onClick={() => setSelectedRecordForModal(r)}
                        title={r.hinhThuc === "TAP_TRUNG" ? "Xem & In Giấy báo điều dưỡng tập trung" : "Xem & In Phiếu cấp kinh phí điều dưỡng tại nhà"}
                        className="rounded-[2px] bg-white hover:bg-gray-100 text-gray-700 px-2 py-1 text-xs font-semibold border border-gray-300 shadow-2xs cursor-pointer inline-flex items-center gap-1"
                      >
                        <Printer className="size-3 text-gray-600" />
                        <span>{r.hinhThuc === "TAP_TRUNG" ? "Giấy báo" : "Phiếu chi"}</span>
                      </button>
                    </div>
                  </td>'''

content = content.replace(old_td, new_td, 1)

# 3. Legal rates
content = content.replace('3.699.000 đồng/người/lần', '5.020.200 đồng/người/lần (Nghị định 77/2024/NĐ-CP, áp dụng từ 01/07/2024)')
content = content.replace('1.849.500 đồng/người/lần', '2.510.100 đồng/người/lần (Nghị định 77/2024/NĐ-CP, áp dụng từ 01/07/2024)')
content = content.replace('3.699.000 đồng/đối tượng', '5.020.200 đồng/đối tượng (Nghị định 77/2024/NĐ-CP)')

# 4. Modal mount
old_modal = '{/* Modal Lập đoàn điều dưỡng tập trung */}'
new_modal = '''{/* Modal In & Xuất Biểu mẫu Phiếu Cấp Kinh Phí / Giấy Báo Điều Dưỡng */}
      <PhieuDieuDuongModal
        isOpen={Boolean(selectedRecordForModal)}
        onClose={() => setSelectedRecordForModal(null)}
        record={selectedRecordForModal}
      />

      {/* Modal Lập đoàn điều dưỡng tập trung */}'''
content = content.replace(old_modal, new_modal, 1)

with open('src/routes/dieu-duong.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("dieu-duong.tsx updated successfully!")

