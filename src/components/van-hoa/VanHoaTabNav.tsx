import {
  Award,
  Landmark,
  Building2,
  ShieldCheck,
  Music,
  Heart,
  FileCheck,
  Compass,
  MapPin,
} from "lucide-react";

export type VanHoaTabKey =
  | "GIA_DINH_KHU_PHO"
  | "DO_THI_VAN_MINH"
  | "DI_TICH_LE_HOI"
  | "LANG_NGHE_DI_SAN"
  | "NGHE_NHAN_THE_THAO"
  | "GIS_BAN_DO"
  | "TON_GIAO_TIN_NGUONG"
  | "KIEM_TRA_814"
  | "THIET_CHE_DON_CA"
  | "BAO_LUC_GIA_DINH"
  | "TTHC_MOT_CUA";

interface VanHoaTabNavProps {
  activeTab: VanHoaTabKey;
  onSelectTab: (tab: VanHoaTabKey) => void;
  counts: {
    giaDinh: number;
    doThiVanMinh?: number;
    diTich: number;
    langNghe: number;
    gisDiaDiem: number;
    tonGiao: number;
    kiemTra814: number;
    thietChe: number;
    baoLucGiaDinh: number;
    tthc: number;
  };
}

export function VanHoaTabNav({ activeTab, onSelectTab, counts }: VanHoaTabNavProps) {
  const tabs: {
    key: VanHoaTabKey;
    label: string;
    subLabel: string;
    icon: typeof Award;
    count: number;
    badgeColor?: string;
  }[] = [
    {
      key: "GIA_DINH_KHU_PHO",
      label: "Gia đình & Khu phố VH",
      subLabel: "Nghị định 86/2023",
      icon: Award,
      count: counts.giaDinh,
    },
    {
      key: "DO_THI_VAN_MINH",
      label: "Đô thị văn minh QĐ 04",
      subLabel: "9 tiêu chí - 52 chỉ tiêu",
      icon: Building2,
      count: counts.doThiVanMinh ?? 9,
    },
    {
      key: "DI_TICH_LE_HOI",
      label: "Di tích & Lễ hội Chùa Bà",
      subLabel: "Quốc gia & Rằm tháng Giêng",
      icon: Landmark,
      count: counts.diTich,
    },
    {
      key: "LANG_NGHE_DI_SAN",
      label: "Làng nghề & Di sản",
      subLabel: "Sơn mài, Gốm lò lu",
      icon: Compass,
      count: counts.langNghe,
    },
    {
      key: "NGHE_NHAN_THE_THAO",
      label: "Nghệ nhân & Quản lý Thể thao",
      subLabel: "Nghệ nhân NĐ 109 & Bể bơi NĐ 36",
      icon: Award,
      count: 3,
    },
    {
      key: "GIS_BAN_DO",
      label: "Bản đồ số GIS",
      subLabel: "Định vị điểm đến",
      icon: MapPin,
      count: counts.gisDiaDiem,
    },
    {
      key: "TON_GIAO_TIN_NGUONG",
      label: "Tôn giáo & Tín ngưỡng",
      subLabel: "Luật Tôn giáo 2016",
      icon: Building2,
      count: counts.tonGiao,
    },
    {
      key: "KIEM_TRA_814",
      label: "Kiểm tra liên ngành 814",
      subLabel: "Karaoke, Bar, Quảng cáo",
      icon: ShieldCheck,
      count: counts.kiemTra814,
    },
    {
      key: "THIET_CHE_DON_CA",
      label: "Thiết chế & Đờn ca tài tử",
      subLabel: "VHTT-HTCĐ, Lân Sư Rồng",
      icon: Music,
      count: counts.thietChe,
    },
    {
      key: "BAO_LUC_GIA_DINH",
      label: "PC Bạo lực gia đình",
      subLabel: "Địa chỉ tin cậy & Lệnh cấm",
      icon: Heart,
      count: counts.baoLucGiaDinh,
      badgeColor: counts.baoLucGiaDinh > 0 ? "bg-rose-500 text-white" : undefined,
    },
    {
      key: "TTHC_MOT_CUA",
      label: "TTHC Một cửa & SmartCA",
      subLabel: "6 bước liên thông",
      icon: FileCheck,
      count: counts.tthc,
    },
  ];

  return (
    <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl shadow-2xs mb-6 overflow-hidden">
      <div className="flex overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 p-1.5 gap-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onSelectTab(tab.key)}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-left whitespace-nowrap transition-all duration-200 flex-shrink-0 cursor-pointer ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm font-medium dark:bg-blue-600"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
              }`}
            >
              <div
                className={`p-1.5 rounded-md ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm leading-tight">{tab.label}</span>
                  <span
                    className={`text-[11px] font-semibold px-1.5 py-0.2 rounded-full ${
                      tab.badgeColor
                        ? tab.badgeColor
                        : isActive
                        ? "bg-white/25 text-white"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {tab.count}
                  </span>
                </div>
                <span
                  className={`text-[11px] leading-tight ${
                    isActive ? "text-blue-100" : "text-slate-400 dark:text-slate-400"
                  }`}
                >
                  {tab.subLabel}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
