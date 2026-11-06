import React from "react";
import { FileSignature, Baby, School, BookOpen, Utensils, Stethoscope } from "lucide-react";
import { type HoSoTTHCGiaoDuc } from "@/data/domain-mock";

export type GiaoDucTabType =
  | "TTHC_MOT_CUA"
  | "MAM_NON_TU_THUC"
  | "TRUONG_CONG_LAP"
  | "PHO_CAP_KHUYEN_HOC"
  | "ATTP_BEP_AN_BAN_TRU"
  | "PHO_CAP_CONG_DONG_TT44"
  | "Y_TE_CO_SO_ATTP";

interface GiaoDucTabNavProps {
  activeTab: GiaoDucTabType;
  onChangeTab: (tab: GiaoDucTabType) => void;
  hoSoTTHCGiaoDucList: HoSoTTHCGiaoDuc[];
  mamNonCount: number;
}

export const GiaoDucTabNav: React.FC<GiaoDucTabNavProps> = ({
  activeTab,
  onChangeTab,
  hoSoTTHCGiaoDucList,
  mamNonCount,
}) => {
  const hasChoPheDuyet = hoSoTTHCGiaoDucList.some(
    (h) => h.trangThai === "CHO_PHE_DUYET"
  );
  const hasQuaHan = hoSoTTHCGiaoDucList.some(
    (h) => h.trangThai !== "DA_PHE_DUYET" && h.trangThai !== "DA_TRA_KET_QUA" && h.phieuXinLoi
  );

  return (
    <div className="mb-5 border-b border-gray-200 bg-white rounded-xl shadow-xs p-1.5">
      <nav className="flex flex-wrap gap-1.5" aria-label="Tabs Nghiệp vụ">
        {/* Tab 1: Một Cửa Điện Tử (Đặt lên vị trí ưu tiên cao nhất) */}
        <button
          type="button"
          onClick={() => onChangeTab("TTHC_MOT_CUA")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "TTHC_MOT_CUA"
              ? "bg-[#dd4b39] text-white shadow-sm ring-1 ring-[#c23321]"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          <FileSignature
            className={`size-4 ${
              activeTab === "TTHC_MOT_CUA" ? "text-white" : "text-[#dd4b39]"
            }`}
          />
          <span>Một Cửa Điện Tử &amp; Hồ Sơ TTHC</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
              activeTab === "TTHC_MOT_CUA"
                ? "bg-white/20 text-white"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {hoSoTTHCGiaoDucList.length} hồ sơ
          </span>
          {hasChoPheDuyet && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
          )}
        </button>

        {/* Tab 2: Mầm non ngoài công lập */}
        <button
          type="button"
          onClick={() => onChangeTab("MAM_NON_TU_THUC")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "MAM_NON_TU_THUC"
              ? "bg-[#dd4b39] text-white shadow-sm ring-1 ring-[#c23321]"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          <Baby
            className={`size-4 ${
              activeTab === "MAM_NON_TU_THUC" ? "text-white" : "text-emerald-600"
            }`}
          />
          <span>Mầm non ngoài công lập</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === "MAM_NON_TU_THUC"
                ? "bg-white/20 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {mamNonCount} cơ sở
          </span>
        </button>

        {/* Tab 3: Phối hợp Trường học & Tuyển sinh */}
        <button
          type="button"
          onClick={() => onChangeTab("TRUONG_CONG_LAP")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "TRUONG_CONG_LAP"
              ? "bg-[#dd4b39] text-white shadow-sm ring-1 ring-[#c23321]"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          <School
            className={`size-4 ${
              activeTab === "TRUONG_CONG_LAP" ? "text-white" : "text-sky-600"
            }`}
          />
          <span>Trường công lập &amp; Tuyển sinh</span>
        </button>

        {/* Tab 4: Phổ cập giáo dục & Khuyến học */}
        <button
          type="button"
          onClick={() => onChangeTab("PHO_CAP_KHUYEN_HOC")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "PHO_CAP_KHUYEN_HOC"
              ? "bg-[#dd4b39] text-white shadow-sm ring-1 ring-[#c23321]"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          <BookOpen
            className={`size-4 ${
              activeTab === "PHO_CAP_KHUYEN_HOC" ? "text-white" : "text-purple-600"
            }`}
          />
          <span>Phổ cập GD &amp; Khuyến học</span>
        </button>

        {/* Tab 5: ATTP Bếp ăn bán trú (QĐ 1246/QĐ-BYT) */}
        <button
          type="button"
          onClick={() => onChangeTab("ATTP_BEP_AN_BAN_TRU")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "ATTP_BEP_AN_BAN_TRU"
              ? "bg-[#dd4b39] text-white shadow-sm ring-1 ring-[#c23321]"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          <Utensils
            className={`size-4 ${
              activeTab === "ATTP_BEP_AN_BAN_TRU" ? "text-white" : "text-emerald-600"
            }`}
          />
          <span>ATTP Bếp ăn bán trú &amp; QĐ 1246</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === "ATTP_BEP_AN_BAN_TRU"
                ? "bg-white/20 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Lưu mẫu 24h
          </span>
        </button>

        {/* Tab 6: Phổ cập GD & Đánh giá TT 44/2014 */}
        <button
          type="button"
          onClick={() => onChangeTab("PHO_CAP_CONG_DONG_TT44")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "PHO_CAP_CONG_DONG_TT44"
              ? "bg-[#dd4b39] text-white shadow-sm ring-1 ring-[#c23321]"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          <BookOpen
            className={`size-4 ${
              activeTab === "PHO_CAP_CONG_DONG_TT44" ? "text-white" : "text-indigo-600"
            }`}
          />
          <span>Phổ cập GD &amp; Cộng đồng học tập (TT 44)</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === "PHO_CAP_CONG_DONG_TT44"
                ? "bg-white/20 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Mức 3 / Tốt
          </span>
        </button>

        {/* Tab 7: Y tế cơ sở, Y Dược tư nhân & ATTP (Khoản 9 Điều 3 QĐ 2698 & NĐ 148) */}
        <button
          type="button"
          onClick={() => onChangeTab("Y_TE_CO_SO_ATTP")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "Y_TE_CO_SO_ATTP"
              ? "bg-[#dd4b39] text-white shadow-sm ring-1 ring-[#c23321]"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          <Stethoscope
            className={`size-4 ${
              activeTab === "Y_TE_CO_SO_ATTP" ? "text-white" : "text-teal-600"
            }`}
          />
          <span>Y tế cơ sở, Y Dược tư nhân &amp; ATTP (NĐ 148)</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === "Y_TE_CO_SO_ATTP"
                ? "bg-white/20 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Khoản 9 QĐ 2698
          </span>
        </button>
      </nav>
    </div>
  );
};
