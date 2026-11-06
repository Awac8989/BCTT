import { useState } from "react";
import {
  X,
  Printer,
  FileText,
  HeartHandshake,
  CheckCircle2,
  Calendar,
  Building,
  CreditCard,
  Download,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { formatVND } from "@/data/mock";
import { docSoTienBangChu } from "@/services/calculator.service";
import { DigitalSignatureBadge } from "@/components/DigitalSignatureBadge";
import { type DoiTuongBaoTroXaHoi } from "@/data/domain-mock";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  doiTuong: DoiTuongBaoTroXaHoi | null;
}

export function QuyetDinhBaoTroXaHoiModal({ isOpen, onClose, doiTuong }: Props) {
  if (!isOpen || !doiTuong) return null;

  const now = new Date();
  const namHienTai = now.getFullYear();
  const soQuyetDinh = `QĐ-UBND/${namHienTai}/${doiTuong.id.replace(/\D/g, "").slice(-3) || "088"}`;

  // Mức chuẩn trợ giúp xã hội theo Nghị định 76/2024/NĐ-CP (500.000đ/tháng từ 01/07/2024)
  const mucChuanBTXH = 500000;
  const heSo = doiTuong.heSoHuong || ((doiTuong.tenLoaiDoiTuong || "").toLowerCase().includes("đặc biệt nặng") ? 2.0 : 1.5);
  const mucTroCapThang = (doiTuong.mucTroCapHangThang && doiTuong.mucTroCapHangThang > 0) ? doiTuong.mucTroCapHangThang : mucChuanBTXH * heSo;
  const soTienChu = docSoTienBangChu(mucTroCapThang);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-md shadow-2xl max-w-4xl w-full border border-gray-300 overflow-hidden my-4 text-[#222]">
        {/* HEADER ĐIỀU KHIỂN (Ẩn khi in) */}
        <div className="no-print bg-[#0073b7] text-white px-5 py-3 flex flex-wrap items-center justify-between gap-2 border-b border-blue-900">
          <div className="flex items-center gap-2">
            <HeartHandshake className="size-5" />
            <div>
              <div className="font-bold text-sm uppercase">
                Quyết Định Hưởng Trợ Cấp Xã Hội Hàng Tháng (Nghị Định 76/2024/NĐ-CP)
              </div>
              <div className="text-[11px] text-blue-100">
                Mức chuẩn trợ giúp xã hội mới 500.000 đồng/tháng (Áp dụng từ 01/07/2024)
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
              <span>In Quyết Định (A4)</span>
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

        {/* NỘI DUNG VĂN BẢN CHUẨN THỂ THỨC HÀNH CHÍNH (A4) */}
        <div className="p-8 sm:p-12 font-serif text-[13px] leading-relaxed text-[#111] bg-white print:p-6">
          {/* QUỐC HUY / TIÊU NGỮ */}
          <div className="grid grid-cols-2 gap-4 border-b pb-4 mb-6 font-sans">
            <div className="text-center">
              <div className="font-bold text-[12px] uppercase">ỦY BAN NHÂN DÂN TP. THỦ DẦU MỘT</div>
              <div className="font-bold text-[11px] text-[#0073b7] uppercase">PHÒNG LAO ĐỘNG - THƯƠNG BINH VÀ XÃ HỘI</div>
              <div className="text-[11px] text-gray-600 mt-1 font-mono">
                Số: {soQuyetDinh}
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
              QUYẾT ĐỊNH
            </h2>
            <div className="font-bold text-sm uppercase text-gray-900 mt-0.5">
              Về việc trợ cấp xã hội hàng tháng cho đối tượng bảo trợ xã hội
            </div>
            <div className="font-bold text-xs uppercase text-[#0073b7] mt-1">
              CHỦ TỊCH ỦY BAN NHÂN DÂN THÀNH PHỐ THỦ DẦU MỘT
            </div>
          </div>

          {/* CĂN CỨ PHÁP LÝ */}
          <div className="space-y-1.5 text-xs text-justify italic text-gray-800">
            <p className="indent-6">
              Căn cứ Luật Tổ chức chính quyền địa phương ngày 19 tháng 6 năm 2015;
            </p>
            <p className="indent-6">
              Căn cứ Nghị định số 20/2021/NĐ-CP ngày 15 tháng 3 năm 2021 của Chính phủ quy định chính sách trợ giúp xã hội đối với đối tượng bảo trợ xã hội;
            </p>
            <p className="indent-6">
              Căn cứ Nghị định số 76/2024/NĐ-CP ngày 01 tháng 7 năm 2024 của Chính phủ sửa đổi, bổ sung một số điều của Nghị định số 20/2021/NĐ-CP (Quy định mức chuẩn trợ giúp xã hội là 500.000 đồng/tháng);
            </p>
            <p className="indent-6">
              Xét Tờ trình của Ủy ban nhân dân Phường Thủ Dầu Một và đề nghị của Trưởng phòng Lao động - Thương binh và Xã hội thành phố Thủ Dầu Một,
            </p>
          </div>

          <div className="text-center my-4 font-sans font-bold text-sm uppercase">
            QUYẾT ĐỊNH:
          </div>

          <div className="space-y-3">
            <p className="indent-6 text-justify">
              <strong>Điều 1.</strong> Trợ cấp xã hội hàng tháng cho đối tượng bảo trợ xã hội:
            </p>

            <div className="pl-6 space-y-1 font-sans text-xs">
              <p>- Họ và tên đối tượng: <strong className="text-sm uppercase text-gray-900">{doiTuong.hoTen}</strong></p>
              <p>- Sinh ngày: {doiTuong.ngaySinh || "1950"} · Giới tính: {doiTuong.gioiTinh || "Nam"}</p>
              <p>- Số định danh cá nhân / CCCD: <strong className="font-mono">{doiTuong.cccd}</strong></p>
              <p>- Nơi thường trú: {doiTuong.diaChi || "Khu phố 1, Phường Thủ Dầu Một, TP. Thủ Dầu Một, tỉnh Bình Dương"}</p>
              <p>- Thuộc diện đối tượng: <strong>{doiTuong.tenLoaiDoiTuong || "Đối tượng bảo trợ xã hội"}</strong></p>
              <p>- Mức chuẩn áp dụng: <strong>500.000 đồng/tháng</strong> (Hệ số: <strong>{heSo}</strong> theo Nghị định 76/2024/NĐ-CP).</p>
              <p className="font-bold text-red-700 text-sm">
                ➔ MỨC TRỢ CẤP HÀNG THÁNG ĐƯỢC HƯỞNG: {formatVND(mucTroCapThang)} / tháng.
              </p>
              <p className="italic text-gray-700">
                (Số tiền bằng chữ: <strong>{soTienChu}</strong>).
              </p>
              <p>- Thời gian hưởng trợ cấp: Kể từ ngày <strong>01/07/2024</strong>.</p>
              <p>- Hình thức nhận tiền: <strong>Chuyển khoản qua tài khoản An sinh xã hội liên kết VNeID</strong> (hoặc qua Bưu điện nếu già yếu).</p>
            </div>

            <p className="indent-6 text-justify">
              <strong>Điều 2.</strong> Đối tượng được cấp thẻ Bảo hiểm Y tế miễn phí (diện mã BT) và được hưởng các chế độ hỗ trợ khác theo quy định hiện hành của Nhà nước.
            </p>

            <p className="indent-6 text-justify">
              <strong>Điều 3.</strong> Chánh Văn phòng HĐND - UBND thành phố, Trưởng phòng Lao động - TB&amp;XH thành phố, Trưởng phòng Tài chính - Kế hoạch, Chủ tịch UBND Phường Thủ Dầu Một và ông/bà <strong>{doiTuong.hoTen}</strong> chịu trách nhiệm thi hành Quyết định này./.
            </p>
          </div>

          {/* CHỮ KÝ VÀ DẤU ĐỎ ĐIỆN TỬ */}
          <div className="grid grid-cols-2 gap-4 mt-8 pt-4 font-sans">
            <div className="text-left text-xs">
              <div className="font-bold">Nơi nhận:</div>
              <div className="text-[11px] text-gray-600 mt-1 space-y-0.5">
                <div>- Như Điều 3;</div>
                <div>- Kho bạc Nhà nước TP (thanh toán);</div>
                <div>- BHXH thành phố (cấp thẻ BHYT mã BT);</div>
                <div>- Bưu điện TP. Thủ Dầu Một;</div>
                <div>- Lưu: VT, LĐTBXH.</div>
              </div>
            </div>

            <div className="text-center">
              <div className="font-bold uppercase text-xs">TM. ỦY BAN NHÂN DÂN THÀNH PHỐ</div>
              <div className="font-bold text-xs uppercase text-[#0073b7]">CHỦ TỊCH</div>
              <div className="my-2">
                <DigitalSignatureBadge
                  nguoiKy="Ủy ban nhân dân thành phố Thủ Dầu Một"
                  chucVu="Tỉnh Bình Dương"
                />
              </div>
              <div className="font-bold text-xs">Nguyễn Văn Đông</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

