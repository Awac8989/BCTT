import { useState } from "react";
import { X, Users, DollarSign, Check, Building, CreditCard } from "lucide-react";
import { type DoiTuongBaoTroXaHoi } from "@/data/domain-mock";
import { formatVND } from "@/data/mock";

interface ModalThemBaoTroProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<DoiTuongBaoTroXaHoi>) => void;
}

export function ModalThemBaoTro({ isOpen, onClose, onSubmit }: ModalThemBaoTroProps) {
  const [hoTen, setHoTen] = useState("");
  const [cccd, setCccd] = useState("");
  const [ngaySinh, setNgaySinh] = useState("1946-01-01");
  const [gioiTinh, setGioiTinh] = useState<"Nam" | "Nữ">("Nữ");
  const [khuPho, setKhuPho] = useState("Khu phố 1");
  const [diaChi, setDiaChi] = useState("");
  const [loaiDoiTuong, setLoaiDoiTuong] = useState<DoiTuongBaoTroXaHoi["loaiDoiTuong"]>("NGUOI_CAO_TUOI_80");
  const [hinhThucNhan, setHinhThucNhan] = useState<"NGAN_HANG" | "BUU_DIEN">("NGAN_HANG");
  const [thongTinChiTra, setThongTinChiTra] = useState("Vietcombank - Đề án 06");

  if (!isOpen) return null;

  const heSoMap: Record<
    DoiTuongBaoTroXaHoi["loaiDoiTuong"],
    { heSo: number; tien: number; ten: string }
  > = {
    NGUOI_CAO_TUOI_80: {
      heSo: 1.0,
      tien: 540_000,
      ten: "Người cao tuổi đủ 80 tuổi không có lương hưu (NĐ 20/2021)",
    },
    KHUYET_TAT_DAC_BIET_NANG: {
      heSo: 2.5,
      tien: 1_350_000,
      ten: "Người khuyết tật đặc biệt nặng dạng vận động (Có người chăm sóc)",
    },
    KHUYET_TAT_NANG: {
      heSo: 2.0,
      tien: 1_080_000,
      ten: "Người khuyết tật nặng (HĐ Giám định cấp phường)",
    },
    TRE_MO_COI: {
      heSo: 2.5,
      tien: 1_350_000,
      ten: "Trẻ em mồ côi cả cha lẫn mẹ sống cùng người giám hộ",
    },
    DON_THAN_NUOI_CON_NGHEO: {
      heSo: 2.0,
      tien: 1_080_000,
      ten: "Người đơn thân nuôi con nhỏ thuộc diện hộ nghèo",
    },
  };

  const currentConfig = heSoMap[loaiDoiTuong];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hoTen.trim() || !cccd.trim()) return;

    onSubmit({
      hoTen: hoTen.trim(),
      cccd: cccd.trim(),
      ngaySinh,
      gioiTinh,
      khuPho,
      diaChi: diaChi || `${khuPho}, Phường Thủ Dầu Một`,
      loaiDoiTuong,
      tenLoaiDoiTuong: currentConfig.ten,
      heSoHuong: currentConfig.heSo,
      mucTroCapHangThang: currentConfig.tien,
      hinhThucNhan,
      thongTinChiTra,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-4 py-3 bg-[#dd4b39] text-white">
          <div className="flex items-center gap-2 font-bold text-sm">
            <Users className="size-4" />
            <span>Tiếp Nhận Đối Tượng Bảo Trợ Xã Hội (Nghị định 20/2021/NĐ-CP)</span>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Họ và tên đối tượng <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="VD: Cụ ông Nguyễn Văn Hòa"
                value={hoTen}
                onChange={(e) => setHoTen(e.target.value)}
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
                placeholder="VD: 074046003322"
                value={cccd}
                onChange={(e) => setCccd(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded font-mono focus:border-[#3c8dbc]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Ngày tháng năm sinh</label>
              <input
                type="date"
                value={ngaySinh}
                onChange={(e) => setNgaySinh(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Giới tính</label>
              <select
                value={gioiTinh}
                onChange={(e) => setGioiTinh(e.target.value as "Nam" | "Nữ")}
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded bg-white"
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Khu phố cư trú</label>
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
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Địa chỉ chi tiết</label>
            <input
              type="text"
              placeholder="VD: 105 đường Cách Mạng Tháng Tám"
              value={diaChi}
              onChange={(e) => setDiaChi(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-gray-300 rounded focus:border-[#3c8dbc]"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Diện đối tượng hưởng trợ cấp</label>
            <select
              value={loaiDoiTuong}
              onChange={(e) => setLoaiDoiTuong(e.target.value as DoiTuongBaoTroXaHoi["loaiDoiTuong"])}
              className="w-full px-2.5 py-1.5 border border-gray-300 rounded bg-white font-medium text-gray-800"
            >
              <option value="NGUOI_CAO_TUOI_80">Người cao tuổi đủ 80 tuổi không có lương hưu (Hệ số 1.0 - 540.000đ)</option>
              <option value="KHUYET_TAT_DAC_BIET_NANG">Người khuyết tật đặc biệt nặng (Hệ số 2.5 - 1.350.000đ)</option>
              <option value="KHUYET_TAT_NANG">Người khuyết tật nặng (Hệ số 2.0 - 1.080.000đ)</option>
              <option value="TRE_MO_COI">Trẻ em mồ côi cả cha lẫn mẹ (Hệ số 2.5 - 1.350.000đ)</option>
              <option value="DON_THAN_NUOI_CON_NGHEO">Người đơn thân nuôi con nhỏ thuộc hộ nghèo (Hệ số 2.0 - 1.080.000đ)</option>
            </select>
          </div>

          {/* Hộp tính toán số tiền */}
          <div className="bg-amber-50 border border-amber-200 rounded p-3 flex justify-between items-center">
            <div>
              <div className="font-bold text-amber-900">{currentConfig.ten}</div>
              <div className="text-[11px] text-amber-700">Mức chuẩn trợ giúp xã hội: 540.000đ x Hệ số {currentConfig.heSo}</div>
            </div>
            <div className="text-right">
              <div className="text-base font-black text-[#dd4b39] font-mono">
                {formatVND(currentConfig.tien)}
              </div>
              <div className="text-[10px] text-gray-500">Trợ cấp hàng tháng</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Hình thức nhận trợ cấp</label>
              <select
                value={hinhThucNhan}
                onChange={(e) => setHinhThucNhan(e.target.value as "NGAN_HANG" | "BUU_DIEN")}
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded bg-white"
              >
                <option value="NGAN_HANG">Tài khoản ngân hàng an sinh (Đề án 06)</option>
                <option value="BUU_DIEN">Chi trả tiền mặt tại Bưu cục phường</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Thông tin chi trả chi tiết</label>
              <input
                type="text"
                placeholder="VD: Vietcombank - 0121000889922"
                value={thongTinChiTra}
                onChange={(e) => setThongTinChiTra(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 font-semibold"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#dd4b39] hover:bg-[#c23321] text-white rounded font-bold shadow-xs flex items-center gap-1.5"
            >
              <Check className="size-3.5" />
              Tiếp Nhận & Ban Hành Quyết Định
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
