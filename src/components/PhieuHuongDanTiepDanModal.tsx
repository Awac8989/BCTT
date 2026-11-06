import { useState } from "react";
import {
  X,
  Printer,
  FileText,
  UserCheck,
  Building,
  CheckCircle2,
  Calendar,
  Clock,
  ShieldCheck,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { DigitalSignatureBadge } from "@/components/DigitalSignatureBadge";
import { type TiepCongDanItem } from "@/data/domain-mock";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  item: TiepCongDanItem | null;
}

export function PhieuHuongDanTiepDanModal({ isOpen, onClose, item }: Props) {
  if (!isOpen || !item) return null;

  const now = new Date();
  const namHienTai = now.getFullYear();
  const soPhieu = `PTCD-UBND/${namHienTai}/${item.id.replace(/\D/g, "").slice(-3) || "015"}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-md shadow-2xl max-w-3xl w-full border border-gray-300 overflow-hidden my-4 text-[#222]">
        {/* HEADER ĐIỀU KHIỂN (Ẩn khi in) */}
        <div className="no-print bg-[#0073b7] text-white px-5 py-3 flex flex-wrap items-center justify-between gap-2 border-b border-blue-900">
          <div className="flex items-center gap-2">
            <UserCheck className="size-5" />
            <div>
              <div className="font-bold text-sm uppercase">
                Phiếu Tiếp Nhận &amp; Xử Lý Phản Ánh, Kiến Nghị Của Công Dân
              </div>
              <div className="text-[11px] text-blue-100">
                Luật Tiếp công dân số 42/2013/QH13 &amp; Thông tư 04/2021/TT-TTCP của Thanh tra Chính phủ
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
              <span>In Phiếu (A4)</span>
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

        {/* NỘI DUNG VĂN BẢN (A4) */}
        <div className="p-8 sm:p-12 font-serif text-[13px] leading-relaxed text-[#111] bg-white print:p-6">
          {/* QUỐC HUY / TIÊU NGỮ */}
          <div className="grid grid-cols-2 gap-4 border-b pb-4 mb-6 font-sans">
            <div className="text-center">
              <div className="font-bold text-[12px] uppercase">ỦY BAN NHÂN DÂN PHƯỜNG PHÚ CƯỜNG</div>
              <div className="font-bold text-[11px] text-[#0073b7] uppercase">BỘ PHẬN TIẾP CÔNG DÂN</div>
              <div className="text-[11px] text-gray-600 mt-1 font-mono">
                Số: {soPhieu}
              </div>
            </div>

            <div className="text-center">
              <div className="font-bold text-[12px] uppercase">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
              <div className="font-bold text-[12px] underline">Độc lập - Tự do - Hạnh phúc</div>
              <div className="text-[11px] italic text-gray-600 mt-1">
                Thủ Dầu Một, ngày {now.getDate()} tháng {now.getMonth() + 1} năm {namHienTai}
              </div>
            </div>
          </div>

          {/* TIÊU ĐỀ */}
          <div className="text-center my-4 font-sans">
            <h2 className="text-base font-bold uppercase tracking-wide">
              PHIẾU HƯỚNG DẪN &amp; XỬ LÝ ĐƠN THƯ CỦA CÔNG DÂN
            </h2>
            <div className="font-bold text-xs uppercase text-[#0073b7] mt-0.5">
              Tại buổi Tiếp công dân định kỳ của Lãnh đạo Ủy ban nhân dân Phường
            </div>
          </div>

          <div className="space-y-4">
            <p className="indent-6 text-justify">
              Hồi 08 giờ 30 phút, ngày {item.ngayTiep || now.toLocaleDateString("vi-VN")}, tại Phòng Tiếp công dân UBND Phường Thủ Dầu Một; Lãnh đạo UBND phường đã trực tiếp tiếp công dân:
            </p>

            <div className="border border-gray-300 rounded p-4 bg-gray-50/50 font-sans text-xs space-y-2">
              <p>1. Họ và tên công dân: <strong className="text-sm uppercase text-gray-900">{item.hoTenCongDan}</strong></p>
              <p>2. Số CCCD: <strong className="font-mono">{item.cccd}</strong> · Số điện thoại: <strong className="font-mono">{item.soDienThoai || "0918.234.567"}</strong></p>
              <p>3. Nơi thường trú: {item.diaChi || "Khu phố 2, Phường Thủ Dầu Một, TP. Thủ Dầu Một, tỉnh Bình Dương"}</p>
              <p>4. Nội dung phản ánh / khiếu nại / đề nghị: <strong>{item.noiDung}</strong></p>
              <p>5. Lĩnh vực quản lý: <span className="font-semibold text-blue-900">{item.linhVuc}</span></p>
            </div>

            <div className="border border-blue-200 rounded p-4 bg-blue-50/50 font-sans text-xs space-y-2">
              <div className="font-bold text-blue-950 uppercase flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-blue-700" />
                <span>Ý KIẾN KẾT LUẬN &amp; CHỈ ĐẠO CỦA LÃNH ĐẠO CHỦ TRÌ TIẾP DÂN:</span>
              </div>
              <p className="text-justify leading-relaxed text-blue-950">
                {item.yKienKetLuan || "Giao Cán bộ chuyên trách Lao động - Thương binh & Xã hội phối hợp Ban điều hành khu phố kiểm tra thực tế hồ sơ, đối chiếu quy định tại Nghị định số 131/2021/NĐ-CP và có văn bản trả lời công dân trước ngày 15 hàng tháng."}
              </p>
              <p className="font-semibold text-emerald-800">
                - Cán bộ thụ lý chịu trách nhiệm: {item.canBoThuLy || "Đoàn Minh Quân (Công chức LĐ-TB&XH)"}.
              </p>
              <p className="font-semibold text-red-700">
                - Thời hạn hoàn thành giải quyết: Trước 17 giờ 00 ngày {item.hanGiaiQuyet || "30/10/2026"}.
              </p>
            </div>

            <p className="indent-6 text-justify">
              Phiếu này được lập thành 02 bản (01 bản giao cho công dân để theo dõi kết quả, 01 bản lưu hồ sơ tiếp công dân và chuyển bộ phận chuyên môn giải quyết theo thẩm quyền)./.
            </p>
          </div>

          {/* CHỮ KÝ 2 BÊN */}
          <div className="grid grid-cols-2 gap-8 mt-8 pt-4 font-sans text-center text-xs">
            <div>
              <div className="font-bold uppercase">CÔNG DÂN ĐẾN PHẢN ÁNH</div>
              <div className="text-[10px] italic text-gray-500">(Ký và ghi rõ họ tên)</div>
              <div className="h-16 flex items-end justify-center font-bold text-gray-800">
                {item.hoTenCongDan}
              </div>
            </div>

            <div>
              <div className="font-bold uppercase text-[#0073b7]">LÃNH ĐẠO CHỦ TRÌ TIẾP DÂN</div>
              <div className="text-[10px] italic text-gray-500">(Ký số &amp; đóng dấu)</div>
              <div className="my-1">
                <DigitalSignatureBadge
                  nguoiKy="Trần Văn Nam"
                  chucVu="Chủ tịch UBND Phường Thủ Dầu Một"
                />
              </div>
              <div className="font-bold text-gray-900">Trần Văn Nam</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
