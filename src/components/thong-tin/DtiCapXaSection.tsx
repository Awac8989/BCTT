import React, { useState } from "react";
import {
  Activity,
  CheckCircle2,
  TrendingUp,
  Percent,
  Sliders,
  Sparkles,
  Smartphone,
  ShieldCheck,
  CreditCard,
  QrCode,
  Users,
  FileCheck,
  Award,
  Layers,
} from "lucide-react";
import { useAppState, appStore } from "@/services/app-state";
import { type DtiCapXaItem } from "@/data/domain-mock";
import { toast } from "sonner";

export const DtiCapXaSection: React.FC = () => {
  const { dtiCapXaList } = useAppState();

  const [selectedPillar, setSelectedPillar] = useState<string>("ALL");
  const [editingItem, setEditingItem] = useState<DtiCapXaItem | null>(null);
  const [inputThucTe, setInputThucTe] = useState<number>(90);
  const [inputMoTa, setInputMoTa] = useState<string>("");

  const items = dtiCapXaList || [];

  const filteredItems = items.filter((item) => {
    if (selectedPillar === "ALL") return true;
    return item.truCot === selectedPillar;
  });

  const tongChiTieu = items.reduce((s, i) => s + i.chiTieuGiao, 0);
  const tongThucTe = items.reduce((s, i) => s + i.thucTeDat, 0);
  const tyLeHoanThanh = Number(((tongThucTe / tongChiTieu) * 100).toFixed(1));
  const vuotChiTieuCount = items.filter((i) => i.danhGia === "VUOT_CHI_TIEU").length;

  const handleOpenEdit = (item: DtiCapXaItem) => {
    setEditingItem(item);
    setInputThucTe(item.thucTeDat);
    setInputMoTa(item.moTaHienTrang || "");
  };

  const handleSaveUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    appStore.capNhatChiSoDti(editingItem.id, Number(inputThucTe));
    toast.success(`Đã cập nhật chỉ số DTI: ${editingItem.tenChiSo}`, {
      description: `Kết quả thực tế: ${inputThucTe}%`,
    });
    setEditingItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Banner DTI QĐ 922 */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-950 text-white rounded-2xl p-6 shadow-md border border-purple-900/40 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 backdrop-blur-xs rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            <Award className="size-3.5" />
            Bộ Chỉ Số DTI Cấp Xã/Phường · Quyết Định 922/QĐ-BTTTT
          </div>
          <h3 className="text-2xl font-bold mb-2">
            Bộ Chỉ Số Đánh Giá Mức Độ Chuyển Đổi Số DTI Cấp Phường
          </h3>
          <p className="text-slate-300 text-xs md:text-sm leading-relaxed mb-4">
            Đo lường tiến độ chuyển đổi số toàn diện trên 3 trụ cột chiến lược: Chính quyền số (văn bản ký số SmartCA, Một cửa điện tử), Kinh tế số (tuyến phố không dùng tiền mặt VietQR), và Xã hội số (kích hoạt VNeID mức 2, chữ ký số công dân).
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-lg flex items-center gap-1.5 font-bold">
              <CheckCircle2 className="size-3.5 text-emerald-400" />
              XẾP LOẠI DTI PHƯỜNG: XUẤT SẮC (ĐẠT {tyLeHoanThanh}%)
            </span>
            <span className="bg-purple-900/60 border border-purple-700/60 px-3 py-1 rounded-lg flex items-center gap-1.5 font-medium">
              <QrCode className="size-3.5 text-cyan-300" />
              VietQR Tuyến phố không tiền mặt: 88.0%
            </span>
            <span className="bg-purple-900/60 border border-purple-700/60 px-3 py-1 rounded-lg flex items-center gap-1.5 font-medium">
              <ShieldCheck className="size-3.5 text-indigo-300" />
              VNeID mức 2 công dân: 94.6%
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Xếp loại DTI Phường</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-purple-900">XUẤT SẮC</span>
          </div>
          <span className="text-[11px] text-emerald-600 mt-1 block">Thuộc Top đầu TP. Thủ Dầu Một</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Chỉ số vượt kế hoạch</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-700">{vuotChiTieuCount} / {items.length}</span>
            <span className="text-xs font-semibold text-emerald-600">chỉ tiêu</span>
          </div>
          <span className="text-[11px] text-emerald-600 mt-1 block">100% đạt &amp; vượt chỉ tiêu giao</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Ký số SmartCA văn bản</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-sky-700">98.2%</span>
            <span className="text-xs font-semibold text-sky-600">toàn trình</span>
          </div>
          <span className="text-[11px] text-sky-600 mt-1 block">Con dấu điện tử &amp; Chữ ký cá nhân</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Chữ ký số công dân</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-indigo-700">42.5%</span>
            <span className="text-xs font-semibold text-indigo-600">vượt chỉ tiêu</span>
          </div>
          <span className="text-[11px] text-indigo-600 mt-1 block">Chỉ tiêu tỉnh giao: 30%</span>
        </div>
      </div>

      {/* Filter Tabs by Pillar */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          type="button"
          onClick={() => setSelectedPillar("ALL")}
          className={`px-4 py-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${
            selectedPillar === "ALL"
              ? "border-purple-600 text-purple-900 bg-purple-50/50"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Tất Cả 3 Trụ Cột ({items.length})
        </button>
        <button
          type="button"
          onClick={() => setSelectedPillar("CHINH_QUYEN_SO")}
          className={`px-4 py-2 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
            selectedPillar === "CHINH_QUYEN_SO"
              ? "border-sky-600 text-sky-900 bg-sky-50/50"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Layers className="size-3.5 text-sky-600" />
          1. Chính Quyền Số
        </button>
        <button
          type="button"
          onClick={() => setSelectedPillar("KINH_TE_SO")}
          className={`px-4 py-2 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
            selectedPillar === "KINH_TE_SO"
              ? "border-emerald-600 text-emerald-900 bg-emerald-50/50"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <CreditCard className="size-3.5 text-emerald-600" />
          2. Kinh Tế Số (VietQR)
        </button>
        <button
          type="button"
          onClick={() => setSelectedPillar("XA_HOI_SO")}
          className={`px-4 py-2 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
            selectedPillar === "XA_HOI_SO"
              ? "border-indigo-600 text-indigo-900 bg-indigo-50/50"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Users className="size-3.5 text-indigo-600" />
          3. Xã Hội Số (VNeID)
        </button>
      </div>

      {/* Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const isVuot = item.danhGia === "VUOT_CHI_TIEU";
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                    {item.truCot}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 ${
                      isVuot
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-sky-100 text-sky-800"
                    }`}
                  >
                    <CheckCircle2 className="size-3 text-emerald-600" />
                    {isVuot ? "VƯỢT CHỈ TIÊU" : "ĐẠT CHỈ TIÊU"}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 leading-snug">{item.tenChiSo}</h4>

                <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
                  {item.moTaHienTrang}
                </p>

                {/* Progress bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-500">Thực tế đạt:</span>
                    <span className="text-purple-900 font-extrabold text-sm">
                      {item.thucTeDat}{item.donViTinh} / Giao: {item.chiTieuGiao}{item.donViTinh}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isVuot ? "bg-gradient-to-r from-emerald-500 to-teal-500" : "bg-gradient-to-r from-sky-500 to-indigo-500"
                      }`}
                      style={{ width: `${Math.min(100, (item.thucTeDat / item.chiTieuGiao) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(item)}
                  className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Sliders className="size-3.5" />
                  Cập nhật số liệu
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL CẬP NHẬT CHỈ SỐ */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-800 to-indigo-900 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Cập Nhật Chỉ Số DTI Cấp Xã</h3>
                <p className="text-xs text-purple-200">{editingItem.tenChiSo}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveUpdate} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Giá trị thực tế đạt được ({editingItem.donViTinh}) *
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={inputThucTe}
                    onChange={(e) => setInputThucTe(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-bold text-purple-900 text-sm"
                  />
                  <span className="font-bold text-slate-600">{editingItem.donViTinh}</span>
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Chỉ tiêu cấp trên giao: <strong>{editingItem.chiTieuGiao}{editingItem.donViTinh}</strong>
                </span>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Mô tả hiện trạng / Minh chứng hệ thống
                </label>
                <textarea
                  rows={3}
                  value={inputMoTa}
                  onChange={(e) => setInputMoTa(e.target.value)}
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
                  className="px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-bold shadow-xs cursor-pointer"
                >
                  Lưu Cập Nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
