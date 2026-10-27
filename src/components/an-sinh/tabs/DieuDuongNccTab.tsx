import React, { useState, useMemo } from "react";
import {
  HeartHandshake,
  CheckCircle2,
  Clock,
  Building2,
  Home,
  CreditCard,
  Plus,
  Search,
  Filter,
  DollarSign,
  UserCheck,
  Award,
  AlertCircle,
  Briefcase,
  FileText,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { useAppState, appStore } from "@/services/app-state";
import { type DieuDuongNccItem, type KhaoSatHocNgheItem } from "@/data/domain-mock";
import { toast } from "sonner";

export const DieuDuongNccTab: React.FC = () => {
  const { dieuDuongNccList, khaoSatHocNgheList } = useAppState();

  const [activeSubTab, setActiveSubTab] = useState<"DIEU_DUONG" | "HOC_NGHE">("DIEU_DUONG");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterHinhThuc, setFilterHinhThuc] = useState("ALL");
  const [filterTrangThai, setFilterTrangThai] = useState("ALL");

  // Modal State Đăng ký Điều dưỡng
  const [showDangKyModal, setShowDangKyModal] = useState(false);
  const [hoTen, setHoTen] = useState("");
  const [cccd, setCccd] = useState("");
  const [dienDoiTuong, setDienDoiTuong] = useState<DieuDuongNccItem["dienDoiTuong"]>("THUONG_BINH_21_80");
  const [cheDoDieuDuong, setCheDoDieuDuong] = useState<DieuDuongNccItem["cheDoDieuDuong"]>("2_NAM_1_LAN");
  const [hinhThucDangKy, setHinhThucDangKy] = useState<DieuDuongNccItem["hinhThucDangKy"]>("TAI_NHA");
  const [khuPho, setKhuPho] = useState("Khu phố 1");

  // Modal State Khảo sát Học nghề
  const [showHocNgheModal, setShowHocNgheModal] = useState(false);
  const [hnHoTen, setHnHoTen] = useState("");
  const [hnCccd, setHnCccd] = useState("");
  const [hnKhuPho, setHnKhuPho] = useState("Khu phố 3");
  const [hnDoiTuong, setHnDoiTuong] = useState<KhaoSatHocNgheItem["dienDoiTuong"]>("BO_DOI_XUAT_NGU");
  const [hnNganhNghe, setHnNganhNghe] = useState("Kỹ thuật Lái xe tải nặng & Máy xúc công trình (Hạng C)");
  const [hnDoanhNghiep, setHnDoanhNghiep] = useState("Công ty CP Vận tải Quốc tế Sóng Thần / VSIP 1");

  // Filter Điều dưỡng
  const filteredDieuDuong = useMemo(() => {
    return (dieuDuongNccList || []).filter((item) => {
      const matchSearch =
        item.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.cccd.includes(searchTerm) ||
        item.maHoSo.toLowerCase().includes(searchTerm.toLowerCase());
      const matchHt = filterHinhThuc === "ALL" || item.hinhThucDangKy === filterHinhThuc;
      const matchTt = filterTrangThai === "ALL" || item.trangThai === filterTrangThai;
      return matchSearch && matchHt && matchTt;
    });
  }, [dieuDuongNccList, searchTerm, filterHinhThuc, filterTrangThai]);

  // Filter Học nghề
  const filteredHocNghe = useMemo(() => {
    return (khaoSatHocNgheList || []).filter((item) => {
      return (
        item.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.cccd.includes(searchTerm) ||
        item.nguyenVongHocNghe.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [khaoSatHocNgheList, searchTerm]);

  // Thống kê điều dưỡng
  const tongKinhPhi = (dieuDuongNccList || []).reduce((acc, i) => acc + (i.kinhPhiVND || 0), 0);
  const tapTrungCount = (dieuDuongNccList || []).filter((i) => i.hinhThucDangKy === "TAP_TRUNG").length;
  const taiNhaCount = (dieuDuongNccList || []).filter((i) => i.hinhThucDangKy === "TAI_NHA").length;
  const daChiTraCount = (dieuDuongNccList || []).filter((i) => i.trangThai === "DA_CHI_TRA_HOAN_TAT").length;

  const handleCreateDieuDuong = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hoTen.trim() || !cccd.trim()) {
      toast.error("Vui lòng điền họ tên và số CCCD người có công");
      return;
    }
    const kinhPhiVND = hinhThucDangKy === "TAP_TRUNG" ? 4363000 : 2181500;
    appStore.dangKyDieuDuongNcc({
      hoTen,
      cccd,
      namSinh: 1955,
      khuPho,
      dienDoiTuong,
      cheDoDieuDuong,
      namThucHienGanNhat: 2024,
      namHienTai: 2026,
      hinhThucDangKy,
      kinhPhiVND,
      trangThai: "CHO_DUYET",
    });
    toast.success("Đã đăng ký danh sách điều dưỡng phục hồi sức khỏe NCC thành công", {
      description: `Đối tượng: ${hoTen} · Định mức: ${kinhPhiVND.toLocaleString("vi-VN")} đ.`,
    });
    setHoTen("");
    setCccd("");
    setShowDangKyModal(false);
  };

  const handlePheDuyet = (id: string, name: string) => {
    appStore.pheDuyetDieuDuongNcc(id, {
      soQuyetDinh: `QĐ-SLDTBXH-2026/${Math.floor(100 + Math.random() * 900)}`,
      hinhThuc: "TAP_TRUNG",
    });
    toast.success(`Đã phê duyệt chế độ điều dưỡng cho ${name}`);
  };

  const handleChiTra = (id: string, name: string, tien: number) => {
    appStore.chiTraDieuDuongNcc(id);
    toast.success(`Đã chi trả kinh phí ${tien.toLocaleString("vi-VN")} đ cho ${name}`);
  };

  const handleCreateHocNghe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hnHoTen.trim() || !hnCccd.trim()) {
      toast.error("Vui lòng điền họ tên và số CCCD đối tượng khảo sát");
      return;
    }
    appStore.themKhaoSatHocNghe({
      hoTen: hnHoTen,
      cccd: hnCccd,
      namSinh: 2003,
      khuPho: hnKhuPho,
      dienDoiTuong: hnDoiTuong,
      nguyenVongHocNghe: hnNganhNghe,
      trinhDoHocVan: "12/12",
      chinhSachHoTro: "Miễn 100% học phí theo thẻ học nghề Quân nhân xuất ngũ",
      doanhNghiepLienKet: hnDoanhNghiep,
      tinhTrang: "DA_KHAO_SAT",
    });
    toast.success("Tiếp nhận phiếu khảo sát học nghề & việc làm KCN thành công", {
      description: `Học viên: ${hnHoTen} · Nguyện vọng: ${hnNganhNghe}`,
    });
    setHnHoTen("");
    setHnCccd("");
    setShowHocNgheModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Banner Nghiệp vụ Pháp lệnh 02/2020 */}
      <div className="bg-gradient-to-r from-amber-950 via-red-950 to-slate-950 text-white rounded-2xl p-6 shadow-md border border-amber-900/40 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-xs rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            <HeartHandshake className="size-3.5" />
            Nghiệp vụ Người Có Công · Pháp lệnh 02/2020/UBTVQH14 &amp; NĐ 131/2021
          </div>
          <h3 className="text-2xl font-bold mb-2">
            Quản Lý Chế Độ Điều Dưỡng Phục Hồi Sức Khỏe NCC &amp; Học Nghề KCN
          </h3>
          <p className="text-slate-300 text-xs md:text-sm leading-relaxed mb-4">
            Triển khai chi trả chế độ điều dưỡng tập trung (định mức 4.363.000 VNĐ/người) và tại nhà (2.181.500 VNĐ/người) theo chu kỳ 1 năm/lần (Mẹ VNAH, thương binh nặng $\ge 81\%$) và 2 năm/lần; phối hợp kết nối việc làm KCN cho bộ đội xuất ngũ.
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="bg-amber-900/60 border border-amber-700/60 px-3 py-1 rounded-lg flex items-center gap-1.5 font-medium">
              <Building2 className="size-3.5 text-amber-300" />
              Điều dưỡng tập trung: 4.363.000 đ
            </span>
            <span className="bg-amber-900/60 border border-amber-700/60 px-3 py-1 rounded-lg flex items-center gap-1.5 font-medium">
              <Home className="size-3.5 text-sky-300" />
              Điều dưỡng tại nhà: 2.181.500 đ
            </span>
            <span className="bg-amber-900/60 border border-amber-700/60 px-3 py-1 rounded-lg flex items-center gap-1.5 font-medium">
              <Briefcase className="size-3.5 text-emerald-300" />
              Thẻ học nghề BĐXN: Miễn 100% học phí
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Tổng NCC năm 2026</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{(dieuDuongNccList || []).length}</span>
            <span className="text-xs font-semibold text-amber-600">người hưởng</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Đúng chu kỳ 1 năm &amp; 2 năm</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Tổng kinh phí dự toán</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-700">{tongKinhPhi.toLocaleString("vi-VN")}</span>
            <span className="text-xs font-semibold text-slate-600">VNĐ</span>
          </div>
          <span className="text-[11px] text-emerald-600 mt-1 block">Nguồn Ngân sách Trung ương</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Hình thức đăng ký</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-sky-700">{tapTrungCount}</span>
            <span className="text-xs font-semibold text-slate-600">Tập trung / {taiNhaCount} Tại nhà</span>
          </div>
          <span className="text-[11px] text-sky-600 mt-1 block">Trung tâm ĐD Long Đất &amp; Đà Lạt</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Học nghề BĐXN &amp; Hộ nghèo</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-indigo-700">{(khaoSatHocNgheList || []).length}</span>
            <span className="text-xs font-semibold text-slate-600">hồ sơ khảo sát</span>
          </div>
          <span className="text-[11px] text-indigo-600 mt-1 block">Kết nối KCN VSIP &amp; Sóng Thần</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200 gap-4">
        <button
          type="button"
          onClick={() => setActiveSubTab("DIEU_DUONG")}
          className={`pb-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
            activeSubTab === "DIEU_DUONG"
              ? "border-amber-600 text-amber-900"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <HeartHandshake className="size-4 text-amber-600" />
          Quản Lý Điều Dưỡng Phục Hồi Sức Khỏe NCC ({(dieuDuongNccList || []).length})
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("HOC_NGHE")}
          className={`pb-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
            activeSubTab === "HOC_NGHE"
              ? "border-indigo-600 text-indigo-900"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Briefcase className="size-4 text-indigo-600" />
          Khảo Sát Nhu Cầu Học Nghề &amp; Việc Làm KCN ({(khaoSatHocNgheList || []).length})
        </button>
      </div>

      {/* SUB-TAB 1: ĐIỀU DƯỠNG NGƯỜI CÓ CÔNG */}
      {activeSubTab === "DIEU_DUONG" && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              <div className="relative min-w-[220px] max-w-sm flex-1">
                <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm theo họ tên, CCCD, mã hồ sơ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <select
                value={filterHinhThuc}
                onChange={(e) => setFilterHinhThuc(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700"
              >
                <option value="ALL">Tất cả hình thức</option>
                <option value="TAP_TRUNG">Tập trung (4.363.000 đ)</option>
                <option value="TAI_NHA">Tại nhà (2.181.500 đ)</option>
              </select>

              <select
                value={filterTrangThai}
                onChange={(e) => setFilterTrangThai(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700"
              >
                <option value="ALL">Tất cả trạng thái</option>
                <option value="CHO_DUYET">Chờ phê duyệt</option>
                <option value="DA_PHE_DUYET">Đã phê duyệt</option>
                <option value="DA_CHI_TRA_HOAN_TAT">Đã chi trả hoàn tất</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => setShowDangKyModal(true)}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="size-4" />
              Đăng Ký Đối Tượng Điều Dưỡng Mới
            </button>
          </div>

          {/* Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDieuDuong.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {item.maHoSo}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        item.trangThai === "DA_CHI_TRA_HOAN_TAT"
                          ? "bg-emerald-100 text-emerald-800"
                          : item.trangThai === "DA_PHE_DUYET"
                          ? "bg-sky-100 text-sky-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {item.trangThai === "DA_CHI_TRA_HOAN_TAT"
                        ? "Đã chi trả"
                        : item.trangThai === "DA_PHE_DUYET"
                        ? "Đã duyệt QĐ"
                        : "Chờ phê duyệt"}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900">{item.hoTen}</h4>
                  <p className="text-xs text-slate-500">
                    CCCD: <strong className="text-slate-700">{item.cccd}</strong> · {item.khuPho}
                  </p>

                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Diện đối tượng:</span>
                      <strong className="text-slate-800">{item.dienDoiTuong}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Chu kỳ điều dưỡng:</span>
                      <strong className="text-slate-800">
                        {item.cheDoDieuDuong === "1_NAM_1_LAN" ? "1 năm / 1 lần" : "2 năm / 1 lần"}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Hình thức:</span>
                      <strong className="text-amber-700">
                        {item.hinhThucDangKy === "TAP_TRUNG" ? "Tập trung" : "Tại nhà"}
                      </strong>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-200">
                      <span className="text-slate-500 font-semibold">Định mức kinh phí:</span>
                      <strong className="text-emerald-700 font-extrabold">
                        {item.kinhPhiVND.toLocaleString("vi-VN")} VNĐ
                      </strong>
                    </div>
                  </div>

                  {item.diaDiemTapTrung && (
                    <p className="text-[11px] text-sky-700 bg-sky-50 p-2 rounded-lg border border-sky-100 flex items-center gap-1.5">
                      <Building2 className="size-3.5" />
                      Địa điểm: {item.diaDiemTapTrung}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  {item.trangThai === "CHO_DUYET" && (
                    <button
                      type="button"
                      onClick={() => handlePheDuyet(item.id, item.hoTen)}
                      className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
                    >
                      <UserCheck className="size-3.5" />
                      Phê duyệt QĐ
                    </button>
                  )}

                  {item.trangThai === "DA_PHE_DUYET" && (
                    <button
                      type="button"
                      onClick={() => handleChiTra(item.id, item.hoTen, item.kinhPhiVND)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
                    >
                      <CreditCard className="size-3.5" />
                      Chi trả kinh phí
                    </button>
                  )}

                  {item.trangThai === "DA_CHI_TRA_HOAN_TAT" && (
                    <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="size-4" />
                      Đã hoàn tất thanh quyết toán
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: KHẢO SÁT HỌC NGHỀ & VIỆC LÀM KCN */}
      {activeSubTab === "HOC_NGHE" && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="relative min-w-[220px] max-w-sm flex-1">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm theo tên học viên, CCCD, ngành nghề..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="button"
              onClick={() => setShowHocNgheModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="size-4" />
              Tiếp Nhận Phiếu Khảo Sát Học Nghề Mới
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredHocNghe.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    {item.dienDoiTuong === "BO_DOI_XUAT_NGU" ? "BỘ ĐỘI XUẤT NGŨ" : "HỘ NGHÈO / LAO ĐỘNG"}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      item.tinhTrang === "DA_CO_VIEC_LAM"
                        ? "bg-emerald-100 text-emerald-800"
                        : item.tinhTrang === "DANG_HOC_NGHE"
                        ? "bg-sky-100 text-sky-800"
                        : "bg-indigo-100 text-indigo-800"
                    }`}
                  >
                    {item.tinhTrang === "DA_CO_VIEC_LAM"
                      ? "Đã có việc làm"
                      : item.tinhTrang === "DANG_HOC_NGHE"
                      ? "Đang đào tạo"
                      : "Đã khảo sát"}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900">{item.hoTen}</h4>
                <p className="text-xs text-slate-500">
                  CCCD: <strong className="text-slate-700">{item.cccd}</strong> · {item.khuPho}
                </p>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1.5">
                  <div>
                    <span className="text-slate-500 block">Nguyện vọng học nghề:</span>
                    <strong className="text-indigo-900 font-bold">{item.nguyenVongHocNghe}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Doanh nghiệp liên kết:</span>
                    <span className="text-slate-700 font-medium">{item.doanhNghiepLienKet}</span>
                  </div>
                  <div className="pt-1 border-t border-slate-200 text-emerald-700 font-medium">
                    {item.chinhSachHoTro}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: ĐĂNG KÝ ĐIỀU DƯỠNG MỚI */}
      {showDangKyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-700 to-amber-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2">
                <HeartHandshake className="size-5" />
                Đăng Ký Kế Hoạch Điều Dưỡng NCC Năm 2026
              </h3>
              <button
                type="button"
                onClick={() => setShowDangKyModal(false)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateDieuDuong} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Họ và tên Người có công *</label>
                <input
                  type="text"
                  required
                  value={hoTen}
                  onChange={(e) => setHoTen(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn Hùng"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Số CCCD *</label>
                  <input
                    type="text"
                    required
                    value={cccd}
                    onChange={(e) => setCccd(e.target.value)}
                    placeholder="074..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-medium"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Khu phố</label>
                  <input
                    type="text"
                    value={khuPho}
                    onChange={(e) => setKhuPho(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Diện đối tượng</label>
                  <select
                    value={dienDoiTuong}
                    onChange={(e) => setDienDoiTuong(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-medium"
                  >
                    <option value="THUONG_BINH_21_80">Thương binh (21% - 80%)</option>
                    <option value="THUONG_BINH_NANG_81">Thương binh nặng (≥81%)</option>
                    <option value="ME_VNAH">Bà Mẹ Việt Nam Anh Hùng</option>
                    <option value="BENH_BINH">Bệnh binh</option>
                    <option value="NHIEM_CDHH_NANG">Nhiễm CĐHH nặng</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Chu kỳ hưởng</label>
                  <select
                    value={cheDoDieuDuong}
                    onChange={(e) => setCheDoDieuDuong(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-medium"
                  >
                    <option value="2_NAM_1_LAN">2 năm / 1 lần</option>
                    <option value="1_NAM_1_LAN">1 năm / 1 lần (Đặc biệt nặng)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Hình thức điều dưỡng nguyện vọng</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`p-3 rounded-xl border flex flex-col cursor-pointer transition-all ${hinhThucDangKy === "TAP_TRUNG" ? "border-amber-600 bg-amber-50" : "border-slate-200"}`}>
                    <input
                      type="radio"
                      name="hinhThuc"
                      checked={hinhThucDangKy === "TAP_TRUNG"}
                      onChange={() => setHinhThucDangKy("TAP_TRUNG")}
                      className="sr-only"
                    />
                    <strong className="text-amber-900">Tập trung</strong>
                    <span className="text-[11px] text-slate-500">4.363.000 VNĐ</span>
                    <span className="text-[10px] text-amber-700 mt-1">Nghỉ dưỡng Long Đất/Đà Lạt</span>
                  </label>

                  <label className={`p-3 rounded-xl border flex flex-col cursor-pointer transition-all ${hinhThucDangKy === "TAI_NHA" ? "border-amber-600 bg-amber-50" : "border-slate-200"}`}>
                    <input
                      type="radio"
                      name="hinhThuc"
                      checked={hinhThucDangKy === "TAI_NHA"}
                      onChange={() => setHinhThucDangKy("TAI_NHA")}
                      className="sr-only"
                    />
                    <strong className="text-amber-900">Tại nhà</strong>
                    <span className="text-[11px] text-slate-500">2.181.500 VNĐ</span>
                    <span className="text-[10px] text-amber-700 mt-1">Chi trả trực tiếp/chuyển khoản</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowDangKyModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold shadow-xs cursor-pointer"
                >
                  Lưu Đăng Ký
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: KHẢO SÁT HỌC NGHỀ */}
      {showHocNgheModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-700 to-indigo-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Briefcase className="size-5" />
                Phiếu Khảo Sát Nhu Cầu Học Nghề &amp; Việc Làm KCN
              </h3>
              <button
                type="button"
                onClick={() => setShowHocNgheModal(false)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateHocNghe} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Họ và tên người lao động *</label>
                <input
                  type="text"
                  required
                  value={hnHoTen}
                  onChange={(e) => setHnHoTen(e.target.value)}
                  placeholder="Ví dụ: Trương Văn Dũng"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Số CCCD *</label>
                  <input
                    type="text"
                    required
                    value={hnCccd}
                    onChange={(e) => setHnCccd(e.target.value)}
                    placeholder="074..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-medium"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Khu phố</label>
                  <input
                    type="text"
                    value={hnKhuPho}
                    onChange={(e) => setHnKhuPho(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Diện đối tượng</label>
                <select
                  value={hnDoiTuong}
                  onChange={(e) => setHnDoiTuong(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-medium"
                >
                  <option value="BO_DOI_XUAT_NGU">Quân nhân / Bộ đội xuất ngũ</option>
                  <option value="HO_NGHEO_CAN_NGHEO">Thành viên Hộ nghèo / Cận nghèo</option>
                  <option value="LAO_DONG_NONG_THON">Lao động tự do mất việc</option>
                  <option value="SAU_CAI_NGHIEN">Sau cai nghiện tái hòa nhập</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nguyện vọng học nghề</label>
                <input
                  type="text"
                  value={hnNganhNghe}
                  onChange={(e) => setHnNganhNghe(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Doanh nghiệp KCN liên kết tiếp nhận</label>
                <input
                  type="text"
                  value={hnDoanhNghiep}
                  onChange={(e) => setHnDoanhNghiep(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowHocNgheModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-xs cursor-pointer"
                >
                  Lưu Khảo Sát
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
