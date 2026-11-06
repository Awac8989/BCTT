import { useState } from "react";
import {
  Award,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Star,
  Plus,
  Send,
  Sparkles,
  Calendar,
  Building2,
  ShieldCheck,
  Eye,
  Filter,
  Search,
  MessageSquare,
  ChevronRight,
  TrendingUp,
  Scale,
  ThumbsUp,
  ThumbsDown,
  Sliders,
  Shield,
  CheckSquare,
  Layers,
  FileCheck,
} from "lucide-react";
import { useAppState, appStore } from "@/services/app-state";
import {
  type ProductCheckInItem,
  type TaskAssignmentItem,
  type DomainCode,
  type KpiEvaluationItem,
  type DiemThuongPhatItem,
} from "@/data/domain-mock";
import { toast } from "sonner";

interface ExecutiveKpiCheckInProps {
  onOpenChatWithCanBo?: (canBoName: string) => void;
}

export function ExecutiveKpiCheckIn({ onOpenChatWithCanBo }: ExecutiveKpiCheckInProps) {
  const {
    currentUser,
    productCheckInList,
    taskAssignmentList,
    kpiEvaluationList,
    giaDinhVanHoaList,
    coSoDichVuVanHoaList,
    hoSoTTHCVanHoaList,
    baoLucGiaDinhList,
  } = useAppState();

  const [activeTab, setActiveTab] = useState<"SAN_PHAM" | "GIAO_VIEC" | "TIEN_DO_CAN_BO" | "CHAM_DIEM_KPI">("SAN_PHAM");
  const [filterDomain, setFilterDomain] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [search, setSearch] = useState("");

  // Modal Giao việc
  const [showGiaoViecModal, setShowGiaoViecModal] = useState(false);
  const [taskTieuDe, setTaskTieuDe] = useState("");
  const [taskCanBo, setTaskCanBo] = useState("Nguyễn Thanh Tùng");
  const [taskChucVu, setTaskChucVu] = useState("Công chức Văn hóa - Xã hội");
  const [taskDomain, setTaskDomain] = useState<DomainCode>("VH_TT_DL");
  const [taskDeadline, setTaskDeadline] = useState("30/10/2026");
  const [taskPriority, setTaskPriority] = useState<"HOA_TOC" | "KHAN" | "THUONG">("KHAN");
  const [taskDeliverable, setTaskDeliverable] = useState("");

  // Modal Chi tiết / Phê chuẩn sản phẩm
  const [reviewingProduct, setReviewingProduct] = useState<ProductCheckInItem | null>(null);
  const [reviewYKien, setReviewYKien] = useState("");
  const [reviewDiem, setReviewDiem] = useState(5);

  // Modal Thẩm định & Chấm điểm KPI Đa Chiều (NĐ 90 & NĐ 48)
  const [evaluatingKpi, setEvaluatingKpi] = useState<KpiEvaluationItem | null>(null);
  const [evalTc1, setEvalTc1] = useState(38);
  const [evalTc2, setEvalTc2] = useState(25);
  const [evalTc3, setEvalTc3] = useState(14);
  const [evalTc4, setEvalTc4] = useState(10);
  const [evalTc5, setEvalTc5] = useState(9);
  const [evalButPhe, setEvalButPhe] = useState("");
  const [evalKhenThuong, setEvalKhenThuong] = useState("");
  const [evalUseSmartCA, setEvalUseSmartCA] = useState(true);

  // Modal Ghi nhận Điểm Thưởng / Điểm Trừ Công Vụ
  const [penaltyModalKpi, setPenaltyModalKpi] = useState<KpiEvaluationItem | null>(null);
  const [penaltyType, setPenaltyType] = useState<"THUONG" | "PHAT">("THUONG");
  const [penaltyPoints, setPenaltyPoints] = useState(5);
  const [penaltyPreset, setPenaltyPreset] = useState("THUONG_TRUOC_HAN");
  const [penaltyReason, setPenaltyReason] = useState("");
  const [penaltyEvidence, setPenaltyEvidence] = useState("");

  // Bộ lọc cho Tab Chấm điểm KPI
  const [kpiSearch, setKpiSearch] = useState("");
  const [kpiFilterRank, setKpiFilterRank] = useState<string>("ALL");

  const handleOpenEvaluateModal = (kpi: KpiEvaluationItem) => {
    setEvaluatingKpi(kpi);
    setEvalTc1(kpi.tieuChi1_NhiemVuChuyenMon.diemLanhDaoCham || kpi.tieuChi1_NhiemVuChuyenMon.diemHeThongAuto);
    setEvalTc2(kpi.tieuChi2_MotCuaDvcQd766.diemLanhDaoCham || kpi.tieuChi2_MotCuaDvcQd766.diemHeThongAuto);
    setEvalTc3(kpi.tieuChi3_CsatHaiLongDan.diemLanhDaoCham || kpi.tieuChi3_CsatHaiLongDan.diemHeThongAuto);
    setEvalTc4(kpi.tieuChi4_KyLuatVanHoaCongSo.diemLanhDaoCham || kpi.tieuChi4_KyLuatVanHoaCongSo.diemHeThongAuto);
    setEvalTc5(kpi.tieuChi5_SangKienChuyenDoiSo.diemLanhDaoCham || kpi.tieuChi5_SangKienChuyenDoiSo.diemHeThongAuto);
    setEvalButPhe(kpi.lanhDaoThamDinh?.nhanXetButPhe || "Hoàn thành tốt các chỉ tiêu nhiệm vụ được giao trong tháng.");
    setEvalKhenThuong(kpi.lanhDaoThamDinh?.deXuatKhenThuong || "");
    setEvalUseSmartCA(true);
  };

  const handleSaveLeaderEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evaluatingKpi) return;
    const diemTong = evalTc1 + evalTc2 + evalTc3 + evalTc4 + evalTc5;
    appStore.lanhDaoPheDuyetKpi(evaluatingKpi.id, {
      diemLanhDao: diemTong,
      nhanXetButPhe: evalButPhe.trim(),
      deXuatKhenThuong: evalKhenThuong.trim() || undefined,
      maKySoSmartCA: evalUseSmartCA ? `SMARTCA-UBND-${Date.now().toString(16).toUpperCase()}` : undefined,
    });
    toast.success(`Đã thẩm định và ký duyệt KPI cho cán bộ ${evaluatingKpi.canBoName}! Điểm Lãnh đạo: ${diemTong}/100.`);
    setEvaluatingKpi(null);
  };

  const handleOpenPenaltyModal = (kpi: KpiEvaluationItem, loai: "THUONG" | "PHAT" = "THUONG") => {
    setPenaltyModalKpi(kpi);
    setPenaltyType(loai);
    if (loai === "THUONG") {
      setPenaltyPreset("THUONG_TRUOC_HAN");
      setPenaltyPoints(5);
      setPenaltyReason("Trả trước hạn >40% hồ sơ TTHC trong tháng theo Bộ chỉ số Quyết định 766/QĐ-TTg");
      setPenaltyEvidence("Hệ thống Một cửa điện tử ghi nhận tỷ lệ trước hạn đạt mức xuất sắc");
    } else {
      setPenaltyPreset("PHAT_TRE_HAN");
      setPenaltyPoints(5);
      setPenaltyReason("Có hồ sơ TTHC giải quyết quá hạn trên Cổng DVC Quốc gia (QĐ 766)");
      setPenaltyEvidence("Cổng DVCQG cảnh báo trễ hạn kiểm tra hồ sơ");
    }
  };

  const handleAddPenaltyBonus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!penaltyModalKpi || !penaltyReason.trim()) return;
    appStore.ghiNhanDiemThuongPhat(penaltyModalKpi.id, {
      loai: penaltyType,
      soDiem: penaltyPoints,
      maLoiHoacSangKien: penaltyPreset,
      lyDo: penaltyReason.trim(),
      chungTuLienQuan: penaltyEvidence.trim() || undefined,
    });
    toast.success(`Đã ghi nhận ${penaltyType === "THUONG" ? "điểm thưởng +" : "điểm trừ -"}${penaltyPoints} cho cán bộ ${penaltyModalKpi.canBoName}!`);
    setPenaltyModalKpi(null);
    setPenaltyReason("");
    setPenaltyEvidence("");
  };

  // Danh sách cán bộ và KPI tổng hợp
  const canBoKpiList = [
    {
      name: "Nguyễn Thanh Tùng",
      role: "Công chức Văn hóa - Xã hội (Văn hóa, Thể thao, Du lịch & Gia đình)",
      domain: "VH_TT_DL",
      avatarText: "NTT",
      kpiPercent: 96,
      productsCount: productCheckInList.filter((p) => p.canBoNop.includes("Tùng")).length,
      pendingCount: productCheckInList.filter((p) => p.canBoNop.includes("Tùng") && p.trangThai === "CHO_LANH_DAO_DUYET").length,
      highlights: "528 hộ GĐVH KP1 (97.8%), 100% di tích có QR Guide, Đội 814 xử lý 1 vi phạm quảng cáo",
    },
    {
      name: "ThS. Trần Thị Kim Oanh",
      role: "Công chức phụ trách Giáo dục - Đào tạo cơ sở & Khuyến học",
      domain: "GD_DT",
      avatarText: "TKO",
      kpiPercent: 98,
      productsCount: productCheckInList.filter((p) => p.canBoNop.includes("Oanh")).length,
      pendingCount: productCheckInList.filter((p) => p.canBoNop.includes("Oanh") && p.trangThai === "CHO_LANH_DAO_DUYET").length,
      highlights: "Phổ cập GDMN 5T đạt 99.8%, 14/14 nhóm trẻ tư thục đảm bảo VSATTP và an toàn",
    },
    {
      name: "Lê Hoàng Nam",
      role: "Công chức Lao động, Việc làm & An sinh xã hội",
      domain: "LDTBXH_AN_SINH",
      avatarText: "LHN",
      kpiPercent: 93,
      productsCount: productCheckInList.filter((p) => p.canBoNop.includes("Nam")).length,
      pendingCount: productCheckInList.filter((p) => p.canBoNop.includes("Nam") && p.trangThai === "CHO_LANH_DAO_DUYET").length,
      highlights: "98.6% chi trả trợ cấp qua ATM thẻ ngân hàng Vietcombank, giảm 4 hộ nghèo",
    },
    {
      name: "Vũ Đình Cường",
      role: "Chuyên viên Văn hóa - Thông tin & Chuyển đổi số cơ sở",
      domain: "TT_CDS",
      avatarText: "VDC",
      kpiPercent: 91,
      productsCount: 4,
      pendingCount: 0,
      highlights: "100% cụm loa thông minh phát tin an toàn, vận hành tốt 4 Tổ công nghệ số khu phố",
    },
  ];

  // Lọc sản phẩm check-in
  const filteredProducts = productCheckInList.filter((p) => {
    const matchSearch =
      search.trim() === "" ||
      p.tenSanPham.toLowerCase().includes(search.toLowerCase()) ||
      p.canBoNop.toLowerCase().includes(search.toLowerCase()) ||
      p.maSanPham.toLowerCase().includes(search.toLowerCase());
    const matchDomain = filterDomain === "ALL" || p.domain === filterDomain;
    const matchStatus = filterStatus === "ALL" || p.trangThai === filterStatus;
    return matchSearch && matchDomain && matchStatus;
  });

  // Xử lý Lãnh đạo phê chuẩn sản phẩm
  const handleApprove = (item: ProductCheckInItem) => {
    appStore.pheDuyetProductCheckIn(item.id, "DA_PHE_CHUAN", reviewYKien || "Lãnh đạo đã phê chuẩn đạt yêu cầu.", reviewDiem);
    toast.success(`Đã phê chuẩn sản phẩm "${item.maSanPham}" của cán bộ ${item.canBoNop}!`);
    setReviewingProduct(null);
    setReviewYKien("");
  };

  const handleRequestRevision = (item: ProductCheckInItem) => {
    if (!reviewYKien.trim()) {
      toast.error("Vui lòng ghi rõ ý kiến chỉ đạo yêu cầu hoàn thiện lại sản phẩm!");
      return;
    }
    appStore.pheDuyetProductCheckIn(item.id, "YEU_CAU_BO_SUNG", reviewYKien, 3);
    toast.warning(`Đã chuyển yêu cầu hoàn thiện lại sản phẩm cho cán bộ ${item.canBoNop}!`);
    setReviewingProduct(null);
    setReviewYKien("");
  };

  // Xử lý Lãnh đạo giao việc mới
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTieuDe.trim() || !taskDeliverable.trim()) return;

    appStore.giaoTaskAssignment({
      tieuDe: taskTieuDe.trim(),
      canBoPhuTrach: taskCanBo,
      chucVu: taskChucVu,
      domain: taskDomain,
      nguoiGiaoViec: currentUser.fullName,
      chucVuNguoiGiao: currentUser.title,
      hanChot: taskDeadline,
      mucDoUuTien: taskPriority,
      sanPhamYeuCau: taskDeliverable.trim(),
    });

    toast.success(`Đã giao nhiệm vụ mới cho đồng chí ${taskCanBo} và gửi thông báo qua kênh trao đổi nội bộ!`);
    setShowGiaoViecModal(false);
    setTaskTieuDe("");
    setTaskDeliverable("");
  };

  return (
    <div className="space-y-6">
      {/* Executive Command Banner */}
      <div className="bg-gradient-to-r from-[#222d32] via-[#2c3b41] to-[#1e282c] text-white rounded-xl p-6 shadow-md border-b-2 border-[#dd4b39] relative overflow-hidden">
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#dd4b39]/20 text-red-200 border border-[#dd4b39]/40 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            <Building2 className="w-3.5 h-3.5 text-red-400" />
            Trung tâm Giám sát Điều hành Lãnh đạo UBND Phường
          </div>
          <h2 className="text-2xl font-bold mb-2">
            Giám sát Tiến độ Công tác, Thẩm định Sản phẩm Công vụ &amp; Giao việc Điện tử
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            Bảng điều hành chuyên quyền dành cho Lãnh đạo UBND Phường: Theo dõi thời gian thực kết quả đầu ra của từng công chức (Văn hóa, Giáo dục, An sinh, Thông tin), phê chuẩn sản phẩm công vụ, giao nhiệm vụ trực tiếp và liên kết trao đổi nhanh.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-black/40 border border-slate-700/60 p-2.5 rounded-xl">
              <div className="text-slate-400">Tỷ lệ hoàn thành nhiệm vụ</div>
              <div className="text-xl font-bold text-emerald-400 mt-0.5">94.8%</div>
              <div className="text-[11px] text-slate-400">Đạt chỉ tiêu HĐND giao</div>
            </div>
            <div className="bg-black/40 border border-slate-700/60 p-2.5 rounded-xl">
              <div className="text-slate-400">Sản phẩm chờ duyệt</div>
              <div className="text-xl font-bold text-amber-400 mt-0.5">
                {productCheckInList.filter((p) => p.trangThai === "CHO_LANH_DAO_DUYET").length} sản phẩm
              </div>
              <div className="text-[11px] text-slate-400">Cần Lãnh đạo ký duyệt</div>
            </div>
            <div className="bg-black/40 border border-slate-700/60 p-2.5 rounded-xl">
              <div className="text-slate-400">Nhiệm vụ đang thực hiện</div>
              <div className="text-xl font-bold text-red-400 mt-0.5">
                {taskAssignmentList.filter((t) => t.trangThai !== "HOAN_THANH").length} công việc
              </div>
              <div className="text-[11px] text-slate-400">Đúng hạn 100%</div>
            </div>
            <div className="bg-black/40 border border-slate-700/60 p-2.5 rounded-xl">
              <div className="text-slate-400">Đội ngũ Cán bộ</div>
              <div className="text-xl font-bold text-slate-200 mt-0.5">4 Khối ngành</div>
              <div className="text-[11px] text-slate-400">Chuyên môn hóa 100%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab("SAN_PHAM")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "SAN_PHAM"
                ? "bg-[#dd4b39] text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            Sổ Sản phẩm Công vụ ({productCheckInList.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("GIAO_VIEC")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "GIAO_VIEC"
                ? "bg-[#dd4b39] text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            Quản lý Giao việc &amp; Phân công ({taskAssignmentList.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("TIEN_DO_CAN_BO")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "TIEN_DO_CAN_BO"
                ? "bg-[#dd4b39] text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            Đánh giá Kết quả &amp; Năng lực Cán bộ
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("CHAM_DIEM_KPI")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "CHAM_DIEM_KPI"
                ? "bg-[#dd4b39] text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Scale className="w-4 h-4 text-amber-300" />
            <span>Đánh giá Đa Chiều &amp; Thưởng Phạt ({kpiEvaluationList.length})</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => setShowGiaoViecModal(true)}
          className="flex items-center gap-2 px-3.5 py-2 bg-[#dd4b39] hover:bg-[#c23321] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Lãnh đạo Giao việc Mới</span>
        </button>
      </div>

      {/* Tab 1: Sổ Check-in Sản phẩm đầu ra */}
      {activeTab === "SAN_PHAM" && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm theo tên, cán bộ nộp, mã sản phẩm..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-3">
              <select
                value={filterDomain}
                onChange={(e) => setFilterDomain(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="ALL">Tất cả lĩnh vực chuyên môn</option>
                <option value="VH_TT_DL">Văn hóa, Thể thao &amp; Gia đình</option>
                <option value="GD_DT">Giáo dục &amp; Đào tạo</option>
                <option value="LDTBXH_AN_SINH">Lao động, NCC &amp; An sinh XH</option>
                <option value="TT_CDS">Thông tin &amp; Chuyển đổi số</option>
              </select>
            </div>
            <div className="md:col-span-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="ALL">Tất cả trạng thái duyệt</option>
                <option value="CHO_LANH_DAO_DUYET">Chờ Lãnh đạo duyệt</option>
                <option value="DA_PHE_CHUAN">Đã phê chuẩn đạt yêu cầu</option>
                <option value="YEU_CAU_BO_SUNG">Yêu cầu hoàn thiện lại</option>
              </select>
            </div>
          </div>

          {/* Danh sách thẻ sản phẩm check-in */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {prod.maSanPham}
                        </span>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                          {prod.loaiSanPham}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                        {prod.tenSanPham}
                      </h4>
                    </div>

                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full border flex-shrink-0 flex items-center gap-1 ${
                        prod.trangThai === "DA_PHE_CHUAN"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300"
                          : prod.trangThai === "CHO_LANH_DAO_DUYET"
                          ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300"
                          : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300"
                      }`}
                    >
                      {prod.trangThai === "DA_PHE_CHUAN" ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Đã phê chuẩn
                        </>
                      ) : prod.trangThai === "CHO_LANH_DAO_DUYET" ? (
                        <>
                          <Clock className="w-3.5 h-3.5" /> Chờ Sếp duyệt
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3.5 h-3.5" /> Yêu cầu sửa
                        </>
                      )}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 my-2 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                    {prod.moTa}
                  </p>

                  <div className="text-xs space-y-1 text-slate-500 dark:text-slate-400">
                    <div className="flex justify-between">
                      <span>Cán bộ nộp:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {prod.canBoNop} ({prod.chucVu})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Thời gian nộp:</span>
                      <span>{prod.ngayNop}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>File đính kèm:</span>
                      <span className="font-mono text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                        {prod.fileDinhKem}
                      </span>
                    </div>
                  </div>

                  {prod.yKienLanhDao && (
                    <div className="mt-3 p-2.5 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-xs">
                      <div className="font-semibold text-emerald-900 dark:text-emerald-300 flex items-center justify-between">
                        <span>Ý kiến Lãnh đạo phê duyệt ({prod.lanhDaoPheDuyet}):</span>
                        {prod.diemDanhGia && (
                          <div className="flex items-center gap-0.5 text-amber-500">
                            {Array.from({ length: prod.diemDanhGia }).map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-amber-500" />
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-slate-700 dark:text-slate-300 mt-1 italic">
                        &quot;{prod.yKienLanhDao}&quot;
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => onOpenChatWithCanBo?.(prod.canBoNop)}
                    className="inline-flex items-center gap-1.5 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 cursor-pointer font-medium"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Nhắn tin với {prod.canBoNop.split(" ").slice(-1)[0]}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setReviewingProduct(prod);
                        setReviewYKien(prod.yKienLanhDao || "");
                        setReviewDiem(prod.diemDanhGia || 5);
                      }}
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 rounded-lg font-semibold transition-colors cursor-pointer"
                    >
                      Thẩm định &amp; Phê chuẩn
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Quản lý Giao việc & Phân công */}
      {activeTab === "GIAO_VIEC" && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold uppercase tracking-wider">
                    <th className="py-3 px-4">Mã việc / Tiêu đề nhiệm vụ</th>
                    <th className="py-3 px-4">Cán bộ phụ trách</th>
                    <th className="py-3 px-4">Mức độ / Hạn chót</th>
                    <th className="py-3 px-4">Sản phẩm đầu ra yêu cầu</th>
                    <th className="py-3 px-4 text-center">Tiến độ thực hiện</th>
                    <th className="py-3 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {taskAssignmentList.map((task) => (
                    <tr key={task.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">
                          {task.tieuDe}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                          <span className="font-mono">{task.maCongViec}</span>
                          <span>• Giao bởi: {task.nguoiGiaoViec} ({task.ngayGiao})</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-xs">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          {task.canBoPhuTrach}
                        </div>
                        <div className="text-slate-500">{task.chucVu}</div>
                      </td>
                      <td className="py-3.5 px-4 text-xs">
                        <span
                          className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 ${
                            task.mucDoUuTien === "HOA_TOC"
                              ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                              : task.mucDoUuTien === "KHAN"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                          }`}
                        >
                          {task.mucDoUuTien === "HOA_TOC" ? "HỎA TỐC" : task.mucDoUuTien === "KHAN" ? "KHẨN" : "THƯỜNG"}
                        </span>
                        <div className="font-medium text-slate-700 dark:text-slate-300">
                          Hạn: {task.hanChot}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-600 dark:text-slate-300 max-w-xs">
                        {task.sanPhamYeuCau}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="font-bold text-xs text-blue-600 dark:text-blue-400 mb-1">
                          {task.tienDoPercent}%
                        </div>
                        <div className="w-24 mx-auto bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-blue-600 h-full rounded-full"
                            style={{ width: `${task.tienDoPercent}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => onOpenChatWithCanBo?.(task.canBoPhuTrach)}
                          className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-blue-50 hover:text-blue-600 dark:bg-slate-800 dark:hover:bg-blue-950/60 rounded-md font-medium transition-colors cursor-pointer"
                        >
                          Nhắc nhở
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Tiến độ KPI & Đánh giá Cán bộ */}
      {activeTab === "TIEN_DO_CAN_BO" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {canBoKpiList.map((cb) => (
            <div
              key={cb.name}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="size-11 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                    {cb.avatarText}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      {cb.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {cb.role}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
                    {cb.kpiPercent}%
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">KPI Hoàn thành</div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden my-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${cb.kpiPercent}%` }}
                />
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg text-xs space-y-1.5 my-3">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Số sản phẩm đã nộp:</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{cb.productsCount} sản phẩm</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Sản phẩm chờ Sếp duyệt:</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">{cb.pendingCount} sản phẩm</span>
                </div>
                <div className="pt-1 border-t border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">Điểm sáng tiêu biểu:</span> {cb.highlights}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => onOpenChatWithCanBo?.(cb.name)}
                  className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Trao đổi chỉ đạo riêng</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTaskCanBo(cb.name);
                    setTaskChucVu(cb.role);
                    setShowGiaoViecModal(true);
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-semibold transition-colors cursor-pointer"
                >
                  Giao việc bổ sung
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Bảng Chấm Điểm KPI Đa Chiều & Thưởng Phạt (NĐ 90 & NĐ 48) */}
      {activeTab === "CHAM_DIEM_KPI" && (
        <div className="space-y-6">
          {/* Executive Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
                <span>Cán bộ được đánh giá</span>
                <Users className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2">
                {kpiEvaluationList.length} <span className="text-sm font-normal text-slate-500">công chức</span>
              </div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>100% hoàn thành phiếu tự chấm</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
                <span>Hoàn thành Xuất sắc</span>
                <Award className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
                {kpiEvaluationList.filter((k) => k.xepLoai === "HOAN_THANH_XUAT_SAC").length}{" "}
                <span className="text-sm font-normal text-slate-500">
                  / {kpiEvaluationList.length} ({Math.round((kpiEvaluationList.filter((k) => k.xepLoai === "HOAN_THANH_XUAT_SAC").length / kpiEvaluationList.length) * 100)}%)
                </span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Chuẩn NĐ 48/2023: Không quá 20% trừ xuất sắc vượt trội
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
                <span>Thưởng &amp; Phạt Công vụ</span>
                <Scale className="w-4 h-4 text-amber-500" />
              </div>
              <div className="flex items-center gap-3 mt-2">
                <div className="text-emerald-600 dark:text-emerald-400 font-bold text-lg flex items-center gap-1">
                  <ThumbsUp className="w-4 h-4" />
                  <span>+{kpiEvaluationList.reduce((acc, k) => acc + k.tongDiemThuong, 0)}đ</span>
                </div>
                <div className="text-rose-600 dark:text-rose-400 font-bold text-lg flex items-center gap-1">
                  <ThumbsDown className="w-4 h-4" />
                  <span>-{kpiEvaluationList.reduce((acc, k) => acc + k.tongDiemTru, 0)}đ</span>
                </div>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Tự động từ QĐ 766 Một cửa &amp; Khảo sát hài lòng
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
                <span>Thẩm định Ký số công vụ</span>
                <ShieldCheck className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">
                {kpiEvaluationList.filter((k) => k.trangThai === "DA_PHE_DUYET").length} <span className="text-sm font-normal text-slate-500">đã ký duyệt</span>
              </div>
              <div className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ký số chức danh điện tử</span>
              </div>
            </div>
          </div>

          {/* Quy chuẩn Khung Tiêu chí NĐ 90/2020 & NĐ 48/2023 */}
          <div className="bg-gradient-to-r from-blue-900/10 via-indigo-900/10 to-purple-900/10 dark:from-blue-950/40 dark:via-indigo-950/40 dark:to-purple-950/40 border border-blue-200 dark:border-blue-800/60 rounded-xl p-4.5 text-xs text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-2 font-bold text-blue-900 dark:text-blue-300 text-sm mb-2">
              <FileCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Khung Tiêu chuẩn Đánh giá KPI 100 Điểm &amp; Cơ chế Chấm Điểm Đa Chiều (NĐ 90/2020/NĐ-CP &amp; NĐ 48/2023/NĐ-CP)</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mt-3">
              <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <div className="font-bold text-blue-700 dark:text-blue-400 flex items-center justify-between">
                  <span>1. Chuyên môn &amp; Tiến độ</span>
                  <span className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded text-[10px]">Tối đa 40đ</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Tiến độ, khối lượng và chất lượng các nhiệm vụ trọng tâm do Đảng ủy, HĐND và UBND Phường giao.
                </p>
              </div>

              <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <div className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center justify-between">
                  <span>2. Một cửa QĐ 766</span>
                  <span className="px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded text-[10px]">Tối đa 25đ</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Tỷ lệ đúng hạn, số hóa hồ sơ, liên thông DVC Quốc gia và thanh toán trực tuyến Một cửa.
                </p>
              </div>

              <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <div className="font-bold text-amber-700 dark:text-amber-400 flex items-center justify-between">
                  <span>3. Hài lòng của Nhân dân (SIPAS)</span>
                  <span className="px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 rounded text-[10px]">Tối đa 15đ</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Chỉ số SIPAS từ Kiosk đánh giá, QR Code khảo sát thực địa và tỷ lệ phản ánh tiêu cực = 0.
                </p>
              </div>

              <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <div className="font-bold text-purple-700 dark:text-purple-400 flex items-center justify-between">
                  <span>4. Kỷ luật &amp; Văn hóa</span>
                  <span className="px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded text-[10px]">Tối đa 10đ</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Chấp hành nghiêm giờ giấc, quy chế văn hóa công sở, đạo đức công vụ và đoàn kết nội bộ.
                </p>
              </div>

              <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <div className="font-bold text-cyan-700 dark:text-cyan-400 flex items-center justify-between">
                  <span>5. Sáng kiến &amp; CĐS</span>
                  <span className="px-1.5 py-0.5 bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300 rounded text-[10px]">Tối đa 10đ</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Sáng kiến cải tiến quy trình, ứng dụng CNTT, QR Guide, số hóa dữ liệu cơ sở vượt mức.
                </p>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-blue-200/60 dark:border-blue-800/40 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800 dark:text-slate-200">Cơ chế 3 Chiều:</span>
                <span>(1) Cán bộ tự chấm &rarr; (2) Hệ thống tính tự động &rarr; (3) Lãnh đạo thẩm định + Thưởng/Phạt = Điểm cuối cùng</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800 dark:text-slate-200">Thang xếp loại:</span>
                <span className="text-emerald-600 font-semibold">&ge;90đ (Xuất sắc)</span>
                <span>•</span>
                <span className="text-blue-600 font-semibold">70-89đ (Tốt)</span>
                <span>•</span>
                <span className="text-amber-600 font-semibold">50-69đ (Hoàn thành)</span>
                <span>•</span>
                <span className="text-rose-600 font-semibold">&lt;50đ (Không HT)</span>
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm cán bộ theo tên, chức vụ, mã phiếu KPI..."
                value={kpiSearch}
                onChange={(e) => setKpiSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={kpiFilterRank}
                onChange={(e) => setKpiFilterRank(e.target.value)}
                className="px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="ALL">Tất cả xếp loại thi đua</option>
                <option value="HOAN_THANH_XUAT_SAC">Hoàn thành Xuất sắc (&ge;90đ)</option>
                <option value="HOAN_THANH_TOT">Hoàn thành Tốt (70 - 89đ)</option>
                <option value="HOAN_THANH">Hoàn thành nhiệm vụ (50 - 69đ)</option>
                <option value="KHONG_HOAN_THANH">Không hoàn thành (&lt;50đ)</option>
              </select>
            </div>
          </div>

          {/* Comparative KPI Cards Matrix */}
          <div className="space-y-4">
            {kpiEvaluationList
              .filter((kpi) => {
                const matchSearch =
                  kpiSearch.trim() === "" ||
                  kpi.canBoName.toLowerCase().includes(kpiSearch.toLowerCase()) ||
                  kpi.chucVu.toLowerCase().includes(kpiSearch.toLowerCase()) ||
                  kpi.maPhieuDanhGia.toLowerCase().includes(kpiSearch.toLowerCase());
                const matchRank = kpiFilterRank === "ALL" || kpi.xepLoai === kpiFilterRank;
                return matchSearch && matchRank;
              })
              .map((kpi) => {
                const isApproved = kpi.trangThai === "DA_PHE_DUYET";
                const rankColor =
                  kpi.xepLoai === "HOAN_THANH_XUAT_SAC"
                    ? "text-emerald-700 bg-emerald-50 border-emerald-300 dark:text-emerald-300 dark:bg-emerald-950/40"
                    : kpi.xepLoai === "HOAN_THANH_TOT"
                    ? "text-blue-700 bg-blue-50 border-blue-300 dark:text-blue-300 dark:bg-blue-950/40"
                    : kpi.xepLoai === "HOAN_THANH"
                    ? "text-amber-700 bg-amber-50 border-amber-300 dark:text-amber-300 dark:bg-amber-950/40"
                    : "text-rose-700 bg-rose-50 border-rose-300 dark:text-rose-300 dark:bg-rose-950/40";

                const rankText =
                  kpi.xepLoai === "HOAN_THANH_XUAT_SAC"
                    ? "HOÀN THÀNH XUẤT SẮC"
                    : kpi.xepLoai === "HOAN_THANH_TOT"
                    ? "HOÀN THÀNH TỐT"
                    : kpi.xepLoai === "HOAN_THANH"
                    ? "HOÀN THÀNH NHIỆM VỤ"
                    : "KHÔNG HOÀN THÀNH";

                return (
                  <div
                    key={kpi.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs hover:shadow-md transition-shadow"
                  >
                    {/* Header Cán bộ & Điểm tổng */}
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold text-base flex items-center justify-center shadow-xs flex-shrink-0">
                          {kpi.avatarText}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                              {kpi.canBoName}
                            </h3>
                            <span className="text-xs font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                              {kpi.maPhieuDanhGia}
                            </span>
                            <span className="text-xs font-medium text-slate-500">
                              • Kỳ: {kpi.kyDanhGia}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {kpi.chucVu} — {kpi.phongBan}
                          </div>
                        </div>
                      </div>

                      {/* Grade & Final Score Badges */}
                      <div className="flex items-center gap-3 self-end lg:self-center">
                        <div className="text-right">
                          <div className="text-xs text-slate-500 font-medium">Điểm ròng cuối cùng</div>
                          <div className="text-2xl font-extrabold text-blue-700 dark:text-blue-400">
                            {kpi.diemTongKetCuoiCung} <span className="text-sm font-normal text-slate-400">/100</span>
                          </div>
                        </div>
                        <div className={`px-3 py-1.5 rounded-lg border text-xs font-bold tracking-wide ${rankColor}`}>
                          {rankText}
                        </div>
                      </div>
                    </div>

                    {/* 3-Dimensional Comparative Matrix */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 my-4 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs">
                      <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/60 dark:border-slate-800">
                        <div className="text-slate-500 text-[11px]">1. Cán bộ tự chấm</div>
                        <div className="text-base font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                          {kpi.diemTuChamTong} <span className="text-xs font-normal text-slate-400">/100</span>
                        </div>
                        <div className="text-[10px] text-slate-400">Khách quan cơ sở</div>
                      </div>

                      <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/60 dark:border-slate-800">
                        <div className="text-blue-600 dark:text-blue-400 text-[11px] font-semibold flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          <span>2. Hệ thống Auto</span>
                        </div>
                        <div className="text-base font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                          {kpi.diemHeThongAutoTong} <span className="text-xs font-normal text-slate-400">/100</span>
                        </div>
                        <div className="text-[10px] text-slate-400">Từ QĐ 766 &amp; Khảo sát hài lòng</div>
                      </div>

                      <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/60 dark:border-slate-800">
                        <div className="text-indigo-600 dark:text-indigo-400 text-[11px] font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>3. Lãnh đạo thẩm định</span>
                        </div>
                        <div className="text-base font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                          {kpi.diemLanhDaoTong} <span className="text-xs font-normal text-slate-400">/100</span>
                        </div>
                        <div className="text-[10px] text-slate-400">{isApproved ? "Đã ký duyệt" : "Chờ phê duyệt"}</div>
                      </div>

                      <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/60 dark:border-slate-800">
                        <div className="text-slate-500 text-[11px]">4. Thưởng / Trừ</div>
                        <div className="text-base font-bold mt-0.5 flex items-center gap-1.5">
                          <span className="text-emerald-600">+{kpi.tongDiemThuong}</span>
                          <span className="text-slate-400">/</span>
                          <span className="text-rose-600">-{kpi.tongDiemTru}</span>
                        </div>
                        <div className="text-[10px] text-slate-400">{kpi.danhSachThuongPhat.length} quyết định</div>
                      </div>

                      <div className="col-span-2 sm:col-span-1 p-2 bg-blue-50 dark:bg-blue-950/40 rounded-lg border border-blue-200 dark:border-blue-900 text-blue-950 dark:text-blue-200">
                        <div className="text-[11px] font-bold text-blue-700 dark:text-blue-400">Công thức tính NĐ 90</div>
                        <div className="text-[11px] font-semibold mt-0.5">
                          {kpi.diemLanhDaoTong} + {kpi.tongDiemThuong} - {kpi.tongDiemTru}
                        </div>
                        <div className="text-[10px] text-blue-600 dark:text-blue-300 font-bold mt-0.5">
                          = {kpi.diemTongKetCuoiCung} điểm
                        </div>
                      </div>
                    </div>

                    {/* Criteria Details Table */}
                    <div className="overflow-x-auto my-3">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-100/70 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                            <th className="py-2 px-3">5 Nhóm Tiêu chí theo NĐ 90 &amp; 48</th>
                            <th className="py-2 px-3 text-center">Tối đa</th>
                            <th className="py-2 px-3 text-center">Tự chấm</th>
                            <th className="py-2 px-3 text-center">Hệ thống Auto</th>
                            <th className="py-2 px-3 text-center">Lãnh đạo chấm</th>
                            <th className="py-2 px-3">Căn cứ &amp; Dữ liệu đối chiếu</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                          <tr>
                            <td className="py-2 px-3 font-semibold">1. Tiêu chuẩn chuyên môn &amp; tiến độ nhiệm vụ</td>
                            <td className="py-2 px-3 text-center font-bold text-slate-500">40</td>
                            <td className="py-2 px-3 text-center">{kpi.tieuChi1_NhiemVuChuyenMon.diemTuCham}</td>
                            <td className="py-2 px-3 text-center font-semibold text-blue-600">{kpi.tieuChi1_NhiemVuChuyenMon.diemHeThongAuto}</td>
                            <td className="py-2 px-3 text-center font-bold text-indigo-600">{kpi.tieuChi1_NhiemVuChuyenMon.diemLanhDaoCham}</td>
                            <td className="py-2 px-3 text-slate-500 text-[11px]">{kpi.tieuChi1_NhiemVuChuyenMon.canCuDanhGia}</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-3 font-semibold">2. Chỉ số phục vụ Một cửa &amp; DVCQG (QĐ 766)</td>
                            <td className="py-2 px-3 text-center font-bold text-slate-500">25</td>
                            <td className="py-2 px-3 text-center">{kpi.tieuChi2_MotCuaDvcQd766.diemTuCham}</td>
                            <td className="py-2 px-3 text-center font-semibold text-blue-600">{kpi.tieuChi2_MotCuaDvcQd766.diemHeThongAuto}</td>
                            <td className="py-2 px-3 text-center font-bold text-indigo-600">{kpi.tieuChi2_MotCuaDvcQd766.diemLanhDaoCham}</td>
                            <td className="py-2 px-3 text-slate-500 text-[11px]">
                              <span className="font-bold text-emerald-600">{kpi.heThongMetrics.tyLeDungHanMotCua}% đúng hạn</span>
                              <span> • {kpi.heThongMetrics.soLuongHoSoDaXuLy} hồ sơ</span>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2 px-3 font-semibold">3. Mức độ hài lòng của nhân dân (Chỉ số SIPAS)</td>
                            <td className="py-2 px-3 text-center font-bold text-slate-500">15</td>
                            <td className="py-2 px-3 text-center">{kpi.tieuChi3_CsatHaiLongDan.diemTuCham}</td>
                            <td className="py-2 px-3 text-center font-semibold text-blue-600">{kpi.tieuChi3_CsatHaiLongDan.diemHeThongAuto}</td>
                            <td className="py-2 px-3 text-center font-bold text-indigo-600">{kpi.tieuChi3_CsatHaiLongDan.diemLanhDaoCham}</td>
                            <td className="py-2 px-3 text-slate-500 text-[11px]">
                              {kpi.heThongMetrics.diemCsatTrungBinh}/5.0 sao • {kpi.heThongMetrics.soPhanHoiTieuCuc} phản ánh tiêu cực
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2 px-3 font-semibold">4. Văn hóa công sở &amp; Kỷ luật hành chính</td>
                            <td className="py-2 px-3 text-center font-bold text-slate-500">10</td>
                            <td className="py-2 px-3 text-center">{kpi.tieuChi4_KyLuatVanHoaCongSo.diemTuCham}</td>
                            <td className="py-2 px-3 text-center font-semibold text-blue-600">{kpi.tieuChi4_KyLuatVanHoaCongSo.diemHeThongAuto}</td>
                            <td className="py-2 px-3 text-center font-bold text-indigo-600">{kpi.tieuChi4_KyLuatVanHoaCongSo.diemLanhDaoCham}</td>
                            <td className="py-2 px-3 text-slate-500 text-[11px]">{kpi.tieuChi4_KyLuatVanHoaCongSo.canCuDanhGia}</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-3 font-semibold">5. Sáng kiến kinh nghiệm &amp; Chuyển đổi số</td>
                            <td className="py-2 px-3 text-center font-bold text-slate-500">10</td>
                            <td className="py-2 px-3 text-center">{kpi.tieuChi5_SangKienChuyenDoiSo.diemTuCham}</td>
                            <td className="py-2 px-3 text-center font-semibold text-blue-600">{kpi.tieuChi5_SangKienChuyenDoiSo.diemHeThongAuto}</td>
                            <td className="py-2 px-3 text-center font-bold text-indigo-600">{kpi.tieuChi5_SangKienChuyenDoiSo.diemLanhDaoCham}</td>
                            <td className="py-2 px-3 text-slate-500 text-[11px]">{kpi.tieuChi5_SangKienChuyenDoiSo.canCuDanhGia}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Sổ Thưởng & Phạt Công vụ */}
                    {kpi.danhSachThuongPhat.length > 0 && (
                      <div className="bg-slate-50 dark:bg-slate-800/30 p-3 rounded-lg border border-slate-200/60 dark:border-slate-800 my-3">
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                            <Scale className="w-3.5 h-3.5 text-amber-500" />
                            <span>Nhật ký Thưởng / Phạt Công vụ trong tháng ({kpi.danhSachThuongPhat.length} mục)</span>
                          </span>
                          <span className="text-[11px] text-slate-500">
                            Căn cứ điều chỉnh điểm ròng
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {kpi.danhSachThuongPhat.map((tp) => (
                            <div
                              key={tp.id}
                              className={`px-2.5 py-1.5 rounded-lg border text-xs flex items-center gap-2 ${
                                tp.loai === "THUONG"
                                  ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 text-emerald-800 dark:text-emerald-300"
                                  : "bg-rose-50 dark:bg-rose-950/40 border-rose-200 text-rose-800 dark:text-rose-300"
                              }`}
                            >
                              <span className="font-bold font-mono">
                                {tp.loai === "THUONG" ? `+${tp.soDiem}đ` : `-${tp.soDiem}đ`}
                              </span>
                              <span>{tp.lyDo}</span>
                              <span className="text-[10px] text-slate-500">({tp.ngayGhiNhan})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Lãnh đạo thẩm định bút phê & SmartCA */}
                    {kpi.lanhDaoThamDinh && (
                      <div className="bg-indigo-50/50 dark:bg-indigo-950/20 p-3 rounded-lg border border-indigo-100 dark:border-indigo-900/50 my-3 text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-semibold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                            <span>Ý kiến Bút phê của Lãnh đạo UBND Phường</span>
                          </div>
                          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-mono">
                            {kpi.lanhDaoThamDinh.ngayDuyet} • {kpi.lanhDaoThamDinh.nguoiDuyet}
                          </span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 italic pl-5 border-l-2 border-indigo-400 my-1.5">
                          "{kpi.lanhDaoThamDinh.nhanXetButPhe}"
                        </p>
                        {kpi.lanhDaoThamDinh.deXuatKhenThuong && (
                          <div className="text-[11px] text-amber-700 dark:text-amber-400 pl-5 font-medium">
                            ★ Đề xuất khen thưởng: {kpi.lanhDaoThamDinh.deXuatKhenThuong}
                          </div>
                        )}
                        {kpi.lanhDaoThamDinh.maKySoSmartCA && (
                          <div className="mt-2 pt-1.5 border-t border-indigo-200/60 dark:border-indigo-900/40 flex items-center gap-1.5 text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                            <CheckSquare className="w-3.5 h-3.5" />
                            <span>Chữ ký số hợp lệ: {kpi.lanhDaoThamDinh.maKySoSmartCA}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Actions Toolbar */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => onOpenChatWithCanBo?.(kpi.canBoName)}
                        className="inline-flex items-center gap-1.5 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 cursor-pointer font-medium"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Trao đổi &amp; chỉ đạo công vụ với {kpi.canBoName.split(" ").slice(-1)[0]}</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenPenaltyModal(kpi, "THUONG")}
                          className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 dark:text-emerald-300 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>Thưởng (+)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenPenaltyModal(kpi, "PHAT")}
                          className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 dark:text-rose-300 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                          <span>Trừ (-)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEvaluateModal(kpi)}
                          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <Sliders className="w-3.5 h-3.5" />
                          <span>Lãnh đạo Thẩm định &amp; Ký số Duyệt</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Modal Phê chuẩn sản phẩm */}
      {reviewingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-gradient-to-r from-[#222d32] to-[#1e282c] border-b-2 border-[#dd4b39] text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Thẩm định &amp; Phê chuẩn Sản phẩm Công việc</h3>
                <p className="text-xs text-gray-300 mt-0.5">{reviewingProduct.maSanPham}</p>
              </div>
              <button
                type="button"
                onClick={() => setReviewingProduct(null)}
                className="p-1 text-white/80 hover:text-white rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                  {reviewingProduct.tenSanPham}
                </div>
                <div className="text-slate-500 mt-1">
                  Cán bộ nộp: <strong>{reviewingProduct.canBoNop}</strong> ({reviewingProduct.chucVu}) • {reviewingProduct.ngayNop}
                </div>
                <div className="mt-2 text-slate-700 dark:text-slate-300">
                  Mô tả kết quả: {reviewingProduct.moTa}
                </div>
                <div className="mt-1 font-mono text-blue-600 dark:text-blue-400">
                  File: {reviewingProduct.fileDinhKem}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Đánh giá chất lượng sản phẩm (1 - 5 sao):
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewDiem(star)}
                      className="p-1 cursor-pointer transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= reviewDiem ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-slate-600"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="font-bold text-sm text-amber-600 ml-2">{reviewDiem} / 5 sao</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Ý kiến chỉ đạo &amp; Kết luận của Lãnh đạo:
                </label>
                <textarea
                  rows={3}
                  value={reviewYKien}
                  onChange={(e) => setReviewYKien(e.target.value)}
                  placeholder="Ghi nhận xét, kết luận phê duyệt hoặc yêu cầu bổ sung chỉnh sửa..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => handleRequestRevision(reviewingProduct)}
                  className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  Yêu cầu Hoàn thiện lại
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setReviewingProduct(null)}
                    className="px-3.5 py-2 font-semibold text-slate-600 hover:text-slate-800 dark:text-slate-300 rounded-lg cursor-pointer"
                  >
                    Đóng
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApprove(reviewingProduct)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Phê chuẩn Đạt yêu cầu</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Lãnh đạo Giao việc Mới */}
      {showGiaoViecModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-emerald-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-200" />
                <h3 className="text-base font-bold">Lãnh đạo Giao Nhiệm vụ &amp; Phân công Mới</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGiaoViecModal(false)}
                className="p-1 text-white/80 hover:text-white rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tiêu đề nhiệm vụ: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={taskTieuDe}
                  onChange={(e) => setTaskTieuDe(e.target.value)}
                  placeholder="Ví dụ: Rà soát an toàn PCCC các cơ sở Karaoke trước mùa lễ hội"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Giao cho cán bộ phụ trách:
                  </label>
                  <select
                    value={taskCanBo}
                    onChange={(e) => {
                      const name = e.target.value;
                      setTaskCanBo(name);
                      if (name.includes("Tùng")) {
                        setTaskChucVu("Công chức Văn hóa - Xã hội");
                        setTaskDomain("VH_TT_DL");
                      } else if (name.includes("Oanh")) {
                        setTaskChucVu("Công chức Giáo dục - Đào tạo");
                        setTaskDomain("GD_DT");
                      } else if (name.includes("Nam")) {
                        setTaskChucVu("Công chức LĐ-TB&XH");
                        setTaskDomain("LDTBXH_AN_SINH");
                      } else {
                        setTaskChucVu("Chuyên viên TT & CĐS");
                        setTaskDomain("TT_CDS");
                      }
                    }}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="Nguyễn Thanh Tùng">Nguyễn Thanh Tùng (Văn hóa - Xã hội)</option>
                    <option value="ThS. Trần Thị Kim Oanh">ThS. Trần Thị Kim Oanh (Giáo dục)</option>
                    <option value="Lê Hoàng Nam">Lê Hoàng Nam (LĐ-TB&XH)</option>
                    <option value="Vũ Đình Cường">Vũ Đình Cường (TT & CĐS)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Mức độ ưu tiên:
                  </label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as "HOA_TOC" | "KHAN" | "THUONG")}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer font-semibold"
                  >
                    <option value="HOA_TOC">HỎA TỐC (Ưu tiên số 1)</option>
                    <option value="KHAN">KHẨN (Giải quyết trong tuần)</option>
                    <option value="THUONG">THƯỜNG (Theo kế hoạch tháng)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Hạn chót hoàn thành (Deadline):
                </label>
                <input
                  type="text"
                  value={taskDeadline}
                  onChange={(e) => setTaskDeadline(e.target.value)}
                  placeholder="dd/mm/yyyy"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Sản phẩm đầu ra yêu cầu nộp thẩm định: <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={taskDeliverable}
                  onChange={(e) => setTaskDeliverable(e.target.value)}
                  placeholder="Ví dụ: Biên bản kiểm tra liên ngành 814 kèm danh sách xử phạt (PDF)"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowGiaoViecModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-800 dark:text-slate-300 rounded-lg cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Ký giao nhiệm vụ &amp; Báo Chat</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 1: Thẩm định & Chấm điểm KPI Đa Chiều (NĐ 90 & NĐ 48) */}
      {evaluatingKpi && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <Scale className="w-4 h-4 text-amber-300" />
                  <span>Lãnh đạo Thẩm định &amp; Chấm Điểm KPI Đa Chiều</span>
                </h3>
                <p className="text-xs text-blue-200 mt-0.5">
                  {evaluatingKpi.canBoName} — {evaluatingKpi.chucVu} (Kỳ: {evaluatingKpi.kyDanhGia})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEvaluatingKpi(null)}
                className="p-1 text-white/80 hover:text-white rounded-lg cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveLeaderEvaluation} className="p-6 space-y-5 text-xs max-h-[80vh] overflow-y-auto">
              {/* Reference Header */}
              <div className="grid grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                <div>
                  <div className="text-slate-500">Cán bộ tự chấm:</div>
                  <div className="text-base font-bold text-slate-800 dark:text-slate-200">
                    {evaluatingKpi.diemTuChamTong}/100
                  </div>
                </div>
                <div>
                  <div className="text-blue-600 dark:text-blue-400 font-semibold">Hệ thống Auto:</div>
                  <div className="text-base font-bold text-blue-600 dark:text-blue-400">
                    {evaluatingKpi.diemHeThongAutoTong}/100
                  </div>
                </div>
                <div>
                  <div className="text-slate-500">Thưởng / Trừ hiện hành:</div>
                  <div className="text-base font-bold">
                    <span className="text-emerald-600">+{evaluatingKpi.tongDiemThuong}</span> /{" "}
                    <span className="text-rose-600">-{evaluatingKpi.tongDiemTru}</span>
                  </div>
                </div>
              </div>

              {/* 5 Scoring Criteria Sliders & Inputs */}
              <div className="space-y-4">
                <div className="font-bold text-slate-900 dark:text-slate-100 text-sm border-b pb-1">
                  Chấm điểm 5 Nhóm Tiêu chuẩn (Nghị định 90/2020 &amp; 48/2023)
                </div>

                {/* Criterion 1: Chuyên môn (40đ) */}
                <div className="bg-slate-50 dark:bg-slate-800/30 p-3 rounded-lg border border-slate-200/60 dark:border-slate-700/60 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-slate-800 dark:text-slate-200">
                      1. Tiêu chuẩn chuyên môn &amp; tiến độ nhiệm vụ (Tối đa 40 điểm)
                    </label>
                    <span className="font-bold text-blue-600 dark:text-blue-400 text-sm">{evalTc1}/40đ</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Căn cứ: {evaluatingKpi.tieuChi1_NhiemVuChuyenMon.canCuDanhGia} (Tự chấm: {evaluatingKpi.tieuChi1_NhiemVuChuyenMon.diemTuCham}đ, Auto: {evaluatingKpi.tieuChi1_NhiemVuChuyenMon.diemHeThongAuto}đ)
                  </div>
                  <div className="flex items-center gap-3 pt-1">
                    <input
                      type="range"
                      min={0}
                      max={40}
                      value={evalTc1}
                      onChange={(e) => setEvalTc1(Number(e.target.value))}
                      className="flex-1 accent-blue-600 cursor-pointer"
                    />
                    <input
                      type="number"
                      min={0}
                      max={40}
                      value={evalTc1}
                      onChange={(e) => setEvalTc1(Math.min(40, Math.max(0, Number(e.target.value))))}
                      className="w-16 px-2 py-1 bg-white dark:bg-slate-800 border rounded font-mono font-bold text-center"
                    />
                  </div>
                </div>

                {/* Criterion 2: Một cửa QĐ 766 (25đ) */}
                <div className="bg-slate-50 dark:bg-slate-800/30 p-3 rounded-lg border border-slate-200/60 dark:border-slate-700/60 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-slate-800 dark:text-slate-200">
                      2. Chỉ số phục vụ Một cửa &amp; DVCQG QĐ 766 (Tối đa 25 điểm)
                    </label>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">{evalTc2}/25đ</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Hệ thống: {evaluatingKpi.heThongMetrics.tyLeDungHanMotCua}% đúng hạn, {evaluatingKpi.heThongMetrics.soLuongHoSoDaXuLy} hồ sơ (Tự chấm: {evaluatingKpi.tieuChi2_MotCuaDvcQd766.diemTuCham}đ)
                  </div>
                  <div className="flex items-center gap-3 pt-1">
                    <input
                      type="range"
                      min={0}
                      max={25}
                      value={evalTc2}
                      onChange={(e) => setEvalTc2(Number(e.target.value))}
                      className="flex-1 accent-emerald-600 cursor-pointer"
                    />
                    <input
                      type="number"
                      min={0}
                      max={25}
                      value={evalTc2}
                      onChange={(e) => setEvalTc2(Math.min(25, Math.max(0, Number(e.target.value))))}
                      className="w-16 px-2 py-1 bg-white dark:bg-slate-800 border rounded font-mono font-bold text-center"
                    />
                  </div>
                </div>

                {/* Criterion 3: CSAT Hài lòng dân (15đ) */}
                <div className="bg-slate-50 dark:bg-slate-800/30 p-3 rounded-lg border border-slate-200/60 dark:border-slate-700/60 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-slate-800 dark:text-slate-200">
                      3. Mức độ hài lòng của nhân dân theo Chỉ số SIPAS (Tối đa 15 điểm)
                    </label>
                    <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">{evalTc3}/15đ</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Đánh giá thực tế của nhân dân: {evaluatingKpi.heThongMetrics.diemCsatTrungBinh}/5.0 sao, {evaluatingKpi.heThongMetrics.soPhanHoiTieuCuc} phản ánh tiêu cực
                  </div>
                  <div className="flex items-center gap-3 pt-1">
                    <input
                      type="range"
                      min={0}
                      max={15}
                      value={evalTc3}
                      onChange={(e) => setEvalTc3(Number(e.target.value))}
                      className="flex-1 accent-amber-600 cursor-pointer"
                    />
                    <input
                      type="number"
                      min={0}
                      max={15}
                      value={evalTc3}
                      onChange={(e) => setEvalTc3(Math.min(15, Math.max(0, Number(e.target.value))))}
                      className="w-16 px-2 py-1 bg-white dark:bg-slate-800 border rounded font-mono font-bold text-center"
                    />
                  </div>
                </div>

                {/* Criterion 4: Kỷ luật văn hóa công sở (10đ) */}
                <div className="bg-slate-50 dark:bg-slate-800/30 p-3 rounded-lg border border-slate-200/60 dark:border-slate-700/60 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-slate-800 dark:text-slate-200">
                      4. Văn hóa công sở, kỷ luật hành chính &amp; đạo đức công vụ (Tối đa 10 điểm)
                    </label>
                    <span className="font-bold text-purple-600 dark:text-purple-400 text-sm">{evalTc4}/10đ</span>
                  </div>
                  <div className="flex items-center gap-3 pt-1">
                    <input
                      type="range"
                      min={0}
                      max={10}
                      value={evalTc4}
                      onChange={(e) => setEvalTc4(Number(e.target.value))}
                      className="flex-1 accent-purple-600 cursor-pointer"
                    />
                    <input
                      type="number"
                      min={0}
                      max={10}
                      value={evalTc4}
                      onChange={(e) => setEvalTc4(Math.min(10, Math.max(0, Number(e.target.value))))}
                      className="w-16 px-2 py-1 bg-white dark:bg-slate-800 border rounded font-mono font-bold text-center"
                    />
                  </div>
                </div>

                {/* Criterion 5: Sáng kiến & CĐS (10đ) */}
                <div className="bg-slate-50 dark:bg-slate-800/30 p-3 rounded-lg border border-slate-200/60 dark:border-slate-700/60 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-slate-800 dark:text-slate-200">
                      5. Sáng kiến cải tiến quy trình &amp; Chuyển đổi số (Tối đa 10 điểm)
                    </label>
                    <span className="font-bold text-cyan-600 dark:text-cyan-400 text-sm">{evalTc5}/10đ</span>
                  </div>
                  <div className="flex items-center gap-3 pt-1">
                    <input
                      type="range"
                      min={0}
                      max={10}
                      value={evalTc5}
                      onChange={(e) => setEvalTc5(Number(e.target.value))}
                      className="flex-1 accent-cyan-600 cursor-pointer"
                    />
                    <input
                      type="number"
                      min={0}
                      max={10}
                      value={evalTc5}
                      onChange={(e) => setEvalTc5(Math.min(10, Math.max(0, Number(e.target.value))))}
                      className="w-16 px-2 py-1 bg-white dark:bg-slate-800 border rounded font-mono font-bold text-center"
                    />
                  </div>
                </div>
              </div>

              {/* Total Calculation & Quality Tier Preview */}
              {(() => {
                const diemTong = evalTc1 + evalTc2 + evalTc3 + evalTc4 + evalTc5;
                const diemRong = Math.min(100, Math.max(0, diemTong + evaluatingKpi.tongDiemThuong - evaluatingKpi.tongDiemTru));
                let rankLabel = "HOÀN THÀNH TỐT";
                let rankClass = "bg-blue-100 text-blue-800 border-blue-300";
                if (diemRong >= 90 && evaluatingKpi.tongDiemTru === 0) {
                  rankLabel = "HOÀN THÀNH XUẤT SẮC";
                  rankClass = "bg-emerald-100 text-emerald-800 border-emerald-300";
                } else if (diemRong >= 70) {
                  rankLabel = "HOÀN THÀNH TỐT";
                  rankClass = "bg-blue-100 text-blue-800 border-blue-300";
                } else if (diemRong >= 50) {
                  rankLabel = "HOÀN THÀNH NHIỆM VỤ";
                  rankClass = "bg-amber-100 text-amber-800 border-amber-300";
                } else {
                  rankLabel = "KHÔNG HOÀN THÀNH";
                  rankClass = "bg-rose-100 text-rose-800 border-rose-300";
                }

                return (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800/80 dark:to-indigo-950/40 p-4 rounded-xl border border-blue-200 dark:border-blue-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-slate-600 dark:text-slate-400">
                        Điểm Lãnh đạo thẩm định: <strong>{diemTong}/100</strong>
                        {evaluatingKpi.tongDiemThuong > 0 && <span className="text-emerald-600"> (+{evaluatingKpi.tongDiemThuong}đ thưởng)</span>}
                        {evaluatingKpi.tongDiemTru > 0 && <span className="text-rose-600"> (-{evaluatingKpi.tongDiemTru}đ phạt)</span>}
                      </div>
                      <div className="text-xl font-black text-blue-700 dark:text-blue-300 mt-0.5">
                        Điểm tổng kết cuối cùng: {diemRong} điểm
                      </div>
                    </div>
                    <div className={`px-3 py-1.5 rounded-lg border font-bold text-xs uppercase tracking-wide ${rankClass}`}>
                      {rankLabel}
                    </div>
                  </div>
                );
              })()}

              {/* Leadership Bút phê & Đề xuất */}
              <div>
                <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  Ý kiến Bút phê &amp; Nhận xét của Lãnh đạo UBND Phường: <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={evalButPhe}
                  onChange={(e) => setEvalButPhe(e.target.value)}
                  placeholder="Ghi nhận xét ưu điểm, hạn chế và chỉ đạo định hướng tháng tiếp theo..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  Đề xuất Khen thưởng / Danh hiệu thi đua cấp trên (nếu có):
                </label>
                <input
                  type="text"
                  value={evalKhenThuong}
                  onChange={(e) => setEvalKhenThuong(e.target.value)}
                  placeholder="Ví dụ: Đề xuất Giấy khen Chủ tịch UBND Phường quý IV/2026"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      Ký số chức danh điện tử công vụ
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Chứng thực số công vụ bảo đảm tính pháp lý theo QCVN
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={evalUseSmartCA}
                  onChange={(e) => setEvalUseSmartCA(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEvaluatingKpi(null)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-800 dark:text-slate-300 rounded-lg cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>Ký duyệt &amp; Ban hành kết quả KPI</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Ghi nhận Điểm Thưởng / Điểm Trừ Công Vụ */}
      {penaltyModalKpi && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div
              className={`px-6 py-4 text-white flex items-center justify-between ${
                penaltyType === "THUONG"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-700"
                  : "bg-gradient-to-r from-rose-600 to-red-700"
              }`}
            >
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  {penaltyType === "THUONG" ? (
                    <ThumbsUp className="w-4 h-4" />
                  ) : (
                    <ThumbsDown className="w-4 h-4" />
                  )}
                  <span>
                    {penaltyType === "THUONG"
                      ? "Ghi nhận Điểm Thưởng Công Vụ (+)"
                      : "Ghi nhận Điểm Trừ Vi Phạm (-)"}
                  </span>
                </h3>
                <p className="text-xs text-white/80 mt-0.5">
                  Cán bộ: <strong>{penaltyModalKpi.canBoName}</strong> ({penaltyModalKpi.chucVu})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPenaltyModalKpi(null)}
                className="p-1 text-white/80 hover:text-white rounded-lg cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddPenaltyBonus} className="p-6 space-y-4 text-xs">
              {/* Type toggle */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPenaltyType("THUONG");
                    setPenaltyPreset("THUONG_TRUOC_HAN");
                    setPenaltyPoints(5);
                    setPenaltyReason("Trả trước hạn >40% hồ sơ TTHC trong tháng theo Bộ chỉ số QĐ 766/QĐ-TTg");
                    setPenaltyEvidence("Hệ thống Một cửa điện tử ghi nhận tỷ lệ trước hạn đạt mức xuất sắc");
                  }}
                  className={`py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border ${
                    penaltyType === "THUONG"
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Điểm Thưởng (+)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPenaltyType("PHAT");
                    setPenaltyPreset("PHAT_TRE_HAN");
                    setPenaltyPoints(5);
                    setPenaltyReason("Có hồ sơ TTHC giải quyết quá hạn trên Cổng DVC Quốc gia (QĐ 766)");
                    setPenaltyEvidence("Cổng DVCQG cảnh báo trễ hạn kiểm tra hồ sơ");
                  }}
                  className={`py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border ${
                    penaltyType === "PHAT"
                      ? "bg-rose-600 text-white border-rose-600"
                      : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                  }`}
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                  <span>Điểm Trừ (-)</span>
                </button>
              </div>

              {/* Preset selection */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Chọn mẫu nghiệp vụ chuẩn (QĐ 766 &amp; NĐ 90):
                </label>
                <select
                  value={penaltyPreset}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPenaltyPreset(val);
                    if (val === "THUONG_TRUOC_HAN") {
                      setPenaltyPoints(5);
                      setPenaltyReason("Trả trước hạn >40% hồ sơ TTHC trong tháng theo Bộ chỉ số QĐ 766/QĐ-TTg");
                      setPenaltyEvidence("Hệ thống Một cửa điện tử ghi nhận");
                    } else if (val === "THUONG_SANG_KIEN") {
                      setPenaltyPoints(5);
                      setPenaltyReason("Sáng kiến chuyển đổi số cấp cơ sở được khen thưởng và nhân rộng");
                      setPenaltyEvidence("Quyết định công nhận sáng kiến UBND Phường");
                    } else if (val === "THUONG_THU_KHEN") {
                      setPenaltyPoints(3);
                      setPenaltyReason("Nhận thư khen ngợi trực tiếp từ tổ chức / công dân");
                      setPenaltyEvidence("Thư cảm ơn của đại diện hộ dân");
                    } else if (val === "THUONG_KHAN_CAP") {
                      setPenaltyPoints(5);
                      setPenaltyReason("Tích cực xử lý đột xuất, ngoài giờ phục vụ an sinh / cứu trợ nhân đạo");
                      setPenaltyEvidence("Báo cáo đột xuất ngoài giờ");
                    } else if (val === "PHAT_TRE_HAN") {
                      setPenaltyPoints(5);
                      setPenaltyReason("Có hồ sơ TTHC giải quyết quá hạn trên Cổng DVC Quốc gia (QĐ 766)");
                      setPenaltyEvidence("Cổng DVCQG cảnh báo trễ hạn");
                    } else if (val === "PHAT_CSAT_XAU") {
                      setPenaltyPoints(5);
                      setPenaltyReason("Nhận phản ánh tiêu cực về tinh thần, thái độ phục vụ công dân");
                      setPenaltyEvidence("Biên bản ghi nhận khiếu nại");
                    } else if (val === "PHAT_CHAM_BC") {
                      setPenaltyPoints(3);
                      setPenaltyReason("Chậm tiến độ nộp báo cáo chuyên đề định kỳ theo hạn chỉ đạo");
                      setPenaltyEvidence("Sổ theo dõi chỉ đạo UBND");
                    } else if (val === "PHAT_KY_LUAT") {
                      setPenaltyPoints(3);
                      setPenaltyReason("Vi phạm quy chế văn hóa công sở, kỷ luật giờ giấc hành chính");
                      setPenaltyEvidence("Biên bản chấm công");
                    } else if (val === "PHAT_SAN_PHAM") {
                      setPenaltyPoints(3);
                      setPenaltyReason("Sản phẩm công vụ bị Lãnh đạo trả về yêu cầu sửa chữa quá 2 lần");
                      setPenaltyEvidence("Lịch sử phê duyệt sản phẩm");
                    }
                  }}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer font-semibold"
                >
                  {penaltyType === "THUONG" ? (
                    <>
                      <option value="THUONG_TRUOC_HAN">Trả trước hạn &gt;40% hồ sơ Một cửa QĐ 766 (+5đ)</option>
                      <option value="THUONG_SANG_KIEN">Sáng kiến Chuyển đổi số cấp cơ sở nhân rộng (+5đ)</option>
                      <option value="THUONG_THU_KHEN">Nhận thư khen của tổ chức / người dân (+3đ)</option>
                      <option value="THUONG_KHAN_CAP">Xử lý khẩn cấp đột xuất ngoài giờ phục vụ nhân dân (+5đ)</option>
                      <option value="THUONG_CUSTOM">Thưởng công vụ khác (Tự nhập)</option>
                    </>
                  ) : (
                    <>
                      <option value="PHAT_TRE_HAN">Hồ sơ TTHC quá hạn trên Cổng DVCQG QĐ 766 (-5đ)</option>
                      <option value="PHAT_CSAT_XAU">Phản ánh tiêu cực về tinh thần, thái độ phục vụ (-5đ)</option>
                      <option value="PHAT_CHAM_BC">Chậm nộp báo cáo chuyên đề theo hạn giao (-3đ)</option>
                      <option value="PHAT_KY_LUAT">Vi phạm kỷ luật giờ giấc, văn hóa công sở (-3đ)</option>
                      <option value="PHAT_SAN_PHAM">Sản phẩm công việc bị trả về sửa &gt;2 lần (-3đ)</option>
                      <option value="PHAT_CUSTOM">Trừ điểm vi phạm khác (Tự nhập)</option>
                    </>
                  )}
                </select>
              </div>

              {/* Points input */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Số điểm {penaltyType === "THUONG" ? "thưởng" : "trừ"}:
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={penaltyPoints}
                  onChange={(e) => setPenaltyPoints(Math.min(20, Math.max(1, Number(e.target.value))))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-bold font-mono"
                />
              </div>

              {/* Reason input */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Lý do chi tiết &amp; Căn cứ quyết định: <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={penaltyReason}
                  onChange={(e) => setPenaltyReason(e.target.value)}
                  placeholder="Ghi rõ lý do thưởng hoặc trừ điểm..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Evidence input */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Minh chứng / Số văn bản / Mã hồ sơ Một cửa liên quan:
                </label>
                <input
                  type="text"
                  value={penaltyEvidence}
                  onChange={(e) => setPenaltyEvidence(e.target.value)}
                  placeholder="Ví dụ: Báo cáo QĐ 766 tuần 42 hoặc Mã H01-261025-0012"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setPenaltyModalKpi(null)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-800 dark:text-slate-300 rounded-lg cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-white font-semibold rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                    penaltyType === "THUONG"
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-rose-600 hover:bg-rose-700"
                  }`}
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>Cập nhật vào Sổ KPI</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
