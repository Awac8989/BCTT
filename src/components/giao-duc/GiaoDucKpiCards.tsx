import React from "react";
import { Baby, School, GraduationCap, Award } from "lucide-react";
import { type CoSoMamNonTuThuc, type TruongHocCongLap } from "@/data/domain-mock";

interface GiaoDucKpiCardsProps {
  mamNonList: CoSoMamNonTuThuc[];
  truongCongLapList: TruongHocCongLap[];
}

export const GiaoDucKpiCards: React.FC<GiaoDucKpiCardsProps> = ({
  mamNonList,
  truongCongLapList,
}) => {
  const totalTre = mamNonList.reduce((acc, m) => acc + m.soTreDangGiu, 0);

  return (
    <div className="mb-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {/* KPI 1: Mầm non ngoài công lập */}
      <div className="relative overflow-hidden rounded-xl border border-emerald-100 bg-linear-to-br from-white via-white to-emerald-50/40 p-4 shadow-xs hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Mầm non ngoài công lập
          </span>
          <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200">
            <Baby className="size-4.5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-gray-900 tracking-tight">
            {mamNonList.length}
          </span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-800">
            {totalTre} trẻ
          </span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500 font-medium">
          <span className="size-1.5 rounded-full bg-emerald-500 inline-block" />
          100% có camera trực tuyến &amp; PCCC
        </div>
      </div>

      {/* KPI 2: Trường công lập địa bàn */}
      <div className="relative overflow-hidden rounded-xl border border-sky-100 bg-linear-to-br from-white via-white to-sky-50/40 p-4 shadow-xs hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Trường học công lập
          </span>
          <div className="flex size-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600 ring-1 ring-sky-200">
            <School className="size-4.5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-gray-900 tracking-tight">
            {truongCongLapList.length}
          </span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[11px] font-bold bg-sky-100 text-sky-800">
            3.150 học sinh
          </span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500 font-medium">
          <span className="size-1.5 rounded-full bg-sky-500 inline-block" />
          MN, Tiểu học, THCS đạt chuẩn QG
        </div>
      </div>

      {/* KPI 3: Phổ cập giáo dục */}
      <div className="relative overflow-hidden rounded-xl border border-purple-100 bg-linear-to-br from-white via-white to-purple-50/40 p-4 shadow-xs hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Phổ cập GD Mầm non 5T
          </span>
          <div className="flex size-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600 ring-1 ring-purple-200">
            <GraduationCap className="size-4.5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-purple-700 tracking-tight">
            99.8%
          </span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[11px] font-bold bg-purple-100 text-purple-800">
            Đạt Chuẩn Mức 3
          </span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500 font-medium">
          <span className="size-1.5 rounded-full bg-purple-500 inline-block" />
          Huy động 381/382 trẻ 5 tuổi ra lớp
        </div>
      </div>

      {/* KPI 4: Quỹ khuyến học */}
      <div className="relative overflow-hidden rounded-xl border border-amber-100 bg-linear-to-br from-white via-white to-amber-50/40 p-4 shadow-xs hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Học bổng Khuyến học
          </span>
          <div className="flex size-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 ring-1 ring-amber-200">
            <Award className="size-4.5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-amber-700 tracking-tight">
            73.5 tr
          </span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 text-amber-800">
            105 suất đã trao
          </span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500 font-medium">
          <span className="size-1.5 rounded-full bg-amber-500 inline-block" />
          Duy trì 0% học sinh nghèo bỏ học
        </div>
      </div>
    </div>
  );
};
