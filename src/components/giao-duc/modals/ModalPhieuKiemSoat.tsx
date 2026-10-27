import React from "react";
import { History, X, Download, Printer } from "lucide-react";
import { type HoSoTTHCGiaoDuc } from "@/data/domain-mock";
import { exportDocAsWord } from "../utils";

interface ModalPhieuKiemSoatProps {
  hoSo: HoSoTTHCGiaoDuc | null;
  onClose: () => void;
}

export const ModalPhieuKiemSoat: React.FC<ModalPhieuKiemSoatProps> = ({
  hoSo,
  onClose,
}) => {
  if (!hoSo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white text-gray-900 rounded-xl shadow-2xl max-w-2xl w-full border border-gray-200 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-gray-800 text-white px-5 py-3.5 flex items-center justify-between shrink-0 shadow-xs rounded-t-xl">
          <div className="flex items-center gap-2">
            <History className="size-5" />
            <h3 className="font-bold text-sm sm:text-base">
              Phiếu Kiểm soát Quá trình Giải quyết Hồ sơ (Mẫu số 05)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-md hover:bg-white/10 cursor-pointer transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        <div
          className="p-6 space-y-4 text-xs overflow-y-auto font-sans flex-1"
          id="phieu-kiem-soat-content"
        >
          <div className="border border-gray-200 rounded-lg p-3.5 bg-gray-50/70 space-y-1">
            <div>
              <span className="text-gray-500">Mã hồ sơ theo dõi:</span>{" "}
              <strong className="font-mono text-gray-900">{hoSo.maHoSo}</strong>
            </div>
            <div>
              <span className="text-gray-500">Tên thủ tục:</span>{" "}
              <strong className="text-gray-900">{hoSo.tenThuTuc}</strong>
            </div>
            <div>
              <span className="text-gray-500">Người nộp:</span>{" "}
              <strong className="text-gray-900 uppercase">
                {hoSo.nguoiNop}
              </strong>{" "}
              · Cơ sở: {hoSo.tenCoSoDeNghi}
            </div>
          </div>

          {/* Bảng luân chuyển các khâu */}
          <table className="w-full text-xs border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="border border-gray-300 p-2 w-10 text-center">
                  STT
                </th>
                <th className="border border-gray-300 p-2 text-left">
                  Giai đoạn / Bước xử lý
                </th>
                <th className="border border-gray-300 p-2 text-left">
                  Người giao / nhận
                </th>
                <th className="border border-gray-300 p-2 text-center w-24">
                  Thời gian
                </th>
                <th className="border border-gray-300 p-2 text-center w-28">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2 text-center">1</td>
                <td className="border border-gray-300 p-2 font-medium">
                  Tiếp nhận hồ sơ &amp; cấp Giấy hẹn Mẫu 01
                </td>
                <td className="border border-gray-300 p-2">
                  {hoSo.canBoTiepNhan}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  {hoSo.ngayTiepNhan}
                </td>
                <td className="border border-gray-300 p-2 text-center text-emerald-700 font-bold">
                  Hoàn thành
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 text-center">2</td>
                <td className="border border-gray-300 p-2 font-medium">
                  Thẩm định hồ sơ giấy tờ &amp; văn bằng
                </td>
                <td className="border border-gray-300 p-2">{hoSo.canBoThuLy}</td>
                <td className="border border-gray-300 p-2 text-center">
                  {hoSo.ngayTiepNhan}
                </td>
                <td className="border border-gray-300 p-2 text-center text-emerald-700 font-bold">
                  {hoSo.trangThai === "YEU_CAU_BO_SUNG"
                    ? "Phát Mẫu 02"
                    : "Hợp lệ"}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 text-center">3</td>
                <td className="border border-gray-300 p-2 font-medium">
                  Kiểm tra thực tế điều kiện tại cơ sở
                </td>
                <td className="border border-gray-300 p-2">
                  Đoàn liên ngành GD - Y tế - PCCC
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  {hoSo.ketQuaThucDia?.ngayKiemTra || "Theo lịch"}
                </td>
                <td className="border border-gray-300 p-2 text-center font-bold">
                  {hoSo.ketQuaThucDia ? (
                    <span className="text-emerald-700">Đạt yêu cầu</span>
                  ) : (
                    <span className="text-gray-400">Chưa kiểm tra</span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 text-center">4</td>
                <td className="border border-gray-300 p-2 font-medium">
                  Soạn Tờ trình trình Lãnh đạo UBND
                </td>
                <td className="border border-gray-300 p-2">{hoSo.canBoThuLy}</td>
                <td className="border border-gray-300 p-2 text-center">
                  {hoSo.toTrinh?.ngayTrinh || "Theo tiến độ"}
                </td>
                <td className="border border-gray-300 p-2 text-center font-bold">
                  {hoSo.toTrinh ? (
                    <span className="text-emerald-700">Đã trình</span>
                  ) : (
                    <span className="text-gray-400">Chờ lập</span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 text-center">5</td>
                <td className="border border-gray-300 p-2 font-medium">
                  Ký số điện tử Quyết định thành lập
                </td>
                <td className="border border-gray-300 p-2">
                  Chủ tịch UBND Phường
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  {hoSo.quyetDinh?.ngayBanHanh || "Hạn trả: " + hoSo.ngayHenTra}
                </td>
                <td className="border border-gray-300 p-2 text-center font-bold">
                  {hoSo.quyetDinh?.daKySo ? (
                    <span className="text-emerald-700">Đã ký số CA</span>
                  ) : (
                    <span className="text-amber-600">Chờ duyệt</span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 text-center">6</td>
                <td className="border border-gray-300 p-2 font-medium">
                  Trả kết quả tại Một cửa cho người dân
                </td>
                <td className="border border-gray-300 p-2">
                  {hoSo.canBoTiepNhan}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  {hoSo.ngayHenTra}
                </td>
                <td className="border border-gray-300 p-2 text-center font-bold">
                  {hoSo.trangThai === "DA_TRA_KET_QUA" ? (
                    <span className="text-emerald-700">Đã trả</span>
                  ) : hoSo.trangThai === "DA_PHE_DUYET" ? (
                    <span className="text-blue-700">Sẵn sàng</span>
                  ) : (
                    <span className="text-gray-400">Đang xử lý</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-6 py-3 border-t bg-gray-50 rounded-b-xl no-print">
          <span className="text-xs text-gray-500">
            Mẫu số 05/NĐ-61 · Kiểm soát thời gian giải quyết hồ sơ
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                exportDocAsWord(
                  `Phieu_kiem_soat_${hoSo.maHoSo}`,
                  "phieu-kiem-soat-content"
                )
              }
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Download className="size-3.5" />
              Xuất Word (.doc)
            </button>
            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 bg-gray-700 hover:bg-gray-800 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Printer className="size-3.5" />
              In phiếu kiểm soát
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-semibold rounded-lg cursor-pointer transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
