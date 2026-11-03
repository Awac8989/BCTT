import { useState } from "react";
import {
  X,
  Printer,
  Building2,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  Calendar,
  Home,
  UserCheck,
  CreditCard,
  Heart,
  DollarSign,
} from "lucide-react";
import { toast } from "sonner";
import { formatVND, type ChiTraItem } from "@/data/mock";
import { docSoTienBangChu } from "@/services/calculator.service";
import { DigitalSignatureBadge } from "@/components/DigitalSignatureBadge";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  items: ChiTraItem[];
  kyChiTra?: string;
}

export function BangKeBuuDienModal({ isOpen, onClose, items, kyChiTra = "Tháng 10/2026" }: Props) {
  const [activeTab, setActiveTab] = useState<"BANG_KE" | "PHIEU_TAN_NHA">("BANG_KE");

  if (!isOpen) return null;

  const now = new Date();
  const namHienTai = now.getFullYear();
  const soBangKe = `BKBD-VNPOST/${namHienTai}/${kyChiTra.replace(/\D/g, "") || "10"}`;

  // Lọc các bản ghi chi trả tiền mặt qua bưu điện
  const danhSachBuuDien = items.filter((i) => i.hinhThuc === "BUU_DIEN" || i.hinhThuc === "TIEN_MAT");

  const tongTien = danhSachBuuDien.reduce((acc, i) => acc + i.soTien, 0);
  const tongTienChu = docSoTienBangChu(tongTien);

  // Đối tượng đặc biệt phát tận nhà (Mẹ VNAH Lê Thị Mai hoặc thương binh nặng)
  const doiTuongTanNha = danhSachBuuDien.find((d) => d.hoTen.includes("Mai") || d.loaiDoiTuong.includes("Mẹ")) || danhSachBuuDien[0];

  const handlePrint = () => {
    window.print();
  };

  const handleExportCsv = () => {
    const headers = [
      "STT",
      "Mã giao dịch",
      "Số hồ sơ Tỉnh",
      "Họ và tên người nhận",
      "CCCD",
      "Địa chỉ nhận tiền",
      "Diện đối tượng",
      "Nội dung chế độ",
      "Số tiền (VNĐ)",
      "Bưu tá phụ trách",
      "Hình thức phát",
    ];

    const rows = danhSachBuuDien.map((d, i) => [
      i + 1,
      `"${d.maGiaoDich}"`,
      `"${d.soHoSoTinh}"`,
      `"${d.hoTen}"`,
      `"${d.cccd}"`,
      `"${d.diaChi || "P. Phú Cường, TP. Thủ Dầu Một"}"`,
      `"${d.loaiDoiTuong}"`,
      `"${d.tenCheDo}"`,
      d.soTien,
      `"${d.thongTinChiTra}"`,
      d.hoTen.includes("Mai") ? "Phát tận nhà (Mẹ VNAH)" : "Phát tại Bưu cục",
    ]);

    const csv = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `DANH_SACH_CHI_TRA_TIEN_MAT_VNPOST_${kyChiTra.replace(/\D/g, "")}.csv`;
    a.click();
    toast.success("Đã xuất danh sách chi trả tiền mặt qua Bưu điện VNPost!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-md shadow-2xl max-w-5xl w-full border border-gray-300 overflow-hidden my-4 text-[#222]">
        {/* HEADER ĐIỀU KHIỂN (Ẩn khi in) */}
        <div className="no-print bg-[#00a65a] text-white px-5 py-3 flex flex-wrap items-center justify-between gap-2 border-b border-emerald-800">
          <div className="flex items-center gap-2">
            <Building2 className="size-5" />
            <div>
              <div className="font-bold text-sm uppercase">
                Bảng Kê Chi Trả Trợ Cấp Bưu Điện VNPost &amp; Phiếu Phát Tiền Tận Nhà
              </div>
              <div className="text-[11px] text-emerald-100">
                Ủy ban nhân dân TP. Thủ Dầu Một phối hợp Bưu điện Trung tâm thành phố Thủ Dầu Một
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              <Download className="size-3.5" />
              <span>Xuất CSV cho Bưu điện</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white text-emerald-800 hover:bg-emerald-50 text-xs font-bold shadow-xs cursor-pointer"
            >
              <Printer className="size-3.5" />
              <span>In Văn Bản (A4)</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded p-1 text-white hover:bg-white/20"
              title="Đóng cửa sổ"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* THANH CHUYỂN ĐỔI BIỂU MẪU (Ẩn khi in) */}
        <div className="no-print bg-emerald-50/70 border-b border-emerald-200 px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("BANG_KE")}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                activeTab === "BANG_KE"
                  ? "bg-[#00a65a] text-white shadow-xs"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
              }`}
            >
              1. Bảng kê phát tiền Bưu cục (Mẫu C70a-VNPost)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("PHIEU_TAN_NHA")}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                activeTab === "PHIEU_TAN_NHA"
                  ? "bg-[#00a65a] text-white shadow-xs"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
              }`}
            >
              2. Phiếu phát tiền tận nhà (Mẹ VNAH / TB nặng)
            </button>
          </div>

          <div className="text-emerald-900 font-semibold">
            Tổng chi trả tiền mặt: <strong className="font-mono text-sm text-red-700">{formatVND(tongTien)}</strong> ({danhSachBuuDien.length} đối tượng)
          </div>
        </div>

        {/* NỘI DUNG VĂN BẢN (A4) */}
        <div className="p-8 sm:p-12 font-sans text-xs leading-relaxed text-[#111] bg-white print:p-6">
          {/* TAB 1: BẢNG KÊ PHÁT TIỀN TẠI BƯU CỤC */}
          {activeTab === "BANG_KE" && (
            <div>
              {/* QUỐC HUY / TIÊU NGỮ */}
              <div className="flex justify-between items-start border-b pb-3 mb-4">
                <div>
                  <div className="font-bold text-[11px] uppercase">TỔNG CÔNG TY BƯU ĐIỆN VIỆT NAM</div>
                  <div className="font-bold text-[11px] text-emerald-800 uppercase">BƯU ĐIỆN TỈNH BÌNH DƯƠNG</div>
                  <div className="text-[10px] text-gray-500">Bưu điện TP. Thủ Dầu Một</div>
                  <div className="text-[10px] text-gray-500 font-mono mt-0.5">Số: {soBangKe}</div>
                </div>

                <div className="text-center">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                    BẢNG KÊ CHI TRẢ TIỀN MẶT TRỢ CẤP NGƯỜI CÓ CÔNG
                  </h2>
                  <div className="font-bold text-xs text-emerald-800 mt-0.5">
                    Kỳ chi trả: {kyChiTra}
                  </div>
                  <div className="text-[10px] italic text-gray-500">
                    (Phối hợp thực hiện chi trả chế độ an sinh xã hội tại cơ sở)
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-[11px] uppercase">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                  <div className="font-bold text-[11px] underline">Độc lập - Tự do - Hạnh phúc</div>
                  <div className="text-[10px] italic text-gray-500 mt-1">
                    Thủ Dầu Một, ngày {now.toLocaleDateString("vi-VN")}
                  </div>
                </div>
              </div>

              {/* BẢNG CHI TRẢ BƯU ĐIỆN */}
              <div className="border border-gray-300 rounded overflow-hidden mt-4">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead className="bg-gray-100 font-bold border-b border-gray-300 text-gray-800 uppercase">
                    <tr>
                      <th className="p-2 text-center w-8">STT</th>
                      <th className="p-2">Mã GD / Hồ sơ</th>
                      <th className="p-2">Họ và tên người nhận</th>
                      <th className="p-2">CCCD</th>
                      <th className="p-2">Diện đối tượng</th>
                      <th className="p-2">Nội dung chế độ</th>
                      <th className="p-2 text-right">Số tiền (VNĐ)</th>
                      <th className="p-2">Điểm chi / Bưu tá</th>
                      <th className="p-2 text-center">Ký nhận tiền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {danhSachBuuDien.map((d, idx) => (
                      <tr key={d.id} className="hover:bg-gray-50">
                        <td className="p-2 text-center font-mono font-bold text-gray-500">{idx + 1}</td>
                        <td className="p-2 font-mono text-gray-700">{d.soHoSoTinh}</td>
                        <td className="p-2 font-bold text-gray-900">{d.hoTen}</td>
                        <td className="p-2 font-mono text-gray-600">{d.cccd}</td>
                        <td className="p-2 text-emerald-800 font-medium">{d.loaiDoiTuong}</td>
                        <td className="p-2 text-gray-800">{d.tenCheDo}</td>
                        <td className="p-2 text-right font-mono font-bold text-red-700">{formatVND(d.soTien)}</td>
                        <td className="p-2 text-gray-600 text-[10px]">{d.thongTinChiTra}</td>
                        <td className="p-2 text-center">
                          <span className="text-[10px] italic text-gray-500">Ký và ghi họ tên</span>
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-emerald-50/70 font-bold text-xs border-t-2 border-gray-400">
                      <td className="p-2 text-center" colSpan={6}>
                        TỔNG CỘNG TIỀN MẶT GIAO BƯU ĐIỆN PHÁT:
                      </td>
                      <td className="p-2 text-right font-mono text-sm text-red-700">
                        {formatVND(tongTien)}
                      </td>
                      <td className="p-2" colSpan={2}>
                        <span className="text-emerald-800">100% người nhận tại địa bàn</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-3 text-xs italic text-gray-700">
                (Số tiền bằng chữ: <strong>{tongTienChu}</strong>).
              </div>

              {/* CHỮ KÝ PHÁP LÝ 3 BÊN */}
              <div className="grid grid-cols-3 gap-4 mt-8 pt-4 text-center text-xs">
                <div>
                  <div className="font-bold uppercase">BƯU TÁ CHI TRẢ</div>
                  <div className="text-[10px] italic text-gray-500">(Ký và ghi rõ họ tên)</div>
                  <div className="h-16 flex items-end justify-center font-bold text-gray-800">
                    Nguyễn Văn Thành
                  </div>
                </div>

                <div>
                  <div className="font-bold uppercase text-emerald-800">GIÁM ĐỐC BƯU ĐIỆN TP</div>
                  <div className="text-[10px] italic text-gray-500">(Ký số &amp; đóng dấu)</div>
                  <div className="my-1">
                    <DigitalSignatureBadge
                      nguoiKy="Bưu điện thành phố Thủ Dầu Một"
                      chucVu="Bưu điện tỉnh Bình Dương"
                    />
                  </div>
                  <div className="font-bold text-gray-900">Trần Đình Trọng</div>
                </div>

                <div>
                  <div className="font-bold uppercase text-gray-800">TRƯỞNG PHÒNG LĐ-TB&amp;XH</div>
                  <div className="text-[10px] italic text-gray-500">(Xác nhận kinh phí)</div>
                  <div className="my-1">
                    <DigitalSignatureBadge
                      nguoiKy="Phòng LĐ-TB&XH thành phố Thủ Dầu Một"
                      chucVu="Ủy ban nhân dân thành phố Thủ Dầu Một"
                    />
                  </div>
                  <div className="font-bold text-gray-900">Phạm Văn Cường</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PHIẾU PHÁT TIỀN TẬN NHÀ CHO MẸ VNAH & THƯƠNG BINH NẶNG */}
          {activeTab === "PHIEU_TAN_NHA" && doiTuongTanNha && (
            <div className="font-serif leading-relaxed text-[13px]">
              <div className="grid grid-cols-2 gap-4 border-b pb-4 mb-5 font-sans">
                <div className="text-center">
                  <div className="font-bold text-[11px] uppercase">TỔNG CÔNG TY BƯU ĐIỆN VIỆT NAM</div>
                  <div className="font-bold text-[11px] text-emerald-800 uppercase">BƯU ĐIỆN TP. THỦ DẦU MỘT</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">Số phiếu: PTN-2026/{doiTuongTanNha.id}</div>
                </div>

                <div className="text-center">
                  <div className="font-bold text-[11px] uppercase">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                  <div className="font-bold text-[11px] underline">Độc lập - Tự do - Hạnh phúc</div>
                  <div className="text-[10px] italic text-gray-500 mt-1">
                    Ngày {now.getDate()} tháng {now.getMonth() + 1} năm {namHienTai}
                  </div>
                </div>
              </div>

              <div className="text-center my-4 font-sans">
                <h2 className="text-base font-bold uppercase tracking-wide">
                  PHIẾU GIAO NHẬN TIỀN TRỢ CẤP TẬN NHÀ
                </h2>
                <div className="font-bold text-xs uppercase text-emerald-800 mt-0.5">
                  Dành cho Mẹ Việt Nam Anh hùng &amp; Người có công cao tuổi già yếu
                </div>
              </div>

              <div className="space-y-3 font-sans text-xs">
                <div className="p-4 bg-gray-50 border border-gray-200 rounded space-y-2">
                  <p>1. Họ và tên người nhận: <strong className="text-sm uppercase text-gray-900">{doiTuongTanNha.hoTen}</strong></p>
                  <p>2. Thuộc diện chính sách: <strong>{doiTuongTanNha.loaiDoiTuong}</strong> · Số hồ sơ: <strong className="font-mono">{doiTuongTanNha.soHoSoTinh}</strong></p>
                  <p>3. Số CCCD: <strong className="font-mono">{doiTuongTanNha.cccd}</strong></p>
                  <p>4. Địa chỉ cư trú: {doiTuongTanNha.diaChi || "Phường Phú Cường, thành phố Thủ Dầu Một, tỉnh Bình Dương"}</p>
                  <p>5. Nội dung trợ cấp chi trả: <strong>{doiTuongTanNha.tenCheDo} ({kyChiTra})</strong></p>
                  <p className="text-sm font-bold text-red-700">
                    ➔ SỐ TIỀN THỰC PHÁT: {formatVND(doiTuongTanNha.soTien)}
                  </p>
                  <p className="italic text-gray-600">
                    (Số tiền bằng chữ: <strong>{docSoTienBangChu(doiTuongTanNha.soTien)}</strong>).
                  </p>
                </div>

                <p className="italic text-gray-600">
                  * Bưu tá đã đến tận nhà riêng để thăm hỏi, trao quà và phát tận tay toàn bộ số tiền trợ cấp ưu đãi theo đúng chính sách của Đảng và Nhà nước.
                </p>
              </div>

              {/* CHỮ KÝ XÁC NHẬN */}
              <div className="grid grid-cols-2 gap-8 mt-8 pt-4 font-sans text-center text-xs">
                <div>
                  <div className="font-bold uppercase">NGƯỜI NHẬN TIỀN / THÂN NHÂN</div>
                  <div className="text-[10px] italic text-gray-500">(Ký, điểm chỉ và ghi rõ họ tên)</div>
                  <div className="h-16 flex items-end justify-center font-bold text-gray-800">
                    {doiTuongTanNha.hoTen}
                  </div>
                </div>

                <div>
                  <div className="font-bold uppercase text-emerald-800">BƯU TÁ PHÁT TIỀN TẬN NHÀ</div>
                  <div className="text-[10px] italic text-gray-500">(Ký và xác nhận đã phát đủ)</div>
                  <div className="h-16 flex items-end justify-center font-bold text-gray-800">
                    Nguyễn Văn Thành (Bưu điện TP)
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

