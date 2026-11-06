/**
 * BIỂU MẪU ĐIỀU DƯỠNG PHỤC HỒI SỨC KHỎE NGƯỜI CÓ CÔNG
 * Căn cứ pháp lý:
 * - Điều 84 đến 87 Nghị định số 131/2021/NĐ-CP ngày 30/12/2021 của Chính phủ
 * - Nghị định số 77/2024/NĐ-CP ngày 01/07/2024: Mức chuẩn trợ cấp 2.789.000đ
 * + Điều dưỡng tại nhà: 0.9 × 2.789.000 = 2.510.100 VNĐ
 * + Điều dưỡng tập trung: 1.8 × 2.789.000 = 5.020.200 VNĐ
 */

import {
  X,
  Printer,
  HeartPulse,
  Home,
  Building,
  CheckCircle2,
  Calendar,
  AlertCircle,
  FileCheck2,
  ShieldCheck,
} from "lucide-react";
import { formatVND } from "@/data/mock";
import { docSoTienBangChu } from "@/services/calculator.service";

interface DieuDuongItem {
  id: string;
  soHoSoTinh: string;
  hoTen: string;
  cccd: string;
  loaiDoiTuong: string;
  tyLe: number;
  chuKy: "1_NAM_LAN" | "2_NAM_LAN";
  hinhThuc: "TAP_TRUNG" | "TAI_NHA";
  diaDiemHoacNganHang: string;
  dinhMuc: number;
  namThucHien: number;
  phuong: string;
  huyen: string;
  trangThai: string;
  dotDieuDuong?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  record: DieuDuongItem | null;
}

export function PhieuDieuDuongModal({ isOpen, onClose, record }: Props) {
  if (!isOpen || !record) return null;

  const now = new Date();
  const isTapTrung = record.hinhThuc === "TAP_TRUNG";
  const soVanBan = `GĐ-${now.getFullYear()}/${record.id.replace(/\D/g, "").slice(-3) || "102"}`;
  const soTienChu = docSoTienBangChu(record.dinhMuc);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-md shadow-2xl max-w-4xl w-full border border-gray-300 overflow-hidden my-4 text-[#222]">
        {/* THANH ĐIỀU KHIỂN TRÊN CÙNG */}
        <div className="no-print bg-[#00a65a] text-white px-5 py-3 flex flex-wrap items-center justify-between gap-2 border-b border-emerald-800">
          <div className="flex items-center gap-2">
            <HeartPulse className="size-5 text-amber-200" />
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-100">
                {isTapTrung ? "GIẤY BÁO ĐIỀU DƯỠNG TẬP TRUNG TẠI TRUNG TÂM" : "PHIẾU CẤP KINH PHÍ ĐIỀU DƯỠNG TẠI NHÀ"}
              </div>
              <div className="text-[11px] text-white/90 font-mono">
                Số: <strong>{soVanBan}</strong> · Nghị định 131/2021/NĐ-CP & Nghị định 77/2024/NĐ-CP
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              <Printer className="size-3.5" />
              <span>In Văn Bản (A4)</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Đóng"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* NỘI DUNG VĂN BẢN (A4 PRINT VIEW) */}
        <div className="p-8 sm:p-12 font-serif text-[13px] leading-relaxed text-black bg-white select-text">
          {/* Header Quốc hiệu */}
          <div className="grid grid-cols-2 gap-4 items-start text-center mb-6">
            <div>
              <div className="text-xs uppercase font-bold text-gray-800">
                ỦY BAN NHÂN DÂN TỈNH BÌNH DƯƠNG
              </div>
              <div className="text-xs uppercase font-extrabold text-black">
                SỞ LAO ĐỘNG - THƯƠNG BINH VÀ XÃ HỘI
              </div>
              <div className="text-[11px] text-gray-700 font-mono mt-0.5">
                Số: {soVanBan}/SLĐTBXH-NCC
              </div>
            </div>

            <div>
              <div className="text-xs font-bold uppercase text-black">
                CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
              </div>
              <div className="text-xs font-bold text-black">
                Độc lập - Tự do - Hạnh phúc
              </div>
              <div className="text-[11px] italic text-gray-700 mt-1">
                Bình Dương, ngày {now.getDate()} tháng {now.getMonth() + 1} năm {now.getFullYear()}
              </div>
            </div>
          </div>

          {/* Tiêu đề chính */}
          <div className="text-center my-6 space-y-1">
            <h1 className="text-base sm:text-lg font-extrabold uppercase tracking-wide text-black">
              {isTapTrung
                ? "GIẤY BÁO THAM GIA ĐIỀU DƯỠNG PHỤC HỒI SỨC KHỎE TẬP TRUNG"
                : "PHIẾU CẤP KINH PHÍ ĐIỀU DƯỠNG PHỤC HỒI SỨC KHỎE TẠI NHÀ"}
            </h1>
            <div className="text-xs font-bold text-gray-800">
              Kế hoạch điều dưỡng người có công năm {record.namThucHien}
            </div>
            <div className="text-[11px] italic text-gray-600">
              (Thực hiện theo Điều 84 đến Điều 87 Nghị định số 131/2021/NĐ-CP & Nghị định số 77/2024/NĐ-CP)
            </div>
          </div>

          {/* Thông tin đối tượng thụ hưởng */}
          <div className="border border-gray-300 rounded p-4 my-4 space-y-2 text-xs bg-gray-50/50">
            <div className="grid grid-cols-2 gap-4">
              <div>
                Họ và tên: <strong className="text-sm uppercase text-black">{record.hoTen}</strong>
              </div>
              <div>
                Số định danh (CCCD): <strong className="font-mono">{record.cccd}</strong>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                Diện chính sách: <strong>{record.loaiDoiTuong}</strong>{" "}
                {record.tyLe > 0 && `(Tỷ lệ tổn thương: ${record.tyLe}%)`}
              </div>
              <div>
                Mã hồ sơ quản lý: <strong className="font-mono">{record.soHoSoTinh}</strong>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                Địa chỉ thường trú: <strong>{record.phuong}, {record.huyen}, tỉnh Bình Dương</strong>
              </div>
              <div>
                Chu kỳ hưởng: <strong>{record.chuKy === "1_NAM_LAN" ? "01 năm / 01 lần" : "02 năm / 01 lần"}</strong>
              </div>
            </div>
          </div>

          {/* Chi tiết nội dung chế độ */}
          {isTapTrung ? (
            /* TRƯỜNG HỢP ĐIỀU DƯỠNG TẬP TRUNG */
            <div className="space-y-3 text-xs my-4">
              <div className="font-bold text-gray-900 uppercase">
                1. THÔNG TIN ĐỢT ĐIỀU DƯỠNG TẬP TRUNG:
              </div>
              <ul className="list-disc pl-5 space-y-1.5 text-gray-800">
                <li>
                  Địa điểm điều dưỡng: <strong>{record.diaDiemHoacNganHang}</strong>
                </li>
                <li>
                  Thời gian tổ chức: <strong>{record.dotDieuDuong || "Đợt 1 năm 2026 (07 ngày)"}</strong>
                </li>
                <li>
                  Phương tiện di chuyển: <strong>Xe ô tô du lịch chất lượng cao của Sở LĐ-TB&XH đưa đón tận nơi</strong> tại Trụ sở UBND {record.huyen}.
                </li>
                <li>
                  Định mức kinh phí toàn khóa: <strong>{formatVND(record.dinhMuc)}</strong> / người (Bằng chữ: <em>{soTienChu}</em>).
                  Bao gồm: Tiền ăn hàng ngày, thuốc bồi dưỡng nâng cao thể trạng, quà tặng kỷ niệm và chi phí tham quan di tích lịch sử.
                </li>
              </ul>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-900 space-y-1">
                <strong>Lưu ý đối với đại biểu người có công:</strong>
                <p>- Mang theo Căn cước công dân và thẻ Bảo hiểm y tế (bản gốc hoặc trên ứng dụng VNeID).</p>
                <p>- Đại biểu có bệnh lý mãn tính vui lòng mang theo sổ khám bệnh và thuốc điều trị thường xuyên.</p>
              </div>
            </div>
          ) : (
            /* TRƯỜNG HỢP ĐIỀU DƯỠNG TẠI NHÀ */
            <div className="space-y-3 text-xs my-4">
              <div className="font-bold text-gray-900 uppercase">
                1. ĐỊNH MỨC KINH PHÍ CHI TRẢ:
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded space-y-1.5">
                <div className="flex justify-between">
                  <span>Mức chi điều dưỡng tại nhà (0.9 lần mức chuẩn theo NĐ 77/2024):</span>
                  <strong className="text-sm font-mono text-emerald-800">{formatVND(record.dinhMuc)}</strong>
                </div>
                <div className="italic text-gray-700">
                  (Bằng chữ: <em>{soTienChu}</em>)
                </div>
                <div className="text-[11px] text-gray-600">
                  Phương thức nhận tiền: <strong>{record.diaDiemHoacNganHang}</strong>
                </div>
              </div>

              <div className="font-bold text-gray-900 uppercase pt-2">
                2. DANH MỤC THUỐC BỔ & HƯỚNG DẪN DINH DƯỠNG PHỤC HỒI TẠI NHÀ:
              </div>
              <p className="text-gray-700">
                Khoản tiền trên được cấp để người có công chủ động bồi dưỡng sức khỏe, mua thuốc bổ, sữa dinh dưỡng, vitamin nhóm B, hoạt huyết dưỡng não và các thực phẩm dinh dưỡng phù hợp theo hướng dẫn của trạm y tế địa phương.
              </p>
            </div>
          )}

          {/* Chữ ký xác nhận */}
          <div className="grid grid-cols-2 gap-4 text-center text-xs mt-8 pt-4">
            <div>
              <div className="font-bold uppercase text-gray-800">
                {isTapTrung ? "NGƯỜI CÓ CÔNG / THÂN NHÂN ĐẠI DIỆN" : "NGƯỜI LĨNH TIỀN"}
              </div>
              <div className="text-[11px] italic text-gray-600">
                (Ký, ghi rõ họ tên)
              </div>
              <div className="mt-14 font-bold uppercase text-gray-900">
                {record.hoTen}
              </div>
            </div>

            <div>
              <div className="font-bold uppercase text-gray-800">
                GIÁM ĐỐC SỞ LAO ĐỘNG - TB&XH
              </div>
              <div className="text-[11px] italic text-gray-600">
                (Ký số điện tử & Đóng dấu)
              </div>
              <div className="mt-3 flex justify-center">
                <div className="border border-red-500 bg-red-50 p-2 rounded text-[10px] text-left space-y-0.5 text-red-900 inline-block">
                  <div className="flex items-center gap-1 font-bold text-red-700">
                    <ShieldCheck className="size-3.5" />
                    <span>ĐÃ KÝ SỐ CÔNG VỤ</span>
                  </div>
                  <div>SỞ LAO ĐỘNG - THƯƠNG BINH VÀ XÃ HỘI</div>
                  <div className="font-mono text-[9px] text-gray-600">
                    QĐ-KHDĐ-{record.namThucHien}-BD
                  </div>
                </div>
              </div>
              <div className="mt-2 font-bold uppercase text-gray-900">
                TS. Nguyễn Văn Hùng
              </div>
              <div className="text-[11px] text-gray-600">Giám đốc Sở</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

