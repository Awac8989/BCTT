import { useState } from "react";
import { X, Award, Plus, UserPlus } from "lucide-react";

interface ModalDangKyGiaDinhProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: {
    chuHo: string;
    cccd: string;
    diaChi: string;
    khuPho: string;
    soThanhVien: number;
    ghiChu?: string;
  }) => void;
}

export function ModalDangKyGiaDinh({
  isOpen,
  onClose,
  onAdd,
}: ModalDangKyGiaDinhProps) {
  const [chuHo, setChuHo] = useState("");
  const [cccd, setCccd] = useState("");
  const [diaChi, setDiaChi] = useState("");
  const [khuPho, setKhuPho] = useState("Khu phố 1");
  const [soThanhVien, setSoThanhVien] = useState(4);
  const [ghiChu, setGhiChu] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chuHo.trim() || !cccd.trim()) return;
    onAdd({
      chuHo: chuHo.trim(),
      cccd: cccd.trim(),
      diaChi: diaChi.trim() || "Phường Thủ Dầu Một",
      khuPho,
      soThanhVien: Number(soThanhVien) || 1,
      ghiChu: ghiChu.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Đăng ký Bình xét Gia đình Văn hóa Mới
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Họ và tên chủ hộ: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={chuHo}
              onChange={(e) => setChuHo(e.target.value)}
              placeholder="Ví dụ: Ông Lê Văn An"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Số CCCD chủ hộ: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={12}
                value={cccd}
                onChange={(e) => setCccd(e.target.value)}
                placeholder="12 chữ số CCCD"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Số nhân khẩu trong hộ:
              </label>
              <input
                type="number"
                min={1}
                max={15}
                value={soThanhVien}
                onChange={(e) => setSoThanhVien(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Khu phố thường trú:
              </label>
              <select
                value={khuPho}
                onChange={(e) => setKhuPho(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="Khu phố 1">Khu phố 1</option>
                <option value="Khu phố 2">Khu phố 2</option>
                <option value="Khu phố 3">Khu phố 3</option>
                <option value="Khu phố 4">Khu phố 4</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Địa chỉ cụ thể:
              </label>
              <input
                type="text"
                value={diaChi}
                onChange={(e) => setDiaChi(e.target.value)}
                placeholder="Số nhà, tên đường..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Ghi chú về hộ gia đình:
            </label>
            <textarea
              rows={2}
              value={ghiChu}
              onChange={(e) => setGhiChu(e.target.value)}
              placeholder="Thông tin tham gia hoạt động đoàn thể, quyên góp..."
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-800 dark:text-slate-300 rounded-lg cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Lưu hồ sơ đăng ký
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
