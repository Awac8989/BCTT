import { useState } from "react";
import {
  Compass,
  Award,
  Users,
  Sparkles,
  Phone,
  Building,
  CheckCircle2,
  AlertTriangle,
  FileText,
  BadgeCheck,
  Search,
} from "lucide-react";
import { type LangNgheTruyenThongItem } from "@/data/domain-mock";

interface LangNgheDiSanTabProps {
  langNgheList: LangNgheTruyenThongItem[];
  onOpenSupportModal?: (item: LangNgheTruyenThongItem) => void;
}

export function LangNgheDiSanTab({
  langNgheList,
  onOpenSupportModal,
}: LangNgheDiSanTabProps) {
  const [search, setSearch] = useState("");
  const [filterDiSan, setFilterDiSan] = useState("ALL");

  const filtered = langNgheList.filter((ln) => {
    const matchSearch =
      search.trim() === "" ||
      ln.tenLangNghe.toLowerCase().includes(search.toLowerCase()) ||
      ln.sanPhamChinh.toLowerCase().includes(search.toLowerCase()) ||
      ln.diaBan.toLowerCase().includes(search.toLowerCase());
    const matchDs = filterDiSan === "ALL" || ln.loaiDiSan === filterDiSan;
    return matchSearch && matchDs;
  });

  return (
    <div className="space-y-6">
      {/* Banner di sản làng nghề */}
      <div className="bg-gradient-to-r from-purple-800 via-indigo-800 to-blue-900 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-xs rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            <Compass className="w-3.5 h-3.5" />
            Di sản Làng nghề Thủ Dầu Một
          </div>
          <h3 className="text-2xl font-bold mb-2">
            Bảo tồn & Phát huy Làng nghề Sơn mài, Gốm lò lu & Điêu khắc gỗ
          </h3>
          <p className="text-purple-100 text-sm leading-relaxed mb-4">
            Thủ Dầu Một là cái nôi của các làng nghề thủ công truyền thống Nam Bộ, trong đó Làng nghề Sơn mài Tương Bình Hiệp được công nhận là Di sản Văn hóa Phi vật thể Quốc gia. Thành phố triển khai Đề án bảo tồn làng nghề gắn liền với du lịch trải nghiệm sinh thái ven sông Sài Gòn.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-lg">
              <Award className="w-4 h-4 text-amber-300" />
              <span>Sơn mài Tương Bình Hiệp: Di sản Quốc gia (2016)</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-lg">
              <Sparkles className="w-4 h-4 text-purple-300" />
              <span>21 Nghệ nhân Ưu tú & Nghệ nhân Dân gian</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-lg">
              <Building className="w-4 h-4 text-emerald-300" />
              <span>Hỗ trợ vốn vay bảo tồn & xúc tiến du lịch OCOP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên làng nghề, sản phẩm, địa bàn..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterDiSan}
            onChange={(e) => setFilterDiSan(e.target.value)}
            className="px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-purple-500 cursor-pointer"
          >
            <option value="ALL">Tất cả di sản</option>
            <option value="QUOC_GIA">Di sản Quốc gia</option>
            <option value="CAP_TINH">Di sản cấp Tỉnh</option>
          </select>
        </div>
      </div>

      {/* Grid làng nghề */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span
                    className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full border mb-1.5 ${
                      item.loaiDiSan === "QUOC_GIA"
                        ? "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900"
                        : "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900"
                    }`}
                  >
                    {item.loaiDiSan === "QUOC_GIA" ? "Di sản Quốc gia" : "Di sản Cấp Tỉnh"} (Công nhận {item.namCongNhan})
                  </span>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {item.tenLangNghe}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {item.diaBan}
                  </p>
                </div>
                <span
                  className={`text-[11px] font-semibold px-2 py-1 rounded-md border flex items-center gap-1 ${
                    item.tinhTrangBaoTon === "PHAT_TRIEN_TOT"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300"
                      : item.tinhTrangBaoTon === "CAN_HO_TRO_MAT_BANG"
                      ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300"
                      : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300"
                  }`}
                >
                  {item.tinhTrangBaoTon === "PHAT_TRIEN_TOT" ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" /> Phát triển tốt
                    </>
                  ) : item.tinhTrangBaoTon === "CAN_HO_TRO_MAT_BANG" ? (
                    <>
                      <AlertTriangle className="w-3.5 h-3.5" /> Cần mặt bằng
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-3.5 h-3.5" /> Nguy cơ mai một
                    </>
                  )}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2">
                {item.moTa}
              </p>

              <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg my-3 text-xs space-y-1.5">
                <div className="text-slate-700 dark:text-slate-300">
                  <span className="font-semibold">Sản phẩm đặc trưng:</span> {item.sanPhamChinh}
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-700">
                  <span>Quy mô: <strong>{item.soHoSanXuat}</strong> hộ sản xuất</span>
                  <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-semibold">
                    <BadgeCheck className="w-3.5 h-3.5" /> {item.soNgeNhanUuTu} Nghệ nhân Ưu tú
                  </span>
                </div>
              </div>
            </div>

            <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                <Users className="w-3.5 h-3.5" />
                <span>Đại diện: {item.nguoiDaiDienHoiNghe}</span>
              </div>
              <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                <Phone className="w-3.5 h-3.5 text-blue-500" />
                <span className="font-mono">{item.sdt}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
