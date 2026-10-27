import { useState, useMemo } from "react";
import {
  Award,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Building2,
  FileText,
  UserCheck,
  Sparkles,
} from "lucide-react";
import { type GiaDinhVanHoaItem, type KhuPhoVanHoaItem } from "@/data/domain-mock";

interface GiaDinhKhuPhoTabProps {
  giaDinhList: GiaDinhVanHoaItem[];
  khuPhoList: KhuPhoVanHoaItem[];
  onOpenAddModal: () => void;
  onOpenEvalModal: (item: GiaDinhVanHoaItem) => void;
}

export function GiaDinhKhuPhoTab({
  giaDinhList,
  khuPhoList,
  onOpenAddModal,
  onOpenEvalModal,
}: GiaDinhKhuPhoTabProps) {
  const [subTab, setSubTab] = useState<"GIA_DINH" | "KHU_PHO">("GIA_DINH");
  const [search, setSearch] = useState("");
  const [filterKhuPho, setFilterKhuPho] = useState("ALL");
  const [filterKetQua, setFilterKetQua] = useState("ALL");

  const filteredGdv = useMemo(() => {
    return giaDinhList.filter((g) => {
      const matchSearch =
        search.trim() === "" ||
        g.chuHo.toLowerCase().includes(search.toLowerCase()) ||
        g.cccd.includes(search) ||
        g.diaChi.toLowerCase().includes(search.toLowerCase());
      const matchKp = filterKhuPho === "ALL" || g.khuPho === filterKhuPho;
      const matchKq = filterKetQua === "ALL" || g.ketQua === filterKetQua;
      return matchSearch && matchKp && matchKq;
    });
  }, [giaDinhList, search, filterKhuPho, filterKetQua]);

  return (
    <div className="space-y-6">
      {/* Sub-tab navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSubTab("GIA_DINH")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              subTab === "GIA_DINH"
                ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs border border-slate-200 dark:border-slate-700"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            Danh sách Gia đình Văn hóa (Nghị định 86/2023)
          </button>
          <button
            type="button"
            onClick={() => setSubTab("KHU_PHO")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              subTab === "KHU_PHO"
                ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs border border-slate-200 dark:border-slate-700"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            Đánh giá 4 Khu phố Văn hóa & Tuyến đường Văn minh
          </button>
        </div>

        {subTab === "GIA_DINH" && (
          <button
            type="button"
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Đăng ký Hộ mới</span>
          </button>
        )}
      </div>

      {subTab === "GIA_DINH" ? (
        <div className="space-y-4">
          {/* Filters & Search */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo họ tên chủ hộ, số CCCD, địa chỉ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-3">
              <select
                value={filterKhuPho}
                onChange={(e) => setFilterKhuPho(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">Tất cả Khu phố (4 KP)</option>
                <option value="Khu phố 1">Khu phố 1</option>
                <option value="Khu phố 2">Khu phố 2</option>
                <option value="Khu phố 3">Khu phố 3</option>
                <option value="Khu phố 4">Khu phố 4</option>
              </select>
            </div>
            <div className="md:col-span-3">
              <select
                value={filterKetQua}
                onChange={(e) => setFilterKetQua(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">Tất cả kết quả</option>
                <option value="DAT_CHUAN">Đạt chuẩn (≥ 85 điểm)</option>
                <option value="CHUA_DAT">Chưa đạt chuẩn (&lt; 85 điểm)</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold uppercase tracking-wider">
                    <th className="py-3 px-4">Mã hộ / Chủ hộ</th>
                    <th className="py-3 px-4">Địa chỉ & Khu phố</th>
                    <th className="py-3 px-4 text-center">Gương mẫu (30đ)</th>
                    <th className="py-3 px-4 text-center">Kinh tế (30đ)</th>
                    <th className="py-3 px-4 text-center">Hòa thuận (40đ)</th>
                    <th className="py-3 px-4 text-center">Tổng điểm (100đ)</th>
                    <th className="py-3 px-4 text-center">Kết luận NĐ 86</th>
                    <th className="py-3 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredGdv.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-500 dark:text-slate-400">
                        Không tìm thấy hộ gia đình nào phù hợp với bộ lọc
                      </td>
                    </tr>
                  ) : (
                    filteredGdv.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="font-medium text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                            {item.chuHo}
                            {item.deNghiKhenThuong && (
                              <span title="Đề nghị khen thưởng tiêu biểu">
                                <Sparkles className="w-3.5 h-3.5 text-amber-500 inline" />
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                            <span>Mã: {item.maHo}</span>
                            <span>•</span>
                            <span>CCCD: {item.cccd}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-slate-700 dark:text-slate-300">{item.diaChi}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {item.khuPho} ({item.soThanhVien} nhân khẩu)
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {item.diemGuongMau}
                          </span>
                          <span className="text-xs text-slate-400">/30</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {item.diemKinhTe}
                          </span>
                          <span className="text-xs text-slate-400">/30</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {item.diemHoaThuan}
                          </span>
                          <span className="text-xs text-slate-400">/40</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="font-bold text-base text-blue-600 dark:text-blue-400">
                            {item.tongDiem}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {item.namDatLienTuc} năm liên tục
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {item.ketQua === "DAT_CHUAN" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Đạt chuẩn
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              Chưa đạt
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => onOpenEvalModal(item)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 dark:bg-slate-800 dark:hover:bg-blue-950/50 dark:hover:text-blue-400 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            Bình xét
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 bg-slate-50/60 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row justify-between items-center gap-2">
              <span>
                Căn cứ Nghị định số 86/2023/NĐ-CP ngày 07/12/2023 của Chính phủ quy định về khung tiêu chuẩn xét tặng danh hiệu Gia đình văn hóa, Thôn/Khu phố văn hóa.
              </span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Hiển thị {filteredGdv.length}/{giaDinhList.length} hộ gia đình
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Khu phố văn hóa */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {khuPhoList.map((kp) => (
            <div
              key={kp.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {kp.tenKhuPho}
                  </h4>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Trưởng Ban điều hành: {kp.truongKhuPho} • SĐT: {kp.sdt}
                  </div>
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                    kp.danhHieu === "KHU_PHO_VAN_HOA_XUAT_SAC"
                      ? "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300"
                      : "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300"
                  }`}
                >
                  {kp.danhHieu === "KHU_PHO_VAN_HOA_XUAT_SAC"
                    ? "Khu phố Văn hóa Xuất sắc"
                    : "Khu phố Văn hóa"}
                </span>
              </div>

              {/* Progress */}
              <div className="space-y-1.5 my-3">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-600 dark:text-slate-400">
                    Tỷ lệ Gia đình Văn hóa:
                  </span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold">
                    {kp.tyLeDatPercent}% ({kp.soHoDatGiaDinhVanHoa}/{kp.tongSoHo} hộ)
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full"
                    style={{ width: `${kp.tyLeDatPercent}%` }}
                  />
                </div>
              </div>

              {/* Tuyến đường văn minh */}
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 my-3 text-xs">
                <div className="font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-blue-500" />
                  Tuyến đường Văn minh Đô thị tự quản:
                </div>
                <div className="text-slate-600 dark:text-slate-400 pl-5">
                  {kp.tuyenDuongVanMinh}
                </div>
              </div>

              {/* 4 tiêu chí đô thị văn minh */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Bộ tiêu chí Đô thị Văn minh:
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                    <CheckCircle2
                      className={`w-3.5 h-3.5 ${
                        kp.tieuChiDoThiVanMinh.khongRac ? "text-emerald-500" : "text-slate-300"
                      }`}
                    />
                    <span>Không xả rác bừa bãi</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                    <CheckCircle2
                      className={`w-3.5 h-3.5 ${
                        kp.tieuChiDoThiVanMinh.khongLanChiemLongLeDuong
                          ? "text-emerald-500"
                          : "text-rose-400"
                      }`}
                    />
                    <span>Không lấn chiếm lòng lề đường</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                    <CheckCircle2
                      className={`w-3.5 h-3.5 ${
                        kp.tieuChiDoThiVanMinh.tuyenPhoCoHoa ? "text-emerald-500" : "text-slate-300"
                      }`}
                    />
                    <span>Tuyến đường có hoa/cây xanh</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                    <CheckCircle2
                      className={`w-3.5 h-3.5 ${
                        kp.tieuChiDoThiVanMinh.anNinhTratTu ? "text-emerald-500" : "text-slate-300"
                      }`}
                    />
                    <span>Đảm bảo ANTT & PCCC</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
