import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { LichTuanLanhDao } from "@/components/admin/LichTuanLanhDao";

export const Route = createFileRoute("/lich-tuan")({
  head: () => ({
    meta: [
      {
        title: "Lịch Công tác Tuần & Tiếp Công dân Định kỳ · UBND Phường",
      },
      {
        name: "description",
        content:
          "Lịch công tác tuần Lãnh đạo UBND Phường và lịch Tiếp công dân định kỳ Thứ 5 hàng tuần của Chủ tịch UBND Phường theo Luật Tiếp công dân 2013.",
      },
    ],
  }),
  component: LichTuanPage,
});

function LichTuanPage() {
  return (
    <AppShell activeDomain="ALL">
      <div className="space-y-6">
        <PageHeader
          title="Lịch Công Tác Tuần & Tiếp Công Dân Định Kỳ"
          subtitle="Ủy ban nhân dân Phường Thủ Dầu Một · Tỉnh Bình Dương"
          badge="LỊCH CÔNG VỤ"
        />

        <LichTuanLanhDao />
      </div>
    </AppShell>
  );
}
