import React from "react";
import { School, Building, Clock, TrafficCone, FileText } from "lucide-react";
import type { TruongHocCongLap } from "@/data/domain-mock";

interface TruongCongLapTabProps {
  truongCongLapList: TruongHocCongLap[];
  setShowKeHoachTuyenSinhModal: (show: boolean) => void;
  setShowKeHoachAtgtModal: (show: boolean) => void;
  setEditingSchoolAtgt: (tr: TruongHocCongLap | null) => void;
  setLucLuongAtgt: (val: string) => void;
  setGioPhanLuong: (val: string) => void;
}

export const TruongCongLapTab: React.FC<TruongCongLapTabProps> = ({
  truongCongLapList,
  setShowKeHoachTuyenSinhModal,
  setShowKeHoachAtgtModal,
  setEditingSchoolAtgt,
  setLucLuongAtgt,
  setGioPhanLuong,
}) => {
  return (
    <div className="space-y-4">
      {/* Khối kế hoạch tuyển sinh đầu cấp & VNeID */}
      <div className="bg-gradient-to-r from-sky-900 to-indigo-900 text-white rounded-lg p-4 border border-sky-700 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <School className="size-5 text-sky-300" />
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wide">
              Kế Hoạch Phối Hợp Tuyển Sinh Đầu Cấp &amp; An Toàn Trường Học Năm Học 2026 - 2027
            </h3>
          </div>
          <p className="text-xs text-sky-200 mt-1 max-w-2xl leading-relaxed">
            Ứng dụng cơ sở dữ liệu dân cư <strong>Đề án 06 / VNeID</strong> cấp mã định danh học sinh, tổ chức phân tuyến tuyển sinh theo khu phố, đảm bảo 100% trẻ em đúng độ tuổi được đến trường và không xảy ra ùn tắc giao thông cổng trường.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            onClick={() => setShowKeHoachTuyenSinhModal(true)}
            className="px-3 py-1.5 rounded-md bg-sky-600 hover:bg-sky-500 text-xs font-bold text-white border border-sky-400 shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            title="Xem Kế hoạch phân tuyến tuyển sinh theo khu phố và Quyết định 104/QĐ-UBND"
          >
            <FileText className="size-3.5" />
            <span>Kế hoạch &amp; QĐ Tuyển sinh (Số 104)</span>
          </button>
          <button
            onClick={() => setShowKeHoachAtgtModal(true)}
            className="px-3 py-1.5 rounded-md bg-amber-600 hover:bg-amber-500 text-xs font-bold text-white border border-amber-400 shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            title="Xem Kế hoạch Phối hợp Bảo đảm Trật tự ATGT Cổng trường học (Chỉ thị 31/CT-TTg)"
          >
            <TrafficCone className="size-3.5" />
            <span>Kế hoạch ATGT Cổng trường (Chỉ thị 31)</span>
          </button>
          <span className="px-3 py-1.5 rounded-md bg-white/10 text-xs font-bold text-sky-100 border border-white/20">
            100% Tuyển sinh Trực tuyến
          </span>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Building className="size-4 text-sky-600" />
            <h3 className="text-sm font-bold text-gray-900">
              Mạng lưới Trường học Công lập trên địa bàn Phường
            </h3>
          </div>
          <span className="text-xs text-gray-500 font-medium">
            Phối hợp: Phòng GD&amp;ĐT TP. Thủ Dầu Một · UBND Phường · Công an Phường
          </span>
        </div>

        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-gray-600 border-b border-gray-200 font-bold">
                <th className="py-2.5 px-3">Tên trường công lập</th>
                <th className="py-2.5 px-3">Cấp học</th>
                <th className="py-2.5 px-3">Hiệu trưởng &amp; Điện thoại</th>
                <th className="py-2.5 px-3">Phân tuyến địa bàn (Khu phố)</th>
                <th className="py-2.5 px-3 text-center">Chỉ tiêu / Đã tuyển</th>
                <th className="py-2.5 px-3 text-center">Tỷ lệ nộp VNeID</th>
                <th className="py-2.5 px-3">Phương án ATGT Cổng trường</th>
                <th className="py-2.5 px-3 text-right">Điều phối ATGT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {truongCongLapList.map((tr) => (
                <tr key={tr.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-2.5 px-3">
                    <div className="font-bold text-gray-900">{tr.tenTruong}</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">{tr.diaChi}</div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold border ${
                        tr.capHoc === "MAM_NON"
                          ? "bg-purple-50 text-purple-800 border-purple-200"
                          : tr.capHoc === "TIEU_HOC"
                          ? "bg-sky-50 text-sky-800 border-sky-200"
                          : "bg-blue-50 text-blue-800 border-blue-200"
                      }`}
                    >
                      {tr.capHoc === "MAM_NON" ? "Mầm non" : tr.capHoc === "TIEU_HOC" ? "Tiểu học" : "THCS"}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-gray-800">
                    <div className="font-semibold">{tr.hieuTruong}</div>
                    <div className="text-[10px] text-gray-500 font-mono mt-0.5">SĐT: {tr.soDienThoai}</div>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex flex-wrap gap-1">
                      {tr.tuyenKhuPho?.map((kp) => (
                        <span
                          key={kp}
                          className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 font-semibold text-[10px] border border-gray-200"
                        >
                          {kp}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <div className="font-bold text-gray-900 font-mono">
                      {tr.daTuyenDauCap} / {tr.chiTieuTuyenSinhDauCap}
                    </div>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                      Đạt 100%
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="font-mono font-bold text-indigo-700 text-xs">
                      {tr.tyLeDangKyTrucTuyenVNeID ?? 98.5}%
                    </span>
                    <div className="text-[10px] text-gray-400">Trực tuyến</div>
                  </td>
                  <td className="py-2.5 px-3 max-w-xs">
                    <div className="text-[11px] font-semibold text-gray-800 flex items-center gap-1">
                      <Clock className="size-3 text-amber-600" />
                      <span>{tr.gioCaoDiemPhanLuong || "06:45 - 07:15 & 16:45 - 17:30"}</span>
                    </div>
                    <div className="text-[10px] text-gray-500 truncate mt-0.5">
                      Lực lượng: {tr.lucLuongTrucATGT || "Dân quân tự vệ + Công an"}
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => {
                        setEditingSchoolAtgt(tr);
                        setLucLuongAtgt(tr.lucLuongTrucATGT || "");
                        setGioPhanLuong(tr.gioCaoDiemPhanLuong || "06:45 - 07:15 & 16:45 - 17:30");
                      }}
                      className="px-2.5 py-1 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs inline-flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                    >
                      <TrafficCone className="size-3 text-amber-600" />
                      <span>Điều phối ATGT</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
