import { useState } from "react";
import { X, Flame, DollarSign, Wheat, Check } from "lucide-react";
import { type HoSoCuuTroDotXuat } from "@/data/domain-mock";

interface ModalTiepNhanCuuTroProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<HoSoCuuTroDotXuat>) => void;
}

export function ModalTiepNhanCuuTro({
  isOpen,
  onClose,
  onSubmit,
}: ModalTiepNhanCuuTroProps) {
  const [hoTenChuHo, setHoTenChuHo] = useState("");
  const [cccd, setCccd] = useState("");
  const [khuPho, setKhuPho] = useState("Khu phố 1");
  const [diaChi, setDiaChi] = useState("");
  const [loaiSuCo, setLoaiSuCo] = useState<HoSoCuuTroDotXuat["loaiSuCo"]>("HOA_HOAN_CHAY_NHA");
  const [moTaThietHai, setMoTaThietHai] = useState("");
  const [soTienHoTroVND, setSoTienHoTroVND] = useState(15_000_000);
  const [soKgGao, setSoKgGao] = useState(45);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hoTenChuHo.trim() || !cccd.trim()) return;

    onSubmit({
      hoTenChuHo: hoTenChuHo.trim(),
      cccd: cccd.trim(),
      khuPho,
      diaChi: diaChi || `${khuPho}, Phường Thủ Dầu Một`,
      loaiSuCo,
      moTaThietHai: moTaThietHai || "Sự cố đột xuất cần hỗ trợ khẩn cấp",
      soTienHoTroVND: Number(soTienHoTroVND),
      soKgGao: Number(soKgGao),
      hinhThucCuuTro: Number(soKgGao) > 0 ? "TIEN_MAT_VA_GAO" : "TIEN_MAT",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-4 py-3 bg-orange-600 text-white">
          <div className="flex items-center gap-2 font-bold text-sm">
            <Flame className="size-4" />
            <span>Tiếp Nhận & Cấp Phát Cứu Trợ Đột Xuất (Điều 12, 13 Nghị định 20/2021)</span>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Họ và tên chủ hộ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="VD: Lê Văn Hùng"
                value={hoTenChuHo}
                onChange={(e) => setHoTenChuHo(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded focus:border-[#3c8dbc]"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Số CCCD (12 số) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={12}
                placeholder="VD: 074068001234"
                value={cccd}
                onChange={(e) => setCccd(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Khu phố xảy ra sự cố</label>
              <select
                value={khuPho}
                onChange={(e) => setKhuPho(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded bg-white"
              >
                <option value="Khu phố 1">Khu phố 1</option>
                <option value="Khu phố 2">Khu phố 2</option>
                <option value="Khu phố 3">Khu phố 3</option>
                <option value="Khu phố 4">Khu phố 4</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Loại sự cố rủi ro</label>
              <select
                value={loaiSuCo}
                onChange={(e) => setLoaiSuCo(e.target.value as HoSoCuuTroDotXuat["loaiSuCo"])}
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded bg-white font-semibold"
              >
                <option value="HOA_HOAN_CHAY_NHA">Hỏa hoạn cháy nhà</option>
                <option value="THIEN_TAI_GIONG_LOC">Thiên tai, giông lốc</option>
                <option value="TAI_NAN_NGHIEM_TRONG">Tai nạn giao thông nghiêm trọng</option>
                <option value="BENH_HIEM_NGHEO">Bệnh hiểm nghèo đột xuất</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Địa chỉ xảy ra sự cố</label>
            <input
              type="text"
              placeholder="VD: Hẻm 72 đường Trần Hưng Đạo"
              value={diaChi}
              onChange={(e) => setDiaChi(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-gray-300 rounded focus:border-[#3c8dbc]"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Mô tả hiện trạng và thiệt hại</label>
            <textarea
              rows={2}
              placeholder="Mô tả tóm tắt nguyên nhân và thiệt hại tài sản..."
              value={moTaThietHai}
              onChange={(e) => setMoTaThietHai(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-gray-300 rounded focus:border-[#3c8dbc]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 bg-orange-50 p-3 rounded border border-orange-200">
            <div>
              <label className="block text-orange-950 font-bold mb-1">Tiền mặt cứu trợ (VNĐ)</label>
              <input
                type="number"
                step={1_000_000}
                value={soTienHoTroVND}
                onChange={(e) => setSoTienHoTroVND(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 border border-orange-300 rounded font-mono font-bold text-orange-900 bg-white"
              />
            </div>
            <div>
              <label className="block text-orange-950 font-bold mb-1">Gạo cứu đói khẩn cấp (Kg)</label>
              <input
                type="number"
                step={15}
                value={soKgGao}
                onChange={(e) => setSoKgGao(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 border border-orange-300 rounded font-mono font-bold text-orange-900 bg-white"
              />
            </div>
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
              className="px-4 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded font-bold shadow-xs flex items-center gap-1.5"
            >
              <Check className="size-3.5" />
              Ký Duyệt & Cấp Phát Ngay
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
