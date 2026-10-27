import { useState } from "react";
import {
  Music,
  Users,
  Calendar,
  Building,
  DollarSign,
  Phone,
  Sparkles,
  MapPin,
  Award,
} from "lucide-react";
import { type ThietCheVanHoaItem } from "@/data/domain-mock";
import { formatVND } from "@/data/mock";

interface ThietCheDonCaTaiTuTabProps {
  thietCheList: ThietCheVanHoaItem[];
}

export function ThietCheDonCaTaiTuTab({
  thietCheList,
}: ThietCheDonCaTaiTuTabProps) {
  const [selectedLoai, setSelectedLoai] = useState("ALL");

  const filtered = thietCheList.filter((tc) => {
    if (selectedLoai === "ALL") return true;
    return tc.loaiHinh === selectedLoai;
  });

  return (
    <div className="space-y-6">
      {/* Banner Đờn ca tài tử & Thiết chế VHTT */}
      <div className="bg-gradient-to-r from-teal-800 via-emerald-800 to-cyan-900 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-xs rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            <Music className="w-3.5 h-3.5" />
            Văn hóa Cơ sở & Nghệ thuật Quần chúng
          </div>
          <h3 className="text-2xl font-bold mb-2">
            Hệ thống Thiết chế VHTT & Câu lạc bộ Đờn ca tài tử Nam Bộ
          </h3>
          <p className="text-teal-100 text-sm leading-relaxed mb-4">
            Phường Phú Cường duy trì và phát huy hiệu quả Trung tâm Văn hóa Thể thao - Học tập cộng đồng, 4 Nhà văn hóa khu phố và CLB Đờn ca tài tử Nam Bộ (Nghệ thuật được UNESCO ghi danh là Di sản văn hóa phi vật thể của nhân loại). Tổ chức giao lưu định kỳ tại công viên phố đi bộ ven sông Bạch Đằng.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-lg">
              <Award className="w-4 h-4 text-amber-300" />
              <span>CLB Đờn ca tài tử: Nghệ nhân Ưu tú phụ trách</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-lg">
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>Đội Lân Sư Rồng: Phục vụ Lễ hội Chùa Bà &amp; giao lưu</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-lg">
              <Users className="w-4 h-4 text-cyan-300" />
              <span>100% Khu phố có Nhà văn hóa &amp; CLB Dưỡng sinh NCT</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter categories */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setSelectedLoai("ALL")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
            selectedLoai === "ALL"
              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
              : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
          }`}
        >
          Tất cả thiết chế ({thietCheList.length})
        </button>
        <button
          type="button"
          onClick={() => setSelectedLoai("TRUNG_TAM_VHTTCĐ")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
            selectedLoai === "TRUNG_TAM_VHTTCĐ"
              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
              : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
          }`}
        >
          Trung tâm VHTT-HTCĐ
        </button>
        <button
          type="button"
          onClick={() => setSelectedLoai("CLB_DON_CA_TAI_TU")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
            selectedLoai === "CLB_DON_CA_TAI_TU"
              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
              : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
          }`}
        >
          CLB Đờn ca tài tử
        </button>
        <button
          type="button"
          onClick={() => setSelectedLoai("DOI_LAN_SU_RONG")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
            selectedLoai === "DOI_LAN_SU_RONG"
              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
              : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
          }`}
        >
          Đội Lân Sư Rồng
        </button>
        <button
          type="button"
          onClick={() => setSelectedLoai("CLB_DUONG_SINH_NCT")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
            selectedLoai === "CLB_DUONG_SINH_NCT"
              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
              : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
          }`}
        >
          Dưỡng sinh Người cao tuổi
        </button>
      </div>

      {/* Grid thiết chế */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span className="inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300 border border-teal-200 dark:border-teal-900 mb-1.5">
                    {item.loaiHinh}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {item.tenThietChe}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-teal-600" />
                    {item.diaDiem} ({item.khuPho})
                  </p>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg text-center flex-shrink-0">
                  <div className="font-bold text-sm text-teal-700 dark:text-teal-300">
                    {item.soLuongThanhVien}
                  </div>
                  <div className="text-[10px] text-slate-500">Thành viên</div>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg my-3 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span className="text-slate-500 dark:text-slate-400">Chủ nhiệm phụ trách:</span>
                  <span className="font-semibold">{item.chuNhiem}</span>
                </div>
                <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-teal-500" />
                    Lịch sinh hoạt:
                  </span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {item.lichSinhHoat}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 pt-1 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                    Kinh phí ngân sách hỗ trợ/năm:
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {formatVND(item.kinhPhiHoTroNam)}
                  </span>
                </div>
              </div>
            </div>

            <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                <Phone className="w-3.5 h-3.5 text-blue-500" />
                <span className="font-mono">{item.sdt}</span>
              </div>
              <span className="text-teal-600 dark:text-teal-400 font-medium">
                Sinh hoạt nề nếp, hiệu quả
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
