import { useState } from "react";
import { X, Gavel, ShieldAlert, Heart, Calendar, Clock } from "lucide-react";
import { type HoSoBaoLucGiaDinhItem } from "@/data/domain-mock";

interface ModalQuyetDinhCamTiepXucProps {
  hoSo: HoSoBaoLucGiaDinhItem | null;
  onClose: () => void;
  onBanHanh: (id: string, thoiHanNgay: number) => void;
}

export function ModalQuyetDinhCamTiepXuc({
  hoSo,
  onClose,
  onBanHanh,
}: ModalQuyetDinhCamTiepXucProps) {
  const [thoiHanNgay, setThoiHanNgay] = useState(3);

  if (!hoSo) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onBanHanh(hoSo.id, thoiHanNgay);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 bg-gradient-to-r from-rose-700 to-red-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gavel className="w-5 h-5 text-amber-300" />
            <h3 className="text-base font-bold">Ban hành Quyết định Cấm tiếp xúc khẩn cấp</h3>
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
          <div className="bg-rose-50/70 dark:bg-rose-950/40 p-3 rounded-xl border border-rose-200 dark:border-rose-900 leading-relaxed text-rose-900 dark:text-rose-200">
            <strong>Căn cứ Điều 25 Luật Phòng, chống bạo lực gia đình năm 2022:</strong> Chủ tịch UBND cấp xã nơi xảy ra vụ việc có thẩm quyền ban hành quyết định cấm người có hành vi bạo lực gia đình tiếp xúc với người bị bạo lực gia đình trong thời hạn <strong>không quá 03 ngày</strong> để bảo vệ khẩn cấp tính mạng, sức khỏe của nạn nhân.
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl space-y-1.5 border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between">
              <span className="text-slate-500">Mã vụ việc:</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                {hoSo.maVuViec}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Người được bảo vệ (Nạn nhân):</span>
              <span className="font-semibold text-rose-600 dark:text-rose-400">
                {hoSo.nanNhan.hoTen} ({hoSo.nanNhan.cccd})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Người bị cấm tiếp xúc:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {hoSo.nguoiGayBaoLuc.hoTen} ({hoSo.nguoiGayBaoLuc.cccd})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Địa chỉ cư trú:</span>
              <span className="text-slate-700 dark:text-slate-300">{hoSo.diaChiVuViec}</span>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Thời hạn áp dụng biện pháp cấm tiếp xúc:
            </label>
            <select
              value={thoiHanNgay}
              onChange={(e) => setThoiHanNgay(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-rose-500 cursor-pointer font-bold text-rose-600 dark:text-rose-400"
            >
              <option value={1}>01 ngày (24 giờ) kể từ khi ban hành</option>
              <option value={2}>02 ngày (48 giờ) kể từ khi ban hành</option>
              <option value={3}>03 ngày (72 giờ - Mức tối đa của Chủ tịch UBND)</option>
            </select>
          </div>

          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-xl space-y-1 text-[11px] text-amber-900 dark:text-amber-300">
            <div className="font-semibold">Nghĩa vụ và trách nhiệm thực thi:</div>
            <div>• Người bị áp dụng không được đến gần người bị bạo lực gia đình trong phạm vi 100m.</div>
            <div>• Công an phường có trách nhiệm tống đạt quyết định và tổ chức giám sát thực hiện.</div>
            <div>• Trường hợp vi phạm sẽ bị áp dụng biện pháp tạm giữ người theo thủ tục hành chính.</div>
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
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Gavel className="w-4 h-4" />
              <span>Chủ tịch UBND Ký Quyết định</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
