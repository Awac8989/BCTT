import { useState } from "react";
import {
  X,
  QrCode,
  Volume2,
  VolumeX,
  FileSpreadsheet,
  Landmark,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { type DiTichLeHoiItem } from "@/data/domain-mock";
import { formatVND } from "@/data/mock";

interface ModalChiTietDiTichQrProps {
  item: DiTichLeHoiItem | null;
  onClose: () => void;
}

export function ModalChiTietDiTichQr({
  item,
  onClose,
}: ModalChiTietDiTichQrProps) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 bg-gradient-to-r from-red-600 to-amber-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Landmark className="w-5 h-5 text-amber-200" />
            <h3 className="text-base font-bold truncate">{item.tenDiTich}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-white/80 hover:text-white rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs">
          {/* QR Code and Audio Guide Simulator */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center gap-5">
            {/* Visual SVG QR */}
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs text-center flex-shrink-0">
              <div className="w-32 h-32 bg-slate-900 rounded-lg p-2 flex items-center justify-center text-white">
                <QrCode className="w-24 h-24 text-white" />
              </div>
              <div className="text-[10px] text-slate-500 mt-1 font-mono">Quét mã Zalo/Camera</div>
            </div>

            <div className="space-y-2 flex-1 text-left">
              <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                <CheckCircle2 className="w-3 h-3" />
                Mã QR Audio Guide đã kích hoạt
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Thuyết minh Đa ngôn ngữ Tự động
              </h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Du khách quét mã QR để nghe thuyết minh song ngữ (Việt - Anh) về lịch sử khởi dựng, kiến trúc chạm khắc gỗ và các nghi thức lễ hội truyền thống.
              </p>

              <button
                type="button"
                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors cursor-pointer ${
                  isPlayingAudio
                    ? "bg-rose-600 text-white animate-pulse"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {isPlayingAudio ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span>Dừng phát Audio Thuyết minh</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    <span>Nghe thử Audio Guide (Giọng đọc AI)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Minh bạch tiền công đức Thông tư 04/2023 */}
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 p-4 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-amber-600" />
                Sao kê Quản lý Tiền công đức (Thông tư 04/2023/TT-BTC)
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                Minh bạch 100%
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <span className="text-amber-700 dark:text-amber-400">Tổng thu hòm công đức:</span>
                <div className="font-bold text-sm text-amber-950 dark:text-amber-200">
                  {formatVND(item.quanLyTienCongDuc.tongThuNam2025)}
                </div>
              </div>
              <div>
                <span className="text-amber-700 dark:text-amber-400">Tài khoản Kho bạc Nhà nước:</span>
                <div className="font-mono font-semibold text-amber-950 dark:text-amber-200">
                  {item.quanLyTienCongDuc.soTaiKhoanKhoBac}
                </div>
              </div>
            </div>
            <div className="text-[11px] text-amber-800 dark:text-amber-300 pt-1 border-t border-amber-200/60 dark:border-amber-800">
              Quy trình mở hòm công đức có sự giám sát của Tổ kiểm đếm gồm: Ban Quản lý Di tích, đại diện Công chức VH-XH phường và Ủy ban MTTQ Việt Nam phường.
            </div>
          </div>

          {/* Ban Quản lý & Liên hệ */}
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-slate-600 dark:text-slate-300">
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200">Đại diện BQL:</span>{" "}
              {item.nguoiDaiDien}
            </div>
            <div className="font-mono font-medium">{item.sdt}</div>
          </div>
        </div>

        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
