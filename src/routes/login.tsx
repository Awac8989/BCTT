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
  Laptop,
} from "lucide-react";
import { appStore, MOCK_USERS, useAppState } from "@/services/app-state";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Cổng Đăng nhập Quản trị · Admin Cấp Sở & Cấp Phòng · SLĐTBXH Bình Dương" },
      {
        name: "description",
        content:
          "Cổng đăng nhập hệ thống quản lý hồ sơ Người có công & đánh giá dịch vụ công. Phân quyền Admin Cấp Sở và Admin Cấp Phòng.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const state = useAppState();
  const [activeRole, setActiveRole] = useState<"ADMIN_SO" | "ADMIN_PHONG">("ADMIN_SO");
  const [username, setUsername] = useState(MOCK_USERS.ADMIN_SO.email);
  const [password, setPassword] = useState("••••••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [authMethod, setAuthMethod] = useState<"PASSWORD" | "TOKEN_CA" | "OTP">("PASSWORD");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  // Chuyển đổi tab vai trò
  const handleSelectRole = (role: "ADMIN_SO" | "ADMIN_PHONG") => {
    setActiveRole(role);
    setUsername(MOCK_USERS[role].email);
    setPassword("••••••••••••");
  };

  // Xử lý đăng nhập
  const handleLogin = (roleToLogin?: "ADMIN_SO" | "ADMIN_PHONG") => {
    const targetRole = roleToLogin || activeRole;
    setLoading(true);

    setTimeout(() => {
      appStore.login(targetRole, { username, password });
      setLoading(false);
      const user = MOCK_USERS[targetRole];
      toast.success(`Đăng nhập thành công với quyền ${user.roleName}!`, {
        description: `Xin chào ${user.fullName} (${user.title})`,
      });
      navigate({ to: "/" });
    }, 450);
  };

  const currentUserConfig = MOCK_USERS[activeRole];

  return (
    <div className="min-h-screen bg-[#f4f6f9] flex flex-col justify-between selection:bg-[#dd4b39] selection:text-white font-sans">
      {/* 1. Đường viền cờ đỏ công quyền trên cùng */}
      <div className="h-[4px] w-full bg-gradient-to-r from-[#dd4b39] via-[#f39c12] to-[#dd4b39]" />

      {/* 2. Nội dung trung tâm của Cổng Đăng Nhập */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl bg-white rounded-lg border border-[#d2d6de] shadow-lg overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* CỘT TRÁI (5 phần): Nhận diện thương hiệu & Thông tin Phân quyền */}
          <div className="lg:col-span-5 bg-gradient-to-b from-[#b91c1c] via-[#991b1b] to-[#7f1d1d] p-6 text-white flex flex-col justify-between relative overflow-hidden">
            {/* Họa tiết chìm trang trọng */}
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

              {/* Quốc huy / Huy hiệu Sở LĐTBXH */}
              <div className="flex justify-center mt-5">
                <div className="size-20 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 p-1 shadow-md flex items-center justify-center">
                  <div className="size-full rounded-full bg-[#c82333] border-2 border-amber-300 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="size-10 fill-amber-300 drop-shadow-xs" aria-label="Quốc huy">
                      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Tiêu đề Cổng */}
              <div className="text-center mt-4">
                <div className="text-xs font-bold uppercase tracking-widest text-amber-300">
                  ỦY BAN NHÂN DÂN TỈNH BÌNH DƯƠNG
                </div>
                <h1 className="text-sm font-extrabold uppercase mt-1 leading-snug text-white">
                  SỞ LAO ĐỘNG - THƯƠNG BINH VÀ XÃ HỘI
                </h1>
                <div className="mt-2 text-xs font-medium text-white/90 leading-tight">
                  HỆ THỐNG QUẢN LÝ HỒ SƠ NGƯỜI CÓ CÔNG & ĐÁNH GIÁ DỊCH VỤ CÔNG
                </div>
              </div>

              {/* Thẻ mô tả quyền hạn theo tab đang chọn */}
              <div className="mt-6 rounded-md bg-white/10 p-3.5 border border-white/20 backdrop-blur-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-amber-300">
                    {activeRole === "ADMIN_SO" ? "Đặc quyền Cấp Sở" : "Đặc quyền Cấp Phòng"}
                  </span>
                  <span className="rounded bg-amber-400/20 px-2 py-0.5 text-[10px] font-bold text-amber-200 border border-amber-300/30">
                    {activeRole === "ADMIN_SO" ? "CẤP TỈNH" : "CẤP THÀNH PHỐ"}
                  </span>
                </div>
                <div className="mt-2 text-xs font-semibold text-white">
                  {currentUserConfig.unit}
                </div>
                <ul className="mt-2 space-y-1.5 text-[11px] text-white/90">
                  {currentUserConfig.permissions.slice(0, 4).map((p, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <CheckCircle2 className="size-3.5 text-amber-300 shrink-0 mt-0.5" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Dưới cột trái: thông tin bảo mật */}
            <div className="mt-6 pt-4 border-t border-white/20 text-[11px] text-white/80 flex items-center justify-between relative z-10">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-emerald-300" />
                Mã hóa đường truyền SSL/TLS
              </span>
              <span className="font-mono text-[10px]">Cơ yếu CP</span>
            </div>
          </div>

          {/* CỘT PHẢI (7 phần): Form Đăng Nhập & Chuyển Vai Trò */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-white">
            <div>
              {/* Header form */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#e5e7eb]">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Xác thực người dùng</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Đăng nhập tài khoản công vụ dành cho cán bộ quản trị
                  </p>
                </div>
                <span className="rounded bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-800 border border-blue-200">
                  Cổng Nội bộ
                </span>
              </div>

              {/* BỘ CHỌN PHÂN QUYỀN 2 CẤP ĐỘ: CẤP SỞ & CẤP PHÒNG */}
              <div className="mt-4">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  1. Chọn cấp độ quản trị:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {/* Nút chọn Cấp Sở */}
                  <button
                    type="button"
                    onClick={() => handleSelectRole("ADMIN_SO")}
                    className={`p-3 rounded-md border text-left transition-all relative ${
                      activeRole === "ADMIN_SO"
                        ? "border-[#dd4b39] bg-red-50/60 ring-2 ring-[#dd4b39]/20 shadow-xs"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-extrabold ${
                          activeRole === "ADMIN_SO" ? "text-[#dd4b39]" : "text-gray-800"
                        }`}
                      >
                        ADMIN CẤP SỞ
                      </span>
                      {activeRole === "ADMIN_SO" && (
                        <span className="size-2 rounded-full bg-[#dd4b39]" />
                      )}
                    </div>
                    <div className="text-[11px] text-gray-600 mt-1 font-medium line-clamp-1">
                      Sở LĐTBXH Bình Dương
                    </div>
                    <div className="text-[10px] text-gray-500 mt-0.5">
                      TS. Nguyễn Văn Hùng (PGĐ)
                    </div>
                  </button>

                  {/* Nút chọn Cấp Phòng */}
                  <button
                    type="button"
                    onClick={() => handleSelectRole("ADMIN_PHONG")}
                    className={`p-3 rounded-md border text-left transition-all relative ${
                      activeRole === "ADMIN_PHONG"
                        ? "border-[#0073b7] bg-blue-50/60 ring-2 ring-[#0073b7]/20 shadow-xs"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-extrabold ${
                          activeRole === "ADMIN_PHONG" ? "text-[#0073b7]" : "text-gray-800"
                        }`}
                      >
                        ADMIN CẤP PHÒNG
                      </span>
                      {activeRole === "ADMIN_PHONG" && (
                        <span className="size-2 rounded-full bg-[#0073b7]" />
                      )}
                    </div>
                    <div className="text-[11px] text-gray-600 mt-1 font-medium line-clamp-1">
                      Phòng LĐTBXH Thủ Dầu Một
                    </div>
                    <div className="text-[10px] text-gray-500 mt-0.5">
                      Nguyễn Thị Minh Thảo (Một cửa)
                    </div>
                  </button>
                </div>
              </div>

              {/* Nút ĐĂNG NHẬP NHANH 1-CLICK cho cán bộ / giám khảo trải nghiệm */}
              <div className="mt-3 p-2.5 rounded bg-amber-50/80 border border-amber-200 flex flex-wrap items-center justify-between gap-2">
                <div className="text-[11px] text-amber-900 font-medium">
                  <strong>Trải nghiệm nhanh:</strong> Đăng nhập tức thì với quyền{" "}
                  <span className="font-bold text-[#dd4b39]">
                    {activeRole === "ADMIN_SO" ? "Admin Cấp Sở" : "Admin Cấp Phòng"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleLogin(activeRole)}
                  className={`px-3 py-1 rounded text-xs font-bold text-white transition-colors shadow-xs flex items-center gap-1 ${
                    activeRole === "ADMIN_SO"
                      ? "bg-[#dd4b39] hover:bg-[#c23321]"
                      : "bg-[#0073b7] hover:bg-[#005f96]"
                  }`}
                >
                  <span>1-Click Đăng nhập {activeRole === "ADMIN_SO" ? "Cấp Sở" : "Cấp Phòng"}</span>
                  <ArrowRight className="size-3.5" />
                </button>
              </div>

              {/* FORM NHẬP THÔNG TIN TÀI KHOẢN */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLogin();
                }}
                className="mt-4 space-y-3.5"
              >
                {/* Email công vụ */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Tài khoản / Email công vụ:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      placeholder="ten.canbo@binhduong.gov.vn"
                      className="w-full rounded border border-[#d2d6de] bg-white px-3 py-2 text-xs text-gray-900 outline-none focus:border-[#dd4b39] focus:ring-1 focus:ring-[#dd4b39]"
                    />
                    <div className="absolute right-3 top-2.5 text-gray-400">
                      <UserCheck className="size-4" />
                    </div>
                  </div>
                </div>

                {/* Mật khẩu */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-gray-700">
                      Mật khẩu xác thực:
                    </label>
                    <a
                      href="#quen-mat-khau"
                      onClick={(e) => {
                        e.preventDefault();
                        toast.info("Vui lòng liên hệ Quản trị viên Trung tâm CNTT để cấp lại mật khẩu.");
                      }}
                      className="text-[11px] text-blue-600 hover:underline"
                    >
                      Quên mật khẩu?
                    </a>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full rounded border border-[#d2d6de] bg-white px-3 py-2 text-xs text-gray-900 outline-none focus:border-[#dd4b39] focus:ring-1 focus:ring-[#dd4b39]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                {/* Phương thức bảo mật bổ sung */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-1.5 cursor-pointer text-gray-700 select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-gray-300 text-[#dd4b39] focus:ring-[#dd4b39]"
                    />
                    <span>Ghi nhớ thiết bị công vụ</span>
                  </label>

                  <div className="flex items-center gap-2 text-[11px] text-gray-500">
                    <span className="flex items-center gap-1 text-emerald-600">
                      <Fingerprint className="size-3.5" />
                      Chữ ký số PKI
                    </span>
                  </div>
                </div>

                {/* Nút bấm Đăng Nhập Chính Thức */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2.5 px-4 rounded text-xs font-bold text-white transition-all shadow-xs flex items-center justify-center gap-2 ${
                      activeRole === "ADMIN_SO"
                        ? "bg-[#dd4b39] hover:bg-[#c23321]"
                        : "bg-[#0073b7] hover:bg-[#005f96]"
                    }`}
                  >
                    {loading ? (
                      <span>Đang xác thực thông tin công vụ...</span>
                    ) : (
                      <>
                        <span>
                          ĐĂNG NHẬP VỚI QUYỀN {activeRole === "ADMIN_SO" ? "ADMIN CẤP SỞ" : "ADMIN CẤP PHÒNG"}
                        </span>
                        <ArrowRight className="size-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Đường dẫn mở Cổng Công Dân Đánh Giá (Mở tab riêng) */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span>Dành cho công dân & người có công:</span>
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
            <div className="mt-6 pt-4 border-t-2 border-dashed border-gray-200 text-center">
              <div className="font-mono text-xs font-extrabold uppercase tracking-widest text-[#dd4b39] bg-red-50 py-1.5 px-3 rounded inline-block border border-red-200 shadow-2xs">
                PHIÊN BẢN 2.0 MADE BY MINHQUAN
              </div>
              <div className="text-[10px] text-gray-500 mt-1 font-medium">
                Hệ thống Quản lý Người có công & Dịch vụ công · Tỉnh Bình Dương © 2026
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Chân trang cố định chuẩn giao diện nhà nước */}
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
