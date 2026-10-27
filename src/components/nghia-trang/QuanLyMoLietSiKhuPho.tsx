import { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  Compass,
  Search,
  Flame,
  Heart,
  MapPin,
  Sparkles,
  Info,
  Filter,
  CheckCircle2,
  AlertCircle,
  Building,
  Flag,
  Share2,
  UserCheck,
  FileText,
  Calendar,
  Layers,
  Phone,
  CreditCard,
  Printer,
  X,
  Plus,
  ArrowRight,
  ShieldAlert,
  Dna,
  RefreshCw,
  Award,
} from "lucide-react";
import { appStore, useAppState } from "@/services/app-state";
import {
  type ChoThoKhuPhoItem,
  type LietSiKhuPhoItem,
  type YeuCauXuLyMoItem,
} from "@/data/domain-mock";
import { type MoLietSiItem } from "@/data/mock";
import { MapTilerGisView, type GisMarkerItem } from "@/components/map/MapTilerGisView";

interface QuanLyMoLietSiKhuPhoProps {
  moLietSiList: MoLietSiItem[];
  onSelectMoGis?: (mo: MoLietSiItem) => void;
}

export function QuanLyMoLietSiKhuPho({ moLietSiList }: QuanLyMoLietSiKhuPhoProps) {
  const { choThoKhuPhoList, lietsiKhuPhoList, yeuCauXuLyMoList, currentUser } = useAppState();

  const [activeTab, setActiveTab] = useState<"CHO_THO_KHU_PHO" | "XU_LY_MO" | "THO_CUNG_277" | "SO_DO_GIS">("CHO_THO_KHU_PHO");
  const [selectedKhuPhoFilter, setSelectedKhuPhoFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // State Modal Dâng hương Nhà bia Khu phố
  const [dangHuongChoTho, setDangHuongChoTho] = useState<ChoThoKhuPhoItem | null>(null);
  const [isBurning, setIsBurning] = useState(false);

  // State Modal Xử lý Tu bổ mộ
  const [modalTuBo, setModalTuBo] = useState<LietSiKhuPhoItem | null>(null);
  const [kinhPhiTuBo, setKinhPhiTuBo] = useState(10000000);
  const [soQdTuBo, setSoQdTuBo] = useState("QĐ-UBND-2026/TB-08");

  // State Modal Đính chính thông tin bia mộ
  const [modalDinhChinh, setModalDinhChinh] = useState<LietSiKhuPhoItem | null>(null);
  const [noiDungDinhChinh, setNoiDungDinhChinh] = useState("");
  const [soQdDinhChinh, setSoQdDinhChinh] = useState("QĐ-UBND-2026/ĐC-05");

  // State Modal Di chuyển hài cốt
  const [modalDiChuyen, setModalDiChuyen] = useState<LietSiKhuPhoItem | null>(null);
  const [noiDenMoi, setNoiDenMoi] = useState("Nghĩa trang Liệt sĩ TP. Thủ Dầu Một");
  const [soQdDiChuyen, setSoQdDiChuyen] = useState("QĐ-UBND-2026/DC-02");

  // State Modal Đăng ký Giám định ADN
  const [modalAdn, setModalAdn] = useState<LietSiKhuPhoItem | null>(null);
  const [thongTinMauSinhPham, setThongTinMauSinhPham] = useState("Thu thập mẫu niêm mạc miệng của thân nhân gửi Viện Pháp y Quân đội theo Đề án 06");

  // Thống kê tổng hợp
  const stats = useMemo(() => {
    const tongLietSi = lietsiKhuPhoList.length;
    const moNghiaTrang = lietsiKhuPhoList.filter(
      (l) => l.viTriPhanMo === "NGHIA_TRANG_TINH" || l.viTriPhanMo === "NGHIA_TRANG_TP"
    ).length;
    const moGiaDinh = lietsiKhuPhoList.filter((l) => l.viTriPhanMo === "MO_GIA_DINH_KHU_PHO").length;
    const moChuaXacDinhAdn = lietsiKhuPhoList.filter((l) => l.viTriPhanMo === "CHUA_XAC_DINH_ADN").length;
    const daNhan277 = lietsiKhuPhoList.filter((l) => l.thongTinThoCung.daNhanTroCap277).length;
    const tongKinhPhi277 = daNhan277 * 1400000;
    return {
      tongLietSi,
      moNghiaTrang,
      moGiaDinh,
      moChuaXacDinhAdn,
      daNhan277,
      tongKinhPhi277,
    };
  }, [lietsiKhuPhoList]);

  // Lọc danh sách liệt sĩ
  const filteredLietSi = useMemo(() => {
    return lietsiKhuPhoList.filter((ls) => {
      const matchKhuPho = selectedKhuPhoFilter === "ALL" || ls.khuPhoCuTru === selectedKhuPhoFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        ls.hoTen.toLowerCase().includes(q) ||
        (ls.biDanh && ls.biDanh.toLowerCase().includes(q)) ||
        ls.chiTietViTriMo.toLowerCase().includes(q) ||
        ls.thongTinThoCung.nguoiThoCung.toLowerCase().includes(q) ||
        ls.thongTinThoCung.cccd.includes(q);
      return matchKhuPho && matchSearch;
    });
  }, [lietsiKhuPhoList, selectedKhuPhoFilter, searchQuery]);

  // Dữ liệu bản đồ số GIS Chỗ thờ & Nghĩa trang
  const gisMarkersChoTho: GisMarkerItem[] = useMemo(() => {
    const list: GisMarkerItem[] = [
      {
        id: "NT-TINH",
        lat: 10.9450,
        lng: 106.7210,
        title: "Nghĩa trang Liệt sĩ Tỉnh Bình Dương",
        category: "NGHIA_TRANG",
        categoryLabel: "Nghĩa trang Liệt sĩ Tỉnh",
        address: "Phường An Phú, TP. Thuận An, Tỉnh Bình Dương",
        description: "Quy mô 5.420 phần mộ liệt sĩ, đài tưởng niệm trung tâm và các phân khu A, B, C, D.",
        badge: "5.420 phần mộ",
      },
      {
        id: "NT-TP",
        lat: 11.0350,
        lng: 106.6710,
        title: "Nghĩa trang Liệt sĩ TP. Thủ Dầu Một",
        category: "NGHIA_TRANG",
        categoryLabel: "Nghĩa trang Liệt sĩ TP",
        address: "Phường Định Hòa, TP. Thủ Dầu Một, Bình Dương",
        description: "Nơi yên nghỉ của các anh hùng liệt sĩ quê hương Đất Thủ.",
        badge: "850 phần mộ",
      },
    ];

    choThoKhuPhoList.forEach((ct) => {
      let coords = [10.9805, 106.6543];
      if (ct.khuPho === "Khu phố 1") coords = [10.9818, 106.6540];
      if (ct.khuPho === "Khu phố 2") coords = [10.9785, 106.6510];
      if (ct.khuPho === "Khu phố 3") coords = [10.9760, 106.6575];
      if (ct.khuPho === "Khu phố 4") coords = [10.9845, 106.6495];

      list.push({
        id: ct.id,
        lat: coords[0],
        lng: coords[1],
        title: ct.tenCongTrinh,
        category: "NHA_BIA_KHU_PHO",
        categoryLabel: ct.loaiCongTrinh === "DEN_THO_LIET_SI" ? "Đền thờ Liệt sĩ" : "Nhà bia ghi danh",
        address: ct.diaChi,
        phone: ct.sdtNguoiQuanLy,
        description: `Ghi danh ${ct.soLuongLietSiGhiDanh} liệt sĩ. Quản lý: ${ct.nguoiQuanLy}. Đã dâng hương: ${ct.luotDangHuong} lượt.`,
        badge: `${ct.soLuongLietSiGhiDanh} liệt sĩ`,
      });
    });

    lietsiKhuPhoList.forEach((ls, idx) => {
      if (ls.viTriPhanMo === "MO_GIA_DINH_KHU_PHO" || ls.viTriPhanMo === "CHUA_XAC_DINH_ADN") {
        const offsetLat = ((idx % 4) + 1) * 0.0012 - 0.002;
        const offsetLng = (((idx * 2) % 5) + 1) * 0.001 - 0.0025;
        let baseLat = 10.9818;
        let baseLng = 106.6540;
        if (ls.khuPhoCuTru === "Khu phố 2") { baseLat = 10.9785; baseLng = 106.6510; }
        if (ls.khuPhoCuTru === "Khu phố 3") { baseLat = 10.9760; baseLng = 106.6575; }
        if (ls.khuPhoCuTru === "Khu phố 4") { baseLat = 10.9845; baseLng = 106.6495; }

        list.push({
          id: ls.id,
          lat: baseLat + offsetLat,
          lng: baseLng + offsetLng,
          title: `Mộ Liệt sĩ ${ls.hoTen} (${ls.khuPhoCuTru})`,
          category: "MO_LIET_SI",
          categoryLabel: ls.viTriPhanMo === "CHUA_XAC_DINH_ADN" ? "Chờ ADN (Đề án 06)" : "Mộ gia đình quản lý",
          address: ls.chiTietViTriMo,
          description: `Thân nhân thờ cúng: ${ls.thongTinThoCung.nguoiThoCung}. Tình trạng vỏ mộ: ${ls.tinhTrangVoMo}. Quê quán: ${ls.queQuan}.`,
          phone: ls.thongTinThoCung.soDienThoai,
          badge: ls.viTriPhanMo === "CHUA_XAC_DINH_ADN" ? "Giám định ADN" : "Đã cấp tu bổ",
        });
      }
    });

    return list;
  }, [choThoKhuPhoList, lietsiKhuPhoList]);

  // Xử lý dâng hương tại Nhà bia Khu phố
  const handleDangHuongKhuPho = (choTho: ChoThoKhuPhoItem) => {
    setIsBurning(true);
    appStore.thapHuongNhaBiaKhuPho(choTho.id);
    toast.success(`Đã dâng hương tri ân tưởng niệm tại ${choTho.tenCongTrinh}!`);
    setTimeout(() => {
      setIsBurning(false);
      setDangHuongChoTho(null);
    }, 2000);
  };

  // Xử lý lưu tu bổ
  const handleLuuTuBo = () => {
    if (!modalTuBo) return;
    const yc = yeuCauXuLyMoList.find((y) => y.lietsiId === modalTuBo.id) || {
      id: `YC-MO-${Date.now().toString().slice(-4)}`,
    };
    appStore.pheDuyetTuBoMo(yc.id, kinhPhiTuBo, soQdTuBo);
    toast.success(
      `Đã phê duyệt Quyết định cấp kinh phí tu bổ vỏ mộ liệt sĩ ${modalTuBo.hoTen} (${kinhPhiTuBo.toLocaleString("vi-VN")} đ) theo Điều 152 Nghị định 131/2021!`
    );
    setModalTuBo(null);
  };

  // Xử lý đính chính bia mộ
  const handleLuuDinhChinh = () => {
    if (!modalDinhChinh || !noiDungDinhChinh.trim()) {
      toast.error("Vui lòng nhập nội dung đính chính thông tin bia mộ!");
      return;
    }
    const yc = yeuCauXuLyMoList.find((y) => y.lietsiId === modalDinhChinh.id) || {
      id: `YC-MO-${Date.now().toString().slice(-4)}`,
    };
    appStore.dinhChinhBiaMo(modalDinhChinh.id, yc.id, noiDungDinhChinh.trim(), soQdDinhChinh);
    toast.success(
      `Đã ban hành Quyết định ${soQdDinhChinh} đính chính thông tin bia mộ liệt sĩ ${modalDinhChinh.hoTen} thành công!`
    );
    setModalDinhChinh(null);
    setNoiDungDinhChinh("");
  };

  // Xử lý di chuyển hài cốt
  const handleLuuDiChuyen = () => {
    if (!modalDiChuyen) return;
    const yc = yeuCauXuLyMoList.find((y) => y.lietsiId === modalDiChuyen.id) || {
      id: `YC-MO-${Date.now().toString().slice(-4)}`,
    };
    appStore.diChuyenHaiCotMo(modalDiChuyen.id, yc.id, noiDenMoi, soQdDiChuyen);
    toast.success(
      `Đã ban hành Quyết định di chuyển hài cốt liệt sĩ ${modalDiChuyen.hoTen} về ${noiDenMoi} và cấp hỗ trợ 4.000.000 đ theo Điều 158 NĐ 131!`
    );
    setModalDiChuyen(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Giới thiệu Nghiệp vụ */}
      <div className="bg-gradient-to-r from-red-950 via-amber-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-200 text-xs font-semibold uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 text-amber-300" />
            Nghị định 131/2021/NĐ-CP & Pháp lệnh Ưu đãi Người có công 2020
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            Quản Lý & Xử Lý Phần Mộ Liệt Sĩ Theo Chỗ Thờ Cúng 4 Khu Phố
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Hệ thống liên kết toàn diện: <strong>Nhà bia tưởng niệm ghi danh tại 4 Khu phố</strong> $\leftrightarrow$ <strong>Vị trí phần mộ thực tế (Nghĩa trang Tỉnh, Nghĩa trang TP, Mộ do gia đình quản lý ngoài nghĩa trang)</strong> $\leftrightarrow$ <strong>Thân nhân thờ cúng & Trợ cấp 1.400.000đ/năm</strong> $\leftrightarrow$ <strong>Nghiệp vụ tu bổ vỏ mộ (10 triệu), đính chính bia, di chuyển hài cốt & giám định ADN Đề án 06</strong>.
          </p>
        </div>
      </div>

      {/* 4 Cards Thống kê Tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Nhà bia & Đền thờ 4 Khu phố</p>
            <h4 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {choThoKhuPhoList.length} <span className="text-xs font-normal text-slate-500">công trình</span>
            </h4>
            <p className="text-[11px] text-amber-600 font-medium mt-1">178 Liệt sĩ được ghi danh</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600">
            <Building className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Mộ gia đình quản lý ngoài NT</p>
            <h4 className="text-2xl font-bold text-rose-600 mt-1">
              26 <span className="text-xs font-normal text-slate-500">phần mộ</span>
            </h4>
            <p className="text-[11px] text-rose-600 mt-1">Hỗ trợ tu bổ 10 triệu/mộ</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center text-rose-600">
            <Heart className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Giám định ADN xác định danh tính</p>
            <h4 className="text-2xl font-bold text-blue-600 mt-1">
              {stats.moChuaXacDinhAdn} <span className="text-xs font-normal text-slate-500">hồ sơ</span>
            </h4>
            <p className="text-[11px] text-blue-600 mt-1">Đề án 06 & Đề án 515</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600">
            <Dna className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Trợ cấp thờ cúng dịp 27/7</p>
            <h4 className="text-2xl font-bold text-emerald-600 mt-1">
              {stats.daNhan277}/{stats.tongLietSi} <span className="text-xs font-normal text-slate-500">thân nhân</span>
            </h4>
            <p className="text-[11px] text-emerald-600 mt-1">1.400.000 đ/năm (100% ATM)</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-2">
        <button
          onClick={() => setActiveTab("CHO_THO_KHU_PHO")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "CHO_THO_KHU_PHO"
              ? "border-amber-600 text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20"
              : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Chỗ Thờ Liệt Sĩ & Nhà Bia 4 Khu Phố</span>
          <span className="px-2 py-0.5 text-xs rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 font-bold">
            {choThoKhuPhoList.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("XU_LY_MO")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "XU_LY_MO"
              ? "border-rose-600 text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/20"
              : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          <span>Xử Lý Phần Mộ (Tu Bổ, Đính Chính, Di Chuyển, ADN)</span>
          <span className="px-2 py-0.5 text-xs rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 font-bold">
            {lietsiKhuPhoList.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("THO_CUNG_277")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "THO_CUNG_277"
              ? "border-emerald-600 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20"
              : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Thân Nhân & Trợ Cấp Thờ Cúng Dịp 27/7</span>
          <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold">
            1.400.000 đ
          </span>
        </button>

        <button
          onClick={() => setActiveTab("SO_DO_GIS")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "SO_DO_GIS"
              ? "border-sky-600 text-sky-600 dark:text-sky-400 bg-sky-50/50 dark:bg-sky-950/20"
              : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Bản Đồ Số GIS 4 Khu Phố & Nghĩa Trang</span>
          <span className="px-2 py-0.5 text-xs rounded-full bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 font-bold">
            MapTiler Live
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: CHỖ THỜ LIỆT SĨ & NHÀ BIA GHI DANH 4 KHU PHỐ */}
      {/* ========================================================================= */}
      {activeTab === "CHO_THO_KHU_PHO" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {choThoKhuPhoList.map((ct) => (
              <div
                key={ct.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      {ct.khuPho}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white pt-1">
                      {ct.tenCongTrinh}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      <span>{ct.diaChi}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-amber-600 block">
                      {ct.luotDangHuong} lượt viếng
                    </span>
                    <span className="text-[10px] text-slate-400 block">Duy tu: {ct.namTuBoGanNhat}</span>
                  </div>
                </div>

                {/* 4 Chỉ số phần mộ của Khu phố */}
                <div className="grid grid-cols-4 gap-2 pt-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                    <span className="text-[10px] text-slate-500 block">Khắc bia ghi danh</span>
                    <strong className="text-sm font-bold text-slate-900 dark:text-white">
                      {ct.soLuongLietSiGhiDanh}
                    </strong>
                  </div>
                  <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700">
                    <span className="text-[10px] text-blue-600 block">Mộ trong NT</span>
                    <strong className="text-sm font-bold">{ct.soMoTrongNghiaTrang}</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700">
                    <span className="text-[10px] text-rose-600 block">Mộ ngoài NT</span>
                    <strong className="text-sm font-bold">{ct.soMoNgoaiNghiaTrang}</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700">
                    <span className="text-[10px] text-amber-600 block">Chưa tìm thấy</span>
                    <strong className="text-sm font-bold">{ct.soMoChuaTimThay}</strong>
                  </div>
                </div>

                {/* Thông tin ban quản lý */}
                <div className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Người quản lý:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{ct.nguoiQuanLy}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block">Liên hệ:</span>
                    <span className="font-mono font-medium text-blue-600">{ct.sdtNguoiQuanLy}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedKhuPhoFilter(ct.khuPho);
                      setActiveTab("XU_LY_MO");
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                  >
                    <span>Xem danh sách Liệt sĩ ({ct.soLuongLietSiGhiDanh})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDangHuongKhuPho(ct)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-sm transition cursor-pointer"
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>Dâng Hương Trực Tuyến</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: SỔ QUẢN LÝ & XỬ LÝ PHẦN MỘ LIỆT SĨ */}
      {/* ========================================================================= */}
      {activeTab === "XU_LY_MO" && (
        <div className="space-y-6">
          {/* Thanh lọc & tìm kiếm */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="relative flex-1 min-w-[280px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm theo tên liệt sĩ, số mộ, thân nhân thờ cúng, CCCD..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="font-semibold text-slate-600 dark:text-slate-400">Khu phố:</label>
              <select
                value={selectedKhuPhoFilter}
                onChange={(e) => setSelectedKhuPhoFilter(e.target.value)}
                className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium cursor-pointer"
              >
                <option value="ALL">-- Tất cả 4 Khu phố --</option>
                <option value="Khu phố 1">Khu phố 1</option>
                <option value="Khu phố 2">Khu phố 2</option>
                <option value="Khu phố 3">Khu phố 3</option>
                <option value="Khu phố 4">Khu phố 4</option>
              </select>
            </div>
          </div>

          {/* Bảng danh sách liệt sĩ và xử lý phần mộ */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-semibold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-4 py-3">Mã hồ sơ & Liệt sĩ</th>
                    <th className="px-4 py-3">Chỗ thờ cúng Khu phố</th>
                    <th className="px-4 py-3">Vị trí phần mộ thực tế</th>
                    <th className="px-4 py-3 text-center">Tình trạng mộ & Bia</th>
                    <th className="px-4 py-3">Thân nhân thờ cúng</th>
                    <th className="px-4 py-3">Lịch sử xử lý công vụ</th>
                    <th className="px-4 py-3 text-right">Nghiệp vụ xử lý (NĐ 131)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredLietSi.map((ls) => (
                    <tr key={ls.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                          {ls.hoTen}
                        </div>
                        {ls.biDanh && (
                          <span className="text-[11px] text-amber-700 font-medium">
                            Bí danh: {ls.biDanh}
                          </span>
                        )}
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Sinh: {ls.namSinh} · Hy sinh: {ls.ngayHySinh}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          Bằng: {ls.bangToQuocGhiCongSo}
                        </div>
                      </td>

                      <td className="px-4 py-3 max-w-[200px]">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 block mb-1 w-fit">
                          {ls.khuPhoCuTru}
                        </span>
                        <p className="text-slate-800 dark:text-slate-200 font-medium leading-snug">
                          {ls.tenChoTho}
                        </p>
                      </td>

                      <td className="px-4 py-3 max-w-xs">
                        <div className="flex items-center gap-1 font-semibold text-slate-900 dark:text-slate-100">
                          <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                          <span>{ls.chiTietViTriMo}</span>
                        </div>
                        <div className="mt-1">
                          {ls.viTriPhanMo === "NGHIA_TRANG_TINH" ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-800">
                              Nghĩa trang Tỉnh
                            </span>
                          ) : ls.viTriPhanMo === "MO_GIA_DINH_KHU_PHO" ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-100 text-rose-800">
                              Mộ gia đình quản lý ngoài NT
                            </span>
                          ) : ls.viTriPhanMo === "CHUA_XAC_DINH_ADN" ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-100 text-purple-800">
                              Đang giám định ADN
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-800">
                              Nghĩa trang TP
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3 text-center">
                        <div className="mb-1">
                          {ls.tinhTrangMo === "TOT" ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              Mộ khang trang
                            </span>
                          ) : ls.tinhTrangMo === "XUONG_CAP_CAN_TU_BO" ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                              Xuống cấp cần tu bổ
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                              Đang tu bổ
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 block">
                          Bia: {ls.tinhTrangBia === "RO_NET" ? "Rõ nét" : "Cần đính chính / tu sửa"}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">
                          {ls.thongTinThoCung.nguoiThoCung}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {ls.thongTinThoCung.quanHe} · SĐT: {ls.thongTinThoCung.soDienThoai}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {ls.thongTinThoCung.diaChiThuongTru}
                        </div>
                      </td>

                      <td className="px-4 py-3 max-w-[200px]">
                        {ls.lichSuXuLy.length > 0 ? (
                          <div className="space-y-1">
                            <span className="font-semibold text-slate-800 dark:text-slate-200 text-[11px] block">
                              {ls.lichSuXuLy[0].noiDungChiTiet}
                            </span>
                            <span className="text-[10px] text-slate-400 block font-mono">
                              Ngày: {ls.lichSuXuLy[0].ngayThucHien}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Chưa có hồ sơ xử lý</span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="flex flex-col gap-1 items-end">
                          <button
                            type="button"
                            onClick={() => setModalTuBo(ls)}
                            className="px-2.5 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[11px] font-semibold transition cursor-pointer w-fit"
                          >
                            Tu bổ vỏ mộ (10tr)
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setModalDinhChinh(ls);
                              setNoiDungDinhChinh(`Đính chính thông tin bia mộ liệt sĩ ${ls.hoTen}`);
                            }}
                            className="px-2.5 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-[11px] font-semibold transition cursor-pointer w-fit"
                          >
                            Đính chính bia
                          </button>
                          <button
                            type="button"
                            onClick={() => setModalDiChuyen(ls)}
                            className="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-[11px] font-semibold transition cursor-pointer w-fit"
                          >
                            Di chuyển hài cốt
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: THÂN NHÂN & CHI TRẢ TRỢ CẤP THỜ CÚNG 27/7 (1.400.000 Đ/NĂM) */}
      {/* ========================================================================= */}
      {activeTab === "THO_CUNG_277" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Sổ Theo Dõi Thân Nhân & Chi Trả Trợ Cấp Thờ Cúng Liệt Sĩ Dịp 27/7
              </h3>
              <p className="text-xs text-slate-500">
                Định mức 1.400.000 đồng/liệt sĩ/năm theo Điều 28 Nghị định 131/2021/NĐ-CP · Thanh toán không dùng tiền mặt Đề án 06
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-semibold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-4 py-3">Liệt sĩ & Khu phố</th>
                    <th className="px-4 py-3">Người thờ cúng / CCCD</th>
                    <th className="px-4 py-3">Mối quan hệ</th>
                    <th className="px-4 py-3">Địa chỉ & Số điện thoại</th>
                    <th className="px-4 py-3">Tài khoản Ngân hàng (ATM)</th>
                    <th className="px-4 py-3 text-center">Mức chi trả</th>
                    <th className="px-4 py-3 text-center">Trạng thái 27/7</th>
                    <th className="px-4 py-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {lietsiKhuPhoList.map((ls) => (
                    <tr key={ls.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900 dark:text-slate-100">{ls.hoTen}</div>
                        <span className="text-[10px] text-amber-700 font-semibold">{ls.khuPhoCuTru}</span>
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">
                          {ls.thongTinThoCung.nguoiThoCung}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          CCCD: {ls.thongTinThoCung.cccd}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
                          {ls.thongTinThoCung.quanHe}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <div className="text-slate-800 dark:text-slate-200">
                          {ls.thongTinThoCung.diaChiThuongTru}
                        </div>
                        <div className="text-[11px] text-blue-600 font-mono">
                          {ls.thongTinThoCung.soDienThoai}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        {ls.thongTinThoCung.soTaiKhoanNganHang ? (
                          <div>
                            <span className="font-mono font-semibold text-slate-900 dark:text-white block">
                              {ls.thongTinThoCung.soTaiKhoanNganHang}
                            </span>
                            <span className="text-[10px] text-slate-400 block">
                              {ls.thongTinThoCung.tenNganHang}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Nhận tiền mặt tại Phường</span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-center font-mono font-bold text-emerald-700">
                        {ls.thongTinThoCung.mucTroCapNam.toLocaleString("vi-VN")} đ
                      </td>

                      <td className="px-4 py-3 text-center">
                        {ls.thongTinThoCung.daNhanTroCap277 ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Đã chi trả ATM
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            Chờ phát tiền
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            appStore.capNhatChiTraThoCung(ls.id, !ls.thongTinThoCung.daNhanTroCap277);
                            toast.success(
                              `Đã cập nhật trạng thái chi trả trợ cấp thờ cúng cho thân nhân ${ls.thongTinThoCung.nguoiThoCung}!`
                            );
                          }}
                          className="px-3 py-1 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 text-[11px] font-semibold text-slate-700 dark:text-slate-300 transition cursor-pointer"
                        >
                          {ls.thongTinThoCung.daNhanTroCap277 ? "Hủy đánh dấu" : "Xác nhận phát tiền"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: BẢN ĐỒ SỐ GIS MAPTILER 4 KHU PHỐ & NGHĨA TRANG LIỆT SĨ */}
      {/* ========================================================================= */}
      {activeTab === "SO_DO_GIS" && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                <Compass className="w-4 h-4 text-sky-500" />
                Hệ Thống Bản Đồ Định Vị Tọa Độ GPS Chỗ Thờ & Phần Mộ Liệt Sĩ (GIS MapTiler)
              </h4>
              <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                Định vị chính xác Nhà bia ghi danh 4 Khu phố, Nghĩa trang Liệt sĩ Tỉnh (5.420 mộ), Nghĩa trang TP và các phần mộ gia đình quản lý ngoài nghĩa trang
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded bg-purple-50 text-purple-700 border border-purple-200 font-semibold">
                🏛️ 4 Chỗ thờ Khu phố
              </span>
              <span className="px-2.5 py-1 rounded bg-rose-50 text-rose-700 border border-rose-200 font-semibold">
                ⚰️ Nghĩa trang Tỉnh & TP
              </span>
              <span className="px-2.5 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                💐 Mộ gia đình & Giám định ADN
              </span>
            </div>
          </div>

          <MapTilerGisView
            center={[10.9805, 106.6543]}
            zoom={14}
            height="580px"
            markers={gisMarkersChoTho}
            title="Bản Đồ Số GIS Điểm Thờ Cúng & Mộ Liệt Sĩ 4 Khu Phố Phường Phú Cường"
            subtitle="Định vị tọa độ GPS chuẩn xác trên nền ảnh vệ tinh MapTiler Cloud Key: t9C3...jM45"
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL PHÊ DUYỆT TU BỔ VỎ MỘ (ĐIỀU 152 NGHỊ ĐỊNH 131/2021) */}
      {/* ========================================================================= */}
      {modalTuBo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Phê Duyệt Hỗ Trợ Tu Bổ Vỏ Mộ Liệt Sĩ
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalTuBo(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Phê duyệt kinh phí hỗ trợ xây vỏ mộ liệt sĩ do gia đình/khu phố quản lý ngoài nghĩa trang cho thân nhân liệt sĩ <strong>{modalTuBo.hoTen}</strong> (quê quán: {modalTuBo.queQuan}).
              </p>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Định mức kinh phí hỗ trợ (VNĐ) - Điều 152 NĐ 131:
                </label>
                <input
                  type="number"
                  value={kinhPhiTuBo}
                  onChange={(e) => setKinhPhiTuBo(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-rose-600 font-bold"
                />
                <span className="text-[11px] text-slate-400 block">
                  * Mức chuẩn tối đa: 10.000.000 đồng/vỏ mộ.
                </span>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Số Quyết định phê duyệt của UBND:
                </label>
                <input
                  type="text"
                  value={soQdTuBo}
                  onChange={(e) => setSoQdTuBo(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setModalTuBo(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleLuuTuBo}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md transition cursor-pointer"
              >
                Ban Hành Quyết Định & Cấp Kinh Phí
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL ĐÍNH CHÍNH BIA MỘ */}
      {/* ========================================================================= */}
      {modalDinhChinh && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Đính Chính Thông Tin Bia Mộ Liệt Sĩ
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalDinhChinh(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600 dark:text-slate-400">
                Liệt sĩ: <strong>{modalDinhChinh.hoTen}</strong> ({modalDinhChinh.khuPhoCuTru}). Vị trí mộ: {modalDinhChinh.chiTietViTriMo}.
              </p>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Nội dung thông tin đính chính trên bia mộ:
                </label>
                <textarea
                  rows={3}
                  value={noiDungDinhChinh}
                  onChange={(e) => setNoiDungDinhChinh(e.target.value)}
                  placeholder="Ví dụ: Đính chính năm sinh từ 1948 thành 1950 theo đúng Bằng TQGC..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Số Quyết định đính chính của UBND:
                </label>
                <input
                  type="text"
                  value={soQdDinhChinh}
                  onChange={(e) => setSoQdDinhChinh(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setModalDinhChinh(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleLuuDinhChinh}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-md transition cursor-pointer"
              >
                Cập Nhật Đính Chính Bia
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL DI CHUYỂN HÀI CỐT LIỆT SĨ */}
      {/* ========================================================================= */}
      {modalDiChuyen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Flag className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Di Chuyển Hài Cốt Liệt Sĩ (Điều 158 NĐ 131)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalDiChuyen(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600 dark:text-slate-400">
                Thủ tục di chuyển hài cốt liệt sĩ <strong>{modalDiChuyen.hoTen}</strong> theo nguyện vọng của thân nhân ({modalDiChuyen.thongTinThoCung.nguoiThoCung}).
              </p>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Địa điểm an táng mới:
                </label>
                <input
                  type="text"
                  value={noiDenMoi}
                  onChange={(e) => setNoiDenMoi(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Số Quyết định cho phép di chuyển hài cốt:
                </label>
                <input
                  type="text"
                  value={soQdDiChuyen}
                  onChange={(e) => setSoQdDiChuyen(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                />
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 text-blue-800 dark:text-blue-200 space-y-1">
                <p className="font-bold">Định mức hỗ trợ theo Điều 158 NĐ 131/2021:</p>
                <p>- Hỗ trợ tiền cất bốc: <strong>4.000.000 đồng</strong>.</p>
                <p>- Hỗ trợ tiền đi lại và tiền ăn cho tối đa 03 người thân nhân.</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setModalDiChuyen(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleLuuDiChuyen}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md transition cursor-pointer"
              >
                Ban Hành Quyết Định Di Chuyển
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
