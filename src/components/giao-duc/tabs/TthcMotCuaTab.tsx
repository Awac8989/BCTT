import React from "react";
import {
  FileSignature,
  Inbox,
  ShieldCheck,
  AlertCircle,
  Stamp,
  BadgeCheck,
  Clock,
  AlertOctagon,
  Timer,
  Search,
  Building,
  ExternalLink,
  CheckCheck,
  Check,
  X,
  AlertTriangle,
  Calendar,
  FileText,
  Send,
  History,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { appStore } from "@/services/app-state";
import type { HoSoTTHCGiaoDuc } from "@/data/domain-mock";
import { calculateSlaStatus } from "../utils";

interface TthcMotCuaTabProps {
  hoSoTTHCGiaoDucList: HoSoTTHCGiaoDuc[];
  filteredTTHCList: HoSoTTHCGiaoDuc[];
  searchTTHC: string;
  setSearchTTHC: (val: string) => void;
  filterThuTucTTHC: string;
  setFilterThuTucTTHC: (val: string) => void;
  filterTrangThaiTTHC: string;
  setFilterTrangThaiTTHC: (val: string) => void;
  filterSlaTTHC: "ALL" | "CON_HAN" | "SAP_TRE_HAN" | "QUA_HAN";
  setFilterSlaTTHC: (val: "ALL" | "CON_HAN" | "SAP_TRE_HAN" | "QUA_HAN") => void;
  setShowTiepNhanModal: (show: boolean) => void;
  setViewingGiayHen: (hoSo: HoSoTTHCGiaoDuc | null) => void;
  setViewingPhieuBoSung: (hoSo: HoSoTTHCGiaoDuc | null) => void;
  setInputLyDoBoSung: (val: string) => void;
  setInputHanBoSung: (val: string) => void;
  setViewingPhieuXinLoi: (hoSo: HoSoTTHCGiaoDuc | null) => void;
  setInputLyDoXinLoi: (val: string) => void;
  setInputNgayHenMoi: (val: string) => void;
  setViewingBienBanThucDia: (hoSo: HoSoTTHCGiaoDuc | null) => void;
  setInputThucDiaTruongDoan: (val: string) => void;
  setInputThucDiaYTe: (val: string) => void;
  setInputThucDiaPCCC: (val: string) => void;
  setInputThucDiaKetLuan: (val: string) => void;
  setInputThucDiaNoiDung: (val: string) => void;
  setViewingToTrinh: (hoSo: HoSoTTHCGiaoDuc | null) => void;
  setInputSoToTrinh: (val: string) => void;
  setInputNoiDungToTrinh: (val: string) => void;
  setViewingQuyetDinh: (hoSo: HoSoTTHCGiaoDuc | null) => void;
  setViewingPhieuKiemSoat: (hoSo: HoSoTTHCGiaoDuc | null) => void;
}

export const TthcMotCuaTab: React.FC<TthcMotCuaTabProps> = ({
  hoSoTTHCGiaoDucList,
  filteredTTHCList,
  searchTTHC,
  setSearchTTHC,
  filterThuTucTTHC,
  setFilterThuTucTTHC,
  filterTrangThaiTTHC,
  setFilterTrangThaiTTHC,
  filterSlaTTHC,
  setFilterSlaTTHC,
  setShowTiepNhanModal,
  setViewingGiayHen,
  setViewingPhieuBoSung,
  setInputLyDoBoSung,
  setInputHanBoSung,
  setViewingPhieuXinLoi,
  setInputLyDoXinLoi,
  setInputNgayHenMoi,
  setViewingBienBanThucDia,
  setInputThucDiaTruongDoan,
  setInputThucDiaYTe,
  setInputThucDiaPCCC,
  setInputThucDiaKetLuan,
  setInputThucDiaNoiDung,
  setViewingToTrinh,
  setInputSoToTrinh,
  setInputNoiDungToTrinh,
  setViewingQuyetDinh,
  setViewingPhieuKiemSoat,
}) => {
  return (
    <div className="space-y-4">
      {/* Header Banner & Nút Thao tác Một cửa */}
      <div className="bg-gradient-to-r from-red-50 via-amber-50 to-emerald-50 rounded-lg border border-red-200/80 p-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-extrabold uppercase tracking-wide bg-[#dd4b39] text-white">
                Bộ phận Một Cửa
              </span>
              <h2 className="text-base font-extrabold text-gray-900">
                Tiếp nhận &amp; Thụ lý Hồ sơ Thủ tục Hành chính Giáo dục cơ sở
              </h2>
            </div>
            <p className="text-xs text-gray-600 mt-1 max-w-3xl leading-relaxed">
              Quy trình thụ lý hồ sơ Một cửa điện tử liên thông theo <strong>Nghị định 61/2018/NĐ-CP</strong> và <strong>Nghị định 107/2021/NĐ-CP</strong>. 
              Thẩm quyền Chủ tịch UBND cấp xã/phường cho phép thành lập nhóm trẻ, lớp mẫu giáo độc lập tư thục theo <strong>Thông tư 49/2021/TT-BGDĐT</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTiepNhanModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[#dd4b39] hover:bg-[#c23321] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <FileSignature className="size-4" />
              <span>Tiếp nhận Hồ sơ TTHC Mới</span>
            </button>
          </div>
        </div>

        {/* Thống kê tiến độ hồ sơ 5 chỉ số */}
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5 text-xs">
          <div className="bg-white p-2.5 rounded-md border border-gray-200 shadow-2xs">
            <div className="text-gray-500 text-[11px] flex items-center justify-between">
              <span>Tổng hồ sơ tiếp nhận</span>
              <Inbox className="size-3.5 text-blue-600" />
            </div>
            <div className="text-xl font-black text-gray-900 mt-1">{hoSoTTHCGiaoDucList.length}</div>
            <div className="text-[10px] text-gray-400">100% cấp Giấy hẹn &amp; QR</div>
          </div>

          <div className="bg-white p-2.5 rounded-md border border-indigo-200 shadow-2xs">
            <div className="text-indigo-600 text-[11px] flex items-center justify-between font-semibold">
              <span>Đang thẩm định &amp; Thực địa</span>
              <ShieldCheck className="size-3.5 text-indigo-600" />
            </div>
            <div className="text-xl font-black text-indigo-700 mt-1">
              {hoSoTTHCGiaoDucList.filter((h) => h.trangThai === "DANG_THAM_DINH" || h.trangThai === "KIEM_TRA_THUC_DIA").length}
            </div>
            <div className="text-[10px] text-gray-500">Đoàn liên ngành GD - Y tế - PCCC</div>
          </div>

          <div className="bg-white p-2.5 rounded-md border border-red-200 shadow-2xs">
            <div className="text-red-600 text-[11px] flex items-center justify-between font-semibold">
              <span>Yêu cầu bổ sung (Mẫu 02)</span>
              <AlertCircle className="size-3.5 text-red-600" />
            </div>
            <div className="text-xl font-black text-red-700 mt-1">
              {hoSoTTHCGiaoDucList.filter((h) => h.trangThai === "YEU_CAU_BO_SUNG").length}
            </div>
            <div className="text-[10px] text-gray-500">Bổ sung duy nhất 1 lần</div>
          </div>

          <div className="bg-white p-2.5 rounded-md border border-purple-200 shadow-2xs">
            <div className="text-purple-700 text-[11px] flex items-center justify-between font-semibold">
              <span>Chờ Lãnh đạo ký số</span>
              <Stamp className="size-3.5 text-purple-600" />
            </div>
            <div className="text-xl font-black text-purple-700 mt-1">
              {hoSoTTHCGiaoDucList.filter((h) => h.trangThai === "CHO_PHE_DUYET").length}
            </div>
            <div className="text-[10px] text-gray-500">Đã hoàn thành Tờ trình</div>
          </div>

          <div className="bg-white p-2.5 rounded-md border border-emerald-200 shadow-2xs">
            <div className="text-emerald-700 text-[11px] flex items-center justify-between font-semibold">
              <span>Đã duyệt / Sẵn sàng trả dân</span>
              <BadgeCheck className="size-3.5 text-emerald-600" />
            </div>
            <div className="text-xl font-black text-emerald-700 mt-1">
              {hoSoTTHCGiaoDucList.filter((h) => h.trangThai === "DA_PHE_DUYET" || h.trangThai === "DA_TRA_KET_QUA").length}
            </div>
            <div className="text-[10px] text-gray-500">Đã ký số Quyết định</div>
          </div>
        </div>

        {/* Sơ đồ luân chuyển hồ sơ Một cửa (6 Bước quy chuẩn) */}
        <div className="mt-3 bg-white/80 backdrop-blur-xs p-3 rounded-md border border-gray-200">
          <div className="text-[11px] font-bold text-gray-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <Clock className="size-3 text-[#dd4b39]" />
            <span>Quy trình 6 bước Giải quyết Giấy tờ TTHC Giáo dục (Nghị định 61/2018/NĐ-CP)</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-[11px]">
            <div className="p-2 rounded bg-blue-50/80 border border-blue-200">
              <div className="font-bold text-blue-900">B1. Tiếp nhận hồ sơ</div>
              <div className="text-blue-700 text-[10px] mt-0.5">Một cửa cấp Giấy hẹn Mẫu 01 kèm QR tra cứu</div>
            </div>
            <div className="p-2 rounded bg-indigo-50/80 border border-indigo-200">
              <div className="font-bold text-indigo-900">B2. Thẩm định pháp lý</div>
              <div className="text-indigo-700 text-[10px] mt-0.5">Kiểm tra văn bằng, Đề án. Thiếu phát Mẫu 02</div>
            </div>
            <div className="p-2 rounded bg-amber-50/80 border border-amber-200">
              <div className="font-bold text-amber-900">B3. Thẩm định thực địa</div>
              <div className="text-amber-700 text-[10px] mt-0.5">Đoàn liên ngành GD - Y tế - PCCC lập Biên bản</div>
            </div>
            <div className="p-2 rounded bg-sky-50/80 border border-sky-200">
              <div className="font-bold text-sky-900">B4. Lập Tờ trình</div>
              <div className="text-sky-700 text-[10px] mt-0.5">Công chức chuyên môn trình Chủ tịch UBND</div>
            </div>
            <div className="p-2 rounded bg-purple-50/80 border border-purple-200">
              <div className="font-bold text-purple-900">B5. Ký số điện tử</div>
              <div className="text-purple-700 text-[10px] mt-0.5">Chủ tịch UBND Phường ký số SmartCA Quyết định</div>
            </div>
            <div className="p-2 rounded bg-emerald-50/80 border border-emerald-200">
              <div className="font-bold text-emerald-900">B6. Trả kết quả</div>
              <div className="text-emerald-700 text-[10px] mt-0.5">Trả QĐ &amp; Cấp phép, lập Phiếu Mẫu 05</div>
            </div>
          </div>
        </div>
      </div>

      {/* Cảnh báo Kỷ cương Công vụ Một cửa nếu có hồ sơ trễ hạn (Nghị định 61/2018/NĐ-CP) */}
      {hoSoTTHCGiaoDucList.some((h) => calculateSlaStatus(h.ngayHenTra, h.trangThai).status === "QUA_HAN") && (
        <div className="bg-red-50 border-l-4 border-red-600 p-3.5 rounded-r-md shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <AlertOctagon className="size-5 text-red-600 shrink-0 mt-0.5 animate-bounce" />
            <div>
              <h4 className="text-xs font-bold text-red-900 uppercase">
                Cảnh báo Kỷ cương Công vụ Một cửa (Nghị định 61/2018/NĐ-CP &amp; Nghị định 107/2021/NĐ-CP)
              </h4>
              <p className="text-xs text-red-700 mt-0.5 leading-relaxed">
                Hiện có hồ sơ đã <strong>quá hạn hẹn trả kết quả</strong>. Cán bộ Một cửa và Cán bộ chuyên môn thụ lý có trách nhiệm lập ngay <strong>Phiếu xin lỗi và hẹn lại ngày trả kết quả (Mẫu số 04)</strong> trình Lãnh đạo UBND Phường ký số phát hành cho công dân.
              </p>
            </div>
          </div>
          <button
            onClick={() => setFilterSlaTTHC("QUA_HAN")}
            className="shrink-0 px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors"
          >
            <Timer className="size-3.5" />
            <span>Lọc hồ sơ Quá hạn</span>
          </button>
        </div>
      )}

      {/* Bộ lọc & Tìm kiếm Hồ sơ TTHC */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="size-3.5 absolute left-2.5 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo mã hồ sơ, tên cơ sở, người nộp, CCCD, SĐT..."
              value={searchTTHC}
              onChange={(e) => setSearchTTHC(e.target.value)}
              className="w-full rounded-md border border-gray-300 pl-8 pr-3 py-1.5 text-xs outline-none focus:border-[#dd4b39] focus:ring-1 focus:ring-[#dd4b39]/20"
            />
          </div>

          <select
            value={filterThuTucTTHC}
            onChange={(e) => setFilterThuTucTTHC(e.target.value)}
            className="rounded-md border border-gray-300 px-2.5 py-1.5 text-xs outline-none bg-white font-medium"
          >
            <option value="ALL">Tất cả thủ tục hành chính</option>
            <option value="TTHC-GD-BGD/01">Thành lập nhóm trẻ độc lập tư thục</option>
            <option value="TTHC-GD-BGD/02">Thành lập lớp mẫu giáo độc lập</option>
            <option value="TTHC-GD-BGD/03">Chuyển địa điểm &amp; quy mô cơ sở</option>
            <option value="TTHC-GD-BGD/04">Hỗ trợ tiền ăn trưa &amp; chi phí học tập</option>
          </select>

          <select
            value={filterTrangThaiTTHC}
            onChange={(e) => setFilterTrangThaiTTHC(e.target.value)}
            className="rounded-md border border-gray-300 px-2.5 py-1.5 text-xs outline-none bg-white font-medium"
          >
            <option value="ALL">Tất cả trạng thái hồ sơ</option>
            <option value="MOI_TIEP_NHAN">Mới tiếp nhận (B1)</option>
            <option value="DANG_THAM_DINH">Đang thẩm định hồ sơ (B2)</option>
            <option value="YEU_CAU_BO_SUNG">Yêu cầu bổ sung - Mẫu 02 (B2)</option>
            <option value="KIEM_TRA_THUC_DIA">Kiểm tra thực địa liên ngành (B3)</option>
            <option value="CHO_PHE_DUYET">Chờ Lãnh đạo ký số (B4/B5)</option>
            <option value="DA_PHE_DUYET">Đã ký số Quyết định (B5)</option>
            <option value="DA_TRA_KET_QUA">Đã trả kết quả cho dân (B6)</option>
          </select>

          <select
            value={filterSlaTTHC}
            onChange={(e) => setFilterSlaTTHC(e.target.value as any)}
            className="rounded-md border border-gray-300 px-2.5 py-1.5 text-xs outline-none bg-white font-semibold text-gray-800"
          >
            <option value="ALL">Tất cả tiến độ hạn (SLA)</option>
            <option value="CON_HAN">Đang còn hạn</option>
            <option value="SAP_TRE_HAN">⚠️ Sắp đến hạn (≤ 3 ngày)</option>
            <option value="QUA_HAN">🚨 Quá hạn hẹn trả (Cần lập Mẫu 04)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-[11px]">
            Tìm thấy <strong>{filteredTTHCList.length}</strong> / {hoSoTTHCGiaoDucList.length} hồ sơ
          </span>
          {(searchTTHC || filterThuTucTTHC !== "ALL" || filterTrangThaiTTHC !== "ALL" || filterSlaTTHC !== "ALL") && (
            <button
              onClick={() => {
                setSearchTTHC("");
                setFilterThuTucTTHC("ALL");
                setFilterTrangThaiTTHC("ALL");
                setFilterSlaTTHC("ALL");
              }}
              className="px-2 py-1 text-[11px] rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold cursor-pointer"
            >
              Xóa lọc
            </button>
          )}
        </div>
      </div>

      {/* Danh sách Hồ sơ TTHC Giáo dục */}
      <div className="space-y-3">
        {filteredTTHCList.map((hoSo) => {
          const countNop = hoSo.thanhPhanHoSo.filter((t) => t.daNop).length;
          const totalGiayTo = hoSo.thanhPhanHoSo.length;
          const isDuGiayTo = countNop === totalGiayTo;

          return (
            <div
              key={hoSo.id}
              className="bg-white rounded-lg border border-gray-200 p-4 shadow-xs hover:border-[#dd4b39]/50 transition-colors space-y-3"
            >
              {/* Top: Mã hồ sơ + Tên TTHC + Status Badge */}
              <div className="flex flex-wrap items-start justify-between gap-2 border-b border-gray-100 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-black text-sm px-2.5 py-0.5 rounded bg-gray-100 text-gray-800 border border-gray-300">
                      {hoSo.maHoSo}
                    </span>

                    {hoSo.hinhThucNop === "TRUC_TIEP_MOT_CUA" ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                        <Building className="size-3" />
                        Một cửa trực tiếp
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                        <ExternalLink className="size-3" />
                        Cổng DVC Quốc gia
                      </span>
                    )}

                    {/* Status Badges */}
                    {hoSo.trangThai === "MOI_TIEP_NHAN" && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
                        1. Mới tiếp nhận
                      </span>
                    )}
                    {hoSo.trangThai === "DANG_THAM_DINH" && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-300">
                        2. Đang thẩm định hồ sơ
                      </span>
                    )}
                    {hoSo.trangThai === "YEU_CAU_BO_SUNG" && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-800 border border-red-300 flex items-center gap-1">
                        <AlertCircle className="size-3 text-red-600" />
                        2. Yêu cầu bổ sung hồ sơ (Mẫu 02)
                      </span>
                    )}
                    {hoSo.trangThai === "KIEM_TRA_THUC_DIA" && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                        <ShieldCheck className="size-3 text-amber-700" />
                        3. Kiểm tra thực địa liên ngành
                      </span>
                    )}
                    {hoSo.trangThai === "CHO_PHE_DUYET" && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-900 border border-purple-300 flex items-center gap-1">
                        <Stamp className="size-3 text-purple-700" />
                        4. Đã có Tờ trình · Chờ ký số
                      </span>
                    )}
                    {hoSo.trangThai === "DA_PHE_DUYET" && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                        <BadgeCheck className="size-3.5 text-emerald-700" />
                        5. Đã ký số Quyết định · Chờ trả dân
                      </span>
                    )}
                    {hoSo.trangThai === "DA_TRA_KET_QUA" && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gray-100 text-gray-800 border border-gray-300 flex items-center gap-1">
                        <CheckCheck className="size-3.5 text-gray-600" />
                        6. Đã hoàn tất trả kết quả
                      </span>
                    )}
                  </div>

                  <h3 className="font-extrabold text-sm text-gray-900">{hoSo.tenThuTuc}</h3>
                </div>

                <div className="flex flex-col items-end gap-1 text-right">
                  {(() => {
                    const sla = calculateSlaStatus(hoSo.ngayHenTra, hoSo.trangThai);
                    return (
                      <>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] border ${sla.badgeClass}`}>
                          <span className={`size-1.5 rounded-full ${sla.dotClass}`} />
                          <span>{sla.label}</span>
                        </span>
                        <div className="text-gray-600 text-xs">
                          Hẹn trả: <strong className="font-mono text-gray-900">{hoSo.ngayHenTra}</strong>
                        </div>
                        <div className="text-[10px] text-gray-400">
                          Tiếp nhận: {hoSo.ngayTiepNhan}
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Body 2 columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Cột 1: Thông tin công dân & Cơ sở */}
                <div className="space-y-1.5 bg-gray-50/70 p-3 rounded-md border border-gray-200">
                  <div>
                    <span className="text-gray-500">Người nộp hồ sơ:</span>{" "}
                    <strong className="text-gray-900 uppercase">{hoSo.nguoiNop}</strong>
                    <span className="ml-2 font-mono text-gray-600">({hoSo.soDienThoai})</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Số CCCD / VNeID:</span>{" "}
                    <strong className="font-mono text-gray-800">{hoSo.cccd}</strong>
                    <span className="ml-2 text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-bold">
                      Đã đối soát CSDL Dân cư
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Cơ sở đề nghị:</span>{" "}
                    <strong className="text-emerald-800">{hoSo.tenCoSoDeNghi}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500">Địa chỉ hoạt động:</span>{" "}
                    <span className="text-gray-700">{hoSo.diaDiemCoSo}</span>
                  </div>
                  <div className="text-[11px] text-gray-500 pt-1 border-t border-gray-200/60 flex items-center justify-between">
                    <span>Cán bộ Một cửa: <strong>{hoSo.canBoTiepNhan}</strong></span>
                    <span>Thụ lý: <strong>{hoSo.canBoThuLy}</strong></span>
                  </div>
                </div>

                {/* Cột 2: Tiến độ giấy tờ & Tờ trình/Quyết định */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-700">Thành phần hồ sơ tiếp nhận:</span>
                    <span
                      className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                        isDuGiayTo ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {countNop}/{totalGiayTo} giấy tờ hợp lệ
                    </span>
                  </div>

                  {/* Document tags */}
                  <div className="flex flex-wrap gap-1 text-[10px]">
                    {hoSo.thanhPhanHoSo.map((gt) => (
                      <span
                        key={gt.id}
                        className={`px-1.5 py-0.5 rounded border flex items-center gap-1 ${
                          gt.daNop
                            ? "bg-white text-gray-700 border-gray-200"
                            : "bg-red-50 text-red-700 border-red-200 font-bold"
                        }`}
                        title={gt.ghiChu || gt.tenGiayTo}
                      >
                        {gt.daNop ? (
                          <Check className="size-2.5 text-emerald-600" />
                        ) : (
                          <X className="size-2.5 text-red-600" />
                        )}
                        <span className="max-w-[170px] truncate">{gt.tenGiayTo}</span>
                      </span>
                    ))}
                  </div>

                  {/* Khối cảnh báo yêu cầu bổ sung nếu có */}
                  {hoSo.trangThai === "YEU_CAU_BO_SUNG" && hoSo.lyDoBoSung && (
                    <div className="p-2 rounded-md bg-red-50 border border-red-200 text-red-800 text-[11px]">
                      <div className="font-bold flex items-center gap-1">
                        <AlertTriangle className="size-3 text-red-600" />
                        Nội dung yêu cầu bổ sung (Mẫu số 02):
                      </div>
                      <div className="mt-0.5">{hoSo.lyDoBoSung}</div>
                      {hoSo.hanBoSung && (
                        <div className="mt-1 text-[10px] text-red-700 font-semibold">
                          Hạn công dân nộp lại: {hoSo.hanBoSung}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Khối hiển thị Phiếu xin lỗi nếu có (Mẫu 04) */}
                  {hoSo.phieuXinLoi && (
                    <div className="p-2.5 rounded-md bg-amber-50 border border-amber-300 text-amber-900 text-[11px] space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="font-bold flex items-center gap-1 text-amber-800">
                          <AlertOctagon className="size-3.5 text-amber-700" />
                          <span>Phiếu xin lỗi &amp; Hẹn lại ngày trả ({hoSo.phieuXinLoi.soPhieu}):</span>
                        </div>
                        <button
                          onClick={() => {
                            setViewingPhieuXinLoi(hoSo);
                            setInputLyDoXinLoi(hoSo.phieuXinLoi?.lyDo || "");
                            setInputNgayHenMoi(hoSo.phieuXinLoi?.ngayHenMoi || "");
                          }}
                          className="px-2 py-0.5 rounded bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] cursor-pointer"
                        >
                          Xem Mẫu 04
                        </button>
                      </div>
                      <div className="text-gray-700">Lý do chậm: <em>{hoSo.phieuXinLoi.lyDo}</em></div>
                      <div className="text-amber-800 font-semibold flex items-center gap-1">
                        <Calendar className="size-3 text-red-600" />
                        <span>Hẹn trả lại mới:</span>
                        <span className="font-mono font-bold text-red-700">{hoSo.phieuXinLoi.ngayHenMoi}</span>
                        <span className="text-[10px] text-gray-500">({hoSo.phieuXinLoi.nguoiKy})</span>
                      </div>
                    </div>
                  )}

                  {/* Khối hiển thị Biên bản thực địa nếu có */}
                  {hoSo.ketQuaThucDia && (
                    <div className="p-2 rounded-md bg-emerald-50/80 border border-emerald-200 text-emerald-900 text-[11px]">
                      <div className="font-bold flex items-center gap-1">
                        <CheckCircle2 className="size-3 text-emerald-600" />
                        Biên bản kiểm tra liên ngành số {hoSo.ketQuaThucDia.bienBanSo} ({hoSo.ketQuaThucDia.ngayKiemTra}):
                      </div>
                      <div className="mt-0.5 line-clamp-2 text-[10px] text-emerald-800">
                        {hoSo.ketQuaThucDia.noiDungKiemTra}
                      </div>
                    </div>
                  )}

                  {/* Khối hiển thị Quyết định đã ký số */}
                  {hoSo.quyetDinh && hoSo.quyetDinh.daKySo && (
                    <div className="p-2 rounded-md bg-amber-50/80 border border-amber-200 text-amber-900 text-[11px] flex items-center justify-between">
                      <div>
                        <span className="font-bold text-[#b91c1c]">Quyết định số: {hoSo.quyetDinh.soQuyetDinh}</span>
                        <div className="text-[10px] text-gray-600 font-mono mt-0.5">
                          Ký bởi: {hoSo.quyetDinh.nguoiKy} · Mã CA: {hoSo.quyetDinh.maXacThucKySo}
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold text-[10px]">
                        ĐÃ KÝ SỐ
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Bar (Thanh nút nghiệp vụ hành chính giấy tờ) */}
              <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  {/* Nút Giấy hẹn Một cửa */}
                  <button
                    onClick={() => setViewingGiayHen(hoSo)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold transition-colors cursor-pointer"
                    title="Xem và In Giấy tiếp nhận hồ sơ và Hẹn trả kết quả theo Nghị định 61/2018/NĐ-CP"
                  >
                    <FileText className="size-3.5 text-blue-600" />
                    <span>Giấy hẹn (Mẫu 01)</span>
                  </button>

                  {/* Nút Phiếu yêu cầu bổ sung */}
                  <button
                    onClick={() => {
                      setViewingPhieuBoSung(hoSo);
                      setInputLyDoBoSung(hoSo.lyDoBoSung || "");
                      setInputHanBoSung(hoSo.hanBoSung || "");
                    }}
                    className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border font-bold transition-colors cursor-pointer ${
                      hoSo.trangThai === "YEU_CAU_BO_SUNG"
                        ? "bg-red-100 border-red-300 text-red-800"
                        : "border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-700"
                    }`}
                    title="Xem/Lập Phiếu yêu cầu bổ sung, hoàn thiện hồ sơ theo Thông tư 01/2018/TT-VPCP"
                  >
                    <AlertCircle className="size-3.5 text-red-600" />
                    <span>Phiếu bổ sung (Mẫu 02)</span>
                  </button>

                  {/* Nút Phiếu xin lỗi Mẫu 04 nếu hồ sơ Quá hạn hoặc đã lập */}
                  {(() => {
                    const sla = calculateSlaStatus(hoSo.ngayHenTra, hoSo.trangThai);
                    if (hoSo.phieuXinLoi) {
                      return (
                        <button
                          onClick={() => {
                            setViewingPhieuXinLoi(hoSo);
                            setInputLyDoXinLoi(hoSo.phieuXinLoi?.lyDo || "");
                            setInputNgayHenMoi(hoSo.phieuXinLoi?.ngayHenMoi || "");
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold transition-colors cursor-pointer"
                          title="Xem Phiếu xin lỗi và hẹn lại ngày trả kết quả (Mẫu số 04 theo Nghị định 61/2018/NĐ-CP)"
                        >
                          <AlertOctagon className="size-3.5 text-amber-700" />
                          <span>Phiếu xin lỗi (Mẫu 04)</span>
                        </button>
                      );
                    }
                    if (sla.status === "QUA_HAN") {
                      return (
                        <button
                          onClick={() => {
                            setViewingPhieuXinLoi(hoSo);
                            setInputLyDoXinLoi("Do quy trình kiểm tra thực địa liên ngành và đối soát hồ sơ phòng cháy chữa cháy cần thêm thời gian xác minh thực tế");
                            const d = new Date();
                            d.setDate(d.getDate() + 5);
                            setInputNgayHenMoi(d.toLocaleDateString("vi-VN"));
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-red-500 bg-red-600 hover:bg-red-700 text-white font-extrabold shadow-xs transition-colors cursor-pointer animate-pulse"
                          title="Hồ sơ đã quá hạn! Bắt buộc phát hành Phiếu xin lỗi và hẹn lại ngày trả kết quả theo NĐ 61/2018/NĐ-CP"
                        >
                          <AlertOctagon className="size-3.5 text-white" />
                          <span>Lập Phiếu xin lỗi (Mẫu 04)</span>
                        </button>
                      );
                    }
                    return null;
                  })()}

                  {/* Nút Biên bản thực địa */}
                  <button
                    onClick={() => {
                      setViewingBienBanThucDia(hoSo);
                      if (hoSo.ketQuaThucDia) {
                        setInputThucDiaTruongDoan(hoSo.ketQuaThucDia.truongDoan);
                        setInputThucDiaYTe(hoSo.ketQuaThucDia.daiDienYTe);
                        setInputThucDiaPCCC(hoSo.ketQuaThucDia.daiDienCongAnPCCC);
                        setInputThucDiaKetLuan(hoSo.ketQuaThucDia.ketLuan);
                        setInputThucDiaNoiDung(hoSo.ketQuaThucDia.noiDungKiemTra);
                      }
                    }}
                    className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border font-bold transition-colors cursor-pointer ${
                      hoSo.ketQuaThucDia
                        ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                        : "border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-700"
                    }`}
                    title="Xem/Ghi Biên bản kiểm tra thẩm định thực tế liên ngành (GD-Y tế-PCCC)"
                  >
                    <ShieldCheck className="size-3.5 text-emerald-600" />
                    <span>Biên bản thực địa</span>
                  </button>

                  {/* Nút Tờ trình UBND */}
                  <button
                    onClick={() => {
                      setViewingToTrinh(hoSo);
                      if (hoSo.toTrinh) {
                        setInputSoToTrinh(hoSo.toTrinh.soToTrinh);
                        setInputNoiDungToTrinh(hoSo.toTrinh.noiDungTrinh);
                      }
                    }}
                    className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border font-bold transition-colors cursor-pointer ${
                      hoSo.toTrinh
                        ? "bg-sky-50 border-sky-300 text-sky-800"
                        : "border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-700"
                    }`}
                    title="Xem/Soạn Tờ trình của công chức trình Lãnh đạo UBND Phường"
                  >
                    <Send className="size-3.5 text-sky-600" />
                    <span>Tờ trình UBND</span>
                  </button>

                  {/* Nút Quyết định Ký số */}
                  <button
                    onClick={() => setViewingQuyetDinh(hoSo)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border font-bold transition-colors cursor-pointer ${
                      hoSo.quyetDinh?.daKySo
                        ? "bg-amber-50 border-amber-300 text-amber-900"
                        : hoSo.trangThai === "CHO_PHE_DUYET"
                        ? "bg-purple-100 border-purple-300 text-purple-900 animate-pulse"
                        : "border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-700"
                    }`}
                    title="Xem và Ký số điện tử Quyết định cho phép thành lập"
                  >
                    <Stamp className="size-3.5 text-[#dd4b39]" />
                    <span>
                      {hoSo.quyetDinh?.daKySo ? "Xem QĐ đã Ký số" : "Ký số Quyết định"}
                    </span>
                  </button>

                  {/* Nút Phiếu kiểm soát */}
                  <button
                    onClick={() => setViewingPhieuKiemSoat(hoSo)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-600 font-semibold transition-colors cursor-pointer"
                    title="Xem Phiếu kiểm soát quá trình giải quyết hồ sơ (Mẫu số 05/NĐ-61)"
                  >
                    <History className="size-3.5 text-gray-500" />
                    <span>Kiểm soát (Mẫu 05)</span>
                  </button>
                </div>

                {/* Quick Step Switcher */}
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-[11px] text-gray-400">Chuyển bước:</span>
                  {hoSo.trangThai === "MOI_TIEP_NHAN" && (
                    <button
                      onClick={() => {
                        appStore.updateHoSoTTHCGiaoDucStatus(hoSo.id, "DANG_THAM_DINH");
                        toast.success("Đã chuyển hồ sơ sang bước: Thẩm định chuyên môn!");
                      }}
                      className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[11px] font-bold cursor-pointer transition-colors"
                    >
                      → Thẩm định
                    </button>
                  )}
                  {hoSo.trangThai === "DANG_THAM_DINH" && (
                    <button
                      onClick={() => {
                        appStore.updateHoSoTTHCGiaoDucStatus(hoSo.id, "KIEM_TRA_THUC_DIA");
                        toast.success("Đã xếp lịch kiểm tra thực tế liên ngành!");
                      }}
                      className="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[11px] font-bold cursor-pointer transition-colors"
                    >
                      → Kiểm tra thực địa
                    </button>
                  )}
                  {hoSo.trangThai === "KIEM_TRA_THUC_DIA" && (
                    <button
                      onClick={() => {
                        setViewingToTrinh(hoSo);
                      }}
                      className="px-2 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded text-[11px] font-bold cursor-pointer transition-colors"
                    >
                      → Lập Tờ trình
                    </button>
                  )}
                  {hoSo.trangThai === "CHO_PHE_DUYET" && (
                    <button
                      onClick={() => {
                        setViewingQuyetDinh(hoSo);
                      }}
                      className="px-2 py-1 bg-[#dd4b39] hover:bg-[#c23321] text-white rounded text-[11px] font-bold cursor-pointer transition-colors"
                    >
                      → Ký số ngay
                    </button>
                  )}
                  {hoSo.trangThai === "DA_PHE_DUYET" && (
                    <button
                      onClick={() => {
                        appStore.updateHoSoTTHCGiaoDucStatus(hoSo.id, "DA_TRA_KET_QUA");
                        toast.success("Đã xác nhận trả kết quả cho công dân thành công!");
                      }}
                      className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold cursor-pointer transition-colors"
                    >
                      ✓ Trả kết quả
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredTTHCList.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500 text-xs">
            <FileText className="size-8 mx-auto text-gray-400 mb-2" />
            <div className="font-bold text-sm text-gray-700">Không tìm thấy hồ sơ TTHC nào</div>
            <div className="mt-1">Thử thay đổi từ khóa tìm kiếm hoặc bấm &quot;Tiếp nhận Hồ sơ TTHC Mới&quot;.</div>
          </div>
        )}
      </div>
    </div>
  );
};
