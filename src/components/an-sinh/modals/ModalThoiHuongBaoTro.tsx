import { useState } from "react";
import { X, UserX, AlertTriangle, FileSignature } from "lucide-react";
import { type DoiTuongBaoTroXaHoi } from "@/data/domain-mock";

interface ModalThoiHuongBaoTroProps {
  item: DoiTuongBaoTroXaHoi | null;
  onClose: () => void;
  onSubmit: (id: string, lyDo: string, soQuyetDinh: string) => void;
}

export function ModalThoiHuongBaoTro({
  item,
  onClose,
  onSubmit,
}: ModalThoiHuongBaoTroProps) {
  const [lyDo, setLyDo] = useState("Đối tượng từ trần");
  const [ngayBienDong, setNgayBienDong] = useState(new Date().toISOString().split("T")[0]);
  const [soQuyetDinh, setSoQuyetDinh] = useState(
    `QĐ-TH-UBND-${Math.floor(100 + Math.random() * 900)}/2026`
  );

  if (!item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullLyDo = `${lyDo} (ngày ${ngayBienDong})`;
    onSubmit(item.id, fullLyDo, soQuyetDinh);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-4 py-3 bg-rose-700 text-white">
          <div className="flex items-center gap-2 font-bold text-sm">
            <UserX className="size-4" />
            <span>Ban Hành Quyết Định Thôi Hưởng Trợ Cấp Bảo Trợ Xã Hội</span>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs">
          <div className="bg-rose-50 border border-rose-200 rounded p-3 text-rose-900 space-y-1">
            <div className="font-bold text-sm">{item.hoTen}</div>
            <div className="flex justify-between text-xs">
              <span>Số CCCD: <strong className="font-mono">{item.cccd}</strong></span>
              <span>Khu phố: <strong>{item.khuPho}</strong></span>
            </div>
            <div className="text-[11px] text-gray-600">
              Diện: {item.tenLoaiDoiTuong}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Lý do thôi hưởng trợ cấp <span className="text-red-500">*</span>
            </label>
            <select
              value={lyDo}
              onChange={(e) => setLyDo(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-gray-300 rounded bg-white font-medium"
            >
              <option value="Đối tượng từ trần">Đối tượng từ trần (Chuyển làm thủ tục mai táng phí)</option>
              <option value="Chuyển hộ khẩu ra ngoài địa bàn Phường">Chuyển hộ khẩu thường trú ra ngoài địa bàn</option>
              <option value="Không còn thuộc diện hộ nghèo/cận nghèo">Không còn thuộc diện hộ nghèo/cận nghèo</option>
              <option value="Người khuyết tật đã phục hồi khả năng lao động">Đã phục hồi khả năng lao động (HĐ Giám định kết luận)</option>
              <option value="Trẻ mồ côi đã đủ 16 tuổi không đi học">Trẻ mồ côi đã đủ 16 tuổi không tiếp tục học văn hóa/nghề</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Ngày phát sinh biến động</label>
              <input
                type="date"
                value={ngayBienDong}
                onChange={(e) => setNgayBienDong(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded font-mono"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Số Quyết định thôi hưởng</label>
              <input
                type="text"
                value={soQuyetDinh}
                onChange={(e) => setSoQuyetDinh(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded font-mono"
              />
            </div>
          </div>

          <div className="text-gray-500 text-[11px] bg-gray-50 p-2.5 rounded border border-gray-200">
            <strong>Căn cứ pháp lý:</strong> Điều 8 Nghị định số 20/2021/NĐ-CP ngày 15/3/2021 của Chính phủ.
            Sau khi ban hành quyết định, hệ thống sẽ tự động chốt danh sách chi trả tháng tiếp theo và gửi dữ liệu sang Bưu điện / Ngân hàng.
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 font-semibold"
            >
              Đóng
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded font-bold shadow-xs flex items-center gap-1.5"
            >
              <FileSignature className="size-3.5" />
              Ký Ban Hành Quyết Định Thôi Hưởng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
