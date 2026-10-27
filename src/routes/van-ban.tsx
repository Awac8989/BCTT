import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { VanBanDieuHanh } from "@/components/admin/VanBanDieuHanh";

export const Route = createFileRoute("/van-ban")({
  head: () => ({
    meta: [
      {
        title: "Văn phòng Điện tử & Quản lý Văn bản Điều hành (e-Office) · UBND Phường",
      },
      {
        name: "description",
        content:
          "Hệ thống quản lý văn bản đến, văn bản đi, bút phê Lãnh đạo, trình ký số SmartCA và kết nối Trục liên thông văn bản quốc gia VDXP theo Nghị định 30/2020/NĐ-CP.",
      },
    ],
  }),
  component: VanBanPage,
});

function VanBanPage() {
  return (
    <AppShell activeDomain="ALL">
      <div className="space-y-6">
        <PageHeader
          title="Văn phòng Điện tử & Quản lý Văn bản Điều hành (e-Office)"
          subtitle="Ủy ban nhân dân Phường Phú Cường / TP. Thủ Dầu Một · Tỉnh Bình Dương"
          badge="NĐ 30/2020 & VDXP"
        />

        <VanBanDieuHanh />
      </div>
    </AppShell>
  );
}
