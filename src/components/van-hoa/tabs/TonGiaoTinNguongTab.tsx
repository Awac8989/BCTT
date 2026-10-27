import { useState } from "react";
import {
  Building2,
  Users,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Heart,
  Phone,
  ShieldCheck,
  Search,
  Plus,
} from "lucide-react";
import { type CoSoTonGiaoItem } from "@/data/domain-mock";
import { formatVND } from "@/data/mock";
import { HE_PHAI_TON_GIAO_LABELS } from "../utils";

interface TonGiaoTinNguongTabProps {
  coSoList: CoSoTonGiaoItem[];
  onDangKyHoatDong: (id: string) => void;
  onOpenAddModal?: () => void;
}

export function TonGiaoTinNguongTab({
  coSoList,
  onDangKyHoatDong,
  onOpenAddModal,
}: TonGiaoTinNguongTabProps) {
  const [search, setSearch] = useState("");
  const [filterHePhai, setFilterHePhai] = useState("ALL");

  const filtered = coSoList.filter((c) => {
    const matchSearch =
      search.trim() === "" ||
      c.tenCoSo.toLowerCase().includes(search.toLowerCase()) ||
      c.truTriChucSac.toLowerCase().includes(search.toLowerCase()) ||
      c.diaChi.toLowerCase().includes(search.toLowerCase());
    const matchHp = filterHePhai === "ALL" || c.hePhai === filterHePhai;
    return matchSearch && matchHp;
  });

  return (
    <div className="space-y-6">
      {/* Banner Tôn giáo & Tín ngưỡng */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-xs rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            <Building2 className="w-3.5 h-3.5" />
            Công tác Tôn giáo & Tín ngưỡng
          </div>
          <h3 className="text-2xl font-bold mb-2">
            Quản lý Nhà nước về Tín ngưỡng, Tôn giáo trên địa bàn Phường
          </h3>
          <p className="text-slate-200 text-sm leading-relaxed mb-4">
            Triển khai thực hiện Luật Tín ngưỡng, tôn giáo năm 2016 và Nghị định số 95/2023/NĐ-CP. Hướng dẫn các tổ chức tôn giáo, cơ sở tự viện, nhà thờ, giáo xứ sinh hoạt tôn giáo thuần túy, chấp hành pháp luật, tích cực tham gia các phong trào thi đua yêu nước, hoạt động từ thiện nhân đạo và bảo vệ môi trường.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-lg">
              <FileCheck className="w-4 h-4 text-emerald-300" />
              <span>100% Cơ sở thông báo danh mục hoạt động hàng năm</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-lg">
              <ShieldCheck className="w-4 h-4 text-blue-300" />
              <span>Cam kết ANTT & PCCC trong các đại lễ tôn giáo</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-lg">
              <Heart className="w-4 h-4 text-rose-300" />
              <span>Đóng góp từ thiện an sinh xã hội &gt; 2.6 tỷ đồng</span>
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
            placeholder="Tìm cơ sở tôn giáo, người đứng đầu, địa chỉ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterHePhai}
            onChange={(e) => setFilterHePhai(e.target.value)}
            className="px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="ALL">Tất cả hệ phái tôn giáo</option>
            <option value="PHAT_GIAO">Phật giáo (GHPGVN)</option>
            <option value="CONG_GIAO">Công giáo (Giáo phận Phú Cường)</option>
            <option value="TIN_LANH">Tin Lành</option>
            <option value="TIN_NGUONG_DAN_GIAN">Tín ngưỡng dân gian</option>
          </select>
        </div>
      </div>

      {/* Grid cơ sở tôn giáo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span className="inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-900 mb-1.5">
                    {HE_PHAI_TON_GIAO_LABELS[item.hePhai] || item.hePhai}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {item.tenCoSo}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {item.diaChi} ({item.khuPho})
                  </p>
                </div>
                <span
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border flex items-center gap-1 ${
                    item.tinhTrangDangKy === "DA_DANG_KY_HANG_NAM"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300"
                      : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300"
                  }`}
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  {item.tinhTrangDangKy === "DA_DANG_KY_HANG_NAM"
                    ? "Đã nộp thông báo"
                    : "Chưa nộp thông báo"}
                </span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg my-3 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span className="text-slate-500 dark:text-slate-400">Trụ trì / Chức sắc đại diện:</span>
                  <span className="font-semibold">{item.truTriChucSac}</span>
                </div>
                <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span className="text-slate-500 dark:text-slate-400">Chức vụ trong giáo hội:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{item.chucVu}</span>
                </div>
                <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span className="text-slate-500 dark:text-slate-400">Tín đồ sinh hoạt thường xuyên:</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    ~{item.soTinDoThuongXuyen.toLocaleString("vi-VN")} người
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 pt-1 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-rose-500" />
                    Kinh phí từ thiện xã hội (2025):
                  </span>
                  <span className="font-bold text-rose-600 dark:text-rose-400">
                    {formatVND(item.hoatDongTuThienNam)}
                  </span>
                </div>
              </div>

              {/* Cam kết ANTT */}
              <div className="flex items-center justify-between text-xs px-2 py-1.5 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-md border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300">
                <span className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Bản cam kết đảm bảo ANTT, PCCC & Vệ sinh môi trường
                </span>
                <span className="font-semibold text-[11px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                  Đã ký cam kết
                </span>
              </div>
            </div>

            <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                <Phone className="w-3.5 h-3.5 text-blue-500" />
                <span className="font-mono">{item.sdt}</span>
              </div>
              <button
                type="button"
                onClick={() => onDangKyHoatDong(item.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-lg font-medium transition-colors cursor-pointer"
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>Tiếp nhận thông báo năm 2026</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
