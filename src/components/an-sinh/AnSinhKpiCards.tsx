import {
  HeartHandshake,
  Users,
  Home,
  Briefcase,
  Baby,
  ShieldAlert,
  Flame,
  FileSignature,
} from "lucide-react";
import {
  type DoiTuongBaoTroXaHoi,
  type HoGheoCanGheoItem,
  type CungCauLaoDongItem,
  type TreEmHoanCanhDacBiet,
  type HoSoPhongChongTeNan,
  type HoSoCuuTroDotXuat,
  type HoSoTTHCAnSinhItem,
} from "@/data/domain-mock";
import { type HoSoItem } from "@/data/mock";

interface AnSinhKpiCardsProps {
  hoSoList: HoSoItem[];
  baoTroList: DoiTuongBaoTroXaHoi[];
  hoGheoList: HoGheoCanGheoItem[];
  cungCauList: CungCauLaoDongItem[];
  treEmList: TreEmHoanCanhDacBiet[];
  teNanList: HoSoPhongChongTeNan[];
  cuuTroList: HoSoCuuTroDotXuat[];
  tthcList: HoSoTTHCAnSinhItem[];
}

export function AnSinhKpiCards({
  hoSoList,
  baoTroList,
  hoGheoList,
  cungCauList,
  treEmList,
  teNanList,
  cuuTroList,
  tthcList,
}: AnSinhKpiCardsProps) {
  const dangHuongBaoTro = baoTroList.filter((b) => b.trangThai === "DANG_HUONG").length;
  const viecLamDaKetNoi = cungCauList.filter((c) => c.tinhTrangViecLam === "DA_KET_NOI_VIEC_LAM").length;
  const hoNghèoCount = hoGheoList.filter((h) => h.phanLoai === "HO_NGHEO").length;
  const tthcDaXuLy = tthcList.filter((t) => t.trangThai === "DA_KY_SO" || t.trangThai === "DA_TRA_KET_QUA").length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
      {/* 1. Người có công */}
      <div className="rounded-lg border border-red-200 bg-white p-3 shadow-xs">
        <div className="flex items-center justify-between text-gray-500 text-[11px]">
          <span>Người có công</span>
          <HeartHandshake className="size-4 text-red-600" />
        </div>
        <div className="mt-1.5 flex items-baseline gap-1">
          <span className="text-xl font-black text-gray-900 font-mono">{hoSoList.length}</span>
          <span className="text-[10px] font-bold text-red-600">Hồ sơ</span>
        </div>
        <div className="mt-0.5 text-[10px] text-gray-500 truncate">100% đúng kỳ</div>
      </div>

      {/* 2. Bảo trợ xã hội */}
      <div className="rounded-lg border border-amber-200 bg-white p-3 shadow-xs">
        <div className="flex items-center justify-between text-gray-500 text-[11px]">
          <span>Bảo trợ XH (NĐ 20)</span>
          <Users className="size-4 text-amber-600" />
        </div>
        <div className="mt-1.5 flex items-baseline gap-1">
          <span className="text-xl font-black text-amber-700 font-mono">{dangHuongBaoTro}</span>
          <span className="text-[10px] font-bold text-amber-600">Đang hưởng</span>
        </div>
        <div className="mt-0.5 text-[10px] text-gray-500 truncate">80+, khuyết tật, mồ côi</div>
      </div>

      {/* 3. Giảm nghèo đa chiều */}
      <div className="rounded-lg border border-emerald-200 bg-white p-3 shadow-xs">
        <div className="flex items-center justify-between text-gray-500 text-[11px]">
          <span>Hộ nghèo & cận nghèo</span>
          <Home className="size-4 text-emerald-600" />
        </div>
        <div className="mt-1.5 flex items-baseline gap-1">
          <span className="text-xl font-black text-emerald-700 font-mono">{hoGheoList.length}</span>
          <span className="text-[10px] font-bold text-emerald-600">({hoNghèoCount} nghèo)</span>
        </div>
        <div className="mt-0.5 text-[10px] text-gray-500 truncate">100% có thẻ BHYT</div>
      </div>

      {/* 4. Việc làm & Cung cầu */}
      <div className="rounded-lg border border-sky-200 bg-white p-3 shadow-xs">
        <div className="flex items-center justify-between text-gray-500 text-[11px]">
          <span>Cung - Cầu việc làm</span>
          <Briefcase className="size-4 text-[#0073b7]" />
        </div>
        <div className="mt-1.5 flex items-baseline gap-1">
          <span className="text-xl font-black text-[#0073b7] font-mono">{cungCauList.length}</span>
          <span className="text-[10px] font-bold text-emerald-600">({viecLamDaKetNoi} kết nối)</span>
        </div>
        <div className="mt-0.5 text-[10px] text-gray-500 truncate">Bộ đội xuất ngũ & KCN</div>
      </div>

      {/* 5. Bảo vệ Trẻ em */}
      <div className="rounded-lg border border-pink-200 bg-white p-3 shadow-xs">
        <div className="flex items-center justify-between text-gray-500 text-[11px]">
          <span>Bảo vệ Trẻ em</span>
          <Baby className="size-4 text-pink-600" />
        </div>
        <div className="mt-1.5 flex items-baseline gap-1">
          <span className="text-xl font-black text-pink-700 font-mono">{treEmList.length}</span>
          <span className="text-[10px] font-bold text-pink-600">Trẻ HCĐB</span>
        </div>
        <div className="mt-0.5 text-[10px] text-gray-500 truncate">Kế hoạch can thiệp NĐ 56</div>
      </div>

      {/* 6. Phòng chống Tệ nạn */}
      <div className="rounded-lg border border-purple-200 bg-white p-3 shadow-xs">
        <div className="flex items-center justify-between text-gray-500 text-[11px]">
          <span>Quản lý sau cai</span>
          <ShieldAlert className="size-4 text-purple-600" />
        </div>
        <div className="mt-1.5 flex items-baseline gap-1">
          <span className="text-xl font-black text-purple-700 font-mono">{teNanList.length}</span>
          <span className="text-[10px] font-bold text-emerald-600">100% Âm tính</span>
        </div>
        <div className="mt-0.5 text-[10px] text-gray-500 truncate">Methadone & Hoàn lương</div>
      </div>

      {/* 7. Cứu trợ khẩn cấp */}
      <div className="rounded-lg border border-orange-200 bg-white p-3 shadow-xs">
        <div className="flex items-center justify-between text-gray-500 text-[11px]">
          <span>Cứu trợ đột xuất</span>
          <Flame className="size-4 text-orange-600" />
        </div>
        <div className="mt-1.5 flex items-baseline gap-1">
          <span className="text-xl font-black text-orange-700 font-mono">{cuuTroList.length}</span>
          <span className="text-[10px] font-bold text-orange-600">Đã chi trả</span>
        </div>
        <div className="mt-0.5 text-[10px] text-gray-500 truncate">Hỏa hoạn, giông lốc</div>
      </div>

      {/* 8. TTHC Một Cửa An Sinh */}
      <div className="rounded-lg border border-teal-200 bg-white p-3 shadow-xs">
        <div className="flex items-center justify-between text-gray-500 text-[11px]">
          <span>TTHC Một cửa</span>
          <FileSignature className="size-4 text-teal-600" />
        </div>
        <div className="mt-1.5 flex items-baseline gap-1">
          <span className="text-xl font-black text-teal-700 font-mono">{tthcList.length}</span>
          <span className="text-[10px] font-bold text-emerald-600">({tthcDaXuLy} ký số)</span>
        </div>
        <div className="mt-0.5 text-[10px] text-gray-500 truncate">NĐ 61/2018 & SmartCA</div>
      </div>
    </div>
  );
}
