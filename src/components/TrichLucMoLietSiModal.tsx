import { useState } from "react";
import {
  X,
  Printer,
  Compass,
  MapPin,
  QrCode,
  Flame,
  Download,
  Building,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import { type MoLietSiItem } from "@/data/mock";
import { DigitalSignatureBadge } from "@/components/DigitalSignatureBadge";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  moItem: MoLietSiItem | null;
}

export function TrichLucMoLietSiModal({ isOpen, onClose, moItem }: Props) {
  if (!isOpen || !moItem) return null;

  const now = new Date();
  const namHienTai = now.getFullYear();
  const soTrichLuc = `TLMLS-BQL/${namHienTai}/${moItem.id.replace(/\D/g, "").slice(-3) || "028"}`;

  const handlePrint = () => {
    window.print();
  };

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
    `https://binhduong.gov.vn/mo-liet-si/${moItem.id}?khu=${moItem.khu}&hang=${moItem.hang}&soMo=${moItem.soMo}&gps=11.1394,106.6025`,
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-md shadow-2xl max-w-3xl w-full border border-gray-300 overflow-hidden my-4 text-[#222]">
        {/* HEADER ĐIỀU KHIỂN (Ẩn khi in) */}
        <div className="no-print bg-[#0073b7] text-white px-5 py-3 flex flex-wrap items-center justify-between gap-2 border-b border-blue-900">
          <div className="flex items-center gap-2">
            <Compass className="size-5" />
            <div>
              <div className="font-bold text-sm uppercase">
                Trích Lục Thông Tin Mộ Liệt Sĩ &amp; Bản Đồ Vị Trí Viếng Mộ (GIS)
              </div>
              <div className="text-[11px] text-blue-100">
                Sở Lao động - Thương binh và Xã hội tỉnh Bình Dương · Ban Quản lý Nghĩa trang Liệt sĩ
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white text-blue-900 hover:bg-blue-50 text-xs font-bold shadow-xs cursor-pointer"
            >
              <Printer className="size-3.5" />
              <span>In Giấy Trích Lục (A4)</span>
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

        {/* NỘI DUNG VĂN BẢN TRÍCH LỤC A4 */}
        <div className="p-8 sm:p-12 font-serif text-[13px] leading-relaxed text-[#111] bg-white print:p-6">
          {/* QUỐC HUY / TIÊU NGỮ */}
          <div className="grid grid-cols-2 gap-4 border-b pb-4 mb-6 font-sans">
            <div className="text-center">
              <div className="font-bold text-[12px] uppercase">ỦY BAN NHÂN DÂN TỈNH BÌNH DƯƠNG</div>
              <div className="font-bold text-[11px] text-[#0073b7] uppercase">SỞ LAO ĐỘNG - THƯƠNG BINH VÀ XÃ HỘI</div>
              <div className="font-bold text-[10px] text-gray-700 uppercase">BAN QUẢN LÝ NGHĨA TRANG LIỆT SĨ</div>
              <div className="text-[11px] text-gray-600 mt-1 font-mono">
                Số: {soTrichLuc}
              </div>
            </div>

            <div className="text-center">
              <div className="font-bold text-[12px] uppercase">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
              <div className="font-bold text-[12px] underline">Độc lập - Tự do - Hạnh phúc</div>
              <div className="text-[11px] italic text-gray-600 mt-1">
                Bình Dương, ngày {now.getDate()} tháng {now.getMonth() + 1} năm {namHienTai}
              </div>
            </div>
          </div>

          {/* TIÊU ĐỀ */}
          <div className="text-center my-4 font-sans">
            <h2 className="text-base font-bold uppercase tracking-wide">
              GIẤY TRÍCH LỤC THÔNG TIN MỘ LIỆT SĨ
            </h2>
            <div className="font-bold text-xs uppercase text-emerald-900 mt-0.5">
              Phục vụ thân nhân thăm viếng, dâng hương &amp; thực hiện chế độ chính sách
            </div>
          </div>

          {/* NỘI DUNG CHI TIẾT */}
          <div className="space-y-4">
            <p className="indent-6 text-justify">
              Căn cứ hồ sơ quản lý nghĩa trang và cơ sở dữ liệu số hóa mộ liệt sĩ tỉnh Bình Dương, Ban Quản lý Nghĩa trang Liệt sĩ tỉnh Bình Dương trích lục thông tin phần mộ liệt sĩ như sau:
            </p>

            {/* BẢNG THÔNG TIN LIỆT SĨ */}
            <div className="border border-gray-300 rounded overflow-hidden font-sans text-xs">
              <div className="bg-gray-100 px-3 py-2 font-bold uppercase text-gray-800 border-b border-gray-300 flex items-center justify-between">
                <span>I. THÔNG TIN LIỆT SĨ:</span>
                <span className="font-mono text-[11px] text-blue-700">Mã mộ: {moItem.id}</span>
              </div>
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs leading-relaxed">
                <div>
                  <span className="text-gray-500">Họ và tên Liệt sĩ:</span>
                  <div className="font-bold text-gray-900 text-sm uppercase">{moItem.hoTen}</div>
                </div>
                <div>
                  <span className="text-gray-500">Năm sinh / Năm hy sinh:</span>
                  <div className="font-bold text-gray-900 font-mono">
                    {moItem.namSinh || "1932"} — Hy sinh: {moItem.namHySinh || "1968"}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Nguyên quán:</span>
                  <div className="font-semibold text-gray-800">{moItem.queQuan || "Bình Dương"}</div>
                </div>
                <div>
                  <span className="text-gray-500">Đơn vị khi hy sinh:</span>
                  <div className="font-semibold text-gray-800">
                    {moItem.donVi || "Tiểu đoàn 1 - Trung đoàn 4 - Sư đoàn 5"}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Cấp bậc / Chức vụ:</span>
                  <div className="font-semibold text-gray-800">{moItem.chucVu || "Trung đội phó"}</div>
                </div>
                <div>
                  <span className="text-gray-500">Tình trạng phần mộ:</span>
                  <div className="font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="size-3.5" />
                    <span>{moItem.tinhTrangMo}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* BẢNG VỊ TRÍ PHẦN MỘ & MÃ QR */}
            <div className="border border-gray-300 rounded overflow-hidden font-sans text-xs">
              <div className="bg-gray-100 px-3 py-2 font-bold uppercase text-gray-800 border-b border-gray-300 flex items-center justify-between">
                <span>II. VỊ TRÍ AN TÁNG TẠI NGHĨA TRANG:</span>
                <span className="text-red-700 font-bold">Tọa độ GPS Vệ tinh</span>
              </div>

              <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-2 flex-1">
                  <p>
                    - Nghĩa trang an táng: <strong>{moItem.tenNghiaTrang || "Nghĩa trang Liệt sĩ tỉnh Bình Dương"}</strong>
                  </p>
                  <p className="text-gray-600 text-[11px]">
                    Địa chỉ: Quốc lộ 13, xã An Điền, thị xã Bến Cát, tỉnh Bình Dương.
                  </p>
                  
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded grid grid-cols-3 gap-2 text-center my-2">
                    <div className="p-1.5 bg-white rounded border border-blue-100">
                      <div className="text-[10px] text-gray-500 uppercase font-bold">Phân khu</div>
                      <div className="text-base font-black text-blue-900 font-mono">{moItem.khu}</div>
                    </div>
                    <div className="p-1.5 bg-white rounded border border-blue-100">
                      <div className="text-[10px] text-gray-500 uppercase font-bold">Hàng mộ</div>
                      <div className="text-base font-black text-blue-900 font-mono">Hàng {moItem.hang}</div>
                    </div>
                    <div className="p-1.5 bg-white rounded border border-blue-100">
                      <div className="text-[10px] text-gray-500 uppercase font-bold">Số mộ</div>
                      <div className="text-base font-black text-red-700 font-mono">Số {moItem.soMo}</div>
                    </div>
                  </div>

                  <p className="text-[11px] text-gray-600 italic">
                    * Thân nhân khi đến viếng mộ có thể xuất trình Giấy trích lục này cho Ban Quản lý Nghĩa trang để được đón tiếp và hỗ trợ hương hoa chu đáo.
                  </p>
                </div>

                {/* KHỐI QR CODE DẪN ĐƯỜNG */}
                <div className="flex flex-col items-center justify-center p-3 bg-gray-50 border border-gray-300 rounded text-center shrink-0">
                  <img
                    src={qrUrl}
                    alt="QR Dẫn đường đến mộ"
                    className="size-28 border border-gray-200 rounded p-1 bg-white"
                  />
                  <div className="text-[10px] font-bold text-gray-700 uppercase mt-1.5">
                    Quét QR Dẫn đường
                  </div>
                  <div className="text-[9px] text-gray-500 font-mono">
                    GPS: 11.1394°N, 106.6025°E
                  </div>
                </div>
              </div>
            </div>

            <p className="indent-6 text-justify">
              Giấy trích lục này được cấp cho thân nhân liệt sĩ làm căn cứ thực hiện chế độ thăm viếng mộ liệt sĩ theo quy định hiện hành của Nhà nước./.
            </p>
          </div>

          {/* CHỮ KÝ PHÁP LÝ */}
          <div className="grid grid-cols-2 gap-4 mt-8 pt-4 font-sans">
            <div className="text-left text-xs">
              <div className="font-bold">Nơi nhận:</div>
              <div className="text-[11px] text-gray-600 mt-1 space-y-0.5">
                <div>- Thân nhân Liệt sĩ;</div>
                <div>- Phòng LĐ-TB&amp;XH các địa phương;</div>
                <div>- Ban Quản lý Nghĩa trang Liệt sĩ;</div>
                <div>- Lưu: Hồ sơ quản lý mộ.</div>
              </div>
            </div>

            <div className="text-center">
              <div className="font-bold uppercase text-xs">KT. GIÁM ĐỐC SỞ</div>
              <div className="font-bold text-xs uppercase text-[#0073b7]">TRƯỞNG BAN QUẢN LÝ NGHĨA TRANG LIỆT SĨ</div>
              <div className="my-2">
                <DigitalSignatureBadge
                  nguoiKy="Ban Quản lý Nghĩa trang Liệt sĩ tỉnh Bình Dương"
                  chucVu="Sở Lao động - Thương binh và Xã hội tỉnh Bình Dương"
                />
              </div>
              <div className="font-bold text-xs">Nguyễn Thanh Tuấn</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

