import React, { useState } from "react";
import {
  Sparkles,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Award,
  FileCheck,
  TrendingUp,
  Percent,
  Sliders,
  ChevronRight,
  ShieldCheck,
  TreePine,
  Car,
  Utensils,
  BookOpen,
} from "lucide-react";
import { useAppState, appStore } from "@/services/app-state";
import { type DoThiVanMinhTieuChiItem } from "@/data/domain-mock";
import { toast } from "sonner";

export const DoThiVanMinhTab: React.FC = () => {
  const { doThiVanMinhList } = useAppState();
  const [editingItem, setEditingItem] = useState<DoThiVanMinhTieuChiItem | null>(null);
  const [inputDiem, setInputDiem] = useState<number>(10);
  const [inputDatChuan, setInputDatChuan] = useState<boolean>(true);
  const [inputGhiChu, setInputGhiChu] = useState<string>("");

  const items = doThiVanMinhList || [];
  const tongDiemToiDa = items.reduce((s, i) => s + i.diemToiDa, 0);
  const tongDiemDat = items.reduce((s, i) => s + (i.diemDanhGia !== undefined ? i.diemDanhGia : i.diemDatDuoc), 0);
  const datChuanCount = items.filter((i) => i.datChuan || i.ketQua === "DAT_CHUAN").length;
  const tyLeDatPercent = items.length ? Number(((datChuanCount / items.length) * 100).toFixed(1)) : 0;
  const isEligible = datChuanCount === items.length && tongDiemDat >= 90;

  const handleOpenEdit = (item: DoThiVanMinhTieuChiItem) => {
    setEditingItem(item);
    setInputDiem(item.diemDanhGia !== undefined ? item.diemDanhGia : item.diemDatDuoc);
    setInputDatChuan(item.datChuan ?? (item.ketQua === "DAT_CHUAN"));
    setInputGhiChu(item.ghiChu || item.ghiChuThucHien || "");
  };

  const handleSaveAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    appStore.danhGiaDoThiVanMinh(editingItem.id, {
      datChuan: inputDatChuan,
      diemDanhGia: Number(inputDiem),
      ghiChu: inputGhiChu,
      nguoiDanhGia: "Hội đồng Đánh giá Đô thị Văn minh Phường",
    });

    toast.success(`Đã cập nhật đánh giá Tiêu chí ${editingItem.maTieuChi}`, {
      description: `Điểm: ${inputDiem}/${editingItem.diemToiDa}đ · Kết quả: ${inputDatChuan ? "Đạt chuẩn" : "Cần hoàn thiện"}`,
    });
    setEditingItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Banner Đô thị văn minh QĐ 04/2022 */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-950 text-white rounded-2xl p-6 shadow-md border border-indigo-900/40 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 backdrop-blur-xs rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            <Award className="size-3.5" />
            Bộ Tiêu Chí Quốc Gia · Quyết định 04/2022/QĐ-TTg của Thủ tướng Chính phủ
          </div>
          <h3 className="text-2xl font-bold mb-2">
            Đánh Giá Chuẩn Đô Thị Văn Minh Cấp Phường (9 Tiêu Chí - 52 Chỉ Tiêu)
          </h3>
          <p className="text-slate-300 text-xs md:text-sm leading-relaxed mb-4">
            Theo dõi, tự chấm điểm và lập hồ sơ đề nghị công nhận &ldquo;Phường Đạt Chuẩn Đô Thị Văn Minh&rdquo; theo định kỳ 5 năm một lần; đảm bảo quy hoạch không gian xanh, an ninh trật tự, trật tự đô thị và dịch vụ công trực tuyến chất lượng cao.
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className={`px-3 py-1 rounded-lg flex items-center gap-1.5 font-bold ${isEligible ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/40" : "bg-amber-600/30 text-amber-300 border border-amber-500/40"}`}>
              {isEligible ? <CheckCircle2 className="size-3.5 text-emerald-400" /> : <AlertTriangle className="size-3.5 text-amber-400" />}
              {isEligible ? "ĐỦ ĐIỀU KIỆN ĐỀ NGHỊ CÔNG NHẬN PHƯỜNG ĐÔ THỊ VĂN MINH" : "ĐANG HOÀN THIỆN CÁC CHỈ TIÊU CHƯA ĐẠT"}
            </span>
            <span className="bg-indigo-900/60 border border-indigo-700/60 px-3 py-1 rounded-lg flex items-center gap-1.5 font-medium">
              <Sparkles className="size-3.5 text-indigo-300" />
              Tổng điểm: {tongDiemDat} / {tongDiemToiDa} điểm ({((tongDiemDat / tongDiemToiDa) * 100).toFixed(1)}%)
            </span>
          </div>
        </div>
      </div>

      {/* KPI Progress Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Số tiêu chí đạt chuẩn</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-indigo-900">{datChuanCount} / {items.length}</span>
            <span className="text-xs font-semibold text-emerald-600">tiêu chí</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Tỷ lệ đạt {tyLeDatPercent}%</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Tổng điểm tự chấm</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-700">{tongDiemDat}</span>
            <span className="text-xs font-semibold text-slate-600">/ {tongDiemToiDa} điểm</span>
          </div>
          <span className="text-[11px] text-emerald-600 mt-1 block">Yêu cầu $\ge$ 90 điểm để công nhận</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Chu kỳ công nhận</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-blue-800">5 năm</span>
            <span className="text-xs font-semibold text-slate-600">Giai đoạn 2026-2030</span>
          </div>
          <span className="text-[11px] text-blue-600 mt-1 block">UBND TP. Thủ Dầu Một thẩm định</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Mức độ hài lòng của dân</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-purple-700">97.8%</span>
            <span className="text-xs font-semibold text-purple-600">Rất hài lòng</span>
          </div>
          <span className="text-[11px] text-purple-600 mt-1 block">Khảo sát qua Zalo &amp; Cổng DVC</span>
        </div>
      </div>

      {/* Grid of 9 Criteria */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Building2 className="size-4 text-indigo-600" />
            Bảng Đánh Giá Chi Tiết 9 Tiêu Chí Đô Thị Văn Minh (QĐ 04/2022/QĐ-TTg)
          </h4>
          <span className="text-xs text-slate-500 font-medium">
            Nhấp vào từng tiêu chí để xem chỉ tiêu thành phần &amp; chấm điểm
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => {
            const isDat = item.datChuan ?? (item.ketQua === "DAT_CHUAN");
            const diemHienTai = item.diemDanhGia !== undefined ? item.diemDanhGia : item.diemDatDuoc;
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                      {item.maTieuChi}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 ${
                        isDat
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {isDat ? <CheckCircle2 className="size-3 text-emerald-600" /> : <AlertTriangle className="size-3 text-amber-600" />}
                      {isDat ? "ĐẠT CHUẨN" : "CẦN BỔ SUNG"}
                    </span>
                  </div>

                  <h5 className="text-sm font-bold text-slate-900 leading-snug">{item.tenTieuChi}</h5>

                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {item.noiDungChuanHoa}
                  </p>

                  <div className="flex items-center justify-between text-xs pt-2">
                    <span className="text-slate-500 font-medium">Điểm đánh giá:</span>
                    <strong className="text-indigo-900 font-extrabold text-sm">
                      {diemHienTai} / {item.diemToiDa} điểm
                    </strong>
                  </div>

                  {item.ghiChuThucHien && (
                    <p className="text-[11px] text-slate-500 italic">
                      Ghi chú: {item.ghiChuThucHien}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {item.soChiTieuThanhPhan ? `${item.soChiTieuThanhPhan} chỉ tiêu con` : "Đầy đủ minh chứng"}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(item)}
                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Sliders className="size-3.5" />
                    Chấm điểm / Điều chỉnh
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL CHẤM ĐIỂM TIÊU CHÍ */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-700 to-indigo-900 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">
                  Đánh Giá Tiêu Chí {editingItem.maTieuChi} (QĐ 04/2022)
                </h3>
                <p className="text-xs text-indigo-200">{editingItem.tenTieuChi}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveAssessment} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700">
                <span className="font-bold block mb-1">Nội dung chuẩn hóa:</span>
                <p>{editingItem.noiDungChuanHoa}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Điểm đánh giá (Tối đa {editingItem.diemToiDa}đ) *
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={editingItem.diemToiDa}
                    step={1}
                    required
                    value={inputDiem}
                    onChange={(e) => setInputDiem(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-bold text-indigo-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Kết luận tiêu chí</label>
                  <select
                    value={inputDatChuan ? "DAT" : "CHUA_DAT"}
                    onChange={(e) => setInputDatChuan(e.target.value === "DAT")}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-bold"
                  >
                    <option value="DAT">✅ ĐẠT CHUẨN ĐÔ THỊ VĂN MINH</option>
                    <option value="CHUA_DAT">⚠️ CẦN BỔ SUNG / HOÀN THIỆN</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Minh chứng / Hồ sơ kiểm chứng kèm theo
                </label>
                <textarea
                  rows={3}
                  value={inputGhiChu}
                  onChange={(e) => setInputGhiChu(e.target.value)}
                  placeholder="Ghi rõ số văn bản, nghị quyết, biên bản nghiệm thu hoặc báo cáo thực tế..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-xs cursor-pointer"
                >
                  Lưu Đánh Giá
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
