import React, { useState } from "react";
import {
  BookOpen,
  TrafficCone,
  Users,
  School,
  Award,
  Heart,
  Download,
  Printer,
  X,
  Check,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import {
  type TruongHocCongLap,
  type LopHocTrungTamHTCD,
  type HoatDongKhuyenHoc,
} from "@/data/domain-mock";
import { appStore } from "@/services/app-state";
import { DigitalSignatureBadge } from "@/components/DigitalSignatureBadge";
import { exportDocAsWord } from "../utils";

interface ModalTruongHocActionsProps {
  // Modal 4: Báo cáo tự kiểm tra PCGD-XMC
  showBaoCaoPhoCapModal: boolean;
  setShowBaoCaoPhoCapModal: (show: boolean) => void;

  // Modal 5: Điều phối ATGT cổng trường
  editingSchoolAtgt: TruongHocCongLap | null;
  setEditingSchoolAtgt: (school: TruongHocCongLap | null) => void;

  // Modal 6: Mở lớp chuyên đề HTCĐ
  showAddLopHocModal: boolean;
  setShowAddLopHocModal: (show: boolean) => void;

  // Modal 17: Tuyển sinh đầu cấp QĐ 104
  showKeHoachTuyenSinhModal: boolean;
  setShowKeHoachTuyenSinhModal: (show: boolean) => void;

  // Modal 18: Bằng khen Gia đình học tập
  showCongNhanHocTapModal: boolean;
  setShowCongNhanHocTapModal: (show: boolean) => void;

  // Modal 19: Trao học bổng Khuyến học
  showTraoHocBongModal: boolean;
  setShowTraoHocBongModal: (show: boolean) => void;

  // Modal 21: Kế hoạch ATGT Chỉ thị 31
  showKeHoachAtgtModal: boolean;
  setShowKeHoachAtgtModal: (show: boolean) => void;

  truongCongLapList: TruongHocCongLap[];
}

export const ModalTruongHocActions: React.FC<ModalTruongHocActionsProps> = ({
  showBaoCaoPhoCapModal,
  setShowBaoCaoPhoCapModal,
  editingSchoolAtgt,
  setEditingSchoolAtgt,
  showAddLopHocModal,
  setShowAddLopHocModal,
  showKeHoachTuyenSinhModal,
  setShowKeHoachTuyenSinhModal,
  showCongNhanHocTapModal,
  setShowCongNhanHocTapModal,
  showTraoHocBongModal,
  setShowTraoHocBongModal,
  showKeHoachAtgtModal,
  setShowKeHoachAtgtModal,
  truongCongLapList,
}) => {
  // State form Modal 5
  const [lucLuongAtgt, setLucLuongAtgt] = useState("");
  const [gioPhanLuong, setGioPhanLuong] = useState("");

  // State form Modal 6
  const [tenChuyenDe, setTenChuyenDe] = useState("");
  const [giangVien, setGiangVien] = useState("");
  const [thoiGianLop, setThoiGianLop] = useState("");
  const [diaDiemLop, setDiaDiemLop] = useState(
    "Hội trường Trung tâm HTCĐ Phường"
  );
  const [soHocVien, setSoHocVien] = useState(50);
  const [mucTieuLop, setMucTieuLop] = useState("");

  // State form Modal 19
  const [tenHocSinhHocBong, setTenHocSinhHocBong] = useState("");
  const [truongLopHocBong, setTruongLopHocBong] = useState("");
  const [khuPhoHocBong, setKhuPhoHocBong] = useState("Khu phố 1");
  const [hoanCanhHocBong, setHoanCanhHocBong] = useState(
    "Hộ nghèo vượt khó hiếu học"
  );
  const [mucHocBongVND, setMucHocBongVND] = useState(1500000);

  // Handlers
  const handleSaveSchoolAtgt = () => {
    if (!editingSchoolAtgt) return;
    appStore.updateTruongCongLap(editingSchoolAtgt.id, {
      lucLuongTrucATGT: lucLuongAtgt,
      gioCaoDiemPhanLuong: gioPhanLuong,
    });
    toast.success("Đã cập nhật phương án phối hợp đảm bảo ATGT cổng trường!", {
      description: editingSchoolAtgt.tenTruong,
    });
    setEditingSchoolAtgt(null);
  };

  const handleCreateLopHoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenChuyenDe.trim() || !giangVien.trim()) {
      toast.error("Vui lòng nhập tên chuyên đề và giảng viên/báo cáo viên!");
      return;
    }

    const newLop: LopHocTrungTamHTCD = {
      id: `LH-${Date.now()}`,
      tenChuyenDe: tenChuyenDe.trim(),
      giangVien: giangVien.trim(),
      thoiGian: thoiGianLop || "Thứ Bảy tuần tới, 08h30 - 11h00",
      diaDiem: diaDiemLop,
      soHocVien: Number(soHocVien),
      trangThai: "SAP_TO_CHUC",
      ketQua:
        mucTieuLop || "Phổ biến kiến thức và nâng cao nhận thức cho người dân.",
    };

    appStore.addLopHocHTCD(newLop);
    toast.success("Đã mở lớp chuyên đề Trung tâm Học tập cộng đồng!", {
      description: newLop.tenChuyenDe,
    });
    setShowAddLopHocModal(false);
    setTenChuyenDe("");
    setGiangVien("");
  };

  const handleTraoHocBong = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenHocSinhHocBong.trim()) {
      toast.error("Vui lòng nhập họ tên học sinh nhận học bổng!");
      return;
    }
    const newHb: HoatDongKhuyenHoc = {
      id: `KH-${Date.now()}`,
      tenChuongTrinh: `Học bổng "Thắp sáng ước mơ" - Trao em ${tenHocSinhHocBong.trim()}`,
      diaDiem: `Hội trường UBND Phường Phú Cường / ${khuPhoHocBong}`,
      ngayToChuc: new Date().toLocaleDateString("vi-VN"),
      kinhPhiVND: Number(mucHocBongVND),
      soNguoiThuHuong: 1,
      ketQuaDatDuoc: `Trao học bổng trị giá ${Number(
        mucHocBongVND
      ).toLocaleString(
        "vi-VN"
      )} đ cho em ${tenHocSinhHocBong.trim()} (${truongLopHocBong || "Học sinh trên địa bàn"}, ${khuPhoHocBong}) thuộc diện ${hoanCanhHocBong}. Trích từ Quỹ Khuyến học Phường.`,
    };
    appStore.addKhuyenHoc(newHb);
    toast.success("Đã duyệt và trao học bổng Khuyến học thành công!", {
      description: `Trao cho em ${tenHocSinhHocBong} · Số tiền: ${Number(
        mucHocBongVND
      ).toLocaleString("vi-VN")} đ`,
    });
    setShowTraoHocBongModal(false);
    setTenHocSinhHocBong("");
    setTruongLopHocBong("");
  };

  return (
    <>
      {/* MODAL 4: BÁO CÁO TỰ KIỂM TRA ĐẠT CHUẨN PCGD-XMC */}
      {showBaoCaoPhoCapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-gray-200 overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-purple-900 text-white px-5 py-3.5 flex items-center justify-between shrink-0 shadow-xs">
              <div className="flex items-center gap-2">
                <BookOpen className="size-5" />
                <h3 className="font-bold text-sm sm:text-base">
                  Báo cáo Tự kiểm tra Đạt chuẩn Phổ cập Giáo dục &amp; Xóa mù chữ Năm 2026
                </h3>
              </div>
              <button
                onClick={() => setShowBaoCaoPhoCapModal(false)}
                className="text-white/80 hover:text-white p-1 rounded-md hover:bg-white/10 cursor-pointer transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            <div
              className="p-6 text-xs overflow-y-auto space-y-4 font-serif bg-purple-50/20 flex-1"
              id="bao-cao-pho-cap-content"
            >
              <div className="flex justify-between items-start border-b border-gray-300 pb-3 text-center font-sans">
                <div>
                  <div className="font-bold text-[11px] uppercase text-gray-700">
                    BAN CHỈ ĐẠO PCGD - XMC
                  </div>
                  <div className="font-extrabold text-xs uppercase text-purple-900">
                    PHƯỜNG PHÚ CƯỜNG
                  </div>
                  <div className="text-[10px] text-gray-500 font-mono mt-0.5">
                    Số: 18/BC-BCĐPC
                  </div>
                </div>
                <div>
                  <div className="font-bold text-[11px] uppercase text-gray-800">
                    CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                  </div>
                  <div className="font-bold text-[11px] text-gray-700 underline">
                    Độc lập - Tự do - Hạnh phúc
                  </div>
                  <div className="text-[10px] text-gray-500 italic mt-0.5">
                    Phú Cường, ngày 10 tháng 10 năm 2026
                  </div>
                </div>
              </div>

              <div className="text-center py-1">
                <div className="text-sm font-extrabold text-gray-900 uppercase">
                  BÁO CÁO
                </div>
                <div className="text-xs font-bold text-gray-700 mt-0.5">
                  Tự kiểm tra kết quả Phổ cập giáo dục, Xóa mù chữ năm 2026
                </div>
              </div>

              <div className="space-y-2 text-justify text-gray-700 leading-relaxed font-sans text-xs">
                <p>
                  Thực hiện Nghị định số 20/2014/NĐ-CP ngày 24/3/2014 của Chính
                  phủ và Thông tư số 07/2016/TT-BGDĐT ngày 22/3/2016 của Bộ
                  trưởng Bộ Giáo dục và Đào tạo, Ban chỉ đạo Phổ cập giáo dục -
                  Xóa mù chữ phường Phú Cường báo cáo kết quả như sau:
                </p>

                <div className="font-bold text-gray-900">
                  I. CÔNG TÁC LÃNH ĐẠO, CHỈ ĐẠO VÀ ĐIỀU TRA:
                </div>
                <p>
                  Đảng ủy, UBND phường đã kiện toàn Ban chỉ đạo PCGD-XMC do đồng
                  chí Phó Chủ tịch UBND phường làm Trưởng ban. Hằng năm chỉ đạo
                  cán bộ chuyên trách và các trường học phối hợp với Công an
                  phường rà soát dữ liệu dân cư Đề án 06, cập nhật 100% trẻ từ 0
                  - 18 tuổi và người trong độ tuổi 15 - 60 vào phần mềm PCGD-XMC
                  quốc gia.
                </p>

                <div className="font-bold text-gray-900">
                  II. KẾT QUẢ ĐỐI CHIẾU TIÊU CHUẨN CÔNG NHẬN:
                </div>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>1. Phổ cập GD Mầm non cho trẻ 5 tuổi:</strong> Tổng
                    số trẻ 5 tuổi điều tra: 382 trẻ; Huy động ra lớp: 381 trẻ (
                    <strong>99,74%</strong>, vượt chuẩn QG quy định ≥ 95%). 100%
                    trẻ được học 2 buổi/ngày theo chương trình GDMN.
                  </li>
                  <li>
                    <strong>2. Phổ cập GD Tiểu học Mức độ 3:</strong> Trẻ 6 tuổi
                    vào lớp 1: 100%; Tỷ lệ trẻ 11 tuổi hoàn thành chương trình
                    tiểu học đạt <strong>99,68%</strong> (Chuẩn Mức 3 quy định ≥
                    90%).
                  </li>
                  <li>
                    <strong>3. Phổ cập GD Trung học cơ sở Mức độ 3:</strong> Tỷ
                    lệ thanh thiếu niên từ 15 đến 18 tuổi có bằng tốt nghiệp
                    THCS đạt <strong>99,39%</strong> (Chuẩn Mức 3 quy định ≥
                    95%).
                  </li>
                  <li>
                    <strong>4. Xóa mù chữ Mức độ 2:</strong> Người trong độ tuổi
                    15 - 60 biết chữ đạt <strong>99,96%</strong> (quy định ≥
                    98%).
                  </li>
                </ul>

                <div className="font-bold text-gray-900">
                  III. KẾT LUẬN VÀ KIẾN NGHỊ:
                </div>
                <p>
                  Căn cứ các tiêu chuẩn hiện hành, phường Phú Cường{" "}
                  <strong>ĐỦ ĐIỀU KIỆN ĐẠT CHUẨN</strong>: Phổ cập giáo dục mầm
                  non cho trẻ 5 tuổi; Phổ cập giáo dục tiểu học Mức độ 3; Phổ
                  cập giáo dục THCS Mức độ 3; Xóa mù chữ Mức độ 2 năm 2026.
                </p>
                <p>
                  Kính đề nghị UBND Thành phố Thủ Dầu Một và Phòng Giáo dục &amp;
                  Đào tạo thành phố tiến hành kiểm tra công nhận chính thức./.
                </p>
              </div>

              {/* Chữ ký số hóa */}
              <div className="flex justify-between items-end pt-3 border-t border-gray-200 font-sans">
                <div className="text-[10px] text-gray-500">
                  <div className="font-bold">Nơi nhận:</div>
                  <div>- UBND TP. Thủ Dầu Một;</div>
                  <div>- Phòng GD&amp;ĐT TP;</div>
                  <div>- Đảng ủy, HĐND phường;</div>
                  <div>- Lưu: BCĐ.</div>
                </div>

                <div className="text-center">
                  <div className="font-bold text-xs uppercase text-gray-800">
                    TM. BAN CHỈ ĐẠO PCGD-XMC
                  </div>
                  <div className="font-bold text-xs uppercase text-purple-900">
                    TRƯỞNG BAN
                  </div>
                  <div className="text-[10px] text-gray-500 italic mt-0.5">
                    (Phó Chủ tịch UBND Phường)
                  </div>
                  <div className="size-14 mx-auto my-1 rounded-full border border-purple-500 flex items-center justify-center text-[8px] font-bold text-purple-700 bg-purple-50">
                    ĐÃ DUYỆT BÁO CÁO
                  </div>
                  <div className="font-bold text-xs text-gray-900">
                    Lê Hoàng Nam
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-gray-100 border-t border-gray-200 flex items-center justify-between shrink-0">
              <span className="text-xs text-gray-500 font-mono">
                Dữ liệu kết xuất từ Hệ thống PCGD-XMC Quốc gia
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    exportDocAsWord(
                      "Bao_cao_18_BC_Ban_chi_dao_pho_cap_giao_duc",
                      "bao-cao-pho-cap-content"
                    )
                  }
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Download className="size-3.5" />
                  <span>Tải Word (.doc)</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                >
                  <Printer className="size-3.5" />
                  <span>In Báo cáo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowBaoCaoPhoCapModal(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-white font-bold text-xs cursor-pointer transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: ĐIỀU PHỐI ATGT CỔNG TRƯỜNG HỌC */}
      {editingSchoolAtgt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-amber-600 text-white px-5 py-3.5 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <TrafficCone className="size-5" />
                <h3 className="font-bold text-sm sm:text-base">
                  Điều phối ATGT Cổng trường học
                </h3>
              </div>
              <button
                onClick={() => setEditingSchoolAtgt(null)}
                className="text-white/80 hover:text-white p-1 rounded-md hover:bg-white/10 cursor-pointer transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                <div className="font-bold text-gray-900 text-xs">
                  {editingSchoolAtgt.tenTruong}
                </div>
                <div className="text-[11px] text-gray-600 mt-0.5">
                  {editingSchoolAtgt.diaChi}
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Khung giờ cao điểm phân luồng
                </label>
                <input
                  type="text"
                  value={gioPhanLuong}
                  onChange={(e) => setGioPhanLuong(e.target.value)}
                  placeholder="VD: 06:45 - 07:15 & 16:45 - 17:30"
                  className="w-full rounded-lg border border-gray-300 p-2 text-xs outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Lực lượng phối hợp ứng trực
                </label>
                <input
                  type="text"
                  value={lucLuongAtgt}
                  onChange={(e) => setLucLuongAtgt(e.target.value)}
                  placeholder="VD: Công an phường + Dân quân tự vệ + Đoàn thanh niên"
                  className="w-full rounded-lg border border-gray-300 p-2 text-xs outline-none focus:border-amber-600"
                />
              </div>

              <div className="pt-2 border-t border-gray-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingSchoolAtgt(null)}
                  className="px-3.5 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold cursor-pointer transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleSaveSchoolAtgt}
                  className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Check className="size-3.5" />
                  <span>Lưu phương án</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: MỞ LỚP CHUYÊN ĐỀ TRUNG TÂM HTCĐ */}
      {showAddLopHocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-indigo-700 text-white px-5 py-3.5 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <Users className="size-5" />
                <h3 className="font-bold text-sm sm:text-base">
                  Mở Lớp Chuyên đề Trung tâm Học tập cộng đồng Phường
                </h3>
              </div>
              <button
                onClick={() => setShowAddLopHocModal(false)}
                className="text-white/80 hover:text-white p-1 rounded-md hover:bg-white/10 cursor-pointer transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            <form
              onSubmit={handleCreateLopHoc}
              className="p-5 space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Tên chuyên đề bồi dưỡng / tập huấn{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Kỹ năng phòng chống đuối nước, Dịch vụ công số, Kỹ năng số..."
                  value={tenChuyenDe}
                  onChange={(e) => setTenChuyenDe(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-2 text-xs outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Báo cáo viên / Giảng viên{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Họ tên, học vị, cơ quan"
                    value={giangVien}
                    onChange={(e) => setGiangVien(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 p-2 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Số lượng học viên dự kiến
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="300"
                    value={soHocVien}
                    onChange={(e) => setSoHocVien(Number(e.target.value))}
                    className="w-full rounded-lg border border-gray-300 p-2 text-xs outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Thời gian tổ chức
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Sáng Thứ Bảy, ngày 28/10/2026"
                    value={thoiGianLop}
                    onChange={(e) => setThoiGianLop(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 p-2 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Địa điểm
                  </label>
                  <input
                    type="text"
                    value={diaDiemLop}
                    onChange={(e) => setDiaDiemLop(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 p-2 text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Mục tiêu &amp; Kết quả đầu ra dự kiến
                </label>
                <textarea
                  rows={3}
                  value={mucTieuLop}
                  onChange={(e) => setMucTieuLop(e.target.value)}
                  placeholder="Mục tiêu đào tạo, đối tượng thụ hưởng..."
                  className="w-full rounded-lg border border-gray-300 p-2 text-xs outline-none"
                />
              </div>

              <div className="pt-2 border-t border-gray-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddLopHocModal(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold cursor-pointer transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Send className="size-3.5" />
                  <span>Phát hành Kế hoạch Mở lớp</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 17: KẾ HOẠCH TUYỂN SINH ĐẦU CẤP (SỐ 104/QĐ-UBND) */}
      {showKeHoachTuyenSinhModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white text-gray-900 rounded-xl shadow-2xl max-w-4xl w-full border border-gray-200 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-sky-800 text-white px-6 py-3.5 flex items-center justify-between no-print shrink-0 shadow-xs rounded-t-xl">
              <div className="flex items-center gap-2">
                <School className="size-5" />
                <h3 className="font-bold text-sm sm:text-base">
                  Kế hoạch &amp; Quyết định Phân tuyến Tuyển sinh Đầu cấp (Số
                  104/QĐ-UBND)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    exportDocAsWord(
                      "Ke_hoach_tuyen_sinh_dau_cap_QD104",
                      "tuyen-sinh-plan-content"
                    )
                  }
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Download className="size-3.5" />
                  <span>Tải Word (.doc)</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Printer className="size-3.5" />
                  <span>In Kế hoạch (Ctrl+P)</span>
                </button>
                <button
                  onClick={() => setShowKeHoachTuyenSinhModal(false)}
                  className="text-white/80 hover:text-white p-1 rounded-md hover:bg-white/10 cursor-pointer transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            <div
              className="p-8 overflow-y-auto font-serif text-[13px] leading-relaxed select-text flex-1"
              id="tuyen-sinh-plan-content"
            >
              {/* Quốc hiệu & Đơn vị ban hành */}
              <div className="grid grid-cols-2 text-center pb-4 border-b border-gray-400">
                <div>
                  <div className="font-bold uppercase text-[12px]">
                    ỦY BAN NHÂN DÂN THÀNH PHỐ THỦ DẦU MỘT
                  </div>
                  <div className="font-bold uppercase text-[13px] text-sky-900">
                    ỦY BAN NHÂN DÂN PHƯỜNG PHÚ CƯỜNG
                  </div>
                  <div className="text-[11px] font-sans mt-1">
                    Số:{" "}
                    <strong className="font-mono text-black">
                      104/QĐ-UBND
                    </strong>
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
                    Phú Cường, ngày 10 tháng 05 năm 2026
                  </div>
                </div>
              </div>

              {/* Tiêu đề Quyết định */}
              <div className="text-center my-6 space-y-1">
                <h2 className="text-base font-bold uppercase tracking-wide text-gray-900">
                  QUYẾT ĐỊNH
                </h2>
                <div className="font-bold text-sm text-gray-800">
                  Ban hành Kế hoạch phân tuyến tuyển sinh các lớp đầu cấp (Mầm
                  non 5 tuổi, Lớp 1, Lớp 6) năm học 2026 - 2027 trên địa bàn
                  Phường Phú Cường
                </div>
                <div className="text-xs uppercase font-extrabold text-[#b91c1c] tracking-widest pt-1">
                  CHỦ TỊCH ỦY BAN NHÂN DÂN PHƯỜNG PHÚ CƯỜNG
                </div>
              </div>

              <div className="space-y-3 text-justify text-xs font-serif leading-relaxed">
                <p>
                  Căn cứ Luật Giáo dục ngày 14 tháng 6 năm 2019; Căn cứ Kế hoạch
                  tuyển sinh đầu cấp của UBND Thành phố Thủ Dầu Một;
                </p>
                <p>
                  Thực hiện Đề án 06 của Thủ tướng Chính phủ về ứng dụng dữ liệu
                  dân cư và tài khoản định danh điện tử VNeID trong công tác
                  tuyển sinh đầu cấp trực tuyến, bảo đảm huy động 100% trẻ em
                  đúng độ tuổi đến trường và phân luồng hợp lý;
                </p>

                <div className="text-center font-bold text-xs uppercase my-2 tracking-wider">
                  QUYẾT ĐỊNH:
                </div>

                <p>
                  <strong>Điều 1.</strong> Ban hành kèm theo Quyết định này Kế
                  hoạch phân tuyến tuyển sinh theo địa bàn 9 Khu phố của Phường
                  Phú Cường:
                </p>

                {/* Bảng phân tuyến 9 khu phố */}
                <div className="font-sans overflow-x-auto my-2 not-italic">
                  <table className="w-full text-[11px] border-collapse border border-gray-400">
                    <thead>
                      <tr className="bg-sky-50 text-gray-800 font-bold text-center">
                        <th className="border border-gray-400 p-1.5 text-left">
                          Trường học công lập tiếp nhận
                        </th>
                        <th className="border border-gray-400 p-1.5">
                          Cấp học
                        </th>
                        <th className="border border-gray-400 p-1.5 text-left">
                          Phân tuyến theo Khu phố
                        </th>
                        <th className="border border-gray-400 p-1.5 text-center">
                          Chỉ tiêu
                        </th>
                        <th className="border border-gray-400 p-1.5 text-center">
                          Phương thức tuyển sinh
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-400 p-1.5 font-bold">
                          Trường Mầm non Hướng Dương
                        </td>
                        <td className="border border-gray-400 p-1.5 text-center">
                          Mầm non (5T)
                        </td>
                        <td className="border border-gray-400 p-1.5">
                          Khu phố 1, Khu phố 2, Khu phố 3, Khu phố 4
                        </td>
                        <td className="border border-gray-400 p-1.5 text-center font-bold font-mono">
                          120 trẻ
                        </td>
                        <td className="border border-gray-400 p-1.5 text-center text-indigo-700 font-semibold">
                          100% VNeID trực tuyến
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-gray-400 p-1.5 font-bold">
                          Trường Mầm non Hoa Mai
                        </td>
                        <td className="border border-gray-400 p-1.5 text-center">
                          Mầm non (5T)
                        </td>
                        <td className="border border-gray-400 p-1.5">
                          Khu phố 5, Khu phố 6, Khu phố 7, Khu phố 8, Khu phố 9
                        </td>
                        <td className="border border-gray-400 p-1.5 text-center font-bold font-mono">
                          130 trẻ
                        </td>
                        <td className="border border-gray-400 p-1.5 text-center text-indigo-700 font-semibold">
                          100% VNeID trực tuyến
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-gray-400 p-1.5 font-bold text-blue-900">
                          Trường Tiểu học Phú Cường
                        </td>
                        <td className="border border-gray-400 p-1.5 text-center font-bold">
                          Lớp 1
                        </td>
                        <td className="border border-gray-400 p-1.5">
                          Khu phố 1, Khu phố 2, Khu phố 3, Khu phố 4, Khu phố 5
                          (Trẻ sinh năm 2020)
                        </td>
                        <td className="border border-gray-400 p-1.5 text-center font-bold font-mono text-emerald-800">
                          240 học sinh (7 lớp)
                        </td>
                        <td className="border border-gray-400 p-1.5 text-center text-indigo-700 font-semibold">
                          Cổng DVC Tuyển sinh Tỉnh
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-gray-400 p-1.5 font-bold text-blue-900">
                          Trường Tiểu học Nguyễn Du
                        </td>
                        <td className="border border-gray-400 p-1.5 text-center font-bold">
                          Lớp 1
                        </td>
                        <td className="border border-gray-400 p-1.5">
                          Khu phố 6, Khu phố 7, Khu phố 8, Khu phố 9 (Trẻ sinh
                          năm 2020)
                        </td>
                        <td className="border border-gray-400 p-1.5 text-center font-bold font-mono text-emerald-800">
                          200 học sinh (6 lớp)
                        </td>
                        <td className="border border-gray-400 p-1.5 text-center text-indigo-700 font-semibold">
                          Cổng DVC Tuyển sinh Tỉnh
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-gray-400 p-1.5 font-bold text-purple-900">
                          Trường THCS Phú Cường
                        </td>
                        <td className="border border-gray-400 p-1.5 text-center font-bold">
                          Lớp 6
                        </td>
                        <td className="border border-gray-400 p-1.5">
                          Toàn bộ 100% học sinh hoàn thành chương trình tiểu học
                          tại TH Phú Cường
                        </td>
                        <td className="border border-gray-400 p-1.5 text-center font-bold font-mono text-emerald-800">
                          240 học sinh (6 lớp)
                        </td>
                        <td className="border border-gray-400 p-1.5 text-center text-indigo-700 font-semibold">
                          Xét tuyển trực tuyến
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p>
                  <strong>Điều 2.</strong> Trách nhiệm của các cơ quan, đơn vị
                  liên quan:
                </p>
                <div className="pl-4 space-y-1 font-sans text-gray-800">
                  <div>
                    - <strong>Công an Phường Phú Cường:</strong> Phối hợp Ban
                    điều hành 9 Khu phố rà soát, làm sạch dữ liệu cư dân, xác
                    thực thông tin định danh VNeID cho 100% phụ huynh và trẻ em
                    trong độ tuổi tuyển sinh.
                  </div>
                  <div>
                    - <strong>Ban Giám hiệu các trường công lập:</strong> Thực
                    hiện công khai kế hoạch phân tuyến, tổ chức đội hình công
                    nghệ số hướng dẫn phụ huynh nộp hồ sơ trực tuyến; tuyệt đối
                    không tiếp nhận học sinh trái tuyến khi chưa giải quyết xong
                    học sinh đúng tuyến.
                  </div>
                  <div>
                    - <strong>Tổ điều phối ATGT cổng trường:</strong> Ban chỉ
                    huy Công an phường bố trí lực lượng Dân quân và Công an thường
                    trực phân luồng tại các cổng trường TH Phú Cường (đường Đoàn
                    Trần Nghiệp) và THCS Phú Cường trong khung giờ 06:45 - 07:15
                    và 16:45 - 17:30.
                  </div>
                </div>

                <p>
                  <strong>Điều 3.</strong> Văn phòng HĐND - UBND phường, Ban Chỉ
                  huy Công an phường, Hiệu trưởng các trường công lập trên địa
                  bàn và Trưởng Ban điều hành 9 Khu phố chịu trách nhiệm thi hành
                  Quyết định này./.
                </p>
              </div>

              {/* Nơi nhận & Ký số */}
              <div className="grid grid-cols-2 pt-6 border-t border-gray-300 font-sans mt-4">
                <div className="text-[11px] text-gray-600 space-y-0.5">
                  <div className="font-bold text-gray-800">Nơi nhận:</div>
                  <div>- Phòng GD&amp;ĐT TP. Thủ Dầu Một (b/c);</div>
                  <div>- Đảng ủy, HĐND phường;</div>
                  <div>- BGH các trường Mầm non, TH, THCS;</div>
                  <div>- Ban điều hành 9 Khu phố;</div>
                  <div>- Lưu: VT, VHXH.</div>
                </div>

                <div className="text-center space-y-2">
                  <div className="font-bold text-xs uppercase text-gray-900">
                    CHỦ TỊCH
                  </div>
                  <div className="my-2 flex justify-center">
                    <DigitalSignatureBadge
                      nguoiKy="TS. Nguyễn Văn Hùng"
                      chucVu="Chủ tịch UBND Phường Phú Cường"
                      ngayKy="10/05/2026"
                      maXacThuc="CA-TSDC-2026-PC-9871"
                    />
                  </div>
                  <div className="font-extrabold text-sm text-gray-900">
                    TS. Nguyễn Văn Hùng
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-6 py-3 border-t bg-gray-50 rounded-b-xl no-print">
              <span className="text-xs text-gray-500">
                Quyết định 104/QĐ-UBND · Phân tuyến tuyển sinh 100% qua VNeID
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    exportDocAsWord(
                      "Ke_hoach_tuyen_sinh_dau_cap_QD104",
                      "tuyen-sinh-plan-content"
                    )
                  }
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Download className="size-4" />
                  Tải file Word (.doc)
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Printer className="size-4" />
                  In Kế hoạch
                </button>
                <button
                  onClick={() => setShowKeHoachTuyenSinhModal(false)}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-semibold rounded-lg cursor-pointer transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 18: BẰNG KHEN GIA ĐÌNH HỌC TẬP (TT 22/2020) */}
      {showCongNhanHocTapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white text-gray-900 rounded-xl shadow-2xl max-w-3xl w-full border border-gray-200 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-amber-700 text-white px-6 py-3.5 flex items-center justify-between no-print shrink-0 shadow-xs rounded-t-xl">
              <div className="flex items-center gap-2">
                <Award className="size-5" />
                <h3 className="font-bold text-sm sm:text-base">
                  Quyết định Công nhận &amp; Bằng Khen Gia đình học tập tiêu
                  biểu (Thông tư 22/2020)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    exportDocAsWord(
                      "Giay_cong_nhan_Gia_dinh_hoc_tap",
                      "bang-khen-content"
                    )
                  }
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Download className="size-3.5" />
                  <span>Tải Word (.doc)</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Printer className="size-3.5" />
                  <span>In Bằng khen (Ctrl+P)</span>
                </button>
                <button
                  onClick={() => setShowCongNhanHocTapModal(false)}
                  className="text-white/80 hover:text-white p-1 rounded-md hover:bg-white/10 cursor-pointer transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            <div
              className="p-8 overflow-y-auto space-y-6 flex-1"
              id="bang-khen-content"
            >
              {/* BẰNG KHEN / GIẤY CÔNG NHẬN */}
              <div className="border-8 border-double border-amber-600 p-6 bg-gradient-to-b from-amber-50/40 via-white to-amber-50/40 text-center space-y-3 shadow-inner rounded-sm relative">
                <div className="absolute top-2 left-2 text-amber-600 text-lg">
                  ✦
                </div>
                <div className="absolute top-2 right-2 text-amber-600 text-lg">
                  ✦
                </div>
                <div className="absolute bottom-2 left-2 text-amber-600 text-lg">
                  ✦
                </div>
                <div className="absolute bottom-2 right-2 text-amber-600 text-lg">
                  ✦
                </div>

                <div className="font-serif uppercase text-xs font-bold text-gray-800 tracking-wider">
                  CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                </div>
                <div className="font-serif text-xs font-bold text-gray-700">
                  Độc lập - Tự do - Hạnh phúc
                </div>
                <div className="w-24 h-0.5 bg-amber-600 mx-auto my-1"></div>

                <div className="font-serif uppercase text-[11px] text-gray-600 tracking-widest pt-2">
                  ỦY BAN NHÂN DÂN THÀNH PHỐ THỦ DẦU MỘT
                </div>
                <div className="font-serif uppercase text-sm font-extrabold text-[#b91c1c] tracking-widest">
                  ỦY BAN NHÂN DÂN PHƯỜNG PHÚ CƯỜNG
                </div>

                <div className="py-4">
                  <div className="font-serif uppercase text-2xl font-black text-amber-800 tracking-widest">
                    GIẤY CÔNG NHẬN
                  </div>
                  <div className="font-serif italic text-sm text-gray-700 mt-1">
                    CHỦ TỊCH ỦY BAN NHÂN DÂN PHƯỜNG PHÚ CƯỜNG TẶNG:
                  </div>
                </div>

                <div className="text-xl font-bold uppercase text-red-800 font-serif tracking-wide border-b-2 border-dotted border-amber-500 pb-2 inline-block px-8">
                  GIA ĐÌNH ÔNG NGUYỄN VĂN THÀNH
                </div>
                <div className="text-xs text-gray-600 font-sans">
                  Địa chỉ: Số 42 đường Bạch Đằng, Khu phố 3, Phường Phú Cường
                </div>

                <p className="font-serif italic text-sm text-gray-800 max-w-lg mx-auto py-2 leading-relaxed">
                  &ldquo;Đã có thành tích xuất sắc tiêu biểu trong phong trào xây
                  dựng mô hình <strong>Gia đình học tập</strong> giai đoạn 2021 -
                  2026, góp phần tích cực xây dựng Phường Phú Cường trở thành Đô
                  thị học tập văn minh, giàu đẹp.&rdquo;
                </p>

                <div className="grid grid-cols-2 pt-6 font-sans text-xs">
                  <div className="text-center space-y-1">
                    <div className="font-bold text-gray-700">
                      HỘI KHUYẾN HỌC PHƯỜNG
                    </div>
                    <div className="text-[11px] text-gray-500">
                      Chủ tịch Hội
                    </div>
                    <div className="h-10"></div>
                    <div className="font-bold text-gray-800">
                      ThS. Lê Hoàng Tuấn
                    </div>
                  </div>

                  <div className="text-center space-y-1">
                    <div className="italic text-gray-500 text-[11px]">
                      Phú Cường, ngày 28 tháng 08 năm 2026
                    </div>
                    <div className="font-bold text-gray-800 uppercase">
                      CHỦ TỊCH UBND PHƯỜNG
                    </div>
                    <div className="flex justify-center my-1">
                      <DigitalSignatureBadge
                        nguoiKy="TS. Nguyễn Văn Hùng"
                        chucVu="Chủ tịch UBND Phường Phú Cường"
                        ngayKy="28/08/2026"
                        maXacThuc="CA-GDHT-2026-PC-4412"
                      />
                    </div>
                    <div className="font-extrabold text-sm text-gray-900">
                      TS. Nguyễn Văn Hùng
                    </div>
                  </div>
                </div>
              </div>

              {/* TÓM TẮT QUYẾT ĐỊNH 142/QĐ-UBND */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-xs font-sans space-y-2">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <span className="font-bold text-gray-900">
                    Căn cứ Quyết định số 142/QĐ-UBND ngày 28/08/2026:
                  </span>
                  <span className="font-mono text-emerald-700 font-bold">
                    Tỷ lệ công nhận: 92.5%
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  <div className="p-2 bg-white rounded-lg border border-gray-200 text-center">
                    <div className="text-gray-500 text-[10px]">
                      Gia đình học tập
                    </div>
                    <div className="font-bold text-amber-800">
                      3.840 / 4.150 hộ
                    </div>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-gray-200 text-center">
                    <div className="text-gray-500 text-[10px]">
                      Dòng họ học tập
                    </div>
                    <div className="font-bold text-amber-800">
                      18 / 20 dòng họ
                    </div>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-gray-200 text-center">
                    <div className="text-gray-500 text-[10px]">
                      Cộng đồng học tập
                    </div>
                    <div className="font-bold text-emerald-700">
                      9 / 9 khu phố
                    </div>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-gray-200 text-center">
                    <div className="text-gray-500 text-[10px]">
                      Đơn vị học tập
                    </div>
                    <div className="font-bold text-emerald-700">
                      4 / 4 cơ quan
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-6 py-3 border-t bg-gray-50 rounded-b-xl no-print">
              <span className="text-xs text-gray-500">
                Mẫu Giấy công nhận chuẩn Bộ Giáo dục &amp; Đào tạo
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    exportDocAsWord(
                      "Giay_cong_nhan_Gia_dinh_hoc_tap",
                      "bang-khen-content"
                    )
                  }
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Download className="size-4" />
                  Tải file Word (.doc)
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Printer className="size-4" />
                  In Bằng khen
                </button>
                <button
                  onClick={() => setShowCongNhanHocTapModal(false)}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-semibold rounded-lg cursor-pointer transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 19: TRAO HỌC BỔNG "THẮP SÁNG ƯỚC MƠ" */}
      {showTraoHocBongModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white text-gray-900 rounded-xl shadow-2xl max-w-xl w-full border border-gray-200 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-rose-700 text-white px-5 py-3.5 flex items-center justify-between shrink-0 shadow-xs rounded-t-xl">
              <div className="flex items-center gap-2">
                <Heart className="size-5" />
                <h3 className="font-bold text-sm sm:text-base">
                  Trao Học bổng Khuyến học &ldquo;Thắp sáng ước mơ&rdquo; Phường
                  Phú Cường
                </h3>
              </div>
              <button
                onClick={() => setShowTraoHocBongModal(false)}
                className="text-white/80 hover:text-white p-1 rounded-md hover:bg-white/10 cursor-pointer transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            <form
              onSubmit={handleTraoHocBong}
              className="p-6 space-y-4 text-xs overflow-y-auto font-sans flex-1"
            >
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-900 text-xs leading-relaxed">
                <strong>Chính sách Khuyến học Phường Phú Cường:</strong> Hỗ trợ
                kịp thời các em học sinh có hoàn cảnh đặc biệt khó khăn, không để
                bất kỳ trẻ em nào vì nghèo khó mà phải bỏ học giữa chừng.
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  Họ và tên học sinh được xét trao học bổng{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={tenHocSinhHocBong}
                  onChange={(e) => setTenHocSinhHocBong(e.target.value)}
                  placeholder="VD: Nguyễn Văn Hoàng"
                  className="w-full rounded-lg border border-gray-300 p-2 text-xs font-bold outline-none focus:border-rose-700 focus:ring-1 focus:ring-rose-700"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Trường &amp; Lớp theo học
                  </label>
                  <input
                    type="text"
                    value={truongLopHocBong}
                    onChange={(e) => setTruongLopHocBong(e.target.value)}
                    placeholder="VD: Lớp 5A - Tiểu học Phú Cường"
                    className="w-full rounded-lg border border-gray-300 p-2 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Khu phố cư trú
                  </label>
                  <select
                    value={khuPhoHocBong}
                    onChange={(e) => setKhuPhoHocBong(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 p-2 text-xs outline-none bg-white"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((k) => (
                      <option key={k} value={`Khu phố ${k}`}>
                        Khu phố {k}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Hoàn cảnh gia đình
                </label>
                <input
                  type="text"
                  value={hoanCanhHocBong}
                  onChange={(e) => setHoanCanhHocBong(e.target.value)}
                  placeholder="VD: Hộ nghèo, mồ côi cha mẹ, khuyết tật vượt khó học giỏi..."
                  className="w-full rounded-lg border border-gray-300 p-2 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Mức học bổng trao tặng
                </label>
                <select
                  value={mucHocBongVND}
                  onChange={(e) => setMucHocBongVND(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 p-2 text-xs font-bold text-rose-800 outline-none bg-white"
                >
                  <option value={1000000}>
                    1.000.000 đồng (Suất học bổng Hỗ trợ dụng cụ học tập)
                  </option>
                  <option value={1500000}>
                    1.500.000 đồng (Suất học bổng Vượt khó hiếu học)
                  </option>
                  <option value={2000000}>
                    2.000.000 đồng (Suất học bổng Thắp sáng ước mơ học kỳ I)
                  </option>
                  <option value={3000000}>
                    3.000.000 đồng (Suất học bổng Khuyến tài đặc biệt)
                  </option>
                </select>
              </div>

              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-600 text-[11px] space-y-1">
                <div>
                  - Nguồn kinh phí:{" "}
                  <strong>
                    Quỹ Khuyến học &amp; Khuyến tài Phường Phú Cường
                  </strong>
                </div>
                <div>
                  - Đơn vị trao: UBND Phường phối hợp Hội Khuyến học Phường và
                  Ban Giám hiệu nhà trường
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowTraoHocBongModal(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold cursor-pointer transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-white font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Heart className="size-3.5" />
                  <span>Duyệt trao học bổng</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 21: KẾ HOẠCH BẢO ĐẢM TRẬT TỰ ATGT CỔNG TRƯỜNG HỌC (CHỈ THỊ 31/CT-TTg) */}
      {showKeHoachAtgtModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white text-gray-900 rounded-xl shadow-2xl max-w-4xl w-full border border-gray-200 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-amber-700 text-white px-6 py-3.5 flex items-center justify-between no-print shrink-0 shadow-xs rounded-t-xl">
              <div className="flex items-center gap-2">
                <TrafficCone className="size-5" />
                <h3 className="font-bold text-sm sm:text-base">
                  Kế hoạch Phối hợp Bảo đảm Trật tự ATGT Cổng Trường học (Chỉ
                  thị 31/CT-TTg - Số 45/KH-UBND)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    exportDocAsWord(
                      "Ke_hoach_ATGT_cong_truong_Chi_thi_31",
                      "ke-hoach-atgt-content"
                    )
                  }
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Download className="size-3.5" />
                  <span>Tải Word (.doc)</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Printer className="size-3.5" />
                  <span>In Kế hoạch (Ctrl+P)</span>
                </button>
                <button
                  onClick={() => setShowKeHoachAtgtModal(false)}
                  className="text-white/80 hover:text-white p-1 rounded-md hover:bg-white/10 cursor-pointer transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            <div
              className="p-8 overflow-y-auto font-serif text-[13px] leading-relaxed select-text flex-1"
              id="ke-hoach-atgt-content"
            >
              {/* Quốc hiệu & Đơn vị ban hành */}
              <div className="grid grid-cols-2 text-center pb-4 border-b border-gray-400">
                <div>
                  <div className="font-bold uppercase text-[12px]">
                    ỦY BAN NHÂN DÂN THÀNH PHỐ THỦ DẦU MỘT
                  </div>
                  <div className="font-bold uppercase text-[13px] text-amber-900">
                    ỦY BAN NHÂN DÂN PHƯỜNG PHÚ CƯỜNG
                  </div>
                  <div className="text-[11px] font-sans mt-1">
                    Số:{" "}
                    <strong className="font-mono text-black">45/KH-UBND</strong>
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
                    Phú Cường, ngày 05 tháng 09 năm 2026
                  </div>
                </div>
              </div>

              {/* Tiêu đề Kế hoạch */}
              <div className="text-center my-6 space-y-1">
                <h2 className="text-base font-bold uppercase tracking-wide text-gray-900">
                  KẾ HOẠCH
                </h2>
                <div className="font-bold text-sm text-gray-800">
                  Phối hợp liên ngành bảo đảm trật tự, an toàn giao thông trước
                  cổng các trường học năm học 2026 - 2027 trên địa bàn Phường
                  Phú Cường
                </div>
                <div className="text-xs italic text-gray-600">
                  (Thực hiện Chỉ thị số 31/CT-TTg ngày 21/12/2023 của Thủ tướng
                  Chính phủ)
                </div>
              </div>

              <div className="space-y-3 text-justify text-xs font-serif leading-relaxed">
                <p>
                  Thực hiện Chỉ thị số 31/CT-TTg ngày 21/12/2023 của Thủ tướng
                  Chính phủ về tăng cường công tác bảo đảm trật tự, an toàn giao
                  thông cho lứa tuổi học sinh trong tình hình mới; Kế hoạch số
                  88/KH-UBND của Ủy ban nhân dân Thành phố Thủ Dầu Một;
                </p>
                <p>
                  Nhằm chủ động phòng ngừa, kiềm chế tai nạn giao thông và giải
                  quyết triệt để tình trạng ùn tắc giao thông cục bộ trước cổng
                  các trường học trong giờ cao điểm phụ huynh đưa đón học sinh;
                  Ủy ban nhân dân Phường Phú Cường ban hành Kế hoạch phối hợp
                  triển khai cụ thể như sau:
                </p>

                <h4 className="font-bold text-sm uppercase text-gray-900 pt-2 font-sans">
                  I. MỤC ĐÍCH, YÊU CẦU
                </h4>
                <div className="pl-4 space-y-1 font-sans text-gray-800">
                  <div>
                    1. 100% các trường mầm non, tiểu học, trung học cơ sở trên
                    địa bàn phường ký cam kết chấp hành nghiêm Luật Giao thông
                    đường bộ; xây dựng mô hình &ldquo;Cổng trường an toàn giao
                    thông&rdquo;.
                  </div>
                  <div>
                    2. Tuyệt đối không để xảy ra ùn tắc giao thông kéo dài trước
                    cổng trường, đặc biệt tại tuyến đường Đoàn Trần Nghiệp (cổng
                    Trường TH Phú Cường) và đường Yersin / CMT8 trong hai khung
                    giờ cao điểm: <strong>06:45 - 07:15</strong> sáng và{" "}
                    <strong>16:45 - 17:30</strong> chiều.
                  </div>
                  <div>
                    3. 100% phụ huynh học sinh ký cam kết đội mũ bảo hiểm đạt
                    chuẩn cho trẻ em từ đủ 6 tuổi trở lên khi tham gia giao
                    thông bằng mô tô, xe gắn máy, xe đạp điện; không giao xe cho
                    học sinh chưa đủ điều kiện theo quy định.
                  </div>
                </div>

                <h4 className="font-bold text-sm uppercase text-gray-900 pt-2 font-sans">
                  II. BẢNG PHÂN CÔNG LỰC LƯỢNG &amp; KHUNG GIỜ PHÂN LUỒNG TẠI
                  CÁC TRƯỜNG ĐIỂM
                </h4>
                <div className="font-sans overflow-x-auto my-2 not-italic">
                  <table className="w-full text-[11px] border-collapse border border-gray-400">
                    <thead>
                      <tr className="bg-amber-50 text-gray-800 font-bold text-center">
                        <th className="border border-gray-400 p-1.5 text-left">
                          Trường học / Địa điểm
                        </th>
                        <th className="border border-gray-400 p-1.5 text-left">
                          Tuyến đường cổng trường
                        </th>
                        <th className="border border-gray-400 p-1.5 text-center">
                          Khung giờ cao điểm
                        </th>
                        <th className="border border-gray-400 p-1.5 text-left">
                          Lực lượng liên ngành trực tiếp
                        </th>
                        <th className="border border-gray-400 p-1.5 text-center">
                          Chỉ huy chốt
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {truongCongLapList.map((tr) => (
                        <tr key={tr.id} className="hover:bg-amber-50/30">
                          <td className="border border-gray-400 p-1.5 font-bold">
                            {tr.tenTruong}
                          </td>
                          <td className="border border-gray-400 p-1.5">
                            {tr.diaChi}
                          </td>
                          <td className="border border-gray-400 p-1.5 text-center font-mono font-semibold text-amber-900">
                            {tr.gioCaoDiemPhanLuong ||
                              "06:45 - 07:15 & 16:45 - 17:30"}
                          </td>
                          <td className="border border-gray-400 p-1.5">
                            {tr.lucLuongTrucATGT ||
                              "Công an phường + Dân quân tự vệ + Đoàn thanh niên"}
                          </td>
                          <td className="border border-gray-400 p-1.5 text-center font-semibold text-gray-700">
                            Cảnh sát khu vực phụ trách
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <h4 className="font-bold text-sm uppercase text-gray-900 pt-2 font-sans">
                  III. PHÂN CÔNG NHIỆM VỤ CỤ THỂ
                </h4>
                <div className="pl-4 space-y-1.5 font-sans text-gray-800">
                  <div>
                    <strong>1. Công an Phường Phú Cường:</strong> Chủ trì bố trí
                    cán bộ, chiến sĩ Cảnh sát trật tự, Cảnh sát khu vực thường
                    xuyên có mặt tại cổng các trường học đúng khung giờ quy định
                    để hướng dẫn, phân luồng; kiên quyết xử lý nghiêm các trường
                    hợp phụ huynh dừng, đỗ xe ô tô, mô tô dưới lòng đường gây
                    cản trở giao thông; phối hợp Đội CSGT Công an Thành phố tuần
                    tra kiểm soát xử lý học sinh điều khiển xe không đúng độ
                    tuổi.
                  </div>
                  <div>
                    <strong>
                      2. Ban Chỉ huy Quân sự Phường (Lực lượng Dân quân):
                    </strong>{" "}
                    Huy động lực lượng Dân quân thường trực phối hợp Tổ bảo vệ
                    dân phố các khu phố 1, 2, 3, 5 tham gia điều tiết tại các
                    giao lộ xung quanh cổng trường; hướng dẫn phụ huynh đưa xe
                    vào vị trí dừng đón quy định.
                  </div>
                  <div>
                    <strong>3. Đoàn TNCS Hồ Chí Minh Phường:</strong> Triển khai
                    đội hình tình nguyện viên &ldquo;Cổng trường em an toàn
                    số&rdquo;, hỗ trợ hướng dẫn học sinh qua đường an toàn và
                    tuyên truyền văn hóa giao thông qua bảng quét mã QR Thông điệp
                    ATGT.
                  </div>
                  <div>
                    <strong>
                      4. Hiệu trưởng các trường Mầm non, Tiểu học, THCS:
                    </strong>{" "}
                    Mở rộng cổng trường tối đa trước giờ tan học 15 phút để phụ
                    huynh vào sân trường đón học sinh; kẻ vạch sơn phân ô dừng
                    đón xe mô tô trước vỉa hè; đưa nội dung chấp hành ATGT vào
                    tiêu chí thi đua của các lớp học.
                  </div>
                </div>

                <h4 className="font-bold text-sm uppercase text-gray-900 pt-2 font-sans">
                  IV. TỔ CHỨC THỰC HIỆN
                </h4>
                <p>
                  Kinh phí thực hiện trích từ nguồn ngân sách bảo đảm trật tự
                  ATGT của địa phương năm 2026. Định kỳ hằng tháng, Trưởng Công
                  an phường tổng hợp báo cáo tình hình kết quả thực hiện gửi về
                  Thường trực UBND phường để chỉ đạo kịp thời./.
                </p>
              </div>

              {/* Nơi nhận & Ký số */}
              <div className="grid grid-cols-2 pt-6 border-t border-gray-300 font-sans mt-4">
                <div className="text-[11px] text-gray-600 space-y-0.5">
                  <div className="font-bold text-gray-800">Nơi nhận:</div>
                  <div>- UBND TP. Thủ Dầu Một (b/c);</div>
                  <div>- Công an TP. Thủ Dầu Một (để b/c);</div>
                  <div>- Phòng GD&amp;ĐT TP (phối hợp);</div>
                  <div>- Đảng ủy, HĐND phường;</div>
                  <div>- Ban Chỉ huy Công an, Quân sự phường;</div>
                  <div>- BGH các trường Mầm non, TH, THCS;</div>
                  <div>- Lưu: VT, VHXH.</div>
                </div>

                <div className="text-center space-y-2">
                  <div className="font-bold text-xs uppercase text-gray-900">
                    CHỦ TỊCH
                  </div>
                  <div className="my-2 flex justify-center">
                    <DigitalSignatureBadge
                      nguoiKy="TS. Nguyễn Văn Hùng"
                      chucVu="Chủ tịch UBND Phường Phú Cường"
                      ngayKy="05/09/2026"
                      maXacThuc="CA-KH45-ATGT-2026-PC"
                    />
                  </div>
                  <div className="font-extrabold text-sm text-gray-900">
                    TS. Nguyễn Văn Hùng
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-6 py-3 border-t bg-gray-50 rounded-b-xl no-print">
              <span className="text-xs text-gray-500">
                Kế hoạch số 45/KH-UBND · Phối hợp liên ngành bảo đảm ATGT Cổng
                trường học
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    exportDocAsWord(
                      "Ke_hoach_ATGT_cong_truong_Chi_thi_31",
                      "ke-hoach-atgt-content"
                    )
                  }
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Download className="size-4" />
                  Tải file Word (.doc)
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Printer className="size-4" />
                  In Kế hoạch
                </button>
                <button
                  onClick={() => setShowKeHoachAtgtModal(false)}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-semibold rounded-lg cursor-pointer transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
