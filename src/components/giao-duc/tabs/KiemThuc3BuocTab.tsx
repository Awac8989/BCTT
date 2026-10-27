import React, { useState, useMemo } from "react";
import {
  ShieldCheck,
  Utensils,
  Thermometer,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Search,
  Filter,
  School,
  MapPin,
  Calendar,
  FileText,
  Refrigerator,
  Flame,
  Droplets,
  ExternalLink,
} from "lucide-react";
import { useAppState } from "@/services/app-state";
import { type KiemThuc3BuocItem } from "@/data/domain-mock";
import { ModalThemKiemThuc3Buoc } from "../modals/ModalThemKiemThuc3Buoc";

export const KiemThuc3BuocTab: React.FC = () => {
  const { kiemThuc3BuocList } = useAppState();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterKetLuan, setFilterKetLuan] = useState<string>("ALL");
  const [filterKhuPho, setFilterKhuPho] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<KiemThuc3BuocItem | null>(null);

  const filteredList = useMemo(() => {
    return (kiemThuc3BuocList || []).filter((item) => {
      const matchSearch =
        item.tenCoSo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.maPhieu.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.khuPho.toLowerCase().includes(searchTerm.toLowerCase());
      const matchKl = filterKetLuan === "ALL" || item.ketLuanChung === filterKetLuan;
      const matchKp = filterKhuPho === "ALL" || item.khuPho === filterKhuPho;
      return matchSearch && matchKl && matchKp;
    });
  }, [kiemThuc3BuocList, searchTerm, filterKetLuan, filterKhuPho]);

  const totalSuatAn = (kiemThuc3BuocList || []).reduce((acc, i) => acc + (i.soSuatAn || 0), 0);
  const anToanCount = (kiemThuc3BuocList || []).filter((i) => i.ketLuanChung === "DU_DIEU_KIEN_AN_TOAN").length;
  const khacPhucCount = (kiemThuc3BuocList || []).filter((i) => i.ketLuanChung !== "DU_DIEU_KIEN_AN_TOAN").length;

  return (
    <div className="space-y-6">
      {/* Banner Nghiệp vụ Quyết định 1246 */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-emerald-800/50 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-xs rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            <Utensils className="size-3.5" />
            Nghiệp vụ Chuyên môn Y tế &amp; Giáo dục · QĐ 1246/QĐ-BYT
          </div>
          <h3 className="text-2xl font-bold mb-2">
            Sổ Nhật Ký Kiểm Thực 3 Bước &amp; Lưu Mẫu Bếp Ăn Bán Trú Học Đường
          </h3>
          <p className="text-slate-300 text-xs md:text-sm leading-relaxed mb-4">
            Giám sát chặt chẽ chuỗi cung ứng thực phẩm tươi sống, tuân thủ nguyên tắc bếp ăn một chiều, kiểm tra cảm quan trước giờ ăn và lưu mẫu thức ăn tối thiểu 24 giờ trong tủ lạnh chuyên dụng niêm phong nhiệt độ chuẩn 2°C - 8°C.
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="bg-emerald-800/60 border border-emerald-700/60 px-3 py-1 rounded-lg flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="size-3.5 text-emerald-400" />
              100% mẫu lưu niêm phong $\ge$ 24 giờ
            </span>
            <span className="bg-emerald-800/60 border border-emerald-700/60 px-3 py-1 rounded-lg flex items-center gap-1.5 font-medium">
              <Refrigerator className="size-3.5 text-sky-400" />
              Tủ lạnh lưu mẫu đạt chuẩn 2°C - 8°C
            </span>
            <span className="bg-emerald-800/60 border border-emerald-700/60 px-3 py-1 rounded-lg flex items-center gap-1.5 font-medium">
              <Droplets className="size-3.5 text-teal-400" />
              Nguồn nước sạch QCVN 01-1:2018/BYT
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Tổng bếp ăn bán trú</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{(kiemThuc3BuocList || []).length}</span>
            <span className="text-xs font-semibold text-emerald-600">cơ sở theo dõi</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Mầm non &amp; Tiểu học</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Tổng suất ăn bán trú/ngày</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-700">{totalSuatAn.toLocaleString("vi-VN")}</span>
            <span className="text-xs font-semibold text-slate-600">suất/ngày</span>
          </div>
          <span className="text-[11px] text-emerald-600 mt-1 block">Đảm bảo dinh dưỡng học đường</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Đủ điều kiện an toàn (Đạt)</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-teal-700">{anToanCount}</span>
            <span className="text-xs font-semibold text-teal-600">cơ sở (100% Đạt)</span>
          </div>
          <span className="text-[11px] text-teal-600 mt-1 block">Không có ca ngộ độc thực phẩm</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Cần khắc phục / Nhắc nhở</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-amber-600">{khacPhucCount}</span>
            <span className="text-xs font-semibold text-amber-700">cơ sở</span>
          </div>
          <span className="text-[11px] text-amber-600 mt-1 block">Khắc phục trong 07 ngày</span>
        </div>
      </div>

      {/* Filter and Action Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[220px] max-w-sm flex-1">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo tên trường, mã phiếu, khu phố..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <Filter className="size-3.5 text-slate-400" />
            <select
              value={filterKetLuan}
              onChange={(e) => setFilterKetLuan(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700"
            >
              <option value="ALL">Tất cả kết luận</option>
              <option value="DU_DIEU_KIEN_AN_TOAN">Đủ điều kiện an toàn</option>
              <option value="YEU_CAU_KHAC_PHUC">Yêu cầu khắc phục</option>
              <option value="DINH_CHI_BEP_AN">Tạm đình chỉ</option>
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="size-4" />
          Ghi Sổ Kiểm Thực 3 Bước Mới (QĐ 1246)
        </button>
      </div>

      {/* List of 3-Step Inspection Records */}
      <div className="space-y-4">
        {filteredList.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
            <Utensils className="size-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-600">Không tìm thấy nhật ký kiểm thực phù hợp</p>
            <p className="text-xs text-slate-400">Vui lòng điều chỉnh lại bộ lọc hoặc từ khóa tìm kiếm</p>
          </div>
        ) : (
          filteredList.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-all space-y-4"
            >
              {/* Item Header */}
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {item.maPhieu}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">{item.tenCoSo}</h4>
                    <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-full">
                      {item.khuPho}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3.5 text-slate-400" />
                      Ngày kiểm tra: <strong className="text-slate-700">{item.ngayKiemTra}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <Utensils className="size-3.5 text-emerald-600" />
                      Quy mô: <strong className="text-emerald-700">{item.soSuatAn} suất ăn bán trú</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="size-3.5 text-teal-600" />
                      Cán bộ y tế: <strong className="text-slate-700">{item.canBoYTePhuTrach}</strong>
                    </span>
                  </div>
                </div>

                <div>
                  {item.ketLuanChung === "DU_DIEU_KIEN_AN_TOAN" ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold">
                      <CheckCircle2 className="size-3.5 text-emerald-600" />
                      Đủ Điều Kiện ATTP Bán Trú
                    </span>
                  ) : item.ketLuanChung === "YEU_CAU_KHAC_PHUC" ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-bold">
                      <AlertTriangle className="size-3.5 text-amber-600" />
                      Yêu Cầu Khắc Phục
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-xs font-bold">
                      <AlertTriangle className="size-3.5 text-rose-600" />
                      Đình Chỉ Hoạt Động Bếp Ăn
                    </span>
                  )}
                </div>
              </div>

              {/* 3 Steps Visual Timeline */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Bước 1 */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span className="flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px]">1</span>
                      Kiểm tra nhập hàng
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${item.buoc1_NhapNguyenLieu?.danhGia === "DAT" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                      {item.buoc1_NhapNguyenLieu?.danhGia === "DAT" ? "ĐẠT" : "CHƯA ĐẠT"}
                    </span>
                  </div>
                  <p className="text-slate-600 line-clamp-2">
                    {item.buoc1_NhapNguyenLieu?.nguonGocThucPham}
                  </p>
                  <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200 flex justify-between">
                    <span>Hóa đơn ATTP: {item.buoc1_NhapNguyenLieu?.hoaDonGiayAttp ? "✅ Có" : "❌ Không"}</span>
                    <span>Bao gói: {item.buoc1_NhapNguyenLieu?.tinhTrangBaoGoiTemMac ? "✅ Chuẩn" : "❌ Lỗi"}</span>
                  </div>
                </div>

                {/* Bước 2 */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span className="flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px]">2</span>
                      Kiểm tra chế biến
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${item.buoc2_CheBien?.danhGia === "DAT" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                      {item.buoc2_CheBien?.danhGia === "DAT" ? "ĐẠT" : "CHƯA ĐẠT"}
                    </span>
                  </div>
                  <div className="space-y-1 text-slate-600">
                    <p>• Bếp 1 chiều: {item.buoc2_CheBien?.quyTrinhBep1Chieu ? "✅ Đảm bảo" : "❌ Chưa đạt"}</p>
                    <p>• Nước sạch: {item.buoc2_CheBien?.nguonNuocSachDatChuan ? "✅ Đạt QCVN" : "❌ Chưa kiểm định"}</p>
                  </div>
                  <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200 flex justify-between">
                    <span>Bảo hộ y tế: {item.buoc2_CheBien?.trangPhucTapDeBaoHo ? "✅ Đủ" : "❌ Thiếu"}</span>
                    <span>Nhiệt độ chín: {item.buoc2_CheBien?.nhietDoCheBienDamBao ? "✅ Đạt" : "❌ Chưa"}</span>
                  </div>
                </div>

                {/* Bước 3 */}
                <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between font-bold text-emerald-950">
                    <span className="flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">3</span>
                      Trước khi ăn &amp; Lưu mẫu 24h
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${item.buoc3_TruocKhiAnVaLuuMau?.danhGia === "DAT" ? "bg-emerald-200 text-emerald-900 font-bold" : "bg-rose-100 text-rose-800"}`}>
                      {item.buoc3_TruocKhiAnVaLuuMau?.danhGia === "DAT" ? "ĐẠT CHUẨN" : "CẦN KHẮC PHỤC"}
                    </span>
                  </div>
                  <p className="text-slate-600 line-clamp-1">
                    Cảm quan: {item.buoc3_TruocKhiAnVaLuuMau?.camQuanMuiViDoChuc}
                  </p>
                  <div className="text-[11px] text-slate-700 pt-1 border-t border-emerald-200 flex items-center justify-between font-medium">
                    <span className="flex items-center gap-1">
                      <Thermometer className="size-3 text-emerald-600" />
                      Nhiệt độ: {item.buoc3_TruocKhiAnVaLuuMau?.nhietDoTuLanhLuuDoC}°C
                    </span>
                    <span>Niêm phong 24h: {item.buoc3_TruocKhiAnVaLuuMau?.niemPhongHopMau24h ? "✅ Đã niêm phong" : "❌ Chưa"}</span>
                  </div>
                </div>
              </div>

              {/* Footer Note */}
              {item.bienPhapXuLy && (
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs flex items-start gap-2 text-slate-600">
                  <FileText className="size-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800">Biện pháp xử lý / Chỉ đạo: </strong>
                    <span>{item.bienPhapXuLy}</span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal Lập sổ */}
      <ModalThemKiemThuc3Buoc
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
