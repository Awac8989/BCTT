import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Building2,
  ShieldCheck,
  KeyRound,
  UserCheck,
  ArrowRight,
  Fingerprint,
  CheckCircle2,
  Eye,
  EyeOff,
  ExternalLink,
  FileSpreadsheet,
  Download,
  Search,
  Lock,
  User,
  AlertCircle,
  X,
  Copy,
  FileText,
  ShieldAlert,
  Sparkles,
  Laptop,
} from "lucide-react";
import { appStore, MOCK_USERS, type MockRoleKey, type CurrentUser } from "@/services/app-state";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Cổng Đăng nhập Xác thực Công vụ · Hệ thống Điều hành Đa mảng · Tỉnh Bình Dương" },
      {
        name: "description",
        content:
          "Cổng đăng nhập hệ thống quản lý hồ sơ Người có công, An sinh xã hội, Giáo dục đào tạo và Trung tâm Kỹ thuật CSDL 3NF tỉnh Bình Dương.",
      },
    ],
  }),
  component: LoginPage,
});

interface AccountDetail {
  stt: number;
  roleKey: MockRoleKey;
  fullName: string;
  title: string;
  unit: string;
  username: string;
  email: string;
  passwordDefault: string;
  roleName: string;
  badgeClass: string;
  scope: string;
  boundaries: string;
}

const OFFICIAL_ACCOUNTS: AccountDetail[] = [
  {
    stt: 1,
    roleKey: "ADMIN_SO",
    fullName: "TS. Nguyễn Văn Hùng",
    title: "Phó Giám đốc Sở LĐ-TB&XH tỉnh Bình Dương",
    unit: "Ban Giám đốc Sở LĐ-TB&XH tỉnh Bình Dương",
    username: "admin.so",
    email: "admin.so@binhduong.gov.vn",
    passwordDefault: "BinhDuong@2026",
    roleName: "Lãnh đạo Ban Giám đốc Sở (Sếp)",
    badgeClass: "bg-red-100 text-red-800 border-red-200",
    scope: "Chỉ đạo điều hành vĩ mô, ký số quyết định trợ cấp, giám sát CSAT và ngân sách toàn tỉnh.",
    boundaries: "Lãnh đạo cơ quan; không can thiệp kỹ thuật hệ thống, không xem CSDL SQL hay xử lý lỗi IT.",
  },
  {
    stt: 2,
    roleKey: "ADMIN_TECH",
    fullName: "KS. Lê Văn Khoa",
    title: "Kỹ sư An toàn thông tin & Quản trị CSDL",
    unit: "Trung tâm CNTT & Truyền thông - Sở LĐ-TB&XH",
    username: "admin.kythuat",
    email: "admin.kythuat@binhduong.gov.vn",
    passwordDefault: "BinhDuong@2026",
    roleName: "Quản trị viên Kỹ thuật & CSDL (DevOps / DBA)",
    badgeClass: "bg-purple-100 text-purple-800 border-purple-200",
    scope: "Độc quyền truy cập Trung tâm Kỹ thuật (/ky-thuat), chẩn đoán dị biệt dữ liệu, chạy SQL UPDATE sửa lỗi CSDL 3NF, giám sát ATTT.",
    boundaries: "Chuyên trách kỹ thuật; độc lập và tách bạch hoàn toàn khỏi vai trò lãnh đạo chỉ đạo.",
  },
  {
    stt: 3,
    roleKey: "ADMIN_PHONG",
    fullName: "Nguyễn Thị Minh Thảo",
    title: "Chuyên viên Thụ lý Một cửa & CSXH",
    unit: "Phòng LĐ-TB&XH TP. Thủ Dầu Một",
    username: "admin.phong",
    email: "admin.phong@thudaumot.binhduong.gov.vn",
    passwordDefault: "BinhDuong@2026",
    roleName: "Cán bộ Thụ lý Cấp Phòng",
    badgeClass: "bg-blue-100 text-blue-800 border-blue-200",
    scope: "Tiếp nhận hồ sơ Người có công tại Một cửa, lập danh sách chi trả trợ cấp tháng qua ATM/Ngân hàng, quản lý điều dưỡng.",
    boundaries: "Thẩm quyền giải quyết trong phạm vi địa bàn TP. Thủ Dầu Một.",
  },
  {
    stt: 4,
    roleKey: "CB_THONG_TIN",
    fullName: "Vũ Đình Cường",
    title: "Chuyên viên Văn hóa - Thông tin & CĐS",
    unit: "UBND Phường Phú Cường, TP. Thủ Dầu Một",
    username: "cb.thongtin",
    email: "vdcuong.phucuong@thudaumot.binhduong.gov.vn",
    passwordDefault: "BinhDuong@2026",
    roleName: "Cán bộ Thông tin, Truyền thông & CĐS",
    badgeClass: "bg-sky-100 text-sky-800 border-sky-200",
    scope: "Quản trị đài truyền thanh thông minh, bảng tin điện tử LED, Cổng TTĐT phường, điều phối Tổ công nghệ số cộng đồng.",
    boundaries: "Phân quyền mảng Thông tin & Truyền thông cấp phường.",
  },
  {
    stt: 5,
    roleKey: "CB_AN_SINH",
    fullName: "Lê Hoàng Nam",
    title: "Công chức Văn hóa - Xã hội phụ trách LĐ-TB&XH",
    unit: "UBND Phường Phú Cường, TP. Thủ Dầu Một",
    username: "cb.ansinh",
    email: "lhnam.phucuong@thudaumot.binhduong.gov.vn",
    passwordDefault: "BinhDuong@2026",
    roleName: "Cán bộ Lao động, Việc làm & An sinh",
    badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
    scope: "Quản lý hồ sơ Người có công cơ sở, chi trả trợ cấp bảo trợ xã hội (NĐ 20), rà soát hộ nghèo/cận nghèo, an toàn lao động.",
    boundaries: "Phân quyền mảng Lao động & An sinh cấp phường.",
  },
  {
    stt: 6,
    roleKey: "CB_GIAO_DUC",
    fullName: "ThS. Trần Thị Kim Oanh",
    title: "Công chức phụ trách Giáo dục - Đào tạo",
    unit: "UBND Phường Phú Cường, TP. Thủ Dầu Một",
    username: "cb.giaoduc",
    email: "ttkoanh.phucuong@thudaumot.binhduong.gov.vn",
    passwordDefault: "BinhDuong@2026",
    roleName: "Cán bộ Giáo dục & Đào tạo cơ sở",
    badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
    scope: "Thẩm định nhóm trẻ tư thục, phổ cập giáo dục, phối hợp tuyển sinh đầu cấp, điều hành Trung tâm học tập cộng đồng.",
    boundaries: "Phân quyền mảng Giáo dục & Đào tạo cấp phường.",
  },
  {
    stt: 7,
    roleKey: "CB_VAN_HOA",
    fullName: "Nguyễn Thanh Tùng",
    title: "Công chức Văn hóa - Xã hội (Văn hóa, Thể thao)",
    unit: "UBND Phường Phú Cường, TP. Thủ Dầu Một",
    username: "cb.vanhoa",
    email: "nttung.phucuong@thudaumot.binhduong.gov.vn",
    passwordDefault: "BinhDuong@2026",
    roleName: "Cán bộ Văn hóa, Thể thao & Đời sống",
    badgeClass: "bg-rose-100 text-rose-800 border-rose-200",
    scope: "Bình xét Gia đình/Khu phố văn hóa (NĐ 86/2023), quản lý di tích lịch sử, cơ sở kinh doanh dịch vụ văn hóa (karaoke/biển hiệu).",
    boundaries: "Phân quyền mảng Văn hóa & Đời sống văn minh cấp phường.",
  },
];

function LoginPage() {
  const navigate = useNavigate();
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authMethod, setAuthMethod] = useState<"PASSWORD" | "TOKEN_CA" | "VNEID">("PASSWORD");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showLookupModal, setShowLookupModal] = useState(false);
  const [modalSearch, setModalSearch] = useState("");

  // Tìm kiếm tài khoản phù hợp với thông tin người dùng nhập vào
  const resolveUser = (input: string): { user: CurrentUser; roleKey: MockRoleKey } | null => {
    const term = input.trim().toLowerCase();
    if (!term) return null;

    const mockDict = MOCK_USERS as Record<string, CurrentUser>;
    for (const [key, u] of Object.entries(mockDict)) {
      if (
        u.username.toLowerCase() === term ||
        u.email.toLowerCase() === term ||
        u.role.toLowerCase() === term ||
        key.toLowerCase() === term
      ) {
        return { user: u, roleKey: key as MockRoleKey };
      }
    }
    return null;
  };

  // Xử lý gửi form đăng nhập
  const handleFormSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    const term = usernameInput.trim();
    const pass = passwordInput.trim();

    if (!term) {
      setErrorMessage("Vui lòng nhập Tên đăng nhập hoặc Email công vụ.");
      toast.error("Vui lòng nhập tên đăng nhập!");
      return;
    }

    if (!pass) {
      setErrorMessage("Vui lòng nhập Mật khẩu bảo mật.");
      toast.error("Vui lòng nhập mật khẩu!");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const match = resolveUser(term);

      if (!match) {
        setLoading(false);
        setErrorMessage(
          `Không tìm thấy tài khoản "${term}". Quý cán bộ vui lòng kiểm tra lại hoặc bấm "Tra cứu danh sách tài khoản" để xem thông tin chính xác.`
        );
        toast.error("Tài khoản không tồn tại trên hệ thống!");
        return;
      }

      // Xác thực mật khẩu: Chuẩn là "BinhDuong@2026", hoặc mật khẩu demo "123456", "admin"
      const isValidPassword =
        pass === "BinhDuong@2026" ||
        pass === "123456" ||
        pass === "admin" ||
        pass.toLowerCase() === "binhduong@2026";

      if (!isValidPassword) {
        setLoading(false);
        setErrorMessage(
          "Mật khẩu không chính xác. Mật khẩu mặc định hệ thống cấp phát là: BinhDuong@2026 (hoặc bấm nút 'Tải file Excel tài khoản' để đối soát)."
        );
        toast.error("Mật khẩu không chính xác!");
        return;
      }

      // Đăng nhập thành công
      const loggedInUser = appStore.login(match.roleKey, {
        username: term,
        password: pass,
      });

      setLoading(false);
      toast.success(`Đăng nhập thành công! Xin chào ${loggedInUser.fullName}`, {
        description: `Vai trò: ${loggedInUser.roleName} · Đơn vị: ${loggedInUser.unit}`,
      });

      // Điều hướng theo phân quyền:
      // Nếu là Admin Kỹ thuật (KS. Lê Văn Khoa) -> chuyển thẳng tới /ky-thuat để rà soát lỗi CSDL & Báo lỗi
      // Nếu là Sếp hoặc Cán bộ nghiệp vụ khác -> chuyển tới trang Điều hành chính (/)
      if (loggedInUser.role === "ADMIN_TECH") {
        navigate({ to: "/ky-thuat" });
      } else {
        navigate({ to: "/" });
      }
    }, 400);
  };

  // Điền nhanh tài khoản từ modal tra cứu
  const handleSelectFromLookup = (acc: AccountDetail) => {
    setUsernameInput(acc.username);
    setPasswordInput(acc.passwordDefault);
    setErrorMessage(null);
    setShowLookupModal(false);
    toast.info(`Đã điền thông tin tài khoản: ${acc.fullName} (${acc.username})`, {
      description: "Nhấn 'Đăng nhập vào Hệ thống' để tiếp tục.",
    });
  };

  // Sao chép thông tin
  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Đã sao chép ${label}: ${text}`);
  };

  // Lọc tài khoản trong modal tra cứu
  const filteredAccounts = OFFICIAL_ACCOUNTS.filter((a) => {
    if (!modalSearch) return true;
    const s = modalSearch.toLowerCase();
    return (
      a.fullName.toLowerCase().includes(s) ||
      a.username.toLowerCase().includes(s) ||
      a.roleName.toLowerCase().includes(s) ||
      a.unit.toLowerCase().includes(s)
    );
  });

  return (
    <div className="min-h-screen bg-[#f4f6f9] flex flex-col justify-between selection:bg-[#dd4b39] selection:text-white font-sans">
      {/* 1. Đường viền cờ đỏ công quyền trên cùng */}
      <div className="h-[4px] w-full bg-gradient-to-r from-[#dd4b39] via-[#f39c12] to-[#dd4b39]" />

      {/* 2. Nội dung trung tâm của Cổng Đăng Nhập */}
      <div className="flex-1 flex items-center justify-center p-3 sm:p-6 lg:p-8">
        <div className="w-full max-w-5xl bg-white rounded-lg border border-[#d2d6de] shadow-lg overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* CỘT TRÁI (5 phần): Nhận diện thương hiệu, Quốc hiệu & Nguyên tắc Phân quyền */}
          <div className="lg:col-span-5 bg-gradient-to-b from-[#b91c1c] via-[#991b1b] to-[#7f1d1d] p-6 text-white flex flex-col justify-between relative overflow-hidden">
            {/* Họa tiết trống đồng chìm trang trọng */}
            <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="size-96 text-white fill-current">
                <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="4" />
                <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx="100" cy="100" r="50" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>

            <div className="relative z-10">
              {/* Quốc hiệu - Tiêu ngữ */}
              <div className="text-center pb-4 border-b border-white/20">
                <div className="text-[11px] font-bold uppercase tracking-wider text-amber-200">
                  CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                </div>
                <div className="text-[10px] text-white/90 italic font-serif mt-0.5">
                  Độc lập - Tự do - Hạnh phúc
                </div>
              </div>

              {/* Quốc huy / Biểu tượng cơ quan nhà nước */}
              <div className="flex justify-center mt-5">
                <div className="size-16 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 p-1 shadow-md flex items-center justify-center">
                  <div className="size-full rounded-full bg-[#c82333] border-2 border-amber-300 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="size-8 fill-amber-300 drop-shadow-xs" aria-label="Quốc huy">
                      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Tiêu đề Cổng */}
              <div className="text-center mt-3">
                <div className="text-[11px] font-bold uppercase tracking-widest text-amber-300">
                  ỦY BAN NHÂN DÂN TỈNH BÌNH DƯƠNG
                </div>
                <h1 className="text-xs font-extrabold uppercase mt-1 leading-snug text-white">
                  HỆ THỐNG ĐIỀU HÀNH NGHIỆP VỤ &amp; CHUYỂN ĐỔI SỐ CƠ SỞ
                </h1>
                <div className="mt-1 text-[11px] font-medium text-white/90 leading-tight">
                  Quản lý Đa Mảng: Thông tin - An sinh Xã hội - Giáo dục Đào tạo - Kỹ thuật CSDL
                </div>
              </div>

              {/* Nguyên tắc phân quyền cốt lõi & Tách bạch trách nhiệm */}
              <div className="mt-5 rounded-md bg-white/10 p-3.5 border border-white/20 backdrop-blur-xs space-y-2.5">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-amber-300">
                  <ShieldCheck className="size-4 text-emerald-300 shrink-0" />
                  <span>Quy định Phân quyền &amp; Trách nhiệm (SoD)</span>
                </div>

                <div className="text-[11px] text-white/95 leading-relaxed space-y-1.5">
                  <div className="flex items-start gap-1.5">
                    <span className="text-amber-300 font-bold">•</span>
                    <span>
                      <strong>Lãnh đạo Ban Giám đốc Sở (TS. Nguyễn Văn Hùng):</strong> Quản lý chỉ đạo vĩ mô, ký số phê duyệt, giám sát ngân sách. Tuyệt đối không can thiệp sửa lỗi CSDL hay báo lỗi IT.
                    </span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="text-amber-300 font-bold">•</span>
                    <span>
                      <strong>Admin Kỹ thuật &amp; CSDL (KS. Lê Văn Khoa):</strong> Độc quyền phân hệ Rà soát dữ liệu 3NF, xử lý báo lỗi và vận hành kỹ thuật hệ thống.
                    </span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="text-amber-300 font-bold">•</span>
                    <span>
                      <strong>Cán bộ nghiệp vụ cơ sở:</strong> Phân định rõ ràng theo từng mảng chuyên trách cấp Phường và Phòng ban.
                    </span>
                  </div>
                </div>
              </div>

              {/* Thông tin hỗ trợ kỹ thuật */}
              <div className="mt-3 text-[10px] text-white/70 flex items-center justify-between">
                <span>Trung tâm CNTT &amp; Truyền thông</span>
                <span className="font-mono">Hotline: 0274.3822.456</span>
              </div>
            </div>

            {/* Dưới cột trái: thông tin mã hóa bảo mật */}
            <div className="mt-4 pt-3 border-t border-white/20 text-[10px] text-white/80 flex items-center justify-between relative z-10">
              <span className="flex items-center gap-1.5">
                <Lock className="size-3.5 text-emerald-300" />
                Mã hóa đường truyền TLS 1.3
              </span>
              <span className="font-mono text-[10px]">Tiêu chuẩn ATTT Cấp độ 3</span>
            </div>
          </div>

          {/* CỘT PHẢI (7 phần): Form Đăng Nhập Thực Thụ & Cổng Tải Excel Tài Khoản */}
          <div className="lg:col-span-7 p-6 flex flex-col justify-between bg-white">
            <div>
              {/* Header Cổng đăng nhập */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#e5e7eb]">
                <div>
                  <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <KeyRound className="size-4.5 text-[#dd4b39]" />
                    <span>Cổng Xác thực Tài khoản Công vụ</span>
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Đăng nhập tài khoản định danh cán bộ công chức tỉnh Bình Dương
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <span className="rounded bg-red-50 px-2 py-0.5 text-xs font-bold text-[#dd4b39] border border-red-200">
                    Bảo mật 2FA / PKI
                  </span>
                </div>
              </div>

              {/* THÔNG BÁO LỖI (NẾU NHẬP SAI) */}
              {errorMessage && (
                <div className="mt-3 p-3 rounded-md bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="size-4 text-red-600 shrink-0 mt-0.5" />
                  <div className="flex-1 font-medium leading-relaxed">{errorMessage}</div>
                  <button
                    type="button"
                    onClick={() => setErrorMessage(null)}
                    className="text-red-400 hover:text-red-700"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              )}

              {/* CHỌN PHƯƠNG THỨC XÁC THỰC */}
              <div className="mt-3 grid grid-cols-3 gap-1 bg-gray-100 p-1 rounded-md text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setAuthMethod("PASSWORD")}
                  className={`py-1.5 px-2 rounded text-center transition-all ${
                    authMethod === "PASSWORD"
                      ? "bg-white text-gray-900 shadow-xs font-bold"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Mật khẩu công vụ
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod("TOKEN_CA");
                    toast.info("Chế độ Token PKI (Chữ ký số Ban Cơ yếu Chính phủ): Vui lòng cắm USB Token để tự động nhận dạng.", {
                      duration: 4000,
                    });
                  }}
                  className={`py-1.5 px-2 rounded text-center transition-all ${
                    authMethod === "TOKEN_CA"
                      ? "bg-white text-gray-900 shadow-xs font-bold"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  USB Token PKI
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod("VNEID");
                    toast.info("Định danh điện tử VNeID: Quét mã QR bằng ứng dụng VNeID cấp độ 2 trên điện thoại.", {
                      duration: 4000,
                    });
                  }}
                  className={`py-1.5 px-2 rounded text-center transition-all ${
                    authMethod === "VNEID"
                      ? "bg-white text-gray-900 shadow-xs font-bold"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  VNeID Cấp độ 2
                </button>
              </div>

              {/* FORM NHẬP THÔNG TIN TÀI KHOẢN */}
              <form onSubmit={handleFormSubmit} className="mt-4 space-y-3.5">
                {/* Trường 1: Tên đăng nhập hoặc Email */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-gray-700">
                      Tên đăng nhập hoặc Email công vụ:
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowLookupModal(true)}
                      className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline"
                    >
                      <Search className="size-3" />
                      <span>Tra cứu danh sách tài khoản</span>
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={usernameInput}
                      onChange={(e) => {
                        setUsernameInput(e.target.value);
                        if (errorMessage) setErrorMessage(null);
                      }}
                      placeholder="Ví dụ: admin.so, admin.kythuat, admin.phong, cb.thongtin..."
                      className="w-full rounded border border-[#d2d6de] bg-white px-3 py-2 text-xs text-gray-900 outline-none focus:border-[#dd4b39] focus:ring-1 focus:ring-[#dd4b39]"
                      autoFocus
                    />
                    <div className="absolute right-3 top-2.5 text-gray-400">
                      <User className="size-4" />
                    </div>
                  </div>
                  <div className="mt-1 text-[11px] text-gray-500">
                    Nhập Username (ví dụ: <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-700 font-mono">admin.so</code>, <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-700 font-mono">admin.kythuat</code>) hoặc Email công vụ.
                  </div>
                </div>

                {/* Trường 2: Mật khẩu xác thực */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-gray-700">
                      Mật khẩu xác thực:
                    </label>
                    <span className="text-[11px] text-gray-500">
                      Mật khẩu mặc định: <code className="bg-amber-50 text-amber-800 font-mono px-1 py-0.5 rounded border border-amber-200">BinhDuong@2026</code>
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={passwordInput}
                      onChange={(e) => {
                        setPasswordInput(e.target.value);
                        if (errorMessage) setErrorMessage(null);
                      }}
                      placeholder="Nhập mật khẩu (Mặc định: BinhDuong@2026)"
                      className="w-full rounded border border-[#d2d6de] bg-white px-3 py-2 text-xs text-gray-900 outline-none focus:border-[#dd4b39] focus:ring-1 focus:ring-[#dd4b39]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                      title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                {/* Tùy chọn nhớ phiên & Chữ ký số */}
                <div className="flex items-center justify-between text-xs pt-0.5">
                  <label className="flex items-center gap-1.5 cursor-pointer text-gray-700 select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-gray-300 text-[#dd4b39] focus:ring-[#dd4b39]"
                    />
                    <span>Ghi nhớ phiên làm việc trên thiết bị</span>
                  </label>

                  <a
                    href="#quen-mat-khau"
                    onClick={(e) => {
                      e.preventDefault();
                      toast.info("Vui lòng liên hệ KS. Lê Văn Khoa (Quản trị viên Kỹ thuật, ĐT: 0274.3899.112) để cấp lại mật khẩu.");
                    }}
                    className="text-[11px] text-blue-600 hover:underline"
                  >
                    Quên mật khẩu?
                  </a>
                </div>

                {/* NÚT BẤM ĐĂNG NHẬP CHÍNH THỨC */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 rounded text-xs font-bold text-white bg-[#dd4b39] hover:bg-[#c23321] transition-all shadow-sm flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-70"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin size-4 text-white" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        <span>Đang xác thực thông tin công vụ...</span>
                      </span>
                    ) : (
                      <>
                        <KeyRound className="size-4" />
                        <span>ĐĂNG NHẬP VÀO HỆ THỐNG ĐIỀU HÀNH</span>
                        <ArrowRight className="size-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* PHÂN HỆ XUẤT EXCEL & TRA CỨU TÀI KHOẢN CÔNG VỤ (THEO YÊU CẦU NGƯỜI DÙNG) */}
              <div className="mt-5 p-3.5 rounded-lg border border-emerald-200 bg-emerald-50/70">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="size-7 rounded bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <FileSpreadsheet className="size-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-emerald-950">
                        Danh sách Tài khoản &amp; Mật khẩu Cấp phát (.xlsx)
                      </div>
                      <div className="text-[11px] text-emerald-800">
                        File Excel đầy đủ 07 tài khoản chuẩn phân quyền theo từng cấp
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-2.5 flex flex-wrap items-center gap-2">
                  {/* Nút tải Excel */}
                  <a
                    href="/DANH_SACH_TAI_KHOAN_DANG_NHAP_HE_THONG.xlsx"
                    download="DANH_SACH_TAI_KHOAN_DANG_NHAP_HE_THONG.xlsx"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors shadow-xs"
                    onClick={() => {
                      toast.success("Bắt đầu tải file Excel danh sách tài khoản & mật khẩu (.xlsx)!");
                    }}
                  >
                    <Download className="size-3.5" />
                    <span>Tải Bảng Excel (.xlsx)</span>
                  </a>

                  {/* Nút tải CSV */}
                  <a
                    href="/DANH_SACH_TAI_KHOAN_DANG_NHAP_HE_THONG.csv"
                    download="DANH_SACH_TAI_KHOAN_DANG_NHAP_HE_THONG.csv"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 text-xs font-medium transition-colors"
                    onClick={() => {
                      toast.success("Bắt đầu tải file CSV danh sách tài khoản!");
                    }}
                  >
                    <FileText className="size-3.5 text-gray-500" />
                    <span>Tải bản sao CSV</span>
                  </a>

                  {/* Nút mở Modal tra cứu trực quan */}
                  <button
                    type="button"
                    onClick={() => setShowLookupModal(true)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs font-semibold transition-colors ml-auto"
                  >
                    <Search className="size-3.5" />
                    <span>Xem danh sách tài khoản</span>
                  </button>
                </div>
              </div>

              {/* Đường dẫn mở Cổng Công Dân Đánh Giá (Mở tab riêng) */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span>Dành cho công dân &amp; người có công:</span>
                <a
                  href="/khao-sat?maHoSo=BD/NCC-12029&kenh=QR_PHIEU_HEN"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline"
                >
                  <span>Cổng Đánh giá dịch vụ (QR)</span>
                  <ExternalLink className="size-3.5" />
                </a>
              </div>
            </div>

            {/* DÒNG THƯƠNG HIỆU PHIÊN BẢN 2.0 MADE BY MINHQUAN NẰM Ở DƯỚI CÙNG THEO YÊU CẦU */}
            <div className="mt-5 pt-3 border-t-2 border-dashed border-gray-200 text-center">
              <div className="font-mono text-xs font-extrabold uppercase tracking-widest text-[#dd4b39] bg-red-50 py-1.5 px-3 rounded inline-block border border-red-200 shadow-2xs">
                PHIÊN BẢN 2.0 MADE BY MINHQUAN
              </div>
              <div className="text-[10px] text-gray-500 mt-1 font-medium">
                Hệ thống Quản lý Người có công &amp; Dịch vụ công · Tỉnh Bình Dương © 2026
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MODAL TRA CỨU DANH SÁCH TÀI KHOẢN & PHÂN QUYỀN DÀNH CHO GIẢNG VIÊN / HỘI ĐỒNG */}
      {showLookupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-lg shadow-2xl border border-gray-300 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Header Modal */}
            <div className="px-5 py-3.5 bg-gradient-to-r from-[#b91c1c] to-[#991b1b] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="size-5 text-amber-300" />
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wide">
                    Bảng Tra cứu Danh sách Tài khoản &amp; Mật khẩu Cấp phát
                  </h3>
                  <p className="text-[11px] text-white/80">
                    Phục vụ kiểm tra phân quyền, chấm điểm báo cáo tốt nghiệp &amp; thử nghiệm chức năng
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowLookupModal(false)}
                className="p-1 rounded text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Thanh tìm kiếm & Tải file nhanh */}
            <div className="p-3 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center justify-between gap-2">
              <div className="relative flex-1 min-w-[200px]">
                <input
                  type="text"
                  value={modalSearch}
                  onChange={(e) => setModalSearch(e.target.value)}
                  placeholder="Tìm theo họ tên, username, chức vụ hoặc đơn vị..."
                  className="w-full pl-8 pr-3 py-1.5 rounded border border-gray-300 text-xs text-gray-900 outline-none focus:border-[#dd4b39]"
                />
                <Search className="size-4 text-gray-400 absolute left-2.5 top-2" />
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="/DANH_SACH_TAI_KHOAN_DANG_NHAP_HE_THONG.xlsx"
                  download="DANH_SACH_TAI_KHOAN_DANG_NHAP_HE_THONG.xlsx"
                  className="px-2.5 py-1.5 rounded bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1 shadow-2xs"
                >
                  <Download className="size-3.5" />
                  <span>Tải Excel</span>
                </a>
              </div>
            </div>

            {/* Bảng dữ liệu 07 tài khoản */}
            <div className="flex-1 overflow-auto p-4">
              <div className="overflow-x-auto rounded border border-gray-200">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700 font-bold border-b border-gray-200">
                      <th className="p-2.5 text-center w-10">STT</th>
                      <th className="p-2.5 min-w-[150px]">Cán bộ &amp; Chức vụ</th>
                      <th className="p-2.5 min-w-[130px]">Username &amp; Mật khẩu</th>
                      <th className="p-2.5 min-w-[160px]">Vai trò &amp; Thẩm quyền</th>
                      <th className="p-2.5 min-w-[170px]">Giới hạn phân quyền (SoD)</th>
                      <th className="p-2.5 text-center w-24">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredAccounts.map((acc) => (
                      <tr key={acc.roleKey} className="hover:bg-amber-50/40 transition-colors">
                        <td className="p-2.5 text-center font-bold text-gray-500">{acc.stt}</td>
                        <td className="p-2.5">
                          <div className="font-bold text-gray-900">{acc.fullName}</div>
                          <div className="text-[11px] text-gray-600">{acc.title}</div>
                          <div className="text-[10px] text-gray-500 italic mt-0.5">{acc.unit}</div>
                        </td>
                        <td className="p-2.5">
                          <div className="flex items-center gap-1">
                            <span className="font-mono font-bold text-blue-700">{acc.username}</span>
                            <button
                              type="button"
                              onClick={() => handleCopyText(acc.username, "Username")}
                              className="text-gray-400 hover:text-gray-700"
                              title="Sao chép username"
                            >
                              <Copy className="size-3" />
                            </button>
                          </div>
                          <div className="text-[11px] text-gray-500 font-mono mt-0.5">{acc.email}</div>
                          <div className="mt-1 flex items-center gap-1">
                            <span className="text-[10px] text-gray-500 font-medium">Pass:</span>
                            <code className="bg-gray-100 px-1 py-0.5 rounded font-mono font-bold text-amber-900 text-[11px]">
                              {acc.passwordDefault}
                            </code>
                            <button
                              type="button"
                              onClick={() => handleCopyText(acc.passwordDefault, "Mật khẩu")}
                              className="text-gray-400 hover:text-gray-700"
                              title="Sao chép mật khẩu"
                            >
                              <Copy className="size-3" />
                            </button>
                          </div>
                        </td>
                        <td className="p-2.5">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${acc.badgeClass}`}>
                            {acc.roleName}
                          </span>
                          <div className="text-[11px] text-gray-700 mt-1 leading-snug">
                            {acc.scope}
                          </div>
                        </td>
                        <td className="p-2.5">
                          <div className="text-[11px] text-gray-600 leading-snug">
                            {acc.boundaries}
                          </div>
                        </td>
                        <td className="p-2.5 text-center">
                          <button
                            type="button"
                            onClick={() => handleSelectFromLookup(acc)}
                            className="px-2.5 py-1.5 rounded bg-[#dd4b39] hover:bg-[#c23321] text-white text-[11px] font-bold transition-colors whitespace-nowrap shadow-2xs"
                          >
                            Điền vào form
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-600">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-emerald-600" />
                <span>Mật khẩu chuẩn áp dụng cho tất cả tài khoản: <strong>BinhDuong@2026</strong></span>
              </div>
              <button
                type="button"
                onClick={() => setShowLookupModal(false)}
                className="px-4 py-1.5 rounded border border-gray-300 bg-white hover:bg-gray-100 font-semibold text-gray-700 text-xs"
              >
                Đóng bảng tra cứu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Chân trang cố định chuẩn giao diện nhà nước */}
      <footer className="bg-white border-t border-[#d2d6de] py-2.5 px-4 text-center text-xs text-gray-600">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-[11px]">
          <div>
            <strong>Cơ quan chủ quản:</strong> Sở Lao động - Thương binh và Xã hội tỉnh Bình Dương
          </div>
          <div className="text-gray-500">
            Địa chỉ: Tầng 6, Tháp A, Tòa nhà Trung tâm Hành chính tỉnh Bình Dương
          </div>
        </div>
      </footer>
    </div>
  );
}
