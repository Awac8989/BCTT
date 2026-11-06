import { useState } from "react";
import { X, FileSignature, ShieldCheck, Check, Sparkles } from "lucide-react";
import { type HoSoTTHCAnSinhItem } from "@/data/domain-mock";

interface ModalKySoSmartCAAnSinhProps {
  item: HoSoTTHCAnSinhItem | null;
  onClose: () => void;
  onSubmit: (id: string, quyetDinhData: NonNullable<HoSoTTHCAnSinhItem["quyetDinhKySo"]>) => void;
}

export function ModalKySoSmartCAAnSinh({
  item,
  onClose,
  onSubmit,
}: ModalKySoSmartCAAnSinhProps) {
  if (!item) return null;

  const [soQuyetDinh, setSoQuyetDinh] = useState(
    `QĐ-UBND-${Math.floor(100 + Math.random() * 900)}/QĐ-UBND`
  );
  const [nguoiKy, setNguoiKy] = useState("Nguyễn Văn Hùng");
  const [chucVu, setChucVu] = useState("Chủ tịch UBND Phường Thủ Dầu Một");
  const [noiDung, setNoiDung] = useState(
    `Về việc giải quyết hồ sơ thủ tục hành chính: ${item.tenThuTuc} cho công dân ${item.doiTuongThuHuong}.`
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sha256 = `SHA256:${Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("")}`;

    onSubmit(item.id, {
      soQuyetDinh,
      ngayKy: new Date().toLocaleDateString("vi-VN"),
      nguoiKy,
      chucVu,
      maXacThucSha256: sha256,
      noiDung,
      daKySo: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-4 py-3 bg-purple-700 text-white">
          <div className="flex items-center gap-2 font-bold text-sm">
            <FileSignature className="size-4" />
            <span>Ký Số SmartCA Điện Tử Phê Duyệt Kết Quả TTHC (Nghị định 30/2020 & NĐ 61/2018)</span>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs">
          <div className="bg-purple-50 border border-purple-200 rounded p-3 text-purple-900 space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-bold text-sm">{item.maHoSo}</span>
              <span className="font-semibold text-purple-800">{item.khuPho}</span>
            </div>
            <div className="font-semibold text-gray-800">{item.tenThuTuc}</div>
            <div className="text-gray-600 text-xs">
              Thụ hưởng: <strong>{item.doiTuongThuHuong}</strong> (CCCD: {item.cccd})
            </div>
            {item.hoiDongThamDinh && (
              <div className="text-[11px] text-emerald-700 font-semibold pt-1 border-t border-purple-200">
                Kết luận Hội đồng thẩm định: {item.hoiDongThamDinh.mucHuongDeXuat} ({item.hoiDongThamDinh.bienBanSo})
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Số Quyết định ban hành</label>
              <input
                type="text"
                required
                value={soQuyetDinh}
                onChange={(e) => setSoQuyetDinh(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded font-mono font-bold text-gray-900"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Người ký phê duyệt</label>
              <input
                type="text"
                value={nguoiKy}
                onChange={(e) => setNguoiKy(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded font-bold text-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Chức vụ người ký</label>
            <input
              type="text"
              value={chucVu}
              onChange={(e) => setChucVu(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-gray-800 font-medium"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Nội dung quyết định phê chuẩn</label>
            <textarea
              rows={3}
              required
              value={noiDung}
              onChange={(e) => setNoiDung(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-gray-300 rounded focus:border-[#3c8dbc]"
            />
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded p-2.5 flex items-center justify-between text-gray-600 text-[11px]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-purple-600" />
              <span>Chứng thư số SmartCA: <strong>VNPT-CA / Bộ Công an</strong></span>
            </div>
            <span className="font-mono text-purple-700 font-bold">SHA-256 Valid</span>
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
              className="px-4 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded font-bold shadow-xs flex items-center gap-1.5"
            >
              <Sparkles className="size-3.5 text-amber-300" />
              Ký Số SmartCA & Ban Hành Kết Quả
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
