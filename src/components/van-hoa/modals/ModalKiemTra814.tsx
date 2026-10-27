import { useState, useEffect } from "react";
import { X, ShieldAlert, ShieldCheck, Flame, DollarSign } from "lucide-react";
import { type CoSoDichVuVanHoaItem } from "@/data/domain-mock";

interface ModalKiemTra814Props {
  item: CoSoDichVuVanHoaItem | null;
  onClose: () => void;
  onSave: (payload: {
    id: string;
    ketLuan: CoSoDichVuVanHoaItem["ketLuan"];
    mucPhatVND: number;
    noiDungXuLy: string;
    pccc: CoSoDichVuVanHoaItem["tinhTrangPCCC"];
  }) => void;
}

export function ModalKiemTra814({
  item,
  onClose,
  onSave,
}: ModalKiemTra814Props) {
  const [ketLuan, setKetLuan] = useState<CoSoDichVuVanHoaItem["ketLuan"]>("CHUP_HANH_TOT");
  const [mucPhat, setMucPhat] = useState(0);
  const [noiDung, setNoiDung] = useState("");
  const [pccc, setPccc] = useState<CoSoDichVuVanHoaItem["tinhTrangPCCC"]>("DAT_TIEU_CHUAN");

  useEffect(() => {
    if (item) {
      setKetLuan(item.ketLuan);
      setMucPhat(item.mucPhatVND);
      setNoiDung(item.noiDungXuLy);
      setPccc(item.tinhTrangPCCC);
    }
  }, [item]);

  if (!item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: item.id,
      ketLuan,
      mucPhatVND: Number(mucPhat) || 0,
      noiDungXuLy: noiDung.trim() || "Đã kiểm tra chấp hành đúng quy định.",
      pccc,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <h3 className="text-base font-bold">Biên bản Kiểm tra Liên ngành 814/UBND</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">
              {item.tenCoSo}
            </div>
            <div className="text-slate-500 dark:text-slate-400 mt-0.5">
              Địa chỉ: {item.diaChi} • Chủ cơ sở: {item.chuCoSo} ({item.sdt})
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Kết luận của Đoàn kiểm tra liên ngành:
            </label>
            <select
              value={ketLuan}
              onChange={(e) =>
                setKetLuan(e.target.value as CoSoDichVuVanHoaItem["ketLuan"])
              }
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-rose-500 cursor-pointer"
            >
              <option value="CHUP_HANH_TOT">Chấp hành tốt quy định (Đạt chuẩn)</option>
              <option value="NHAC_NHO">Nhắc nhở chấn chỉnh (Không phạt tiền)</option>
              <option value="LAP_BIEN_BAN_XU_PHAT">
                Lập biên bản xử phạt vi phạm hành chính (VPHC)
              </option>
              <option value="TAM_DINH_CHI">Tạm đình chỉ hoạt động kinh doanh</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tình trạng an toàn PCCC:
              </label>
              <select
                value={pccc}
                onChange={(e) =>
                  setPccc(e.target.value as CoSoDichVuVanHoaItem["tinhTrangPCCC"])
                }
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-rose-500 cursor-pointer"
              >
                <option value="DAT_TIEU_CHUAN">Đạt tiêu chuẩn an toàn PCCC</option>
                <option value="CHUA_DAT">Chưa đạt tiêu chuẩn PCCC</option>
                <option value="DANG_KHAC_PHUC">Đang khắc phục theo kiến nghị</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Số tiền phạt VPHC (VND):
              </label>
              <input
                type="number"
                step={500000}
                min={0}
                value={mucPhat}
                onChange={(e) => setMucPhat(Number(e.target.value))}
                placeholder="0"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-rose-500 font-mono font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Nội dung biên bản &amp; Biện pháp khắc phục:
            </label>
            <textarea
              rows={3}
              required
              value={noiDung}
              onChange={(e) => setNoiDung(e.target.value)}
              placeholder="Ghi nhận lỗi vi phạm (nếu có), yêu cầu tháo dỡ biển hiệu hoặc bổ sung bình chữa cháy..."
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-rose-500"
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
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Lưu biên bản kiểm tra 814
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
