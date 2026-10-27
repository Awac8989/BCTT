import { useState, useMemo } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Flame,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Search,
  Filter,
  DollarSign,
  Building2,
  Calendar,
  XCircle,
  Plus,
} from "lucide-react";
import { type CoSoDichVuVanHoaItem } from "@/data/domain-mock";
import { formatVND } from "@/data/mock";
import { LOAI_HINH_DICH_VU_LABELS } from "../utils";

interface KiemTra814TabProps {
  coSoList: CoSoDichVuVanHoaItem[];
  onOpenInspectModal: (item: CoSoDichVuVanHoaItem) => void;
}

export function KiemTra814Tab({
  coSoList,
  onOpenInspectModal,
}: KiemTra814TabProps) {
  const [search, setSearch] = useState("");
  const [filterLoai, setFilterLoai] = useState("ALL");
  const [filterKetLuan, setFilterKetLuan] = useState("ALL");

  const filtered = useMemo(() => {
    return coSoList.filter((c) => {
      const matchSearch =
        search.trim() === "" ||
        c.tenCoSo.toLowerCase().includes(search.toLowerCase()) ||
        c.chuCoSo.toLowerCase().includes(search.toLowerCase()) ||
        c.diaChi.toLowerCase().includes(search.toLowerCase());
      const matchLoai = filterLoai === "ALL" || c.loaiHinh === filterLoai;
      const matchKl = filterKetLuan === "ALL" || c.ketLuan === filterKetLuan;
      return matchSearch && matchLoai && matchKl;
    });
  }, [coSoList, search, filterLoai, filterKetLuan]);

  return (
    <div className="space-y-6">
      {/* Banner Đội 814 */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white rounded-2xl p-6 shadow-md relative overflow-hidden border border-rose-900/50">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/30 backdrop-blur-xs rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            <ShieldAlert className="w-3.5 h-3.5" />
            Đội Kiểm tra Liên ngành 814/UBND Phường
          </div>
          <h3 className="text-2xl font-bold mb-2">
            Hậu kiểm Cơ sở Kinh doanh Dịch vụ Văn hóa & Bảng hiệu Quảng cáo
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            Đội Kiểm tra liên ngành 814 phường (gồm Công chức Văn hóa - Xã hội, Công an phường, Đội Quản lý Trật tự đô thị) tăng cường kiểm tra, hậu kiểm hoạt động Karaoke (NĐ 54/2019/NĐ-CP), Pub âm nhạc, Bi-a và rà soát biển hiệu quảng cáo tấm lớn theo Luật Quảng cáo &amp; Nghị định 38/2021/NĐ-CP.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-lg border border-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Cấm chốt khóa trong phòng hát Karaoke, ngừng hát trước 24h00</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-lg border border-slate-700">
              <Flame className="w-4 h-4 text-rose-400" />
              <span>Kiểm định điều kiện an toàn thoát nạn &amp; PCCC tự động</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-lg border border-slate-700">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>Xử lý nghiêm biển hiệu quá kích thước lấn chiếm hành lang</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and search */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên cơ sở, chủ cơ sở, địa chỉ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-rose-500"
          />
        </div>
        <div className="md:col-span-3">
          <select
            value={filterLoai}
            onChange={(e) => setFilterLoai(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-rose-500 cursor-pointer"
          >
            <option value="ALL">Tất cả loại hình (Karaoke, Bar, Bi-a...)</option>
            <option value="KARAOKE">Karaoke (NĐ 54/2019)</option>
            <option value="QUAN_BAR_PUB">Quán Bar, Vũ trường, Pub</option>
            <option value="BI_A_CLUB">CLB Bi-a / Snooker</option>
            <option value="PHONG_GYM_FITNESS">Phòng Gym &amp; Fitness</option>
            <option value="BIEN_HIEU_QUANG_CAO">Biển hiệu, Bảng quảng cáo</option>
          </select>
        </div>
        <div className="md:col-span-3">
          <select
            value={filterKetLuan}
            onChange={(e) => setFilterKetLuan(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-rose-500 cursor-pointer"
          >
            <option value="ALL">Tất cả kết luận kiểm tra</option>
            <option value="CHUP_HANH_TOT">Chấp hành tốt</option>
            <option value="NHAC_NHO">Nhắc nhở chấn chỉnh</option>
            <option value="LAP_BIEN_BAN_XU_PHAT">Lập biên bản xử phạt VPHC</option>
            <option value="TAM_DINH_CHI">Tạm đình chỉ hoạt động</option>
          </select>
        </div>
      </div>

      {/* Grid cơ sở dịch vụ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((item) => {
          const loaiInfo = LOAI_HINH_DICH_VU_LABELS[item.loaiHinh] || {
            label: item.loaiHinh,
            icon: "Building2",
          };

          return (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700 mb-1.5">
                      {loaiInfo.label}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      {item.tenCoSo}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {item.diaChi} ({item.khuPho})
                    </p>
                  </div>

                  {/* Kết luận badge */}
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border flex items-center gap-1 ${
                      item.ketLuan === "CHUP_HANH_TOT"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300"
                        : item.ketLuan === "NHAC_NHO"
                        ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300"
                        : item.ketLuan === "LAP_BIEN_BAN_XU_PHAT"
                        ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300"
                        : "bg-red-100 text-red-900 border-red-300 dark:bg-red-950 dark:text-red-200"
                    }`}
                  >
                    {item.ketLuan === "CHUP_HANH_TOT" ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Chấp hành tốt
                      </>
                    ) : item.ketLuan === "NHAC_NHO" ? (
                      <>
                        <AlertTriangle className="w-3.5 h-3.5" /> Nhắc nhở
                      </>
                    ) : item.ketLuan === "LAP_BIEN_BAN_XU_PHAT" ? (
                      <>
                        <ShieldAlert className="w-3.5 h-3.5" /> Lập BB xử phạt
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" /> Tạm đình chỉ
                      </>
                    )}
                  </span>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg my-3 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                    <span className="text-slate-500 dark:text-slate-400">Chủ cơ sở đại diện:</span>
                    <span className="font-semibold">
                      {item.chuCoSo} ({item.sdt})
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                    <span className="text-slate-500 dark:text-slate-400">Giấy phép hoạt động:</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">
                      {item.giayPhepSo}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                    <span className="text-slate-500 dark:text-slate-400">Điều kiện an toàn PCCC:</span>
                    <span
                      className={`font-semibold flex items-center gap-1 ${
                        item.tinhTrangPCCC === "DAT_TIEU_CHUAN"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      <Flame className="w-3.5 h-3.5" />
                      {item.tinhTrangPCCC === "DAT_TIEU_CHUAN"
                        ? "Đạt tiêu chuẩn PCCC"
                        : "Chưa đạt tiêu chuẩn PCCC"}
                    </span>
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-700">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      Nội dung kiểm tra &amp; Xử lý:
                    </span>{" "}
                    {item.noiDungXuLy}
                  </div>
                  {item.mucPhatVND > 0 && (
                    <div className="flex items-center justify-between text-rose-700 dark:text-rose-300 font-semibold pt-1">
                      <span>Mức phạt tiền xử phạt VPHC:</span>
                      <span className="text-sm font-bold">{formatVND(item.mucPhatVND)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">
                  Lần KT gần nhất: {item.lanKiemTraGanNhat}
                </span>
                <button
                  type="button"
                  onClick={() => onOpenInspectModal(item)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300 rounded-lg font-medium transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Cập nhật kết quả 814</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
