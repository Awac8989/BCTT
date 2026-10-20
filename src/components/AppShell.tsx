import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Menu,
  Home,
  FileText,
  Folder,
  Users,
  Settings,
  Star,
  Tablet,
  ChevronRight,
  ChevronDown,
  User as UserIcon,
  X,
  HeartPulse,
  LogOut,
  Check,
  Shield,
  Accessibility,
  Compass,
  Bell,
  ExternalLink,
  Eye,
  Radio,
  HeartHandshake,
  GraduationCap,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { appStore, useAppState, hasDomainAccess, MOCK_USERS, type DomainCode } from "@/services/app-state";

interface NavItem {
  to: string;
  label: string;
  icon: typeof Home;
  domain?: DomainCode;
  badge?: string;
}

const PRIMARY_NAV: NavItem[] = [
  { to: "/", label: "Bảng điều khiển", icon: Home },
  { to: "/thong-tin-truyen-thong", label: "Thông tin & CĐS", icon: Radio, domain: "TT_CDS" },
  { to: "/an-sinh-xa-hoi", label: "An sinh xã hội", icon: HeartHandshake, domain: "LDTBXH_AN_SINH" },
  { to: "/giao-duc-dao-tao", label: "Giáo dục & ĐT", icon: GraduationCap, domain: "GD_DT" },
  { to: "/ho-so", label: "Quản lý hồ sơ NCC", icon: FileText, domain: "LDTBXH_NCC" },
  { to: "/tham-dinh", label: "Thẩm định hồ sơ", icon: Users, domain: "LDTBXH_NCC" },
  { to: "/chi-tra", label: "Chi trả trợ cấp", icon: FileText, domain: "LDTBXH_NCC" },
  { to: "/dieu-duong", label: "Điều dưỡng NCC", icon: HeartPulse, domain: "LDTBXH_NCC" },
  { to: "/dung-cu-chinh-hinh", label: "Dụng cụ chỉnh hình", icon: Accessibility, domain: "LDTBXH_NCC" },
  { to: "/nghia-trang", label: "Nghĩa trang liệt sĩ", icon: Compass, domain: "LDTBXH_NCC" },
  { to: "/danh-gia", label: "Đánh giá cán bộ", icon: Star },
  { to: "/phan-tich", label: "Báo cáo thống kê", icon: Folder },
  { to: "/he-thong", label: "Phân quyền & HT", icon: Settings },
];

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { currentUser } = useAppState();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isActive = (to: string) => {
    if (to === "/") return pathname === "/";
    return pathname.startsWith(to);
  };

  // Breadcrumb chuẩn theo quy trình xử lý của Cán bộ
  const getBreadcrumbs = () => {
    if (pathname === "/") return ["Bảng điều khiển"];
    if (pathname.startsWith("/thong-tin-truyen-thong")) {
      return ["Bảng điều khiển", "Thông tin, Truyền thông & CĐS", "Đài truyền thanh & Chuyển đổi số"];
    }
    if (pathname.startsWith("/an-sinh-xa-hoi")) {
      return ["Bảng điều khiển", "Lao động, NCC & An sinh XH", "Bảo trợ xã hội, Giảm nghèo & Trẻ em"];
    }
    if (pathname.startsWith("/giao-duc-dao-tao")) {
      return ["Bảng điều khiển", "Giáo dục & Đào tạo cơ sở", "Mầm non tư thục, Phổ cập & Khuyến học"];
    }
    if (pathname.startsWith("/ho-so/12029") || pathname.startsWith("/ho-so/")) {
      return ["Bảng điều khiển", "Quản lý hồ sơ", "Hồ sơ liệt sĩ"];
    }
    if (pathname.startsWith("/ho-so")) return ["Bảng điều khiển", "Quản lý hồ sơ", "Tìm kiếm hồ sơ"];
    if (pathname.startsWith("/tham-dinh")) return ["Bảng điều khiển", "Quy trình thụ lý", "Thẩm định hồ sơ"];
    if (pathname.startsWith("/chi-tra")) return ["Bảng điều khiển", "Quy trình thụ lý", "Chi trả trợ cấp & Phiếu chi"];
    if (pathname.startsWith("/dieu-duong")) return ["Bảng điều khiển", "Quy trình thụ lý", "Điều dưỡng phục hồi sức khỏe"];
    if (pathname.startsWith("/dung-cu-chinh-hinh")) return ["Bảng điều khiển", "Quy trình thụ lý", "Dụng cụ chỉnh hình & Niên hạn"];
    if (pathname.startsWith("/nghia-trang")) return ["Bảng điều khiển", "Đền ơn đáp nghĩa", "Bản đồ số Nghĩa trang Liệt sĩ GIS"];
    if (pathname.startsWith("/tra-cuu")) return ["Bảng điều khiển", "Cổng dịch vụ công", "Tra cứu hồ sơ công dân"];
    if (pathname.startsWith("/danh-gia")) return ["Bảng điều khiển", "Đánh giá cán bộ", "Xem nhận xét & Chỉ số CSAT"];
    if (pathname.startsWith("/phan-tich")) return ["Bảng điều khiển", "Báo cáo thống kê", "Phân tích số liệu điều hành"];
    if (pathname.startsWith("/he-thong")) return ["Bảng điều khiển", "Phân quyền & Hệ thống", "Cấp quyền riêng từng mảng"];
    return ["Bảng điều khiển", "Quản lý hồ sơ", "Tìm kiếm hồ sơ"];
  };

  const breadcrumbs = getBreadcrumbs();

  // Lọc menu điều hướng theo quyền truy cập mảng của tài khoản hiện tại
  const filteredNav = PRIMARY_NAV.filter((item) => {
    if (!item.domain) return true;
    return hasDomainAccess(currentUser, item.domain);
  });

  const getDomainBadge = (d: DomainCode) => {
    switch (d) {
      case "ALL":
        return { label: "Toàn quyền", cls: "bg-red-600 text-white" };
      case "TT_CDS":
        return { label: "TT & CĐS", cls: "bg-purple-100 text-purple-700 border border-purple-200" };
      case "LDTBXH_NCC":
        return { label: "Người có công", cls: "bg-rose-100 text-rose-700 border border-rose-200" };
      case "LDTBXH_AN_SINH":
        return { label: "An sinh XH", cls: "bg-emerald-100 text-emerald-700 border border-emerald-200" };
      case "GD_DT":
        return { label: "Giáo dục & ĐT", cls: "bg-amber-100 text-amber-800 border border-amber-200" };
      default:
        return { label: d, cls: "bg-gray-100 text-gray-700" };
    }
  };

  return (
    <div className="min-h-screen bg-[#ecf0f5] text-[#333333] font-sans antialiased flex flex-col">
      {/* 1. Đường viền chỉ đỏ trên cùng của Cổng chính quyền */}
      <div className="h-[3px] w-full bg-[#dd4b39] fixed top-0 left-0 z-50" />

      {/* 2. Top Header Bar (Trắng phối khối đỏ nhận diện Sở LĐTBXH Bình Dương) */}
      <header className="fixed top-[3px] left-0 right-0 z-40 h-[50px] bg-white border-b border-[#e7ebee] flex items-center shadow-xs">
        {/* Khối Thương hiệu Sở LĐTBXH Bình Dương (Nền đỏ #dd4b39) */}
        <div
          className={`h-full bg-[#dd4b39] flex items-center justify-between px-3 text-white transition-all duration-200 shrink-0 ${collapsed ? "w-[60px]" : "w-[150px] sm:w-[170px]"
            }`}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            {/* Quốc huy / Huy hiệu vàng đỏ tròn */}
            <div className="size-8 rounded-full bg-gradient-to-tr from-amber-400 via-red-500 to-amber-300 p-0.5 shadow-xs shrink-0 flex items-center justify-center">
              <div className="size-full rounded-full bg-[#c82333] border border-amber-300 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="size-4 fill-amber-300" aria-label="Quốc huy">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                </svg>
              </div>
            </div>

            {!collapsed && (
              <div className="leading-tight select-none">
                <div className="text-[10px] uppercase font-bold tracking-tight text-white/90">SLĐTBXH</div>
                <div className="text-[13px] font-extrabold tracking-tight text-white">Bình Dương</div>
              </div>
            )}
          </div>

          {/* Nút Toggle Hamburger */}
          <button
            type="button"
            onClick={() => {
              if (window.innerWidth < 1024) {
                setMobileOpen(!mobileOpen);
              } else {
                setCollapsed(!collapsed);
              }
            }}
            title="Đóng / Mở menu"
            className="p-1 hover:bg-white/15 rounded text-white transition-colors"
          >
            <Menu className="size-4" />
          </button>
        </div>

        {/* Thanh Breadcrumb & User Info */}
        <div className="flex-1 flex items-center justify-between px-4">
          {/* Breadcrumb bên trái */}
          <nav className="flex items-center gap-1.5 text-xs text-[#666666]">
            <Link to="/" className="text-[#666666] hover:text-[#dd4b39] flex items-center gap-1">
              <Home className="size-3.5" />
            </Link>
            {breadcrumbs.map((b, idx) => (
              <div key={b} className="flex items-center gap-1.5">
                <ChevronRight className="size-3 text-[#999999]" />
                <span className={idx === breadcrumbs.length - 1 ? "font-semibold text-[#333333]" : "hover:text-[#dd4b39]"}>
                  {b}
                </span>
              </div>
            ))}
          </nav>

          {/* Nhóm nút liên kết nhanh sang cổng công dân & User info */}
          <div className="flex items-center gap-2.5">
            <Link
              to="/tra-cuu"
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded text-xs font-bold shadow-xs transition-colors"
              title="Xem giao diện Cổng Tra cứu Dịch vụ công dành cho Nhân dân & Thân nhân"
            >
              <ExternalLink className="size-3 text-amber-700" />
              <span>Cổng Tra cứu Công dân</span>
            </Link>

            <Link
              to="/danh-gia"
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-300 rounded text-xs font-bold shadow-xs transition-colors"
              title="Xem sổ theo dõi nhận xét & đánh giá cán bộ từ người dân (Chế độ xem)"
            >
              <Eye className="size-3 text-sky-700" />
              <span>Xem đánh giá CB</span>
            </Link>

            {/* User info bên phải với Badge phân quyền mảng & Dropdown 1-click chuyển đổi */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 text-xs text-[#555555] hover:bg-gray-100 p-1.5 rounded-md transition-colors border border-transparent hover:border-gray-200"
                title="Nhấn để xem thông tin và chuyển đổi vai trò / mảng quản lý"
              >
                <div
                  className={`size-7 rounded-full flex items-center justify-center font-bold text-white text-[11px] shadow-2xs ${
                    currentUser.assignedDomains.includes("ALL")
                      ? "bg-[#dd4b39]"
                      : currentUser.assignedDomains.includes("TT_CDS")
                      ? "bg-purple-600"
                      : currentUser.assignedDomains.includes("GD_DT")
                      ? "bg-amber-600"
                      : "bg-[#0073b7]"
                  }`}
                >
                  {currentUser.avatarText}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-gray-800 text-xs">{currentUser.fullName}</span>
                    <span
                      className={`rounded px-1.5 py-0.2 font-mono text-[9px] font-extrabold uppercase ${
                        currentUser.assignedDomains.includes("ALL")
                          ? "bg-red-100 text-[#dd4b39] border border-red-200"
                          : "bg-blue-100 text-[#0073b7] border border-blue-200"
                      }`}
                    >
                      {currentUser.role === "ADMIN_SO"
                        ? "CẤP SỞ"
                        : currentUser.role === "ADMIN_PHONG"
                        ? "CẤP PHÒNG"
                        : "CÁN BỘ PHƯỜNG"}
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-500 font-medium truncate max-w-[190px]">
                    {currentUser.unit}
                  </div>
                </div>
                <ChevronDown className="size-3.5 text-gray-400 ml-0.5" />
              </button>

              {/* Dropdown Menu Tài khoản & Chuyển đổi 5 vai trò mảng */}
              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-50"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-1.5 w-84 bg-white rounded-md border border-[#d2d6de] shadow-xl z-50 py-2 text-xs">
                    <div className="px-3.5 py-2 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                          Tài khoản đang đăng nhập
                        </span>
                        <span
                          className={`rounded px-1.5 py-0.2 font-mono text-[9px] font-extrabold uppercase ${
                            currentUser.assignedDomains.includes("ALL")
                              ? "bg-red-100 text-[#dd4b39] border border-red-200"
                              : "bg-blue-100 text-[#0073b7] border border-blue-200"
                          }`}
                        >
                          {currentUser.role}
                        </span>
                      </div>
                      <div className="font-extrabold text-gray-900 mt-1 text-sm">{currentUser.fullName}</div>
                      <div className="text-gray-600 text-[11px] font-medium">{currentUser.title}</div>
                      <div className="text-[11px] text-gray-500 font-mono mt-0.5">{currentUser.email}</div>

                      {/* Các mảng được cấp quyền */}
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <div className="text-[10px] uppercase font-bold text-gray-400 mb-1">Mảng quyền hạn được cấp:</div>
                        <div className="flex flex-wrap gap-1">
                          {currentUser.assignedDomains.map((d) => {
                            const badge = getDomainBadge(d);
                            return (
                              <span key={d} className={`text-[10px] font-bold px-2 py-0.5 rounded ${badge.cls}`}>
                                {badge.label}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Bộ chuyển đổi nhanh 5 tài khoản mẫu đại diện các mảng */}
                    <div className="p-2.5 border-b border-gray-100 bg-gray-50/70">
                      <div className="text-[11px] font-bold text-gray-700 mb-1.5 px-1 flex items-center justify-between">
                        <span>Chuyển nhanh tài khoản công vụ:</span>
                        <span className="text-[10px] text-gray-400 font-normal">1-Click</span>
                      </div>
                      <div className="space-y-1">
                        {Object.entries(MOCK_USERS).map(([key, u]) => {
                          const isCurrent = currentUser.username === u.username;
                          return (
                            <button
                              key={key}
                              type="button"
                              onClick={() => {
                                appStore.switchUser(key);
                                toast.success(`Đã chuyển sang tài khoản: ${u.fullName} (${u.role})`);
                                setUserMenuOpen(false);
                              }}
                              className={`w-full p-2 rounded text-left border transition-all flex items-center justify-between ${
                                isCurrent
                                  ? "bg-red-50 border-[#dd4b39] text-[#dd4b39] font-bold shadow-2xs"
                                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              <div className="min-w-0 pr-2">
                                <div className="text-xs font-bold truncate">{u.fullName}</div>
                                <div className="text-[10px] text-gray-500 font-normal truncate">{u.title}</div>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                {u.assignedDomains.slice(0, 2).map((d) => (
                                  <span key={d} className="text-[9px] px-1 py-0.2 rounded bg-gray-100 font-mono text-gray-600">
                                    {d}
                                  </span>
                                ))}
                                {isCurrent && <Check className="size-3.5 text-[#dd4b39] ml-1" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Điều hướng nhanh sang Phân quyền */}
                    <div className="px-2 pt-1.5 pb-1 border-b border-gray-100">
                      <Link
                        to="/he-thong"
                        onClick={() => setUserMenuOpen(false)}
                        className="w-full flex items-center justify-between px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded font-semibold text-xs transition-colors"
                      >
                        <span className="flex items-center gap-1.5">
                          <Shield className="size-3.5 text-amber-600" />
                          <span>Quản trị & Cấp quyền riêng từng mảng</span>
                        </span>
                        <ChevronRight className="size-3.5 text-amber-600" />
                      </Link>
                    </div>

                    {/* Nút Đăng xuất */}
                    <div className="p-1 pt-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          appStore.logout();
                          toast.info("Đã đăng xuất khỏi hệ thống.");
                          setUserMenuOpen(false);
                          navigate({ to: "/login" });
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded transition-colors text-left font-bold"
                      >
                        <LogOut className="size-4" />
                        <span>Đăng xuất về Cổng Đăng Nhập</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex pt-[53px]">
        {/* 3. Left Sidebar (Nền Slate tối #222d32 chuẩn phong cách ảnh mẫu) */}
        <aside
          className={`hidden lg:flex flex-col bg-[#222d32] border-r border-[#1a2226] fixed top-[53px] bottom-0 left-0 z-30 transition-all duration-200 select-none ${collapsed ? "w-[60px]" : "w-[150px] sm:w-[170px]"
            }`}
        >
          <nav className="flex-1 py-2 overflow-y-auto">
            {filteredNav.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex flex-col items-center justify-center py-3.5 px-2 text-center transition-colors border-l-3 ${active
                      ? "bg-[#1e282c] border-[#dd4b39] text-white font-medium"
                      : "border-transparent text-[#b8c7ce] hover:bg-[#1e282c] hover:text-white"
                    }`}
                >
                  <Icon className={`size-6 mb-1 ${active ? "text-white" : "text-[#b8c7ce]"}`} />
                  {!collapsed && <span className="text-[12px] leading-snug">{item.label}</span>}
                </Link>
              );
            })}

            {/* Cổng Công dân quét QR (Mô phỏng độc lập khi người dân quét trên điện thoại) */}
            <div className="my-2 border-t border-[#1a2226]/80 pt-2">
              <a
                href="/khao-sat?maHoSo=BD/NCC-12029&kenh=QR_PHIEU_HEN"
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center justify-center py-2.5 px-2 text-center transition-colors border-l-3 border-transparent text-[#00c0ef] hover:bg-[#1e282c] hover:text-white group"
                title="Mở tab mới: Mô phỏng Cổng đánh giá dành riêng cho người dân quét mã QR trên giấy hẹn"
              >
                <Tablet className="size-4 mb-0.5 group-hover:scale-110 transition-transform" />
                {!collapsed && <span className="text-[11px] leading-tight font-medium">Mô phỏng Dân (QR) ↗</span>}
              </a>
            </div>

            {/* Dòng thương hiệu Phiên bản 2.0 Made by MINHQUAN */}
            <div className="mt-auto border-t border-[#1a2226] p-2 text-center select-none bg-[#1a2226]/60">
              {!collapsed ? (
                <div>
                  <div className="font-mono text-[9px] font-bold text-white/50 uppercase">
                    PHIÊN BẢN 2.0
                  </div>
                  <div className="font-mono text-[10px] font-extrabold text-amber-400 mt-0.5">
                    MADE BY MINHQUAN
                  </div>
                </div>
              ) : (
                <span className="font-mono text-[9px] text-amber-400 font-bold" title="Phiên bản 2.0 Made by MINHQUAN">
                  v2.0
                </span>
              )}
            </div>
          </nav>
        </aside>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              aria-label="Đóng menu"
              className="absolute inset-0 bg-black/50"
              onClick={() => setMobileOpen(false)}
            />
            <aside className="absolute inset-y-0 left-0 w-[170px] bg-[#222d32] shadow-2xl flex flex-col z-10">
              <div className="h-[50px] bg-[#dd4b39] flex items-center justify-between px-3 text-white">
                <span className="text-xs font-bold uppercase">Menu Quản lý</span>
                <button
                  type="button"
                  aria-label="Đóng menu"
                  onClick={() => setMobileOpen(false)}
                  className="p-1 hover:bg-white/20 rounded"
                >
                  <X className="size-4" />
                </button>
              </div>
              <nav className="flex-1 py-2 overflow-y-auto flex flex-col justify-between">
                <div>
                  {filteredNav.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.to);
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setMobileOpen(false)}
                        className={`flex flex-col items-center justify-center py-3 px-2 text-center transition-colors border-l-3 ${active
                            ? "bg-[#1e282c] border-[#dd4b39] text-white font-medium"
                            : "border-transparent text-[#b8c7ce] hover:bg-[#1e282c] hover:text-white"
                          }`}
                      >
                        <Icon className={`size-6 mb-1 ${active ? "text-white" : "text-[#b8c7ce]"}`} />
                        <span className="text-[12px] leading-snug">{item.label}</span>
                      </Link>
                    );
                  })}

                  <div className="my-2 border-t border-[#1a2226]/80 pt-2">
                    <a
                      href="/khao-sat?maHoSo=BD/NCC-12029&kenh=QR_PHIEU_HEN"
                      target="_blank"
                      rel="noreferrer"
                      className="flex flex-col items-center justify-center py-2.5 px-2 text-center text-[#00c0ef] hover:text-white"
                      title="Mô phỏng Cổng đánh giá dành riêng cho người dân"
                    >
                      <Tablet className="size-5 mb-1" />
                      <span className="text-[11px]">Mô phỏng Dân (QR) ↗</span>
                    </a>
                  </div>
                </div>

                {/* Mobile branding */}
                <div className="p-2 border-t border-[#1a2226] text-center bg-[#1a2226]/60">
                  <div className="font-mono text-[9px] font-bold text-white/50">PHIÊN BẢN 2.0</div>
                  <div className="font-mono text-[10px] font-bold text-amber-400">MADE BY MINHQUAN</div>
                </div>
              </nav>
            </aside>
          </div>
        )}

        {/* 4. Nội dung chính (Main Content) */}
        <main
          className={`flex-1 p-4 sm:p-5 transition-all duration-200 flex flex-col justify-between ${collapsed ? "lg:ml-[60px]" : "lg:ml-[150px] sm:lg:ml-[170px]"
            }`}
        >
          <div>{children}</div>

          {/* Footer thông tin cơ quan & Chữ ký phiên bản 2.0 Made by MINHQUAN */}
          <footer className="mt-8 pt-4 border-t border-[#d2d6de] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#00a65a]" />
              <span>Hệ thống Quản lý Hồ sơ Người có công & Đánh giá Dịch vụ công · Sở LĐTBXH Bình Dương</span>
            </div>
            <div className="font-mono text-[11px] font-extrabold text-[#dd4b39] bg-white px-2.5 py-1 rounded border border-gray-200 shadow-2xs">
              PHIÊN BẢN 2.0 MADE BY MINHQUAN
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  right,
}: {
  eyebrow?: string;
  title: string;
  right?: ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3 border-b border-[#d2d6de] pb-3">
      <div>
        {eyebrow && <div className="text-xs font-bold uppercase text-[#dd4b39] tracking-wide mb-1">{eyebrow}</div>}
        <h1 className="text-xl sm:text-2xl font-bold text-[#333333]">{title}</h1>
      </div>
      {right && <div className="flex items-center gap-2">{right}</div>}
    </div>
  );
}

export function StatusBadge({ trangThai }: { trangThai: string }) {
  const map: Record<string, { cls: string; label: string }> = {
    MỚI_TIẾP_NHẬN: { cls: "bg-[#e0f2fe] text-[#0284c7] border-[#bae6fd]", label: "Mới tiếp nhận" },
    ĐANG_THẨM_ĐỊNH: { cls: "bg-[#fef3c7] text-[#d97706] border-[#fde68a]", label: "Đang thẩm định" },
    CHỜ_PHÊ_DUYỆT: { cls: "bg-[#fee2e2] text-[#dc2626] border-[#fecaca]", label: "Chờ phê duyệt" },
    ĐÃ_DUYỆT: { cls: "bg-[#dcfce7] text-[#16a34a] border-[#bbf7d0]", label: "Đã duyệt" },
    YÊU_CẦU_BỔ_SUNG: { cls: "bg-[#fef9c3] text-[#ca8a04] border-[#fef08a]", label: "Yêu cầu bổ sung" },
    TỪ_CHỐI: { cls: "bg-[#fef2f2] text-[#ef4444] border-[#fecaca]", label: "Từ chối" },
  };

  const item = map[trangThai] ?? { cls: "bg-gray-100 text-gray-700 border-gray-300", label: trangThai };

  return (
    <span className={`inline-flex items-center rounded-[3px] px-2 py-0.5 text-xs font-semibold border ${item.cls}`}>
      {item.label}
    </span>
  );
}
