import { useState, useEffect } from "react";
import { X, Award, CheckCircle2, AlertTriangle, Sparkles } from "lucide-react";
import { type GiaDinhVanHoaItem } from "@/data/domain-mock";
import { calculateTongDiem, evaluateGiaDinhVanHoa } from "../utils";

interface ModalBinhXetGiaDinhProps {
  item: GiaDinhVanHoaItem | null;
  onClose: () => void;
  onSave: (payload: {
    id: string;
    diemGuongMau: number;
    diemKinhTe: number;
    diemHoaThuan: number;
    deNghiKhenThuong: boolean;
    ghiChu?: string;
  }) => void;
}

export function ModalBinhXetGiaDinh({
  item,
  onClose,
  onSave,
}: ModalBinhXetGiaDinhProps) {
  const [diemGuongMau, setDiemGuongMau] = useState(30);
  const [diemKinhTe, setDiemKinhTe] = useState(30);
  const [diemHoaThuan, setDiemHoaThuan] = useState(40);
  const [deNghiKhenThuong, setDeNghiKhenThuong] = useState(false);
  const [ghiChu, setGhiChu] = useState("");

  useEffect(() => {
    if (item) {
      setDiemGuongMau(item.diemGuongMau);
      setDiemKinhTe(item.diemKinhTe);
      setDiemHoaThuan(item.diemHoaThuan);
      setDeNghiKhenThuong(item.deNghiKhenThuong);
      setGhiChu(item.ghiChu || "");
    }
  }, [item]);

  if (!item) return null;

  const tongDiem = calculateTongDiem({
    diemGuongMau,
    diemKinhTe,
    diemHoaThuan,
  });

  const evaluation = evaluateGiaDinhVanHoa(tongDiem);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: item.id,
      diemGuongMau,
      diemKinhTe,
      diemHoaThuan,
      deNghiKhenThuong,
      ghiChu,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Bình xét Chấm điểm Gia đình Văn hóa (NĐ 86/2023)
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-blue-50/70 dark:bg-blue-950/40 p-3 rounded-xl border border-blue-100 dark:border-blue-900 text-xs">
            <div className="font-semibold text-slate-800 dark:text-slate-200">
              Hộ gia đình: {item.chuHo} (Mã: {item.maHo})
            </div>
            <div className="text-slate-600 dark:text-slate-400 mt-0.5">
              Địa chỉ: {item.diaChi} • {item.khuPho} ({item.soThanhVien} thành viên)
            </div>
          </div>

          {/* 3 tiêu chí NĐ 86/2023 */}
          <div className="space-y-3">
            {/* Tiêu chí 1 */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  1. Gương mẫu chấp hành chủ trương, pháp luật (Tối đa 30đ):
                </span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{diemGuongMau}/30</span>
              </div>
              <input
                type="range"
                min={0}
                max={30}
                value={diemGuongMau}
                onChange={(e) => setDiemGuongMau(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            {/* Tiêu chí 2 */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  2. Phát triển kinh tế, đời sống ấm no, tiến bộ (Tối đa 30đ):
                </span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{diemKinhTe}/30</span>
              </div>
              <input
                type="range"
                min={0}
                max={30}
                value={diemKinhTe}
                onChange={(e) => setDiemKinhTe(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            {/* Tiêu chí 3 */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  3. Xây dựng gia đình hạnh phúc, hòa thuận, văn minh (Tối đa 40đ):
                </span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{diemHoaThuan}/40</span>
              </div>
              <input
                type="range"
                min={0}
                max={40}
                value={diemHoaThuan}
                onChange={(e) => setDiemHoaThuan(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Tổng kết & Xếp loại */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Tổng điểm đánh giá:</div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {tongDiem} <span className="text-xs font-normal text-slate-400">/ 100 điểm</span>
              </div>
            </div>
            <div className="text-right">
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${
                  evaluation.ketQua === "DAT_CHUAN"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300"
                    : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300"
                }`}
              >
                {evaluation.ketQua === "DAT_CHUAN" ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5" />
                )}
                {evaluation.xepLoai}
              </span>
            </div>
          </div>

          {/* Đề nghị khen thưởng */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="khenThuong"
              checked={deNghiKhenThuong}
              onChange={(e) => setDeNghiKhenThuong(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded cursor-pointer"
            />
            <label
              htmlFor="khenThuong"
              className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Đề nghị Chủ tịch UBND Phường khen thưởng Gia đình văn hóa tiêu biểu
            </label>
          </div>

          {/* Ghi chú */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Nhận xét của Ban công tác Mặt trận &amp; Tổ dân phố:
            </label>
            <textarea
              rows={2}
              value={ghiChu}
              onChange={(e) => setGhiChu(e.target.value)}
              placeholder="Ghi chú ý kiến đánh giá cộng đồng dân cư..."
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 dark:text-slate-300 rounded-lg cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Lưu kết quả bình xét
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
