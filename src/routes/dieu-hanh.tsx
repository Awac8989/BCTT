import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Activity, LayoutDashboard, Sparkles, Building2, ShieldCheck } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { ExecutiveKpiCheckIn } from "@/components/admin/ExecutiveKpiCheckIn";
import { IocSmartDashboard } from "@/components/admin/IocSmartDashboard";

export const Route = createFileRoute("/dieu-hanh")({
  head: () => ({
    meta: [
      {
        title: "Trung tâm Giám sát Điều hành & Giao việc Lãnh đạo · UBND Phường Thủ Dầu Một",
      },
      {
        name: "description",
        content:
          "Hệ thống Giám sát Điều hành Phường Thủ Dầu Một: Giám sát đa ngành thời gian thực theo Khoản 8 Điều 3 Quyết định số 2698/QĐ-UBND, điều phối 14 Tổ công nghệ số cộng đồng, nộp sản phẩm công vụ và giao việc cán bộ.",
      },
    ],
  }),
  component: DieuHanhPage,
});

function DieuHanhPage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"IOC_WALL" | "KPI_CHECKIN">("IOC_WALL");

  return (
    <AppShell activeDomain="ALL">
      <div className="space-y-6">
        <PageHeader
          title="Trung tâm Giám sát Điều hành & Lãnh đạo Phường"
          subtitle="Ủy ban nhân dân Phường Thủ Dầu Một · Phòng Văn hóa – Xã hội (Quyết định số 2698/QĐ-UBND)"
          badge="GIÁM SÁT ĐIỀU HÀNH"
        />

        {/* Chuyển đổi góc nhìn Điều hành Lãnh đạo */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-3">
          <div className="inline-flex rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => setViewMode("IOC_WALL")}
              className={`flex items-center gap-2 rounded-md px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                viewMode === "IOC_WALL"
                  ? "bg-[#dd4b39] text-white shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Activity className="size-4" />
              <span>1. Màn Hình Giám Sát Đa Ngành Thời Gian Thực</span>
            </button>
            <button
              onClick={() => setViewMode("KPI_CHECKIN")}
              className={`flex items-center gap-2 rounded-md px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                viewMode === "KPI_CHECKIN"
                  ? "bg-[#dd4b39] text-white shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <LayoutDashboard className="size-4" />
              <span>2. Nộp Sản Phẩm Công Vụ, Giao Việc &amp; Đánh Giá Kết Quả Cán Bộ</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <ShieldCheck className="size-3.5" />
              Liên thông CSDL 3 Cấp
            </span>
          </div>
        </div>

        {/* NỘI DUNG THEO TAB */}
        {viewMode === "IOC_WALL" ? (
          <IocSmartDashboard onNavigateTab={(tab) => setViewMode("KPI_CHECKIN")} />
        ) : (
          <ExecutiveKpiCheckIn
            onOpenChatWithCanBo={(canBoName) => {
              navigate({ to: "/hop-truc-tuyen" });
            }}
          />
        )}
      </div>
    </AppShell>
  );
}
