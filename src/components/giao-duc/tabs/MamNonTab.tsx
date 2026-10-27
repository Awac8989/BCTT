import React from "react";
import {
  Baby,
  Search,
  FileSpreadsheet,
  Camera,
  Utensils,
  Eye,
  FileCheck,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";
import type { CoSoMamNon } from "@/data/domain-mock";

interface MamNonTabProps {
  filteredMamNonList: CoSoMamNon[];
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  filterLoaiHinh: string;
  setFilterLoaiHinh: (val: string) => void;
  filterKetQua: string;
  setFilterKetQua: (val: string) => void;
  setShowBaoCaoQuanLyMamNonModal: (show: boolean) => void;
  setViewingMn: (mn: CoSoMamNon | null) => void;
  setInspectingMn: (mn: CoSoMamNon | null) => void;
  setInspectResult: (val: any) => void;
  setInspectNotes: (val: string) => void;
  setViewingDinhChiMn: (mn: CoSoMamNon | null) => void;
  setInputLyDoDinhChi: (val: string) => void;
  setViewingPhucHoiMn: (mn: CoSoMamNon | null) => void;
  setInputNoiDungPhucHoi: (val: string) => void;
}

export const MamNonTab: React.FC<MamNonTabProps> = ({
  filteredMamNonList,
  searchTerm,
  setSearchTerm,
  filterLoaiHinh,
  setFilterLoaiHinh,
  filterKetQua,
  setFilterKetQua,
  setShowBaoCaoQuanLyMamNonModal,
  setViewingMn,
  setInspectingMn,
  setInspectResult,
  setInspectNotes,
  setViewingDinhChiMn,
  setInputLyDoDinhChi,
  setViewingPhucHoiMn,
  setInputNoiDungPhucHoi,
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <Baby className="size-4.5 text-[#dd4b39]" />
              <h3 className="text-sm font-bold text-gray-900">
                Sổ Quản lý Nhóm trẻ, Lớp Mẫu giáo &amp; Lớp Mầm non Độc lập Tư thục
              </h3>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Căn cứ Luật Giáo dục 2019, Nghị định 46/2017/NĐ-CP và Thông tư 49/2021/TT-BGDĐT của Bộ GD&amp;ĐT
            </p>
          </div>

          {/* Bộ lọc và tìm kiếm */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="relative">
              <Search className="size-3.5 absolute left-2.5 top-2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm tên cơ sở, chủ cơ sở, khu phố..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-md border border-gray-300 text-xs w-56 outline-none focus:border-[#dd4b39] focus:ring-1 focus:ring-[#dd4b39]/20 transition-all"
              />
            </div>

            <select
              value={filterLoaiHinh}
              onChange={(e) => setFilterLoaiHinh(e.target.value)}
              className="rounded-md border border-gray-300 py-1.5 px-2.5 text-xs text-gray-700 outline-none bg-white font-medium"
            >
              <option value="ALL">Tất cả loại hình</option>
              <option value="NHOM_TRE_DOC_LAP">Nhóm trẻ độc lập (&lt; 36 tháng)</option>
              <option value="LOP_MAU_GIAO_DOC_LAP">Lớp mẫu giáo độc lập (3 - 5 tuổi)</option>
              <option value="TRUONG_MAM_NON_TU_THUC">Trường mầm non tư thục</option>
            </select>

            <select
              value={filterKetQua}
              onChange={(e) => setFilterKetQua(e.target.value)}
              className="rounded-md border border-gray-300 py-1.5 px-2.5 text-xs text-gray-700 outline-none bg-white font-medium"
            >
              <option value="ALL">Tất cả tình trạng an toàn</option>
              <option value="DAT_CHUAN_AN_TOAN">Đạt chuẩn an toàn</option>
              <option value="NHAC_NHO_KHAC_PHUC">Nhắc nhở khắc phục</option>
              <option value="TAM_DINH_CHI">Tạm đình chỉ</option>
            </select>

            <button
              onClick={() => setShowBaoCaoQuanLyMamNonModal(true)}
              className="px-3 py-1.5 rounded-md bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              title="Xem Báo cáo Tổng hợp Quản lý Giáo dục Mầm non Ngoài Công lập gửi Phòng GD&ĐT TP (Báo cáo số 32/BC-UBND)"
            >
              <FileSpreadsheet className="size-3.5" />
              <span>Báo cáo Quản lý gửi Phòng GD&amp;ĐT (BC-32)</span>
            </button>
          </div>
        </div>

        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-gray-600 border-b border-gray-200 font-bold">
                <th className="py-2.5 px-3">Tên cơ sở mầm non</th>
                <th className="py-2.5 px-3">Chủ cơ sở &amp; Phụ trách CM</th>
                <th className="py-2.5 px-3">Địa chỉ &amp; Khu phố</th>
                <th className="py-2.5 px-3 text-center">Quy mô nuôi giữ</th>
                <th className="py-2.5 px-3 text-center">Định mức m²/trẻ</th>
                <th className="py-2.5 px-3 text-center">Tiêu chuẩn an toàn</th>
                <th className="py-2.5 px-3">Kiểm tra liên ngành gần nhất</th>
                <th className="py-2.5 px-3 text-right">Thao tác nghiệp vụ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredMamNonList.map((mn) => {
                const m2PerChild = (mn.dienTichPhongHocM2 / (mn.soTreDangGiu || 1)).toFixed(1);
                const childPerTeacher = (mn.soTreDangGiu / (mn.soGiaoVienBaoMau || 1)).toFixed(1);

                return (
                  <tr key={mn.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-gray-900">{mn.tenCoSo}</div>
                      <div className="text-[10px] text-gray-500 font-mono mt-0.5">
                        Mã: <span className="font-semibold text-gray-700">{mn.maCoSo}</span> · QĐ:{" "}
                        <span className="text-[#dd4b39] font-bold">{mn.soQuyetDinhCapPhep}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-gray-800">
                      <div className="font-semibold">{mn.chuCoSo}</div>
                      <div className="text-[10px] text-gray-500 truncate max-w-[180px]">
                        CM: {mn.nguoiPhuTrachChuyenMon}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-gray-700">
                      <div>{mn.diaChi}</div>
                      <div className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                        <span className="font-bold text-gray-600">{mn.khuPho}</span>
                        <span>· SĐT: {mn.soDienThoai}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="font-bold text-gray-900">{mn.soTreDangGiu} trẻ</span>
                      <div className="text-[10px] text-gray-500">
                        {mn.soGiaoVienBaoMau} GV (~{childPerTeacher} trẻ/GV)
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="font-mono font-bold text-gray-800">{mn.dienTichPhongHocM2} m²</span>
                      <div className="text-[10px] text-emerald-700 font-medium">({m2PerChild} m²/trẻ)</div>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <div className="inline-flex flex-col gap-1 text-[10px]">
                        <span
                          className={`px-1.5 py-0.5 rounded font-bold inline-flex items-center gap-1 justify-center ${
                            mn.coCameraGiamSat
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : "bg-red-50 text-red-800 border border-red-200"
                          }`}
                        >
                          <Camera className="size-2.5" />
                          {mn.coCameraGiamSat ? "Camera Online" : "Chưa có Camera"}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded font-bold inline-flex items-center gap-1 justify-center ${
                            mn.bepAnMotChieu
                              ? "bg-sky-50 text-sky-800 border border-sky-200"
                              : "bg-amber-50 text-amber-800 border border-amber-200"
                          }`}
                        >
                          <Utensils className="size-2.5" />
                          {mn.bepAnMotChieu ? "Bếp 1 chiều" : "Cần sửa bếp"}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 max-w-xs">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-bold border ${
                            mn.ketQuaKiemTraCuoi === "DAT_CHUAN_AN_TOAN"
                              ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                              : mn.ketQuaKiemTraCuoi === "NHAC_NHO_KHAC_PHUC"
                              ? "bg-amber-100 text-amber-800 border-amber-300"
                              : "bg-red-100 text-red-800 border-red-300"
                          }`}
                        >
                          {mn.ketQuaKiemTraCuoi === "DAT_CHUAN_AN_TOAN"
                            ? "Đạt chuẩn an toàn"
                            : mn.ketQuaKiemTraCuoi === "NHAC_NHO_KHAC_PHUC"
                            ? "Nhắc nhở khắc phục"
                            : "Tạm đình chỉ"}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">{mn.ngayKiemTraCuoi}</span>
                      </div>
                      <div className="text-[11px] text-gray-600 line-clamp-2 mt-1">{mn.noiDungKiemTra}</div>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5 flex-wrap">
                        <button
                          onClick={() => setViewingMn(mn)}
                          className="px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs inline-flex items-center gap-1 transition-colors cursor-pointer"
                          title="Xem hồ sơ pháp lý & In quyết định thành lập"
                        >
                          <Eye className="size-3 text-gray-600" />
                          <span>Hồ sơ &amp; QĐ</span>
                        </button>

                        <button
                          onClick={() => {
                            setInspectingMn(mn);
                            setInspectResult(mn.ketQuaKiemTraCuoi);
                            setInspectNotes(mn.noiDungKiemTra);
                          }}
                          className="px-2 py-1 rounded-md bg-[#0073b7] hover:bg-[#005f96] text-white font-bold text-xs inline-flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                          title="Lập biên bản kiểm tra liên ngành an toàn mầm non"
                        >
                          <FileCheck className="size-3" />
                          <span>Ghi biên bản</span>
                        </button>

                        {mn.ketQuaKiemTraCuoi === "TAM_DINH_CHI" ? (
                          <>
                            <button
                              onClick={() => setViewingDinhChiMn(mn)}
                              className="px-2 py-1 rounded-md bg-red-100 hover:bg-red-200 text-red-800 font-bold text-xs inline-flex items-center gap-1 border border-red-300 transition-colors cursor-pointer"
                              title="Xem Quyết định Tạm đình chỉ hoạt động giáo dục (Điều 11 Thông tư 49/2021)"
                            >
                              <ShieldAlert className="size-3 text-red-600" />
                              <span>QĐ Đình chỉ</span>
                            </button>
                            <button
                              onClick={() => {
                                setViewingPhucHoiMn(mn);
                                setInputNoiDungPhucHoi(
                                  "Đã hoàn thành lắp đặt cửa thoát nạn thứ 2 chịu nhiệt, bổ sung đủ bình MFZ4 và phân chia vách nhôm kính khu vực bếp nấu. Đoàn liên ngành kiểm tra nghiệm thu đạt chuẩn an toàn."
                                );
                              }}
                              className="px-2 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                              title="Nghiệm thu khắc phục & Cho phép hoạt động trở lại"
                            >
                              <CheckCircle2 className="size-3" />
                              <span>Phục hồi</span>
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => {
                              setViewingDinhChiMn(mn);
                              setInputLyDoDinhChi(
                                mn.noiDungKiemTra.includes("khắc phục") || mn.noiDungKiemTra.includes("vi phạm")
                                  ? mn.noiDungKiemTra
                                  : "Vi phạm nghiêm trọng về an toàn phòng cháy chữa cháy và vệ sinh an toàn thực phẩm"
                              );
                            }}
                            className="px-2 py-1 rounded-md bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-700 font-semibold text-xs inline-flex items-center gap-1 border border-gray-200 hover:border-red-300 transition-colors cursor-pointer"
                            title="Ban hành Quyết định Tạm đình chỉ khi cơ sở có vi phạm nghiêm trọng (Điều 11 Thông tư 49/2021)"
                          >
                            <ShieldAlert className="size-3 text-amber-600" />
                            <span>Tạm đình chỉ</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
