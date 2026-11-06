import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  HeartHandshake,
  Plus,
  Flame,
  AlertTriangle,
  FileSignature,
} from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { useAppState, appStore, hasDomainAccess } from "@/services/app-state";
import {
  type DoiTuongBaoTroXaHoi,
  type HoGheoCanGheoItem,
  type CungCauLaoDongItem,
  type TreEmHoanCanhDacBiet,
  type HoSoPhongChongTeNan,
  type HoSoCuuTroDotXuat,
  type HoSoTTHCAnSinhItem,
} from "@/data/domain-mock";
import { anSinhApi } from "@/api/anSinhApi";

// Modular UI Components
import { AnSinhKpiCards } from "@/components/an-sinh/AnSinhKpiCards";
import { AnSinhTabNav, type AnSinhTabKey } from "@/components/an-sinh/AnSinhTabNav";

// Business Tabs
import { BaoTroXaHoiTab } from "@/components/an-sinh/tabs/BaoTroXaHoiTab";
import { GiamNgheoDaChieuTab } from "@/components/an-sinh/tabs/GiamNgheoDaChieuTab";
import { LaoDongViecLamTab } from "@/components/an-sinh/tabs/LaoDongViecLamTab";
import { TreEmTab } from "@/components/an-sinh/tabs/TreEmTab";
import { TeNanXaHoiTab } from "@/components/an-sinh/tabs/TeNanXaHoiTab";
import { CuuTroDotXuatTab } from "@/components/an-sinh/tabs/CuuTroDotXuatTab";
import { TthcMotCuaAnSinhTab } from "@/components/an-sinh/tabs/TthcMotCuaAnSinhTab";
import { DieuDuongNccTab } from "@/components/an-sinh/tabs/DieuDuongNccTab";
import { ThoCungKhuyetTatTab } from "@/components/an-sinh/tabs/ThoCungKhuyetTatTab";

// Administrative Modals
import { ModalThemBaoTro } from "@/components/an-sinh/modals/ModalThemBaoTro";
import { ModalThoiHuongBaoTro } from "@/components/an-sinh/modals/ModalThoiHuongBaoTro";
import { ModalChamDiemHoNgheo } from "@/components/an-sinh/modals/ModalChamDiemHoNgheo";
import { ModalKetNoiViecLam } from "@/components/an-sinh/modals/ModalKetNoiViecLam";
import { ModalKeHoachCanThiepTreEm } from "@/components/an-sinh/modals/ModalKeHoachCanThiepTreEm";
import { ModalTiepNhanCuuTro } from "@/components/an-sinh/modals/ModalTiepNhanCuuTro";
import { ModalTiepNhanTthcAnSinh } from "@/components/an-sinh/modals/ModalTiepNhanTthcAnSinh";
import { ModalKySoSmartCAAnSinh } from "@/components/an-sinh/modals/ModalKySoSmartCAAnSinh";
import { ModalXemQuyetDinhAnSinh } from "@/components/an-sinh/modals/ModalXemQuyetDinhAnSinh";
import { ModalXetNghiemTeNan } from "@/components/an-sinh/modals/ModalXetNghiemTeNan";
import { QuyetDinhBaoTroXaHoiModal } from "@/components/QuyetDinhBaoTroXaHoiModal";

export const Route = createFileRoute("/an-sinh-xa-hoi")({
  head: () => ({
    meta: [
      {
        title: "Mảng Lao động, Người có công & An sinh xã hội · UBND Phường - SLĐTBXH Bình Dương",
      },
      {
        name: "description",
        content:
          "Quản lý hồ sơ chính sách Người có công, Bảo trợ xã hội (NĐ 20/2021), Cứu trợ khẩn cấp, Giảm nghèo đa chiều (QĐ 24/2021), Việc làm quân nhân xuất ngũ (TT 01/2022), Chăm sóc bảo vệ trẻ em (NĐ 56/2017) và Bộ phận Một cửa liên thông điện tử.",
      },
    ],
  }),
  component: AnSinhXaHoiPage,
});

function AnSinhXaHoiPage() {
  const {
    currentUser,
    hoSoList,
    baoTroList,
    cuuTroList,
    hoGheoList,
    cungCauLaoDongList,
    atLaoDongList,
    treEmList,
    teNanList,
    hoSoTTHCAnSinhList,
    dieuDuongNccList,
  } = useAppState();

  const [activeTab, setActiveTab] = useState<AnSinhTabKey>("BAO_TRO_XA_HOI");

  // Modal State triggers
  const [showAddBaoTroModal, setShowAddBaoTroModal] = useState(false);
  const [thoiHuongItem, setThoiHuongItem] = useState<DoiTuongBaoTroXaHoi | null>(null);
  const [chamDiemItem, setChamDiemItem] = useState<HoGheoCanGheoItem | null>(null);
  const [ketNoiViecLamItem, setKetNoiViecLamItem] = useState<CungCauLaoDongItem | null>(null);
  const [canThiepTreEmItem, setCanThiepTreEmItem] = useState<TreEmHoanCanhDacBiet | null>(null);
  const [xetNghiemTeNanItem, setXetNghiemTeNanItem] = useState<HoSoPhongChongTeNan | null>(null);
  const [showAddCuuTroModal, setShowAddCuuTroModal] = useState(false);
  const [showAddTthcModal, setShowAddTthcModal] = useState(false);
  const [signingTthcItem, setSigningTthcItem] = useState<HoSoTTHCAnSinhItem | null>(null);
  const [viewingQuyetDinhItem, setViewingQuyetDinhItem] = useState<HoSoTTHCAnSinhItem | null>(null);
  const [selectedDoiTuongQd, setSelectedDoiTuongQd] = useState<DoiTuongBaoTroXaHoi | null>(null);

  const hasAccess =
    hasDomainAccess(currentUser, "LDTBXH_AN_SINH") || hasDomainAccess(currentUser, "LDTBXH_NCC");

  // Modal Handlers
  const handleCreateBaoTro = (data: Partial<DoiTuongBaoTroXaHoi>) => {
    anSinhApi.createBaoTro(data);
    toast.success("Đã tiếp nhận đối tượng và ban hành quyết định trợ cấp BTXH!", {
      description: `${data.hoTen} (${data.tenLoaiDoiTuong})`,
    });
    setShowAddBaoTroModal(false);
  };

  const handleThoiHuongBaoTro = (id: string, lyDo: string, soQuyetDinh: string) => {
    anSinhApi.thoiHuongBaoTro(id, lyDo, soQuyetDinh);
    toast.success("Đã ban hành Quyết định thôi hưởng trợ cấp bảo trợ xã hội!", {
      description: `Số QĐ: ${soQuyetDinh} · ${lyDo}`,
    });
    setThoiHuongItem(null);
  };

  const handleChamDiemHoNgheo = (
    id: string,
    phanLoai: HoGheoCanGheoItem["phanLoai"],
    chieuThieuHut: string[],
    soTienVayCSXHVND?: number
  ) => {
    anSinhApi.chamDiemHoNgheo(id, phanLoai, chieuThieuHut, soTienVayCSXHVND);
    toast.success("Đã cập nhật kết quả rà soát chấm điểm hộ nghèo đa chiều (QĐ 24/2021)!");
    setChamDiemItem(null);
  };

  const handleKetNoiViecLam = (
    id: string,
    doanhNghiepTuyenDung: string,
    mucLuongKyVong: string
  ) => {
    anSinhApi.ketNoiViecLam(id, doanhNghiepTuyenDung, mucLuongKyVong);
    toast.success("Đã cấp Giấy giới thiệu và kết nối việc làm KCN thành công!", {
      description: `${doanhNghiepTuyenDung} · Dự kiến: ${mucLuongKyVong}`,
    });
    setKetNoiViecLamItem(null);
  };

  const handleCanThiepTreEm = (id: string, noiDungCanThiep: string) => {
    anSinhApi.lapKeHoachCanThiepTreEm(id, noiDungCanThiep);
    toast.success("Chủ tịch UBND Phường đã phê duyệt Kế hoạch can thiệp bảo vệ trẻ em (Mẫu số 01)!", {
      description: noiDungCanThiep,
    });
    setCanThiepTreEmItem(null);
  };

  const handleXetNghiemTeNan = (
    id: string,
    ketQua: "AM_TINH" | "DUONG_TINH",
    hoTroMoi: string
  ) => {
    anSinhApi.capNhatXetNghiemTeNan(id, ketQua, hoTroMoi);
    toast.success("Đã cập nhật kết quả xét nghiệm định kỳ vào hồ sơ quản lý!", {
      description: `Kết quả: ${ketQua === "AM_TINH" ? "Âm tính (Tốt)" : "Dương tính"}`,
    });
    setXetNghiemTeNanItem(null);
  };

  const handleCreateCuuTro = (data: Partial<HoSoCuuTroDotXuat>) => {
    anSinhApi.createCuuTro(data);
    toast.success("Đã phê duyệt và phát tiền/gạo cứu trợ đột xuất khẩn cấp!", {
      description: `Cấp hỗ trợ cho hộ ${data.hoTenChuHo}`,
    });
    setShowAddCuuTroModal(false);
  };

  const handleCreateTthc = (data: Partial<HoSoTTHCAnSinhItem>) => {
    anSinhApi.createTthc(data);
    toast.success("Đã tiếp nhận hồ sơ Một cửa và in Giấy tiếp nhận & hẹn trả kết quả (Mẫu 01)!", {
      description: `${data.tenThuTuc} · Người nộp: ${data.nguoiNop}`,
    });
    setShowAddTthcModal(false);
  };

  const handleKySoTthc = (
    id: string,
    quyetDinhData: NonNullable<HoSoTTHCAnSinhItem["quyetDinhKySo"]>
  ) => {
    anSinhApi.kySoTthc(id, quyetDinhData);
    toast.success("Lãnh đạo UBND Phường đã ký số điện tử công vụ phê chuẩn kết quả TTHC!", {
      description: `Số: ${quyetDinhData.soQuyetDinh} · Chữ ký số xác thực hợp lệ`,
    });
    setSigningTthcItem(null);
  };

  return (
    <AppShell activeDomain="LDTBXH_AN_SINH">
      <div className="space-y-4 sm:space-y-6">
        <PageHeader
          eyebrow="Phân hệ Nghiệp vụ 3 · Lao động, Người có công & An sinh xã hội cơ sở"
          title="Quản lý Lao động, Người có công & An sinh xã hội"
          right={
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowAddTthcModal(true)}
                className="flex items-center gap-1.5 rounded-md bg-teal-600 hover:bg-teal-700 px-3 py-1.5 text-xs font-bold text-white shadow-xs transition-colors"
              >
                <FileSignature className="size-3.5" />
                Tiếp nhận Một cửa (Mẫu 01)
              </button>
              <button
                onClick={() => setShowAddCuuTroModal(true)}
                className="flex items-center gap-1.5 rounded-md bg-orange-600 hover:bg-orange-700 px-3 py-1.5 text-xs font-bold text-white shadow-xs transition-colors"
              >
                <Flame className="size-3.5" />
                Cứu trợ khẩn cấp
              </button>
              <button
                onClick={() => setShowAddBaoTroModal(true)}
                className="flex items-center gap-1.5 rounded-md bg-[#dd4b39] hover:bg-[#c23321] px-3 py-1.5 text-xs font-bold text-white shadow-xs transition-colors"
              >
                <Plus className="size-3.5" />
                Tiếp nhận BTXH (NĐ 20)
              </button>
            </div>
          }
        />

        {/* Cảnh báo phân quyền nếu tài khoản không có quyền */}
        {!hasAccess && (
          <div className="rounded-md border border-amber-300 bg-amber-50 p-3.5 text-amber-900 flex items-start justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="size-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <strong className="font-bold">Lưu ý phân quyền:</strong> Tài khoản của bạn hiện chưa được phân công phụ trách{" "}
                <strong>Mảng Lao động &amp; An sinh xã hội</strong>. Bạn đang xem ở chế độ quan sát dữ liệu.
              </div>
            </div>
            <button
              onClick={() => {
                appStore.switchRole("CB_AN_SINH");
                toast.success("Đã chuyển sang tài khoản Cán bộ Lao động & An sinh (Lê Hoàng Nam)!");
              }}
              className="shrink-0 px-2.5 py-1 rounded bg-amber-600 text-white hover:bg-amber-700 text-xs font-bold transition-colors"
            >
              Đổi sang TK Phụ trách ↗
            </button>
          </div>
        )}

        {/* 1. KPI Cards */}
        <AnSinhKpiCards
          hoSoList={hoSoList}
          baoTroList={baoTroList}
          hoGheoList={hoGheoList}
          cungCauList={cungCauLaoDongList}
          treEmList={treEmList}
          teNanList={teNanList}
          cuuTroList={cuuTroList}
          tthcList={hoSoTTHCAnSinhList}
        />

        {/* 2. Tab Navigation & Content Container */}
        <div className="space-y-4">
          <AnSinhTabNav
            activeTab={activeTab}
            onChangeTab={(t) => setActiveTab(t)}
            counts={{
              baoTro: baoTroList.length,
              dieuDuong: (dieuDuongNccList || []).length,
              hoGheo: hoGheoList.length,
              laoDong: cungCauLaoDongList.length,
              treEm: treEmList.length,
              teNan: teNanList.length,
              cuuTro: cuuTroList.length,
              tthc: hoSoTTHCAnSinhList.length,
            }}
          />

          {/* 3. Business Tab Views */}
          {activeTab === "BAO_TRO_XA_HOI" && (
            <BaoTroXaHoiTab
              baoTroList={baoTroList}
              onOpenAddModal={() => setShowAddBaoTroModal(true)}
              onOpenThoiHuongModal={(item) => setThoiHuongItem(item)}
              onOpenQuyetDinhModal={(item) => setSelectedDoiTuongQd(item)}
            />
          )}

          {activeTab === "DIEU_DUONG_NCC" && (
            <DieuDuongNccTab />
          )}

          {activeTab === "THO_CUNG_KHUYET_TAT" && (
            <ThoCungKhuyetTatTab />
          )}

          {activeTab === "GIAM_NGHEO_DA_CHIEU" && (
            <GiamNgheoDaChieuTab
              hoGheoList={hoGheoList}
              onOpenChamDiemModal={(item) => setChamDiemItem(item)}
            />
          )}

          {activeTab === "LAO_DONG_VIEC_LAM" && (
            <LaoDongViecLamTab
              cungCauList={cungCauLaoDongList}
              atLaoDongList={atLaoDongList}
              onOpenKetNoiModal={(item) => setKetNoiViecLamItem(item)}
            />
          )}

          {activeTab === "TRE_EM_HOAN_CANH" && (
            <TreEmTab
              treEmList={treEmList}
              onOpenCanThiepModal={(item) => setCanThiepTreEmItem(item)}
            />
          )}

          {activeTab === "TE_NAN_XA_HOI" && (
            <TeNanXaHoiTab
              teNanList={teNanList}
              onOpenXetNghiemModal={(item) => setXetNghiemTeNanItem(item)}
            />
          )}

          {activeTab === "CUU_TRO_DOT_XUAT" && (
            <CuuTroDotXuatTab
              cuuTroList={cuuTroList}
              onOpenAddModal={() => setShowAddCuuTroModal(true)}
            />
          )}

          {activeTab === "TTHC_MOT_CUA_AN_SINH" && (
            <TthcMotCuaAnSinhTab
              tthcList={hoSoTTHCAnSinhList}
              onOpenAddModal={() => setShowAddTthcModal(true)}
              onOpenKySoModal={(item) => setSigningTthcItem(item)}
              onViewQuyetDinh={(item) => setViewingQuyetDinhItem(item)}
            />
          )}
        </div>
      </div>

      {/* 4. Administrative Modals */}
      <ModalThemBaoTro
        isOpen={showAddBaoTroModal}
        onClose={() => setShowAddBaoTroModal(false)}
        onSubmit={handleCreateBaoTro}
      />

      <ModalThoiHuongBaoTro
        item={thoiHuongItem}
        onClose={() => setThoiHuongItem(null)}
        onSubmit={handleThoiHuongBaoTro}
      />

      <ModalChamDiemHoNgheo
        item={chamDiemItem}
        onClose={() => setChamDiemItem(null)}
        onSubmit={handleChamDiemHoNgheo}
      />

      <ModalKetNoiViecLam
        item={ketNoiViecLamItem}
        onClose={() => setKetNoiViecLamItem(null)}
        onSubmit={handleKetNoiViecLam}
      />

      <ModalKeHoachCanThiepTreEm
        item={canThiepTreEmItem}
        onClose={() => setCanThiepTreEmItem(null)}
        onSubmit={handleCanThiepTreEm}
      />

      <ModalXetNghiemTeNan
        item={xetNghiemTeNanItem}
        onClose={() => setXetNghiemTeNanItem(null)}
        onSubmit={handleXetNghiemTeNan}
      />

      <ModalTiepNhanCuuTro
        isOpen={showAddCuuTroModal}
        onClose={() => setShowAddCuuTroModal(false)}
        onSubmit={handleCreateCuuTro}
      />

      <ModalTiepNhanTthcAnSinh
        isOpen={showAddTthcModal}
        onClose={() => setShowAddTthcModal(false)}
        onSubmit={handleCreateTthc}
      />

      <ModalKySoSmartCAAnSinh
        item={signingTthcItem}
        onClose={() => setSigningTthcItem(null)}
        onSubmit={handleKySoTthc}
      />

      <ModalXemQuyetDinhAnSinh
        item={viewingQuyetDinhItem}
        onClose={() => setViewingQuyetDinhItem(null)}
      />

      <QuyetDinhBaoTroXaHoiModal
        isOpen={Boolean(selectedDoiTuongQd)}
        onClose={() => setSelectedDoiTuongQd(null)}
        doiTuong={selectedDoiTuongQd}
      />
    </AppShell>
  );
}
