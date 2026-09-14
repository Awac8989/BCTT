import { ShieldCheck, CheckCircle2 } from "lucide-react";

interface DigitalSignatureBadgeProps {
  nguoiKy?: string;
  chucVu?: string;
  ngayKy?: string;
  maXacThuc?: string;
  className?: string;
}

export function DigitalSignatureBadge({
  nguoiKy = "TS. Nguyễn Văn Hùng",
  chucVu = "Phó Giám đốc Sở LĐTBXH tỉnh Bình Dương",
  ngayKy = new Date().toLocaleString("vi-VN"),
  maXacThuc = "SHA256:7F9A2B4C-2026BD",
  className = "",
}: DigitalSignatureBadgeProps) {
  return (
    <div
      className={`inline-flex items-center gap-3 p-2.5 rounded border border-[#dd4b39]/40 bg-gradient-to-r from-red-50 to-amber-50 text-[#333333] shadow-xs select-none ${className}`}
    >
      {/* Con dấu số tròn đỏ */}
      <div className="size-10 rounded-full border-2 border-dashed border-[#dd4b39] flex items-center justify-center p-0.5 shrink-0 bg-white shadow-xs">
        <div className="size-full rounded-full bg-[#dd4b39] text-white flex flex-col items-center justify-center text-[7px] font-black uppercase text-center leading-none">
          <span>KÝ SỐ</span>
          <ShieldCheck className="size-3 my-0.5 text-amber-300" />
          <span>HỢP LỆ</span>
        </div>
      </div>

      <div className="text-left text-xs leading-tight">
        <div className="flex items-center gap-1.5 font-bold text-[#c82333]">
          <span>ĐÃ KÝ SỐ ĐIỆN TỬ BỞI:</span>
          <CheckCircle2 className="size-3.5 text-emerald-600" />
        </div>
        <div className="font-extrabold text-sm text-[#222]">{nguoiKy}</div>
        <div className="text-[11px] text-[#666]">{chucVu}</div>
        <div className="text-[10px] text-[#888] font-mono mt-0.5">
          Thời gian ký: <span className="font-semibold text-[#444]">{ngayKy}</span> · Mã:{" "}
          <span className="text-[#3c8dbc] font-semibold">{maXacThuc}</span>
        </div>
      </div>
    </div>
  );
}
