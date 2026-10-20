import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  HeartHandshake,
  Users,
  ShieldAlert,
  Flame,
  Home,
  Briefcase,
  Baby,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
  DollarSign,
  Heart,
  Scale,
  Smile,
  ShieldCheck,
  FileCheck,
  Building,
  GraduationCap,
  Sparkles,
  MapPin,
  Calendar,
  X,
  Check,
} from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { useAppState, appStore, hasDomainAccess } from "@/services/app-state";
import { formatVND } from "@/data/mock";
import {
  type DoiTuongBaoTroXaHoi,
  type HoSoCuuTroDotXuat,
  type HoGheoCanGheoItem,
  type CungCauLaoDongItem,
  type CoSoKiemTraATLaoDong,
  type TreEmHoanCanhDacBiet,
  type HoSoPhongChongTeNan,
} from "@/data/domain-mock";

export const Route = createFileRoute("/an-sinh-xa-hoi")({
  head: () => ({
    meta: [
      {
        title: "Mảng Lao động, Người có công & An sinh xã hội · UBND Phường - SLĐTBXH Bình Dương",
      },
      {
        name: "description",
        content:
          "Quản lý hồ sơ chính sách Người có công, Bảo trợ xã hội, Cứu trợ khẩn cấp, Giảm nghèo bền vững, Việc làm quân nhân xuất ngũ, Chăm sóc trẻ em và Phòng chống tệ nạn xã hội.",
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
  } = useAppState();

  const [activeTab, setActiveTab] = useState<
    "NGUOI_CO_CONG" | "BAO_TRO_CUU_TRO" | "GIAM_NGHEO" | "LAO_DONG_VIEC_LAM" | "TRE_EM" | "TE_NAN_XA_HOI"
  >("BAO_TRO_CUU_TRO");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterKhuPho, setFilterKhuPho] = useState("ALL");

  // State Modal Thêm Bảo trợ xã hội
  const [showAddBaoTroModal, setShowAddBaoTroModal] = useState(false);
  const [btHoTen, setBtHoTen] = useState("");
  const [btCccd, setBtCccd] = useState("");
  const [btNgaySinh, setBtNgaySinh] = useState("1945-01-01");
  const [btGioiTinh, setBtGioiTinh] = useState<"Nam" | "Nữ">("Nữ");
  const [btKhuPho, setBtKhuPho] = useState("Khu phố 1");
  const [btDiaChi, setBtDiaChi] = useState("");
  const [btLoai, setBtLoai] = useState<DoiTuongBaoTroXaHoi["loaiDoiTuong"]>("NGUOI_CAO_TUOI_80");
  const [btHinhThuc, setBtHinhThuc] = useState<"NGAN_HANG" | "BUU_DIEN">("NGAN_HANG");
  const [btThongTinChiTra, setBtThongTinChiTra] = useState("Vietcombank - 0121000889922");

  // State Modal Thêm Cứu trợ đột xuất
  const [showAddCuuTroModal, setShowAddCuuTroModal] = useState(false);
  const [ctChuHo, setCtChuHo] = useState("");
  const [ctCccd, setCtCccd] = useState("");
  const [ctKhuPho, setCtKhuPho] = useState("Khu phố 3");
  const [ctDiaChi, setCtDiaChi] = useState("");
  const [ctSuCo, setCtSuCo] = useState<HoSoCuuTroDotXuat["loaiSuCo"]>("HOA_HOAN_CHAY_NHA");
  const [ctMoTa, setCtMoTa] = useState("");
  const [ctTien, setCtTien] = useState(15_000_000);
  const [ctGao, setCtGao] = useState(45);

  const hasAccess = hasDomainAccess(currentUser, "LDTBXH_AN_SINH") || hasDomainAccess(currentUser, "LDTBXH_NCC");

  // Handler thêm đối tượng bảo trợ
  const handleCreateBaoTro = (e: React.FormEvent) => {
    e.preventDefault();
    if (!btHoTen.trim() || !btCccd.trim()) {
      toast.error("Vui lòng điền đủ họ tên và số CCCD!");
      return;
    }

    const heSoMap: Record<DoiTuongBaoTroXaHoi["loaiDoiTuong"], { heSo: number; tien: number; ten: string }> = {
      NGUOI_CAO_TUOI_80: {
        heSo: 1.0,
        tien: 540_000,
        ten: "Người cao tuổi đủ 80 tuổi không có lương hưu (NĐ 20/2021)",
      },
      KHUYET_TAT_DAC_BIET_NANG: {
        heSo: 2.5,
        tien: 1_350_000,
        ten: "Người khuyết tật đặc biệt nặng (Có người chăm sóc)",
      },
      KHUYET_TAT_NANG: {
        heSo: 2.0,
        tien: 1_080_000,
        ten: "Người khuyết tật nặng (HĐ Giám định phường)",
      },
      TRE_MO_COI: {
        heSo: 2.5,
        tien: 1_350_000,
        ten: "Trẻ em mồ côi cả cha lẫn mẹ",
      },
      DON_THAN_NUOI_CON_NGHEO: {
        heSo: 2.0,
        tien: 1_080_000,
        ten: "Người đơn thân nuôi con nhỏ thuộc hộ nghèo",
      },
    };

    const config = heSoMap[btLoai];
    const newId = `BTXH-${Math.floor(100 + Math.random() * 900)}`;
    const newItem: DoiTuongBaoTroXaHoi = {
      id: newId,
      hoTen: btHoTen.trim(),
      cccd: btCccd.trim(),
      ngaySinh: btNgaySinh,
      gioiTinh: btGioiTinh,
      khuPho: btKhuPho,
      diaChi: btDiaChi || `${btKhuPho}, Phường Phú Cường`,
      loaiDoiTuong: btLoai,
      tenLoaiDoiTuong: config.ten,
      heSoHuong: config.heSo,
      mucTroCapHangThang: config.tien,
      hinhThucNhan: btHinhThuc,
      thongTinChiTra: btThongTinChiTra,
      soQuyetDinh: `QĐ-UBND-${Math.floor(100 + Math.random() * 900)}/2026`,
      ngayHieuLuc: new Date().toLocaleDateString("vi-VN"),
      trangThai: "DANG_HUONG",
    };

    appStore.addBaoTroItem(newItem);
    toast.success("Đã tiếp nhận và ban hành quyết định trợ cấp BTXH!", {
      description: `${newItem.hoTen} (${config.ten})`,
    });
    setShowAddBaoTroModal(false);
    setBtHoTen("");
    setBtCccd("");
  };

  // Handler cứu trợ đột xuất
  const handleCreateCuuTro = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ctChuHo.trim() || !ctCccd.trim()) {
      toast.error("Vui lòng điền đủ thông tin chủ hộ!");
      return;
    }

    const newId = `CT-DX-${Math.floor(10 + Math.random() * 90)}`;
    const newItem: HoSoCuuTroDotXuat = {
      id: newId,
      hoTenChuHo: ctChuHo.trim(),
      cccd: ctCccd.trim(),
      khuPho: ctKhuPho,
      diaChi: ctDiaChi || `${ctKhuPho}, Phường Phú Cường`,
      loaiSuCo: ctSuCo,
      moTaThietHai: ctMoTa || "Rủi ro đột xuất cần hỗ trợ khẩn cấp",
      ngayXayRa: new Date().toLocaleDateString("vi-VN"),
      hinhThucCuuTro: ctGao > 0 ? "TIEN_MAT_VA_GAO" : "TIEN_MAT",
      soTienHoTroVND: Number(ctTien),
      soKgGao: Number(ctGao),
      trangThai: "DA_CHI_TRA",
      ngayPheDuyet: new Date().toLocaleDateString("vi-VN"),
      nguoiPheDuyet: currentUser.fullName,
    };

    appStore.addCuuTroDotXuat(newItem);
    toast.success("Đã phê duyệt và phát tiền/gạo cứu trợ đột xuất!", {
      description: `Hỗ trợ ${formatVND(newItem.soTienHoTroVND)} + ${newItem.soKgGao}kg gạo cho hộ ${newItem.hoTenChuHo}`,
    });
    setShowAddCuuTroModal(false);
    setCtChuHo("");
    setCtCccd("");
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Phân hệ Nghiệp vụ 3 · Lao động, Người có công & An sinh xã hội cơ sở"
        title="Quản lý Lao động, Người có công & An sinh xã hội"
        right={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddCuuTroModal(true)}
              className="flex items-center gap-1.5 rounded-md bg-amber-600 hover:bg-amber-700 px-3 py-1.5 text-xs font-bold text-white shadow-xs transition-colors"
            >
              <Flame className="size-3.5" />
              Cứu trợ đột xuất khẩn cấp
            </button>
            <button
              onClick={() => setShowAddBaoTroModal(true)}
              className="flex items-center gap-1.5 rounded-md bg-[#dd4b39] hover:bg-[#c23321] px-3 py-1.5 text-xs font-bold text-white shadow-xs transition-colors"
            >
              <Plus className="size-3.5" />
              Tiếp nhận hồ sơ Bảo trợ XH
            </button>
          </div>
        }
      />

      {/* Cảnh báo phân quyền nếu tài khoản không có quyền */}
      {!hasAccess && (
        <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 p-3.5 text-amber-900 flex items-start justify-between gap-3 shadow-xs">
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

      {/* KPI Thống kê An sinh & Lao động */}
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* KPI 1 */}
        <div className="rounded-lg border border-gray-200 bg-white p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>Đối tượng Người có công</span>
            <HeartHandshake className="size-4 text-red-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-gray-900">{hoSoList.length}</span>
            <span className="text-[11px] font-bold text-red-600">Hồ sơ quản lý</span>
          </div>
          <div className="mt-1 text-[11px] text-gray-500 font-medium">Chi trả trợ cấp đúng kỳ 100%</div>
        </div>

        {/* KPI 2 */}
        <div className="rounded-lg border border-gray-200 bg-white p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>Bảo trợ xã hội (NĐ 20)</span>
            <Users className="size-4 text-amber-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-gray-900">{baoTroList.length}</span>
            <span className="text-[11px] font-bold text-amber-600">Đang hưởng trợ cấp</span>
          </div>
          <div className="mt-1 text-[11px] text-gray-500 font-medium">Người cao tuổi, khuyết tật, mồ côi</div>
        </div>

        {/* KPI 3 */}
        <div className="rounded-lg border border-gray-200 bg-white p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>Hộ nghèo &amp; Cận nghèo</span>
            <Home className="size-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-700">{hoGheoList.length} hộ</span>
            <span className="text-[11px] font-bold text-emerald-600">Tỷ lệ: 0.18%</span>
          </div>
          <div className="mt-1 text-[11px] text-gray-500 font-medium">100% có thẻ BHYT &amp; Vốn vay CSXH</div>
        </div>

        {/* KPI 4 */}
        <div className="rounded-lg border border-gray-200 bg-white p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>Việc làm bộ đội xuất ngũ</span>
            <Briefcase className="size-4 text-[#0073b7]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#0073b7]">100%</span>
            <span className="text-[11px] font-bold text-emerald-600">Đã tư vấn học nghề</span>
          </div>
          <div className="mt-1 text-[11px] text-gray-500 font-medium">Kết nối KCN VSIP &amp; Đại Đăng</div>
        </div>
      </div>

      {/* Tabs chuyển đổi các nhóm nghiệp vụ mảng 3 */}
      <div className="mb-4 flex flex-wrap border-b border-gray-200 bg-white rounded-t-md px-3 pt-2 gap-2 text-xs">
        <button
          onClick={() => setActiveTab("BAO_TRO_CUU_TRO")}
          className={`pb-2.5 px-3 font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === "BAO_TRO_CUU_TRO"
              ? "border-[#dd4b39] text-[#dd4b39]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Users className="size-4" />
          <span>1. Bảo trợ xã hội &amp; Cứu trợ khẩn cấp</span>
        </button>

        <button
          onClick={() => setActiveTab("GIAM_NGHEO")}
          className={`pb-2.5 px-3 font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === "GIAM_NGHEO"
              ? "border-[#dd4b39] text-[#dd4b39]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Home className="size-4" />
          <span>2. Giảm nghèo bền vững đa chiều</span>
        </button>

        <button
          onClick={() => setActiveTab("LAO_DONG_VIEC_LAM")}
          className={`pb-2.5 px-3 font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === "LAO_DONG_VIEC_LAM"
              ? "border-[#dd4b39] text-[#dd4b39]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Briefcase className="size-4" />
          <span>3. Cung - cầu lao động &amp; ATLĐ</span>
        </button>

        <button
          onClick={() => setActiveTab("TRE_EM")}
          className={`pb-2.5 px-3 font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === "TRE_EM"
              ? "border-[#dd4b39] text-[#dd4b39]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Baby className="size-4" />
          <span>4. Bảo vệ, chăm sóc trẻ em</span>
        </button>

        <button
          onClick={() => setActiveTab("TE_NAN_XA_HOI")}
          className={`pb-2.5 px-3 font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === "TE_NAN_XA_HOI"
              ? "border-[#dd4b39] text-[#dd4b39]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <ShieldAlert className="size-4" />
          <span>5. Phòng chống tệ nạn xã hội</span>
        </button>

        <button
          onClick={() => setActiveTab("NGUOI_CO_CONG")}
          className={`pb-2.5 px-3 font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === "NGUOI_CO_CONG"
              ? "border-[#dd4b39] text-[#dd4b39]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <HeartHandshake className="size-4" />
          <span>6. Người có công &amp; Đền ơn đáp nghĩa</span>
        </button>
      </div>

      {/* NỘI DUNG TAB 1: BẢO TRỢ XÃ HỘI & CỨU TRỢ KHẨN CẤP */}
      {activeTab === "BAO_TRO_CUU_TRO" && (
        <div className="space-y-4">
          {/* Bảng danh sách đối tượng Bảo trợ xã hội */}
          <div className="bg-white rounded-md border border-gray-200 p-4 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Users className="size-4 text-[#dd4b39]" />
                <h3 className="text-sm font-bold text-gray-900">
                  Danh sách Đối tượng Bảo trợ xã hội hưởng Trợ cấp hàng tháng (Nghị định 20/2021/NĐ-CP)
                </h3>
              </div>
              <span className="text-xs text-gray-500 font-medium">Mức chuẩn: 540.000đ × Hệ số quy định</span>
            </div>

            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 border-b border-gray-200 font-bold">
                    <th className="py-2.5 px-3">Mã ĐT</th>
                    <th className="py-2.5 px-3">Họ và tên / CCCD</th>
                    <th className="py-2.5 px-3">Địa chỉ &amp; Khu phố</th>
                    <th className="py-2.5 px-3">Diện đối tượng bảo trợ</th>
                    <th className="py-2.5 px-3 text-center">Hệ số</th>
                    <th className="py-2.5 px-3 text-right">Mức hưởng/tháng</th>
                    <th className="py-2.5 px-3">Hình thức chi trả</th>
                    <th className="py-2.5 px-3 text-center">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {baoTroList.map((bt) => (
                    <tr key={bt.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-gray-700">{bt.id}</td>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-gray-900">{bt.hoTen}</div>
                        <div className="text-[10px] text-gray-500 font-mono">
                          CCCD: {bt.cccd} · Sinh: {bt.ngaySinh} ({bt.gioiTinh})
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-gray-700">
                        <div>{bt.diaChi}</div>
                        <div className="text-[10px] text-gray-500 font-medium">{bt.khuPho}</div>
                      </td>
                      <td className="py-2.5 px-3 text-gray-800">
                        <div className="font-medium">{bt.tenLoaiDoiTuong}</div>
                        <div className="text-[10px] text-gray-400 font-mono">Số QĐ: {bt.soQuyetDinh}</div>
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-[#dd4b39] font-mono">
                        ×{bt.heSoHuong.toFixed(1)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-gray-900 font-mono">
                        {formatVND(bt.mucTroCapHangThang)}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="rounded bg-sky-50 text-sky-800 border border-sky-200 px-1.5 py-0.5 text-[10px] font-bold">
                          {bt.hinhThucNhan === "NGAN_HANG" ? "Qua Ngân hàng" : "Tại Bưu điện"}
                        </span>
                        <div className="text-[10px] text-gray-500 truncate max-w-[140px] mt-0.5">
                          {bt.thongTinChiTra}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="rounded bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 text-[10px] font-bold">
                          Đang hưởng
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Hồ sơ Cứu trợ khẩn cấp đột xuất */}
          <div className="bg-white rounded-md border border-gray-200 p-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Flame className="size-4 text-amber-600" />
                <h3 className="text-sm font-bold text-gray-900">
                  Cứu trợ Xã hội Đột xuất (Hỏa hoạn, Thiên tai, Giông lốc, Tai nạn nghiêm trọng)
                </h3>
              </div>
              <span className="text-xs text-gray-500 font-medium">Hỗ trợ tiền mặt &amp; gạo khẩn cấp 24h</span>
            </div>

            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 border-b border-gray-200 font-bold">
                    <th className="py-2.5 px-3">Mã sự cố</th>
                    <th className="py-2.5 px-3">Chủ hộ &amp; Địa chỉ bị nạn</th>
                    <th className="py-2.5 px-3">Loại sự cố rủi ro</th>
                    <th className="py-2.5 px-3">Mô tả thiệt hại thực tế</th>
                    <th className="py-2.5 px-3 text-right">Kinh phí cứu trợ</th>
                    <th className="py-2.5 px-3 text-center">Cấp phát gạo</th>
                    <th className="py-2.5 px-3 text-center">Tình trạng giải ngân</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {cuuTroList.map((ct) => (
                    <tr key={ct.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-gray-700">{ct.id}</td>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-gray-900">{ct.hoTenChuHo}</div>
                        <div className="text-[10px] text-gray-500">
                          {ct.diaChi} ({ct.khuPho})
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-bold border ${
                            ct.loaiSuCo === "HOA_HOAN_CHAY_NHA"
                              ? "bg-red-50 text-red-800 border-red-200"
                              : "bg-blue-50 text-blue-800 border-blue-200"
                          }`}
                        >
                          {ct.loaiSuCo === "HOA_HOAN_CHAY_NHA" ? "Hỏa hoạn cháy nhà" : "Thiên tai giông lốc"}
                        </span>
                        <div className="text-[10px] text-gray-400 font-mono mt-0.5">Ngày: {ct.ngayXayRa}</div>
                      </td>
                      <td className="py-2.5 px-3 text-gray-700 max-w-sm">
                        <div className="line-clamp-2">{ct.moTaThietHai}</div>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-[#dd4b39]">
                        {formatVND(ct.soTienHoTroVND)}
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-amber-700">
                        {ct.soKgGao} kg gạo
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="rounded bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 text-[10px] font-bold flex items-center justify-center gap-1">
                          <CheckCircle2 className="size-3 text-emerald-600" />
                          Đã phát tiền &amp; gạo
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* NỘI DUNG TAB 2: GIẢM NGHÈO BỀN VỮNG */}
      {activeTab === "GIAM_NGHEO" && (
        <div className="space-y-4">
          <div className="bg-white rounded-md border border-gray-200 p-4 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Home className="size-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-gray-900">
                  Cơ sở Dữ liệu Rà soát Hộ nghèo, Cận nghèo &amp; Mức sống trung bình (Chuẩn nghèo đa chiều)
                </h3>
              </div>
              <span className="text-xs text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded">
                Mục tiêu: Xóa trắng hộ nghèo theo chuẩn nghèo đa chiều tỉnh Bình Dương
              </span>
            </div>

            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 border-b border-gray-200 font-bold">
                    <th className="py-2.5 px-3">Mã hộ</th>
                    <th className="py-2.5 px-3">Chủ hộ &amp; Nhân khẩu</th>
                    <th className="py-2.5 px-3">Phân loại hộ</th>
                    <th className="py-2.5 px-3">Các chỉ số thiếu hụt đa chiều</th>
                    <th className="py-2.5 px-3">Chính sách an sinh đã tiếp cận</th>
                    <th className="py-2.5 px-3 text-right">Vay vốn CSXH</th>
                    <th className="py-2.5 px-3 text-center">Tình trạng nhà ở</th>
                    <th className="py-2.5 px-3 text-center">Mục tiêu thoát nghèo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {hoGheoList.map((hg) => (
                    <tr key={hg.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-gray-700">{hg.maHo}</td>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-gray-900">{hg.hoTenChuHo}</div>
                        <div className="text-[10px] text-gray-500">
                          {hg.khuPho} · {hg.soNhanKhau} nhân khẩu
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold border ${
                            hg.phanLoai === "HO_NGHEO"
                              ? "bg-red-50 text-red-800 border-red-300"
                              : hg.phanLoai === "HO_CAN_NGHEO"
                              ? "bg-amber-50 text-amber-800 border-amber-300"
                              : "bg-blue-50 text-blue-800 border-blue-300"
                          }`}
                        >
                          {hg.phanLoai === "HO_NGHEO"
                            ? "Hộ nghèo"
                            : hg.phanLoai === "HO_CAN_NGHEO"
                            ? "Hộ cận nghèo"
                            : "Mức sống TB"}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <ul className="list-disc list-inside space-y-0.5 text-[11px] text-gray-600">
                          {hg.chieuThieuHut.map((c, i) => (
                            <li key={i}>{c}</li>
                          ))}
                        </ul>
                      </td>
                      <td className="py-2.5 px-3">
                        <ul className="space-y-0.5 text-[11px] text-emerald-800 font-medium">
                          {hg.chinhSachDaNhan.map((c, i) => (
                            <li key={i} className="flex items-center gap-1">
                              <CheckCircle2 className="size-3 text-emerald-600 shrink-0" />
                              <span>{c}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-gray-800">
                        {hg.soTienVayCSXHVND > 0 ? `${formatVND(hg.soTienVayCSXHVND)}` : "Chưa vay"}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="rounded bg-gray-100 text-gray-700 text-[10px] font-medium px-2 py-0.5">
                          {hg.tinhTrangNhaO === "DA_XAY_DAI_DOAN_KET"
                            ? "Nhà Đại đoàn kết"
                            : hg.tinhTrangNhaO === "KIEN_CO"
                            ? "Kiên cố"
                            : "Nhà cấp 4 xuống cấp"}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-emerald-700 font-mono">
                        Năm {hg.mucTieuThoatNgheoNam}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* NỘI DUNG TAB 3: CUNG - CẦU LAO ĐỘNG & AN TOÀN LAO ĐỘNG */}
      {activeTab === "LAO_DONG_VIEC_LAM" && (
        <div className="space-y-4">
          {/* Cung cầu lao động & Bộ đội xuất ngũ */}
          <div className="bg-white rounded-md border border-gray-200 p-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Briefcase className="size-4 text-[#0073b7]" />
                <h3 className="text-sm font-bold text-gray-900">
                  Tư vấn &amp; Kết nối Việc làm (Ưu tiên Quân nhân xuất ngũ &amp; Hoàn lương tái hòa nhập)
                </h3>
              </div>
              <span className="text-xs text-gray-500 font-medium">Hỗ trợ thẻ học nghề &amp; giới thiệu doanh nghiệp</span>
            </div>

            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 border-b border-gray-200 font-bold">
                    <th className="py-2.5 px-3">Họ và tên / CCCD</th>
                    <th className="py-2.5 px-3">Năm sinh</th>
                    <th className="py-2.5 px-3">Khu phố</th>
                    <th className="py-2.5 px-3">Trình độ &amp; Chuyên môn</th>
                    <th className="py-2.5 px-3">Đối tượng ưu tiên</th>
                    <th className="py-2.5 px-3">Tình trạng kết nối việc làm</th>
                    <th className="py-2.5 px-3">Mức lương kỳ vọng</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {cungCauLaoDongList.map((ld) => (
                    <tr key={ld.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-gray-900">{ld.hoTen}</div>
                        <div className="text-[10px] text-gray-400 font-mono">{ld.cccd}</div>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-gray-700">{ld.namSinh}</td>
                      <td className="py-2.5 px-3 text-gray-700">{ld.khuPho}</td>
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-gray-800">{ld.chuyenMon}</div>
                        <div className="text-[10px] text-gray-500">{ld.trinhDoHocVan}</div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold border ${
                            ld.doiTuongUuTien === "BO_DOI_XUAT_NGU"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                              : ld.doiTuongUuTien === "MAN_HAN_TU_HOAN_LUONG"
                              ? "bg-purple-50 text-purple-800 border-purple-300"
                              : "bg-gray-100 text-gray-700 border-gray-300"
                          }`}
                        >
                          {ld.doiTuongUuTien === "BO_DOI_XUAT_NGU"
                            ? "Bộ đội xuất ngũ"
                            : ld.doiTuongUuTien === "MAN_HAN_TU_HOAN_LUONG"
                            ? "Mãn hạn tù (Hoàn lương)"
                            : "Thanh niên địa phương"}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        {ld.tinhTrangViecLam === "DA_KET_NOI_VIEC_LAM" ? (
                          <div className="text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle2 className="size-3 text-emerald-600" />
                            <span>{ld.doanhNghiepTuyenDung}</span>
                          </div>
                        ) : (
                          <span className="text-amber-700 font-medium">Đang kết nối tuyển dụng</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-medium text-gray-800">{ld.mucLuongKyVong}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Kiểm tra an toàn vệ sinh lao động tại xưởng, cơ sở nhỏ */}
          <div className="bg-white rounded-md border border-gray-200 p-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Scale className="size-4 text-amber-600" />
                <h3 className="text-sm font-bold text-gray-900">
                  Kiểm tra An toàn, Vệ sinh Lao động (ATVSLĐ) tại các Cơ sở Sản xuất &amp; Công trình
                </h3>
              </div>
              <span className="text-xs text-gray-500 font-medium">Trang bị BHLĐ, PCCC &amp; HĐLĐ</span>
            </div>

            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 border-b border-gray-200 font-bold">
                    <th className="py-2.5 px-3">Tên cơ sở / Công trình</th>
                    <th className="py-2.5 px-3">Chủ cơ sở &amp; Địa chỉ</th>
                    <th className="py-2.5 px-3 text-center">Số lao động</th>
                    <th className="py-2.5 px-3">Hợp đồng LĐ</th>
                    <th className="py-2.5 px-3">Trang bị BHLĐ</th>
                    <th className="py-2.5 px-3 text-center">Bình PCCC</th>
                    <th className="py-2.5 px-3 text-center">Kết quả kiểm tra</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {atLaoDongList.map((at) => (
                    <tr key={at.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-gray-900">{at.tenCoSo}</td>
                      <td className="py-2.5 px-3 text-gray-700">
                        <div>{at.chuCoSo}</div>
                        <div className="text-[10px] text-gray-500">{at.diaChi}</div>
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-gray-800">{at.soLaoDong} người</td>
                      <td className="py-2.5 px-3">
                        <span className="text-emerald-700 font-medium">{at.tinhTrangHopDong}</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold border ${
                            at.trangBiBaoHo === "DAT_CHUAN"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                              : "bg-amber-50 text-amber-800 border-amber-300"
                          }`}
                        >
                          {at.trangBiBaoHo === "DAT_CHUAN" ? "Đạt chuẩn BHLĐ" : "Cần bổ sung đồ bảo hộ"}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-gray-800">{at.soBinhPCCC} bình</td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold border ${
                            at.ketQuaKiemTra === "DAT"
                              ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                              : "bg-amber-100 text-amber-800 border-amber-300"
                          }`}
                        >
                          {at.ketQuaKiemTra === "DAT" ? "Đạt yêu cầu" : "Yêu cầu khắc phục"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* NỘI DUNG TAB 4: BẢO VỆ, CHĂM SÓC TRẺ EM & BÌNH ĐẲNG GIỚI */}
      {activeTab === "TRE_EM" && (
        <div className="space-y-4">
          <div className="bg-white rounded-md border border-gray-200 p-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Baby className="size-4 text-purple-600" />
                <h3 className="text-sm font-bold text-gray-900">
                  Cơ sở Dữ liệu Trẻ em có Hoàn cảnh đặc biệt &amp; Phòng ngừa tai nạn thương tích, đuối nước
                </h3>
              </div>
              <span className="text-xs text-purple-700 font-bold bg-purple-50 border border-purple-200 px-2.5 py-1 rounded">
                Tổng đài 111 · Tháng hành động vì trẻ em
              </span>
            </div>

            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 border-b border-gray-200 font-bold">
                    <th className="py-2.5 px-3">Họ và tên trẻ</th>
                    <th className="py-2.5 px-3">Ngày sinh / Giới tính</th>
                    <th className="py-2.5 px-3">Người giám hộ &amp; SĐT</th>
                    <th className="py-2.5 px-3">Hoàn cảnh đặc biệt</th>
                    <th className="py-2.5 px-3">Chế độ trợ cấp &amp; Học bổng</th>
                    <th className="py-2.5 px-3 text-center">Bơi an toàn</th>
                    <th className="py-2.5 px-3">Nhật ký theo dõi của Cán bộ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {treEmList.map((te) => (
                    <tr key={te.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-gray-900">{te.hoTen}</div>
                        <div className="text-[10px] text-gray-500">{te.diaChi} ({te.khuPho})</div>
                      </td>
                      <td className="py-2.5 px-3 text-gray-700">
                        <div>{te.ngaySinh}</div>
                        <div className="text-[10px] text-gray-500 font-medium">{te.gioiTinh}</div>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-gray-800">{te.hoTenNguoiGiamHo}</div>
                        <div className="text-[10px] text-gray-500">
                          {te.quanHe} · {te.sdtNguoiGiamHo}
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="rounded bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 text-[10px] font-bold">
                          {te.loaiHoanCanh === "TRE_MO_COI"
                            ? "Trẻ mồ côi"
                            : te.loaiHoanCanh === "HO_NGHEO_KHO_KHAN"
                            ? "Hộ nghèo khó khăn"
                            : "Trẻ khuyết tật"}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-gray-700">
                        <div className="text-[11px] font-medium">{te.chinhSachTroCap}</div>
                        {te.daDuocTangHocBong && (
                          <div className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
                            <CheckCircle2 className="size-3" /> Đã nhận học bổng khuyến học
                          </div>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="rounded bg-sky-100 text-sky-800 border border-sky-300 px-2 py-0.5 text-[10px] font-bold">
                          Đã học bơi
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-gray-600 max-w-xs text-[11px]">
                        {te.ghiChuTheoDoi}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* NỘI DUNG TAB 5: PHÒNG CHỐNG TỆ NẠN XÃ HỘI */}
      {activeTab === "TE_NAN_XA_HOI" && (
        <div className="space-y-4">
          <div className="bg-white rounded-md border border-gray-200 p-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ShieldAlert className="size-4 text-red-600" />
                <h3 className="text-sm font-bold text-gray-900">
                  Hồ sơ Quản lý Người nghiện ma túy, Cai nghiện tự nguyện tại cộng đồng &amp; Hỗ trợ sau cai
                </h3>
              </div>
              <span className="text-xs text-gray-500 font-medium">
                Phối hợp: Công an phường · Đoàn Thanh niên · Hội CCB
              </span>
            </div>

            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 border-b border-gray-200 font-bold">
                    <th className="py-2.5 px-3">Mã hồ sơ</th>
                    <th className="py-2.5 px-3">Họ và tên / CCCD</th>
                    <th className="py-2.5 px-3">Năm sinh / Khu phố</th>
                    <th className="py-2.5 px-3">Hình thức điều trị / Cai nghiện</th>
                    <th className="py-2.5 px-3">Cán bộ &amp; Đoàn thể phân công kèm cặp</th>
                    <th className="py-2.5 px-3 text-center">Xét nghiệm định kỳ</th>
                    <th className="py-2.5 px-3">Hỗ trợ việc làm sau cai</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {teNanList.map((tn) => (
                    <tr key={tn.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-gray-700">{tn.maHoSo}</td>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-gray-900">{tn.hoTen}</div>
                        <div className="text-[10px] text-gray-500 font-mono">CCCD: {tn.cccd}</div>
                      </td>
                      <td className="py-2.5 px-3 text-gray-700">
                        <div>Năm sinh: {tn.namSinh}</div>
                        <div className="text-[10px] text-gray-500">{tn.khuPho}</div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold border ${
                            tn.hinhThucCaiNghien === "DIEU_TRI_METHADONE"
                              ? "bg-sky-50 text-sky-800 border-sky-300"
                              : "bg-emerald-50 text-emerald-800 border-emerald-300"
                          }`}
                        >
                          {tn.hinhThucCaiNghien === "DIEU_TRI_METHADONE"
                            ? "Điều trị Methadone"
                            : "Hoàn thành sau cai"}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-gray-700 max-w-xs text-[11px]">
                        {tn.canBoTheoDoi}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="rounded bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 text-[10px] font-bold">
                          Âm tính (Đạt)
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-gray-700 text-[11px] font-medium">
                        {tn.hoTroViecLam}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* NỘI DUNG TAB 6: NGƯỜI CÓ CÔNG & ĐỀN ƠN ĐÁP NGHĨA */}
      {activeTab === "NGUOI_CO_CONG" && (
        <div className="space-y-4">
          <div className="bg-white rounded-md border border-gray-200 p-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <HeartHandshake className="size-4 text-[#dd4b39]" />
                <h3 className="text-sm font-bold text-gray-900">
                  Chính sách Người có công với cách mạng &amp; Phong trào Đền ơn đáp nghĩa
                </h3>
              </div>
              <Link
                to="/ho-so"
                className="text-xs font-bold text-[#dd4b39] hover:underline flex items-center gap-1"
              >
                Mở Kho Hồ sơ NCC chuyên sâu ↗
              </Link>
            </div>

            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 rounded border border-gray-200 bg-red-50/50">
                <div className="font-bold text-red-900 text-xs">Quỹ Đền ơn đáp nghĩa</div>
                <div className="text-xl font-extrabold text-red-700 mt-1">185.000.000 đ</div>
                <p className="text-[11px] text-red-800/80 mt-1">Đạt 115% kế hoạch vận động toàn phường năm 2026</p>
              </div>

              <div className="p-3 rounded border border-gray-200 bg-amber-50/50">
                <div className="font-bold text-amber-900 text-xs">Xây mới &amp; Sửa chữa Nhà tình nghĩa</div>
                <div className="text-xl font-extrabold text-amber-700 mt-1">04 căn nhà</div>
                <p className="text-[11px] text-amber-800/80 mt-1">Kinh phí 80-100 triệu/căn, đã bàn giao trước 27/7</p>
              </div>

              <div className="p-3 rounded border border-gray-200 bg-sky-50/50">
                <div className="font-bold text-sky-900 text-xs">Quà tặng Lễ, Tết &amp; 27/7</div>
                <div className="text-xl font-extrabold text-sky-700 mt-1">128 suất quà</div>
                <p className="text-[11px] text-sky-800/80 mt-1">Trao quà của Chủ tịch nước, Tỉnh ủy và UBND Phường</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-gray-500">
                Liên kết nhanh sang các chức năng nghiệp vụ Người có công:
              </span>
              <div className="flex gap-2">
                <Link to="/chi-tra" className="px-2.5 py-1 rounded bg-gray-100 hover:bg-gray-200 font-bold text-gray-800">
                  Chi trả trợ cấp
                </Link>
                <Link to="/dieu-duong" className="px-2.5 py-1 rounded bg-gray-100 hover:bg-gray-200 font-bold text-gray-800">
                  Điều dưỡng phục hồi
                </Link>
                <Link to="/nghia-trang" className="px-2.5 py-1 rounded bg-gray-100 hover:bg-gray-200 font-bold text-gray-800">
                  Bản đồ Nghĩa trang LS
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL TIẾP NHẬN HỒ SƠ BẢO TRỢ XÃ HỘI */}
      {showAddBaoTroModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full border border-gray-300 overflow-hidden">
            <div className="bg-[#dd4b39] text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="size-4" />
                <h3 className="font-bold text-sm">Tiếp nhận hồ sơ Bảo trợ Xã hội hàng tháng</h3>
              </div>
              <button onClick={() => setShowAddBaoTroModal(false)} className="text-white/80 hover:text-white">
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBaoTro} className="p-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Họ và tên đối tượng <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Cụ ông Nguyễn Văn A..."
                  value={btHoTen}
                  onChange={(e) => setBtHoTen(e.target.value)}
                  className="w-full rounded border border-gray-300 p-2 text-xs outline-none focus:border-[#dd4b39]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Số CCCD 12 số <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="074..."
                    value={btCccd}
                    onChange={(e) => setBtCccd(e.target.value)}
                    className="w-full rounded border border-gray-300 p-2 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Ngày sinh</label>
                  <input
                    type="date"
                    value={btNgaySinh}
                    onChange={(e) => setBtNgaySinh(e.target.value)}
                    className="w-full rounded border border-gray-300 p-2 text-xs outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Khu phố cư trú</label>
                  <select
                    value={btKhuPho}
                    onChange={(e) => setBtKhuPho(e.target.value)}
                    className="w-full rounded border border-gray-300 p-2 text-xs outline-none"
                  >
                    <option value="Khu phố 1">Khu phố 1</option>
                    <option value="Khu phố 2">Khu phố 2</option>
                    <option value="Khu phố 3">Khu phố 3</option>
                    <option value="Khu phố 4">Khu phố 4</option>
                    <option value="Khu phố 5">Khu phố 5</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Giới tính</label>
                  <select
                    value={btGioiTinh}
                    onChange={(e) => setBtGioiTinh(e.target.value as any)}
                    className="w-full rounded border border-gray-300 p-2 text-xs outline-none"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Diện bảo trợ xã hội (Nghị định 20/2021)</label>
                <select
                  value={btLoai}
                  onChange={(e) => setBtLoai(e.target.value as any)}
                  className="w-full rounded border border-gray-300 p-2 text-xs outline-none font-medium"
                >
                  <option value="NGUOI_CAO_TUOI_80">Người cao tuổi đủ 80 tuổi không có lương hưu (×1.0 = 540.000đ)</option>
                  <option value="KHUYET_TAT_DAC_BIET_NANG">Người khuyết tật đặc biệt nặng (×2.5 = 1.350.000đ)</option>
                  <option value="KHUYET_TAT_NANG">Người khuyết tật nặng (×2.0 = 1.080.000đ)</option>
                  <option value="TRE_MO_COI">Trẻ em mồ côi cả cha lẫn mẹ (×2.5 = 1.350.000đ)</option>
                  <option value="DON_THAN_NUOI_CON_NGHEO">Người đơn thân nuôi con thuộc hộ nghèo (×2.0 = 1.080.000đ)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Hình thức nhận trợ cấp</label>
                  <select
                    value={btHinhThuc}
                    onChange={(e) => setBtHinhThuc(e.target.value as any)}
                    className="w-full rounded border border-gray-300 p-2 text-xs outline-none"
                  >
                    <option value="NGAN_HANG">Tài khoản Ngân hàng (ATM)</option>
                    <option value="BUU_DIEN">Bưu điện chi trả tại nhà</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Chi tiết tài khoản / Bưu điện</label>
                  <input
                    type="text"
                    value={btThongTinChiTra}
                    onChange={(e) => setBtThongTinChiTra(e.target.value)}
                    className="w-full rounded border border-gray-300 p-2 text-xs outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-gray-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddBaoTroModal(false)}
                  className="px-3 py-1.5 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#dd4b39] hover:bg-[#c23321] text-white font-bold shadow-xs"
                >
                  Ban hành Quyết định hưởng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CỨU TRỢ KHẨN CẤP ĐỘT XUẤT */}
      {showAddCuuTroModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full border border-gray-300 overflow-hidden">
            <div className="bg-amber-600 text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="size-4" />
                <h3 className="font-bold text-sm">Hồ sơ Cứu trợ khẩn cấp đột xuất</h3>
              </div>
              <button onClick={() => setShowAddCuuTroModal(false)} className="text-white/80 hover:text-white">
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCuuTro} className="p-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Chủ hộ bị nạn / Người thụ hưởng <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Hộ gia đình ông Nguyễn Văn B..."
                  value={ctChuHo}
                  onChange={(e) => setCtChuHo(e.target.value)}
                  className="w-full rounded border border-gray-300 p-2 text-xs outline-none focus:border-amber-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Số CCCD chủ hộ</label>
                  <input
                    type="text"
                    required
                    placeholder="074..."
                    value={ctCccd}
                    onChange={(e) => setCtCccd(e.target.value)}
                    className="w-full rounded border border-gray-300 p-2 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Khu phố</label>
                  <select
                    value={ctKhuPho}
                    onChange={(e) => setCtKhuPho(e.target.value)}
                    className="w-full rounded border border-gray-300 p-2 text-xs outline-none"
                  >
                    <option value="Khu phố 1">Khu phố 1</option>
                    <option value="Khu phố 2">Khu phố 2</option>
                    <option value="Khu phố 3">Khu phố 3</option>
                    <option value="Khu phố 4">Khu phố 4</option>
                    <option value="Khu phố 5">Khu phố 5</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Loại sự cố rủi ro</label>
                <select
                  value={ctSuCo}
                  onChange={(e) => setCtSuCo(e.target.value as any)}
                  className="w-full rounded border border-gray-300 p-2 text-xs outline-none font-medium"
                >
                  <option value="HOA_HOAN_CHAY_NHA">Hỏa hoạn cháy nhà (Chập điện, sự cố)</option>
                  <option value="THIEN_TAI_GIONG_LOC">Thiên tai, giông lốc làm tốc mái / sập nhà</option>
                  <option value="TAI_NAN_NGHIEM_TRONG">Tai nạn giao thông nghiêm trọng</option>
                  <option value="BENH_HIEM_NGHEO">Mắc bệnh hiểm nghèo chi phí cao</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Mô tả tình trạng thiệt hại</label>
                <textarea
                  rows={2}
                  value={ctMoTa}
                  onChange={(e) => setCtMoTa(e.target.value)}
                  placeholder="Ghi nhận thiệt hại tài sản, nhà ở, người bị thương..."
                  className="w-full rounded border border-gray-300 p-2 text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Số tiền hỗ trợ (VNĐ)</label>
                  <input
                    type="number"
                    step="1000000"
                    value={ctTien}
                    onChange={(e) => setCtTien(Number(e.target.value))}
                    className="w-full rounded border border-gray-300 p-2 text-xs outline-none font-mono font-bold text-red-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Xuất cấp gạo (kg)</label>
                  <input
                    type="number"
                    value={ctGao}
                    onChange={(e) => setCtGao(Number(e.target.value))}
                    className="w-full rounded border border-gray-300 p-2 text-xs outline-none font-mono font-bold text-amber-600"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-gray-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCuuTroModal(false)}
                  className="px-3 py-1.5 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-xs"
                >
                  Phê duyệt cứu trợ ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
