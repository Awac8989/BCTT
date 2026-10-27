import React, { useState } from "react";
import {
  HeartHandshake,
  Flame,
  Accessibility,
  Home,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  Filter,
  CreditCard,
  Banknote,
  Printer,
  FileCheck,
  Building2,
  ShieldCheck,
  Hammer,
} from "lucide-react";
import { useAppState, appStore } from "@/services/app-state";
import {
  type ThoCungLietSiItem,
  type HoiDongKhuyetTatItem,
  type QuyDenOnDapNghiaItem,
  type NhaTinhNghiaItem,
} from "@/data/domain-mock";
import { toast } from "sonner";

export const ThoCungKhuyetTatTab: React.FC = () => {
  const {
    thoCungLietSiList,
    hoiDongKhuyetTatList,
    quyDenOnList,
    nhaTinhNghiaList,
  } = useAppState();

  const [activeSubTab, setActiveSubTab] = useState<"THO_CUNG" | "KHUYET_TAT" | "QUY_DEN_ON">("THO_CUNG");
  const [searchTerm, setSearchTerm] = useState("");

  // State Modal Chi trả thờ cúng
  const [chiTraItem, setChiTraItem] = useState<ThoCungLietSiItem | null>(null);
  const [hinhThucNhan, setHinhThucNhan] = useState<"TIEN_MAT" | "CHUYEN_KHOAN_ATM">("CHUYEN_KHOAN_ATM");

  // State Modal Cấp giấy chứng nhận khuyết tật
  const [capGiayItem, setCapGiayItem] = useState<HoiDongKhuyetTatItem | null>(null);
  const [soGiayMoi, setSoGiayMoi] = useState("");
  const [ketLuanMoi, setKetLuanMoi] = useState("");

  // State Modal Cập nhật tiến độ nhà tình nghĩa
  const [editingNha, setEditingNha] = useState<NhaTinhNghiaItem | null>(null);
  const [tienDoMoi, setTienDoMoi] = useState(100);

  const tcItems = thoCungLietSiList || [];
  const hdktItems = hoiDongKhuyetTatList || [];
  const qdoItems = quyDenOnList || [];
  const ntnItems = nhaTinhNghiaList || [];

  // Tính toán số liệu Thờ cúng
  const daChiTraCount = tcItems.filter((i) => i.trangThaiChiTra === "DA_CHI_TRA").length;
  const choChiTraCount = tcItems.length - daChiTraCount;
  const tongTienThoCung = tcItems.length * 1400000;

  // Tính toán số liệu Khuyết tật
  const dacBietNangCount = hdktItems.filter((i) => i.mucDoKhuyetTat === "DAC_BIET_NANG").length;
  const daCapGiayCount = hdktItems.filter((i) => i.trangThaiCapGiay === "DA_CAP_GIAY").length;

  // Tính toán Quỹ Đền ơn đáp nghĩa
  const tongThuQuy = qdoItems
    .filter((i) => i.loaiGiaoDich === "THU_QUY")
    .reduce((s, i) => s + (i.soTienVND || 0), 0);
  const tongChiQuy = qdoItems
    .filter((i) => i.loaiGiaoDich === "CHI_HO_TRO")
    .reduce((s, i) => s + (i.soTienVND || 0), 0);
  const tonQuyHienTai = tongThuQuy - tongChiQuy;

  const handleXacNhanChiTra = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chiTraItem) return;
    appStore.chiTraThoCungLietSi(chiTraItem.id, hinhThucNhan);
    toast.success(`Đã chi trả chế độ thờ cúng 1.400.000 VNĐ cho thân nhân liệt sĩ ${chiTraItem.hoTenLietSi}!`, {
      description: `Hình thức: ${hinhThucNhan === "CHUYEN_KHOAN_ATM" ? "Chuyển khoản ATM qua tài khoản ngân hàng" : "Tiền mặt tại Bưu cục Phường"}`,
    });
    setChiTraItem(null);
  };

  const handleCapGiayKhuyetTat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!capGiayItem) return;
    const soGiay = soGiayMoi || `GCN-KT/2026/${Date.now().toString().slice(-3)}`;
    appStore.capGiayXacNhanKhuyetTat(capGiayItem.id, soGiay, ketLuanMoi);
    toast.success(`Chủ tịch UBND Phường đã ký số cấp Giấy xác nhận mức độ khuyết tật ${soGiay}!`);
    setCapGiayItem(null);
  };

  const handleCapNhatTienDoNha = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNha) return;
    appStore.capNhatTienDoNhaTinhNghia(
      editingNha.id,
      Number(tienDoMoi),
      Number(tienDoMoi) >= 100 ? "DA_BAN_GIAO" : "DANG_THI_CONG"
    );
    toast.success(`Đã cập nhật tiến độ thi công Nhà Tình nghĩa hộ ${editingNha.hoTenChuHo} đạt ${tienDoMoi}%!`);
    setEditingNha(null);
  };

  return (
    <div className="space-y-5">
      {/* Banner Nghiệp vụ */}
      <div className="rounded-xl border border-rose-200 bg-gradient-to-r from-rose-950 via-red-950 to-slate-950 p-5 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/20 text-rose-300 border border-rose-400/30 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
            <Flame className="size-3.5 text-rose-400" />
            Pháp lệnh 02/2020 · Nghị định 131/2021/NĐ-CP · Nghị định 45/2017/NĐ-CP
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">
            Chế Độ Thờ Cúng Liệt Sĩ, Giám Định Khuyết Tật &amp; Quỹ Đền Ơn Đáp Nghĩa
          </h2>
          <p className="mt-2 text-xs md:text-sm text-slate-300 leading-relaxed">
            Thực hiện chi trả chính sách trợ cấp thờ cúng liệt sĩ định mức 1.400.000 VNĐ/năm/liệt sĩ theo Mẫu số 04; vận hành Hội đồng xác định mức độ khuyết tật cấp phường cấp Giấy xác nhận Mẫu số 03; quản lý Quỹ Đền ơn đáp nghĩa và tiến độ hỗ trợ xây sửa Nhà Tình nghĩa.
          </p>

          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="bg-rose-950/80 border border-rose-700/60 px-2.5 py-1 rounded-md flex items-center gap-1.5">
              <Banknote className="size-3.5 text-amber-300" />
              Định mức thờ cúng: 1.400.000 đ/năm/liệt sĩ
            </span>
            <span className="bg-rose-950/80 border border-rose-700/60 px-2.5 py-1 rounded-md flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-emerald-300" />
              Hội đồng Khuyết tật: Cấp GCN điện tử
            </span>
            <span className="bg-rose-950/80 border border-rose-700/60 px-2.5 py-1 rounded-md flex items-center gap-1.5">
              <Home className="size-3.5 text-sky-300" />
              Tồn Quỹ ĐƠĐN: {(tonQuyHienTai / 1000000).toFixed(1)} triệu VNĐ
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards Thống kê */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Hồ sơ Thờ cúng Liệt sĩ</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{tcItems.length}</span>
            <span className="text-xs font-bold text-rose-600">liệt sĩ</span>
          </div>
          <span className="text-[11px] text-emerald-600 mt-1 block">Đã chi trả {daChiTraCount}/{tcItems.length} hồ sơ</span>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Hội đồng Khuyết tật</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-indigo-700">{hdktItems.length}</span>
            <span className="text-xs font-bold text-indigo-600">hồ sơ</span>
          </div>
          <span className="text-[11px] text-indigo-600 mt-1 block">{dacBietNangCount} trường hợp đặc biệt nặng</span>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Tồn Quỹ Đền ơn đáp nghĩa</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-700">
              {(tonQuyHienTai / 1000000).toFixed(1)} tr
            </span>
            <span className="text-xs font-bold text-emerald-600">VNĐ</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Thu: {(tongThuQuy / 1000000).toFixed(1)}tr · Chi: {(tongChiQuy / 1000000).toFixed(1)}tr</span>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Nhà Tình nghĩa (Năm 2026)</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-amber-600">{ntnItems.length}</span>
            <span className="text-xs font-bold text-amber-700">căn</span>
          </div>
          <span className="text-[11px] text-emerald-600 mt-1 block">
            {ntnItems.filter((n) => n.trangThai === "DA_BAN_GIAO").length} căn đã bàn giao đưa vào sử dụng
          </span>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-200 bg-white rounded-t-lg px-3 pt-2 gap-2">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveSubTab("THO_CUNG")}
            className={`pb-2.5 px-3 font-bold text-xs border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeSubTab === "THO_CUNG"
                ? "border-rose-600 text-rose-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Flame className="size-3.5" />
            1. Trợ cấp Thờ cúng Liệt sĩ (NĐ 131/2021)
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab("KHUYET_TAT")}
            className={`pb-2.5 px-3 font-bold text-xs border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeSubTab === "KHUYET_TAT"
                ? "border-rose-600 text-rose-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Accessibility className="size-3.5" />
            2. Hội đồng Xác định Mức độ Khuyết tật (TT 01/2019)
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab("QUY_DEN_ON")}
            className={`pb-2.5 px-3 font-bold text-xs border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeSubTab === "QUY_DEN_ON"
                ? "border-rose-600 text-rose-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Home className="size-3.5" />
            3. Quỹ Đền ơn đáp nghĩa &amp; Nhà Tình nghĩa (NĐ 45/2017)
          </button>
        </div>
      </div>

      {/* 1. SUB-TAB THỜ CÚNG LIỆT SĨ */}
      {activeSubTab === "THO_CUNG" && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-slate-200 overflow-x-auto shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold">
                  <th className="py-2.5 px-3">Mã HS / Liệt sĩ</th>
                  <th className="py-2.5 px-3">Người thờ cúng được ủy quyền</th>
                  <th className="py-2.5 px-3">Quan hệ &amp; Địa chỉ</th>
                  <th className="py-2.5 px-3">Văn bản ủy quyền</th>
                  <th className="py-2.5 px-3 text-right">Định mức/năm</th>
                  <th className="py-2.5 px-3 text-center">Tình trạng chi trả</th>
                  <th className="py-2.5 px-3 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tcItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3">
                      <span className="font-mono text-[10px] text-slate-500 block">{item.maHoSo}</span>
                      <strong className="text-slate-900 text-sm block">Liệt sĩ {item.hoTenLietSi}</strong>
                      <span className="text-[11px] text-slate-500">
                        Sinh {item.namSinh} · Hy sinh {item.namHySinh}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-800">{item.hoTenNguoiThoCung}</div>
                      <div className="text-[11px] text-slate-500 font-mono">CCCD: {item.cccdNguoiThoCung}</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      <span className="font-medium text-slate-800 block">{item.quanHeVoiLietSi}</span>
                      <span className="text-[11px] text-slate-500">{item.diaChiNguoiThoCung}</span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {item.soVanBanUyQuyen}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-rose-700">
                      {item.dinhMucNamVND.toLocaleString("vi-VN")} đ
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {item.trangThaiChiTra === "DA_CHI_TRA" ? (
                        <div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1">
                            <CheckCircle2 className="size-3 text-emerald-600" />
                            Đã chi trả
                          </span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            {item.ngayChiTra} ({item.hinhThucNhan === "CHUYEN_KHOAN_ATM" ? "ATM" : "Tiền mặt"})
                          </span>
                        </div>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 inline-flex items-center gap-1">
                          <Clock className="size-3 text-amber-600" />
                          Chờ chi trả dịp 27/7
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {item.trangThaiChiTra !== "DA_CHI_TRA" ? (
                        <button
                          type="button"
                          onClick={() => setChiTraItem(item)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold transition-all shadow-2xs flex items-center gap-1 cursor-pointer mx-auto"
                        >
                          <CreditCard className="size-3.5" />
                          Chi trả chế độ
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => toast.info(`Đang in Giấy biên nhận kinh phí thờ cúng liệt sĩ ${item.hoTenLietSi}...`)}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer mx-auto"
                        >
                          <Printer className="size-3" />
                          In phiếu chi
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. SUB-TAB HỘI ĐỒNG KHUYẾT TẬT */}
      {activeSubTab === "KHUYET_TAT" && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-slate-200 overflow-x-auto shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold">
                  <th className="py-2.5 px-3">Mã hồ sơ / Đối tượng</th>
                  <th className="py-2.5 px-3">Dạng tật xác định</th>
                  <th className="py-2.5 px-3">Mức độ khuyết tật</th>
                  <th className="py-2.5 px-3">Kết luận Hội đồng</th>
                  <th className="py-2.5 px-3">Số Giấy chứng nhận</th>
                  <th className="py-2.5 px-3 text-center">Trạng thái cấp GCN</th>
                  <th className="py-2.5 px-3 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {hdktItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3">
                      <span className="font-mono text-[10px] text-slate-500 block">{item.maHoSo}</span>
                      <strong className="text-slate-900 text-sm block">{item.hoTen}</strong>
                      <span className="text-[11px] text-slate-500">
                        Sinh {item.ngaySinh} · {item.khuPho}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800">
                        {item.dangTat === "VAN_DONG"
                          ? "Khuyết tật Vận động"
                          : item.dangTat === "TRI_TUE"
                          ? "Khuyết tật Trí tuệ"
                          : item.dangTat === "NHIN"
                          ? "Khuyết tật Nhìn"
                          : item.dangTat === "NGHE_NOI"
                          ? "Khuyết tật Nghe - nói"
                          : "Khuyết tật Thần kinh"}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.mucDoKhuyetTat === "DAC_BIET_NANG"
                            ? "bg-rose-100 text-rose-800 border border-rose-300"
                            : item.mucDoKhuyetTat === "NANG"
                            ? "bg-amber-100 text-amber-800 border border-amber-300"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {item.mucDoKhuyetTat === "DAC_BIET_NANG"
                          ? "Đặc biệt nặng (Hệ số 2.5)"
                          : item.mucDoKhuyetTat === "NANG"
                          ? "Nặng (Hệ số 1.5)"
                          : "Nhẹ"}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 max-w-xs">
                      <div className="line-clamp-2">{item.ketLuan}</div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Họp ngày: {item.ngayHopHoiDong}</span>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-800">
                      {item.soGiayXacNhan || "Chưa cấp"}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {item.trangThaiCapGiay === "DA_CAP_GIAY" ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1">
                          <CheckCircle2 className="size-3 text-emerald-600" />
                          Đã cấp Giấy XN
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 inline-flex items-center gap-1">
                          <Clock className="size-3 text-amber-600" />
                          Chờ Chủ tịch ký
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {item.trangThaiCapGiay !== "DA_CAP_GIAY" ? (
                        <button
                          type="button"
                          onClick={() => {
                            setCapGiayItem(item);
                            setSoGiayMoi(item.soGiayXacNhan || `GCN-KT/2026/0${Math.floor(Math.random() * 90 + 10)}`);
                            setKetLuanMoi(item.ketLuan);
                          }}
                          className="px-2.5 py-1 bg-indigo-700 hover:bg-indigo-800 text-white rounded text-xs font-bold transition-all shadow-2xs flex items-center gap-1 cursor-pointer mx-auto"
                        >
                          <FileCheck className="size-3.5" />
                          Ký số cấp GCN
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => toast.info(`Đang xuất file in Giấy chứng nhận khuyết tật Mẫu 03 cho ${item.hoTen}...`)}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer mx-auto"
                        >
                          <Printer className="size-3" />
                          In GCN Mẫu 03
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. SUB-TAB QUỸ ĐỀN ƠN ĐÁP NGHĨA & NHÀ TÌNH NGHĨA */}
      {activeSubTab === "QUY_DEN_ON" && (
        <div className="space-y-5">
          {/* Sổ thu chi Quỹ */}
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <HeartHandshake className="size-4 text-rose-600" />
                <h3 className="font-bold text-sm text-slate-900">Sổ Theo Dõi Thu - Chi Quỹ Đền Ơn Đáp Nghĩa Phường</h3>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Tồn quỹ khả dụng: {tonQuyHienTai.toLocaleString("vi-VN")} VNĐ
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold">
                    <th className="py-2 px-2.5">Loại</th>
                    <th className="py-2 px-2.5">Nội dung giao dịch</th>
                    <th className="py-2 px-2.5">Đơn vị / Cá nhân</th>
                    <th className="py-2 px-2.5 text-right">Số tiền (VNĐ)</th>
                    <th className="py-2 px-2.5">Ngày thực hiện</th>
                    <th className="py-2 px-2.5">Chứng từ số</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {qdoItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2 px-2.5">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            item.loaiGiaoDich === "THU_QUY"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {item.loaiGiaoDich === "THU_QUY" ? "THU QUỸ" : "CHI HỖ TRỢ"}
                        </span>
                      </td>
                      <td className="py-2 px-2.5 font-medium text-slate-800">{item.noiDung}</td>
                      <td className="py-2 px-2.5 text-slate-600">{item.donViCaNhan}</td>
                      <td
                        className={`py-2 px-2.5 text-right font-mono font-bold ${
                          item.loaiGiaoDich === "THU_QUY" ? "text-emerald-700" : "text-rose-700"
                        }`}
                      >
                        {item.loaiGiaoDich === "THU_QUY" ? "+" : "-"}
                        {item.soTienVND.toLocaleString("vi-VN")} đ
                      </td>
                      <td className="py-2 px-2.5 text-slate-500">{item.ngayThucHien}</td>
                      <td className="py-2 px-2.5 font-mono text-[11px] text-slate-500">{item.chungTuSo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Hồ sơ Nhà Tình nghĩa */}
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <Home className="size-4 text-amber-600" />
                <h3 className="font-bold text-sm text-slate-900">Tiến Độ Xây Mới &amp; Sửa Chữa Nhà Tình Nghĩa Người Có Công</h3>
              </div>
              <span className="text-xs text-slate-500 font-medium">Định mức: Xây mới 80tr · Sửa chữa 40tr</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ntnItems.map((nha) => (
                <div key={nha.id} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60 space-y-2 text-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <strong className="text-sm text-slate-900 block">{nha.hoTenChuHo}</strong>
                      <span className="text-slate-500 text-[11px]">{nha.diaChi} ({nha.khuPho})</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        nha.trangThai === "DA_BAN_GIAO"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-amber-100 text-amber-800 border border-amber-300"
                      }`}
                    >
                      {nha.trangThai === "DA_BAN_GIAO" ? "Đã bàn giao" : "Đang thi công"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-200">
                    <div>
                      <span className="text-slate-500 block">Kinh phí Quỹ hỗ trợ:</span>
                      <strong className="text-rose-700 font-mono">{nha.kinhPhiHoTroVND.toLocaleString("vi-VN")} đ</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Tổng dự toán xây dựng:</span>
                      <strong className="text-slate-800 font-mono">{nha.tongDuToanVND.toLocaleString("vi-VN")} đ</strong>
                    </div>
                  </div>

                  {/* Thanh tiến độ */}
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-500">Tiến độ thi công hoàn thành:</span>
                      <strong className="text-emerald-700 font-mono">{nha.tienDoThiCongPercent}%</strong>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-emerald-600 h-2 rounded-full transition-all"
                        style={{ width: `${nha.tienDoThiCongPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <span className="text-slate-400">Khởi công: {nha.ngayKhoiCong}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingNha(nha);
                        setTienDoMoi(nha.tienDoThiCongPercent);
                      }}
                      className="px-2 py-0.5 bg-sky-50 text-sky-700 border border-sky-300 rounded font-bold hover:bg-sky-100 cursor-pointer"
                    >
                      Cập nhật tiến độ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL CHI TRẢ THỜ CÚNG LIỆT SĨ */}
      {chiTraItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-rose-900 text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="size-4" />
                <h3 className="font-bold text-sm">Xác Nhận Chi Trả Trợ Cấp Thờ Cúng Liệt Sĩ</h3>
              </div>
              <button
                type="button"
                onClick={() => setChiTraItem(null)}
                className="text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleXacNhanChiTra} className="p-4 space-y-3 text-xs">
              <div className="p-3 bg-rose-50/70 border border-rose-200 rounded text-slate-800 space-y-1">
                <div>Liệt sĩ: <strong className="text-rose-900">{chiTraItem.hoTenLietSi}</strong></div>
                <div>Người nhận trợ cấp: <strong>{chiTraItem.hoTenNguoiThoCung}</strong> ({chiTraItem.quanHeVoiLietSi})</div>
                <div>Định mức niên hạn 2026: <strong className="text-rose-700 font-mono text-sm">1.400.000 VNĐ</strong></div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phương thức chi trả kinh phí</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setHinhThucNhan("CHUYEN_KHOAN_ATM")}
                    className={`p-2.5 rounded border text-center font-bold cursor-pointer transition-all ${
                      hinhThucNhan === "CHUYEN_KHOAN_ATM"
                        ? "bg-emerald-50 border-emerald-500 text-emerald-800"
                        : "border-slate-300 text-slate-600"
                    }`}
                  >
                    Chuyển khoản ATM
                  </button>
                  <button
                    type="button"
                    onClick={() => setHinhThucNhan("TIEN_MAT")}
                    className={`p-2.5 rounded border text-center font-bold cursor-pointer transition-all ${
                      hinhThucNhan === "TIEN_MAT"
                        ? "bg-emerald-50 border-emerald-500 text-emerald-800"
                        : "border-slate-300 text-slate-600"
                    }`}
                  >
                    Tiền mặt bưu cục
                  </button>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setChiTraItem(null)}
                  className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-emerald-700 text-white font-bold hover:bg-emerald-800"
                >
                  Xác nhận chi trả 1.400.000đ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CẤP GCN MỨC ĐỘ KHUYẾT TẬT */}
      {capGiayItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-indigo-900 text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck className="size-4" />
                <h3 className="font-bold text-sm">Ký Số Cấp Giấy Xác Nhận Khuyết Tật (Mẫu 03)</h3>
              </div>
              <button
                type="button"
                onClick={() => setCapGiayItem(null)}
                className="text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCapGiayKhuyetTat} className="p-4 space-y-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded text-slate-800 space-y-1">
                <div>Họ và tên: <strong className="text-slate-900">{capGiayItem.hoTen}</strong></div>
                <div>Dạng tật: <strong>{capGiayItem.dangTat}</strong></div>
                <div>Mức độ: <strong className="text-indigo-700">{capGiayItem.mucDoKhuyetTat}</strong></div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Số Giấy xác nhận (Mẫu 03)</label>
                <input
                  type="text"
                  required
                  value={soGiayMoi}
                  onChange={(e) => setSoGiayMoi(e.target.value)}
                  className="w-full rounded border border-slate-300 p-2 font-mono font-bold text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kết luận Hội đồng</label>
                <textarea
                  rows={2}
                  value={ketLuanMoi}
                  onChange={(e) => setKetLuanMoi(e.target.value)}
                  className="w-full rounded border border-slate-300 p-2 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCapGiayItem(null)}
                  className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-indigo-700 text-white font-bold hover:bg-indigo-800"
                >
                  Ký số điện tử &amp; Cấp Giấy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CẬP NHẬT TIẾN ĐỘ NHÀ TÌNH NGHĨA */}
      {editingNha && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-amber-800 text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Hammer className="size-4" />
                <h3 className="font-bold text-sm">Cập Nhật Tiến Độ Thi Công Nhà Tình Nghĩa</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingNha(null)}
                className="text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCapNhatTienDoNha} className="p-4 space-y-3 text-xs">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                <div>Chủ hộ: <strong>{editingNha.hoTenChuHo}</strong></div>
                <div>Địa chỉ: {editingNha.diaChi}</div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tiến độ thi công (%): <strong className="text-emerald-700 font-mono">{tienDoMoi}%</strong>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={tienDoMoi}
                  onChange={(e) => setTienDoMoi(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingNha(null)}
                  className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-emerald-700 text-white font-bold hover:bg-emerald-800"
                >
                  Lưu tiến độ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
