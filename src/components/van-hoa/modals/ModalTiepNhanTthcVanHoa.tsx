import { useState } from "react";
import { X, FileCheck, User, Phone, MapPin, Calendar } from "lucide-react";

interface ModalTiepNhanTthcVanHoaProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    tenThuTuc: string;
    maThuTuc: string;
    nguoiNop: string;
    sdt: string;
    cccd: string;
    diaChi: string;
    khuPho: string;
    ngayHenTra: string;
    ketQuaVanBan: string;
  }) => void;
}

const DANH_MUC_THU_TUC = [
  {
    ten: "Đăng ký thành lập Câu lạc bộ văn hóa, thể dục thể thao cơ sở",
    ma: "TTHC-VHTT-UBND/01",
    thoiHan: "07 ngày làm việc",
    ketQua: "Quyết định công nhận Ban Chủ nhiệm CLB Thể thao cơ sở",
  },
  {
    ten: "Thông báo tổ chức hoạt động biểu diễn nghệ thuật quần chúng",
    ma: "TTHC-VHTT-UBND/02",
    thoiHan: "05 ngày làm việc",
    ketQua: "Giấy xác nhận thông báo biểu diễn văn nghệ quần chúng",
  },
  {
    ten: "Đăng ký sinh hoạt tôn giáo tập trung (Điểm nhóm sinh hoạt)",
    ma: "TTHC-TG-UBND/01",
    thoiHan: "10 ngày làm việc",
    ketQua: "Văn bản chấp thuận địa điểm đăng ký sinh hoạt tôn giáo tập trung",
  },
  {
    ten: "Thông báo nội dung biển hiệu, bảng quảng cáo tại trụ sở kinh doanh",
    ma: "TTHC-QC-UBND/01",
    thoiHan: "05 ngày làm việc",
    ketQua: "Văn bản tiếp nhận thông báo nội dung quảng cáo",
  },
  {
    ten: "Xét tặng danh hiệu Gia đình văn hóa tiêu biểu 03 năm liên tục",
    ma: "TTHC-GDVH-UBND/01",
    thoiHan: "10 ngày làm việc",
    ketQua: "Giấy khen và Quyết định công nhận Gia đình văn hóa tiêu biểu",
  },
];

export function ModalTiepNhanTthcVanHoa({
  isOpen,
  onClose,
  onSubmit,
}: ModalTiepNhanTthcVanHoaProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [nguoiNop, setNguoiNop] = useState("");
  const [sdt, setSdt] = useState("");
  const [cccd, setCccd] = useState("");
  const [diaChi, setDiaChi] = useState("");
  const [khuPho, setKhuPho] = useState("Khu phố 1");

  if (!isOpen) return null;

  const currentTt = DANH_MUC_THU_TUC[selectedIdx] || DANH_MUC_THU_TUC[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nguoiNop.trim() || !cccd.trim()) return;

    // Calculate return date (+ 7 business days from today)
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 7);
    const ngayHenTraStr = targetDate.toLocaleDateString("vi-VN");

    onSubmit({
      tenThuTuc: currentTt.ten,
      maThuTuc: currentTt.ma,
      nguoiNop: nguoiNop.trim(),
      sdt: sdt.trim() || "0908.123.456",
      cccd: cccd.trim(),
      diaChi: diaChi.trim() || "Phường Phú Cường",
      khuPho,
      ngayHenTra: `${ngayHenTraStr} (${currentTt.thoiHan})`,
      ketQuaVanBan: currentTt.ketQua,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 bg-blue-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-blue-200" />
            <h3 className="text-base font-bold">Tiếp nhận Hồ sơ TTHC Một cửa Văn hóa</h3>
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
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Chọn Thủ tục hành chính:
            </label>
            <select
              value={selectedIdx}
              onChange={(e) => setSelectedIdx(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer font-medium"
            >
              {DANH_MUC_THU_TUC.map((tt, idx) => (
                <option key={tt.ma} value={idx}>
                  [{tt.ma}] {tt.ten}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-blue-50/60 dark:bg-blue-950/30 p-2.5 rounded-lg border border-blue-100 dark:border-blue-900 text-slate-600 dark:text-slate-300 space-y-1">
            <div>
              <span className="font-semibold text-blue-800 dark:text-blue-300">
                Thời hạn giải quyết:
              </span>{" "}
              {currentTt.thoiHan}
            </div>
            <div>
              <span className="font-semibold text-blue-800 dark:text-blue-300">
                Kết quả trả công dân:
              </span>{" "}
              {currentTt.ketQua}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Người nộp hồ sơ / Đại diện tổ chức: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={nguoiNop}
              onChange={(e) => setNguoiNop(e.target.value)}
              placeholder="Ví dụ: Ông Trần Văn Sang"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Số CCCD người nộp: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={12}
                value={cccd}
                onChange={(e) => setCccd(e.target.value)}
                placeholder="12 số CCCD"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Số điện thoại liên hệ:
              </label>
              <input
                type="tel"
                value={sdt}
                onChange={(e) => setSdt(e.target.value)}
                placeholder="09xx.xxx.xxx"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Khu phố:
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
              Cấp Giấy Tiếp nhận &amp; Hẹn trả
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
