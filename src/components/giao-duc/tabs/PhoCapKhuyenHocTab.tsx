import React from "react";
import { BookOpen, FileText, Award, Heart, Plus, Users } from "lucide-react";
import type {
  ChiTieuPhoCapGiaoDuc,
  MoHinhHocTap,
  HoatDongKhuyenHoc,
  LopHocCongDong,
} from "@/data/domain-mock";

interface PhoCapKhuyenHocTabProps {
  phoCapList: ChiTieuPhoCapGiaoDuc[];
  moHinhHocTapList: MoHinhHocTap[];
  khuyenHocList: HoatDongKhuyenHoc[];
  lopHocHTCDList: LopHocCongDong[];
  setShowBaoCaoPhoCapModal: (show: boolean) => void;
  setShowCongNhanHocTapModal: (show: boolean) => void;
  setShowTraoHocBongModal: (show: boolean) => void;
  setShowAddLopHocModal: (show: boolean) => void;
}

export const PhoCapKhuyenHocTab: React.FC<PhoCapKhuyenHocTabProps> = ({
  phoCapList,
  moHinhHocTapList,
  khuyenHocList,
  lopHocHTCDList,
  setShowBaoCaoPhoCapModal,
  setShowCongNhanHocTapModal,
  setShowTraoHocBongModal,
  setShowAddLopHocModal,
}) => {
  return (
    <div className="space-y-4">
      {/* Phổ cập giáo dục */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="size-4.5 text-purple-600" />
              <h3 className="text-sm font-bold text-gray-900">
                Chỉ số Phổ cập Giáo dục &amp; Xóa mù chữ Phường Phú Cường năm 2026
              </h3>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Theo Nghị định 20/2014/NĐ-CP và Thông tư 07/2016/TT-BGDĐT của Bộ GD&amp;ĐT
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowBaoCaoPhoCapModal(true)}
              className="px-3 py-1.5 rounded-md bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <FileText className="size-3.5" />
              <span>Xem Báo cáo Tự kiểm tra PCGD-XMC 2026</span>
            </button>
          </div>
        </div>

        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-gray-600 border-b border-gray-200 font-bold">
                <th className="py-2.5 px-3">Cấp học phổ cập</th>
                <th className="py-2.5 px-3">Độ tuổi điều tra</th>
                <th className="py-2.5 px-3 text-center">Tổng số trong độ tuổi</th>
                <th className="py-2.5 px-3 text-center">Huy động đến trường</th>
                <th className="py-2.5 px-3 text-center">Tỷ lệ huy động</th>
                <th className="py-2.5 px-3 text-center">Tỷ lệ hoàn thành</th>
                <th className="py-2.5 px-3 text-center">Mức độ đạt chuẩn QG</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {phoCapList.map((pc) => (
                <tr key={pc.capPhoCap} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-gray-900">{pc.tenChiTieu}</td>
                  <td className="py-2.5 px-3 text-gray-600">{pc.doTuoiDieuTra}</td>
                  <td className="py-2.5 px-3 text-center font-bold font-mono text-gray-800">
                    {pc.tongSoTrongDoTuoi.toLocaleString("vi-VN")}
                  </td>
                  <td className="py-2.5 px-3 text-center font-bold font-mono text-[#0073b7]">
                    {pc.soHuyDongDenTruong.toLocaleString("vi-VN")}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="font-mono font-bold text-emerald-700">{pc.tyLeHuyDongPercent}%</span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="font-mono font-bold text-emerald-700">{pc.tyLeHoanThanhPercent}%</span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="rounded bg-purple-100 text-purple-800 border border-purple-300 px-2 py-0.5 text-[10px] font-bold">
                      {pc.mucDoDatChuan}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mô hình Học tập & Xã hội học tập (Quyết định 1373/QĐ-TTg) */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Award className="size-4.5 text-amber-600" />
            <h3 className="text-sm font-bold text-gray-900">
              Xây dựng Xã hội học tập &amp; 4 Mô hình Học tập (Thông tư 22/2020/TT-BGDĐT)
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCongNhanHocTapModal(true)}
              className="px-2.5 py-1 rounded-md bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs inline-flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
              title="Xem Quyết định công nhận các mô hình học tập và Bằng khen Gia đình học tập xuất sắc"
            >
              <Award className="size-3.5" />
              <span>Xem QĐ &amp; Bằng Khen Gia đình học tập</span>
            </button>
            <span className="text-xs text-amber-800 font-bold bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded">
              Giai đoạn 2021 - 2030
            </span>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {moHinhHocTapList.map((mh) => (
            <div key={mh.id} className="p-3 rounded-lg border border-gray-200 bg-gray-50/70 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-gray-900">{mh.tenMoHinh}</span>
                  <span className="text-xs font-mono font-extrabold text-emerald-700">{mh.tyLePercent}%</span>
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  Đạt chuẩn: <strong className="text-gray-900">{mh.soDatChuan}</strong> / {mh.soDangKy}
                </div>
                <div className="mt-1.5 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, mh.tyLePercent)}%` }}
                  />
                </div>
              </div>
              <p className="mt-2 text-[10px] text-gray-500 line-clamp-2 italic">{mh.tieuChuanDanhGia}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Khuyến học & Trung tâm HTCĐ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Quỹ Khuyến học & Học bổng */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Heart className="size-4 text-rose-600" />
              <h3 className="text-sm font-bold text-gray-900">
                Hội Khuyến học &amp; Học bổng &ldquo;Thắp sáng ước mơ&rdquo;
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowTraoHocBongModal(true)}
                className="px-2.5 py-1 rounded-md bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs inline-flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                title="Trao học bổng Thắp sáng ước mơ cho học sinh nghèo vượt khó hiếu học"
              >
                <Plus className="size-3" />
                <span>Trao học bổng</span>
              </button>
              <span className="text-xs text-gray-500 font-medium hidden sm:inline">Không có học sinh bỏ học</span>
            </div>
          </div>

          <div className="mt-3 space-y-3">
            {khuyenHocList.map((kh) => (
              <div key={kh.id} className="p-3 rounded-lg border border-gray-200 bg-gray-50/60 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <span className="font-bold text-gray-900">{kh.tenChuongTrinh}</span>
                  <span className="rounded bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 text-[10px] font-bold">
                    {kh.kinhPhiVND.toLocaleString("vi-VN")} đ
                  </span>
                </div>
                <div className="text-[11px] text-gray-500 mt-1">
                  Địa điểm: {kh.diaDiem} · {kh.ngayToChuc} · Thụ hưởng:{" "}
                  <strong className="text-gray-800">{kh.soNguoiThuHuong} người</strong>
                </div>
                <p className="mt-1.5 text-[11px] text-gray-700 bg-white p-2 rounded border border-gray-100">
                  {kh.ketQuaDatDuoc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Trung tâm Học tập cộng đồng */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Users className="size-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-gray-900">
                  Trung tâm Học tập cộng đồng (TTHTCĐ) Phường
                </h3>
              </div>
              <button
                onClick={() => setShowAddLopHocModal(true)}
                className="px-2.5 py-1 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs inline-flex items-center gap-1 shadow-2xs cursor-pointer transition-colors"
              >
                <Plus className="size-3" />
                <span>Mở lớp chuyên đề</span>
              </button>
            </div>

            <div className="mt-3 space-y-2.5">
              {lopHocHTCDList.map((lh) => (
                <div key={lh.id} className="p-3 rounded-lg border border-gray-200 bg-gray-50/60 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-bold text-gray-900">{lh.tenChuyenDe}</div>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[9px] font-bold shrink-0 border ${
                        lh.trangThai === "DA_HOAN_THANH"
                          ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                          : lh.trangThai === "DANG_DIEN_RA"
                          ? "bg-sky-100 text-sky-800 border-sky-300"
                          : "bg-amber-100 text-amber-800 border-amber-300"
                      }`}
                    >
                      {lh.trangThai === "DA_HOAN_THANH"
                        ? "Đã hoàn thành"
                        : lh.trangThai === "DANG_DIEN_RA"
                        ? "Đang diễn ra"
                        : "Sắp tổ chức"}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1">
                    Báo cáo viên: <span className="font-semibold text-gray-700">{lh.giangVien}</span>
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">
                    {lh.thoiGian} · Dự kiến: {lh.soHocVien} học viên
                  </div>
                  <div className="mt-1 text-[11px] text-indigo-900 bg-indigo-50/70 p-1.5 rounded">
                    {lh.ketQua}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
