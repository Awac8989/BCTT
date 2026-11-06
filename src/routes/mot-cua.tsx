import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { MotCuaDvcCenter } from "@/components/admin/MotCuaDvcCenter";

export const Route = createFileRoute("/mot-cua")({
  head: () => ({
    meta: [
      {
        title: "Bộ phận Một cửa Điện tử & Dịch vụ công Quốc gia · UBND Phường",
      },
      {
        name: "description",
        content:
          "Hệ thống Một cửa điện tử liên thông theo Nghị định 61/2018/NĐ-CP và Nghị định 107/2021/NĐ-CP: Chuẩn hóa 4 mẫu biểu pháp lý, thanh toán trực tuyến và số hóa kết quả điện tử Đề án 06.",
      },
    ],
  }),
  component: MotCuaPage,
});

function MotCuaPage() {
  return (
    <AppShell activeDomain="ALL">
      <div className="space-y-6">
        <PageHeader
          title="Bộ phận Tiếp nhận & Trả kết quả TTHC (Một cửa điện tử)"
          subtitle="Ủy ban nhân dân Phường Thủ Dầu Một · Tỉnh Bình Dương"
          badge="NĐ 61/2018 & ĐỀ ÁN 06"
        />

        <MotCuaDvcCenter />
      </div>
    </AppShell>
  );
}
