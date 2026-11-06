import React, { useState, useMemo } from "react";
import {
  Stethoscope,
  Utensils,
  ShieldCheck,
  ShieldAlert,
  Search,
  Filter,
  Plus,
  Building2,
  MapPin,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Smartphone,
  ExternalLink,
  Activity,
  HeartPulse,
  Syringe,
  Pill,
  Award,
} from "lucide-react";
import { useAppState, appStore } from "@/services/app-state";
import {
  type CoSoYTeDuocTuNhan,
  type CoSoAttpVaThucAnDuongPho,
  type SoSucKhoeDienTuKhuPho,
} from "@/data/domain-mock";
import { ModalKiemTraAttpYTe } from "../modals/ModalKiemTraAttpYTe";
import { toast } from "sonner";

export const YTeCoSoVaAttpTab: React.FC = () => {
  const {
    coSoYTeDuocList,
    coSoAttpList,
    soSucKhoeKhuPhoList,
    currentUser,
  } = useAppState();

  const [subTab, setSubTab] = useState<"Y_DUOC" | "ATTP" | "VNEID_HEALTH">("Y_DUOC");

  // Filter Sub-tab 1: Y Dược tư nhân
  const [searchYTe, setSearchYTe] = useState("");
  const [filterLoaiYTe, setFilterLoaiYTe] = useState<string>("ALL");
  const [filterKhuPhoYTe, setFilterKhuPhoYTe] = useState<string>("ALL");

  // Filter Sub-tab 2: An toàn thực phẩm
  const [searchAttp, setSearchAttp] = useState("");
  const [filterLoaiAttp, setFilterLoaiAttp] = useState<string>("ALL");
  const [filterKhuPhoAttp, setFilterKhuPhoAttp] = useState<string>("ALL");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTargetType, setModalTargetType] = useState<"Y_TE" | "ATTP">("Y_TE");
  const [selectedYTeItem, setSelectedYTeItem] = useState<CoSoYTeDuocTuNhan | null>(null);
  const [selectedAttpItem, setSelectedAttpItem] = useState<CoSoAttpVaThucAnDuongPho | null>(null);

  // Filtered Y - Dược
  const filteredYTe = useMemo(() => {
    return (coSoYTeDuocList || []).filter((item) => {
      const matchSearch =
        item.tenCoSo.toLowerCase().includes(searchYTe.toLowerCase()) ||
        item.maCoSo.toLowerCase().includes(searchYTe.toLowerCase()) ||
        item.diaChi.toLowerCase().includes(searchYTe.toLowerCase()) ||
        item.nguoiChiuTrachNhiemChuyenMon.toLowerCase().includes(searchYTe.toLowerCase());
      const matchLoai = filterLoaiYTe === "ALL" || item.loaiHinh === filterLoaiYTe;
      const matchKp = filterKhuPhoYTe === "ALL" || item.khuPho === filterKhuPhoYTe;
      return matchSearch && matchLoai && matchKp;
    });
  }, [coSoYTeDuocList, searchYTe, filterLoaiYTe, filterKhuPhoYTe]);

  // Filtered ATTP
  const filteredAttp = useMemo(() => {
    return (coSoAttpList || []).filter((item) => {
      const matchSearch =
        item.tenCoSo.toLowerCase().includes(searchAttp.toLowerCase()) ||
        item.maCoSo.toLowerCase().includes(searchAttp.toLowerCase()) ||
        item.chuCoSo.toLowerCase().includes(searchAttp.toLowerCase()) ||
        item.diaChi.toLowerCase().includes(searchAttp.toLowerCase());
      const matchLoai = filterLoaiAttp === "ALL" || item.loaiHinh === filterLoaiAttp;
      const matchKp = filterKhuPhoAttp === "ALL" || item.khuPho === filterKhuPhoAttp;
      return matchSearch && matchLoai && matchKp;
    });
  }, [coSoAttpList, searchAttp, filterLoaiAttp, filterKhuPhoAttp]);

  // Aggregated KPIs
  const totalYTe = (coSoYTeDuocList || []).length;
  const yTeDatChuan = (coSoYTeDuocList || []).filter((i) => i.ketQuaKiemTraGanNhat === "DAT_CHUAN").length;
  const totalAttp = (coSoAttpList || []).length;
  const attpDatChuan = (coSoAttpList || []).filter((i) => i.ketQuaKiemTra === "DAT_CHUAN").length;
  const avgHealthPercent = useMemo(() => {
    if (!soSucKhoeKhuPhoList || soSucKhoeKhuPhoList.length === 0) return 0;
    const totalDanSo = soSucKhoeKhuPhoList.reduce((acc, k) => acc + k.tongDanSo, 0);
    const totalDaLap = soSucKhoeKhuPhoList.reduce((acc, k) => acc + k.daLapSoSucKhoeVNeID, 0);
    return Number(((totalDaLap / totalDanSo) * 100).toFixed(1));
  }, [soSucKhoeKhuPhoList]);

  return (
    <div className="space-y-5">
      {/* Banner Căn cứ pháp lý QĐ 2698 & NĐ 148/2025/NĐ-CP */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-950 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-teal-800/50 relative overflow-hidden">
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-500/20 text-teal-300 border border-teal-500/30 backdrop-blur-xs rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            <Stethoscope className="size-3.5" />
            Nghiệp vụ Y tế cơ sở · Khoản 9 Điều 3 QĐ 2698/QĐ-UBND &amp; NĐ số 148/2025/NĐ-CP
          </div>
          <h3 className="text-2xl font-bold mb-2">
            Quản lý Y tế cơ sở, Hành nghề Y Dược tư nhân &amp; An toàn thực phẩm
          </h3>
          <p className="text-teal-200/90 text-xs leading-relaxed max-w-3xl">
            Bộ phận Giáo dục và Y tế – Phòng Văn hóa – Xã hội phường Thủ Dầu Một thực hiện quản lý
            danh bạ cơ sở khám chữa bệnh, nhà thuốc GPP, thẩm định và hậu kiểm liên ngành điều kiện ATTP
            tại các nhà hàng, quán ăn, thức ăn đường phố quanh Chợ Thủ Dầu Một, phố đi bộ Bạch Đằng và
            khu vực di tích Lễ hội Chùa Bà, kết hợp giám sát chỉ tiêu Sổ sức khỏe điện tử VNeID.
          </p>
        </div>
      </div>

      {/* 4 Thẻ chỉ số tổng hợp nhanh */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-gray-200 bg-white p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>Cơ sở Y - Dược tư nhân</span>
            <Stethoscope className="size-4 text-teal-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-gray-900">{totalYTe}</span>
            <span className="text-[11px] font-bold text-emerald-600">
              {yTeDatChuan}/{totalYTe} đạt chuẩn
            </span>
          </div>
          <div className="mt-1 text-[11px] text-gray-500">100% kết nối Dược quốc gia</div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>Cơ sở ATTP &amp; Đường phố</span>
            <Utensils className="size-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-gray-900">{totalAttp}</span>
            <span className="text-[11px] font-bold text-emerald-600">
              {attpDatChuan}/{totalAttp} đạt ATTP
            </span>
          </div>
          <div className="mt-1 text-[11px] text-gray-500">Khu Chợ TDM &amp; Bạch Đằng</div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>Sổ Sức Khỏe VNeID</span>
            <Smartphone className="size-4 text-purple-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-purple-700">{avgHealthPercent}%</span>
            <span className="text-[11px] font-bold text-emerald-600">14/14 Khu phố</span>
          </div>
          <div className="mt-1 text-[11px] text-gray-500">Chỉ tiêu Đề án 06 Chính phủ</div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>Tiêm chủng mở rộng</span>
            <Syringe className="size-4 text-sky-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-sky-700">98.2%</span>
            <span className="text-[11px] font-bold text-emerald-600">Không dịch lớn</span>
          </div>
          <div className="mt-1 text-[11px] text-gray-500">Giám sát SXH &amp; TCM liên tục</div>
        </div>
      </div>

      {/* Tabs Chuyên ngành con */}
      <div className="flex flex-wrap border-b border-gray-200 bg-white rounded-t-xl px-4 pt-3 gap-3 text-xs">
        <button
          onClick={() => setSubTab("Y_DUOC")}
          className={`pb-3 px-3 font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
            subTab === "Y_DUOC"
              ? "border-teal-600 text-teal-800"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Stethoscope className="size-4 text-teal-600" />
          <span>1. Quản lý Hành nghề Y - Dược tư nhân ({coSoYTeDuocList.length})</span>
        </button>

        <button
          onClick={() => setSubTab("ATTP")}
          className={`pb-3 px-3 font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
            subTab === "ATTP"
              ? "border-emerald-600 text-emerald-800"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Utensils className="size-4 text-emerald-600" />
          <span>2. An toàn thực phẩm &amp; Thức ăn đường phố ({coSoAttpList.length})</span>
        </button>

        <button
          onClick={() => setSubTab("VNEID_HEALTH")}
          className={`pb-3 px-3 font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
            subTab === "VNEID_HEALTH"
              ? "border-purple-600 text-purple-800"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Smartphone className="size-4 text-purple-600" />
          <span>3. Sổ sức khỏe điện tử VNeID &amp; Y tế dự phòng (14 Khu phố)</span>
        </button>
      </div>

      {/* SUBTAB 1: HÀNH NGHỀ Y - DƯỢC TƯ NHÂN */}
      {subTab === "Y_DUOC" && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Pill className="size-4 text-teal-600" />
              <h4 className="text-sm font-bold text-gray-900">
                Danh bạ Cơ sở Khám chữa bệnh &amp; Nhà thuốc GPP tư nhân
              </h4>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm tên phòng khám, nhà thuốc, bác sĩ..."
                  value={searchYTe}
                  onChange={(e) => setSearchYTe(e.target.value)}
                  className="rounded-lg border border-gray-300 pl-8 pr-3 py-1.5 text-xs outline-none focus:border-teal-600 w-64"
                />
                <Search className="size-3.5 absolute left-2.5 top-2 text-gray-400" />
              </div>

              <select
                value={filterLoaiYTe}
                onChange={(e) => setFilterLoaiYTe(e.target.value)}
                className="rounded-lg border border-gray-300 px-2.5 py-1.5 text-xs outline-none"
              >
                <option value="ALL">Tất cả loại hình</option>
                <option value="PHONG_KHAM_DA_KHOA">Phòng khám Đa khoa</option>
                <option value="PHONG_KHAM_CHUYEN_KHOA">Phòng khám Chuyên khoa</option>
                <option value="PHONG_CHAN_TRI_YHCT">Phòng Chẩn trị YHCT</option>
                <option value="NHA_THUOC_GPP">Nhà thuốc GPP</option>
                <option value="QUAY_THUOC">Quầy thuốc</option>
              </select>

              <select
                value={filterKhuPhoYTe}
                onChange={(e) => setFilterKhuPhoYTe(e.target.value)}
                className="rounded-lg border border-gray-300 px-2.5 py-1.5 text-xs outline-none"
              >
                <option value="ALL">Tất cả khu phố</option>
                {Array.from({ length: 14 }, (_, i) => `Khu phố ${i + 1}`).map((kp) => (
                  <option key={kp} value={kp}>
                    {kp}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 border-b border-gray-200 font-bold">
                  <th className="py-2.5 px-3">Mã &amp; Tên cơ sở</th>
                  <th className="py-2.5 px-3">Loại hình &amp; Tiêu chuẩn</th>
                  <th className="py-2.5 px-3">Địa chỉ &amp; Khu phố</th>
                  <th className="py-2.5 px-3">Người phụ trách &amp; CCHN</th>
                  <th className="py-2.5 px-3">Số Giấy phép</th>
                  <th className="py-2.5 px-3 text-center">Tình trạng hậu kiểm</th>
                  <th className="py-2.5 px-3 text-right">Tác nghiệp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredYTe.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-gray-900">{item.tenCoSo}</div>
                      <div className="text-[10px] text-gray-400 font-mono">
                        {item.maCoSo} · SĐT: {item.soDienThoai}
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold border ${
                          item.loaiHinh === "PHONG_KHAM_DA_KHOA"
                            ? "bg-teal-50 text-teal-800 border-teal-200"
                            : item.loaiHinh === "PHONG_KHAM_CHUYEN_KHOA"
                            ? "bg-sky-50 text-sky-800 border-sky-200"
                            : item.loaiHinh === "NHA_THUOC_GPP"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : "bg-amber-50 text-amber-800 border-amber-200"
                        }`}
                      >
                        {item.loaiHinh === "PHONG_KHAM_DA_KHOA"
                          ? "PK Đa khoa"
                          : item.loaiHinh === "PHONG_KHAM_CHUYEN_KHOA"
                          ? "PK Chuyên khoa"
                          : item.loaiHinh === "PHONG_CHAN_TRI_YHCT"
                          ? "Chẩn trị YHCT"
                          : item.loaiHinh === "NHA_THUOC_GPP"
                          ? "Nhà thuốc GPP"
                          : "Quầy thuốc"}
                      </span>
                      {item.coSoGPP && (
                        <span className="ml-1 px-1 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[9px] font-bold">
                          GPP
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-gray-700">
                      <div>{item.diaChi}</div>
                      <div className="text-[10px] text-teal-700 font-medium">{item.khuPho}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-gray-900">{item.nguoiChiuTrachNhiemChuyenMon}</div>
                      <div className="text-[10px] text-gray-500 font-mono">CCHN: {item.soChungChiHanhNghe}</div>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-gray-600">
                      <div>{item.soGiayPhepHoatDong}</div>
                      <div className="text-[10px] text-gray-400">Cấp: {item.ngayCapPhep}</div>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${
                          item.ketQuaKiemTraGanNhat === "DAT_CHUAN"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                            : item.ketQuaKiemTraGanNhat === "NHAC_NHO"
                            ? "bg-amber-50 text-amber-800 border-amber-300"
                            : "bg-red-50 text-red-800 border-red-300"
                        }`}
                      >
                        {item.ketQuaKiemTraGanNhat === "DAT_CHUAN"
                          ? "Đạt chuẩn"
                          : item.ketQuaKiemTraGanNhat === "NHAC_NHO"
                          ? "Nhắc nhở"
                          : "Xử phạt"}
                      </span>
                      <div className="text-[10px] text-gray-400 mt-0.5">KT: {item.ngayKiemTraGanNhat}</div>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedYTeItem(item);
                          setSelectedAttpItem(null);
                          setModalTargetType("Y_TE");
                          setIsModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100 font-bold text-[11px] transition-colors cursor-pointer"
                      >
                        <ShieldCheck className="size-3 text-teal-600" />
                        Hậu kiểm
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 2: AN TOÀN THỰC PHẨM & THỨC ĂN ĐƯỜNG PHỐ */}
      {subTab === "ATTP" && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Utensils className="size-4 text-emerald-600" />
              <h4 className="text-sm font-bold text-gray-900">
                Kiểm tra Liên ngành An toàn thực phẩm &amp; Thức ăn đường phố
              </h4>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm cơ sở ăn uống, chủ cơ sở..."
                  value={searchAttp}
                  onChange={(e) => setSearchAttp(e.target.value)}
                  className="rounded-lg border border-gray-300 pl-8 pr-3 py-1.5 text-xs outline-none focus:border-emerald-600 w-64"
                />
                <Search className="size-3.5 absolute left-2.5 top-2 text-gray-400" />
              </div>

              <select
                value={filterLoaiAttp}
                onChange={(e) => setFilterLoaiAttp(e.target.value)}
                className="rounded-lg border border-gray-300 px-2.5 py-1.5 text-xs outline-none"
              >
                <option value="ALL">Tất cả loại hình</option>
                <option value="NHA_HANG_DICH_VU_AN_UONG">Nhà hàng ăn uống</option>
                <option value="QUAN_AN_TRUYEN_THONG">Quán ăn truyền thống</option>
                <option value="THUC_AN_DUONG_PHO">Thức ăn đường phố</option>
                <option value="BEP_AN_TAP_THE">Bếp ăn tập thể</option>
              </select>

              <select
                value={filterKhuPhoAttp}
                onChange={(e) => setFilterKhuPhoAttp(e.target.value)}
                className="rounded-lg border border-gray-300 px-2.5 py-1.5 text-xs outline-none"
              >
                <option value="ALL">Tất cả khu phố</option>
                {Array.from({ length: 14 }, (_, i) => `Khu phố ${i + 1}`).map((kp) => (
                  <option key={kp} value={kp}>
                    {kp}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 border-b border-gray-200 font-bold">
                  <th className="py-2.5 px-3">Tên cơ sở ăn uống</th>
                  <th className="py-2.5 px-3">Loại hình</th>
                  <th className="py-2.5 px-3">Chủ cơ sở &amp; SĐT</th>
                  <th className="py-2.5 px-3">Địa chỉ &amp; Khu phố</th>
                  <th className="py-2.5 px-3">Chứng nhận ATTP / Cam kết</th>
                  <th className="py-2.5 px-3 text-center">Tập huấn / Khám SK</th>
                  <th className="py-2.5 px-3 text-center">Hậu kiểm</th>
                  <th className="py-2.5 px-3 text-right">Tác nghiệp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAttp.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-gray-900">{item.tenCoSo}</div>
                      <div className="text-[10px] text-gray-400 font-mono">{item.maCoSo}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold border ${
                          item.loaiHinh === "NHA_HANG_DICH_VU_AN_UONG"
                            ? "bg-purple-50 text-purple-800 border-purple-200"
                            : item.loaiHinh === "QUAN_AN_TRUYEN_THONG"
                            ? "bg-amber-50 text-amber-800 border-amber-200"
                            : item.loaiHinh === "BEP_AN_TAP_THE"
                            ? "bg-rose-50 text-rose-800 border-rose-200"
                            : "bg-emerald-50 text-emerald-800 border-emerald-200"
                        }`}
                      >
                        {item.loaiHinh === "NHA_HANG_DICH_VU_AN_UONG"
                          ? "Nhà hàng"
                          : item.loaiHinh === "QUAN_AN_TRUYEN_THONG"
                          ? "Quán ăn"
                          : item.loaiHinh === "BEP_AN_TAP_THE"
                          ? "Bếp ăn sẵn"
                          : "Thức ăn đường phố"}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-gray-900">{item.chuCoSo}</div>
                      <div className="text-[10px] text-gray-500 font-mono">{item.soDienThoai}</div>
                    </td>
                    <td className="py-2.5 px-3 text-gray-700">
                      <div>{item.diaChi}</div>
                      <div className="text-[10px] text-emerald-700 font-medium">{item.khuPho}</div>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-gray-600">
                      <div className="font-bold text-gray-800">{item.soGiayChungNhanAttp}</div>
                      <div className="text-[10px] text-gray-400">Hạn: {item.hanSuDungAttp}</div>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="font-bold text-gray-800">{item.soNguoiTapHuanAttp} người</span>
                      <div className="text-[10px] text-emerald-600 font-bold">100% Khám SK</div>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${
                          item.ketQuaKiemTra === "DAT_CHUAN"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                            : item.ketQuaKiemTra === "NHAC_NHO"
                            ? "bg-amber-50 text-amber-800 border-amber-300"
                            : "bg-red-50 text-red-800 border-red-300"
                        }`}
                      >
                        {item.ketQuaKiemTra === "DAT_CHUAN"
                          ? "Đạt chuẩn"
                          : item.ketQuaKiemTra === "NHAC_NHO"
                          ? "Nhắc nhở"
                          : "Xử phạt"}
                      </span>
                      <div className="text-[10px] text-gray-400 mt-0.5">KT: {item.ngayKiemTraGanNhat}</div>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedAttpItem(item);
                          setSelectedYTeItem(null);
                          setModalTargetType("ATTP");
                          setIsModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 font-bold text-[11px] transition-colors cursor-pointer"
                      >
                        <ShieldCheck className="size-3 text-emerald-600" />
                        Kiểm tra
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 3: SỔ SỨC KHỎE ĐIỆN TỬ VNEID THEO 14 KHU PHỐ */}
      {subTab === "VNEID_HEALTH" && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Activity className="size-4 text-purple-600" />
              <div>
                <h4 className="text-sm font-bold text-gray-900">
                  Tiến độ Kích hoạt Sổ Sức khỏe Điện tử trên VNeID (Đề án 06) tại 14 Khu phố
                </h4>
                <p className="text-[11px] text-gray-500">
                  Dữ liệu đồng bộ trực tiếp từ Trạm Y tế phường và Cơ sở dữ liệu quốc gia về Bảo hiểm Y tế
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded bg-purple-50 text-purple-800 border border-purple-200 text-xs font-bold font-mono">
              Bình quân toàn phường: {avgHealthPercent}%
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 border-b border-gray-200 font-bold">
                  <th className="py-2.5 px-3">Khu phố</th>
                  <th className="py-2.5 px-3 text-center">Tổng dân số</th>
                  <th className="py-2.5 px-3 text-center">Đã lập Sổ SK VNeID</th>
                  <th className="py-2.5 px-3">Tỷ lệ tiến độ (%)</th>
                  <th className="py-2.5 px-3 text-center">Cơ sở KCB liên thông</th>
                  <th className="py-2.5 px-3 text-center">Tiêm chủng mở rộng</th>
                  <th className="py-2.5 px-3 text-center">Đánh giá</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(soSucKhoeKhuPhoList || []).map((kp) => (
                  <tr key={kp.khuPho} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-gray-900">{kp.khuPho}</td>
                    <td className="py-2.5 px-3 text-center font-mono text-gray-700">
                      {kp.tongDanSo.toLocaleString("vi-VN")} người
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-purple-700">
                      {kp.daLapSoSucKhoeVNeID.toLocaleString("vi-VN")} sổ
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              kp.tyLePercent >= 95
                                ? "bg-purple-600"
                                : kp.tyLePercent >= 90
                                ? "bg-emerald-600"
                                : "bg-amber-600"
                            }`}
                            style={{ width: `${kp.tyLePercent}%` }}
                          />
                        </div>
                        <span className="font-mono font-bold text-gray-800 text-[11px]">
                          {kp.tyLePercent}%
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-teal-700">
                      {kp.soCoSoKhamChuaBenhLienThong} cơ sở
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-sky-700">
                      {kp.tiLeTiemChungMoRong}%
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold border ${
                          kp.tyLePercent >= 94
                            ? "bg-purple-100 text-purple-800 border-purple-300"
                            : kp.tyLePercent >= 90
                            ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                            : "bg-amber-100 text-amber-800 border-amber-300"
                        }`}
                      >
                        {kp.tyLePercent >= 94 ? "Xuất sắc" : kp.tyLePercent >= 90 ? "Đạt chuẩn" : "Cần đẩy mạnh"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Hậu kiểm liên ngành */}
      <ModalKiemTraAttpYTe
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        targetType={modalTargetType}
        itemYTe={selectedYTeItem}
        itemAttp={selectedAttpItem}
      />
    </div>
  );
};
