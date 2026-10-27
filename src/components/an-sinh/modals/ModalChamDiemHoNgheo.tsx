import { useState } from "react";
import { X, FileCheck2, Check, AlertTriangle, Layers, DollarSign } from "lucide-react";
import { type HoGheoCanGheoItem } from "@/data/domain-mock";
import { formatVND } from "@/data/mock";

interface ModalChamDiemHoNgheoProps {
  item: HoGheoCanGheoItem | null;
  onClose: () => void;
  onSubmit: (
    id: string,
    phanLoai: HoGheoCanGheoItem["phanLoai"],
    chieuThieuHut: string[],
    soTienVayCSXHVND?: number
  ) => void;
}

export function ModalChamDiemHoNgheo({
  item,
  onClose,
  onSubmit,
}: ModalChamDiemHoNgheoProps) {
  if (!item) return null;

  const [phanLoai, setPhanLoai] = useState<HoGheoCanGheoItem["phanLoai"]>(item.phanLoai);
  const [selectedChieu, setSelectedChieu] = useState<string[]>([...item.chieuThieuHut]);
  const [soTienVay, setSoTienVay] = useState(item.soTienVayCSXHVND);

  const ALL_CHIEU = [
    "Việc làm & Thu nhập bấp bênh",
    "Bảo hiểm y tế & Khám chữa bệnh",
    "Trình độ giáo dục & Trẻ em đến trường",
    "Chất lượng nhà ở & Diện tích bình quân",
    "Nước sinh hoạt sạch & Nhà tiêu hợp vệ sinh",
    "Dịch vụ viễn thông & Phương tiện thông tin",
  ];

  const handleToggleChieu = (ch: string) => {
    if (selectedChieu.includes(ch)) {
      setSelectedChieu(selectedChieu.filter((c) => c !== ch));
    } else {
      setSelectedChieu([...selectedChieu, ch]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(item.id, phanLoai, selectedChieu, Number(soTienVay));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-4 py-3 bg-emerald-700 text-white">
          <div className="flex items-center gap-2 font-bold text-sm">
            <FileCheck2 className="size-4" />
            <span>Chấm Điểm Rà Soát Hộ Nghèo Đa Chiều (Phiếu B1, B2 - Quyết định 24/2021)</span>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs">
          {/* Thông tin hộ gia đình */}
          <div className="bg-emerald-50 border border-emerald-200 rounded p-3 text-emerald-900 space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-bold text-sm">{item.hoTenChuHo}</span>
              <span className="font-mono text-xs font-bold text-emerald-800">{item.maHo}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-700">
              <span>Số CCCD: <strong className="font-mono">{item.cccdChuHo}</strong></span>
              <span>Khu phố: <strong>{item.khuPho}</strong> ({item.soNhanKhau} khẩu)</span>
            </div>
          </div>

          {/* 6 chiều thiếu hụt dịch vụ xã hội cơ bản */}
          <div>
            <label className="block text-gray-800 font-bold mb-1.5 flex items-center justify-between">
              <span>Đánh giá 06 chiều thiếu hụt dịch vụ xã hội cơ bản (Phiếu B2):</span>
              <span className="text-[11px] font-normal text-emerald-700">
                Đã chọn: <strong>{selectedChieu.length}/6</strong> chiều
              </span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-gray-50 p-2.5 rounded border border-gray-200">
              {ALL_CHIEU.map((ch, idx) => {
                const checked = selectedChieu.includes(ch);
                return (
                  <label
                    key={idx}
                    className={`flex items-start gap-2 p-2 rounded cursor-pointer border text-xs transition-colors ${
                      checked
                        ? "bg-rose-50 border-rose-300 text-rose-900 font-semibold"
                        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleToggleChieu(ch)}
                      className="mt-0.5 rounded text-rose-600 focus:ring-rose-500"
                    />
                    <span>{ch}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Phân loại chuẩn nghèo */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Kết luận phân loại hộ gia đình <span className="text-red-500">*</span>
              </label>
              <select
                value={phanLoai}
                onChange={(e) => setPhanLoai(e.target.value as HoGheoCanGheoItem["phanLoai"])}
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded bg-white font-bold text-gray-800"
              >
                <option value="HO_NGHEO">Hộ nghèo đa chiều (Thiếu &ge; 3 chỉ số)</option>
                <option value="HO_CAN_NGHEO">Hộ cận nghèo (Thiếu 1 - 2 chỉ số)</option>
                <option value="MUC_SONG_TRUNG_BINH">Đạt mức sống trung bình (Thoát nghèo)</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Dư nợ vốn vay ưu đãi NHCSXH (VNĐ)
              </label>
              <input
                type="number"
                step={5_000_000}
                value={soTienVay}
                onChange={(e) => setSoTienVay(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded font-mono font-bold text-emerald-700"
              />
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded p-2.5 text-[11px] text-gray-600">
            <strong>Căn cứ:</strong> Quyết định số 24/2021/QĐ-TTg ngày 16/7/2021 của Thủ tướng Chính phủ.
            Kết quả này sẽ được đưa ra biểu quyết tại Hội nghị họp dân Khu phố và niêm yết công khai 15 ngày tại Nhà sinh hoạt văn hóa trước khi Chủ tịch UBND Phường ra quyết định công nhận.
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
              className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-bold shadow-xs flex items-center gap-1.5"
            >
              <Check className="size-3.5" />
              Lưu Kết Quả & Xuất Biên Bản Rà Soát
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
