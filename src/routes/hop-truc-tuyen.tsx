import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { InternalChatMeeting } from "@/components/chat/InternalChatMeeting";

export const Route = createFileRoute("/hop-truc-tuyen")({
  head: () => ({
    meta: [
      {
        title: "Trao đổi Tác nghiệp Nội bộ & Phòng họp Trực tuyến · UBND Phường",
      },
      {
        name: "description",
        content:
          "Hệ thống chat nội bộ, nhận thông báo giao việc và phòng họp số phục vụ điều hành UBND Phường Phú Cường.",
      },
    ],
  }),
  component: HopTrucTuyenPage,
});

function HopTrucTuyenPage() {
  return (
    <AppShell activeDomain="ALL">
      <div className="space-y-6">
        <PageHeader
          title="Trao đổi Tác nghiệp Nội bộ & Phòng họp Trực tuyến"
          subtitle="Ủy ban nhân dân Phường Phú Cường / TP. Thủ Dầu Một · Tỉnh Bình Dương"
          badge="HỌP SỐ & CHAT"
        />

        <InternalChatMeeting />
      </div>
    </AppShell>
  );
}
