import { useState } from "react";
import { X, ShieldCheck, KeyRound, CheckCircle2, Lock } from "lucide-react";
import { type HoSoTTHCVanHoaItem } from "@/data/domain-mock";

interface ModalKySoSmartCAProps {
  hoSo: HoSoTTHCVanHoaItem | null;
  onClose: () => void;
  onConfirmKySo: (hoSoId: string, nguoiKy: string, chucVu: string) => void;
}

export function ModalKySoSmartCA({
  hoSo,
  onClose,
  onConfirmKySo,
}: ModalKySoSmartCAProps) {
  const [nguoiKy, setNguoiKy] = useState("Nguyễn Thị Ngọc Giàu");
  const [chucVu, setChucVu] = useState("Phó Chủ tịch UBND Phường");
  const [nhaCungCap, setNhaCungCap] = useState("VNPT-SmartCA");
  const [maPin, setMaPin] = useState("123456");
  const [isSigning, setIsSigning] = useState(false);

  if (!hoSo) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSigning(true);
    setTimeout(() => {
      onConfirmKySo(hoSo.id, nguoiKy, chucVu);
      setIsSigning(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-200" />
            <h3 className="text-base font-bold">Xác thực Ký số Điện tử SmartCA</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-white/80 hover:text-white rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-200 dark:border-emerald-900">
            <div className="font-semibold text-emerald-900 dark:text-emerald-200 text-xs">
              Văn bản ký phê duyệt:
            </div>
            <div className="font-medium text-slate-800 dark:text-slate-200 mt-0.5">
              {hoSo.ketQuaVanBan}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
              <span>Hồ sơ: {hoSo.maHoSo}</span>
              <span>•</span>
              <span>Người nhận: {hoSo.nguoiNop}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Lãnh đạo ký duyệt:
              </label>
              <input
                type="text"
                required
                value={nguoiKy}
                onChange={(e) => setNguoiKy(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Chức vụ:
              </label>
              <input
                type="text"
                required
                value={chucVu}
                onChange={(e) => setChucVu(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Chứng thư số / Nhà cung cấp:
              </label>
              <select
                value={nhaCungCap}
                onChange={(e) => setNhaCungCap(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="VNPT-SmartCA">VNPT SmartCA (Cấp tỉnh)</option>
                <option value="Viettel-CA">Viettel-CA Cloud</option>
                <option value="Ban-Co-Yeu">Ban Cơ yếu Chính phủ</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Mã PIN ký số:
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  maxLength={8}
                  value={maPin}
                  onChange={(e) => setMaPin(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono tracking-widest text-center"
                />
                <KeyRound className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>
              Chữ ký số tuân thủ Nghị định 130/2018/NĐ-CP, tích hợp mã định danh điện tử UBND Phường Phú Cường.
            </span>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSigning}
              className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-800 dark:text-slate-300 rounded-lg cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSigning}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isSigning ? "Đang ký số..." : "Ký số phát hành văn bản"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
