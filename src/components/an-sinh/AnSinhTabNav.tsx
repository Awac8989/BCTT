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
    },
    {
      id: "DIEU_DUONG_NCC" as const,
      label: "Điều dưỡng NCC & Học nghề (PL 02)",
      icon: HeartHandshake,
      badge: counts.dieuDuong ?? 3,
    },
    {
      id: "THO_CUNG_KHUYET_TAT" as const,
      label: "Thờ cúng Liệt sĩ, Khuyết tật & Quỹ ĐƠĐN",
      icon: Flame,
      badge: 3,
    },
    {
      id: "GIAM_NGHEO_DA_CHIEU" as const,
      label: "Giảm nghèo đa chiều (QĐ 24)",
      icon: Home,
      badge: counts.hoGheo,
    },
    {
      id: "LAO_DONG_VIEC_LAM" as const,
      label: "Lao động - Việc làm (TT 01)",
      icon: Briefcase,
      badge: counts.laoDong,
    },
    {
      id: "TRE_EM_HOAN_CANH" as const,
      label: "Bảo vệ & Chăm sóc Trẻ em",
      icon: Baby,
      badge: counts.treEm,
    },
    {
      id: "TE_NAN_XA_HOI" as const,
      label: "Phòng chống Tệ nạn xã hội",
      icon: ShieldAlert,
      badge: counts.teNan,
    },
    {
      id: "CUU_TRO_DOT_XUAT" as const,
      label: "Cứu trợ khẩn cấp",
      icon: Flame,
      badge: counts.cuuTro,
    },
    {
      id: "TTHC_MOT_CUA_AN_SINH" as const,
      label: "TTHC Một cửa & Ký số SmartCA",
      icon: FileSignature,
      badge: counts.tthc,
    },
  ];

  return (
    <div className="border-b border-gray-200 bg-white rounded-t-lg shadow-xs overflow-x-auto">
      <nav className="flex space-x-1.5 p-2 min-w-max">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                isActive
                  ? "bg-[#dd4b39] text-white shadow-xs border-[#c23321] ring-1 ring-[#c23321]"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <Icon className={`size-4 ${isActive ? "text-white" : "text-gray-500"}`} />
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                  isActive
                    ? "bg-white/20 text-white font-bold"
                    : "bg-gray-100 text-gray-700"
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
