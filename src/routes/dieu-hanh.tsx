import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { ExecutiveKpiCheckIn } from "@/components/admin/ExecutiveKpiCheckIn";

export const Route = createFileRoute("/dieu-hanh")({
  head: () => ({
    meta: [
      {
        title: "Trung tâm Điều hành Lãnh đạo & Check-in Sản phẩm KPI · UBND Phường",
      },
      {
        name: "description",
        content:
          "Bảng điều hành chuyên quyền dành cho Lãnh đạo UBND: Giám sát KPI các khối công chức, thẩm định phê chuẩn sản phẩm check-in và giao việc số.",
      },
    ],
  }),
  component: DieuHanhPage,
});

function DieuHanhPage() {
  const navigate = useNavigate();

  return (
    <AppShell activeDomain="ALL">
      <div className="space-y-6">
        <PageHeader
          title="Trung tâm Điều hành Lãnh đạo & Check-in Sản phẩm"
          subtitle="Ủy ban nhân dân Phường Phú Cường / TP. Thủ Dầu Một · Tỉnh Bình Dương"
          badge="ĐIỀU HÀNH SỐ"
        />

        <ExecutiveKpiCheckIn
          onOpenChatWithCanBo={(canBoName) => {
            navigate({ to: "/hop-truc-tuyen" });
          }}
        />
      </div>
    </AppShell>
  );
}
