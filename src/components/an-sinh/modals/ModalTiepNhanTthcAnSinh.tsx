import { useState } from "react";
import { X, FileSignature, Check, QrCode } from "lucide-react";
import { type HoSoTTHCAnSinhItem } from "@/data/domain-mock";

interface ModalTiepNhanTthcAnSinhProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<HoSoTTHCAnSinhItem>) => void;
}

export function ModalTiepNhanTthcAnSinh({
  isOpen,
  onClose,
  onSubmit,
}: ModalTiepNhanTthcAnSinhProps) {
  const [thuTuc, setThuTuc] = useState("TDM-AS-01");
  const [nguoiNop, setNguoiNop] = useState("");
  const [cccd, setCccd] = useState("");
  const [soDienThoai, setSoDienThoai] = useState("");
  const [khuPho, setKhuPho] = useState("Khu phố 1");
  const [diaChi, setDiaChi] = useState("");
  const [doiTuongThuHuong, setDoiTuongThuHuong] = useState("");
  const [hinhThucNop, setHinhThucNop] = useState<"TRUC_TIEP_MOT_CUA" | "DVC_TRUC_TUYEN_QUOC_GIA">("TRUC_TIEP_MOT_CUA");

  if (!isOpen) return null;

  const PROCEDURES = [
    {
      ma: "TDM-AS-01",
      ten: "Hỗ trợ chi phí mai táng cho đối tượng bảo trợ xã hội (Nghị định 20/2021/NĐ-CP)",
      loai: "Mai táng phí BTXH",
      tien: 7_200_000,
      slaDays: 3,
    },
    {
      ma: "TDM-AS-02",
      ten: "Xác định mức độ khuyết tật và cấp Giấy xác nhận mức độ khuyết tật (Thông tư 01/2019/TT-BLĐTBXH)",
      loai: "Người khuyết tật",
      tien: 1_350_000,
      slaDays: 7,
    },
    {
      ma: "TDM-AS-03",
      ten: "Trợ cấp xã hội hàng tháng cho người cao tuổi đủ 80 tuổi không có lương hưu (NĐ 20/2021/NĐ-CP)",
      loai: "Người cao tuổi 80+",
      tien: 540_000,
      slaDays: 5,
    },
    {
      ma: "TDM-AS-04",
      ten: "Công nhận hộ nghèo, hộ cận nghèo phát sinh trong năm (Quyết định 24/2021/QĐ-TTg)",
      loai: "Chuẩn nghèo đa chiều",
      tien: 0,
      slaDays: 10,
    },
  ];

  const currentProc = PROCEDURES.find((p) => p.ma === thuTuc) || PROCEDURES[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nguoiNop.trim() || !cccd.trim()) return;

    const ngayHenTra = new Date(Date.now() + currentProc.slaDays * 24 * 3600 * 1000).toLocaleDateString("vi-VN");

    onSubmit({
      tenThuTuc: currentProc.ten,
      maThuTuc: currentProc.ma,
      nguoiNop: nguoiNop.trim(),
      cccd: cccd.trim(),
      soDienThoai: soDienThoai.trim(),
      khuPho,
      diaChi: diaChi || `${khuPho}, Phường Phú Cường`,
      doiTuongThuHuong: doiTuongThuHuong || nguoiNop,
      loaiDoiTuong: currentProc.loai,
      mucTienHoTroVND: currentProc.tien,
      hinhThucNop,
      ngayHenTra,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-4 py-3 bg-teal-700 text-white">
          <div className="flex items-center gap-2 font-bold text-sm">
            <FileSignature className="size-4" />
            <span>Tiếp Nhận Hồ Sơ Một Cửa Điện Tử (Mẫu số 01 - Nghị định 61/2018/NĐ-CP)</span>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Thủ tục hành chính tiếp nhận <span className="text-red-500">*</span>
            </label>
            <select
              value={thuTuc}
              onChange={(e) => setThuTuc(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-gray-300 rounded bg-white font-semibold text-gray-800"
            >
              {PROCEDURES.map((p) => (
                <option key={p.ma} value={p.ma}>
                  {p.ma} - {p.ten}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Họ và tên người nộp hồ sơ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="VD: Lê Văn Hùng (Thân nhân)"
                value={nguoiNop}
                onChange={(e) => setNguoiNop(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded focus:border-[#3c8dbc]"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Số CCCD người nộp (12 số) <span className="text-red-500">*</span>
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

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Số điện thoại liên hệ</label>
              <input
                type="text"
                placeholder="VD: 0903.112.233"
                value={soDienThoai}
                onChange={(e) => setSoDienThoai(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded font-mono"
              />
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
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Hình thức nộp</label>
              <select
                value={hinhThucNop}
                onChange={(e) => setHinhThucNop(e.target.value as "TRUC_TIEP_MOT_CUA" | "DVC_TRUC_TUYEN_QUOC_GIA")}
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded bg-white"
              >
                <option value="TRUC_TIEP_MOT_CUA">Một cửa trực tiếp</option>
                <option value="DVC_TRUC_TUYEN_QUOC_GIA">Cổng DVC Quốc gia</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Đối tượng thụ hưởng trực tiếp</label>
            <input
              type="text"
              placeholder="VD: Cụ bà Huỳnh Thị Lành (Từ trần ngày 18/10/2026)"
              value={doiTuongThuHuong}
              onChange={(e) => setDoiTuongThuHuong(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-gray-300 rounded focus:border-[#3c8dbc]"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Địa chỉ thường trú</label>
            <input
              type="text"
              placeholder="VD: 14/2 đường Quang Trung, Phường Phú Cường"
              value={diaChi}
              onChange={(e) => setDiaChi(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-gray-300 rounded"
            />
          </div>

          <div className="bg-teal-50 border border-teal-200 rounded p-3 flex justify-between items-center">
            <div>
              <div className="font-bold text-teal-900">{currentProc.ten}</div>
              <div className="text-[11px] text-teal-700">Thời hạn giải quyết: {currentProc.slaDays} ngày làm việc</div>
            </div>
            {currentProc.tien > 0 && (
              <div className="text-right">
                <div className="text-sm font-black text-[#dd4b39] font-mono">
                  {currentProc.tien.toLocaleString("vi-VN")} VNĐ
                </div>
                <div className="text-[10px] text-gray-500">Định mức hưởng</div>
              </div>
            )}
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
              className="px-4 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded font-bold shadow-xs flex items-center gap-1.5"
            >
              <Check className="size-3.5" />
              In Giấy Tiếp Nhận & Hẹn Trả Kết Quả (Mẫu 01)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
