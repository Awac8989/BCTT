import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  Radio,
  Tv,
  Flag,
  Globe,
  Share2,
  Store,
  Smartphone,
  Users,
  Volume2,
  VolumeX,
  Play,
  Square,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  MapPin,
  Send,
  Building2,
  Edit3,
  RefreshCw,
  QrCode,
  FileText,
  Activity,
  Layers,
  BarChart3,
  Check,
  X,
} from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { useAppState, appStore, hasDomainAccess } from "@/services/app-state";
import {
  type CumLoaTruyenThanh,
  type BanTinTruyenThanh,
  type BangTinDienTu,
  type CoDongTrucQuanItem,
  type CoSoInternetBuuChinh,
  type ToCongNgheSoCongDong,
} from "@/data/domain-mock";

export const Route = createFileRoute("/thong-tin-truyen-thong")({
  head: () => ({
    meta: [
      {
        title: "Mảng Thông tin, Truyền thông & Chuyển đổi số cơ sở · UBND Phường - SLĐTBXH Bình Dương",
      },
      {
        name: "description",
        content:
          "Vận hành hệ thống truyền thanh thông minh, bảng tin điện tử LED, cổ động trực quan, quản lý cổng thông tin, mạng xã hội, đại lý Internet và hoạt động của Tổ công nghệ số cộng đồng.",
      },
    ],
  }),
  component: ThongTinTruyenThongPage,
});

function ThongTinTruyenThongPage() {
  const {
    currentUser,
    cumLoaList,
    banTinList,
    bangTinList,
    coDongList,
    coSoInternetList,
    toCNSList,
  } = useAppState();

  const [activeTab, setActiveTab] = useState<"TRUYEN_THANH" | "THONG_TIN_DIEN_TU" | "CHUYEN_DOI_SO">("TRUYEN_THANH");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterKhuPho, setFilterKhuPho] = useState("ALL");

  // State Modal Thêm Bản Tin
  const [showAddBanTinModal, setShowAddBanTinModal] = useState(false);
  const [newBanTinTitle, setNewBanTinTitle] = useState("");
  const [newBanTinLinhVuc, setNewBanTinLinhVuc] = useState<BanTinTruyenThanh["linhVuc"]>("DVC_CDS");
  const [newBanTinThoiLuong, setNewBanTinThoiLuong] = useState(15);
  const [newBanTinKhungGio, setNewBanTinKhungGio] = useState("17:00 - 17:15");
  const [newBanTinHinhThuc, setNewBanTinHinhThuc] = useState<BanTinTruyenThanh["hinhThuc"]>("GIONG_DOC_AI");

  // State Modal Sửa Bảng Tin LED
  const [editingLed, setEditingLed] = useState<BangTinDienTu | null>(null);
  const [ledContent, setLedContent] = useState("");

  // Kiểm tra quyền truy cập mảng
  const hasAccess = hasDomainAccess(currentUser, "TT_CDS");

  // Filter cụm loa
  const filteredLoa = useMemo(() => {
    return cumLoaList.filter((loa) => {
      const matchSearch =
        loa.tenCum.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loa.khuPho.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loa.diaDiem.toLowerCase().includes(searchTerm.toLowerCase());
      const matchKhuPho = filterKhuPho === "ALL" || loa.khuPho === filterKhuPho;
      return matchSearch && matchKhuPho;
    });
  }, [cumLoaList, searchTerm, filterKhuPho]);

  // Handler toggling loa
  const handleToggleLoa = (loa: CumLoaTruyenThanh) => {
    appStore.toggleCumLoa(loa.id);
    if (loa.trangThai === "DANG_PHAT") {
      toast.info(`Đã ngắt phát thanh tại ${loa.tenCum}`);
    } else {
      toast.success(`Đang phát sóng trực tiếp tới ${loa.tenCum}!`, {
        description: `Công suất: ${loa.congSuatW}W · Âm lượng: ${loa.amLuongPercent}%`,
      });
    }
  };

  // Handler duyệt bản tin
  const handleDuyetBanTin = (id: string, tieuDe: string) => {
    appStore.duyetBanTin(id);
    toast.success("Đã duyệt phát sóng bản tin!", {
      description: tieuDe,
    });
  };

  // Handler tạo bản tin mới
  const handleCreateBanTin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBanTinTitle.trim()) {
      toast.error("Vui lòng nhập tiêu đề bản tin!");
      return;
    }

    const newId = `BT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newBanTin: BanTinTruyenThanh = {
      id: newId,
      tieuDe: newBanTinTitle.trim(),
      linhVuc: newBanTinLinhVuc,
      nguonTin: currentUser.unit || "UBND Phường",
      thoiLuongPhut: Number(newBanTinThoiLuong),
      khungGioPhat: newBanTinKhungGio,
      ngayPhat: new Date().toLocaleDateString("vi-VN"),
      hinhThuc: newBanTinHinhThuc,
      trangThai: "CHO_DUYET",
      nguoiPheDuyet: currentUser.fullName,
    };

    appStore.addBanTin(newBanTin);
    toast.success("Đã thêm bản tin phát thanh mới thành công!");
    setShowAddBanTinModal(false);
    setNewBanTinTitle("");
  };

  // Handler cập nhật bảng LED
  const handleSaveLed = () => {
    if (!editingLed) return;
    appStore.updateBangTinLED(editingLed.id, ledContent);
    toast.success("Đã gửi nội dung mới lên Bảng tin điện tử LED!", {
      description: editingLed.tenBang,
    });
    setEditingLed(null);
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Phân hệ Nghiệp vụ 2 · Thông tin, Truyền thông & Chuyển đổi số cơ sở"
        title="Quản lý Thông tin, Truyền thanh & Chuyển đổi số"
        right={
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-sky-50 text-sky-800 border border-sky-200 text-xs font-bold">
              <Radio className="size-3.5 text-sky-600 animate-pulse" />
              Đài truyền thanh thông minh 4.0
            </span>
            <button
              onClick={() => setShowAddBanTinModal(true)}
              className="flex items-center gap-1.5 rounded-md bg-[#dd4b39] hover:bg-[#c23321] px-3 py-1.5 text-xs font-bold text-white shadow-xs transition-colors"
            >
              <Plus className="size-3.5" />
              Thêm bản tin phát thanh
            </button>
          </div>
        }
      />

      {/* Cảnh báo nếu tài khoản chưa được cấp quyền riêng mảng này */}
      {!hasAccess && (
        <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 p-3.5 text-amber-900 flex items-start justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="size-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <strong className="font-bold">Lưu ý phân quyền:</strong> Tài khoản của bạn (
              <span className="font-bold">{currentUser.fullName}</span>) hiện chưa được cấu hình quyền quản lý{" "}
              <strong>Mảng Thông tin &amp; Chuyển đổi số</strong>. Bạn đang xem với chế độ quan sát.
            </div>
          </div>
          <button
            onClick={() => {
              appStore.switchRole("CB_THONG_TIN");
              toast.success("Đã chuyển sang tài khoản Cán bộ Thông tin & CĐS (Vũ Đình Cường)!");
            }}
            className="shrink-0 px-2.5 py-1 rounded bg-amber-600 text-white hover:bg-amber-700 text-xs font-bold transition-colors"
          >
            Đổi sang TK Phụ trách ↗
          </button>
        </div>
      )}

      {/* Thẻ thống kê nhanh các chỉ số mảng thông tin & chuyển đổi số */}
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* KPI 1 */}
        <div className="rounded-lg border border-gray-200 bg-white p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>Cụm Loa Thông minh</span>
            <Radio className="size-4 text-sky-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-gray-900">{cumLoaList.length}</span>
            <span className="text-[11px] font-bold text-emerald-600">
              {cumLoaList.filter((l) => l.trangThai === "HOAT_DONG" || l.trangThai === "DANG_PHAT").length} hoạt động
            </span>
          </div>
          <div className="mt-1 text-[11px] text-gray-500 font-medium">100% kết nối mạng IP/4G</div>
        </div>

        {/* KPI 2 */}
        <div className="rounded-lg border border-gray-200 bg-white p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>Bản tin đã phát (Tháng)</span>
            <Tv className="size-4 text-amber-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-gray-900">48</span>
            <span className="text-[11px] font-bold text-sky-600">2 khung giờ/ngày</span>
          </div>
          <div className="mt-1 text-[11px] text-gray-500 font-medium">Phát thanh chuyển văn bản AI</div>
        </div>

        {/* KPI 3 */}
        <div className="rounded-lg border border-gray-200 bg-white p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>Tổ CNS Cộng đồng</span>
            <Users className="size-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-gray-900">{toCNSList.length}</span>
            <span className="text-[11px] font-bold text-emerald-600">36 thành viên</span>
          </div>
          <div className="mt-1 text-[11px] text-gray-500 font-medium">Phủ sóng 5/5 khu phố</div>
        </div>

        {/* KPI 4 */}
        <div className="rounded-lg border border-gray-200 bg-white p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>Người dân có VNeID mức 2</span>
            <Smartphone className="size-4 text-purple-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-purple-700">93.2%</span>
            <span className="text-[11px] font-bold text-emerald-600">+4.5% q.năm</span>
          </div>
          <div className="mt-1 text-[11px] text-gray-500 font-medium">Mục tiêu Đề án 06 đạt chuẩn</div>
        </div>
      </div>

      {/* Thanh Tabs chọn nhóm phân hệ */}
      <div className="mb-4 flex flex-wrap border-b border-gray-200 bg-white rounded-t-md px-3 pt-2 gap-2 text-xs">
        <button
          onClick={() => setActiveTab("TRUYEN_THANH")}
          className={`pb-2.5 px-3 font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === "TRUYEN_THANH"
              ? "border-[#dd4b39] text-[#dd4b39]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Radio className="size-4" />
          <span>1. Đài Truyền thanh, Bảng LED &amp; Cổ động trực quan</span>
        </button>

        <button
          onClick={() => setActiveTab("THONG_TIN_DIEN_TU")}
          className={`pb-2.5 px-3 font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === "THONG_TIN_DIEN_TU"
              ? "border-[#dd4b39] text-[#dd4b39]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Globe className="size-4" />
          <span>2. Cổng TTĐT, Mạng xã hội &amp; Điểm Internet, Bưu chính</span>
        </button>

        <button
          onClick={() => setActiveTab("CHUYEN_DOI_SO")}
          className={`pb-2.5 px-3 font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === "CHUYEN_DOI_SO"
              ? "border-[#dd4b39] text-[#dd4b39]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Smartphone className="size-4" />
          <span>3. Chuyển đổi số cộng đồng &amp; Tổ CNSCĐ</span>
        </button>
      </div>

      {/* TAB 1: TRUYỀN THANH, BẢNG TIN LED & CỔ ĐỘNG TRỰC QUAN */}
      {activeTab === "TRUYEN_THANH" && (
        <div className="space-y-4">
          {/* 1.1 Quản trị Cụm loa thông minh */}
          <div className="bg-white rounded-md border border-gray-200 p-4 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Radio className="size-4 text-[#dd4b39]" />
                <h2 className="text-sm font-bold text-gray-900">
                  Hệ thống Cụm loa Truyền thanh thông minh (IP / 4G)
                </h2>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <input
                  type="text"
                  placeholder="Tìm kiếm cụm loa, địa chỉ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="rounded border border-gray-300 px-2.5 py-1 text-xs outline-none focus:border-[#dd4b39]"
                />
                <select
                  value={filterKhuPho}
                  onChange={(e) => setFilterKhuPho(e.target.value)}
                  className="rounded border border-gray-300 px-2 py-1 text-xs outline-none"
                >
                  <option value="ALL">Tất cả khu phố</option>
                  <option value="Khu phố 1">Khu phố 1</option>
                  <option value="Khu phố 2">Khu phố 2</option>
                  <option value="Khu phố 3">Khu phố 3</option>
                  <option value="Khu phố 4">Khu phố 4</option>
                  <option value="Khu phố 5">Khu phố 5</option>
                </select>
              </div>
            </div>

            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 border-b border-gray-200 font-bold">
                    <th className="py-2.5 px-3">Mã cụm</th>
                    <th className="py-2.5 px-3">Tên cụm loa &amp; Vị trí lắp đặt</th>
                    <th className="py-2.5 px-3">Khu phố</th>
                    <th className="py-2.5 px-3">Công nghệ</th>
                    <th className="py-2.5 px-3 text-center">Số loa / CS</th>
                    <th className="py-2.5 px-3 text-center">Âm lượng</th>
                    <th className="py-2.5 px-3 text-center">Trạng thái</th>
                    <th className="py-2.5 px-3 text-right">Điều khiển trực tiếp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredLoa.map((loa) => (
                    <tr key={loa.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-gray-700">{loa.maCum}</td>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-gray-900">{loa.tenCum}</div>
                        <div className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="size-3 text-gray-400" />
                          <span>{loa.diaDiem}</span>
                          <span className="font-mono text-gray-400">({loa.toaDoGps})</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 font-medium text-gray-700">{loa.khuPho}</td>
                      <td className="py-2.5 px-3">
                        <span className="rounded bg-sky-50 px-2 py-0.5 text-[10px] font-bold text-sky-800 border border-sky-200 font-mono">
                          {loa.loaiThietBi}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="font-bold text-gray-800">{loa.soLoa} loa</span>
                        <div className="text-[10px] text-gray-500 font-mono">{loa.congSuatW}W</div>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <div className="inline-flex items-center gap-1 font-mono font-bold text-gray-700">
                          <Volume2 className="size-3.5 text-gray-400" />
                          {loa.amLuongPercent}%
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${
                            loa.trangThai === "DANG_PHAT"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-300 animate-pulse"
                              : loa.trangThai === "HOAT_DONG"
                              ? "bg-sky-50 text-sky-800 border-sky-300"
                              : "bg-gray-100 text-gray-700 border-gray-300"
                          }`}
                        >
                          <span
                            className={`size-1.5 rounded-full ${
                              loa.trangThai === "DANG_PHAT"
                                ? "bg-emerald-600"
                                : loa.trangThai === "HOAT_DONG"
                                ? "bg-sky-600"
                                : "bg-gray-400"
                            }`}
                          />
                          {loa.trangThai === "DANG_PHAT"
                            ? "Đang phát sóng"
                            : loa.trangThai === "HOAT_DONG"
                            ? "Sẵn sàng"
                            : "Bảo trì"}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => handleToggleLoa(loa)}
                          className={`px-2.5 py-1 rounded text-xs font-bold transition-colors inline-flex items-center gap-1 shadow-2xs ${
                            loa.trangThai === "DANG_PHAT"
                              ? "bg-red-600 text-white hover:bg-red-700"
                              : "bg-[#0073b7] text-white hover:bg-[#005f96]"
                          }`}
                        >
                          {loa.trangThai === "DANG_PHAT" ? (
                            <>
                              <Square className="size-3 fill-current" />
                              <span>Ngắt phát</span>
                            </>
                          ) : (
                            <>
                              <Play className="size-3 fill-current" />
                              <span>Phát loa</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 1.2 Lịch phát sóng & Danh mục bản tin */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Danh sách bản tin */}
            <div className="lg:col-span-8 bg-white rounded-md border border-gray-200 p-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <FileText className="size-4 text-[#dd4b39]" />
                  <h3 className="text-sm font-bold text-gray-900">
                    Chương trình Phát thanh &amp; Bản tin địa phương
                  </h3>
                </div>
                <span className="text-xs text-gray-500 font-medium">Hôm nay: 20/10/2026</span>
              </div>

              <div className="mt-3 space-y-2.5">
                {banTinList.map((bt) => (
                  <div
                    key={bt.id}
                    className="p-3 rounded-md border border-gray-200 hover:border-gray-300 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition-all"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-sky-100 text-sky-800 text-[10px] font-bold px-1.5 py-0.2 border border-sky-200 uppercase">
                          {bt.linhVuc}
                        </span>
                        <span className="text-[10px] font-mono text-gray-500">
                          {bt.khungGioPhat} ({bt.thoiLuongPhut} phút)
                        </span>
                        <span className="text-[10px] bg-purple-50 text-purple-700 border border-purple-200 rounded px-1.5 font-medium">
                          {bt.hinhThuc === "GIONG_DOC_AI" ? "Giọng đọc AI 4.0" : "Thu âm Cán bộ"}
                        </span>
                      </div>
                      <div className="font-bold text-gray-900 text-xs">{bt.tieuDe}</div>
                      <div className="text-[11px] text-gray-500">
                        Nguồn tin: <span className="text-gray-700 font-medium">{bt.nguonTin}</span> · Phê duyệt:{" "}
                        <span className="text-gray-700 font-medium">{bt.nguoiPheDuyet}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {bt.trangThai === "CHO_DUYET" ? (
                        <button
                          onClick={() => handleDuyetBanTin(bt.id, bt.tieuDe)}
                          className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-2xs"
                        >
                          <Check className="size-3.5" />
                          <span>Duyệt phát</span>
                        </button>
                      ) : (
                        <span className="rounded bg-emerald-50 text-emerald-800 border border-emerald-300 px-2 py-0.5 text-[10px] font-bold flex items-center gap-1">
                          <CheckCircle2 className="size-3 text-emerald-600" />
                          {bt.trangThai === "DANG_PHAT" ? "Đang phát sóng" : "Đã lên lịch"}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bảng tin điện tử công cộng (LED/LCD) */}
            <div className="lg:col-span-4 bg-white rounded-md border border-gray-200 p-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Tv className="size-4 text-[#dd4b39]" />
                  <h3 className="text-sm font-bold text-gray-900">Bảng tin điện tử LED / LCD</h3>
                </div>
              </div>

              <div className="mt-3 space-y-3">
                {bangTinList.map((led) => (
                  <div key={led.id} className="p-3 rounded-md border border-gray-200 bg-gray-50/60">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900 text-xs">{led.tenBang}</span>
                      <span className="rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2">
                        {led.trangThai}
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-500 mt-0.5">{led.viTri} · {led.kichThuoc}</div>
                    
                    {/* Hộp mô phỏng chữ LED chạy */}
                    <div className="mt-2 p-2 rounded bg-black text-amber-400 font-mono text-[11px] overflow-hidden whitespace-nowrap border border-gray-800 shadow-inner">
                      <div className="animate-marquee inline-block">{led.noiDungHienTai}</div>
                    </div>

                    <div className="mt-2 flex items-center justify-between pt-1 border-t border-gray-200 text-[11px]">
                      <span className="text-gray-500">Giờ bật: {led.thoiGianBat} - {led.thoiGianTat}</span>
                      <button
                        onClick={() => {
                          setEditingLed(led);
                          setLedContent(led.noiDungHienTai);
                        }}
                        className="text-[#0073b7] hover:underline font-bold inline-flex items-center gap-1"
                      >
                        <Edit3 className="size-3" />
                        Đổi nội dung
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 1.3 Cổ động trực quan (Pano, Băng rôn, Cờ phướn) */}
          <div className="bg-white rounded-md border border-gray-200 p-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Flag className="size-4 text-[#dd4b39]" />
                <h3 className="text-sm font-bold text-gray-900">
                  Công tác Cổ động trực quan các ngày Lễ lớn &amp; Nhiệm vụ chính trị
                </h3>
              </div>
              <span className="text-xs text-gray-500 font-medium">Băng rôn · Pano tấm lớn · Cờ phướn</span>
            </div>

            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 border-b border-gray-200 font-bold">
                    <th className="py-2.5 px-3">Tên đợt tuyên truyền</th>
                    <th className="py-2.5 px-3">Dịp kỷ niệm</th>
                    <th className="py-2.5 px-3">Loại hình / Số lượng</th>
                    <th className="py-2.5 px-3">Tuyến đường &amp; Điểm treo</th>
                    <th className="py-2.5 px-3">Thời gian thực hiện</th>
                    <th className="py-2.5 px-3 text-right">Kinh phí</th>
                    <th className="py-2.5 px-3 text-center">Tình trạng kiểm tra</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {coDongList.map((cd) => (
                    <tr key={cd.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-gray-900">{cd.tenDotTuyenTruyen}</td>
                      <td className="py-2.5 px-3 text-gray-700">{cd.dipKyNiem}</td>
                      <td className="py-2.5 px-3">
                        <span className="rounded bg-rose-50 text-rose-800 border border-rose-200 px-1.5 py-0.5 text-[10px] font-bold">
                          {cd.loaiHinh}
                        </span>
                        <span className="ml-1 font-bold text-gray-800">× {cd.soLuong}</span>
                      </td>
                      <td className="py-2.5 px-3 text-gray-600">{cd.diaDiemTreo}</td>
                      <td className="py-2.5 px-3 text-gray-600 font-mono text-[11px]">
                        {cd.thoiGianBatDau} → {cd.thoiGianKetThuc}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-[#dd4b39]">
                        {cd.kinhPhiVND.toLocaleString("vi-VN")} đ
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="rounded bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold">
                          Đạt yêu cầu mỹ quan
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

      {/* TAB 2: CỔNG TTĐT, MẠNG XÃ HỘI & ĐIỂM INTERNET, BƯU CHÍNH */}
      {activeTab === "THONG_TIN_DIEN_TU" && (
        <div className="space-y-4">
          {/* 2.1 Cổng TTĐT & Kênh mạng xã hội chính thức */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Cổng thông tin điện tử */}
            <div className="bg-white rounded-md border border-gray-200 p-4 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="text-xs font-bold uppercase text-gray-500">Trang TTĐT Phường</span>
                <Globe className="size-4 text-[#0073b7]" />
              </div>
              <div className="mt-3">
                <div className="font-extrabold text-sm text-gray-900">Cổng Thông tin Điện tử UBND Phường</div>
                <div className="text-[11px] font-mono text-gray-500 mt-0.5">https://phucuong.thudaumot.binhduong.gov.vn</div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
                <div className="bg-gray-50 p-2 rounded border border-gray-100">
                  <div className="font-bold text-gray-900 text-sm">18,520</div>
                  <div className="text-[10px] text-gray-500">Lượt truy cập/tháng</div>
                </div>
                <div className="bg-gray-50 p-2 rounded border border-gray-100">
                  <div className="font-bold text-gray-900 text-sm">62 bài</div>
                  <div className="text-[10px] text-gray-500">Tin chỉ đạo điều hành</div>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="size-3" /> Hoạt động ổn định
                </span>
                <a
                  href="https://binhduong.gov.vn"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#0073b7] hover:underline font-bold inline-flex items-center gap-1 text-[11px]"
                >
                  Xem Cổng ↗
                </a>
              </div>
            </div>

            {/* Zalo Official Account */}
            <div className="bg-white rounded-md border border-gray-200 p-4 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="text-xs font-bold uppercase text-gray-500">Kênh Zalo OA</span>
                <Share2 className="size-4 text-blue-600" />
              </div>
              <div className="mt-3">
                <div className="font-extrabold text-sm text-gray-900">Zalo OA: UBND Phường Phú Cường</div>
                <div className="text-[11px] text-gray-500 mt-0.5">Kênh tương tác số trực tiếp với người dân</div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
                <div className="bg-blue-50 p-2 rounded border border-blue-100">
                  <div className="font-bold text-blue-900 text-sm">14,280</div>
                  <div className="text-[10px] text-blue-700">Người quan tâm (Followers)</div>
                </div>
                <div className="bg-blue-50 p-2 rounded border border-blue-100">
                  <div className="font-bold text-blue-900 text-sm">98.4%</div>
                  <div className="text-[10px] text-blue-700">Phản hồi tự động qua Chatbot</div>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-blue-700 font-bold text-[11px]">Đã xác thực Tích vàng</span>
                <span className="text-gray-500 text-[11px]">Gửi ZNS thông báo DVC</span>
              </div>
            </div>

            {/* Fanpage Facebook */}
            <div className="bg-white rounded-md border border-gray-200 p-4 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="text-xs font-bold uppercase text-gray-500">Fanpage Phường</span>
                <Share2 className="size-4 text-indigo-600" />
              </div>
              <div className="mt-3">
                <div className="font-extrabold text-sm text-gray-900">Fanpage: Công dân &amp; Chính quyền</div>
                <div className="text-[11px] text-gray-500 mt-0.5">Tuyên truyền phong trào &amp; Cảnh báo an ninh</div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
                <div className="bg-indigo-50 p-2 rounded border border-indigo-100">
                  <div className="font-bold text-indigo-900 text-sm">21,600</div>
                  <div className="text-[10px] text-indigo-700">Người theo dõi</div>
                </div>
                <div className="bg-indigo-50 p-2 rounded border border-indigo-100">
                  <div className="font-bold text-indigo-900 text-sm">3.4k</div>
                  <div className="text-[10px] text-indigo-700">Tương tác bình quân/bài</div>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-500 text-[11px]">Kiểm duyệt bình luận 24/7</span>
                <span className="text-indigo-600 font-bold text-[11px]">Tiếp nhận phản ánh</span>
              </div>
            </div>
          </div>

          {/* 2.2 Quản lý đại lý Internet & Điểm cung cấp Bưu chính, Viễn thông */}
          <div className="bg-white rounded-md border border-gray-200 p-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Store className="size-4 text-[#dd4b39]" />
                <h3 className="text-sm font-bold text-gray-900">
                  Theo dõi &amp; Kiểm tra Đại lý Internet công cộng, Bưu cục &amp; Trạm BTS viễn thông
                </h3>
              </div>
              <span className="text-xs text-gray-500 font-medium">Quy định giờ mở cửa, PCCC &amp; An ninh thông tin</span>
            </div>

            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 border-b border-gray-200 font-bold">
                    <th className="py-2.5 px-3">Tên cơ sở kinh doanh</th>
                    <th className="py-2.5 px-3">Loại hình</th>
                    <th className="py-2.5 px-3">Chủ cơ sở / Đơn vị</th>
                    <th className="py-2.5 px-3">Địa chỉ &amp; Khu phố</th>
                    <th className="py-2.5 px-3">Số giấy phép</th>
                    <th className="py-2.5 px-3">Nội dung kiểm tra định kỳ</th>
                    <th className="py-2.5 px-3 text-center">Kết quả</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {coSoInternetList.map((cs) => (
                    <tr key={cs.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-gray-900">{cs.tenCoSo}</div>
                        <div className="text-[10px] text-gray-500 font-mono">SĐT: {cs.soDienThoai}</div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-bold border ${
                            cs.loaiHinh === "DAI_LY_INTERNET"
                              ? "bg-purple-50 text-purple-800 border-purple-200"
                              : cs.loaiHinh === "DIEM_BUU_CHINH"
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : "bg-sky-50 text-sky-800 border-sky-200"
                          }`}
                        >
                          {cs.loaiHinh === "DAI_LY_INTERNET"
                            ? "Đại lý Internet"
                            : cs.loaiHinh === "DIEM_BUU_CHINH"
                            ? "Điểm Bưu chính"
                            : "Trạm BTS"}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-gray-800 font-medium">{cs.chuCoSo}</td>
                      <td className="py-2.5 px-3 text-gray-600">
                        <div>{cs.diaChi}</div>
                        <div className="text-[10px] text-gray-500 font-medium">{cs.khuPho}</div>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-gray-600">
                        <div>{cs.soGiayPhep}</div>
                        <div className="text-[10px] text-gray-400">Cấp: {cs.ngayCapPhep}</div>
                      </td>
                      <td className="py-2.5 px-3 text-gray-700 max-w-xs">
                        <div className="line-clamp-2">{cs.noiDungKiemTraCuoi}</div>
                        <div className="text-[10px] text-gray-400 font-mono mt-0.5">Ngày KT: {cs.ngayKiemTraCuoi}</div>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold border ${
                            cs.ketQuaKiemTra === "CHAP_HANH_TOT"
                              ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                              : cs.ketQuaKiemTra === "NHAC_NHO"
                              ? "bg-amber-100 text-amber-800 border-amber-300"
                              : "bg-red-100 text-red-800 border-red-300"
                          }`}
                        >
                          {cs.ketQuaKiemTra === "CHAP_HANH_TOT"
                            ? "Chấp hành tốt"
                            : cs.ketQuaKiemTra === "NHAC_NHO"
                            ? "Nhắc nhở"
                            : "Xử phạt"}
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

      {/* TAB 3: CHUYỂN ĐỔI SỐ CỘNG ĐỒNG & TỔ CNSCĐ */}
      {activeTab === "CHUYEN_DOI_SO" && (
        <div className="space-y-4">
          {/* 3.1 Ba trụ cột Chuyển đổi số cấp cơ sở */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Trụ cột 1: Chính quyền số */}
            <div className="bg-white rounded-md border border-gray-200 p-4 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="text-xs font-bold uppercase text-[#dd4b39]">Trụ cột 1</span>
                <Building2 className="size-4 text-[#dd4b39]" />
              </div>
              <h4 className="font-extrabold text-sm text-gray-900 mt-2">Chính quyền số</h4>
              <p className="text-xs text-gray-500 mt-0.5">Số hóa hồ sơ, ký số công vụ và họp không giấy tờ</p>

              <div className="mt-3 space-y-2 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] mb-1 font-medium">
                    <span>Văn bản đi ký số điện tử:</span>
                    <span className="font-bold text-emerald-700">98.5%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: "98.5%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1 font-medium">
                    <span>Hồ sơ DVC nộp trực tuyến:</span>
                    <span className="font-bold text-[#0073b7]">94.2%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-[#0073b7] h-1.5 rounded-full" style={{ width: "94.2%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1 font-medium">
                    <span>Số hóa kết quả TTHC còn hiệu lực:</span>
                    <span className="font-bold text-amber-700">89.0%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-amber-600 h-1.5 rounded-full" style={{ width: "89%" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Trụ cột 2: Kinh tế số */}
            <div className="bg-white rounded-md border border-gray-200 p-4 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="text-xs font-bold uppercase text-amber-600">Trụ cột 2</span>
                <QrCode className="size-4 text-amber-600" />
              </div>
              <h4 className="font-extrabold text-sm text-gray-900 mt-2">Kinh tế số</h4>
              <p className="text-xs text-gray-500 mt-0.5">Thanh toán không dùng tiền mặt &amp; Chợ 4.0</p>

              <div className="mt-3 space-y-2 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] mb-1 font-medium">
                    <span>Tiểu thương chợ dùng mã VietQR:</span>
                    <span className="font-bold text-emerald-700">88.5%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: "88.5%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1 font-medium">
                    <span>Hộ kinh doanh xuất HĐĐT máy tính tiền:</span>
                    <span className="font-bold text-purple-700">92.0%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: "92%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1 font-medium">
                    <span>Thanh toán phí/lệ phí DVC không tiền mặt:</span>
                    <span className="font-bold text-[#0073b7]">96.8%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-[#0073b7] h-1.5 rounded-full" style={{ width: "96.8%" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Trụ cột 3: Xã hội số */}
            <div className="bg-white rounded-md border border-gray-200 p-4 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="text-xs font-bold uppercase text-purple-600">Trụ cột 3</span>
                <Smartphone className="size-4 text-purple-600" />
              </div>
              <h4 className="font-extrabold text-sm text-gray-900 mt-2">Xã hội số</h4>
              <p className="text-xs text-gray-500 mt-0.5">Định danh VNeID, VssID &amp; Kỹ năng số cho người dân</p>

              <div className="mt-3 space-y-2 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] mb-1 font-medium">
                    <span>Người trưởng thành có VNeID mức 2:</span>
                    <span className="font-bold text-purple-700">93.2%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: "93.2%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1 font-medium">
                    <span>Người có tài khoản thanh toán số:</span>
                    <span className="font-bold text-emerald-700">89.4%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: "89.4%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1 font-medium">
                    <span>Người cài App Bình Dương Số / VssID:</span>
                    <span className="font-bold text-[#0073b7]">78.5%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-[#0073b7] h-1.5 rounded-full" style={{ width: "78.5%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3.2 Hoạt động của Tổ công nghệ số cộng đồng (CNSCĐ) */}
          <div className="bg-white rounded-md border border-gray-200 p-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Users className="size-4 text-[#dd4b39]" />
                <h3 className="text-sm font-bold text-gray-900">
                  Hoạt động của Tổ Công nghệ số cộng đồng (CNSCĐ) tại 5 Khu phố
                </h3>
              </div>
              <span className="text-xs text-gray-500 font-medium">
                Mô hình &ldquo;Đi từng ngõ, gõ từng nhà, hướng dẫn từng người&rdquo;
              </span>
            </div>

            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 border-b border-gray-200 font-bold">
                    <th className="py-2.5 px-3">Tên Tổ CNS cộng đồng</th>
                    <th className="py-2.5 px-3">Tổ trưởng phụ trách</th>
                    <th className="py-2.5 px-3 text-center">Thành viên</th>
                    <th className="py-2.5 px-3 text-center">Hộ dân quản lý</th>
                    <th className="py-2.5 px-3 text-center">Tỷ lệ VNeID mức 2</th>
                    <th className="py-2.5 px-3 text-center">Tỷ lệ nộp DVC</th>
                    <th className="py-2.5 px-3 text-center">Thanh toán số</th>
                    <th className="py-2.5 px-3 text-center">Số đợt ra quân</th>
                    <th className="py-2.5 px-3 text-center">Đánh giá</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {toCNSList.map((to) => (
                    <tr key={to.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-gray-900">{to.tenTo}</td>
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-gray-800">{to.toTruong}</div>
                        <div className="text-[10px] text-gray-500 font-mono">SĐT: {to.sdtToTruong}</div>
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-gray-700">{to.soThanhVien} người</td>
                      <td className="py-2.5 px-3 text-center font-mono text-gray-700">{to.soHoDanQuanLy} hộ</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="font-mono font-bold text-purple-700">{to.tyLeCaiVNeIDPercent}%</span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="font-mono font-bold text-[#0073b7]">{to.tyLeDVCPercent}%</span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="font-mono font-bold text-emerald-700">{to.tyLeThanhToanSoPercent}%</span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-gray-700">
                        {to.soBuoiRaQuan} buổi
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold border ${
                            to.danhGiaHoatDong === "XUAT_SAC"
                              ? "bg-purple-100 text-purple-800 border-purple-300"
                              : to.danhGiaHoatDong === "TOT"
                              ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                              : "bg-gray-100 text-gray-700 border-gray-300"
                          }`}
                        >
                          {to.danhGiaHoatDong === "XUAT_SAC" ? "Xuất sắc" : to.danhGiaHoatDong === "TOT" ? "Tốt" : "Trung bình"}
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

      {/* MODAL THÊM BẢN TIN PHÁT THANH */}
      {showAddBanTinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full border border-gray-300 overflow-hidden">
            <div className="bg-[#dd4b39] text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="size-4" />
                <h3 className="font-bold text-sm">Biên tập Bản tin Phát thanh mới</h3>
              </div>
              <button
                onClick={() => setShowAddBanTinModal(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBanTin} className="p-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Tiêu đề bản tin <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Thông báo lịch tiêm chủng mở rộng đợt 2/2026..."
                  value={newBanTinTitle}
                  onChange={(e) => setNewBanTinTitle(e.target.value)}
                  className="w-full rounded border border-gray-300 p-2 text-xs outline-none focus:border-[#dd4b39]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Lĩnh vực tuyên truyền</label>
                  <select
                    value={newBanTinLinhVuc}
                    onChange={(e) => setNewBanTinLinhVuc(e.target.value as any)}
                    className="w-full rounded border border-gray-300 p-2 text-xs outline-none"
                  >
                    <option value="DVC_CDS">Dịch vụ công &amp; Chuyển đổi số</option>
                    <option value="CHINH_TRI">Nhiệm vụ chính trị - Lễ lớn</option>
                    <option value="PHAP_LUAT">Phổ biến giáo dục pháp luật</option>
                    <option value="Y_TE">Y tế - Môi trường - Phòng dịch</option>
                    <option value="AN_NINH">An ninh trật tự &amp; PCCC</option>
                    <option value="KHAN_CAP">Thông báo khẩn cấp</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Hình thức phát thanh</label>
                  <select
                    value={newBanTinHinhThuc}
                    onChange={(e) => setNewBanTinHinhThuc(e.target.value as any)}
                    className="w-full rounded border border-gray-300 p-2 text-xs outline-none"
                  >
                    <option value="GIONG_DOC_AI">Giọng đọc AI (Chuyển Text thành Speech)</option>
                    <option value="GHI_AM_CAN_BO">Cán bộ thu âm trực tiếp</option>
                    <option value="TIEP_SONG_DAI_TINH">Tiếp sóng Đài PT-TH Bình Dương</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Thời lượng (phút)</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={newBanTinThoiLuong}
                    onChange={(e) => setNewBanTinThoiLuong(Number(e.target.value))}
                    className="w-full rounded border border-gray-300 p-2 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Khung giờ phát dự kiến</label>
                  <input
                    type="text"
                    value={newBanTinKhungGio}
                    onChange={(e) => setNewBanTinKhungGio(e.target.value)}
                    className="w-full rounded border border-gray-300 p-2 text-xs outline-none"
                  />
                </div>
              </div>

              <div className="p-2.5 rounded bg-sky-50 text-sky-900 border border-sky-200 text-[11px] flex items-start gap-2">
                <Sparkles className="size-4 text-sky-600 shrink-0 mt-0.5" />
                <span>
                  Công nghệ Đài phát thanh thông minh tự động tổng hợp văn bản thành âm thanh tiếng Việt chuẩn,
                  lên lịch phát theo từng cụm loa hoặc phát diện rộng toàn địa bàn phường.
                </span>
              </div>

              <div className="pt-2 border-t border-gray-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddBanTinModal(false)}
                  className="px-3 py-1.5 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#dd4b39] hover:bg-[#c23321] text-white font-bold shadow-xs"
                >
                  Lưu &amp; Trình duyệt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL SỬA BẢNG TIN ĐIỆN TỬ LED */}
      {editingLed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full border border-gray-300 overflow-hidden">
            <div className="bg-gray-800 text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tv className="size-4 text-amber-400" />
                <h3 className="font-bold text-sm">Cập nhật nội dung Bảng tin LED</h3>
              </div>
              <button onClick={() => setEditingLed(null)} className="text-white/80 hover:text-white">
                <X className="size-4" />
              </button>
            </div>

            <div className="p-4 space-y-3 text-xs">
              <div className="font-bold text-gray-900">{editingLed.tenBang}</div>
              <div className="text-[11px] text-gray-500">{editingLed.viTri} · {editingLed.kichThuoc}</div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Nội dung chữ chạy (Cuộn LED)
                </label>
                <textarea
                  rows={4}
                  value={ledContent}
                  onChange={(e) => setLedContent(e.target.value)}
                  className="w-full rounded border border-gray-300 p-2 text-xs outline-none focus:border-gray-800 font-mono"
                  placeholder="Nhập nội dung tuyên truyền..."
                />
              </div>

              {/* Xem trước LED */}
              <div>
                <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">Mô phỏng hiển thị LED:</div>
                <div className="p-2 rounded bg-black text-amber-400 font-mono text-xs overflow-hidden border border-gray-800">
                  <div className="animate-marquee whitespace-nowrap">{ledContent || "..."}</div>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingLed(null)}
                  className="px-3 py-1.5 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={handleSaveLed}
                  className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs"
                >
                  Đẩy lên Bảng LED ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
