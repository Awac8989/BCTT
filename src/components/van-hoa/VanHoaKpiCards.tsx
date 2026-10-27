import { Award, Users, Landmark, Flame, ShieldAlert, HeartHandshake, Compass } from "lucide-react";
import { formatVND } from "@/data/mock";

interface VanHoaKpiCardsProps {
  kpiData: {
    giaDinh: {
      tongSoHo: number;
      datChuan: number;
      tyLeDat: number;
      khenThuong: number;
    };
    khuPho: {
      tongSoKhuPho: number;
      xuatSac: number;
      tuyenDuongVanMinh: number;
    };
    diTich: {
      tongSoDiTich: number;
      diTichQuocGia: number;
      luotKhachUocTinh: number;
      soHoaQrPercent: number;
    };
    langNghe: {
      tongLangNghe: number;
      diSanQuocGia: number;
      soNgeNhanUuTu: number;
    };
    kiemTra814: {
      tongCoSo: number;
      chapHanhTot: number;
      viPham: number;
      tongTienPhat: number;
    };
    baoLucGiaDinh: {
      tongDiaChiTinCay: number;
      tongVuViec: number;
      camTiepXuc: number;
    };
  };
  onQuickFilter?: (tabKey: string) => void;
}

export function VanHoaKpiCards({ kpiData, onQuickFilter }: VanHoaKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
      {/* 1. Gia đình văn hóa */}
      <div
        onClick={() => onQuickFilter?.("GIA_DINH_KHU_PHO")}
        className="cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs hover:border-blue-400 dark:hover:border-blue-600 transition-all group"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Gia đình Văn hóa
          </span>
          <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
            <Award className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {kpiData.giaDinh.tyLeDat}%
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">đạt chuẩn NĐ 86</span>
        </div>
        <div className="mt-2 text-xs text-slate-600 dark:text-slate-300 flex justify-between">
          <span>{kpiData.giaDinh.datChuan}/{kpiData.giaDinh.tongSoHo} hộ đạt</span>
          <span className="font-medium text-emerald-600 dark:text-emerald-400">
            {kpiData.giaDinh.khenThuong} khen thưởng
          </span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
          <div
            className="bg-blue-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${kpiData.giaDinh.tyLeDat}%` }}
          />
        </div>
      </div>

      {/* 2. Khu phố văn hóa */}
      <div
        onClick={() => onQuickFilter?.("GIA_DINH_KHU_PHO")}
        className="cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs hover:border-emerald-400 dark:hover:border-emerald-600 transition-all group"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Khu phố Văn minh
          </span>
          <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {kpiData.khuPho.tongSoKhuPho}/4
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">Khu phố giữ vững</span>
        </div>
        <div className="mt-2 text-xs text-slate-600 dark:text-slate-300 flex justify-between">
          <span>{kpiData.khuPho.xuatSac} xuất sắc</span>
          <span className="text-emerald-700 dark:text-emerald-300 font-medium">100% tuyến có hoa</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
          <div className="bg-emerald-500 h-full rounded-full w-full" />
        </div>
      </div>

      {/* 3. Di tích & Lễ hội Chùa Bà */}
      <div
        onClick={() => onQuickFilter?.("DI_TICH_LE_HOI")}
        className="cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs hover:border-amber-400 dark:hover:border-amber-600 transition-all group"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Di tích & Lễ hội
          </span>
          <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
            <Landmark className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {kpiData.diTich.tongSoDiTich}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">di tích xếp hạng</span>
        </div>
        <div className="mt-2 text-xs text-slate-600 dark:text-slate-300 flex justify-between">
          <span>Chùa Bà ~1.5M khách</span>
          <span className="text-blue-600 dark:text-blue-400 font-medium">100% QR Guide</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
          <div className="bg-amber-500 h-full rounded-full w-full" />
        </div>
      </div>

      {/* 4. Làng nghề & Di sản */}
      <div
        onClick={() => onQuickFilter?.("LANG_NGHE_DI_SAN")}
        className="cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs hover:border-purple-400 dark:hover:border-purple-600 transition-all group"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Làng nghề Di sản
          </span>
          <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
            <Compass className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {kpiData.langNghe.tongLangNghe}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">làng nghề đất Thủ</span>
        </div>
        <div className="mt-2 text-xs text-slate-600 dark:text-slate-300 flex justify-between">
          <span className="text-purple-700 dark:text-purple-300 font-medium">Sơn mài Quốc gia</span>
          <span>{kpiData.langNghe.soNgeNhanUuTu} Nghệ nhân</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
          <div className="bg-purple-500 h-full rounded-full w-full" />
        </div>
      </div>

      {/* 5. Kiểm tra 814 (Karaoke, Bar, Quảng cáo) */}
      <div
        onClick={() => onQuickFilter?.("KIEM_TRA_814")}
        className="cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs hover:border-rose-400 dark:hover:border-rose-600 transition-all group"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Hậu kiểm 814
          </span>
          <div className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform">
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-rose-600 dark:text-rose-400">
            {kpiData.kiemTra814.tongCoSo}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">cơ sở quản lý</span>
        </div>
        <div className="mt-2 text-xs text-slate-600 dark:text-slate-300 flex justify-between">
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
            {kpiData.kiemTra814.chapHanhTot} tốt
          </span>
          <span className="text-rose-600 dark:text-rose-400 font-medium">
            {kpiData.kiemTra814.viPham} xử phạt ({formatVND(kpiData.kiemTra814.tongTienPhat)})
          </span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
          <div
            className="bg-rose-500 h-full rounded-full"
            style={{
              width: `${(kpiData.kiemTra814.chapHanhTot / (kpiData.kiemTra814.tongCoSo || 1)) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* 6. PC Bạo lực gia đình (Luật 2022) */}
      <div
        onClick={() => onQuickFilter?.("BAO_LUC_GIA_DINH")}
        className="cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs hover:border-teal-400 dark:hover:border-teal-600 transition-all group"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Địa chỉ Tin cậy
          </span>
          <div className="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform">
            <HeartHandshake className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-teal-600 dark:text-teal-400">
            {kpiData.baoLucGiaDinh.tongDiaChiTinCay}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">điểm tạm lánh</span>
        </div>
        <div className="mt-2 text-xs text-slate-600 dark:text-slate-300 flex justify-between">
          <span>{kpiData.baoLucGiaDinh.tongVuViec} vụ việc</span>
          <span className="text-teal-700 dark:text-teal-300 font-medium">
            {kpiData.baoLucGiaDinh.camTiepXuc} lệnh cấm tiếp xúc
          </span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
          <div className="bg-teal-500 h-full rounded-full w-full" />
        </div>
      </div>
    </div>
  );
}
