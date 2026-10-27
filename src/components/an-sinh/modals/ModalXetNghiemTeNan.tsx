import { useState } from "react";
import { X, ShieldAlert, Check, RefreshCw } from "lucide-react";
import { type HoSoPhongChongTeNan } from "@/data/domain-mock";

interface ModalXetNghiemTeNanProps {
  item: HoSoPhongChongTeNan | null;
  onClose: () => void;
  onSubmit: (id: string, ketQua: "AM_TINH" | "DUONG_TINH", hoTroMoi: string) => void;
}

export function ModalXetNghiemTeNan({
  item,
  onClose,
  onSubmit,
}: ModalXetNghiemTeNanProps) {
  if (!item) return null;

  const [ketQua, setKetQua] = useState<"AM_TINH" | "DUONG_TINH">(
    item.ketQuaXetNghiemDinhKy === "DUONG_TINH" ? "DUONG_TINH" : "AM_TINH"
  );
  const [hoTroMoi, setHoTroMoi] = useState(item.hoTroViecLam);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(item.id, ketQua, hoTroMoi);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-4 py-3 bg-purple-700 text-white">
          <div className="flex items-center gap-2 font-bold text-sm">
            <RefreshCw className="size-4" />
            <span>Cập Nhật Kết Quả Xét Nghiệm & Hỗ Trợ Hoàn Lương (NĐ 116/2021)</span>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs">
          <div className="bg-purple-50 border border-purple-200 rounded p-3 text-purple-900 space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-bold text-sm">{item.hoTen}</span>
              <span className="font-mono text-xs">{item.maHoSo}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-700">
              <span>CCCD: <strong className="font-mono">{item.cccd}</strong></span>
              <span>Khu phố: <strong>{item.khuPho}</strong></span>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Kết quả xét nghiệm chất ma túy định kỳ (Công an phường thực hiện) <span className="text-red-500">*</span>
            </label>
            <select
              value={ketQua}
              onChange={(e) => setKetQua(e.target.value as "AM_TINH" | "DUONG_TINH")}
              className="w-full px-2.5 py-1.5 border border-gray-300 rounded bg-white font-bold"
            >
              <option value="AM_TINH">✅ Âm tính (Tuân thủ tốt, không tái nghiện)</option>
              <option value="DUONG_TINH">⚠️ Dương tính (Cảnh báo tái nghiện - Lập hồ sơ xử lý)</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Biện pháp hỗ trợ việc làm, vay vốn và hòa nhập cộng đồng
            </label>
            <textarea
              rows={3}
              value={hoTroMoi}
              onChange={(e) => setHoTroMoi(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-gray-300 rounded focus:border-[#3c8dbc]"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 font-semibold"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded font-bold shadow-xs flex items-center gap-1.5"
            >
              <Check className="size-3.5" />
              Lưu Kết Quả Vào Hồ Sơ Quản Lý
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
