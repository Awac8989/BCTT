import { useState } from "react";
import { X, Briefcase, Building2, Check, Send } from "lucide-react";
import { type CungCauLaoDongItem } from "@/data/domain-mock";

interface ModalKetNoiViecLamProps {
  item: CungCauLaoDongItem | null;
  onClose: () => void;
  onSubmit: (id: string, doanhNghiepTuyenDung: string, mucLuongKyVong: string) => void;
}

export function ModalKetNoiViecLam({
  item,
  onClose,
  onSubmit,
}: ModalKetNoiViecLamProps) {
  if (!item) return null;

  const [doanhNghiep, setDoanhNghiep] = useState(
    "Công ty CP Chế biến Gỗ Bình Dương (KCN Sóng Thần 1)"
  );
  const [mucLuong, setMucLuong] = useState("9.500.000 - 13.000.000 VNĐ/tháng");
  const [ngayPhongVan, setNgayPhongVan] = useState(
    new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString().split("T")[0]
  );

  const ENTERPRISES = [
    {
      name: "Công ty CP Chế biến Gỗ Bình Dương (KCN Sóng Thần 1)",
      salary: "9.500.000 - 13.000.000 VNĐ/tháng",
      note: "Ưu tiên Bộ đội xuất ngũ, phụ cấp chuyên cần & ăn trưa",
    },
    {
      name: "Công ty TNHH Điện tử Foster Việt Nam (KCN VSIP II)",
      salary: "8.500.000 - 11.500.000 VNĐ/tháng",
      note: "Lắp ráp linh kiện viễn thông, môi trường phòng sạch, xe đưa rước",
    },
    {
      name: "Công ty CP May Thêu Xuất khẩu Tân Uyên (KCN Đại Đăng)",
      salary: "8.000.000 - 11.000.000 VNĐ/tháng",
      note: "Được đào tạo tay nghề may công nghiệp 100% lương",
    },
    {
      name: "Công ty CP Cơ khí Chính xác Bình Dương (KCN Kim Huy)",
      salary: "10.000.000 - 15.000.000 VNĐ/tháng",
      note: "Thợ tiện, phay CNC, hàn cơ khí công nghiệp",
    },
  ];

  const handleSelectEnterprise = (eName: string) => {
    setDoanhNghiep(eName);
    const found = ENTERPRISES.find((e) => e.name === eName);
    if (found) setMucLuong(found.salary);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(item.id, doanhNghiep, mucLuong);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-4 py-3 bg-[#0073b7] text-white">
          <div className="flex items-center gap-2 font-bold text-sm">
            <Briefcase className="size-4" />
            <span>Kết Nối Việc Làm & Phiên Giao Dịch Doanh Nghiệp KCN</span>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs">
          <div className="bg-sky-50 border border-sky-200 rounded p-3 text-sky-900 space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-bold text-sm">{item.hoTen}</span>
              <span className="font-mono text-xs">{item.namSinh}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-700">
              <span>CCCD: <strong className="font-mono">{item.cccd}</strong></span>
              <span>Khu phố: <strong>{item.khuPho}</strong></span>
            </div>
            <div className="text-[11px] text-gray-600">
              Chuyên môn: <strong>{item.chuyenMon}</strong> ({item.trinhDoHocVan})
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Chọn Doanh nghiệp KCN liên kết tiếp nhận <span className="text-red-500">*</span>
            </label>
            <select
              value={doanhNghiep}
              onChange={(e) => handleSelectEnterprise(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-gray-300 rounded bg-white font-semibold text-gray-800"
            >
              {ENTERPRISES.map((ent, idx) => (
                <option key={idx} value={ent.name}>
                  {ent.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Mức thu nhập dự kiến</label>
              <input
                type="text"
                value={mucLuong}
                onChange={(e) => setMucLuong(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded font-mono font-bold text-[#dd4b39]"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Ngày hẹn phỏng vấn</label>
              <input
                type="date"
                value={ngayPhongVan}
                onChange={(e) => setNgayPhongVan(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded font-mono"
              />
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded p-2.5 text-[11px] text-gray-600">
            <strong>Căn cứ:</strong> Thông tư số 01/2022/TT-BLĐTBXH của Bộ LĐTBXH về thu thập, lưu trữ, tổng hợp thông tin thị trường lao động.
            Phiếu giới thiệu việc làm sẽ được gửi trực tiếp qua Zalo/SMS cho người lao động kèm thông tin Phòng Nhân sự doanh nghiệp.
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
              className="px-4 py-1.5 bg-[#0073b7] hover:bg-[#005a92] text-white rounded font-bold shadow-xs flex items-center gap-1.5"
            >
              <Send className="size-3.5" />
              Cấp Giấy Giới Thiệu & Xác Nhận Kết Nối
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
