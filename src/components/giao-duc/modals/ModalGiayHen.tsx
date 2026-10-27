import React from "react";
import { FileText, Download, Printer, X, QrCode, CheckCircle2 } from "lucide-react";
import { type HoSoTTHCGiaoDuc } from "@/data/domain-mock";
import { exportDocAsWord } from "../utils";

interface ModalGiayHenProps {
  hoSo: HoSoTTHCGiaoDuc | null;
  onClose: () => void;
}

export const ModalGiayHen: React.FC<ModalGiayHenProps> = ({ hoSo, onClose }) => {
  if (!hoSo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white text-gray-900 rounded-xl shadow-2xl max-w-3xl w-full border border-gray-200 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Topbar No-print */}
        <div className="flex items-center justify-between px-6 py-3 border-b bg-gray-50 rounded-t-xl no-print shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="size-5 text-[#dd4b39]" />
            <h3 className="font-bold text-sm sm:text-base text-gray-800">
              Giấy tiếp nhận hồ sơ và Hẹn trả kết quả (Mẫu số 01 - Nghị định 61/2018/NĐ-CP)
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                exportDocAsWord(`Giay_hen_${hoSo.maHoSo}`, "giay-hen-content")
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer transition-colors"
              title="Xuất văn bản Giấy hẹn sang tệp Word (.doc) chuẩn thể thức NĐ 30/2020"
            >
              <Download className="size-4" />
              Xuất Word (.doc)
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#00a65a] hover:bg-[#008d4c] text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer transition-colors"
            >
              <Printer className="size-4" />
              In giấy hẹn (Ctrl+P)
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-200 text-gray-500 rounded-lg cursor-pointer"
              title="Đóng"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Nội dung Mẫu số 01 */}
        <div
          className="p-8 overflow-y-auto font-serif text-[13px] leading-relaxed select-text flex-1"
          id="giay-hen-content"
        >
          {/* Quốc hiệu & Tiêu ngữ */}
          <div className="grid grid-cols-2 text-center pb-4 border-b border-gray-400">
            <div>
              <div className="font-bold uppercase text-[12px]">
                UBND THÀNH PHỐ THỦ DẦU MỘT
              </div>
              <div className="font-bold uppercase text-[13px] text-[#b91c1c]">
                ỦY BAN NHÂN DÂN PHƯỜNG PHÚ CƯỜNG
              </div>
              <div className="text-[11px] font-sans font-medium text-gray-700">
                Bộ phận Tiếp nhận và Trả kết quả (Một cửa)
              </div>
              <div className="text-[11px] font-sans italic mt-1">
                Số hồ sơ:{" "}
                <span className="font-mono font-bold text-black">
                  {hoSo.maHoSo}
                </span>
              </div>
            </div>
            <div>
              <div className="font-bold uppercase text-[12px]">
                CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
              </div>
              <div className="font-bold text-[13px]">
                Độc lập - Tự do - Hạnh phúc
              </div>
              <div className="text-[11px] italic font-sans mt-2">
                Phú Cường, ngày {hoSo.ngayTiepNhan.split("/")[0]} tháng{" "}
                {hoSo.ngayTiepNhan.split("/")[1]} năm{" "}
                {hoSo.ngayTiepNhan.split("/")[2]}
              </div>
            </div>
          </div>

          {/* Tiêu đề */}
          <div className="text-center my-5">
            <h2 className="text-lg font-bold uppercase tracking-wide text-gray-900">
              GIẤY TIẾP NHẬN HỒ SƠ VÀ HẸN TRẢ KẾT QUẢ
            </h2>
            <div className="text-xs italic text-gray-600 font-sans">
              (Mẫu số 01 - Ban hành kèm theo Nghị định số 61/2018/NĐ-CP của Chính
              phủ)
            </div>
          </div>

          {/* Thông tin hồ sơ & người nộp */}
          <div className="space-y-2 border border-gray-300 p-4 rounded-lg bg-gray-50/50 mb-4 font-sans text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-gray-600">Đơn vị tiếp nhận:</span>{" "}
                <strong className="text-gray-900">
                  Bộ phận Một cửa - UBND Phường Phú Cường
                </strong>
              </div>
              <div>
                <span className="text-gray-600">Mã quản lý hồ sơ:</span>{" "}
                <strong className="text-gray-900 font-mono">
                  {hoSo.maHoSo}
                </strong>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-gray-600">Họ và tên người nộp hồ sơ:</span>{" "}
                <strong className="text-[#b91c1c] text-sm uppercase">
                  {hoSo.nguoiNop}
                </strong>
              </div>
              <div>
                <span className="text-gray-600">Số điện thoại:</span>{" "}
                <strong className="font-mono text-gray-900">
                  {hoSo.soDienThoai}
                </strong>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-gray-600">Số CCCD / Định danh:</span>{" "}
                <strong className="font-mono text-gray-900">{hoSo.cccd}</strong>
              </div>
              <div>
                <span className="text-gray-600">Tên cơ sở đề nghị:</span>{" "}
                <strong className="text-emerald-800">
                  {hoSo.tenCoSoDeNghi}
                </strong>
              </div>
            </div>

            <div>
              <span className="text-gray-600">Địa chỉ hoạt động cơ sở:</span>{" "}
              <span className="text-gray-900 font-medium">
                {hoSo.diaDiemCoSo}
              </span>
            </div>

            <div>
              <span className="text-gray-600">Thủ tục hành chính yêu cầu:</span>{" "}
              <strong className="text-gray-900">{hoSo.tenThuTuc}</strong>
            </div>
          </div>

          {/* Thành phần hồ sơ đã nộp */}
          <div className="mb-4">
            <div className="font-bold text-xs uppercase mb-1.5 text-gray-800 font-sans">
              1. Danh mục thành phần hồ sơ tiếp nhận gồm:
            </div>
            <table className="w-full text-xs font-sans border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="border border-gray-300 p-1.5 w-10 text-center">
                    STT
                  </th>
                  <th className="border border-gray-300 p-1.5 text-left">
                    Tên loại giấy tờ, văn bản
                  </th>
                  <th className="border border-gray-300 p-1.5 w-20 text-center">
                    Số lượng
                  </th>
                  <th className="border border-gray-300 p-1.5 w-28 text-center">
                    Tình trạng
                  </th>
                </tr>
              </thead>
              <tbody>
                {hoSo.thanhPhanHoSo.map((gt, idx) => (
                  <tr key={gt.id}>
                    <td className="border border-gray-300 p-1.5 text-center">
                      {idx + 1}
                    </td>
                    <td className="border border-gray-300 p-1.5">
                      {gt.tenGiayTo}
                    </td>
                    <td className="border border-gray-300 p-1.5 text-center">
                      {gt.soLuong} bản
                    </td>
                    <td className="border border-gray-300 p-1.5 text-center">
                      {gt.daNop ? (
                        <span className="text-emerald-700 font-bold">
                          ✓ Đã tiếp nhận
                        </span>
                      ) : (
                        <span className="text-red-600 font-bold">
                          ✗ Chưa nộp
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Thời gian hẹn trả kết quả */}
          <div className="grid grid-cols-2 gap-4 border border-dashed border-gray-400 p-3 rounded-lg bg-amber-50/50 mb-5 font-sans">
            <div>
              <div className="text-xs text-gray-600">
                Thời gian tiếp nhận hồ sơ:
              </div>
              <div className="text-sm font-bold text-gray-800">
                {hoSo.ngayTiepNhan} (Giờ hành chính)
              </div>
            </div>
            <div>
              <div className="text-xs text-[#b91c1c] font-bold">
                Thời gian hẹn trả kết quả giải quyết:
              </div>
              <div className="text-sm font-extrabold text-[#b91c1c]">
                {hoSo.ngayHenTra} (Trước 17h00)
              </div>
              <div className="text-[11px] text-gray-500 italic">
                Địa điểm: Bộ phận Một cửa - UBND Phường Phú Cường
              </div>
            </div>
          </div>

          {/* Khối Mã QR Đánh giá Dịch vụ công */}
          <div className="border-2 border-[#dd4b39] rounded-xl p-3.5 bg-red-50/40 my-5 font-sans">
            <div className="flex items-center gap-4">
              <div className="size-24 bg-white border-2 border-gray-800 rounded-lg p-1 shrink-0 flex flex-col items-center justify-center">
                <QrCode className="size-20 text-gray-900" />
              </div>
              <div className="flex-1 text-xs">
                <div className="font-bold text-sm text-[#b91c1c] flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-[#b91c1c]" />
                  QUÉT MÃ QR ĐỂ TRA CỨU TIẾN ĐỘ &amp; ĐÁNH GIÁ SỰ HÀI LÒNG
                </div>
                <div className="text-gray-700 mt-1 leading-relaxed">
                  Công dân có thể sử dụng Camera điện thoại hoặc ứng dụng{" "}
                  <strong>Zalo</strong> quét mã QR để kiểm tra kết quả thẩm
                  định, nhận thông báo lịch kiểm tra thực địa hoặc đánh giá tinh
                  thần phục vụ của Cán bộ Một cửa.
                </div>
                <div className="text-[10px] text-gray-500 italic mt-0.5">
                  Mã hồ sơ tra cứu:{" "}
                  <span className="font-mono font-bold text-blue-700">
                    {hoSo.maHoSo}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Chữ ký hai bên */}
          <div className="grid grid-cols-2 text-center pt-3 font-sans">
            <div>
              <div className="font-bold text-xs uppercase text-gray-800">
                NGƯỜI NỘP HỒ SƠ
              </div>
              <div className="text-[11px] italic text-gray-500">
                (Ký và ghi rõ họ tên)
              </div>
              <div className="h-16" />
              <div className="font-semibold text-xs text-gray-800 uppercase">
                {hoSo.nguoiNop}
              </div>
            </div>
            <div>
              <div className="font-bold text-xs uppercase text-gray-800">
                CÁN BỘ TIẾP NHẬN HỒ SƠ
              </div>
              <div className="text-[11px] italic text-gray-500">
                (Ký điện tử xác thực)
              </div>
              <div className="h-16 flex items-center justify-center text-emerald-700 font-semibold italic text-[11px]">
                (Đã xác thực chữ ký điện tử một cửa)
              </div>
              <div className="font-bold text-xs text-gray-900">
                {hoSo.canBoTiepNhan}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t bg-gray-50 rounded-b-xl no-print">
          <span className="text-xs text-gray-500 font-sans">
            Mẫu số 01/DVC · Bộ phận Tiếp nhận &amp; Trả kết quả UBND Phường Phú
            Cường
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                exportDocAsWord(`Giay_hen_${hoSo.maHoSo}`, "giay-hen-content")
              }
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="size-4" />
              Tải file Word (.doc)
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-[#dd4b39] hover:bg-[#c23321] text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="size-4" />
              In giấy hẹn
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-semibold rounded-lg cursor-pointer transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
