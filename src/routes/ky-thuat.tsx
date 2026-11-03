import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Wrench,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  Filter,
  Check,
  X,
  Code2,
  HardDrive,
  Database,
  Radio,
  FileCode,
  Layers,
  Sparkles,
  RefreshCw,
  Cpu,
  Lock,
  ArrowRight,
  UserCheck,
  Fingerprint,
  Smartphone,
  KeyRound,
  ExternalLink,
  FileText,
  Download,
} from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { useAppState, appStore, type TechnicalErrorReport } from "@/services/app-state";
import { DatabaseStudioTab } from "@/components/admin/DatabaseStudioTab";

export const Route = createFileRoute("/ky-thuat")({
  head: () => ({
    meta: [
      { title: "Trung tâm Kỹ thuật, Ghi nhận Báo lỗi & Chẩn đoán CSDL · SLĐTBXH Bình Dương" },
      {
        name: "description",
        content:
          "Phân hệ dành riêng cho Quản trị viên Kỹ thuật (DevOps/DBA): Tiếp nhận báo lỗi hệ thống, rà soát dị biệt dữ liệu, thực thi câu lệnh SQL UPDATE sửa lỗi và giám sát ATTT VNeID.",
      },
    ],
  }),
  component: KyThuatPage,
});

function KyThuatPage() {
  const { currentUser, technicalErrorReports = [], auditLogs, hoSoList } = useAppState();

  const [activeTab, setActiveTab] = useState<"ERROR_LOGS" | "DATABASE_FIX" | "SECURITY_TELEMETRY">("ERROR_LOGS");

  // State cho công cụ Giả lập xác thực C06 / VNeID thời gian thực
  const [testCccd, setTestCccd] = useState("074026000123");
  const [c06Verifying, setC06Verifying] = useState(false);
  const [c06Result, setC06Result] = useState<{
    success: boolean;
    cccd: string;
    hoTen: string;
    ngaySinh: string;
    gioiTinh: string;
    thuongTru: string;
    vneidLevel: string;
    taiKhoanAnSinh: {
      nganHang: string;
      soTaiKhoan: string;
      chuTaiKhoan: string;
      trangThai: string;
    };
    trangThaiLamSanh: string;
    maGiaoDichNdxp: string;
    thoiGianDoiSoat: string;
    ghiChu?: string;
  } | null>({
    success: true,
    cccd: "074026000123",
    hoTen: "Hồ Văn Lên",
    ngaySinh: "1926",
    gioiTinh: "Nam",
    thuongTru: "Chánh Nghĩa, TP. Thủ Dầu Một, tỉnh Bình Dương",
    vneidLevel: "VNeID Mức 2 (Đã đối soát Sinh trắc học & NFC)",
    taiKhoanAnSinh: {
      nganHang: "Vietcombank CN Bình Dương",
      soTaiKhoan: "0281000349281",
      chuTaiKhoan: "HỒ VĂN LÊN",
      trangThai: "ĐÃ LIÊN KẾT AN SINH XÃ HỘI (Chỉ thị 21/CT-TTg)",
    },
    trangThaiLamSanh: "ĐÚNG - ĐỦ - SẠCH - SỐNG (100% Khớp C06)",
    maGiaoDichNdxp: "NDXP-C06-2026-BD-8849102",
    thoiGianDoiSoat: new Date().toLocaleString("vi-VN"),
  });

  const handleVerifyC06 = (cccdToTest: string) => {
    setC06Verifying(true);
    setTimeout(() => {
      setC06Verifying(false);
      if (cccdToTest === "074088992211") {
        setC06Result({
          success: false,
          cccd: cccdToTest,
          hoTen: "Trần Văn Cảnh",
          ngaySinh: "1948",
          gioiTinh: "Nam",
          thuongTru: "C06 ghi nhận: Xã An Sơn, TP. Thuận An (Hồ sơ địa phương: P. Chánh Nghĩa)",
          vneidLevel: "VNeID Mức 1 (Chưa định danh mức 2 qua vân tay)",
          taiKhoanAnSinh: {
            nganHang: "Chưa liên kết",
            soTaiKhoan: "Chưa đăng ký",
            chuTaiKhoan: "---",
            trangThai: "CHƯA LIÊN KẾT - CẦN CÁN BỘ XÃ HỖ TRỢ",
          },
          trangThaiLamSanh: "CẢNH BÁO LỆCH ĐỊA BÀN CƯ TRÚ (Cần Công an khu vực xác minh)",
          maGiaoDichNdxp: `NDXP-C06-${Date.now().toString().slice(-8)}`,
          thoiGianDoiSoat: new Date().toLocaleString("vi-VN"),
          ghiChu: "Yêu cầu Cán bộ LĐTBXH phối hợp Công an Phường Phú Cường kiểm tra lại sổ hộ khẩu và cập nhật CSDL.",
        });
        toast.warning("Phát hiện lệch thông tin cư trú giữa CSDL địa phương và C06!");
      } else {
        const found = hoSoList.find((h) => h.cccd === cccdToTest) || hoSoList[0];
        setC06Result({
          success: true,
          cccd: cccdToTest,
          hoTen: found?.hoTen || "Hồ Văn Lên",
          ngaySinh: String(found?.namSinh || "1926"),
          gioiTinh: found?.gioiTinh || "Nam",
          thuongTru: `${found?.phuong || "Chánh Nghĩa"}, ${found?.huyen || "TP. Thủ Dầu Một"}, tỉnh Bình Dương`,
          vneidLevel: "VNeID Mức 2 (Đã đối soát Sinh trắc học & NFC)",
          taiKhoanAnSinh: {
            nganHang: "Vietcombank CN Bình Dương",
            soTaiKhoan: "0281000349281",
            chuTaiKhoan: (found?.hoTen || "HỒ VĂN LÊN").toUpperCase(),
            trangThai: "ĐÃ LIÊN KẾT AN SINH XÃ HỘI (Chỉ thị 21/CT-TTg)",
          },
          trangThaiLamSanh: "ĐÚNG - ĐỦ - SẠCH - SỐNG (100% Khớp C06)",
          maGiaoDichNdxp: `NDXP-C06-${Date.now().toString().slice(-8)}`,
          thoiGianDoiSoat: new Date().toLocaleString("vi-VN"),
        });
        toast.success(`Xác thực thành công công dân ${found?.hoTen} qua CSDL Quốc gia về dân cư C06!`);
      }
    }, 600);
  };

  const handleExportSecurityReport = () => {
    const reportContent = `BÁO CÁO ĐÁNH GIÁ TỔNG QUAN KIẾN TRÚC AN TOÀN THÔNG TIN CẤP ĐỘ 3
CƠ QUAN CHỦ QUẢN: SỞ LAO ĐỘNG - THƯƠNG BINH VÀ XÃ HỘI TỈNH BÌNH DƯƠNG
CĂN CỨ PHÁP LÝ: Nghị định 85/2016/NĐ-CP & Thông tư 12/2022/TT-BTTTT & Nghị định 13/2023/NĐ-CP

1. THÔNG TIN HỆ THỐNG
- Tên hệ thống: Hệ thống Quản lý Hồ sơ Người có công & Đánh giá Dịch vụ công tỉnh Bình Dương
- Cấp độ đề xuất: Cấp độ 3 (Hệ thống thông tin phục vụ quản lý chuyên ngành, dịch vụ công trực tuyến cấp tỉnh)
- Mô hình kết nối: Trục liên thông NDXP Quốc gia & LGSP tỉnh Bình Dương (mTLS RSA-4096, AES-256-GCM)

2. BẢO VỆ 4 LỚP THEO CHỈ ĐẠO BỘ TT&TT:
- Lớp 1: Đội ứng cứu sự cố tại chỗ (Trung tâm CNTT&TT tỉnh Bình Dương)
- Lớp 2: Giám sát độc lập 24/7 (Kết nối SOC tỉnh Bình Dương)
- Lớp 3: Kiểm tra, đánh giá an toàn định kỳ (Pentest 01 lần/năm)
- Lớp 4: Kết nối, chia sẻ thông tin với Trung tâm Giám sát không gian mạng quốc gia (NCSC)

3. CƠ CHẾ BẢO VỆ DỮ LIỆU CÁ NHÂN (NĐ 13/2023/NĐ-CP):
- Mã hóa toàn bộ dữ liệu CCCD, số tài khoản ngân hàng, hồ sơ y khoa bằng thuật toán AES-256.
- Áp dụng mặt nạ (Data Masking) trên toàn bộ màn hình tra cứu công khai (VD: 0740****1202).
- Chữ ký số SmartCA PKI chống chối bỏ cho 100% Quyết định trợ cấp và Tờ trình cấp Phòng.
- Tách biệt tuyệt đối quyền hạn (SoD): Lãnh đạo Sở không có quyền sửa CSDL; Quản trị IT không có quyền ký văn bản.

4. KẾT NỐI VNeID & ĐỀ ÁN 06:
- Tỷ lệ làm sạch dữ liệu: 99.15% Đúng - Đủ - Sạch - Sống.
- Chi trả qua tài khoản an sinh xã hội liên kết VNeID: 98.4%.

Ngày lập báo cáo: ${new Date().toLocaleDateString("vi-VN")}
KỸ SƯ TRƯỞNG AN TOÀN THÔNG TIN & CSDL: KS. Lê Văn Khoa`;

    const blob = new Blob([reportContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `BAO_CAO_DANH_GIA_ATTT_CAP_DO_3_SLDTBXH_BINH_DUONG_${new Date().getFullYear()}.txt`;
    a.click();
    toast.success("Đã xuất tệp Báo cáo Đánh giá Kiến trúc ATTT Cấp độ 3!");
  };

  // State cho Modal Tạo phiếu báo lỗi mới
  const [showAddErrorModal, setShowAddErrorModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newModule, setNewModule] = useState<"MOT_CUA" | "THAM_DINH" | "CHI_TRA" | "CSDL_3NF" | "LGSP_VNEID" | "HE_THONG">("CSDL_3NF");
  const [newSeverity, setNewSeverity] = useState<"CRITICAL" | "HIGH" | "MEDIUM" | "LOW">("HIGH");
  const [newDescription, setNewDescription] = useState("");
  const [newStackTrace, setNewStackTrace] = useState("");

  // State cho Modal Xử lý lỗi
  const [resolvingError, setResolvingError] = useState<TechnicalErrorReport | null>(null);
  const [resolutionNote, setResolutionNote] = useState("");

  // Filter & Search
  const [filterModule, setFilterModule] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const isTechAdmin = currentUser.role === "ADMIN_TECH";

  // Thống kê nhanh
  const totalErrors = technicalErrorReports.length;
  const criticalCount = technicalErrorReports.filter((e) => e.severity === "CRITICAL").length;
  const openCount = technicalErrorReports.filter((e) => e.status === "OPEN" || e.status === "INVESTIGATING").length;
  const resolvedCount = technicalErrorReports.filter((e) => e.status === "RESOLVED").length;

  const filteredErrors = technicalErrorReports.filter((e) => {
    if (filterModule !== "ALL" && e.module !== filterModule) return false;
    if (filterStatus !== "ALL" && e.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        e.title.toLowerCase().includes(q) ||
        e.code.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.reportedBy.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreateError = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) {
      toast.error("Vui lòng nhập đầy đủ Tiêu đề và Mô tả lỗi!");
      return;
    }

    appStore.reportTechnicalError({
      title: newTitle,
      module: newModule,
      severity: newSeverity,
      description: newDescription,
      stackTrace: newStackTrace || undefined,
    });

    toast.success("Đã ghi nhận phiếu báo lỗi sự cố kỹ thuật mới!");
    setShowAddErrorModal(false);
    setNewTitle("");
    setNewDescription("");
    setNewStackTrace("");
  };

  const handleConfirmResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingError) return;
    if (!resolutionNote.trim()) {
      toast.error("Vui lòng nhập ghi chú biện pháp khắc phục!");
      return;
    }

    appStore.resolveTechnicalError(resolvingError.id, resolutionNote);
    toast.success(`Đã cập nhật giải quyết sự cố: ${resolvingError.code}`);
    setResolvingError(null);
    setResolutionNote("");
  };

  // NẾU KHÔNG PHẢI ADMIN KỸ THUẬT (VÍ DỤ: LÃNH ĐẠO / CÁN BỘ): KHÓA HOÀN TOÀN TRUY CẬP (403 FORBIDDEN)
  if (!isTechAdmin) {
    return (
      <AppShell>
        <div className="max-w-2xl mx-auto py-16 px-4">
          <div className="rounded-2xl border-2 border-red-200 bg-white p-8 shadow-xl text-center space-y-6">
            <div className="size-20 mx-auto rounded-full bg-red-100 flex items-center justify-center text-red-600 shadow-inner">
              <Lock className="size-10" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded-full">
                403 FORBIDDEN · PHÂN HỆ NỘI BỘ BỘ PHẬN KỸ THUẬT
              </span>
              <h2 className="text-xl font-black text-gray-900 pt-2">
                TỪ CHỐI TRUY CẬP: CHỈ DÀNH CHO QUẢN TRỊ VIÊN KỸ THUẬT (IT / DBA)
              </h2>
              <p className="text-xs text-gray-600 max-w-lg mx-auto leading-relaxed">
                Theo quy chuẩn An toàn thông tin và nguyên tắc <strong>Phân tách nhiệm vụ (Separation of Duties)</strong>:
                Lãnh đạo cơ quan (Sếp) chỉ thực hiện chỉ đạo điều hành vĩ mô, phê duyệt hồ sơ và phân bổ ngân sách.
                Toàn bộ quy trình <strong>theo dõi báo lỗi website, nhật ký sự cố hệ thống và can thiệp sửa đổi CSDL</strong> chỉ thuộc thẩm quyền kỹ thuật của <strong>Quản trị viên Kỹ thuật (KS. Lê Văn Khoa)</strong>.
              </p>
            </div>

            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 text-left max-w-md mx-auto text-xs space-y-1.5 font-medium">
              <div className="flex justify-between border-b pb-1">
                <span className="text-gray-500">Tài khoản hiện tại:</span>
                <span className="font-bold text-gray-900">{currentUser.fullName}</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="text-gray-500">Chức vụ:</span>
                <span className="text-gray-800">{currentUser.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Quyền hạn hệ thống:</span>
                <span className="font-mono text-red-700 font-bold">{currentUser.roleName}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/dieu-hanh"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#dd4b39] hover:bg-[#c23321] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <span>Quay về Trung tâm Điều hành Lãnh đạo</span>
              </Link>
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs transition-all"
              >
                <span>Bảng điều khiển</span>
              </Link>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-center gap-2 text-[11px] text-gray-400">
              <ShieldAlert className="size-3.5 text-gray-400" />
              <span>Hệ thống ghi nhận nhật ký bảo mật theo Nghị định 85/2016/NĐ-CP.</span>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6 pb-12">
        <PageHeader
          title="Trung tâm Quản trị Kỹ thuật, Ghi nhận Báo lỗi & Sửa lỗi CSDL"
          description="Phân hệ phân quyền độc lập dành riêng cho Quản trị viên Kỹ thuật & CSDL (KS. Lê Văn Khoa). Tách biệt hoàn toàn khỏi giao diện Lãnh đạo để đảm bảo nguyên tắc phân tách nhiệm vụ (Separation of Duties - SoD)."
          badge={{
            label: isTechAdmin ? "VAI TRÒ: ADMIN KỸ THUẬT (HỢP LỆ)" : "CẢNH BÁO: CHẾ ĐỘ XEM HẠN CHẾ",
            color: isTechAdmin ? "emerald" : "amber",
          }}
          breadcrumbs={[
            { label: "Bảng điều khiển", href: "/" },
            { label: "Quản trị Kỹ thuật & Fix lỗi CSDL" },
          ]}
        />

        {/* 1. XÁC THỰC DANH TÍNH KỸ THUẬT HỢP LỆ */}
        <div className="rounded-xl border border-emerald-300 bg-emerald-50/70 p-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="size-5 text-emerald-700 shrink-0" />
              <span className="text-xs font-bold text-emerald-950">
                Xác thực danh tính kỹ thuật hợp lệ: <strong>{currentUser.fullName}</strong> ({currentUser.title}) · Quyền can thiệp: <span className="font-mono text-emerald-800">FULL_DBA_FIX_ACCESS</span>
              </span>
            </div>
            <span className="text-[11px] bg-emerald-200/70 text-emerald-900 px-2.5 py-0.5 rounded font-mono font-bold">
              ACID · UTF8MB4 · 3NF
            </span>
          </div>
        </div>

        {/* 2. Top Navigation Tabs */}
        <div className="border-b border-gray-200 bg-white rounded-t-xl px-4 pt-3 flex flex-wrap gap-2 shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab("ERROR_LOGS")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === "ERROR_LOGS"
                ? "border-[#dd4b39] text-[#dd4b39]"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <AlertTriangle className="size-4" />
            <span>1. Ghi nhận & Xử lý Báo lỗi Hệ thống</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-red-100 text-red-700 font-bold">
              {openCount} đang mở
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("DATABASE_FIX")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === "DATABASE_FIX"
                ? "border-[#dd4b39] text-[#dd4b39]"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <Wrench className="size-4" />
            <span>2. Phân hệ Rà soát & Sửa lỗi CSDL 3NF (Data Fix Studio)</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-800 font-bold">
              ⚡ Fix 1-Click
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("SECURITY_TELEMETRY")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === "SECURITY_TELEMETRY"
                ? "border-[#dd4b39] text-[#dd4b39]"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <ShieldCheck className="size-4" />
            <span>3. Giám sát ATTT & Tích hợp VNeID / LGSP</span>
          </button>
        </div>

        {/* 3. TAB CONTENT */}
        {activeTab === "ERROR_LOGS" && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-lg border border-gray-200 bg-white p-3.5 shadow-xs">
                <div className="text-[11px] font-bold text-gray-500 uppercase">Tổng số sự cố ghi nhận</div>
                <div className="text-2xl font-black text-gray-900 mt-1">{totalErrors}</div>
                <div className="text-[11px] text-gray-500 mt-0.5">Từ cán bộ Một cửa & Quét tự động</div>
              </div>

              <div className="rounded-lg border border-red-200 bg-red-50/40 p-3.5 shadow-xs">
                <div className="text-[11px] font-bold text-red-800 uppercase flex items-center gap-1">
                  <AlertTriangle className="size-3.5 text-red-600" />
                  <span>Sự cố Nghiêm trọng (Critical)</span>
                </div>
                <div className="text-2xl font-black text-red-600 mt-1">{criticalCount}</div>
                <div className="text-[11px] text-red-700 mt-0.5">Cần xử lý trong 2h</div>
              </div>

              <div className="rounded-lg border border-amber-200 bg-amber-50/40 p-3.5 shadow-xs">
                <div className="text-[11px] font-bold text-amber-800 uppercase flex items-center gap-1">
                  <Clock className="size-3.5 text-amber-600" />
                  <span>Đang xử lý / Chưa đóng</span>
                </div>
                <div className="text-2xl font-black text-amber-700 mt-1">{openCount}</div>
                <div className="text-[11px] text-amber-800 mt-0.5">Phiếu sự cố đang mở</div>
              </div>

              <div className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-3.5 shadow-xs">
                <div className="text-[11px] font-bold text-emerald-800 uppercase flex items-center gap-1">
                  <CheckCircle2 className="size-3.5 text-emerald-600" />
                  <span>Đã khắc phục hoàn tất</span>
                </div>
                <div className="text-2xl font-black text-emerald-700 mt-1">{resolvedCount}</div>
                <div className="text-[11px] text-emerald-800 mt-0.5">Đã lưu nghiệm thu kỹ thuật</div>
              </div>
            </div>

            {/* Toolbar: Search, Filter & Nút Báo lỗi mới */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-lg border border-gray-200 shadow-xs">
              <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
                <div className="relative flex-1 max-w-sm">
                  <Search className="size-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm theo mã lỗi, tiêu đề, cán bộ báo cáo..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded border border-gray-300 focus:outline-hidden focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <select
                  value={filterModule}
                  onChange={(e) => setFilterModule(e.target.value)}
                  className="text-xs py-1.5 px-2 rounded border border-gray-300 bg-white"
                >
                  <option value="ALL">Tất cả phân hệ</option>
                  <option value="CSDL_3NF">CSDL 3NF</option>
                  <option value="CHI_TRA">Chi trả trợ cấp</option>
                  <option value="MOT_CUA">Một cửa & DVC</option>
                  <option value="THAM_DINH">Thẩm định hồ sơ</option>
                  <option value="LGSP_VNEID">LGSP / VNeID</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="text-xs py-1.5 px-2 rounded border border-gray-300 bg-white"
                >
                  <option value="ALL">Tất cả trạng thái</option>
                  <option value="OPEN">Chưa xử lý (OPEN)</option>
                  <option value="INVESTIGATING">Đang thẩm tra</option>
                  <option value="RESOLVED">Đã giải quyết</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => setShowAddErrorModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#dd4b39] hover:bg-[#c23321] text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                <Plus className="size-4" />
                <span>Tạo Phiếu Báo Lỗi Mới</span>
              </button>
            </div>

            {/* Bảng danh sách phiếu báo lỗi */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-100 text-gray-700 border-b border-gray-200 text-[11px] uppercase">
                    <tr>
                      <th className="p-3 font-bold w-28">Mã sự cố</th>
                      <th className="p-3 font-bold w-24">Mức độ</th>
                      <th className="p-3 font-bold w-28">Phân hệ</th>
                      <th className="p-3 font-bold">Tiêu đề & Nội dung sự cố</th>
                      <th className="p-3 font-bold w-36">Người báo cáo</th>
                      <th className="p-3 font-bold w-28">Trạng thái</th>
                      <th className="p-3 font-bold text-right w-32">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredErrors.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-gray-500">
                          Không tìm thấy phiếu báo lỗi nào phù hợp với bộ lọc tìm kiếm.
                        </td>
                      </tr>
                    ) : (
                      filteredErrors.map((err) => (
                        <tr key={err.id} className="hover:bg-gray-50">
                          <td className="p-3 font-mono font-bold text-gray-900">{err.code}</td>
                          <td className="p-3">
                            {err.severity === "CRITICAL" ? (
                              <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-bold text-[10px]">
                                NGHIÊM TRỌNG
                              </span>
                            ) : err.severity === "HIGH" ? (
                              <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-800 font-bold text-[10px]">
                                CAO
                              </span>
                            ) : err.severity === "MEDIUM" ? (
                              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                                TRUNG BÌNH
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[10px]">
                                THẤP
                              </span>
                            )}
                          </td>
                          <td className="p-3 font-mono text-gray-600 text-[11px]">[{err.module}]</td>
                          <td className="p-3">
                            <div className="font-bold text-gray-900">{err.title}</div>
                            <div className="text-gray-600 text-[11px] mt-0.5 leading-relaxed">{err.description}</div>
                            {err.stackTrace && (
                              <div className="text-[10px] font-mono text-gray-500 bg-gray-50 p-1.5 rounded mt-1 border border-gray-200">
                                Trace: {err.stackTrace}
                              </div>
                            )}
                            {err.resolutionNote && (
                              <div className="text-[11px] text-emerald-800 bg-emerald-50 p-1.5 rounded mt-1 border border-emerald-200 flex items-start gap-1.5">
                                <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <div>
                                  <strong>Biện pháp xử lý:</strong> {err.resolutionNote}
                                  <div className="text-[10px] text-emerald-600 mt-0.5">
                                    Xử lý bởi: {err.resolvedBy} lúc {err.resolvedAt}
                                  </div>
                                </div>
                              </div>
                            )}
                          </td>
                          <td className="p-3">
                            <div className="font-medium text-gray-900">{err.reportedBy}</div>
                            <div className="text-[10px] text-gray-500">{err.reportedAt}</div>
                          </td>
                          <td className="p-3">
                            {err.status === "RESOLVED" ? (
                              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                                <CheckCircle2 className="size-3.5" />
                                <span>ĐÃ FIX</span>
                              </span>
                            ) : err.status === "INVESTIGATING" ? (
                              <span className="inline-flex items-center gap-1 text-amber-700 font-bold text-[11px]">
                                <Clock className="size-3.5" />
                                <span>ĐANG XỬ LÝ</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-red-600 font-bold text-[11px]">
                                <AlertTriangle className="size-3.5" />
                                <span>CHƯA XỬ LÝ</span>
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-right">
                            {err.status !== "RESOLVED" ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setResolvingError(err);
                                  setResolutionNote(
                                    err.module === "CSDL_3NF"
                                      ? "Đã kiểm tra và chạy câu lệnh SQL UPDATE chuẩn hóa dữ liệu."
                                      : "Đã xác minh và cập nhật thông tin đối soát hợp lệ."
                                  );
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-xs cursor-pointer"
                              >
                                <Check className="size-3" />
                                <span>Xử lý & Đóng</span>
                              </button>
                            ) : (
                              <span className="text-[11px] text-gray-400 font-medium">Hoàn tất</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DATABASE FIX STUDIO (CHUYÊN SÂU SỬA LỖI CSDL 3NF) */}
        {activeTab === "DATABASE_FIX" && (
          <div className="space-y-4">
            <div className="bg-sky-50 border border-sky-200 p-3 rounded-lg text-xs text-sky-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="size-4 text-sky-700" />
                <span>
                  <strong>Bàn điều khiển Quản trị viên CSDL (DBA):</strong> Rà soát phát hiện dị biệt dữ liệu 1-Click, kiểm tra 42 bảng quan hệ 3NF, thực thi câu lệnh SQL UPDATE sửa lỗi và tạo bản sao lưu dữ liệu.
                </span>
              </div>
              <span className="font-mono text-sky-800 bg-sky-100 px-2 py-0.5 rounded text-[11px]">
                Quyền hạn: ADMIN_TECH
              </span>
            </div>

            <DatabaseStudioTab />
          </div>
        )}

        {/* TAB 3: AN TOÀN THÔNG TIN & TÍCH HỢP VNeID / ĐỀ ÁN 06 */}
        {activeTab === "SECURITY_TELEMETRY" && (
          <div className="space-y-6">
            {/* Header thanh điều khiển & Nút xuất báo cáo ATTT Cấp độ 3 */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 rounded-xl border border-indigo-800 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-5 text-emerald-400" />
                  <span className="font-black text-sm uppercase tracking-wide text-white">
                    TRUNG TÂM GIÁM SÁT AN TOÀN THÔNG TIN CẤP ĐỘ 3 & KẾT NỐI VNeID / ĐỀ ÁN 06
                  </span>
                </div>
                <p className="text-xs text-indigo-200">
                  Hạ tầng bảo vệ 4 lớp, xác thực mTLS Trục NDXP/VDXP, mã hóa AES-256 dữ liệu cá nhân theo Nghị định 13/2023/NĐ-CP & Thông tư 12/2022/TT-BTTTT.
                </p>
              </div>

              <button
                type="button"
                onClick={handleExportSecurityReport}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer shrink-0"
              >
                <Download className="size-4" />
                <span>Xuất Báo Cáo ATTT Cấp Độ 3 (.TXT/DOCX)</span>
              </button>
            </div>

            {/* 3 Thẻ Chỉ số kết nối & Tuân thủ */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-900 mb-2">
                  <Radio className="size-4 text-purple-600" />
                  <span>Cổng Định danh VNeID (Bộ Công an C06)</span>
                </div>
                <div className="space-y-1.5 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Giao thức xác thực:</span>
                    <span className="font-mono font-bold text-gray-900">OpenID Connect (OIDC)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mức độ định danh:</span>
                    <span className="font-bold text-purple-700">Mức 2 (Sinh trắc học NFC)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Trạng thái Gateway:</span>
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="size-3" /> SẴN SÀNG (Online)
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-900 mb-2">
                  <ShieldCheck className="size-4 text-emerald-600" />
                  <span>Trục Liên thông LGSP Bình Dương</span>
                </div>
                <div className="space-y-1.5 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Chứng thư kết nối:</span>
                    <span className="font-mono text-gray-900">mTLS RSA-4096</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mã hóa Payload:</span>
                    <span className="font-mono font-bold text-emerald-700">AES-256-GCM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Độ trễ trung bình:</span>
                    <span className="font-mono text-gray-900">38 ms</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-900 mb-2">
                  <Lock className="size-4 text-red-600" />
                  <span>Tuân thủ ATTT Cấp độ 3 (NĐ 85)</span>
                </div>
                <div className="space-y-1.5 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Bảo vệ DL Cá nhân:</span>
                    <span className="font-bold text-emerald-700">Nghị định 13/2023/NĐ-CP</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Masking số CCCD/STK:</span>
                    <span className="font-mono font-bold text-gray-900">0740****1202</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nhật ký bất biến:</span>
                    <span className="text-emerald-600 font-bold">100% Write-Ahead Log</span>
                  </div>
                </div>
              </div>
            </div>

            {/* BÀN ĐIỀU KHIỂN THỰC THI: GIẢ LẬP ĐỐI SOÁT DỮ LIỆU C06 / VNeID THỜI GIAN THỰC */}
            <div className="bg-white rounded-xl border border-purple-200 shadow-sm p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <Fingerprint className="size-5 text-purple-600" />
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">
                      Công Cụ Đối Soát Thời Gian Thực API C06 (CSDL Quốc Gia Về Dân Cư)
                    </h3>
                    <p className="text-gray-500 text-xs">
                      Kiểm tra đồng bộ 4 trường thông tin bắt buộc, trạng thái tài khoản an sinh xã hội và mã định danh VNeID mức 2.
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-purple-100 text-purple-800 text-[11px] font-bold rounded-full self-start sm:self-center font-mono">
                  TRỤC NDXP - VDXP ACTIVE
                </span>
              </div>

              {/* Ô nhập CCCD & các Preset mẫu */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 block">
                  Nhập Số định danh cá nhân (CCCD 12 số) cần đối soát:
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={testCccd}
                    onChange={(e) => setTestCccd(e.target.value.trim())}
                    placeholder="VD: 074026000123"
                    className="flex-1 px-3 py-2 border rounded-lg border-gray-300 font-mono text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleVerifyC06(testCccd)}
                    disabled={c06Verifying}
                    className="px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-lg shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {c06Verifying ? (
                      <>
                        <RefreshCw className="size-4 animate-spin" />
                        <span>Đang gọi API C06...</span>
                      </>
                    ) : (
                      <>
                        <Fingerprint className="size-4" />
                        <span>Xác thực qua C06 / VNeID</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Gợi ý test nhanh */}
                <div className="flex items-center gap-2 flex-wrap text-[11px] text-gray-500 pt-1">
                  <span className="font-semibold">Mẫu đối soát kiểm thử:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setTestCccd("074026000123");
                      handleVerifyC06("074026000123");
                    }}
                    className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded font-mono text-[10px] border"
                  >
                    074026000123 (Hồ Văn Lên - Chuẩn 100%)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTestCccd("074052007788");
                      handleVerifyC06("074052007788");
                    }}
                    className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded font-mono text-[10px] border"
                  >
                    074052007788 (Nguyễn Văn Thành - Thương binh)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTestCccd("074088992211");
                      handleVerifyC06("074088992211");
                    }}
                    className="px-2 py-0.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded font-mono text-[10px] border border-amber-300 font-bold"
                  >
                    074088992211 (Trường hợp lệch cư trú C06)
                  </button>
                </div>
              </div>

              {/* Bảng kết quả trả về từ C06 */}
              {c06Result && (
                <div className={`mt-4 p-4 rounded-xl border text-xs space-y-3 ${
                  c06Result.success ? "bg-emerald-50/50 border-emerald-200" : "bg-amber-50/60 border-amber-300"
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-2.5">
                    <div className="flex items-center gap-2">
                      {c06Result.success ? (
                        <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertTriangle className="size-4 text-amber-600 shrink-0" />
                      )}
                      <span className="font-bold text-gray-900 text-sm">
                        Kết Quả Xác Thực: {c06Result.hoTen} (CCCD: {c06Result.cccd})
                      </span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase ${
                      c06Result.success ? "bg-emerald-600 text-white" : "bg-amber-600 text-white"
                    }`}>
                      {c06Result.trangThaiLamSanh}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="bg-white p-2.5 rounded border border-gray-200">
                      <span className="text-gray-500 block text-[11px]">Thông tin nhân thân:</span>
                      <strong className="text-gray-900 block mt-0.5">
                        {c06Result.hoTen} · {c06Result.gioiTinh} (Năm sinh: {c06Result.ngaySinh})
                      </strong>
                    </div>

                    <div className="bg-white p-2.5 rounded border border-gray-200">
                      <span className="text-gray-500 block text-[11px]">Nơi thường trú chuẩn C06:</span>
                      <strong className="text-gray-900 block mt-0.5 leading-snug">
                        {c06Result.thuongTru}
                      </strong>
                    </div>

                    <div className="bg-white p-2.5 rounded border border-gray-200">
                      <span className="text-gray-500 block text-[11px]">Cấp độ định danh VNeID:</span>
                      <strong className="text-purple-700 block mt-0.5">
                        {c06Result.vneidLevel}
                      </strong>
                    </div>

                    <div className="bg-white p-2.5 rounded border border-gray-200 md:col-span-2">
                      <span className="text-gray-500 block text-[11px]">Tài khoản An sinh xã hội (Chỉ thị 21/CT-TTg):</span>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <strong className="text-gray-900">{c06Result.taiKhoanAnSinh.nganHang}</strong>
                        <span className="font-mono font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                          STK: {c06Result.taiKhoanAnSinh.soTaiKhoan}
                        </span>
                        <span className="text-gray-600">({c06Result.taiKhoanAnSinh.chuTaiKhoan})</span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          {c06Result.taiKhoanAnSinh.trangThai}
                        </span>
                      </div>
                    </div>

                    <div className="bg-white p-2.5 rounded border border-gray-200">
                      <span className="text-gray-500 block text-[11px]">Mã GD NDXP & Thời gian:</span>
                      <div className="font-mono text-[10px] text-gray-700 mt-0.5">
                        {c06Result.maGiaoDichNdxp}
                      </div>
                      <div className="text-[10px] text-gray-500">{c06Result.thoiGianDoiSoat}</div>
                    </div>
                  </div>

                  {c06Result.ghiChu && (
                    <div className="p-2.5 bg-amber-100 text-amber-900 rounded border border-amber-300 text-[11px] font-medium flex items-center gap-2">
                      <AlertTriangle className="size-4 text-amber-700 shrink-0" />
                      <span>{c06Result.ghiChu}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* BẢNG THEO DÕI LÀM SẠCH DỮ LIỆU ĐỀ ÁN 06 TỈNH BÌNH DƯƠNG */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Database className="size-4 text-[#3c8dbc]" />
                  <span>Tiến Độ Làm Sạch CSDL Người Có Công & An Sinh Xã Hội (Đề Án 06 Tỉnh Bình Dương)</span>
                </h3>
                <span className="text-xs text-gray-500 font-mono">Cập nhật: {new Date().toLocaleDateString("vi-VN")}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-gray-500 block">Tổng số đối tượng quản lý:</span>
                  <div className="text-xl font-black text-gray-900 mt-1">28.450</div>
                  <span className="text-[10px] text-gray-500">Toàn tỉnh Bình Dương</span>
                </div>

                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <span className="text-emerald-700 block font-semibold">Khớp 100% C06 (Đúng, Đủ, Sạch, Sống):</span>
                  <div className="text-xl font-black text-emerald-700 mt-1">28.210</div>
                  <span className="text-[10px] text-emerald-800 font-bold">Đạt tỷ lệ: 99,15%</span>
                </div>

                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <span className="text-amber-800 block font-semibold">Lệch thông tin cư trú (Xác minh):</span>
                  <div className="text-xl font-black text-amber-800 mt-1">180</div>
                  <span className="text-[10px] text-amber-700">Công an khu vực đang phối hợp</span>
                </div>

                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <span className="text-red-700 block font-semibold">Chi trả qua VNeID / Ngân hàng:</span>
                  <div className="text-xl font-black text-red-700 mt-1">98,4%</div>
                  <span className="text-[10px] text-red-800 font-bold">Chỉ thị 21/CT-TTg</span>
                </div>
              </div>
            </div>

            {/* BẢNG ĐÁNH GIÁ 5 TIÊU CHUẨN AN TOÀN THÔNG TIN CẤP ĐỘ 3 */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Lock className="size-4 text-emerald-600" />
                  <span>Bảng Đánh Giá Kiến Trúc An Toàn Thông Tin Cấp Độ 3 (NĐ 85/2016 & TT 12/2022)</span>
                </h3>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded">
                  TUÂN THỦ 100% (5/5 TIÊU CHUẨN)
                </span>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-100 text-gray-700 font-semibold border-b border-gray-200 text-[11px] uppercase">
                    <tr>
                      <th className="p-3 w-24">Mã tiêu chuẩn</th>
                      <th className="p-3 w-48">Nội dung yêu cầu</th>
                      <th className="p-3">Giải pháp kỹ thuật đã triển khai trong hệ thống</th>
                      <th className="p-3 w-28 text-center">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-gray-50">
                      <td className="p-3 font-mono font-bold text-gray-900">ATTT-01</td>
                      <td className="p-3 font-bold text-gray-800">Mô hình bảo vệ 4 lớp</td>
                      <td className="p-3 text-gray-600">
                        Lực lượng tại chỗ (Trung tâm CNTT Bình Dương), Giám sát SOC độc lập, Pentest định kỳ 1 năm/lần và kết nối chia sẻ NCSC quốc gia.
                      </td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">
                          ĐẠT CHUẨN
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="p-3 font-mono font-bold text-gray-900">ATTT-02</td>
                      <td className="p-3 font-bold text-gray-800">Bảo vệ DL cá nhân (NĐ 13)</td>
                      <td className="p-3 text-gray-600">
                        Mã hóa AES-256 dữ liệu CCCD, STK ngân hàng, hồ sơ y khoa; che mặt nạ (Masking) số CCCD trên giao diện tra cứu công khai.
                      </td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">
                          ĐẠT CHUẨN
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="p-3 font-mono font-bold text-gray-900">ATTT-03</td>
                      <td className="p-3 font-bold text-gray-800">Ký số PKI SmartCA (TT 16)</td>
                      <td className="p-3 text-gray-600">
                        Chữ ký số hợp chuẩn cho 100% Quyết định trợ cấp và Tờ trình cấp Phòng; có mã QR xác thực và dấu mộc điện tử chống chối bỏ.
                      </td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">
                          ĐẠT CHUẨN
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="p-3 font-mono font-bold text-gray-900">ATTT-04</td>
                      <td className="p-3 font-bold text-gray-800">Tách biệt quyền hạn (SoD)</td>
                      <td className="p-3 text-gray-600">
                        Giám đốc Sở (Lãnh đạo) chỉ xem xét và ký duyệt văn bản, tuyệt đối không có quyền sửa CSDL; Quản trị IT chỉ sửa lỗi CSDL, không được ký duyệt.
                      </td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">
                          ĐẠT CHUẨN
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="p-3 font-mono font-bold text-gray-900">ATTT-05</td>
                      <td className="p-3 font-bold text-gray-800">Nhật ký kiểm toán (Audit Trail)</td>
                      <td className="p-3 text-gray-600">
                        Lưu vết bất biến 100% thao tác người dùng (IP, thời gian, hành động, dữ liệu trước/sau sửa đổi) phục vụ thanh tra công vụ.
                      </td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">
                          ĐẠT CHUẨN
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 1: TẠO PHIẾU BÁO LỖI MỚI */}
        {showAddErrorModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-lg w-full p-5 shadow-2xl border border-gray-200 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="size-5 text-red-600" />
                  <h3 className="font-bold text-gray-900 text-sm">Gửi Báo Cáo Sự Cố Kỹ Thuật (Report Incident)</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddErrorModal(false)}
                  className="text-gray-400 hover:text-gray-700"
                >
                  <X className="size-5" />
                </button>
              </div>

              <form onSubmit={handleCreateError} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Tiêu đề sự cố / Lỗi phát hiện *</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="VD: Thiếu số tài khoản khi chi trả bảo trợ xã hội..."
                    className="w-full p-2 border rounded border-gray-300 focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Phân hệ bị ảnh hưởng</label>
                    <select
                      value={newModule}
                      onChange={(e: any) => setNewModule(e.target.value)}
                      className="w-full p-2 border rounded border-gray-300 bg-white"
                    >
                      <option value="CSDL_3NF">CSDL 3NF (Bảng dữ liệu)</option>
                      <option value="CHI_TRA">Chi trả trợ cấp & Ngân hàng</option>
                      <option value="MOT_CUA">Một cửa & OCR CCCD</option>
                      <option value="THAM_DINH">Thẩm định hồ sơ</option>
                      <option value="LGSP_VNEID">LGSP / VNeID</option>
                      <option value="HE_THONG">Phân quyền & Hệ thống</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Mức độ nghiêm trọng</label>
                    <select
                      value={newSeverity}
                      onChange={(e: any) => setNewSeverity(e.target.value)}
                      className="w-full p-2 border rounded border-gray-300 bg-white"
                    >
                      <option value="CRITICAL">Nghiêm trọng (Critical)</option>
                      <option value="HIGH">Cao (High)</option>
                      <option value="MEDIUM">Trung bình (Medium)</option>
                      <option value="LOW">Thấp (Low)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Mô tả chi tiết lỗi *</label>
                  <textarea
                    rows={3}
                    required
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Mô tả cụ thể triệu chứng, mã hồ sơ hoặc hành vi bất thường gặp phải..."
                    className="w-full p-2 border rounded border-gray-300 focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Log kỹ thuật / Stack Trace (Nếu có)</label>
                  <input
                    type="text"
                    value={newStackTrace}
                    onChange={(e) => setNewStackTrace(e.target.value)}
                    placeholder="VD: Table: ho_so_ncc | Field: cccd | Length: 11"
                    className="w-full p-2 border rounded border-gray-300 font-mono text-[11px]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t">
                  <button
                    type="button"
                    onClick={() => setShowAddErrorModal(false)}
                    className="px-3 py-1.5 rounded border border-gray-300 text-gray-700 font-bold hover:bg-gray-50"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded bg-[#dd4b39] hover:bg-[#c23321] text-white font-bold shadow-xs"
                  >
                    Gửi phiếu báo lỗi
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: XỬ LÝ & ĐÓNG PHIẾU BÁO LỖI */}
        {resolvingError && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-2xl border border-gray-200 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-5 text-emerald-600" />
                  <h3 className="font-bold text-gray-900 text-sm">Xác Nhận Giải Quyết Sự Cố Kỹ Thuật</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setResolvingError(null)}
                  className="text-gray-400 hover:text-gray-700"
                >
                  <X className="size-5" />
                </button>
              </div>

              <form onSubmit={handleConfirmResolve} className="space-y-3 text-xs">
                <div className="bg-gray-50 p-2.5 rounded border border-gray-200 space-y-1">
                  <div className="font-bold text-gray-900">{resolvingError.code}: {resolvingError.title}</div>
                  <div className="text-gray-600 text-[11px]">{resolvingError.description}</div>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Ghi chú biện pháp khắc phục (Resolution Note) *</label>
                  <textarea
                    rows={3}
                    required
                    value={resolutionNote}
                    onChange={(e) => setResolutionNote(e.target.value)}
                    placeholder="Ghi rõ hành động kỹ thuật đã thực hiện (VD: Đã chạy UPDATE SQL chuẩn hóa trường cccd = 12 số)..."
                    className="w-full p-2 border rounded border-gray-300 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t">
                  <button
                    type="button"
                    onClick={() => setResolvingError(null)}
                    className="px-3 py-1.5 rounded border border-gray-300 text-gray-700 font-bold hover:bg-gray-50"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs"
                  >
                    Xác nhận đã khắc phục (Resolve)
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
