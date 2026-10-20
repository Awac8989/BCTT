import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Calculator,
  Cpu,
  Database,
  Sparkles,
  Server,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Users,
  ShieldCheck,
  KeyRound,
  Plus,
  Edit3,
  Trash2,
  Check,
  X,
  UserCheck,
  Radio,
  HeartHandshake,
  GraduationCap,
  Briefcase,
  Sliders,
  FileText,
} from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { formatVND, MUC_CHUAN, PHUONG_LIST } from "@/data/mock";
import { calculateAllowance } from "@/services/calculator.service";
import { analyzeSentiment } from "@/services/sentiment.service";
import { useAppState, appStore, type CurrentUser } from "@/services/app-state";
import { type DomainCode, DOMAIN_METAS } from "@/data/domain-mock";

export const Route = createFileRoute("/he-thong")({
  head: () => ({
    meta: [
      { title: "Quản lý Tài khoản, Phân quyền Đa Mảng & Tham số Hệ thống · SLĐTBXH Bình Dương" },
      {
        name: "description",
        content:
          "Cấu hình tài khoản người dùng, cấp quyền riêng từng mảng (Thông tin & CĐS, Người có công, An sinh xã hội, Giáo dục đào tạo), kiểm thử Engine và nhật ký hệ thống.",
      },
    ],
  }),
  component: HeThong,
});

const HE_SO = [
  { loai: "Mẹ VNAH (×3.0 + Chăm sóc ×1.0)", heSo: 3.0 },
  { loai: "Thương binh ≥ 81% (×3.85)", heSo: 3.85 },
  { loai: "Thương binh 61–80% (×2.63)", heSo: 2.63 },
  { loai: "Thương binh 41–60% (×1.82)", heSo: 1.82 },
  { loai: "Thương binh 21–40% (×1.15)", heSo: 1.15 },
  { loai: "Bệnh binh ≥ 81% (×3.10)", heSo: 3.1 },
  { loai: "Thân nhân liệt sĩ (×1.0)", heSo: 1.0 },
  { loai: "Cán bộ tiền khởi nghĩa (×1.45)", heSo: 1.45 },
];

function HeThong() {
  const { currentUser, usersList, auditLogs } = useAppState();

  const [activeTab, setActiveTab] = useState<"USERS_RBAC" | "ENGINE_STUDIO" | "DANH_MUC_LOGS">("USERS_RBAC");

  // State cho Modal Phân quyền người dùng
  const [editingUser, setEditingUser] = useState<CurrentUser | null>(null);
  const [selectedDomains, setSelectedDomains] = useState<DomainCode[]>([]);

  // State cho Modal Thêm người dùng mới
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newFullName, setNewFullName] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDepartment, setNewDepartment] = useState("UBND Phường Phú Cường");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newRole, setNewRole] = useState("CAN_BO_PHU_TRACH");
  const [newAssignedDomains, setNewAssignedDomains] = useState<DomainCode[]>(["TT_CDS"]);

  // State cho Testing Studio 1: Engine tính trợ cấp
  const [testMaDt, setTestMaDt] = useState("THUONG_BINH");
  const [testTyLe, setTestTyLe] = useState(81);
  const [testCaregiver, setTestCaregiver] = useState(true);

  const testCalcResult = calculateAllowance({
    maLoaiDt: testMaDt,
    tyLeThuongTat: testTyLe,
    coNguoiChamSoc: testCaregiver,
  });

  // State cho Testing Studio 2: Bộ phân tích Sentiment
  const [testText, setTestText] = useState("Thủ tục quá chậm trễ, cán bộ tiếp dân thái độ phiền hà");
  const testSentimentResult = analyzeSentiment(testText);

  // Mở modal phân quyền
  const handleOpenEditDomains = (user: CurrentUser) => {
    setEditingUser(user);
    setSelectedDomains([...user.assignedDomains]);
  };

  // Toggle domain trong modal
  const handleToggleDomain = (code: DomainCode) => {
    if (code === "ALL") {
      if (selectedDomains.includes("ALL")) {
        setSelectedDomains([]);
      } else {
        setSelectedDomains(["ALL", "TT_CDS", "LDTBXH_NCC", "LDTBXH_AN_SINH", "GD_DT"]);
      }
      return;
    }

    if (selectedDomains.includes(code)) {
      setSelectedDomains(selectedDomains.filter((d) => d !== code && d !== "ALL"));
    } else {
      setSelectedDomains([...selectedDomains, code]);
    }
  };

  // Lưu phân quyền mảng
  const handleSaveUserDomains = () => {
    if (!editingUser) return;
    appStore.updateUserDomains(editingUser.id, selectedDomains);
    toast.success(`Đã cập nhật phân quyền mảng cho ${editingUser.fullName}!`, {
      description: `Mảng được cấp: [${selectedDomains.join(", ")}]`,
    });
    setEditingUser(null);
  };

  // Thêm tài khoản mới
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName.trim() || !newEmail.trim()) {
      toast.error("Vui lòng điền đủ họ tên và email công vụ!");
      return;
    }

    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const newId = `USR-CB-${randomSuffix}`;
    const initials = newFullName
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(-3)
      .toUpperCase();

    const newUser: CurrentUser = {
      id: newId,
      username: newEmail.split("@")[0] || `user.${randomSuffix}`,
      fullName: newFullName.trim(),
      role: newRole,
      roleName: newTitle || "Cán bộ Phụ trách Mảng",
      title: newTitle || "Chuyên viên thụ lý",
      department: newDepartment,
      unit: "Ủy ban nhân dân Phường Phú Cường",
      email: newEmail.trim(),
      phone: newPhone || "0274.3822.xxx",
      avatarText: initials || "CB",
      permissions: [
        "Thụ lý hồ sơ và quản lý nghiệp vụ theo các mảng được cấp quyền",
        "Tra cứu dữ liệu và xuất báo cáo nghiệp vụ",
      ],
      assignedDomains: newAssignedDomains,
      isActive: true,
    };

    appStore.addUser(newUser);
    toast.success(`Đã tạo tài khoản cán bộ mới thành công!`, {
      description: `${newUser.fullName} · Quyền: [${newUser.assignedDomains.join(", ")}]`,
    });
    setShowAddUserModal(false);
    setNewFullName("");
    setNewEmail("");
    setNewTitle("");
  };

  const handleResetData = () => {
    if (confirm("Bạn có chắc chắn muốn khôi phục toàn bộ dữ liệu mẫu ban đầu không?")) {
      appStore.resetToDefault();
      toast.success("Đã khôi phục dữ liệu ban đầu!");
    }
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Phân hệ 5 · Quản trị Hệ thống, Tài khoản & Phân quyền Đa Mảng"
        title="Quản trị tài khoản & Cấp quyền từng mảng"
        right={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddUserModal(true)}
              className="flex items-center gap-1.5 rounded-md bg-[#dd4b39] hover:bg-[#c23321] px-3 py-1.5 text-xs font-bold text-white shadow-xs transition-colors"
            >
              <Plus className="size-3.5" />
              Thêm tài khoản cán bộ
            </button>
            <button
              onClick={handleResetData}
              className="flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 transition-all font-medium"
            >
              <RefreshCw className="size-3.5 text-gray-500" />
              Khôi phục mẫu
            </button>
          </div>
        }
      />

      {/* Tabs chọn khu vực quản trị */}
      <div className="mb-4 flex flex-wrap border-b border-gray-200 bg-white rounded-t-md px-3 pt-2 gap-2 text-xs">
        <button
          onClick={() => setActiveTab("USERS_RBAC")}
          className={`pb-2.5 px-3 font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === "USERS_RBAC"
              ? "border-[#dd4b39] text-[#dd4b39]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <ShieldCheck className="size-4" />
          <span>1. Quản lý Tài khoản &amp; Cấp quyền riêng từng mảng (Multi-Domain RBAC)</span>
        </button>

        <button
          onClick={() => setActiveTab("ENGINE_STUDIO")}
          className={`pb-2.5 px-3 font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === "ENGINE_STUDIO"
              ? "border-[#dd4b39] text-[#dd4b39]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Cpu className="size-4" />
          <span>2. Kiến trúc Dịch vụ &amp; Engine Studio</span>
        </button>

        <button
          onClick={() => setActiveTab("DANH_MUC_LOGS")}
          className={`pb-2.5 px-3 font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === "DANH_MUC_LOGS"
              ? "border-[#dd4b39] text-[#dd4b39]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Sliders className="size-4" />
          <span>3. Tham số Danh mục &amp; Audit Logs</span>
        </button>
      </div>

      {/* TAB 1: QUẢN LÝ TÀI KHOẢN VÀ CẤP QUYỀN RIÊNG TỪNG MẢNG */}
      {activeTab === "USERS_RBAC" && (
        <div className="space-y-4">
          {/* Card giới thiệu cơ chế phân quyền đa mảng */}
          <div className="bg-gradient-to-r from-red-50 via-white to-sky-50 rounded-md border border-gray-200 p-4 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-5 text-[#dd4b39]" />
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    Cơ chế Cấp quyền &amp; Phân nhiệm Tài khoản theo Mảng nghiệp vụ (Multi-Domain RBAC)
                  </h3>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Mỗi cán bộ công chức được phân quyền phụ trách một hoặc nhiều mảng riêng biệt. Menu thanh điều hướng
                    và dữ liệu hiển thị sẽ tự động giới hạn chính xác theo các mảng được cấp quyền.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <span className="font-bold text-gray-700">Tài khoản hiện tại:</span>
                <span className="px-2 py-0.5 rounded bg-[#dd4b39] text-white font-bold text-[11px]">
                  {currentUser.fullName} ({currentUser.roleName})
                </span>
              </div>
            </div>

            {/* Badges các mảng */}
            <div className="mt-3 pt-3 border-t border-gray-200/80 flex flex-wrap gap-2 text-xs">
              <span className="text-[11px] font-bold text-gray-500 py-1">Các mảng trong hệ thống:</span>
              <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-200 font-bold text-[11px] flex items-center gap-1">
                <Radio className="size-3" /> Mảng 1: Thông tin, Truyền thông &amp; Chuyển đổi số (TT_CDS)
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200 font-bold text-[11px] flex items-center gap-1">
                <HeartHandshake className="size-3" /> Mảng 2: Lao động, Việc làm &amp; An sinh xã hội (LDTBXH_AN_SINH)
              </span>
              <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200 font-bold text-[11px] flex items-center gap-1">
                <FileText className="size-3" /> Mảng Người có công &amp; Đền ơn đáp nghĩa (LDTBXH_NCC)
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-[11px] flex items-center gap-1">
                <GraduationCap className="size-3" /> Mảng 3: Giáo dục và Đào tạo cơ sở (GD_DT)
              </span>
            </div>
          </div>

          {/* Bảng Danh sách Tài khoản Cán bộ & Phân quyền */}
          <div className="bg-white rounded-md border border-gray-200 p-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Users className="size-4 text-[#dd4b39]" />
                <h3 className="text-sm font-bold text-gray-900">
                  Danh sách Cán bộ Công chức &amp; Phân quyền Phụ trách từng Mảng
                </h3>
              </div>
              <span className="text-xs text-gray-500 font-medium">Tổng số: {usersList.length} tài khoản công vụ</span>
            </div>

            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 border-b border-gray-200 font-bold">
                    <th className="py-2.5 px-3">Cán bộ / Email công vụ</th>
                    <th className="py-2.5 px-3">Chức vụ &amp; Phòng ban</th>
                    <th className="py-2.5 px-3">Cấp / Vai trò</th>
                    <th className="py-2.5 px-3">Các mảng được cấp quyền</th>
                    <th className="py-2.5 px-3 text-center">Thao tác cấp quyền</th>
                    <th className="py-2.5 px-3 text-right">Trải nghiệm vai trò</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {usersList.map((user) => {
                    const isCurrent = currentUser.id === user.id;
                    return (
                      <tr key={user.id} className={`hover:bg-gray-50/80 transition-colors ${isCurrent ? "bg-amber-50/40" : ""}`}>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            <div className="size-7 rounded-full bg-[#0073b7] text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                              {user.avatarText}
                            </div>
                            <div>
                              <div className="font-bold text-gray-900 flex items-center gap-1.5">
                                <span>{user.fullName}</span>
                                {isCurrent && (
                                  <span className="rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.2">
                                    Đang đăng nhập
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-gray-500 font-mono">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="font-semibold text-gray-800">{user.title}</div>
                          <div className="text-[10px] text-gray-500">{user.department}</div>
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`rounded px-2 py-0.5 text-[10px] font-bold border ${
                              user.role === "ADMIN_SO"
                                ? "bg-red-50 text-red-800 border-red-300"
                                : user.role === "ADMIN_PHONG"
                                ? "bg-blue-50 text-blue-800 border-blue-300"
                                : "bg-gray-100 text-gray-700 border-gray-300"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex flex-wrap gap-1">
                            {user.assignedDomains.includes("ALL") ? (
                              <span className="rounded bg-red-100 text-red-800 border border-red-200 px-1.5 py-0.5 text-[10px] font-bold">
                                Toàn quyền mọi mảng
                              </span>
                            ) : (
                              user.assignedDomains.map((dom) => {
                                const meta = DOMAIN_METAS[dom];
                                return (
                                  <span
                                    key={dom}
                                    className={`rounded px-1.5 py-0.5 text-[10px] font-bold border ${
                                      meta ? meta.badgeClass : "bg-gray-100 text-gray-700"
                                    }`}
                                  >
                                    {meta ? meta.shortName : dom}
                                  </span>
                                );
                              })
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => handleOpenEditDomains(user)}
                            className="px-2.5 py-1 rounded border border-gray-300 hover:border-[#dd4b39] hover:bg-red-50 hover:text-[#dd4b39] text-gray-700 font-bold text-xs inline-flex items-center gap-1 transition-colors"
                          >
                            <KeyRound className="size-3" />
                            <span>Cấp quyền</span>
                          </button>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => {
                              appStore.switchUser(user.id);
                              toast.success(`Đã chuyển phiên làm việc sang tài khoản ${user.fullName}!`, {
                                description: `Quyền mảng: [${user.assignedDomains.join(", ")}]`,
                              });
                            }}
                            disabled={isCurrent}
                            className={`px-2.5 py-1 rounded text-xs font-bold transition-colors inline-flex items-center gap-1 shadow-2xs ${
                              isCurrent
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-[#0073b7] hover:bg-[#005f96] text-white"
                            }`}
                          >
                            <UserCheck className="size-3" />
                            <span>1-Click Switch</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: KIẾN TRÚC DỊCH VỤ & ENGINE STUDIO */}
      {activeTab === "ENGINE_STUDIO" && (
        <div className="space-y-4">
          {/* Trạng thái Cụm Dịch vụ */}
          <div className="bg-white rounded-md border border-gray-200 p-4 shadow-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Layers className="size-4 text-[#dd4b39]" />
                <span className="font-bold text-gray-900 text-sm">
                  Trạng thái Cụm Dịch vụ Liên thông (Hybrid Architecture Status)
                </span>
              </div>
              <span className="flex items-center gap-1 font-mono text-xs text-emerald-600 font-bold">
                <CheckCircle2 className="size-3.5" /> Tất cả dịch vụ hoạt động bình thường
              </span>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-xs">
              <div className="rounded-lg border bg-gray-50/70 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900 flex items-center gap-1.5">
                    <Server className="size-3.5 text-[#dd4b39]" /> Node.js Gateway
                  </span>
                  <span className="font-mono text-emerald-600 font-bold">ONLINE</span>
                </div>
                <p className="mt-1 text-gray-500 text-[11px]">JWT Auth, Profile CRUD &amp; CSAT</p>
                <div className="mt-2 font-mono text-[10px] text-gray-400">Port: 8080 · Express.js</div>
              </div>

              <div className="rounded-lg border bg-gray-50/70 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900 flex items-center gap-1.5">
                    <Cpu className="size-3.5 text-amber-600" /> Spring Boot Core
                  </span>
                  <span className="font-mono text-emerald-600 font-bold">ONLINE</span>
                </div>
                <p className="mt-1 text-gray-500 text-[11px]">Allowance BigDecimal Engine</p>
                <div className="mt-2 font-mono text-[10px] text-gray-400">Port: 8081 · Java 21</div>
              </div>

              <div className="rounded-lg border bg-gray-50/70 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900 flex items-center gap-1.5">
                    <Database className="size-3.5 text-[#0073b7]" /> MySQL 8.0 Cluster
                  </span>
                  <span className="font-mono text-emerald-600 font-bold">CONNECTED</span>
                </div>
                <p className="mt-1 text-gray-500 text-[11px]">18 Tables · InnoDB 3NF · UTF8MB4</p>
                <div className="mt-2 font-mono text-[10px] text-gray-400">Lat: 1.2ms · Index OK</div>
              </div>

              <div className="rounded-lg border bg-gray-50/70 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900 flex items-center gap-1.5">
                    <Sparkles className="size-3.5 text-amber-600" /> Trục liên thông LGSP
                  </span>
                  <span className="font-mono text-emerald-600 font-bold">SYNCED</span>
                </div>
                <p className="mt-1 text-gray-500 text-[11px]">OAuth2 / mTLS TP. Thủ Dầu Một</p>
                <div className="mt-2 font-mono text-[10px] text-gray-400">Status: 200 OK</div>
              </div>
            </div>
          </div>

          {/* Testing Studios */}
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Studio 1 */}
            <div className="bg-white rounded-md border border-gray-200 p-4 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Calculator className="size-4 text-amber-600" />
                  <span className="font-bold text-gray-900 text-sm">
                    Kiểm thử Engine Tính Trợ cấp (Nghị định 75/2021)
                  </span>
                </div>
                <span className="rounded bg-amber-50 text-amber-800 text-[10px] font-bold px-2 py-0.5 border border-amber-200">
                  BigDecimal Engine
                </span>
              </div>

              <div className="mt-3 space-y-3 text-xs">
                <div className="grid gap-2 sm:grid-cols-2">
                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Loại đối tượng</label>
                    <select
                      value={testMaDt}
                      onChange={(e) => setTestMaDt(e.target.value)}
                      className="w-full rounded border border-gray-300 p-2 text-xs outline-none"
                    >
                      <option value="THUONG_BINH">Thương binh</option>
                      <option value="BENH_BINH">Bệnh binh</option>
                      <option value="ME_VNAH">Mẹ VNAH</option>
                      <option value="LIET_SI">Thân nhân Liệt sĩ</option>
                      <option value="CHAT_DOC_HOA_HOC">Nhiễm CĐHH</option>
                      <option value="TIEN_KHOI_NGHIA">Cán bộ tiền khởi nghĩa</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Tỷ lệ thương tật: {testTyLe}%</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={testTyLe}
                      onChange={(e) => setTestTyLe(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="testCare"
                    checked={testCaregiver}
                    onChange={(e) => setTestCaregiver(e.target.checked)}
                    className="size-3.5"
                  />
                  <label htmlFor="testCare" className="cursor-pointer text-gray-700 font-medium">
                    Có người phục vụ (chăm sóc)
                  </label>
                </div>

                <div className="rounded-lg border bg-gray-50 p-3 space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Mức chuẩn (base):</span>
                    <span className="text-gray-800">{formatVND(testCalcResult.baseRate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Hệ số áp dụng:</span>
                    <span className="text-amber-600 font-bold">×{testCalcResult.heSo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Trợ cấp hàng tháng:</span>
                    <span className="text-gray-800">{formatVND(testCalcResult.troCapHangThang)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-1.5 font-bold text-sm">
                    <span className="text-amber-600">Tổng thực nhận:</span>
                    <span className="text-amber-600">{formatVND(testCalcResult.tongTienThucNhan)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Studio 2 */}
            <div className="bg-white rounded-md border border-gray-200 p-4 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-[#dd4b39]" />
                  <span className="font-bold text-gray-900 text-sm">
                    Kiểm thử Bộ Phân tích Cảm xúc CSAT (Sentiment Engine)
                  </span>
                </div>
                <span className="rounded bg-sky-50 text-sky-800 text-[10px] font-bold px-2 py-0.5 border border-sky-200">
                  Node.js NLP
                </span>
              </div>

              <div className="mt-3 space-y-3 text-xs">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Nhập phản hồi thử nghiệm:</label>
                  <textarea
                    value={testText}
                    onChange={(e) => setTestText(e.target.value)}
                    rows={3}
                    className="w-full rounded border border-gray-300 p-2 text-xs outline-none"
                  />
                </div>

                <div className="flex flex-wrap gap-1 text-[10px]">
                  <button
                    type="button"
                    onClick={() => setTestText("Cán bộ Nguyễn Văn An rất nhiệt tình, chu đáo và hỗ trợ nhanh")}
                    className="rounded border border-gray-200 bg-gray-50 px-2 py-0.5 text-gray-600 hover:bg-gray-100"
                  >
                    Mẫu tích cực
                  </button>
                  <button
                    type="button"
                    onClick={() => setTestText("Phải chờ lâu hơn 1 giờ, thủ tục chậm trễ và phiền hà")}
                    className="rounded border border-gray-200 bg-gray-50 px-2 py-0.5 text-gray-600 hover:bg-gray-100"
                  >
                    Mẫu tiêu cực
                  </button>
                </div>

                <div className="rounded-lg border bg-gray-50 p-3 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Phân loại cảm xúc:</span>
                    <span
                      className={`rounded px-2 py-0.5 font-bold text-[11px] ${
                        testSentimentResult.sentiment === "POSITIVE"
                          ? "bg-emerald-100 text-emerald-800"
                          : testSentimentResult.sentiment === "NEGATIVE"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {testSentimentResult.sentiment} ({testSentimentResult.label})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: THAM SỐ DANH MỤC & AUDIT LOGS */}
      {activeTab === "DANH_MUC_LOGS" && (
        <div className="space-y-4">
          <div className="grid gap-3 lg:grid-cols-3">
            <div className="bg-white rounded-md border border-gray-200 p-4 shadow-xs">
              <div className="text-xs font-bold text-gray-500 uppercase">Mức chuẩn trợ cấp ưu đãi</div>
              <div className="text-3xl font-extrabold text-[#dd4b39] mt-2">
                {formatVND(MUC_CHUAN)}
              </div>
              <p className="mt-2 text-[12px] text-gray-600">
                Áp dụng theo Nghị định 75/2021/NĐ-CP và các văn bản điều chỉnh của Chính phủ.
              </p>
            </div>

            <div className="bg-white rounded-md border border-gray-200 p-4 shadow-xs lg:col-span-2">
              <div className="text-xs font-bold text-gray-500 uppercase">Hệ số theo nhóm đối tượng Người có công</div>
              <div className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                {HE_SO.map((h) => (
                  <div key={h.loai} className="flex items-center justify-between border-b pb-1.5 text-xs">
                    <span className="text-gray-800">{h.loai}</span>
                    <span className="font-mono font-bold text-[#dd4b39]">×{h.heSo.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-3 lg:grid-cols-3">
            <div className="bg-white rounded-md border border-gray-200 p-4 shadow-xs">
              <div className="text-xs font-bold text-gray-500 uppercase">Danh mục 14 Phường / Xã (Thủ Dầu Một)</div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {PHUONG_LIST.map((p) => (
                  <span key={p} className="rounded border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-800">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-md border border-gray-200 p-4 shadow-xs lg:col-span-2">
              <div className="text-xs font-bold text-gray-500 uppercase">Audit Logs &amp; Giám sát Giao dịch Hệ thống</div>
              <div className="mt-3 space-y-2 max-h-80 overflow-y-auto pr-1">
                {auditLogs.map((l) => (
                  <div key={l.id} className="rounded border border-gray-100 bg-gray-50 p-2.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-gray-400">{l.timestamp}</span>
                      <span
                        className={`rounded px-1.5 py-0.2 font-mono text-[9px] font-bold ${
                          l.status === "SUCCESS"
                            ? "bg-emerald-100 text-emerald-800"
                            : l.status === "WARNING"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {l.status}
                      </span>
                    </div>
                    <div className="mt-1 font-bold text-gray-900">{l.action}</div>
                    <div className="text-gray-600 text-[11px] mt-0.5">{l.details}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CẤP QUYỀN MẢNG CHO TỪNG TÀI KHOẢN (PERMISSION MODAL) */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full border border-gray-300 overflow-hidden">
            <div className="bg-[#dd4b39] text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="size-4" />
                <h3 className="font-bold text-sm">Cấp quyền Mảng Nghiệp vụ cho Tài khoản</h3>
              </div>
              <button onClick={() => setEditingUser(null)} className="text-white/80 hover:text-white">
                <X className="size-4" />
              </button>
            </div>

            <div className="p-4 space-y-4 text-xs">
              <div className="p-3 rounded bg-gray-50 border border-gray-200">
                <div className="font-bold text-gray-900 text-sm">{editingUser.fullName}</div>
                <div className="text-gray-600 text-[11px]">{editingUser.title} · {editingUser.unit}</div>
                <div className="text-gray-400 font-mono text-[10px] mt-0.5">{editingUser.email}</div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Chọn các mảng nghiệp vụ cấp quyền cho cán bộ này:
                </label>

                <div className="space-y-2">
                  {/* Toàn quyền */}
                  <label className="flex items-start gap-2.5 p-2 rounded border border-red-200 bg-red-50/60 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedDomains.includes("ALL")}
                      onChange={() => handleToggleDomain("ALL")}
                      className="size-4 rounded text-red-600 mt-0.5"
                    />
                    <div>
                      <div className="font-bold text-red-900">TOÀN QUYỀN HỆ THỐNG (Super Admin)</div>
                      <div className="text-[11px] text-red-800/80">
                        Toàn quyền xem, sửa, phê duyệt tất cả các mảng nghiệp vụ trong toàn tỉnh/phường.
                      </div>
                    </div>
                  </label>

                  {/* Mảng 1: Thông tin, Truyền thông & CĐS */}
                  <label className="flex items-start gap-2.5 p-2 rounded border border-sky-200 bg-sky-50/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedDomains.includes("TT_CDS") || selectedDomains.includes("ALL")}
                      disabled={selectedDomains.includes("ALL")}
                      onChange={() => handleToggleDomain("TT_CDS")}
                      className="size-4 rounded text-sky-600 mt-0.5"
                    />
                    <div>
                      <div className="font-bold text-sky-900 flex items-center gap-1.5">
                        <Radio className="size-3.5 text-sky-700" />
                        <span>Mảng Thông tin, Truyền thông và Chuyển đổi số cơ sở</span>
                      </div>
                      <div className="text-[11px] text-gray-600 mt-0.5">
                        Đài truyền thanh thông minh, bảng tin điện tử LED, cổ động trực quan, cổng TTĐT, đại lý Internet, Tổ công nghệ số cộng đồng.
                      </div>
                    </div>
                  </label>

                  {/* Mảng 2: Lao động & An sinh xã hội */}
                  <label className="flex items-start gap-2.5 p-2 rounded border border-amber-200 bg-amber-50/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedDomains.includes("LDTBXH_AN_SINH") || selectedDomains.includes("ALL")}
                      disabled={selectedDomains.includes("ALL")}
                      onChange={() => handleToggleDomain("LDTBXH_AN_SINH")}
                      className="size-4 rounded text-amber-600 mt-0.5"
                    />
                    <div>
                      <div className="font-bold text-amber-900 flex items-center gap-1.5">
                        <HeartHandshake className="size-3.5 text-amber-700" />
                        <span>Mảng Lao động, Việc làm và An sinh xã hội tổng hợp</span>
                      </div>
                      <div className="text-[11px] text-gray-600 mt-0.5">
                        Bảo trợ xã hội, cứu trợ đột xuất, giảm nghèo đa chiều, việc làm quân nhân xuất ngũ, kiểm tra ATLĐ, trẻ em và phòng chống tệ nạn.
                      </div>
                    </div>
                  </label>

                  {/* Mảng Người có công */}
                  <label className="flex items-start gap-2.5 p-2 rounded border border-rose-200 bg-rose-50/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedDomains.includes("LDTBXH_NCC") || selectedDomains.includes("ALL")}
                      disabled={selectedDomains.includes("ALL")}
                      onChange={() => handleToggleDomain("LDTBXH_NCC")}
                      className="size-4 rounded text-rose-600 mt-0.5"
                    />
                    <div>
                      <div className="font-bold text-rose-900 flex items-center gap-1.5">
                        <FileText className="size-3.5 text-rose-700" />
                        <span>Mảng Chính sách Người có công &amp; Đền ơn đáp nghĩa</span>
                      </div>
                      <div className="text-[11px] text-gray-600 mt-0.5">
                        Quản lý hồ sơ thương bệnh binh, liệt sĩ, chi trả trợ cấp tháng, điều dưỡng phục hồi, nghĩa trang liệt sĩ.
                      </div>
                    </div>
                  </label>

                  {/* Mảng 3: Giáo dục và Đào tạo */}
                  <label className="flex items-start gap-2.5 p-2 rounded border border-emerald-200 bg-emerald-50/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedDomains.includes("GD_DT") || selectedDomains.includes("ALL")}
                      disabled={selectedDomains.includes("ALL")}
                      onChange={() => handleToggleDomain("GD_DT")}
                      className="size-4 rounded text-emerald-600 mt-0.5"
                    />
                    <div>
                      <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                        <GraduationCap className="size-3.5 text-emerald-700" />
                        <span>Mảng Giáo dục và Đào tạo cơ sở</span>
                      </div>
                      <div className="text-[11px] text-gray-600 mt-0.5">
                        Thẩm định cấp phép mầm non tư thục, phối hợp tuyển sinh đầu cấp, an toàn trường học, phổ cập GD và khuyến học.
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-3 py-1.5 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleSaveUserDomains}
                  className="px-4 py-1.5 rounded bg-[#dd4b39] hover:bg-[#c23321] text-white font-bold shadow-xs flex items-center gap-1"
                >
                  <Check className="size-3.5" />
                  <span>Lưu &amp; Áp dụng phân quyền</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL THÊM TÀI KHOẢN CÁN BỘ MỚI */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full border border-gray-300 overflow-hidden">
            <div className="bg-[#dd4b39] text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="size-4" />
                <h3 className="font-bold text-sm">Thêm Tài khoản Cán bộ &amp; Cấp quyền ban đầu</h3>
              </div>
              <button onClick={() => setShowAddUserModal(false)} className="text-white/80 hover:text-white">
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Họ và tên cán bộ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Nguyễn Văn Nam..."
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  className="w-full rounded border border-gray-300 p-2 text-xs outline-none focus:border-[#dd4b39]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Email công vụ (.gov.vn) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="namnv@binhduong.gov.vn"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full rounded border border-gray-300 p-2 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Số điện thoại</label>
                  <input
                    type="text"
                    placeholder="09xx..."
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full rounded border border-gray-300 p-2 text-xs outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Chức danh / Chức vụ</label>
                  <input
                    type="text"
                    placeholder="VD: Chuyên viên Văn hóa - Xã hội"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full rounded border border-gray-300 p-2 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Bộ phận công tác</label>
                  <input
                    type="text"
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    className="w-full rounded border border-gray-300 p-2 text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Cấp quyền mảng nghiệp vụ phụ trách</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <label className="flex items-center gap-2 p-2 rounded border border-sky-200 bg-sky-50/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newAssignedDomains.includes("TT_CDS")}
                      onChange={() => {
                        if (newAssignedDomains.includes("TT_CDS")) {
                          setNewAssignedDomains(newAssignedDomains.filter((d) => d !== "TT_CDS"));
                        } else {
                          setNewAssignedDomains([...newAssignedDomains, "TT_CDS"]);
                        }
                      }}
                      className="size-3.5 text-sky-600 rounded"
                    />
                    <span className="font-bold text-sky-900 text-[11px]">Thông tin &amp; CĐS</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded border border-amber-200 bg-amber-50/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newAssignedDomains.includes("LDTBXH_AN_SINH")}
                      onChange={() => {
                        if (newAssignedDomains.includes("LDTBXH_AN_SINH")) {
                          setNewAssignedDomains(newAssignedDomains.filter((d) => d !== "LDTBXH_AN_SINH"));
                        } else {
                          setNewAssignedDomains([...newAssignedDomains, "LDTBXH_AN_SINH"]);
                        }
                      }}
                      className="size-3.5 text-amber-600 rounded"
                    />
                    <span className="font-bold text-amber-900 text-[11px]">Lao động &amp; An sinh</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded border border-rose-200 bg-rose-50/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newAssignedDomains.includes("LDTBXH_NCC")}
                      onChange={() => {
                        if (newAssignedDomains.includes("LDTBXH_NCC")) {
                          setNewAssignedDomains(newAssignedDomains.filter((d) => d !== "LDTBXH_NCC"));
                        } else {
                          setNewAssignedDomains([...newAssignedDomains, "LDTBXH_NCC"]);
                        }
                      }}
                      className="size-3.5 text-rose-600 rounded"
                    />
                    <span className="font-bold text-rose-900 text-[11px]">Người có công</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded border border-emerald-200 bg-emerald-50/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newAssignedDomains.includes("GD_DT")}
                      onChange={() => {
                        if (newAssignedDomains.includes("GD_DT")) {
                          setNewAssignedDomains(newAssignedDomains.filter((d) => d !== "GD_DT"));
                        } else {
                          setNewAssignedDomains([...newAssignedDomains, "GD_DT"]);
                        }
                      }}
                      className="size-3.5 text-emerald-600 rounded"
                    />
                    <span className="font-bold text-emerald-900 text-[11px]">Giáo dục &amp; Đào tạo</span>
                  </label>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-3 py-1.5 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#dd4b39] hover:bg-[#c23321] text-white font-bold shadow-xs"
                >
                  Tạo tài khoản &amp; Cấp quyền
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
