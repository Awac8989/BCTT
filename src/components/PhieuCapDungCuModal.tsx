/**
 * BIỂU MẪU CẤP PHƯƠNG TIỆN TRỢ GIÚP & DỤNG CỤ CHỈNH HÌNH
 * Căn cứ pháp lý:
 * - Phụ lục V ban hành kèm theo Nghị định số 77/2024/NĐ-CP ngày 01/07/2024 của Chính phủ
 * - Điều 88 & 89 Nghị định số 131/2021/NĐ-CP
 * Cấp miễn phí cho Thương binh, Bệnh binh, Người nhiễm chất độc hóa học theo niên hạn
 */

import {
  X,
  Printer,
  Accessibility,
  CheckCircle2,
  Calendar,
  Building,
  ShieldCheck,
  Award,
} from "lucide-react";
import { formatVND, type DungCuChinhHinhItem } from "@/data/mock";
import { docSoTienBangChu } from "@/services/calculator.service";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  item: DungCuChinhHinhItem | null;
}

export function PhieuCapDungCuModal({ isOpen, onClose, item }: Props) {
  if (!isOpen || !item) return null;

  const now = new Date();
  const soPhieu = `PCD-${now.getFullYear()}/${item.id.replace(/\D/g, "").slice(-3) || "042"}`;
  const tongTien = item.dinhMucTien + item.tienBoiDuongPhucHoi;
  const soTienChu = docSoTienBangChu(tongTien);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-md shadow-2xl max-w-4xl w-full border border-gray-300 overflow-hidden my-4 text-[#222]">
        {/* THANH ĐIỀU KHIỂN TRÊN CÙNG */}
        <div className="no-print bg-[#00a65a] text-white px-5 py-3 flex flex-wrap items-center justify-between gap-2 border-b border-emerald-800">
          <div className="flex items-center gap-2">
            <Accessibility className="size-5 text-amber-200" />
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-100">
                PHIẾU TRANG CẤP PHƯƠNG TIỆN TRỢ GIÚP & DỤNG CỤ CHỈNH HÌNH
              </div>
              <div className="text-[11px] text-white/90 font-mono">
                Số: <strong>{soPhieu}</strong> · Phụ lục V Nghị định 77/2024/NĐ-CP
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
              <span>In Phiếu Cấp (A4)</span>
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
                Số: {soPhieu}/PCC-SLĐTBXH
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
              PHIẾU TRANG CẤP DỤNG CỤ CHỈNH HÌNH & PHƯƠNG TIỆN TRỢ GIÚP
            </h1>
            <div className="text-xs font-bold text-gray-800">
              Đối tượng: Thương binh, Bệnh binh, Người hoạt động kháng chiến bị nhiễm CĐHH
            </div>
            <div className="text-[11px] italic text-gray-600">
              (Căn cứ Phụ lục V ban hành kèm theo Nghị định số 77/2024/NĐ-CP ngày 01/07/2024 của Chính phủ)
            </div>
          </div>

          {/* Thông tin đối tượng */}
          <div className="border border-gray-300 rounded p-4 my-4 space-y-2 text-xs bg-gray-50/50">
            <div className="grid grid-cols-2 gap-4">
              <div>
                Họ và tên người nhận: <strong className="text-sm uppercase text-black">{item.hoTen}</strong>
              </div>
              <div>
                Số định danh (CCCD): <strong className="font-mono">{item.cccd}</strong>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                Diện đối tượng: <strong>{item.loaiDoiTuong}</strong>
              </div>
              <div>
                Mã hồ sơ quản lý: <strong className="font-mono">{item.soHoSoTinh}</strong>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                Địa chỉ thường trú: <strong>{item.phuong}, {item.huyen}, tỉnh Bình Dương</strong>
              </div>
              <div>
                Niên hạn sử dụng: <strong>{item.nienHanNam} năm</strong> (Đến hạn cấp mới: <strong>{item.namDenHanCapMoi}</strong>)
              </div>
            </div>
          </div>

          {/* Chi tiết trang cấp */}
          <div className="my-5 overflow-x-auto border border-black">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-100 text-center font-bold border-b border-black text-black">
                  <th className="p-2 border-r border-black w-10">STT</th>
                  <th className="p-2 border-r border-black">Tên phương tiện trợ giúp / Dụng cụ chỉnh hình</th>
                  <th className="p-2 border-r border-black w-24">Niên hạn</th>
                  <th className="p-2 border-r border-black text-right w-32">Định mức tiền (VNĐ)</th>
                  <th className="p-2 border-r border-black text-right w-36">Tiền bồi dưỡng phục hồi</th>
                  <th className="p-2 text-right w-32">Tổng cộng (VNĐ)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-black">
                  <td className="p-2.5 border-r border-black text-center font-bold">1</td>
                  <td className="p-2.5 border-r border-black font-bold">
                    {item.tenDungCu}
                    <div className="text-[11px] font-normal text-gray-600 mt-0.5">
                      Chế tác theo thông số đo giải phẫu cơ thể của thương binh tại xưởng chỉnh hình
                    </div>
                  </td>
                  <td className="p-2.5 border-r border-black text-center font-mono">{item.nienHanNam} năm</td>
                  <td className="p-2.5 border-r border-black font-mono text-right">{formatVND(item.dinhMucTien)}</td>
                  <td className="p-2.5 border-r border-black font-mono text-right">{formatVND(item.tienBoiDuongPhucHoi)}</td>
                  <td className="p-2.5 font-mono text-right font-bold text-red-600">{formatVND(tongTien)}</td>
                </tr>
                <tr className="bg-gray-100 font-bold border-t border-black text-black">
                  <td colSpan={3} className="p-2.5 border-r border-black text-center uppercase">
                    TỔNG KINH PHÍ NGÂN SÁCH ĐÀI THỌ:
                  </td>
                  <td colSpan={3} className="p-2.5 font-mono text-right text-sm text-red-700">
                    {formatVND(tongTien)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="italic text-xs text-gray-700 mb-6">
            (Bằng chữ: <strong>{soTienChu}</strong>). Kinh phí được thanh toán từ nguồn Ngân sách Trung ương thực hiện Pháp lệnh Ưu đãi người có công qua Kho bạc Nhà nước tỉnh Bình Dương.
          </div>

          {/* Đơn vị thực hiện chế tác & Chữ ký */}
          <div className="grid grid-cols-3 gap-4 text-center text-xs mt-8 pt-4">
            <div>
              <div className="font-bold uppercase text-gray-800">NGƯỜI NHẬN PHƯƠNG TIỆN</div>
              <div className="text-[11px] italic text-gray-600">(Ký, ghi rõ họ tên)</div>
              <div className="mt-14 font-bold uppercase text-gray-900">{item.hoTen}</div>
            </div>

            <div>
              <div className="font-bold uppercase text-gray-800">XƯỞNG CHỈNH HÌNH PHCN</div>
              <div className="text-[11px] italic text-gray-600">(Kỹ thuật viên chế tác & đo đạc)</div>
              <div className="mt-14 font-bold uppercase text-gray-900">KS. Phạm Văn Đức</div>
              <div className="text-[11px] text-gray-600">Trung tâm Chỉnh hình Bình Dương</div>
            </div>

            <div>
              <div className="font-bold uppercase text-gray-800">GIÁM ĐỐC SỞ LĐ-TB&XH</div>
              <div className="text-[11px] italic text-gray-600">(Ký số điện tử & Đóng dấu)</div>
              <div className="mt-3 flex justify-center">
                <div className="border border-red-500 bg-red-50 p-2 rounded text-[10px] text-left space-y-0.5 text-red-900 inline-block">
                  <div className="flex items-center gap-1 font-bold text-red-700">
                    <ShieldCheck className="size-3.5" />
                    <span>ĐÃ KÝ SỐ CÔNG VỤ</span>
                  </div>
                  <div>SỞ LAO ĐỘNG - THƯƠNG BINH VÀ XÃ HỘI</div>
                  <div className="font-mono text-[9px] text-gray-600">
                    QĐ-DCNCC-{now.getFullYear()}
                  </div>
                </div>
              </div>
              <div className="mt-2 font-bold uppercase text-gray-900">TS. Nguyễn Văn Hùng</div>
              <div className="text-[11px] text-gray-600">Giám đốc Sở</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

