import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  School,
  FileSignature,
  Plus,
  AlertTriangle,
} from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { useAppState, appStore, hasDomainAccess } from "@/services/app-state";
import {
  type CoSoMamNonTuThuc,
  type TruongHocCongLap,
  type HoSoTTHCGiaoDuc,
} from "@/data/domain-mock";

// Modularized Components
import { GiaoDucKpiCards } from "@/components/giao-duc/GiaoDucKpiCards";
import { GiaoDucTabNav, type GiaoDucTabType } from "@/components/giao-duc/GiaoDucTabNav";
import { calculateSlaStatus } from "@/components/giao-duc/utils";

// Business Tabs
import { MamNonTab } from "@/components/giao-duc/tabs/MamNonTab";
import { TruongCongLapTab } from "@/components/giao-duc/tabs/TruongCongLapTab";
import { PhoCapKhuyenHocTab } from "@/components/giao-duc/tabs/PhoCapKhuyenHocTab";
import { TthcMotCuaTab } from "@/components/giao-duc/tabs/TthcMotCuaTab";
import { KiemThuc3BuocTab } from "@/components/giao-duc/tabs/KiemThuc3BuocTab";
import { PhoCapCongDongTab } from "@/components/giao-duc/tabs/PhoCapCongDongTab";
import { YTeCoSoVaAttpTab } from "@/components/giao-duc/tabs/YTeCoSoVaAttpTab";

// Administrative Modals
import { ModalTiepNhanHoSo } from "@/components/giao-duc/modals/ModalTiepNhanHoSo";
import { ModalGiayHen } from "@/components/giao-duc/modals/ModalGiayHen";
import { ModalPhieuBoSung } from "@/components/giao-duc/modals/ModalPhieuBoSung";
import { ModalPhieuXinLoi } from "@/components/giao-duc/modals/ModalPhieuXinLoi";
import { ModalBienBanThucDia } from "@/components/giao-duc/modals/ModalBienBanThucDia";
import { ModalToTrinhUbnd } from "@/components/giao-duc/modals/ModalToTrinhUbnd";
import { ModalQuyetDinhKySo } from "@/components/giao-duc/modals/ModalQuyetDinhKySo";
import { ModalPhieuKiemSoat } from "@/components/giao-duc/modals/ModalPhieuKiemSoat";
import { ModalMamNonActions } from "@/components/giao-duc/modals/ModalMamNonActions";
import { ModalTruongHocActions } from "@/components/giao-duc/modals/ModalTruongHocActions";

export const Route = createFileRoute("/giao-duc-dao-tao")({
  head: () => ({
    meta: [
      {
        title: "Mảng Giáo dục & Đào tạo cơ sở · UBND Phường - SLĐTBXH Bình Dương",
      },
      {
        name: "description",
        content:
          "Thẩm định cấp phép mầm non ngoài công lập theo Thông tư 49/2021/TT-BGDĐT, phối hợp quản lý tuyển sinh đầu cấp, an ninh trường học, phổ cập giáo dục chuẩn mức 3 và khuyến học cộng đồng.",
      },
    ],
  }),
  component: GiaoDucDaoTaoPage,
});

function GiaoDucDaoTaoPage() {
  const {
    currentUser,
    mamNonList,
    truongCongLapList,
    phoCapList,
    khuyenHocList,
    moHinhHocTapList,
    lopHocHTCDList,
    hoSoTTHCGiaoDucList,
  } = useAppState();

  const [activeTab, setActiveTab] = useState<GiaoDucTabType>("TTHC_MOT_CUA");

  // Bộ lọc Tab 1: Mầm non
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLoaiHinh, setFilterLoaiHinh] = useState<string>("ALL");
  const [filterKetQua, setFilterKetQua] = useState<string>("ALL");

  // Bộ lọc Tab 4: TTHC Một Cửa
  const [searchTTHC, setSearchTTHC] = useState("");
  const [filterTrangThaiTTHC, setFilterTrangThaiTTHC] = useState<string>("ALL");
  const [filterThuTucTTHC, setFilterThuTucTTHC] = useState<string>("ALL");
  const [filterSlaTTHC, setFilterSlaTTHC] = useState<"ALL" | "CON_HAN" | "SAP_TRE_HAN" | "QUA_HAN">("ALL");

  // State Modals TTHC Một Cửa (Mẫu 01 - 05, B1 - B6)
  const [showTiepNhanModal, setShowTiepNhanModal] = useState(false);
  const [viewingGiayHen, setViewingGiayHen] = useState<HoSoTTHCGiaoDuc | null>(null);
  const [viewingPhieuBoSung, setViewingPhieuBoSung] = useState<HoSoTTHCGiaoDuc | null>(null);
  const [, setInputLyDoBoSung] = useState("");
  const [, setInputHanBoSung] = useState("");
  const [viewingPhieuXinLoi, setViewingPhieuXinLoi] = useState<HoSoTTHCGiaoDuc | null>(null);
  const [, setInputLyDoXinLoi] = useState("");
  const [, setInputNgayHenMoi] = useState("");
  const [viewingBienBanThucDia, setViewingBienBanThucDia] = useState<HoSoTTHCGiaoDuc | null>(null);
  const [, setInputThucDiaTruongDoan] = useState("ThS. Trần Thị Kim Oanh (Công chức GD-ĐT)");
  const [, setInputThucDiaYTe] = useState("BS. Nguyễn Văn Hào (Trạm Y tế)");
  const [, setInputThucDiaPCCC] = useState("Đại úy Phạm Quốc Tuấn (Công an phường)");
  const [, setInputThucDiaKetLuan] = useState<"DAT_YEU_CAU" | "CHUA_DAT_YEU_CAU">("DAT_YEU_CAU");
  const [, setInputThucDiaNoiDung] = useState("");
  const [viewingToTrinh, setViewingToTrinh] = useState<HoSoTTHCGiaoDuc | null>(null);
  const [, setInputSoToTrinh] = useState("");
  const [, setInputNoiDungToTrinh] = useState("");
  const [viewingQuyetDinh, setViewingQuyetDinh] = useState<HoSoTTHCGiaoDuc | null>(null);
  const [viewingPhieuKiemSoat, setViewingPhieuKiemSoat] = useState<HoSoTTHCGiaoDuc | null>(null);

  // State Modals Mầm non ngoài công lập
  const [showAddMamNonModal, setShowAddMamNonModal] = useState(false);
  const [viewingMn, setViewingMn] = useState<CoSoMamNonTuThuc | null>(null);
  const [inspectingMn, setInspectingMn] = useState<CoSoMamNonTuThuc | null>(null);
  const [, setInspectResult] = useState<CoSoMamNonTuThuc["ketQuaKiemTraCuoi"]>("DAT_CHUAN_AN_TOAN");
  const [, setInspectNotes] = useState("");
  const [viewingDinhChiMn, setViewingDinhChiMn] = useState<CoSoMamNonTuThuc | null>(null);
  const [, setInputLyDoDinhChi] = useState("");
  const [viewingPhucHoiMn, setViewingPhucHoiMn] = useState<CoSoMamNonTuThuc | null>(null);
  const [, setInputNoiDungPhucHoi] = useState("");
  const [showBaoCaoQuanLyMamNonModal, setShowBaoCaoQuanLyMamNonModal] = useState(false);

  // State Modals Trường học & Khuyến học
  const [showBaoCaoPhoCapModal, setShowBaoCaoPhoCapModal] = useState(false);
  const [showAddLopHocModal, setShowAddLopHocModal] = useState(false);
  const [editingSchoolAtgt, setEditingSchoolAtgt] = useState<TruongHocCongLap | null>(null);
  const [, setLucLuongAtgt] = useState("");
  const [, setGioPhanLuong] = useState("");
  const [showKeHoachTuyenSinhModal, setShowKeHoachTuyenSinhModal] = useState(false);
  const [showKeHoachAtgtModal, setShowKeHoachAtgtModal] = useState(false);
  const [showCongNhanHocTapModal, setShowCongNhanHocTapModal] = useState(false);
  const [showTraoHocBongModal, setShowTraoHocBongModal] = useState(false);

  const hasAccess = hasDomainAccess(currentUser, "GD_DT");

  // Lọc cơ sở mầm non
  const filteredMamNonList = mamNonList.filter((mn) => {
    const matchSearch =
      mn.tenCoSo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mn.chuCoSo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mn.diaChi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mn.khuPho.toLowerCase().includes(searchTerm.toLowerCase());
    const matchLoai = filterLoaiHinh === "ALL" || mn.loaiHinh === filterLoaiHinh;
    const matchKetQua = filterKetQua === "ALL" || mn.ketQuaKiemTraCuoi === filterKetQua;
    return matchSearch && matchLoai && matchKetQua;
  });

  // Lọc danh sách hồ sơ TTHC Giáo dục Một cửa (Tìm kiếm, Trạng thái, Thủ tục, SLA Thời hạn)
  const filteredTTHCList = hoSoTTHCGiaoDucList.filter((h) => {
    const matchSearch =
      h.maHoSo.toLowerCase().includes(searchTTHC.toLowerCase()) ||
      h.nguoiNop.toLowerCase().includes(searchTTHC.toLowerCase()) ||
      h.tenCoSoDeNghi.toLowerCase().includes(searchTTHC.toLowerCase()) ||
      h.cccd.includes(searchTTHC) ||
      h.soDienThoai.includes(searchTTHC);
    const matchTrangThai = filterTrangThaiTTHC === "ALL" || h.trangThai === filterTrangThaiTTHC;
    const matchThuTuc = filterThuTucTTHC === "ALL" || h.maThuTuc === filterThuTucTTHC;

    const sla = calculateSlaStatus(h.ngayHenTra, h.trangThai);
    const matchSla =
      filterSlaTTHC === "ALL" ||
      (filterSlaTTHC === "QUA_HAN" && sla.status === "QUA_HAN") ||
      (filterSlaTTHC === "SAP_TRE_HAN" && sla.status === "SAP_TRE_HAN") ||
      (filterSlaTTHC === "CON_HAN" && (sla.status === "CON_HAN" || sla.status === "DA_HOAN_THANH"));

    return matchSearch && matchTrangThai && matchThuTuc && matchSla;
  });

  return (
    <AppShell>
      <PageHeader
        eyebrow="Bộ phận Chuyên môn Giáo dục & Y tế · Phòng Văn hóa - Xã hội P. Thủ Dầu Một"
        title="Quản lý Giáo dục Đào tạo, Y tế cơ sở & An toàn thực phẩm"
        right={
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
              <School className="size-3.5 text-emerald-600" />
              Chuẩn Phổ cập GD Mức 3
            </span>
            <button
              onClick={() => {
                setActiveTab("TTHC_MOT_CUA");
                setShowTiepNhanModal(true);
              }}
              className="flex items-center gap-1.5 rounded-md bg-[#dd4b39] hover:bg-[#c23321] px-3.5 py-2 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer"
            >
              <FileSignature className="size-3.5" />
              Tiếp nhận Hồ sơ TTHC Giáo dục
            </button>
            <button
              onClick={() => setShowAddMamNonModal(true)}
              className="flex items-center gap-1.5 rounded-md bg-white border border-gray-300 hover:bg-gray-50 px-3 py-2 text-xs font-bold text-gray-700 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="size-3.5 text-gray-500" />
              Cấp phép nhanh
            </button>
          </div>
        }
      />

      {/* Cảnh báo phân quyền nếu tài khoản không có quyền */}
      {!hasAccess && (
        <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 p-3.5 text-amber-900 flex items-start justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="size-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <strong className="font-bold">Lưu ý phân quyền:</strong> Tài khoản của bạn hiện chưa được phân công phụ trách{" "}
              <strong>Mảng Giáo dục &amp; Đào tạo cơ sở</strong>. Bạn đang xem ở chế độ quan sát dữ liệu.
            </div>
          </div>
          <button
            onClick={() => {
              appStore.switchRole("CB_GIAO_DUC");
              toast.success("Đã chuyển sang tài khoản Cán bộ Giáo dục (ThS. Trần Thị Kim Oanh)!");
            }}
            className="shrink-0 px-2.5 py-1 rounded-md bg-amber-600 text-white hover:bg-amber-700 text-xs font-bold transition-colors cursor-pointer"
          >
            Đổi sang TK Phụ trách ↗
          </button>
        </div>
      )}

      {/* 4 Khối KPI Thống kê Số liệu Đầu kỳ & Hiện tại */}
      <GiaoDucKpiCards
        mamNonList={mamNonList}
        truongCongLapList={truongCongLapList}
      />

      {/* Thanh điều hướng Tab nghiệp vụ trực quan với badge và alert */}
      <GiaoDucTabNav
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        hoSoTTHCGiaoDucList={hoSoTTHCGiaoDucList}
        mamNonCount={mamNonList.length}
      />

      {/* TAB 1: MẦM NON NGOÀI CÔNG LẬP */}
      {activeTab === "MAM_NON_TU_THUC" && (
        <MamNonTab
          filteredMamNonList={filteredMamNonList}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterLoaiHinh={filterLoaiHinh}
          setFilterLoaiHinh={setFilterLoaiHinh}
          filterKetQua={filterKetQua}
          setFilterKetQua={setFilterKetQua}
          setShowBaoCaoQuanLyMamNonModal={setShowBaoCaoQuanLyMamNonModal}
          setViewingMn={setViewingMn}
          setInspectingMn={setInspectingMn}
          setInspectResult={setInspectResult}
          setInspectNotes={setInspectNotes}
          setViewingDinhChiMn={setViewingDinhChiMn}
          setInputLyDoDinhChi={setInputLyDoDinhChi}
          setViewingPhucHoiMn={setViewingPhucHoiMn}
          setInputNoiDungPhucHoi={setInputNoiDungPhucHoi}
        />
      )}

      {/* TAB 2: TRƯỜNG HỌC & TUYỂN SINH ĐẦU CẤP */}
      {activeTab === "TRUONG_CONG_LAP" && (
        <TruongCongLapTab
          truongCongLapList={truongCongLapList}
          setShowKeHoachTuyenSinhModal={setShowKeHoachTuyenSinhModal}
          setShowKeHoachAtgtModal={setShowKeHoachAtgtModal}
          setEditingSchoolAtgt={setEditingSchoolAtgt}
          setLucLuongAtgt={setLucLuongAtgt}
          setGioPhanLuong={setGioPhanLuong}
        />
      )}

      {/* TAB 3: PHỔ CẬP GIÁO DỤC, XÓA MÙ CHỮ & KHUYẾN HỌC */}
      {activeTab === "PHO_CAP_KHUYEN_HOC" && (
        <PhoCapKhuyenHocTab
          phoCapList={phoCapList}
          moHinhHocTapList={moHinhHocTapList}
          khuyenHocList={khuyenHocList}
          lopHocHTCDList={lopHocHTCDList}
          setShowBaoCaoPhoCapModal={setShowBaoCaoPhoCapModal}
          setShowCongNhanHocTapModal={setShowCongNhanHocTapModal}
          setShowTraoHocBongModal={setShowTraoHocBongModal}
          setShowAddLopHocModal={setShowAddLopHocModal}
        />
      )}

      {/* TAB 4: TIẾP NHẬN & GIẢI QUYẾT HỒ SƠ TTHC GIÁO DỤC (MỘT CỬA ĐIỆN TỬ) */}
      {activeTab === "TTHC_MOT_CUA" && (
        <TthcMotCuaTab
          hoSoTTHCGiaoDucList={hoSoTTHCGiaoDucList}
          filteredTTHCList={filteredTTHCList}
          searchTTHC={searchTTHC}
          setSearchTTHC={setSearchTTHC}
          filterThuTucTTHC={filterThuTucTTHC}
          setFilterThuTucTTHC={setFilterThuTucTTHC}
          filterTrangThaiTTHC={filterTrangThaiTTHC}
          setFilterTrangThaiTTHC={setFilterTrangThaiTTHC}
          filterSlaTTHC={filterSlaTTHC}
          setFilterSlaTTHC={setFilterSlaTTHC}
          setShowTiepNhanModal={setShowTiepNhanModal}
          setViewingGiayHen={setViewingGiayHen}
          setViewingPhieuBoSung={setViewingPhieuBoSung}
          setInputLyDoBoSung={setInputLyDoBoSung}
          setInputHanBoSung={setInputHanBoSung}
          setViewingPhieuXinLoi={setViewingPhieuXinLoi}
          setInputLyDoXinLoi={setInputLyDoXinLoi}
          setInputNgayHenMoi={setInputNgayHenMoi}
          setViewingBienBanThucDia={setViewingBienBanThucDia}
          setInputThucDiaTruongDoan={setInputThucDiaTruongDoan}
          setInputThucDiaYTe={setInputThucDiaYTe}
          setInputThucDiaPCCC={setInputThucDiaPCCC}
          setInputThucDiaKetLuan={setInputThucDiaKetLuan}
          setInputThucDiaNoiDung={setInputThucDiaNoiDung}
          setViewingToTrinh={setViewingToTrinh}
          setInputSoToTrinh={setInputSoToTrinh}
          setInputNoiDungToTrinh={setInputNoiDungToTrinh}
          setViewingQuyetDinh={setViewingQuyetDinh}
          setViewingPhieuKiemSoat={setViewingPhieuKiemSoat}
        />
      )}

      {/* TAB 5: GIÁM SÁT ATTP BẾP ĂN BÁN TRÚ & KIỂM THỰC 3 BƯỚC (QĐ 1246/QĐ-BYT) */}
      {activeTab === "ATTP_BEP_AN_BAN_TRU" && (
        <KiemThuc3BuocTab />
      )}

      {/* TAB 6: PHỔ CẬP GIÁO DỤC & CỘNG ĐỒNG HỌC TẬP (NĐ 20/2014 & TT 44/2014) */}
      {activeTab === "PHO_CAP_CONG_DONG_TT44" && (
        <PhoCapCongDongTab />
      )}

      {/* TAB 7: Y TẾ CƠ SỞ, HÀNH NGHỀ Y DƯỢC TƯ NHÂN & ATTP (KHOẢN 9 ĐIỀU 3 QĐ 2698 & NĐ 148) */}
      {activeTab === "Y_TE_CO_SO_ATTP" && (
        <YTeCoSoVaAttpTab />
      )}

      {/* ==================== CÁC MODAL NGHIỆP VỤ HÀNH CHÍNH & VĂN BẢN QUY PHẠM ==================== */}

      {/* MODAL 7: TIẾP NHẬN HỒ SƠ TTHC MỚI (MỘT CỬA) */}
      <ModalTiepNhanHoSo
        isOpen={showTiepNhanModal}
        onClose={() => setShowTiepNhanModal(false)}
        onSuccess={(newHoSo) => {
          setShowTiepNhanModal(false);
          setViewingGiayHen(newHoSo);
        }}
        existingCount={hoSoTTHCGiaoDucList.length}
      />

      {/* MODAL 8: GIẤY HẸN TRẢ KẾT QUẢ MẪU 01/NĐ-61 */}
      <ModalGiayHen
        hoSo={viewingGiayHen}
        onClose={() => setViewingGiayHen(null)}
      />

      {/* MODAL 9: PHIẾU YÊU CẦU BỔ SUNG HỒ SƠ MẪU 02 */}
      <ModalPhieuBoSung
        hoSo={viewingPhieuBoSung}
        onClose={() => setViewingPhieuBoSung(null)}
      />

      {/* MODAL 20: PHIẾU XIN LỖI VÀ HẸN LẠI NGÀY TRẢ KẾT QUẢ MẪU 04 */}
      <ModalPhieuXinLoi
        hoSo={viewingPhieuXinLoi}
        onClose={() => setViewingPhieuXinLoi(null)}
      />

      {/* MODAL 10: BIÊN BẢN KIỂM TRA THỰC ĐỊA LIÊN NGÀNH */}
      <ModalBienBanThucDia
        hoSo={viewingBienBanThucDia}
        onClose={() => setViewingBienBanThucDia(null)}
      />

      {/* MODAL 11: TỜ TRÌNH ĐỀ NGHỊ PHÊ DUYỆT CỦA CÔNG CHỨC TRÌNH CHỦ TỊCH */}
      <ModalToTrinhUbnd
        hoSo={viewingToTrinh}
        onClose={() => setViewingToTrinh(null)}
      />

      {/* MODAL 12: QUYẾT ĐỊNH CHO PHÉP THÀNH LẬP / CHÍNH SÁCH VỚI KÝ SỐ SMARTCA */}
      <ModalQuyetDinhKySo
        hoSo={viewingQuyetDinh}
        onClose={() => setViewingQuyetDinh(null)}
        onKySoSuccess={() => {
          const updated = appStore.getState().hoSoTTHCGiaoDucList.find((h) => h.id === viewingQuyetDinh?.id);
          if (updated) setViewingQuyetDinh(updated);
        }}
      />

      {/* MODAL 13: PHIẾU KIỂM SOÁT QUÁ TRÌNH GIẢI QUYẾT HỒ SƠ MẪU 05 */}
      <ModalPhieuKiemSoat
        hoSo={viewingPhieuKiemSoat}
        onClose={() => setViewingPhieuKiemSoat(null)}
      />

      {/* NHÓM MODALS CHO MẦM NON: CẤP PHÉP, XEM HỒ SƠ, BIÊN BẢN KT, ĐÌNH CHỈ, PHỤC HỒI, BÁO CÁO 32 */}
      <ModalMamNonActions
        showAddMamNonModal={showAddMamNonModal}
        setShowAddMamNonModal={setShowAddMamNonModal}
        viewingMn={viewingMn}
        setViewingMn={setViewingMn}
        inspectingMn={inspectingMn}
        setInspectingMn={setInspectingMn}
        viewingDinhChiMn={viewingDinhChiMn}
        setViewingDinhChiMn={setViewingDinhChiMn}
        viewingPhucHoiMn={viewingPhucHoiMn}
        setViewingPhucHoiMn={setViewingPhucHoiMn}
        showBaoCaoQuanLyMamNonModal={showBaoCaoQuanLyMamNonModal}
        setShowBaoCaoQuanLyMamNonModal={setShowBaoCaoQuanLyMamNonModal}
        mamNonList={mamNonList}
      />

      {/* NHÓM MODALS CHO TRƯỜNG HỌC & KHUYẾN HỌC: BÁO CÁO PCGD, ATGT CỔNG TRƯỜNG, HTCĐ, TUYỂN SINH, GIA ĐÌNH HỌC TẬP, HỌC BỔNG */}
      <ModalTruongHocActions
        showBaoCaoPhoCapModal={showBaoCaoPhoCapModal}
        setShowBaoCaoPhoCapModal={setShowBaoCaoPhoCapModal}
        editingSchoolAtgt={editingSchoolAtgt}
        setEditingSchoolAtgt={setEditingSchoolAtgt}
        showAddLopHocModal={showAddLopHocModal}
        setShowAddLopHocModal={setShowAddLopHocModal}
        showKeHoachTuyenSinhModal={showKeHoachTuyenSinhModal}
        setShowKeHoachTuyenSinhModal={setShowKeHoachTuyenSinhModal}
        showCongNhanHocTapModal={showCongNhanHocTapModal}
        setShowCongNhanHocTapModal={setShowCongNhanHocTapModal}
        showTraoHocBongModal={showTraoHocBongModal}
        setShowTraoHocBongModal={setShowTraoHocBongModal}
        showKeHoachAtgtModal={showKeHoachAtgtModal}
        setShowKeHoachAtgtModal={setShowKeHoachAtgtModal}
        truongCongLapList={truongCongLapList}
      />
    </AppShell>
  );
}
