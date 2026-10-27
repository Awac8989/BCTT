import React, { useState } from "react";
import {
  GraduationCap,
  BookOpen,
  Award,
  Users,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  School,
  FileText,
  TrendingUp,
  Sparkles,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { useAppState, appStore } from "@/services/app-state";
import { type PhoCapGiaoDucItem, type CongDongHocTapItem } from "@/data/domain-mock";
import { toast } from "sonner";

export const PhoCapCongDongTab: React.FC = () => {
  const { phoCapGiaoDucList, congDongHocTapList } = useAppState();

  const [subTab, setSubTab] = useState<"PHO_CAP" | "CONG_DONG_HOC_TAP">("PHO_CAP");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterKhuPho, setFilterKhuPho] = useState("ALL");

  // State Modal Thêm Phiếu Điều Tra Phổ Cập
  const [showAddModal, setShowAddModal] = useState(false);
  const [khuPhoMoi, setKhuPhoMoi] = useState("Khu phố 1");
  const [bacHocMoi, setBacHocMoi] = useState<PhoCapGiaoDucItem["bacHoc"]>("TIEU_HOC");
  const [doTuoiDieuTra, setDoTuoiDieuTra] = useState("Độ tuổi 6 - 11 tuổi");
  const [tongSoTre, setTongSoTre] = useState(300);
  const [soTreDiHoc, setSoTreDiHoc] = useState(299);
  const [soTreNguyCo, setSoTreNguyCo] = useState(1);
  const [bienPhap, setBienPhap] = useState("Vận động tặng tập vở, hỗ trợ học phí");

  // State Modal Chấm điểm tiêu chí
  const [editingTieuChi, setEditingTieuChi] = useState<CongDongHocTapItem | null>(null);
  const [diemTuCham, setDiemTuCham] = useState(10);
  const [minhChung, setMinhChung] = useState("");

  const pcItems = phoCapGiaoDucList || [];
  const cdhtItems = congDongHocTapList || [];

  // Tổng hợp phổ cập
  const tongTre = pcItems.reduce((acc, i) => acc + (i.tongSoTre || 0), 0);
  const tongDiHoc = pcItems.reduce((acc, i) => acc + (i.soTreDiHoc || 0), 0);
  const tongNguyCo = pcItems.reduce((acc, i) => acc + (i.soTreNguyCoBoHoc || 0), 0);
  const tyLeChung = tongTre > 0 ? +((tongDiHoc / tongTre) * 100).toFixed(2) : 100;

  // Tổng hợp điểm cộng đồng học tập
  const tongDiemDoanKT = cdhtItems.reduce((acc, i) => acc + (i.diemDoanKiemTra || 0), 0);
  const tongDiemTuDanhGia = cdhtItems.reduce((acc, i) => acc + (i.diemTuDanhGia || 0), 0);

  const filteredPc = pcItems.filter((i) => {
    const matchSearch =
      i.khuPho.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.canBoPhuTrach.toLowerCase().includes(searchTerm.toLowerCase());
    const matchKp = filterKhuPho === "ALL" || i.khuPho === filterKhuPho;
    return matchSearch && matchKp;
  });

  const handleThemPhoCap = (e: React.FormEvent) => {
    e.preventDefault();
    appStore.themDieuTraPhoCap({
      khuPho: khuPhoMoi,
      bacHoc: bacHocMoi,
      doTuoiDieuTra,
      tongSoTre: Number(tongSoTre),
      soTreDiHoc: Number(soTreDiHoc),
      soTreBoHoc: 0,
      soTreNguyCoBoHoc: Number(soTreNguyCo),
      tyLeHuyDongPercent: +(((Number(soTreDiHoc) || 1) / (Number(tongSoTre) || 1)) * 100).toFixed(2),
      mucDoDatChuan: "Đạt chuẩn Mức độ 3",
      namDieuTra: 2026,
      canBoPhuTrach: "Cán bộ Văn hóa - Xã hội",
      bienPhapVanDong: bienPhap,
    });
    toast.success("Đã ghi nhận phiếu điều tra phổ cập giáo dục thành công!");
    setShowAddModal(false);
  };

  const handleLuuDiemTieuChi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTieuChi) return;
    appStore.danhGiaCongDongHocTap(editingTieuChi.id, {
      diemTuDanhGia: Number(diemTuCham),
      diemDoanKiemTra: Number(diemTuCham),
      minhChungKetQua: minhChung || editingTieuChi.minhChungKetQua,
    });
    toast.success(`Đã cập nhật đánh giá tiêu chí ${editingTieuChi.id}!`);
    setEditingTieuChi(null);
  };

  return (
    <div className="space-y-5">
      {/* Banner Giới thiệu Nghiệp vụ */}
      <div className="rounded-xl border border-sky-200 bg-gradient-to-r from-sky-900 via-indigo-900 to-slate-900 p-5 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-500/20 text-sky-300 border border-sky-400/30 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
            <GraduationCap className="size-3.5" />
            Nghị định 20/2014/NĐ-CP · Thông tư 44/2014/TT-BGDĐT
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">
            Quản Lý Phổ Cập Giáo Dục - Xóa Mù Chữ &amp; Xây Dựng &ldquo;Cộng Đồng Học Tập&rdquo; Cấp Phường
          </h2>
          <p className="mt-2 text-xs md:text-sm text-slate-300 leading-relaxed">
            Theo dõi dữ liệu điều tra trẻ trong độ tuổi 0-5 tuổi, Tiểu học và THCS trên địa bàn 5 khu phố; phát hiện sớm và hỗ trợ học sinh có nguy cơ bỏ học. Vận hành Trung tâm Học tập Cộng đồng (TTHTCĐ) và tự đánh giá xếp loại tiêu chí Cộng đồng học tập hàng năm.
          </p>

          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="bg-sky-950/80 border border-sky-700/60 px-2.5 py-1 rounded-md flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-emerald-400" />
              Chuẩn PCGD: Mức độ 3 (Tối đa)
            </span>
            <span className="bg-sky-950/80 border border-sky-700/60 px-2.5 py-1 rounded-md flex items-center gap-1.5">
              <Award className="size-3.5 text-amber-400" />
              Xếp loại TTHTCĐ: Loại Tốt (95/100 điểm)
            </span>
            <span className="bg-sky-950/80 border border-sky-700/60 px-2.5 py-1 rounded-md flex items-center gap-1.5">
              <TrendingUp className="size-3.5 text-cyan-300" />
              Tỷ lệ huy động chung: {tyLeChung}%
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards Thống kê */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Tổng trẻ trong độ tuổi</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{tongTre.toLocaleString("vi-VN")}</span>
            <span className="text-xs font-bold text-sky-600">học sinh</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Điều tra 5 khu phố năm 2026</span>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Đang đến trường học tập</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-700">{tongDiHoc.toLocaleString("vi-VN")}</span>
            <span className="text-xs font-bold text-emerald-600">({tyLeChung}%)</span>
          </div>
          <span className="text-[11px] text-emerald-600 mt-1 block">Không có trẻ thất học</span>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Trẻ có nguy cơ bỏ học</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-amber-600">{tongNguyCo}</span>
            <span className="text-xs font-bold text-amber-700">cháu</span>
          </div>
          <span className="text-[11px] text-amber-600 mt-1 block">Đang hỗ trợ học bổng &amp; SGK</span>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Điểm Cộng đồng học tập</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-indigo-700">{tongDiemDoanKT}/100</span>
            <span className="text-xs font-bold text-indigo-600">Loại Tốt</span>
          </div>
          <span className="text-[11px] text-indigo-600 mt-1 block">Theo QĐ 242 &amp; TT 44/2014</span>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white rounded-t-lg px-3 pt-2">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSubTab("PHO_CAP")}
            className={`pb-2.5 px-3 font-bold text-xs border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              subTab === "PHO_CAP"
                ? "border-sky-600 text-sky-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <BookOpen className="size-3.5" />
            1. Số liệu Phổ cập Giáo dục &amp; Xóa mù chữ (NĐ 20/2014)
          </button>
          <button
            type="button"
            onClick={() => setSubTab("CONG_DONG_HOC_TAP")}
            className={`pb-2.5 px-3 font-bold text-xs border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              subTab === "CONG_DONG_HOC_TAP"
                ? "border-sky-600 text-sky-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Award className="size-3.5" />
            2. Đánh giá Tiêu chí &ldquo;Cộng đồng học tập&rdquo; cấp Xã (TT 44/2014)
          </button>
        </div>

        {subTab === "PHO_CAP" && (
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="mb-1.5 px-3 py-1 bg-sky-700 hover:bg-sky-800 text-white rounded text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
          >
            <Plus className="size-3.5" />
            Thêm số liệu điều tra
          </button>
        )}
      </div>

      {/* SUB-TAB 1: PHỔ CẬP GIÁO DỤC */}
      {subTab === "PHO_CAP" && (
        <div className="space-y-4">
          <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 flex-1 max-w-sm">
              <Search className="size-4 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo khu phố, cán bộ phụ trách..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-xs outline-none focus:border-sky-500"
              />
            </div>
            <select
              value={filterKhuPho}
              onChange={(e) => setFilterKhuPho(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-xs"
            >
              <option value="ALL">Tất cả khu phố</option>
              <option value="Khu phố 1">Khu phố 1</option>
              <option value="Khu phố 2">Khu phố 2</option>
              <option value="Khu phố 3">Khu phố 3</option>
              <option value="Khu phố 4">Khu phố 4</option>
            </select>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 overflow-x-auto shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold">
                  <th className="py-2.5 px-3">Địa bàn / Bậc học</th>
                  <th className="py-2.5 px-3">Độ tuổi điều tra</th>
                  <th className="py-2.5 px-3 text-center">Tổng số trẻ</th>
                  <th className="py-2.5 px-3 text-center">Đến trường</th>
                  <th className="py-2.5 px-3 text-center">Tỷ lệ huy động</th>
                  <th className="py-2.5 px-3 text-center">Nguy cơ bỏ học</th>
                  <th className="py-2.5 px-3">Mức độ đạt chuẩn</th>
                  <th className="py-2.5 px-3">Cán bộ phụ trách &amp; Biện pháp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPc.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900">{item.khuPho}</div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                        {item.bacHoc === "MAM_NON_5T"
                          ? "Mầm non 5 tuổi"
                          : item.bacHoc === "TIEU_HOC"
                          ? "Tiểu học"
                          : item.bacHoc === "THCS"
                          ? "THCS"
                          : "Xóa mù chữ"}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{item.doTuoiDieuTra}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-slate-800">{item.tongSoTre}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-emerald-700">{item.soTreDiHoc}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-sky-700 font-mono">
                      {item.tyLeHuyDongPercent}%
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {item.soTreNguyCoBoHoc > 0 ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center gap-1">
                          <AlertTriangle className="size-3 text-amber-600" />
                          {item.soTreNguyCoBoHoc} em
                        </span>
                      ) : (
                        <span className="text-slate-400 font-mono">0</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {item.mucDoDatChuan}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-medium text-slate-800">{item.canBoPhuTrach}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 italic">{item.bienPhapVanDong}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: CỘNG ĐỒNG HỌC TẬP (TT 44/2014) */}
      {subTab === "CONG_DONG_HOC_TAP" && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 flex items-start gap-2">
            <Sparkles className="size-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Quy chuẩn đánh giá &ldquo;Cộng đồng học tập&rdquo; cấp xã (Thông tư 44/2014/TT-BGDĐT):</strong>
              <div className="mt-0.5 text-slate-700">
                Gồm 5 nhóm tiêu chí với thang điểm 100. Đạt loại <strong>Tốt</strong> khi tổng điểm từ 85 điểm trở lên; Loại <strong>Khá</strong> từ 70 đến dưới 85 điểm; Loại <strong>Đạt</strong> từ 50 đến dưới 70 điểm. Hiện Phường Phú Cường đạt <strong>{tongDiemDoanKT}/100 điểm (Loại Tốt)</strong>.
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {cdhtItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs hover:border-slate-300 transition-all flex flex-wrap items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1.5 flex-1 max-w-2xl">
                  <div className="font-semibold text-sky-800 text-[11px]">{item.nhomTieuChi}</div>
                  <h4 className="font-bold text-sm text-slate-900">{item.tenTieuChi}</h4>
                  <div className="p-2.5 bg-slate-50 rounded border border-slate-200 text-slate-700 text-[11px]">
                    <strong>Minh chứng kết quả:</strong> {item.minhChungKetQua}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Tự chấm</span>
                      <strong className="text-slate-800 font-mono text-sm">{item.diemTuDanhGia}/{item.diemToiDa}đ</strong>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-emerald-600 block font-semibold">Đoàn kiểm tra</span>
                      <strong className="text-emerald-700 font-mono text-base">{item.diemDoanKiemTra}/{item.diemToiDa}đ</strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingTieuChi(item);
                      setDiemTuCham(item.diemTuDanhGia);
                      setMinhChung(item.minhChungKetQua);
                    }}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-sky-50 text-sky-700 border border-slate-300 rounded text-xs font-bold transition-all cursor-pointer"
                  >
                    Chấm lại điểm &amp; Minh chứng
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL THÊM SỐ LIỆU ĐIỀU TRA PHỔ CẬP */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-sky-900 text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <School className="size-4" />
                <h3 className="font-bold text-sm">Ghi Nhận Số Liệu Điều Tra Phổ Cập Giáo Dục</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleThemPhoCap} className="p-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Địa bàn Khu phố</label>
                  <select
                    value={khuPhoMoi}
                    onChange={(e) => setKhuPhoMoi(e.target.value)}
                    className="w-full rounded border border-slate-300 p-2 text-xs"
                  >
                    <option value="Khu phố 1">Khu phố 1</option>
                    <option value="Khu phố 2">Khu phố 2</option>
                    <option value="Khu phố 3">Khu phố 3</option>
                    <option value="Khu phố 4">Khu phố 4</option>
                    <option value="Khu phố 5">Khu phố 5</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bậc học phổ cập</label>
                  <select
                    value={bacHocMoi}
                    onChange={(e) => setBacHocMoi(e.target.value as any)}
                    className="w-full rounded border border-slate-300 p-2 text-xs"
                  >
                    <option value="MAM_NON_5T">Mầm non 5 tuổi</option>
                    <option value="TIEU_HOC">Tiểu học (Lớp 1-5)</option>
                    <option value="THCS">THCS (Lớp 6-9)</option>
                    <option value="XOA_MU_CHU">Xóa mù chữ</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Độ tuổi điều tra</label>
                <input
                  type="text"
                  value={doTuoiDieuTra}
                  onChange={(e) => setDoTuoiDieuTra(e.target.value)}
                  className="w-full rounded border border-slate-300 p-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tổng số trẻ</label>
                  <input
                    type="number"
                    min="1"
                    value={tongSoTre}
                    onChange={(e) => setTongSoTre(Number(e.target.value))}
                    className="w-full rounded border border-slate-300 p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Trẻ đi học</label>
                  <input
                    type="number"
                    min="0"
                    value={soTreDiHoc}
                    onChange={(e) => setSoTreDiHoc(Number(e.target.value))}
                    className="w-full rounded border border-slate-300 p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nguy cơ bỏ học</label>
                  <input
                    type="number"
                    min="0"
                    value={soTreNguyCo}
                    onChange={(e) => setSoTreNguyCo(Number(e.target.value))}
                    className="w-full rounded border border-slate-300 p-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Biện pháp hỗ trợ / Vận động</label>
                <textarea
                  rows={2}
                  value={bienPhap}
                  onChange={(e) => setBienPhap(e.target.value)}
                  className="w-full rounded border border-slate-300 p-2 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-sky-700 text-white font-bold hover:bg-sky-800"
                >
                  Lưu số liệu điều tra
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CHẤM ĐIỂM TIÊU CHÍ CỘNG ĐỒNG HỌC TẬP */}
      {editingTieuChi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-indigo-900 text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="size-4" />
                <h3 className="font-bold text-sm">Chấm Điểm Tiêu Chí Cộng Đồng Học Tập</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingTieuChi(null)}
                className="text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleLuuDiemTieuChi} className="p-4 space-y-3 text-xs">
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200 text-slate-700">
                <div className="font-bold text-slate-900">{editingTieuChi.tenTieuChi}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Điểm tối đa quy định: {editingTieuChi.diemToiDa} điểm</div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Điểm tự chấm (tối đa {editingTieuChi.diemToiDa} điểm)
                </label>
                <input
                  type="number"
                  min="0"
                  max={editingTieuChi.diemToiDa}
                  value={diemTuCham}
                  onChange={(e) => setDiemTuCham(Number(e.target.value))}
                  className="w-full rounded border border-slate-300 p-2 text-xs font-bold font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Minh chứng kết quả đạt được</label>
                <textarea
                  rows={3}
                  value={minhChung}
                  onChange={(e) => setMinhChung(e.target.value)}
                  className="w-full rounded border border-slate-300 p-2 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingTieuChi(null)}
                  className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-indigo-700 text-white font-bold hover:bg-indigo-800"
                >
                  Cập nhật đánh giá
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
