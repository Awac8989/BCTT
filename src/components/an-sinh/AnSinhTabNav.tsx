import {
  Users,
  Home,
  Briefcase,
  Baby,
  ShieldAlert,
  Flame,
  FileSignature,
  HeartHandshake,
} from "lucide-react";

export type AnSinhTabKey =
  | "BAO_TRO_XA_HOI"
  | "DIEU_DUONG_NCC"
  | "THO_CUNG_KHUYET_TAT"
  | "GIAM_NGHEO_DA_CHIEU"
  | "LAO_DONG_VIEC_LAM"
  | "TRE_EM_HOAN_CANH"
  | "TE_NAN_XA_HOI"
  | "CUU_TRO_DOT_XUAT"
  | "TTHC_MOT_CUA_AN_SINH";

interface AnSinhTabNavProps {
  activeTab: AnSinhTabKey;
  onChangeTab: (tab: AnSinhTabKey) => void;
  counts: {
    baoTro: number;
    dieuDuong?: number;
    hoGheo: number;
    laoDong: number;
    treEm: number;
    teNan: number;
    cuuTro: number;
    tthc: number;
  };
}

export function AnSinhTabNav({ activeTab, onChangeTab, counts }: AnSinhTabNavProps) {
  const tabs = [
    {
      id: "BAO_TRO_XA_HOI" as const,
      label: "Bảo trợ xã hội (NĐ 20)",
      icon: Users,
      badge: counts.baoTro,
      color: "text-amber-700",
      activeBg: "bg-amber-50 text-amber-900 border-amber-500",
    },
    {
      id: "DIEU_DUONG_NCC" as const,
      label: "Điều dưỡng NCC & Học nghề (PL 02)",
      icon: HeartHandshake,
      badge: counts.dieuDuong ?? 3,
      color: "text-red-700",
      activeBg: "bg-red-50 text-red-900 border-red-500",
    },
    {
      id: "THO_CUNG_KHUYET_TAT" as const,
      label: "Thờ cúng Liệt sĩ, Khuyết tật & Quỹ ĐƠĐN",
      icon: Flame,
      badge: 3,
      color: "text-rose-700",
      activeBg: "bg-rose-50 text-rose-900 border-rose-500",
    },
    {
      id: "GIAM_NGHEO_DA_CHIEU" as const,
      label: "Giảm nghèo đa chiều (QĐ 24)",
      icon: Home,
      badge: counts.hoGheo,
      color: "text-emerald-700",
      activeBg: "bg-emerald-50 text-emerald-900 border-emerald-500",
    },
    {
      id: "LAO_DONG_VIEC_LAM" as const,
      label: "Lao động - Việc làm (TT 01)",
      icon: Briefcase,
      badge: counts.laoDong,
      color: "text-sky-700",
      activeBg: "bg-sky-50 text-sky-900 border-sky-500",
    },
    {
      id: "TRE_EM_HOAN_CANH" as const,
      label: "Bảo vệ & Chăm sóc Trẻ em",
      icon: Baby,
      badge: counts.treEm,
      color: "text-pink-700",
      activeBg: "bg-pink-50 text-pink-900 border-pink-500",
    },
    {
      id: "TE_NAN_XA_HOI" as const,
      label: "Phòng chống Tệ nạn xã hội",
      icon: ShieldAlert,
      badge: counts.teNan,
      color: "text-purple-700",
      activeBg: "bg-purple-50 text-purple-900 border-purple-500",
    },
    {
      id: "CUU_TRO_DOT_XUAT" as const,
      label: "Cứu trợ khẩn cấp",
      icon: Flame,
      badge: counts.cuuTro,
      color: "text-orange-700",
      activeBg: "bg-orange-50 text-orange-900 border-orange-500",
    },
    {
      id: "TTHC_MOT_CUA_AN_SINH" as const,
      label: "TTHC Một cửa & Ký số SmartCA",
      icon: FileSignature,
      badge: counts.tthc,
      color: "text-teal-700",
      activeBg: "bg-teal-50 text-teal-900 border-teal-500",
    },
  ];

  return (
    <div className="border-b border-gray-200 bg-white rounded-t-lg shadow-xs overflow-x-auto">
      <nav className="flex space-x-1 p-2 min-w-max">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded text-xs font-bold transition-all border ${
                isActive
                  ? `${tab.activeBg} shadow-xs border-b-2 font-black`
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <Icon className={`size-4 ${isActive ? tab.color : "text-gray-500"}`} />
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                  isActive
                    ? "bg-white/80 font-bold shadow-xs text-gray-900"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {tab.badge}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
