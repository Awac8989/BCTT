/**
 * BIỂU MẪU D03-TS: DANH SÁCH NGƯỜI CHỈ THAM GIA BẢO HIỂM Y TẾ
 * Căn cứ pháp lý:
 * - Quyết định số 505/QĐ-BHXH ngày 27/03/2020 của Tổng Giám đốc BHXH Việt Nam
 * - Quyết định số 595/QĐ-BHXH ngày 14/04/2017 của BHXH Việt Nam
 * - Nghị định số 146/2018/NĐ-CP quy định chi tiết và hướng dẫn thi hành một số điều của Luật BHYT
 * Ngân sách Nhà nước đóng 100% BHYT cho Người có công & Thân nhân liệt sĩ
 */

import {
  X,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Building,
  CreditCard,
  Download,
  AlertCircle,
  FileSpreadsheet,
} from "lucide-react";
import { toast } from "sonner";
import { type HoSo } from "@/data/mock";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  hoSo: HoSo | null;
  loaiNghiepVu?: "CAP_MOI" | "BAO_GIAM" | "GIA_HAN";
}

export function MauD03TsModal({ isOpen, onClose, hoSo, loaiNghiepVu = "CAP_MOI" }: Props) {
  if (!isOpen || !hoSo) return null;

  const now = new Date();
  const soCongVan = `CV-${now.getFullYear()}/LĐTBXH-BHXH-${hoSo.id.replace(/\D/g, "").slice(-3) || "088"}`;
  const ngayLap = now.toLocaleDateString("vi-VN");

  // Mã thẻ BHYT & Mức hưởng chuẩn BHXH
  const isLietSyOrThanNhan = hoSo.loaiDoiTuong.includes("liệt") || hoSo.loaiDoiTuong.includes("Thân nhân");
  const isThuongBinh = hoSo.loaiDoiTuong.includes("Thương binh");
  const isMe = hoSo.loaiDoiTuong.includes("Mẹ");

  const maHuong = isMe ? "HT1" : isThuongBinh ? "CC1" : "BT2";
  const tyLeHuong = maHuong === "HT1" || maHuong === "CC1" ? "100% (Không giới hạn tỷ lệ thanh toán)" : "100% chi phí KCB";
  const soTheBhyt = hoSo.soBhyt || `${maHuong}74${hoSo.cccd.slice(-7)}`;
  const coSoKcb = "Bệnh viện Đa khoa tỉnh Bình Dương (Mã: 74-001)";

  const handlePrint = () => {
    window.print();
  };

  const handleExportCsv = () => {
    const csvContent =
      "\uFEFF" +
      [
        "STT,Họ và tên,Số định danh CCCD,Mã số BHXH / Thẻ BHYT,Ngày sinh,Giới tính,Địa chỉ thường trú,Mã mức hưởng,Cơ sở KCB ban đầu,Loại nghiệp vụ",
        `1,"${hoSo.hoTen}","${hoSo.cccd}","${soTheBhyt}","${hoSo.namSinh || "1926"}","${hoSo.gioiTinh}","${hoSo.phuong} - ${hoSo.huyen || "TP. Thủ Dầu Một"}","${maHuong} - ${tyLeHuong}","${coSoKcb}","${
          loaiNghiepVu === "BAO_GIAM" ? "Báo giảm (Từ trần)" : loaiNghiepVu === "GIA_HAN" ? "Gia hạn thẻ" : "Cấp mới thẻ điện tử"
        }"`,
      ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `MAU_D03_TS_BHYT_${hoSo.cccd}_${loaiNghiepVu}.csv`;
    a.click();
    toast.success("Đã xuất danh sách Mẫu D03-TS liên thông BHXH thành công!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-md shadow-2xl max-w-4xl w-full border border-gray-300 overflow-hidden my-4 text-[#222]">
        {/* THANH ĐIỀU KHIỂN TRÊN CÙNG (KHÔNG IN) */}
        <div className="no-print bg-[#00a65a] text-white px-5 py-3 flex flex-wrap items-center justify-between gap-2 border-b border-emerald-800">
          <div className="flex items-center gap-2">
            <CreditCard className="size-5 text-amber-200" />
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-100">
                BIỂU MẪU D03-TS · LIÊN THÔNG BẢO HIỂM XÃ HỘI TỈNH BÌNH DƯƠNG
              </div>
              <div className="text-[11px] text-white/90 font-mono">
                Số: <strong>{soCongVan}</strong> · Cấp/Thu hồi thẻ BHYT Người có công (QĐ 505/QĐ-BHXH)
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white text-emerald-800 hover:bg-emerald-50 text-xs font-bold shadow-xs cursor-pointer"
            >
              <FileSpreadsheet className="size-3.5 text-emerald-700" />
              <span>Xuất D03-TS (.CSV)</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              <Printer className="size-3.5" />
              <span>In Mẫu D03-TS (A4)</span>
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

        {/* NỘI DUNG VĂN BẢN MẪU D03-TS (CHUẨN FORM IN A4) */}
        <div className="p-8 sm:p-12 font-serif text-[13px] leading-relaxed text-black bg-white select-text">
          {/* Header 2 cột chuẩn văn bản BHXH */}
          <div className="grid grid-cols-2 gap-4 items-start text-center mb-6">
            <div>
              <div className="text-xs uppercase font-bold text-gray-800">
                BẢO HIỂM XÃ HỘI VIỆT NAM
              </div>
              <div className="text-xs uppercase font-extrabold text-black">
                BẢO HIỂM XÃ HỘI TỈNH BÌNH DƯƠNG
              </div>
              <div className="text-[11px] text-gray-600 font-mono mt-0.5">
                Mã cơ quan BHXH: <strong>7400</strong>
              </div>
              <div className="text-[11px] text-gray-700 font-mono mt-0.5">
                Số: {soCongVan}
              </div>
            </div>

            <div className="text-center">
              <div className="text-[11px] font-bold text-gray-700 uppercase">
                Mẫu số: D03-TS
              </div>
              <div className="text-[10px] italic text-gray-600 leading-tight">
                (Ban hành kèm theo Quyết định số 505/QĐ-BHXH<br />ngày 27/03/2020 của Tổng Giám đốc BHXH Việt Nam)
              </div>
              <div className="text-[11px] italic text-gray-700 mt-2">
                Bình Dương, ngày {now.getDate()} tháng {now.getMonth() + 1} năm {now.getFullYear()}
              </div>
            </div>
          </div>

          {/* Tiêu đề chính */}
          <div className="text-center my-6 space-y-1">
            <h1 className="text-base sm:text-lg font-extrabold uppercase tracking-wide text-black">
              DANH SÁCH NGƯỜI CHỈ THAM GIA BẢO HIỂM Y TẾ
            </h1>
            <div className="text-xs font-bold text-gray-800">
              Nhóm đối tượng: Người có công với cách mạng và Thân nhân người có công
            </div>
            <div className="text-[11px] italic text-gray-600">
              (Nguồn kinh phí: Ngân sách Nhà nước đóng 100% - Nghị định số 146/2018/NĐ-CP)
            </div>
          </div>

          {/* Thông tin đơn vị đề nghị */}
          <div className="space-y-1.5 text-xs text-gray-800 border-b border-gray-200 pb-4 mb-4">
            <div className="flex justify-between flex-wrap gap-2">
              <span>
                Tên cơ quan quản lý đối tượng: <strong>Sở Lao động - Thương binh và Xã hội tỉnh Bình Dương</strong>
              </span>
              <span>
                Mã đơn vị: <strong className="font-mono">TL0012B</strong>
              </span>
            </div>
            <div className="flex justify-between flex-wrap gap-2">
              <span>
                Địa chỉ cơ quan: <strong>Tầng 6, Tháp A, Trung tâm Hành chính tỉnh Bình Dương</strong>
              </span>
              <span>
                Đơn vị cấp huyện: <strong>Phòng LĐ-TB&XH TP. Thủ Dầu Một</strong>
              </span>
            </div>
            <div>
              Mục đích lập danh sách:{" "}
              <strong className="text-emerald-800">
                {loaiNghiepVu === "BAO_GIAM"
                  ? "Báo giảm đối tượng từ trần, chấm dứt giá trị sử dụng thẻ BHYT theo trích lục khai tử"
                  : loaiNghiepVu === "GIA_HAN"
                  ? "Gia hạn thẻ BHYT điện tử năm 2026"
                  : "Cấp mới thẻ BHYT điện tử liên thông VNeID cho đối tượng Người có công vừa được phê duyệt"}
              </strong>
            </div>
          </div>

          {/* BẢNG DANH SÁCH CHI TIẾT (CHUẨN D03-TS) */}
          <div className="my-5 overflow-x-auto border border-black">
            <table className="w-full text-left text-[11px] border-collapse">
              <thead>
                <tr className="bg-gray-100 text-center font-bold border-b border-black text-black">
                  <th className="p-2 border-r border-black w-8">STT</th>
                  <th className="p-2 border-r border-black w-40">Họ và tên</th>
                  <th className="p-2 border-r border-black w-24">Số định danh (CCCD)</th>
                  <th className="p-2 border-r border-black w-28">Mã số BHXH / Mã thẻ BHYT</th>
                  <th className="p-2 border-r border-black w-16">Năm sinh</th>
                  <th className="p-2 border-r border-black w-14">Giới tính</th>
                  <th className="p-2 border-r border-black">Địa chỉ thường trú</th>
                  <th className="p-2 border-r border-black w-20">Mức hưởng</th>
                  <th className="p-2 border-r border-black w-36">Cơ sở KCB ban đầu</th>
                  <th className="p-2 w-20">Ghi chú</th>
                </tr>
                <tr className="bg-gray-50 text-center text-[10px] text-gray-600 border-b border-black">
                  <th className="p-1 border-r border-black">(1)</th>
                  <th className="p-1 border-r border-black">(2)</th>
                  <th className="p-1 border-r border-black">(3)</th>
                  <th className="p-1 border-r border-black">(4)</th>
                  <th className="p-1 border-r border-black">(5)</th>
                  <th className="p-1 border-r border-black">(6)</th>
                  <th className="p-1 border-r border-black">(7)</th>
                  <th className="p-1 border-r border-black">(8)</th>
                  <th className="p-1 border-r border-black">(9)</th>
                  <th className="p-1">(10)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-black">
                  <td className="p-2 border-r border-black text-center font-bold">1</td>
                  <td className="p-2 border-r border-black font-bold uppercase">{hoSo.hoTen}</td>
                  <td className="p-2 border-r border-black font-mono text-center">{hoSo.cccd}</td>
                  <td className="p-2 border-r border-black font-mono font-bold text-center text-emerald-800">
                    {soTheBhyt}
                  </td>
                  <td className="p-2 border-r border-black text-center">{hoSo.namSinh || "1926"}</td>
                  <td className="p-2 border-r border-black text-center">{hoSo.gioiTinh}</td>
                  <td className="p-2 border-r border-black">
                    {hoSo.phuong}, {hoSo.huyen || "TP. Thủ Dầu Một"}, Bình Dương
                  </td>
                  <td className="p-2 border-r border-black font-bold text-center text-red-700">
                    {maHuong} (100%)
                  </td>
                  <td className="p-2 border-r border-black">{coSoKcb}</td>
                  <td className="p-2 text-center text-[10px] font-semibold">
                    {loaiNghiepVu === "BAO_GIAM" ? (
                      <span className="text-red-600">Báo giảm từ trần</span>
                    ) : (
                      <span className="text-emerald-700">Cấp mới VNeID</span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Ghi chú pháp lý mức hưởng BHYT */}
          <div className="bg-emerald-50 border border-emerald-300 p-3 rounded text-[11px] space-y-1 mb-6 text-emerald-950">
            <div className="font-bold flex items-center gap-1.5 text-emerald-900">
              <CheckCircle2 className="size-3.5 text-emerald-700" />
              <span>Xác nhận quyền lợi khám chữa bệnh BHYT Người có công:</span>
            </div>
            <div>
              - Mã quyền lợi <strong>{maHuong}</strong>: Được quỹ BHYT thanh toán <strong>{tyLeHuong}</strong> trong phạm vi chi trả BHYT; chi phí vận chuyển người bệnh từ tuyến huyện lên tuyến trên trong trường hợp cấp cứu hoặc điều trị nội trú.
            </div>
            <div>
              - Thời hạn giá trị sử dụng thẻ BHYT điện tử: Bắt đầu từ ngày <strong>01/01/2026</strong> và tự động tích hợp vào ví giấy tờ trên ứng dụng định danh <strong>VNeID mức 2</strong>.
            </div>
          </div>

          {/* Chữ ký 2 bên */}
          <div className="grid grid-cols-2 gap-4 text-center text-xs mt-8 pt-4">
            <div>
              <div className="font-bold uppercase text-gray-800">
                ĐẠI DIỆN CƠ QUAN QUẢN LÝ ĐỐI TƯỢNG
              </div>
              <div className="text-[11px] italic text-gray-600">
                (Ký, ghi rõ họ tên và đóng dấu)
              </div>
              <div className="mt-14 font-bold uppercase text-gray-900">
                Nguyễn Thị Minh Thảo
              </div>
              <div className="text-[11px] text-gray-600">
                Phó Trưởng phòng LĐ-TB&XH TP. Thủ Dầu Một
              </div>
            </div>

            <div>
              <div className="font-bold uppercase text-gray-800">
                BẢO HIỂM XÃ HỘI TỈNH BÌNH DƯƠNG
              </div>
              <div className="text-[11px] italic text-gray-600">
                (Ký số điện tử & Xác nhận cấp mã thẻ)
              </div>
              <div className="mt-4 flex flex-col items-center justify-center">
                <div className="border border-emerald-600 bg-emerald-50 text-emerald-900 p-2 rounded text-[10px] text-left space-y-0.5 inline-block">
                  <div className="flex items-center gap-1 font-bold text-emerald-800">
                    <ShieldCheck className="size-3.5 text-emerald-600" />
                    <span>ĐÃ KÝ SỐ ĐIỆN TỬ BHXH VIỆT NAM</span>
                  </div>
                  <div>Cơ quan: BHXH Tỉnh Bình Dương</div>
                  <div className="font-mono text-[9px] text-gray-600">
                    Mã xác thực: BHXH-74-D03TS-{hoSo.cccd.slice(-6)}
                  </div>
                </div>
              </div>
              <div className="mt-2 font-bold uppercase text-gray-900">
                Lê Minh Tân
              </div>
              <div className="text-[11px] text-gray-600">
                Giám đốc BHXH tỉnh Bình Dương
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

