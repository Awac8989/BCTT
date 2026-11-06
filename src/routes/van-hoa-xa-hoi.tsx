import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Landmark, ShieldAlert, Sparkles, Building2, LayoutDashboard, MessagesSquare } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { useAppState, appStore, hasDomainAccess } from "@/services/app-state";
import { vanHoaApi } from "@/api/vanHoaApi";
import {
  type GiaDinhVanHoaItem,
  type DiTichLeHoiItem,
  type CoSoDichVuVanHoaItem,
  type HoSoBaoLucGiaDinhItem,
  type HoSoTTHCVanHoaItem,
  type LangNgheTruyenThongItem,
} from "@/data/domain-mock";

// Modular UI Components
import { VanHoaKpiCards } from "@/components/van-hoa/VanHoaKpiCards";
import { VanHoaTabNav, type VanHoaTabKey } from "@/components/van-hoa/VanHoaTabNav";

// Modular Business Tabs
import { GiaDinhKhuPhoTab } from "@/components/van-hoa/tabs/GiaDinhKhuPhoTab";
import { DiTichLeHoiTab } from "@/components/van-hoa/tabs/DiTichLeHoiTab";
import { LangNgheDiSanTab } from "@/components/van-hoa/tabs/LangNgheDiSanTab";
import { GisBanDoVanHoaTab } from "@/components/van-hoa/tabs/GisBanDoVanHoaTab";
import { TonGiaoTinNguongTab } from "@/components/van-hoa/tabs/TonGiaoTinNguongTab";
import { KiemTra814Tab } from "@/components/van-hoa/tabs/KiemTra814Tab";
import { ThietCheDonCaTaiTuTab } from "@/components/van-hoa/tabs/ThietCheDonCaTaiTuTab";
import { BaoLucGiaDinhTab } from "@/components/van-hoa/tabs/BaoLucGiaDinhTab";
import { TthcMotCuaVanHoaTab } from "@/components/van-hoa/tabs/TthcMotCuaVanHoaTab";
import { DoThiVanMinhTab } from "@/components/van-hoa/tabs/DoThiVanMinhTab";
import { NgheNhanTheThaoTab } from "@/components/van-hoa/tabs/NgheNhanTheThaoTab";

// Modular Interactive Modals
import { ModalBinhXetGiaDinh } from "@/components/van-hoa/modals/ModalBinhXetGiaDinh";
import { ModalDangKyGiaDinh } from "@/components/van-hoa/modals/ModalDangKyGiaDinh";
import { ModalChiTietDiTichQr } from "@/components/van-hoa/modals/ModalChiTietDiTichQr";
import { ModalKiemTra814 } from "@/components/van-hoa/modals/ModalKiemTra814";
import { ModalQuyetDinhCamTiepXuc } from "@/components/van-hoa/modals/ModalQuyetDinhCamTiepXuc";
import { ModalTiepNhanTthcVanHoa } from "@/components/van-hoa/modals/ModalTiepNhanTthcVanHoa";
import { ModalKySoSmartCA } from "@/components/van-hoa/modals/ModalKySoSmartCA";

export const Route = createFileRoute("/van-hoa-xa-hoi")({
  head: () => ({
    meta: [
      {
        title: "Văn hóa, Thể thao & Đời sống Văn minh Đô thị · UBND Phường Thủ Dầu Một",
      },
      {
        name: "description",
        content:
          "Hệ thống quản lý toàn diện Văn hóa - Xã hội: Gia đình văn hóa (NĐ 86/2023), Di tích & Lễ hội Chùa Bà, Làng nghề Sơn mài, Bản đồ số GIS, Quản lý Tôn giáo, Hậu kiểm liên ngành 814 Karaoke, PC Bạo lực gia đình và Một cửa liên thông SmartCA.",
      },
    ],
  }),
  component: VanHoaXaHoiPage,
});

function VanHoaXaHoiPage() {
  const {
    currentUser,
    giaDinhVanHoaList,
    khuPhoVanHoaList,
    diTichLeHoiList,
    coSoTonGiaoList,
    coSoDichVuVanHoaList,
    thietCheVanHoaList,
    diaChiTinCayList,
    langNgheList,
    gisDiaDiemList,
    baoLucGiaDinhList,
    hoSoTTHCVanHoaList,
    doThiVanMinhList,
  } = useAppState();

  const [activeTab, setActiveTab] = useState<VanHoaTabKey>("GIA_DINH_KHU_PHO");

  // Modal State Triggers
  const [showAddGdvModal, setShowAddGdvModal] = useState(false);
  const [evaluatingGdv, setEvaluatingGdv] = useState<GiaDinhVanHoaItem | null>(null);
  const [viewingDiTich, setViewingDiTich] = useState<DiTichLeHoiItem | null>(null);
  const [inspectingCoSo, setInspectingCoSo] = useState<CoSoDichVuVanHoaItem | null>(null);
  const [camTiepXucHoSo, setCamTiepXucHoSo] = useState<HoSoBaoLucGiaDinhItem | null>(null);
  const [showAddTthcModal, setShowAddTthcModal] = useState(false);
  const [signingTthc, setSigningTthc] = useState<HoSoTTHCVanHoaItem | null>(null);

  const hasAccess = hasDomainAccess(currentUser, "VH_TT_DL");

  // Aggregated KPI data
  const kpiData = useMemo(() => {
    const gdDatCount = giaDinhVanHoaList.filter((g) => g.ketQua === "DAT_CHUAN").length;
    const gdKhenThuong = giaDinhVanHoaList.filter((g) => g.deNghiKhenThuong).length;
    const gdTyLe = giaDinhVanHoaList.length
      ? Number(((gdDatCount / giaDinhVanHoaList.length) * 100).toFixed(1))
      : 0;

    const kpXuatSac = khuPhoVanHoaList.filter((k) => k.danhHieu === "KHU_PHO_VAN_HOA_XUAT_SAC").length;
    const dtQuocGia = diTichLeHoiList.filter((d) => d.phanLoai === "DI_TICH_QUOC_GIA").length;

    const lnQuocGia = langNgheList.filter((l) => l.loaiDiSan === "QUOC_GIA").length;
    const lnNgheNhan = langNgheList.reduce((acc, curr) => acc + curr.soNgeNhanUuTu, 0);

    const csChapHanh = coSoDichVuVanHoaList.filter((c) => c.ketLuan === "CHUP_HANH_TOT").length;
    const csViPham = coSoDichVuVanHoaList.filter(
      (c) => c.ketLuan === "LAP_BIEN_BAN_XU_PHAT" || c.ketLuan === "TAM_DINH_CHI"
    ).length;
    const csTienPhat = coSoDichVuVanHoaList.reduce((acc, curr) => acc + curr.mucPhatVND, 0);

    const blCamTiepXuc = baoLucGiaDinhList.filter((b) => b.bienPhapBaoVe === "CAM_TIEP_XUC_UBND").length;

    return {
      giaDinh: {
        tongSoHo: giaDinhVanHoaList.length,
        datChuan: gdDatCount,
        tyLeDat: gdTyLe,
        khenThuong: gdKhenThuong,
      },
      khuPho: {
        tongSoKhuPho: khuPhoVanHoaList.length,
        xuatSac: kpXuatSac,
        tuyenDuongVanMinh: khuPhoVanHoaList.length,
      },
      diTich: {
        tongSoDiTich: diTichLeHoiList.length,
        diTichQuocGia: dtQuocGia,
        luotKhachUocTinh: 1500000,
        soHoaQrPercent: 100,
      },
      langNghe: {
        tongLangNghe: langNgheList.length,
        diSanQuocGia: lnQuocGia,
        soNgeNhanUuTu: lnNgheNhan,
      },
      kiemTra814: {
        tongCoSo: coSoDichVuVanHoaList.length,
        chapHanhTot: csChapHanh,
        viPham: csViPham,
        tongTienPhat: csTienPhat,
      },
      baoLucGiaDinh: {
        tongDiaChiTinCay: diaChiTinCayList.length,
        tongVuViec: baoLucGiaDinhList.length,
        camTiepXuc: blCamTiepXuc,
      },
    };
  }, [
    giaDinhVanHoaList,
    khuPhoVanHoaList,
    diTichLeHoiList,
    langNgheList,
    coSoDichVuVanHoaList,
    baoLucGiaDinhList,
    diaChiTinCayList,
  ]);

  // Tab count badges
  const tabCounts = useMemo(() => {
    return {
      giaDinh: giaDinhVanHoaList.length,
      doThiVanMinh: (doThiVanMinhList || []).length,
      diTich: diTichLeHoiList.length,
      langNghe: langNgheList.length,
      gisDiaDiem: gisDiaDiemList.length,
      tonGiao: coSoTonGiaoList.length,
      kiemTra814: coSoDichVuVanHoaList.length,
      thietChe: thietCheVanHoaList.length,
      baoLucGiaDinh: baoLucGiaDinhList.length,
      tthc: hoSoTTHCVanHoaList.length,
    };
  }, [
    giaDinhVanHoaList,
    diTichLeHoiList,
    langNgheList,
    gisDiaDiemList,
    coSoTonGiaoList,
    coSoDichVuVanHoaList,
    thietCheVanHoaList,
    baoLucGiaDinhList,
    hoSoTTHCVanHoaList,
  ]);

  // Handlers
  const handleSaveEvaluation = async (payload: {
    id: string;
    diemGuongMau: number;
    diemKinhTe: number;
    diemHoaThuan: number;
    deNghiKhenThuong: boolean;
    ghiChu?: string;
  }) => {
    await vanHoaApi.binhXetGiaDinh(payload);
    toast.success("Đã hoàn tất bình xét Gia đình văn hóa theo thang điểm 100 (NĐ 86/2023)");
    setEvaluatingGdv(null);
  };

  const handleAddNewGdv = async (data: {
    chuHo: string;
    cccd: string;
    diaChi: string;
    khuPho: string;
    soThanhVien: number;
    ghiChu?: string;
  }) => {
    await vanHoaApi.createGiaDinh(data);
    toast.success(`Đã thêm hộ ${data.chuHo} vào danh sách bình xét Gia đình văn hóa`);
  };

  const handleTogglePccc = async (id: string, current: DiTichLeHoiItem["congTacPCCC"]) => {
    const next = current === "DAM_BAO_100%" ? "DANG_BO_SUNG" : "DAM_BAO_100%";
    await vanHoaApi.updatePcccDiTich(id, next);
    toast.success("Đã cập nhật tình trạng an toàn PCCC Di tích");
  };

  const handleDangKyTonGiao = async (id: string) => {
    await vanHoaApi.dangKyTonGiao(id);
    toast.success("Tiếp nhận thông báo danh mục hoạt động tôn giáo năm 2026 thành công (Khoản 1 Điều 43)");
  };

  const handleSaveInspect814 = async (payload: {
    id: string;
    ketLuan: CoSoDichVuVanHoaItem["ketLuan"];
    mucPhatVND: number;
    noiDungXuLy: string;
    pccc: CoSoDichVuVanHoaItem["tinhTrangPCCC"];
  }) => {
    await vanHoaApi.kiemTraCoSoDichVu(payload.id, payload);
    toast.success("Đã lưu biên bản kiểm tra liên ngành 814/UBND");
    setInspectingCoSo(null);
  };

  const handleBanHanhCamTiepXuc = async (id: string, thoiHanNgay: number) => {
    const res = await vanHoaApi.banHanhCamTiepXuc(id, thoiHanNgay);
    toast.success(`Chủ tịch UBND Phường ban hành Quyết định cấm tiếp xúc ${thoiHanNgay} ngày (Số: ${res.soQuyetDinh})`);
  };

  const handleTriggerSupportDiaChi = async (id: string) => {
    await vanHoaApi.hoTroDiaChiTinCay(id);
    toast.warning("Đã kích hoạt chế độ hỗ trợ khẩn cấp nạn nhân bạo lực gia đình tại Địa chỉ tin cậy!");
  };

  const handleAddTthc = async (data: {
    tenThuTuc: string;
    maThuTuc: string;
    nguoiNop: string;
    sdt: string;
    cccd: string;
    diaChi: string;
    khuPho: string;
    ngayHenTra: string;
    ketQuaVanBan: string;
  }) => {
    await vanHoaApi.tiepNhanTthc(data);
    toast.success("Tiếp nhận hồ sơ TTHC Một cửa ngành Văn hóa thành công (Mẫu 01)");
  };

  const handleConfirmKySo = async (hoSoId: string, nguoiKy: string, chucVu: string) => {
    const res = await vanHoaApi.kySoTthcSmartCA(hoSoId, nguoiKy, chucVu);
    toast.success(`Ký số SmartCA thành công! Mã xác thực điện tử: ${res.maXacThuc}`);
  };

  return (
    <AppShell activeDomain="VH_TT_DL">
      <div className="space-y-6">
        <PageHeader
          title="Văn hóa, Thể thao & Đời sống Văn minh Đô thị"
          subtitle="Ủy ban nhân dân Phường Thủ Dầu Một · Tỉnh Bình Dương"
          badge="VH-XH"
          right={
            <div className="flex items-center gap-2">
              <Link
                to="/dieu-hanh"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#dd4b39] text-white text-xs font-bold hover:bg-[#c23321] transition shadow-xs cursor-pointer"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Bàn Điều hành Lãnh đạo &amp; Giao việc</span>
              </Link>
              <Link
                to="/hop-truc-tuyen"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-xs cursor-pointer"
              >
                <MessagesSquare className="w-3.5 h-3.5 text-[#dd4b39]" />
                <span>Họp số &amp; Trao đổi nội bộ</span>
              </Link>
            </div>
          }
        />

        {/* Warning if user doesn't have direct access */}
        {!hasAccess && (
          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-xl p-4 text-xs flex items-center justify-between text-amber-800 dark:text-amber-200">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>
                Bạn đang xem dữ liệu phân hệ Văn hóa - Xã hội với quyền tham chiếu ({currentUser.roleTitle}).
              </span>
            </div>
            <button
              type="button"
              onClick={() => appStore.switchUser("cb_van_hoa")}
              className="px-3 py-1 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 cursor-pointer transition-colors"
            >
              Chuyển sang Công chức Văn hóa (Nguyễn Thanh Tùng)
            </button>
          </div>
        )}

        {/* 6 KPI Cards with Quick filter interaction */}
        <VanHoaKpiCards
          kpiData={kpiData}
          onQuickFilter={(key) => setActiveTab(key as VanHoaTabKey)}
        />

        {/* 9 Tab Navigation */}
        <VanHoaTabNav
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          counts={tabCounts}
        />

        {/* Tab 1: Gia đình & Khu phố Văn hóa */}
        {activeTab === "GIA_DINH_KHU_PHO" && (
          <GiaDinhKhuPhoTab
            giaDinhList={giaDinhVanHoaList}
            khuPhoList={khuPhoVanHoaList}
            onOpenAddModal={() => setShowAddGdvModal(true)}
            onOpenEvalModal={(item) => setEvaluatingGdv(item)}
          />
        )}

        {/* Tab 1.5: 9 Tiêu chí Đô thị Văn minh chuẩn Quốc gia (QĐ 04/2022/QĐ-TTg) */}
        {activeTab === "DO_THI_VAN_MINH" && (
          <DoThiVanMinhTab />
        )}

        {/* Tab 2: Di tích & Lễ hội Chùa Bà */}
        {activeTab === "DI_TICH_LE_HOI" && (
          <DiTichLeHoiTab
            diTichList={diTichLeHoiList}
            onOpenQrModal={(item) => setViewingDiTich(item)}
            onTogglePccc={handleTogglePccc}
          />
        )}

        {/* Tab 3: Làng nghề & Di sản */}
        {activeTab === "LANG_NGHE_DI_SAN" && (
          <LangNgheDiSanTab langNgheList={langNgheList} />
        )}

        {/* Tab 3.5: Nghệ nhân Di sản & Quản lý Thể thao */}
        {activeTab === "NGHE_NHAN_THE_THAO" && (
          <NgheNhanTheThaoTab />
        )}

        {/* Tab 4: Bản đồ số GIS */}
        {activeTab === "GIS_BAN_DO" && (
          <GisBanDoVanHoaTab
            diaDiemList={gisDiaDiemList}
            onOpenQrModal={(url, ten) => {
              const matched = diTichLeHoiList.find((d) => d.tenDiTich.includes(ten) || ten.includes(d.tenDiTich));
              if (matched) {
                setViewingDiTich(matched);
              } else {
                toast.info(`Mở liên kết thuyết minh số hóa: ${url}`);
              }
            }}
          />
        )}

        {/* Tab 5: Tôn giáo & Tín ngưỡng */}
        {activeTab === "TON_GIAO_TIN_NGUONG" && (
          <TonGiaoTinNguongTab
            coSoList={coSoTonGiaoList}
            onDangKyHoatDong={handleDangKyTonGiao}
          />
        )}

        {/* Tab 6: Kiểm tra liên ngành 814 */}
        {activeTab === "KIEM_TRA_814" && (
          <KiemTra814Tab
            coSoList={coSoDichVuVanHoaList}
            onOpenInspectModal={(item) => setInspectingCoSo(item)}
          />
        )}

        {/* Tab 7: Thiết chế & Đờn ca tài tử */}
        {activeTab === "THIET_CHE_DON_CA" && (
          <ThietCheDonCaTaiTuTab thietCheList={thietCheVanHoaList} />
        )}

        {/* Tab 8: Phòng chống bạo lực gia đình */}
        {activeTab === "BAO_LUC_GIA_DINH" && (
          <BaoLucGiaDinhTab
            diaChiList={diaChiTinCayList}
            hoSoList={baoLucGiaDinhList}
            onTriggerSupport={handleTriggerSupportDiaChi}
            onOpenCamTiepXucModal={(hoSo) => setCamTiepXucHoSo(hoSo)}
          />
        )}

        {/* Tab 9: TTHC Một cửa & SmartCA */}
        {activeTab === "TTHC_MOT_CUA" && (
          <TthcMotCuaVanHoaTab
            hoSoList={hoSoTTHCVanHoaList}
            onOpenAddModal={() => setShowAddTthcModal(true)}
            onOpenKySoModal={(hoSo) => setSigningTthc(hoSo)}
          />
        )}
      </div>

      {/* Modals Container */}
      <ModalBinhXetGiaDinh
        item={evaluatingGdv}
        onClose={() => setEvaluatingGdv(null)}
        onSave={handleSaveEvaluation}
      />

      <ModalDangKyGiaDinh
        isOpen={showAddGdvModal}
        onClose={() => setShowAddGdvModal(false)}
        onAdd={handleAddNewGdv}
      />

      <ModalChiTietDiTichQr
        item={viewingDiTich}
        onClose={() => setViewingDiTich(null)}
      />

      <ModalKiemTra814
        item={inspectingCoSo}
        onClose={() => setInspectingCoSo(null)}
        onSave={handleSaveInspect814}
      />

      <ModalQuyetDinhCamTiepXuc
        hoSo={camTiepXucHoSo}
        onClose={() => setCamTiepXucHoSo(null)}
        onBanHanh={handleBanHanhCamTiepXuc}
      />

      <ModalTiepNhanTthcVanHoa
        isOpen={showAddTthcModal}
        onClose={() => setShowAddTthcModal(false)}
        onSubmit={handleAddTthc}
      />

      <ModalKySoSmartCA
        hoSo={signingTthc}
        onClose={() => setSigningTthc(null)}
        onConfirmKySo={handleConfirmKySo}
      />
    </AppShell>
  );
}
