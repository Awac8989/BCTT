import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  GraduationCap,
  Baby,
  Building,
  BookOpen,
  Award,
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Camera,
  Utensils,
  Eye,
  FileText,
  Clock,
  Sparkles,
  School,
  TrafficCone,
  Heart,
  Percent,
  Check,
  X,
  Printer,
  Download,
  Phone,
  MapPin,
  Calendar,
  Flame,
  ShieldAlert,
  FileCheck,
  CheckSquare,
  Square,
  Send,
  UserCheck,
  QrCode,
  FileSignature,
  ArrowRight,
  HelpCircle,
  History,
  BadgeCheck,
  ExternalLink,
  CheckCheck,
  Inbox,
  FileSpreadsheet,
  ChevronRight,
  Stamp,
  RefreshCw,
  AlertCircle,
  FileBadge,
  AlertOctagon,
  Timer,
} from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { DigitalSignatureBadge } from "@/components/DigitalSignatureBadge";
import { useAppState, appStore, hasDomainAccess } from "@/services/app-state";
import {
  type CoSoMamNonTuThuc,
  type TruongHocCongLap,
  type SoLieuPhoCapGiaoDuc,
  type HoatDongKhuyenHoc,
  type MoHinhHocTap,
  type LopHocTrungTamHTCD,
  type HoSoTTHCGiaoDuc,
  type TrangThaiHoSoGD,
  type ThanhPhanGiayTo,
  THU_TUC_GD_CONFIGS,
} from "@/data/domain-mock";

// Helper chuyển chuỗi ngày dd/mm/yyyy sang đối tượng Date chuẩn
function parseDateVN(dateStr: string): Date {
  if (!dateStr) return new Date();
  const parts = dateStr.split("/");
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }
  return new Date(dateStr);
}

// Helper tính toán tình trạng thời hạn giải quyết hồ sơ (SLA Tracking) theo Nghị định 61/2018/NĐ-CP
function calculateSlaStatus(ngayHenTra: string, trangThai: TrangThaiHoSoGD) {
  if (trangThai === "DA_PHE_DUYET" || trangThai === "DA_TRA_KET_QUA") {
    return {
      status: "DA_HOAN_THANH" as const,
      label: "Đã duyệt đúng hạn",
      daysLeft: 0,
      badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-300",
      dotClass: "bg-emerald-500",
    };
  }

  const henDate = parseDateVN(ngayHenTra);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  henDate.setHours(0, 0, 0, 0);

  const diffTime = henDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      status: "QUA_HAN" as const,
      label: `Quá hạn ${Math.abs(diffDays)} ngày`,
      daysLeft: diffDays,
      badgeClass: "bg-red-100 text-red-800 border-red-300 font-bold",
      dotClass: "bg-red-600 animate-ping",
    };
  }

  if (diffDays <= 3) {
    return {
      status: "SAP_TRE_HAN" as const,
      label: `Sắp đến hạn (${diffDays} ngày)`,
      daysLeft: diffDays,
      badgeClass: "bg-amber-100 text-amber-900 border-amber-300 font-bold",
      dotClass: "bg-amber-500",
    };
  }

  return {
    status: "CON_HAN" as const,
    label: `Còn hạn (${diffDays} ngày)`,
    daysLeft: diffDays,
    badgeClass: "bg-sky-50 text-sky-800 border-sky-200 font-semibold",
    dotClass: "bg-sky-500",
  };
}

// Helper xuất văn bản hành chính sang tệp Word (.doc) chuẩn Nghị định 30/2020/NĐ-CP
function exportDocAsWord(filename: string, elementId: string) {
  const element = document.getElementById(elementId);
  if (!element) {
    toast.error("Không tìm thấy nội dung văn bản để xuất Word!");
    return;
  }

  const htmlContent = element.innerHTML;
  const wordHeader = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' 
          xmlns:w='urn:schemas-microsoft-com:office:word' 
          xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${filename}</title>
      <!--[if gte mso 9]>
      <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>100</w:Zoom>
          <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
      </xml>
      <![endif]-->
      <style>
        @page {
          size: 21cm 29.7cm;
          margin: 2cm 1.5cm 2cm 3cm;
          mso-page-orientation: portrait;
        }
        body {
          font-family: 'Times New Roman', serif;
          font-size: 13pt;
          line-height: 1.25;
          color: #000000;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 6pt 0;
        }
        table, th, td {
          border: 1px solid #000000;
          padding: 4pt 6pt;
          font-family: 'Times New Roman', serif;
          font-size: 12pt;
        }
        .no-border, .no-border td, .no-border th {
          border: none !important;
        }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .text-justify { text-align: justify; }
        .font-bold { font-weight: bold; }
        .italic { font-style: italic; }
        .uppercase { text-transform: uppercase; }
        .header-line { border-bottom: 1.5pt solid #000; width: 40%; margin: 2pt auto; }
        .sub-header-line { border-bottom: 1pt solid #000; width: 60%; margin: 2pt auto; }
      </style>
    </head>
    <body>
      ${htmlContent}
    </body>
    </html>
  `;

  const blob = new Blob(["\ufeff", wordHeader], {
    type: "application/msword;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast.success(`Đã xuất thành công tệp Word: ${filename}.doc`);
}

export const Route = createFileRoute("/giao-duc-dao-tao")({
  head: () => ({
    meta: [
      {
        title: "Mảng Giáo dục & Đào tạo cơ sở · UBND Phường - SLĐTBXH Bình Dương",
      },
      {
        name: "description",
        content:
          "Thẩm định cấp phép mầm non ngoài công lập theo Thông tư 49/2021/TT-BGDĐT, phối hợp quản lý tuyển sinh đầu cấp, an ninh trường học, phổ cập giáo dục chuẩn mức 3 và khuyến học cộng đồng.",
      },
    ],
  }),
  component: GiaoDucDaoTaoPage,
});

function GiaoDucDaoTaoPage() {
  const {
    currentUser,
    mamNonList,
    truongCongLapList,
    phoCapList,
    khuyenHocList,
    moHinhHocTapList,
    lopHocHTCDList,
    hoSoTTHCGiaoDucList,
  } = useAppState();

  const [activeTab, setActiveTab] = useState<
    "MAM_NON_TU_THUC" | "TRUONG_CONG_LAP" | "PHO_CAP_KHUYEN_HOC" | "TTHC_MOT_CUA"
  >("TTHC_MOT_CUA");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLoaiHinh, setFilterLoaiHinh] = useState<string>("ALL");
  const [filterKetQua, setFilterKetQua] = useState<string>("ALL");

  // State Bộ lọc & Tìm kiếm TTHC Một cửa
  const [searchTTHC, setSearchTTHC] = useState("");
  const [filterTrangThaiTTHC, setFilterTrangThaiTTHC] = useState<string>("ALL");
  const [filterThuTucTTHC, setFilterThuTucTTHC] = useState<string>("ALL");
  const [filterSlaTTHC, setFilterSlaTTHC] = useState<"ALL" | "CON_HAN" | "SAP_TRE_HAN" | "QUA_HAN">("ALL");

  // State Modal Tiếp nhận Hồ sơ Mới
  const [showTiepNhanModal, setShowTiepNhanModal] = useState(false);
  const [thuTucChon, setThuTucChon] = useState("TTHC-GD-BGD/01");
  const [nguoiNopMoi, setNguoiNopMoi] = useState("");
  const [sdtMoi, setSdtMoi] = useState("");
  const [cccdMoi, setCccdMoi] = useState("");
  const [diaChiNguoiNopMoi, setDiaChiNguoiNopMoi] = useState("");
  const [tenCoSoMoi, setTenCoSoMoi] = useState("");
  const [diaDiemCoSoMoi, setDiaDiemCoSoMoi] = useState("");
  const [khuPhoMoi, setKhuPhoMoi] = useState("Khu phố 1");
  const [hinhThucMoi, setHinhThucMoi] = useState<"TRUC_TIEP_MOT_CUA" | "DVC_TRUC_TUYEN_QUOC_GIA">("TRUC_TIEP_MOT_CUA");
  const [checkedGiayToMoi, setCheckedGiayToMoi] = useState<Record<string, boolean>>(() => {
    const initChecked: Record<string, boolean> = {};
    THU_TUC_GD_CONFIGS["TTHC-GD-BGD/01"]?.standardDocs.forEach((d) => {
      initChecked[d.id] = d.daNop;
    });
    return initChecked;
  });

  // State Modals Giấy tờ Hành chính
  const [viewingGiayHen, setViewingGiayHen] = useState<HoSoTTHCGiaoDuc | null>(null);
  const [viewingPhieuBoSung, setViewingPhieuBoSung] = useState<HoSoTTHCGiaoDuc | null>(null);
  const [inputLyDoBoSung, setInputLyDoBoSung] = useState("");
  const [inputHanBoSung, setInputHanBoSung] = useState("");

  // State Modal Phiếu xin lỗi và hẹn lại ngày trả kết quả (Mẫu số 04 - NĐ 61/2018/NĐ-CP)
  const [viewingPhieuXinLoi, setViewingPhieuXinLoi] = useState<HoSoTTHCGiaoDuc | null>(null);
  const [inputLyDoXinLoi, setInputLyDoXinLoi] = useState("");
  const [inputNgayHenMoi, setInputNgayHenMoi] = useState("");

  const [viewingBienBanThucDia, setViewingBienBanThucDia] = useState<HoSoTTHCGiaoDuc | null>(null);
  const [inputThucDiaTruongDoan, setInputThucDiaTruongDoan] = useState("ThS. Trần Thị Kim Oanh (Công chức GD-ĐT)");
  const [inputThucDiaYTe, setInputThucDiaYTe] = useState("BS. Nguyễn Văn Hào (Trạm Y tế)");
  const [inputThucDiaPCCC, setInputThucDiaPCCC] = useState("Đại úy Phạm Quốc Tuấn (Công an phường)");
  const [inputThucDiaKetLuan, setInputThucDiaKetLuan] = useState<"DAT_YEU_CAU" | "CHUA_DAT_YEU_CAU">("DAT_YEU_CAU");
  const [inputThucDiaNoiDung, setInputThucDiaNoiDung] = useState("");

  const [viewingToTrinh, setViewingToTrinh] = useState<HoSoTTHCGiaoDuc | null>(null);
  const [inputSoToTrinh, setInputSoToTrinh] = useState("");
  const [inputNoiDungToTrinh, setInputNoiDungToTrinh] = useState("");

  const [viewingQuyetDinh, setViewingQuyetDinh] = useState<HoSoTTHCGiaoDuc | null>(null);
  const [viewingPhieuKiemSoat, setViewingPhieuKiemSoat] = useState<HoSoTTHCGiaoDuc | null>(null);

  // State Modal Thẩm định Cấp phép Nhóm trẻ
  const [showAddMamNonModal, setShowAddMamNonModal] = useState(false);
  const [tenCoSo, setTenCoSo] = useState("");
  const [loaiHinh, setLoaiHinh] = useState<CoSoMamNonTuThuc["loaiHinh"]>("NHOM_TRE_DOC_LAP");
  const [chuCoSo, setChuCoSo] = useState("");
  const [phuTrach, setPhuTrach] = useState("");
  const [diaChi, setDiaChi] = useState("");
  const [khuPho, setKhuPho] = useState("Khu phố 1");
  const [soDienThoai, setSoDienThoai] = useState("0903...");
  const [soTre, setSoTre] = useState(25);
  const [soGiaoVien, setSoGiaoVien] = useState(4);
  const [dienTich, setDienTich] = useState(110);
  const [hasCamera, setHasCamera] = useState(true);
  const [hasBepMotChieu, setHasBepMotChieu] = useState(true);
  const [hasPccc, setHasPccc] = useState(true);
  const [hasGiaoVienChuan, setHasGiaoVienChuan] = useState(true);

  // State Modal Xem Hồ sơ & In Quyết định thành lập
  const [viewingMn, setViewingMn] = useState<CoSoMamNonTuThuc | null>(null);

  // State Modal Ghi Biên Bản Kiểm Tra Liên Ngành
  const [inspectingMn, setInspectingMn] = useState<CoSoMamNonTuThuc | null>(null);
  const [dotKiemTra, setDotKiemTra] = useState("KIEM_TRA_DINH_KY_DAU_NAM");
  const [inspectResult, setInspectResult] = useState<CoSoMamNonTuThuc["ketQuaKiemTraCuoi"]>("DAT_CHUAN_AN_TOAN");
  const [checkCamera, setCheckCamera] = useState(true);
  const [checkBep, setCheckBep] = useState(true);
  const [checkPccc, setCheckPccc] = useState(true);
  const [checkTyLeGv, setCheckTyLeGv] = useState(true);
  const [checkVeSinhYTe, setCheckVeSinhYTe] = useState(true);
  const [inspectNotes, setInspectNotes] = useState("");

  // State Modal Báo cáo Tự kiểm tra PCGD-XMC
  const [showBaoCaoPhoCapModal, setShowBaoCaoPhoCapModal] = useState(false);

  // State Modal Thêm Lớp học Trung tâm HTCĐ
  const [showAddLopHocModal, setShowAddLopHocModal] = useState(false);
  const [tenChuyenDe, setTenChuyenDe] = useState("");
  const [giangVien, setGiangVien] = useState("");
  const [thoiGianLop, setThoiGianLop] = useState("");
  const [diaDiemLop, setDiaDiemLop] = useState("Hội trường Trung tâm HTCĐ Phường");
  const [soHocVien, setSoHocVien] = useState(50);
  const [mucTieuLop, setMucTieuLop] = useState("");

  // State Modal Cập nhật ATGT cổng trường
  const [editingSchoolAtgt, setEditingSchoolAtgt] = useState<TruongHocCongLap | null>(null);
  const [lucLuongAtgt, setLucLuongAtgt] = useState("");
  const [gioPhanLuong, setGioPhanLuong] = useState("");

  // State Modal Quyết định Đình chỉ & Phục hồi Cơ sở Mầm non vi phạm
  const [viewingDinhChiMn, setViewingDinhChiMn] = useState<CoSoMamNonTuThuc | null>(null);
  const [viewingPhucHoiMn, setViewingPhucHoiMn] = useState<CoSoMamNonTuThuc | null>(null);
  const [inputLyDoDinhChi, setInputLyDoDinhChi] = useState("");
  const [inputThoiHanDinhChi, setInputThoiHanDinhChi] = useState(3);
  const [inputNoiDungPhucHoi, setInputNoiDungPhucHoi] = useState("");
  const [showBaoCaoQuanLyMamNonModal, setShowBaoCaoQuanLyMamNonModal] = useState(false);

  // State Modal Kế hoạch & Phân tuyến Tuyển sinh Đầu cấp (Tab 2)
  const [showKeHoachTuyenSinhModal, setShowKeHoachTuyenSinhModal] = useState(false);
  const [showKeHoachAtgtModal, setShowKeHoachAtgtModal] = useState(false);

  // State Modal Công nhận Gia đình Học tập & Trao học bổng (Tab 3)
  const [showCongNhanHocTapModal, setShowCongNhanHocTapModal] = useState(false);
  const [showTraoHocBongModal, setShowTraoHocBongModal] = useState(false);
  const [tenHocSinhHocBong, setTenHocSinhHocBong] = useState("");
  const [truongLopHocBong, setTruongLopHocBong] = useState("");
  const [khuPhoHocBong, setKhuPhoHocBong] = useState("Khu phố 1");
  const [hoanCanhHocBong, setHoanCanhHocBong] = useState("Hộ nghèo vượt khó hiếu học");
  const [mucHocBongVND, setMucHocBongVND] = useState(1500000);

  const hasAccess = hasDomainAccess(currentUser, "GD_DT");

  // Lọc cơ sở mầm non
  const filteredMamNonList = mamNonList.filter((mn) => {
    const matchSearch =
      mn.tenCoSo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mn.chuCoSo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mn.diaChi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mn.khuPho.toLowerCase().includes(searchTerm.toLowerCase());
    const matchLoai = filterLoaiHinh === "ALL" || mn.loaiHinh === filterLoaiHinh;
    const matchKetQua = filterKetQua === "ALL" || mn.ketQuaKiemTraCuoi === filterKetQua;
    return matchSearch && matchLoai && matchKetQua;
  });

  // Handler khi thay đổi chọn thủ tục hành chính trong Modal Tiếp nhận
  const handleSelectThuTuc = (maThuTuc: string) => {
    setThuTucChon(maThuTuc);
    const config = THU_TUC_GD_CONFIGS[maThuTuc];
    if (config) {
      const newChecked: Record<string, boolean> = {};
      config.standardDocs.forEach((d) => {
        newChecked[d.id] = d.daNop;
      });
      setCheckedGiayToMoi(newChecked);
    }
  };

  // Lọc danh sách hồ sơ TTHC Giáo dục Một cửa (Tìm kiếm, Trạng thái, Thủ tục, SLA Thời hạn)
  const filteredTTHCList = hoSoTTHCGiaoDucList.filter((h) => {
    const matchSearch =
      h.maHoSo.toLowerCase().includes(searchTTHC.toLowerCase()) ||
      h.nguoiNop.toLowerCase().includes(searchTTHC.toLowerCase()) ||
      h.tenCoSoDeNghi.toLowerCase().includes(searchTTHC.toLowerCase()) ||
      h.cccd.includes(searchTTHC) ||
      h.soDienThoai.includes(searchTTHC);
    const matchTrangThai = filterTrangThaiTTHC === "ALL" || h.trangThai === filterTrangThaiTTHC;
    const matchThuTuc = filterThuTucTTHC === "ALL" || h.maThuTuc === filterThuTucTTHC;

    const sla = calculateSlaStatus(h.ngayHenTra, h.trangThai);
    const matchSla =
      filterSlaTTHC === "ALL" ||
      (filterSlaTTHC === "QUA_HAN" && sla.status === "QUA_HAN") ||
      (filterSlaTTHC === "SAP_TRE_HAN" && sla.status === "SAP_TRE_HAN") ||
      (filterSlaTTHC === "CON_HAN" && (sla.status === "CON_HAN" || sla.status === "DA_HOAN_THANH"));

    return matchSearch && matchTrangThai && matchThuTuc && matchSla;
  });

  // Handler Tiếp nhận Hồ sơ TTHC Mới tại quầy Một cửa (Động theo từng thủ tục TTHC-01 -> TTHC-04)
  const handleTiepNhanHoSoMoi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nguoiNopMoi.trim() || !sdtMoi.trim() || !tenCoSoMoi.trim()) {
      toast.error("Vui lòng điền đủ tên người nộp, số điện thoại và tên cơ sở/trường học đề nghị!");
      return;
    }

    const config = THU_TUC_GD_CONFIGS[thuTucChon] || THU_TUC_GD_CONFIGS["TTHC-GD-BGD/01"];
    const nextIdx = hoSoTTHCGiaoDucList.length + 1;
    const newId = `HSO-GD-00${nextIdx}`;
    const newMaHoSo = `HSO-GD-2026-00${nextIdx}`;
    const now = new Date();
    const ngayTiepNhan = now.toLocaleDateString("vi-VN");

    // Tính hạn trả kết quả chuẩn theo số ngày quy định của thủ tục
    const henTraDate = new Date();
    henTraDate.setDate(henTraDate.getDate() + config.thoiHanNgayLich);
    const ngayHenTra = henTraDate.toLocaleDateString("vi-VN");

    // Lập danh sách giấy tờ theo cấu hình thủ tục và trạng thái tích chọn thực tế
    const standardDocs: ThanhPhanGiayTo[] = config.standardDocs.map((doc) => ({
      ...doc,
      daNop: !!checkedGiayToMoi[doc.id],
      ghiChu: !checkedGiayToMoi[doc.id] && doc.batBuoc ? "Chưa nộp (Cần bổ sung)" : doc.ghiChu,
    }));

    const missingRequiredDocs = standardDocs.filter((d) => d.batBuoc && !d.daNop);
    const isYeuCauBoSung = missingRequiredDocs.length > 0;
    const lyDoBoSungMoi = isYeuCauBoSung
      ? `Công dân cần bổ sung các giấy tờ bắt buộc theo ${config.canCuPhapLy}: ${missingRequiredDocs
          .map((d) => d.tenGiayTo)
          .join("; ")}`
      : undefined;

    const hanBoSungDate = new Date();
    hanBoSungDate.setDate(hanBoSungDate.getDate() + 7);
    const hanBoSungMoi = isYeuCauBoSung ? hanBoSungDate.toLocaleDateString("vi-VN") : undefined;

    const newHoSo: HoSoTTHCGiaoDuc = {
      id: newId,
      maHoSo: newMaHoSo,
      tenThuTuc: config.tenThuTuc,
      maThuTuc: config.maThuTuc,
      nguoiNop: nguoiNopMoi.trim(),
      soDienThoai: sdtMoi.trim(),
      cccd: cccdMoi.trim() || "0740" + Math.floor(10000000 + Math.random() * 90000000),
      diaChiLienHe: diaChiNguoiNopMoi.trim() || `${khuPhoMoi}, Phường Phú Cường`,
      tenCoSoDeNghi: tenCoSoMoi.trim(),
      diaDiemCoSo: diaDiemCoSoMoi.trim() || `${khuPhoMoi}, Phường Phú Cường`,
      khuPho: khuPhoMoi,
      ngayTiepNhan,
      ngayHenTra,
      hinhThucNop: hinhThucMoi,
      canBoTiepNhan: "Nguyễn Văn An (Công chức Một cửa)",
      canBoThuLy: "ThS. Trần Thị Kim Oanh (Công chức GD-ĐT)",
      trangThai: isYeuCauBoSung ? "YEU_CAU_BO_SUNG" : "DANG_THAM_DINH",
      thanhPhanHoSo: standardDocs,
      lyDoBoSung: lyDoBoSungMoi,
      hanBoSung: hanBoSungMoi,
    };

    appStore.addHoSoTTHCGiaoDuc(newHoSo);
    toast.success("Tiếp nhận hồ sơ Một cửa thành công!", {
      description: `Mã hồ sơ: ${newHoSo.maHoSo} · Hẹn trả: ${newHoSo.ngayHenTra} (${config.thoiHanNgayLamViec} ngày làm việc)`,
    });

    setShowTiepNhanModal(false);
    // Mở ngay Giấy hẹn Mẫu 01 để công chức in hoặc tải Word cho công dân
    setViewingGiayHen(newHoSo);
    // Reset form
    setNguoiNopMoi("");
    setSdtMoi("");
    setCccdMoi("");
    setTenCoSoMoi("");
    setDiaDiemCoSoMoi("");
  };

  // Handler Phát hành Phiếu xin lỗi và hẹn lại ngày trả kết quả (Mẫu số 04 - Nghị định 61/2018/NĐ-CP)
  const handlePhatHanhPhieuXinLoi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!viewingPhieuXinLoi) return;
    if (!inputLyDoXinLoi.trim()) {
      toast.error("Vui lòng ghi rõ lý do chậm trễ giải quyết hồ sơ!");
      return;
    }
    if (!inputNgayHenMoi.trim()) {
      toast.error("Vui lòng ấn định ngày hẹn trả kết quả mới!");
      return;
    }

    const res = appStore.phatHanhPhieuXinLoi(viewingPhieuXinLoi.id, inputLyDoXinLoi.trim(), inputNgayHenMoi.trim());
    toast.warning("Đã phát hành Phiếu xin lỗi và hẹn lại ngày trả kết quả (Mẫu số 04)!", {
      description: `Số phiếu: ${res.soPhieu} · Ngày hẹn trả mới: ${res.ngayHenMoi}`,
    });

    const updated = appStore.getState().hoSoTTHCGiaoDucList.find((h) => h.id === viewingPhieuXinLoi.id);
    if (updated) {
      setViewingPhieuXinLoi(updated);
    }
    setInputLyDoXinLoi("");
    setInputNgayHenMoi("");
  };

  // Handler Phát hành Phiếu yêu cầu bổ sung
  const handlePhatHanhPhieuBoSung = (e: React.FormEvent) => {
    e.preventDefault();
    if (!viewingPhieuBoSung) return;
    if (!inputLyDoBoSung.trim()) {
      toast.error("Vui lòng ghi rõ nội dung giấy tờ công dân cần bổ sung!");
      return;
    }

    const hanDate = inputHanBoSung || "7 ngày sau ngày phát hành";
    appStore.phatHanhYeuCauBoSung(viewingPhieuBoSung.id, inputLyDoBoSung.trim(), hanDate);
    toast.success("Đã phát hành Phiếu yêu cầu bổ sung, hoàn thiện hồ sơ (Mẫu số 02)!", {
      description: `Gửi thông báo SMS/Zalo tới công dân ${viewingPhieuBoSung.nguoiNop} (${viewingPhieuBoSung.soDienThoai})`,
    });
    setViewingPhieuBoSung(null);
    setInputLyDoBoSung("");
  };

  // Handler Lưu biên bản kiểm tra thực địa liên ngành
  const handleSaveThucDia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!viewingBienBanThucDia) return;

    const data = {
      ngayKiemTra: new Date().toLocaleDateString("vi-VN"),
      truongDoan: inputThucDiaTruongDoan,
      daiDienYTe: inputThucDiaYTe,
      daiDienCongAnPCCC: inputThucDiaPCCC,
      ketLuan: inputThucDiaKetLuan,
      bienBanSo: `${Math.floor(10 + Math.random() * 90)}/BB-LN/2026`,
      noiDungKiemTra:
        inputThucDiaNoiDung.trim() ||
        (inputThucDiaKetLuan === "DAT_YEU_CAU"
          ? "Đoàn kiểm tra liên ngành kết luận cơ sở đủ điều kiện về phòng học, thiết bị đồ chơi mầm non, bình chữa cháy PCCC và bếp ăn bán trú theo Thông tư 49/2021/TT-BGDĐT."
          : "Cơ sở chưa bảo đảm khoảng cách an toàn cầu thang và chưa đủ bình cứu hỏa MFZ4. Yêu cầu khắc phục trong 07 ngày."),
    };

    appStore.luuBienBanThucDia(viewingBienBanThucDia.id, data);
    toast.success("Đã lưu Biên bản kiểm tra thẩm định thực địa liên ngành!", {
      description: `Biên bản số: ${data.bienBanSo} · Kết luận: ${data.ketLuan === "DAT_YEU_CAU" ? "ĐẠT YÊU CẦU" : "CHƯA ĐẠT"}`,
    });
    setViewingBienBanThucDia(null);
    setInputThucDiaNoiDung("");
  };

  // Handler Lưu Tờ trình gửi Lãnh đạo UBND
  const handleSaveToTrinh = (e: React.FormEvent) => {
    e.preventDefault();
    if (!viewingToTrinh) return;

    const soToTrinh = inputSoToTrinh.trim() || `${Math.floor(10 + Math.random() * 90)}/TTr-VHXH`;
    const data = {
      soToTrinh,
      ngayTrinh: new Date().toLocaleDateString("vi-VN"),
      nguoiTrinh: "ThS. Trần Thị Kim Oanh",
      chucVu: "Công chức Văn hóa - Xã hội phụ trách Giáo dục",
      noiDungTrinh:
        inputNoiDungToTrinh.trim() ||
        `Kính trình Chủ tịch UBND Phường xem xét, ký ban hành Quyết định cho phép thành lập đối với ${viewingToTrinh.tenCoSoDeNghi}. Cơ sở đã được đoàn liên ngành thẩm định đủ điều kiện.`,
    };

    appStore.soanToTrinhPheDuyet(viewingToTrinh.id, data);
    toast.success("Đã hoàn tất Tờ trình và chuyển Lãnh đạo UBND Phường phê duyệt!", {
      description: `Tờ trình số: ${soToTrinh} · Hồ sơ chuyển trạng thái 'Chờ Lãnh đạo ký số'`,
    });
    setViewingToTrinh(null);
    setInputSoToTrinh("");
    setInputNoiDungToTrinh("");
  };

  // Handler Ký số điện tử Quyết định
  const handleKySoQuyetDinh = () => {
    if (!viewingQuyetDinh) return;
    const res = appStore.kySoQuyetDinhGiaoDuc(viewingQuyetDinh.id, "TS. Nguyễn Văn Hùng", "Chủ tịch UBND Phường Phú Cường");
    toast.success("Chủ tịch UBND Phường đã Ký số điện tử thành công!", {
      description: `Đã ban hành Quyết định số ${res.soQuyetDinh} · Mã xác thực CA: ${res.maXacThuc}`,
    });
    // Cập nhật lại viewingQuyetDinh để giao diện hiện con dấu số ngay lập tức
    const updated = appStore.getState().hoSoTTHCGiaoDucList.find((h) => h.id === viewingQuyetDinh.id);
    if (updated) {
      setViewingQuyetDinh(updated);
    }
  };

  // Handler thêm nhóm trẻ mầm non
  const handleCreateMamNon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenCoSo.trim() || !chuCoSo.trim()) {
      toast.error("Vui lòng nhập tên cơ sở và chủ cơ sở!");
      return;
    }

    const newId = `MN-${Math.floor(10 + Math.random() * 90)}`;
    const newItem: CoSoMamNonTuThuc = {
      id: newId,
      maCoSo: `MN-TT-${Math.floor(100 + Math.random() * 900)}`,
      tenCoSo: tenCoSo.trim(),
      loaiHinh,
      chuCoSo: chuCoSo.trim(),
      nguoiPhuTrachChuyenMon: phuTrach.trim() || chuCoSo.trim(),
      diaChi: diaChi || `${khuPho}, Phường Phú Cường`,
      khuPho,
      soDienThoai,
      soQuyetDinhCapPhep: `QĐ-UBND-${Math.floor(100 + Math.random() * 900)}/2026`,
      ngayCapPhep: new Date().toLocaleDateString("vi-VN"),
      soTreDangGiu: Number(soTre),
      soGiaoVienBaoMau: Number(soGiaoVien),
      dienTichPhongHocM2: Number(dienTich),
      coCameraGiamSat: hasCamera,
      bepAnMotChieu: hasBepMotChieu,
      ketQuaKiemTraCuoi: "DAT_CHUAN_AN_TOAN",
      ngayKiemTraCuoi: new Date().toLocaleDateString("vi-VN"),
      noiDungKiemTra: "Thẩm định điều kiện thành lập theo Thông tư 49/2021/TT-BGDĐT: Đạt chuẩn cơ sở vật chất, PCCC và bằng cấp giáo viên.",
    };

    appStore.addMamNonTuThuc(newItem);
    toast.success("Đã thẩm định và ban hành Quyết định cho phép thành lập!", {
      description: `${newItem.tenCoSo} (${newItem.diaChi}) - ${newItem.soQuyetDinhCapPhep}`,
    });
    setShowAddMamNonModal(false);
    setTenCoSo("");
    setChuCoSo("");
  };

  // Handler lưu biên bản kiểm tra
  const handleSaveInspect = () => {
    if (!inspectingMn) return;
    const checklistSummary = [
      checkCamera ? "Camera trực tuyến: Đạt" : "Camera: Cần khắc phục",
      checkBep ? "Bếp ăn 1 chiều: Đạt" : "Bếp ăn: Nhắc nhở",
      checkPccc ? "PCCC: Đạt" : "PCCC: Chưa đủ bình chữa cháy",
      checkTyLeGv ? "Định mức GV/trẻ: Đạt" : "Thiếu giáo viên",
      checkVeSinhYTe ? "VSATTP & Y tế: Đạt" : "Chưa lưu mẫu 24h",
    ].join("; ");

    const fullNotes = inspectNotes
      ? `${inspectNotes} (${checklistSummary})`
      : `Kết quả kiểm tra liên ngành: ${checklistSummary}`;

    appStore.updateKiemTraMamNon(inspectingMn.id, inspectResult, fullNotes);
    toast.success("Đã lập và lưu Biên bản Kiểm tra Liên ngành an toàn mầm non!", {
      description: `${inspectingMn.tenCoSo} - Kết luận: ${
        inspectResult === "DAT_CHUAN_AN_TOAN"
          ? "Đạt chuẩn an toàn"
          : inspectResult === "NHAC_NHO_KHAC_PHUC"
          ? "Nhắc nhở khắc phục (15 ngày)"
          : "Tạm đình chỉ hoạt động"
      }`,
    });
    setInspectingMn(null);
  };

  // Handler thêm lớp học trung tâm HTCĐ
  const handleCreateLopHoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenChuyenDe.trim() || !giangVien.trim()) {
      toast.error("Vui lòng nhập tên chuyên đề và giảng viên/báo cáo viên!");
      return;
    }

    const newLop: LopHocTrungTamHTCD = {
      id: `LH-${Date.now()}`,
      tenChuyenDe: tenChuyenDe.trim(),
      giangVien: giangVien.trim(),
      thoiGian: thoiGianLop || "Thứ Bảy tuần tới, 08h30 - 11h00",
      diaDiem: diaDiemLop,
      soHocVien: Number(soHocVien),
      trangThai: "SAP_TO_CHUC",
      ketQua: mucTieuLop || "Phổ biến kiến thức và nâng cao nhận thức cho người dân.",
    };

    appStore.addLopHocHTCD(newLop);
    toast.success("Đã mở lớp chuyên đề Trung tâm Học tập cộng đồng!", {
      description: newLop.tenChuyenDe,
    });
    setShowAddLopHocModal(false);
    setTenChuyenDe("");
    setGiangVien("");
  };

  // Handler lưu điều phối ATGT cổng trường
  const handleSaveSchoolAtgt = () => {
    if (!editingSchoolAtgt) return;
    appStore.updateTruongCongLap(editingSchoolAtgt.id, {
      lucLuongTrucATGT: lucLuongAtgt,
      gioCaoDiemPhanLuong: gioPhanLuong,
    });
    toast.success("Đã cập nhật phương án phối hợp đảm bảo ATGT cổng trường!", {
      description: editingSchoolAtgt.tenTruong,
    });
    setEditingSchoolAtgt(null);
  };

  // Handler Tạm đình chỉ cơ sở mầm non vi phạm
  const handleBanHanhQDDinhChi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!viewingDinhChiMn) return;
    const lyDo =
      inputLyDoDinhChi.trim() ||
      "Vi phạm quy định an toàn PCCC lối thoát nạn phụ và chưa đạt chuẩn vệ sinh bếp ăn một chiều theo Thông tư 49/2021/TT-BGDĐT";
    const soQD = appStore.dinhChiCoSoMamNon(viewingDinhChiMn.id, lyDo, inputThoiHanDinhChi);
    toast.warning("Đã ban hành Quyết định Tạm đình chỉ hoạt động cơ sở!", {
      description: `Số QĐ: ${soQD} · Thời hạn đình chỉ: ${inputThoiHanDinhChi} tháng`,
    });
    setViewingDinhChiMn(null);
    setInputLyDoDinhChi("");
  };

  // Handler Phục hồi cơ sở mầm non sau khắc phục
  const handleBanHanhQDPhucHoi = (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!viewingPhucHoiMn) return;
    const noiDung =
      inputNoiDungPhucHoi.trim() ||
      "Đã hoàn thành khắc phục tồn tại, đoàn liên ngành kiểm tra nghiệm thu đạt chuẩn an toàn";
    appStore.phucHoiCoSoMamNon(viewingPhucHoiMn.id, noiDung);
    toast.success("Đã ban hành Quyết định Cho phép Hoạt động trở lại!", {
      description: `Cơ sở ${viewingPhucHoiMn.tenCoSo} đã đạt chuẩn an toàn và được phục hồi hoạt động bình thường.`,
    });
    setViewingPhucHoiMn(null);
    setInputNoiDungPhucHoi("");
  };

  // Handler Trao học bổng Khuyến học
  const handleTraoHocBong = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenHocSinhHocBong.trim()) {
      toast.error("Vui lòng nhập họ tên học sinh nhận học bổng!");
      return;
    }
    const newHb: HoatDongKhuyenHoc = {
      id: `KH-${Date.now()}`,
      tenChuongTrinh: `Học bổng "Thắp sáng ước mơ" - Trao em ${tenHocSinhHocBong.trim()}`,
      diaDiem: `Hội trường UBND Phường Phú Cường / ${khuPhoHocBong}`,
      ngayToChuc: new Date().toLocaleDateString("vi-VN"),
      kinhPhiVND: Number(mucHocBongVND),
      soNguoiThuHuong: 1,
      ketQuaDatDuoc: `Trao học bổng trị giá ${Number(mucHocBongVND).toLocaleString("vi-VN")} đ cho em ${tenHocSinhHocBong.trim()} (${truongLopHocBong || "Học sinh trên địa bàn"}, ${khuPhoHocBong}) thuộc diện ${hoanCanhHocBong}. Trích từ Quỹ Khuyến học Phường.`,
    };
    appStore.addKhuyenHoc(newHb);
    toast.success("Đã duyệt và trao học bổng Khuyến học thành công!", {
      description: `Trao cho em ${tenHocSinhHocBong} · Số tiền: ${Number(mucHocBongVND).toLocaleString("vi-VN")} đ`,
    });
    setShowTraoHocBongModal(false);
    setTenHocSinhHocBong("");
    setTruongLopHocBong("");
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Phân hệ Nghiệp vụ 4 · Giáo dục và Đào tạo cơ sở"
        title="Quản lý Giáo dục mầm non, Trường học & Khuyến học"
        right={
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
              <School className="size-3.5 text-emerald-600" />
              Chuẩn Phổ cập GD Mức 3
            </span>
            <button
              onClick={() => {
                setActiveTab("TTHC_MOT_CUA");
                setShowTiepNhanModal(true);
              }}
              className="flex items-center gap-1.5 rounded-md bg-[#dd4b39] hover:bg-[#c23321] px-3 py-1.5 text-xs font-bold text-white shadow-xs transition-colors"
            >
              <FileSignature className="size-3.5" />
              Tiếp nhận Hồ sơ TTHC Giáo dục
            </button>
            <button
              onClick={() => setShowAddMamNonModal(true)}
              className="flex items-center gap-1.5 rounded-md bg-white border border-gray-300 hover:bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-700 shadow-xs transition-colors"
            >
              <Plus className="size-3.5 text-gray-500" />
              Cấp phép nhanh
            </button>
          </div>
        }
      />

      {/* Cảnh báo phân quyền nếu tài khoản không có quyền */}
      {!hasAccess && (
        <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 p-3.5 text-amber-900 flex items-start justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="size-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <strong className="font-bold">Lưu ý phân quyền:</strong> Tài khoản của bạn hiện chưa được phân công phụ trách{" "}
              <strong>Mảng Giáo dục &amp; Đào tạo cơ sở</strong>. Bạn đang xem ở chế độ quan sát dữ liệu.
            </div>
          </div>
          <button
            onClick={() => {
              appStore.switchRole("CB_GIAO_DUC");
              toast.success("Đã chuyển sang tài khoản Cán bộ Giáo dục (ThS. Trần Thị Kim Oanh)!");
            }}
            className="shrink-0 px-2.5 py-1 rounded bg-amber-600 text-white hover:bg-amber-700 text-xs font-bold transition-colors"
          >
            Đổi sang TK Phụ trách ↗
          </button>
        </div>
      )}

      {/* KPI Giáo dục & Phổ cập */}
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* KPI 1 */}
        <div className="rounded-lg border border-gray-200 bg-white p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>Mầm non ngoài công lập</span>
            <Baby className="size-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-gray-900">{mamNonList.length}</span>
            <span className="text-[11px] font-bold text-emerald-600">
              {mamNonList.reduce((acc, m) => acc + m.soTreDangGiu, 0)} trẻ
            </span>
          </div>
          <div className="mt-1 text-[11px] text-gray-500 font-medium">100% có camera trực tuyến</div>
        </div>

        {/* KPI 2 */}
        <div className="rounded-lg border border-gray-200 bg-white p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>Trường công lập địa bàn</span>
            <School className="size-4 text-sky-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-gray-900">{truongCongLapList.length}</span>
            <span className="text-[11px] font-bold text-sky-600">3.150 học sinh</span>
          </div>
          <div className="mt-1 text-[11px] text-gray-500 font-medium">MN, Tiểu học, THCS đạt chuẩn</div>
        </div>

        {/* KPI 3 */}
        <div className="rounded-lg border border-gray-200 bg-white p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>Phổ cập MN 5 tuổi (PCGDMN5T)</span>
            <GraduationCap className="size-4 text-purple-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-purple-700">99.8%</span>
            <span className="text-[11px] font-bold text-emerald-600">Đạt chuẩn QG</span>
          </div>
          <div className="mt-1 text-[11px] text-gray-500 font-medium">Huy động 381/382 trẻ 5 tuổi</div>
        </div>

        {/* KPI 4 */}
        <div className="rounded-lg border border-gray-200 bg-white p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>Học bổng Khuyến học đã trao</span>
            <Award className="size-4 text-amber-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-amber-700">73.5 tr</span>
            <span className="text-[11px] font-bold text-emerald-600">105 suất</span>
          </div>
          <div className="mt-1 text-[11px] text-gray-500 font-medium">Không có học sinh bỏ học</div>
        </div>
      </div>

      {/* Tabs mảng 4 */}
      <div className="mb-4 flex flex-wrap border-b border-gray-200 bg-white rounded-t-md px-3 pt-2 gap-2 text-xs">
        <button
          onClick={() => setActiveTab("TTHC_MOT_CUA")}
          className={`pb-2.5 px-3 font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === "TTHC_MOT_CUA"
              ? "border-[#dd4b39] text-[#dd4b39]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <FileSignature className="size-4 text-[#dd4b39]" />
          <span>4. Tiếp nhận &amp; Giải quyết Hồ sơ TTHC Giáo dục (Một Cửa Điện Tử)</span>
          <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-red-100 text-red-700 border border-red-200">
            {hoSoTTHCGiaoDucList.length} hồ sơ
          </span>
          {hoSoTTHCGiaoDucList.some((h) => h.trangThai === "CHO_PHE_DUYET") && (
            <span className="animate-pulse px-1.5 py-0.5 rounded-full text-[9px] font-black bg-amber-500 text-white">
              Chờ ký
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("MAM_NON_TU_THUC")}
          className={`pb-2.5 px-3 font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === "MAM_NON_TU_THUC"
              ? "border-[#dd4b39] text-[#dd4b39]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Baby className="size-4" />
          <span>1. Quản lý Mầm non ngoài công lập</span>
        </button>

        <button
          onClick={() => setActiveTab("TRUONG_CONG_LAP")}
          className={`pb-2.5 px-3 font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === "TRUONG_CONG_LAP"
              ? "border-[#dd4b39] text-[#dd4b39]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <School className="size-4" />
          <span>2. Phối hợp Trường học &amp; Tuyển sinh đầu cấp</span>
        </button>

        <button
          onClick={() => setActiveTab("PHO_CAP_KHUYEN_HOC")}
          className={`pb-2.5 px-3 font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === "PHO_CAP_KHUYEN_HOC"
              ? "border-[#dd4b39] text-[#dd4b39]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <BookOpen className="size-4" />
          <span>3. Phổ cập giáo dục, Xóa mù chữ &amp; Khuyến học</span>
        </button>
      </div>

      {/* TAB 1: MẦM NON NGOÀI CÔNG LẬP */}
      {activeTab === "MAM_NON_TU_THUC" && (
        <div className="space-y-4">
          <div className="bg-white rounded-md border border-gray-200 p-4 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-2">
                  <Baby className="size-4.5 text-[#dd4b39]" />
                  <h3 className="text-sm font-bold text-gray-900">
                    Sổ Quản lý Nhóm trẻ, Lớp Mẫu giáo &amp; Lớp Mầm non Độc lập Tư thục
                  </h3>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Căn cứ Luật Giáo dục 2019, Nghị định 46/2017/NĐ-CP và Thông tư 49/2021/TT-BGDĐT của Bộ GD&amp;ĐT
                </p>
              </div>

              {/* Bộ lọc và tìm kiếm */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <div className="relative">
                  <Search className="size-3.5 absolute left-2.5 top-2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm tên cơ sở, chủ cơ sở, khu phố..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded border border-gray-300 text-xs w-56 outline-none focus:border-[#dd4b39]"
                  />
                </div>

                <select
                  value={filterLoaiHinh}
                  onChange={(e) => setFilterLoaiHinh(e.target.value)}
                  className="rounded border border-gray-300 py-1.5 px-2.5 text-xs text-gray-700 outline-none"
                >
                  <option value="ALL">Tất cả loại hình</option>
                  <option value="NHOM_TRE_DOC_LAP">Nhóm trẻ độc lập (&lt; 36 tháng)</option>
                  <option value="LOP_MAU_GIAO_DOC_LAP">Lớp mẫu giáo độc lập (3 - 5 tuổi)</option>
                  <option value="TRUONG_MAM_NON_TU_THUC">Trường mầm non tư thục</option>
                </select>

                <select
                  value={filterKetQua}
                  onChange={(e) => setFilterKetQua(e.target.value)}
                  className="rounded border border-gray-300 py-1.5 px-2.5 text-xs text-gray-700 outline-none"
                >
                  <option value="ALL">Tất cả tình trạng an toàn</option>
                  <option value="DAT_CHUAN_AN_TOAN">Đạt chuẩn an toàn</option>
                  <option value="NHAC_NHO_KHAC_PHUC">Nhắc nhở khắc phục</option>
                  <option value="TAM_DINH_CHI">Tạm đình chỉ</option>
                </select>

                <button
                  onClick={() => setShowBaoCaoQuanLyMamNonModal(true)}
                  className="px-3 py-1.5 rounded bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  title="Xem Báo cáo Tổng hợp Quản lý Giáo dục Mầm non Ngoài Công lập gửi Phòng GD&ĐT TP (Báo cáo số 32/BC-UBND)"
                >
                  <FileSpreadsheet className="size-3.5" />
                  <span>Báo cáo Quản lý gửi Phòng GD&amp;ĐT (BC-32)</span>
                </button>
              </div>
            </div>

            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 border-b border-gray-200 font-bold">
                    <th className="py-2.5 px-3">Tên cơ sở mầm non</th>
                    <th className="py-2.5 px-3">Chủ cơ sở &amp; Phụ trách CM</th>
                    <th className="py-2.5 px-3">Địa chỉ &amp; Khu phố</th>
                    <th className="py-2.5 px-3 text-center">Quy mô nuôi giữ</th>
                    <th className="py-2.5 px-3 text-center">Định mức m²/trẻ</th>
                    <th className="py-2.5 px-3 text-center">Tiêu chuẩn an toàn</th>
                    <th className="py-2.5 px-3">Kiểm tra liên ngành gần nhất</th>
                    <th className="py-2.5 px-3 text-right">Thao tác nghiệp vụ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredMamNonList.map((mn) => {
                    const m2PerChild = (mn.dienTichPhongHocM2 / (mn.soTreDangGiu || 1)).toFixed(1);
                    const childPerTeacher = (mn.soTreDangGiu / (mn.soGiaoVienBaoMau || 1)).toFixed(1);

                    return (
                      <tr key={mn.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-2.5 px-3">
                          <div className="font-bold text-gray-900">{mn.tenCoSo}</div>
                          <div className="text-[10px] text-gray-500 font-mono mt-0.5">
                            Mã: <span className="font-semibold text-gray-700">{mn.maCoSo}</span> · QĐ:{" "}
                            <span className="text-[#dd4b39] font-bold">{mn.soQuyetDinhCapPhep}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-gray-800">
                          <div className="font-semibold">{mn.chuCoSo}</div>
                          <div className="text-[10px] text-gray-500 truncate max-w-[180px]">
                            CM: {mn.nguoiPhuTrachChuyenMon}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-gray-700">
                          <div>{mn.diaChi}</div>
                          <div className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                            <span className="font-bold text-gray-600">{mn.khuPho}</span>
                            <span>· SĐT: {mn.soDienThoai}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="font-bold text-gray-900">{mn.soTreDangGiu} trẻ</span>
                          <div className="text-[10px] text-gray-500">
                            {mn.soGiaoVienBaoMau} GV (~{childPerTeacher} trẻ/GV)
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="font-mono font-bold text-gray-800">{mn.dienTichPhongHocM2} m²</span>
                          <div className="text-[10px] text-emerald-700 font-medium">({m2PerChild} m²/trẻ)</div>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <div className="inline-flex flex-col gap-1 text-[10px]">
                            <span
                              className={`px-1.5 py-0.2 rounded font-bold inline-flex items-center gap-1 justify-center ${
                                mn.coCameraGiamSat
                                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                  : "bg-red-50 text-red-800 border border-red-200"
                              }`}
                            >
                              <Camera className="size-2.5" />
                              {mn.coCameraGiamSat ? "Camera Online" : "Chưa có Camera"}
                            </span>
                            <span
                              className={`px-1.5 py-0.2 rounded font-bold inline-flex items-center gap-1 justify-center ${
                                mn.bepAnMotChieu
                                  ? "bg-sky-50 text-sky-800 border border-sky-200"
                                  : "bg-amber-50 text-amber-800 border border-amber-200"
                              }`}
                            >
                              <Utensils className="size-2.5" />
                              {mn.bepAnMotChieu ? "Bếp 1 chiều" : "Cần sửa bếp"}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 max-w-xs">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`rounded px-1.5 py-0.2 text-[10px] font-bold border ${
                                mn.ketQuaKiemTraCuoi === "DAT_CHUAN_AN_TOAN"
                                  ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                  : mn.ketQuaKiemTraCuoi === "NHAC_NHO_KHAC_PHUC"
                                  ? "bg-amber-100 text-amber-800 border-amber-300"
                                  : "bg-red-100 text-red-800 border-red-300"
                              }`}
                            >
                              {mn.ketQuaKiemTraCuoi === "DAT_CHUAN_AN_TOAN"
                                ? "Đạt chuẩn an toàn"
                                : mn.ketQuaKiemTraCuoi === "NHAC_NHO_KHAC_PHUC"
                                ? "Nhắc nhở khắc phục"
                                : "Tạm đình chỉ"}
                            </span>
                            <span className="text-[10px] text-gray-400 font-mono">{mn.ngayKiemTraCuoi}</span>
                          </div>
                          <div className="text-[11px] text-gray-600 line-clamp-2 mt-1">{mn.noiDungKiemTra}</div>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            <button
                              onClick={() => setViewingMn(mn)}
                              className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs inline-flex items-center gap-1 transition-colors cursor-pointer"
                              title="Xem hồ sơ pháp lý & In quyết định thành lập"
                            >
                              <Eye className="size-3 text-gray-600" />
                              <span>Hồ sơ &amp; QĐ</span>
                            </button>

                            <button
                              onClick={() => {
                                setInspectingMn(mn);
                                setInspectResult(mn.ketQuaKiemTraCuoi);
                                setInspectNotes(mn.noiDungKiemTra);
                              }}
                              className="px-2 py-1 rounded bg-[#0073b7] hover:bg-[#005f96] text-white font-bold text-xs inline-flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                              title="Lập biên bản kiểm tra liên ngành an toàn mầm non"
                            >
                              <FileCheck className="size-3" />
                              <span>Ghi biên bản</span>
                            </button>

                            {mn.ketQuaKiemTraCuoi === "TAM_DINH_CHI" ? (
                              <>
                                <button
                                  onClick={() => setViewingDinhChiMn(mn)}
                                  className="px-2 py-1 rounded bg-red-100 hover:bg-red-200 text-red-800 font-bold text-xs inline-flex items-center gap-1 border border-red-300 transition-colors cursor-pointer"
                                  title="Xem Quyết định Tạm đình chỉ hoạt động giáo dục (Điều 11 Thông tư 49/2021)"
                                >
                                  <ShieldAlert className="size-3 text-red-600" />
                                  <span>QĐ Đình chỉ</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setViewingPhucHoiMn(mn);
                                    setInputNoiDungPhucHoi(
                                      "Đã hoàn thành lắp đặt cửa thoát nạn thứ 2 chịu nhiệt, bổ sung đủ bình MFZ4 và phân chia vách nhôm kính khu vực bếp nấu. Đoàn liên ngành kiểm tra nghiệm thu đạt chuẩn an toàn."
                                    );
                                  }}
                                  className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                                  title="Nghiệm thu khắc phục & Cho phép hoạt động trở lại"
                                >
                                  <CheckCircle2 className="size-3" />
                                  <span>Phục hồi</span>
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => {
                                  setViewingDinhChiMn(mn);
                                  setInputLyDoDinhChi(
                                    mn.noiDungKiemTra.includes("khắc phục") || mn.noiDungKiemTra.includes("vi phạm")
                                      ? mn.noiDungKiemTra
                                      : "Vi phạm nghiêm trọng về an toàn phòng cháy chữa cháy và vệ sinh an toàn thực phẩm"
                                  );
                                }}
                                className="px-2 py-1 rounded bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-700 font-semibold text-xs inline-flex items-center gap-1 border border-gray-200 hover:border-red-300 transition-colors cursor-pointer"
                                title="Ban hành Quyết định Tạm đình chỉ khi cơ sở có vi phạm nghiêm trọng (Điều 11 Thông tư 49/2021)"
                              >
                                <ShieldAlert className="size-3 text-amber-600" />
                                <span>Tạm đình chỉ</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TRƯỜNG HỌC & TUYỂN SINH ĐẦU CẤP */}
      {activeTab === "TRUONG_CONG_LAP" && (
        <div className="space-y-4">
          {/* Khối kế hoạch tuyển sinh đầu cấp & VNeID */}
          <div className="bg-gradient-to-r from-sky-900 to-indigo-900 text-white rounded-lg p-4 border border-sky-700 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <School className="size-5 text-sky-300" />
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wide">
                  Kế Hoạch Phối Hợp Tuyển Sinh Đầu Cấp &amp; An Toàn Trường Học Năm Học 2026 - 2027
                </h3>
              </div>
              <p className="text-xs text-sky-200 mt-1 max-w-2xl leading-relaxed">
                Ứng dụng cơ sở dữ liệu dân cư <strong>Đề án 06 / VNeID</strong> cấp mã định danh học sinh, tổ chức phân tuyến tuyển sinh theo khu phố, đảm bảo 100% trẻ em đúng độ tuổi được đến trường và không xảy ra ùn tắc giao thông cổng trường.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              <button
                onClick={() => setShowKeHoachTuyenSinhModal(true)}
                className="px-3 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-xs font-bold text-white border border-sky-400 shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                title="Xem Kế hoạch phân tuyến tuyển sinh theo khu phố và Quyết định 104/QĐ-UBND"
              >
                <FileText className="size-3.5" />
                <span>Kế hoạch &amp; QĐ Tuyển sinh (Số 104)</span>
              </button>
              <button
                onClick={() => setShowKeHoachAtgtModal(true)}
                className="px-3 py-1.5 rounded bg-amber-600 hover:bg-amber-500 text-xs font-bold text-white border border-amber-400 shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                title="Xem Kế hoạch Phối hợp Bảo đảm Trật tự ATGT Cổng trường học (Chỉ thị 31/CT-TTg)"
              >
                <TrafficCone className="size-3.5" />
                <span>Kế hoạch ATGT Cổng trường (Chỉ thị 31)</span>
              </button>
              <span className="px-3 py-1.5 rounded bg-white/10 text-xs font-bold text-sky-100 border border-white/20">
                100% Tuyển sinh Trực tuyến
              </span>
            </div>
          </div>

          <div className="bg-white rounded-md border border-gray-200 p-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Building className="size-4 text-sky-600" />
                <h3 className="text-sm font-bold text-gray-900">
                  Mạng lưới Trường học Công lập trên địa bàn Phường
                </h3>
              </div>
              <span className="text-xs text-gray-500 font-medium">
                Phối hợp: Phòng GD&amp;ĐT TP. Thủ Dầu Một · UBND Phường · Công an Phường
              </span>
            </div>

            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 border-b border-gray-200 font-bold">
                    <th className="py-2.5 px-3">Tên trường công lập</th>
                    <th className="py-2.5 px-3">Cấp học</th>
                    <th className="py-2.5 px-3">Hiệu trưởng &amp; Điện thoại</th>
                    <th className="py-2.5 px-3">Phân tuyến địa bàn (Khu phố)</th>
                    <th className="py-2.5 px-3 text-center">Chỉ tiêu / Đã tuyển</th>
                    <th className="py-2.5 px-3 text-center">Tỷ lệ nộp VNeID</th>
                    <th className="py-2.5 px-3">Phương án ATGT Cổng trường</th>
                    <th className="py-2.5 px-3 text-right">Điều phối ATGT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {truongCongLapList.map((tr) => (
                    <tr key={tr.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-gray-900">{tr.tenTruong}</div>
                        <div className="text-[10px] text-gray-500 mt-0.5">{tr.diaChi}</div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold border ${
                            tr.capHoc === "MAM_NON"
                              ? "bg-purple-50 text-purple-800 border-purple-200"
                              : tr.capHoc === "TIEU_HOC"
                              ? "bg-sky-50 text-sky-800 border-sky-200"
                              : "bg-blue-50 text-blue-800 border-blue-200"
                          }`}
                        >
                          {tr.capHoc === "MAM_NON" ? "Mầm non" : tr.capHoc === "TIEU_HOC" ? "Tiểu học" : "THCS"}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-gray-800">
                        <div className="font-semibold">{tr.hieuTruong}</div>
                        <div className="text-[10px] text-gray-500 font-mono mt-0.5">SĐT: {tr.soDienThoai}</div>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex flex-wrap gap-1">
                          {tr.tuyenKhuPho?.map((kp) => (
                            <span
                              key={kp}
                              className="px-1.5 py-0.2 rounded bg-gray-100 text-gray-700 font-semibold text-[10px] border border-gray-200"
                            >
                              {kp}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <div className="font-bold text-gray-900 font-mono">
                          {tr.daTuyenDauCap} / {tr.chiTieuTuyenSinhDauCap}
                        </div>
                        <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded">
                          Đạt 100%
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="font-mono font-bold text-indigo-700 text-xs">
                          {tr.tyLeDangKyTrucTuyenVNeID ?? 98.5}%
                        </span>
                        <div className="text-[10px] text-gray-400">Trực tuyến</div>
                      </td>
                      <td className="py-2.5 px-3 max-w-xs">
                        <div className="text-[11px] font-semibold text-gray-800 flex items-center gap-1">
                          <Clock className="size-3 text-amber-600" />
                          <span>{tr.gioCaoDiemPhanLuong || "06:45 - 07:15 & 16:45 - 17:30"}</span>
                        </div>
                        <div className="text-[10px] text-gray-500 truncate mt-0.5">
                          Lực lượng: {tr.lucLuongTrucATGT || "Dân quân tự vệ + Công an"}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => {
                            setEditingSchoolAtgt(tr);
                            setLucLuongAtgt(tr.lucLuongTrucATGT || "");
                            setGioPhanLuong(tr.gioCaoDiemPhanLuong || "06:45 - 07:15 & 16:45 - 17:30");
                          }}
                          className="px-2.5 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs inline-flex items-center gap-1 shadow-2xs transition-colors"
                        >
                          <TrafficCone className="size-3 text-amber-600" />
                          <span>Điều phối ATGT</span>
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

      {/* TAB 3: PHỔ CẬP GIÁO DỤC, XÓA MÙ CHỮ & KHUYẾN HỌC */}
      {activeTab === "PHO_CAP_KHUYEN_HOC" && (
        <div className="space-y-4">
          {/* Phổ cập giáo dục */}
          <div className="bg-white rounded-md border border-gray-200 p-4 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-2">
                  <BookOpen className="size-4.5 text-purple-600" />
                  <h3 className="text-sm font-bold text-gray-900">
                    Chỉ số Phổ cập Giáo dục &amp; Xóa mù chữ Phường Phú Cường năm 2026
                  </h3>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Theo Nghị định 20/2014/NĐ-CP và Thông tư 07/2016/TT-BGDĐT của Bộ GD&amp;ĐT
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowBaoCaoPhoCapModal(true)}
                  className="px-3 py-1.5 rounded bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <FileText className="size-3.5" />
                  <span>Xem Báo cáo Tự kiểm tra PCGD-XMC 2026</span>
                </button>
              </div>
            </div>

            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 border-b border-gray-200 font-bold">
                    <th className="py-2.5 px-3">Cấp học phổ cập</th>
                    <th className="py-2.5 px-3">Độ tuổi điều tra</th>
                    <th className="py-2.5 px-3 text-center">Tổng số trong độ tuổi</th>
                    <th className="py-2.5 px-3 text-center">Huy động đến trường</th>
                    <th className="py-2.5 px-3 text-center">Tỷ lệ huy động</th>
                    <th className="py-2.5 px-3 text-center">Tỷ lệ hoàn thành</th>
                    <th className="py-2.5 px-3 text-center">Mức độ đạt chuẩn QG</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {phoCapList.map((pc) => (
                    <tr key={pc.capPhoCap} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-gray-900">{pc.tenChiTieu}</td>
                      <td className="py-2.5 px-3 text-gray-600">{pc.doTuoiDieuTra}</td>
                      <td className="py-2.5 px-3 text-center font-bold font-mono text-gray-800">
                        {pc.tongSoTrongDoTuoi.toLocaleString("vi-VN")}
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold font-mono text-[#0073b7]">
                        {pc.soHuyDongDenTruong.toLocaleString("vi-VN")}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="font-mono font-bold text-emerald-700">{pc.tyLeHuyDongPercent}%</span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="font-mono font-bold text-emerald-700">{pc.tyLeHoanThanhPercent}%</span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="rounded bg-purple-100 text-purple-800 border border-purple-300 px-2 py-0.5 text-[10px] font-bold">
                          {pc.mucDoDatChuan}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mô hình Học tập & Xã hội học tập (Quyết định 1373/QĐ-TTg) */}
          <div className="bg-white rounded-md border border-gray-200 p-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Award className="size-4.5 text-amber-600" />
                <h3 className="text-sm font-bold text-gray-900">
                  Xây dựng Xã hội học tập &amp; 4 Mô hình Học tập (Thông tư 22/2020/TT-BGDĐT)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowCongNhanHocTapModal(true)}
                  className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs inline-flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                  title="Xem Quyết định công nhận các mô hình học tập và Bằng khen Gia đình học tập xuất sắc"
                >
                  <Award className="size-3.5" />
                  <span>Xem QĐ &amp; Bằng Khen Gia đình học tập</span>
                </button>
                <span className="text-xs text-amber-800 font-bold bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded">
                  Giai đoạn 2021 - 2030
                </span>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {moHinhHocTapList.map((mh) => (
                <div key={mh.id} className="p-3 rounded-lg border border-gray-200 bg-gray-50/70 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-gray-900">{mh.tenMoHinh}</span>
                      <span className="text-xs font-mono font-extrabold text-emerald-700">{mh.tyLePercent}%</span>
                    </div>
                    <div className="mt-2 text-xs text-gray-600">
                      Đạt chuẩn: <strong className="text-gray-900">{mh.soDatChuan}</strong> / {mh.soDangKy}
                    </div>
                    <div className="mt-1.5 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full"
                        style={{ width: `${Math.min(100, mh.tyLePercent)}%` }}
                      />
                    </div>
                  </div>
                  <p className="mt-2 text-[10px] text-gray-500 line-clamp-2 italic">{mh.tieuChuanDanhGia}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Khuyến học & Trung tâm HTCĐ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Quỹ Khuyến học & Học bổng */}
            <div className="bg-white rounded-md border border-gray-200 p-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Heart className="size-4 text-rose-600" />
                  <h3 className="text-sm font-bold text-gray-900">
                    Hội Khuyến học &amp; Học bổng &ldquo;Thắp sáng ước mơ&rdquo;
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowTraoHocBongModal(true)}
                    className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs inline-flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                    title="Trao học bổng Thắp sáng ước mơ cho học sinh nghèo vượt khó hiếu học"
                  >
                    <Plus className="size-3" />
                    <span>Trao học bổng</span>
                  </button>
                  <span className="text-xs text-gray-500 font-medium hidden sm:inline">Không có học sinh bỏ học</span>
                </div>
              </div>

              <div className="mt-3 space-y-3">
                {khuyenHocList.map((kh) => (
                  <div key={kh.id} className="p-3 rounded-md border border-gray-200 bg-gray-50/60 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <span className="font-bold text-gray-900">{kh.tenChuongTrinh}</span>
                      <span className="rounded bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 text-[10px] font-bold">
                        {kh.kinhPhiVND.toLocaleString("vi-VN")} đ
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-500 mt-1">
                      Địa điểm: {kh.diaDiem} · {kh.ngayToChuc} · Thụ hưởng:{" "}
                      <strong className="text-gray-800">{kh.soNguoiThuHuong} người</strong>
                    </div>
                    <p className="mt-1.5 text-[11px] text-gray-700 bg-white p-2 rounded border border-gray-100">
                      {kh.ketQuaDatDuoc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Trung tâm Học tập cộng đồng */}
            <div className="bg-white rounded-md border border-gray-200 p-4 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Users className="size-4 text-indigo-600" />
                    <h3 className="text-sm font-bold text-gray-900">
                      Trung tâm Học tập cộng đồng (TTHTCĐ) Phường
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowAddLopHocModal(true)}
                    className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs inline-flex items-center gap-1 shadow-2xs"
                  >
                    <Plus className="size-3" />
                    <span>Mở lớp chuyên đề</span>
                  </button>
                </div>

                <div className="mt-3 space-y-2.5">
                  {lopHocHTCDList.map((lh) => (
                    <div key={lh.id} className="p-3 rounded-md border border-gray-200 bg-gray-50/60 text-xs">
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-bold text-gray-900">{lh.tenChuyenDe}</div>
                        <span
                          className={`rounded px-1.5 py-0.2 text-[9px] font-bold shrink-0 border ${
                            lh.trangThai === "DA_HOAN_THANH"
                              ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                              : lh.trangThai === "DANG_DIEN_RA"
                              ? "bg-sky-100 text-sky-800 border-sky-300"
                              : "bg-amber-100 text-amber-800 border-amber-300"
                          }`}
                        >
                          {lh.trangThai === "DA_HOAN_THANH"
                            ? "Đã hoàn thành"
                            : lh.trangThai === "DANG_DIEN_RA"
                            ? "Đang diễn ra"
                            : "Sắp tổ chức"}
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-500 mt-1">
                        Báo cáo viên: <span className="font-semibold text-gray-700">{lh.giangVien}</span>
                      </div>
                      <div className="text-[10px] text-gray-400 mt-0.5">
                        {lh.thoiGian} · Dự kiến: {lh.soHocVien} học viên
                      </div>
                      <div className="mt-1 text-[11px] text-indigo-900 bg-indigo-50/70 p-1.5 rounded">
                        {lh.ketQua}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TIẾP NHẬN & GIẢI QUYẾT HỒ SƠ TTHC GIÁO DỤC (MỘT CỬA ĐIỆN TỬ) */}
      {activeTab === "TTHC_MOT_CUA" && (
        <div className="space-y-4">
          {/* Header Banner & Nút Thao tác Một cửa */}
          <div className="bg-gradient-to-r from-red-50 via-amber-50 to-emerald-50 rounded-lg border border-red-200/80 p-4 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-extrabold uppercase tracking-wide bg-[#dd4b39] text-white">
                    Bộ phận Một Cửa
                  </span>
                  <h2 className="text-base font-extrabold text-gray-900">
                    Tiếp nhận &amp; Thụ lý Hồ sơ Thủ tục Hành chính Giáo dục cơ sở
                  </h2>
                </div>
                <p className="text-xs text-gray-600 mt-1 max-w-3xl leading-relaxed">
                  Quy trình thụ lý hồ sơ Một cửa điện tử liên thông theo <strong>Nghị định 61/2018/NĐ-CP</strong> và <strong>Nghị định 107/2021/NĐ-CP</strong>. 
                  Thẩm quyền Chủ tịch UBND cấp xã/phường cho phép thành lập nhóm trẻ, lớp mẫu giáo độc lập tư thục theo <strong>Thông tư 49/2021/TT-BGDĐT</strong>.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowTiepNhanModal(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[#dd4b39] hover:bg-[#c23321] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <FileSignature className="size-4" />
                  <span>Tiếp nhận Hồ sơ TTHC Mới</span>
                </button>
              </div>
            </div>

            {/* Thống kê tiến độ hồ sơ 5 chỉ số */}
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5 text-xs">
              <div className="bg-white p-2.5 rounded border border-gray-200 shadow-2xs">
                <div className="text-gray-500 text-[11px] flex items-center justify-between">
                  <span>Tổng hồ sơ tiếp nhận</span>
                  <Inbox className="size-3.5 text-blue-600" />
                </div>
                <div className="text-xl font-black text-gray-900 mt-1">{hoSoTTHCGiaoDucList.length}</div>
                <div className="text-[10px] text-gray-400">100% cấp Giấy hẹn &amp; QR</div>
              </div>

              <div className="bg-white p-2.5 rounded border border-indigo-200 shadow-2xs">
                <div className="text-indigo-600 text-[11px] flex items-center justify-between font-semibold">
                  <span>Đang thẩm định &amp; Thực địa</span>
                  <ShieldCheck className="size-3.5 text-indigo-600" />
                </div>
                <div className="text-xl font-black text-indigo-700 mt-1">
                  {hoSoTTHCGiaoDucList.filter((h) => h.trangThai === "DANG_THAM_DINH" || h.trangThai === "KIEM_TRA_THUC_DIA").length}
                </div>
                <div className="text-[10px] text-gray-500">Đoàn liên ngành GD - Y tế - PCCC</div>
              </div>

              <div className="bg-white p-2.5 rounded border border-red-200 shadow-2xs">
                <div className="text-red-600 text-[11px] flex items-center justify-between font-semibold">
                  <span>Yêu cầu bổ sung (Mẫu 02)</span>
                  <AlertCircle className="size-3.5 text-red-600" />
                </div>
                <div className="text-xl font-black text-red-700 mt-1">
                  {hoSoTTHCGiaoDucList.filter((h) => h.trangThai === "YEU_CAU_BO_SUNG").length}
                </div>
                <div className="text-[10px] text-gray-500">Bổ sung duy nhất 1 lần</div>
              </div>

              <div className="bg-white p-2.5 rounded border border-purple-200 shadow-2xs">
                <div className="text-purple-700 text-[11px] flex items-center justify-between font-semibold">
                  <span>Chờ Lãnh đạo ký số</span>
                  <Stamp className="size-3.5 text-purple-600" />
                </div>
                <div className="text-xl font-black text-purple-700 mt-1">
                  {hoSoTTHCGiaoDucList.filter((h) => h.trangThai === "CHO_PHE_DUYET").length}
                </div>
                <div className="text-[10px] text-gray-500">Đã hoàn thành Tờ trình</div>
              </div>

              <div className="bg-white p-2.5 rounded border border-emerald-200 shadow-2xs">
                <div className="text-emerald-700 text-[11px] flex items-center justify-between font-semibold">
                  <span>Đã duyệt / Sẵn sàng trả dân</span>
                  <BadgeCheck className="size-3.5 text-emerald-600" />
                </div>
                <div className="text-xl font-black text-emerald-700 mt-1">
                  {hoSoTTHCGiaoDucList.filter((h) => h.trangThai === "DA_PHE_DUYET" || h.trangThai === "DA_TRA_KET_QUA").length}
                </div>
                <div className="text-[10px] text-gray-500">Đã ký số Quyết định</div>
              </div>
            </div>

            {/* Sơ đồ luân chuyển hồ sơ Một cửa (6 Bước quy chuẩn) */}
            <div className="mt-3 bg-white/80 backdrop-blur-xs p-3 rounded border border-gray-200">
              <div className="text-[11px] font-bold text-gray-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <Clock className="size-3 text-[#dd4b39]" />
                <span>Quy trình 6 bước Giải quyết Giấy tờ TTHC Giáo dục (Nghị định 61/2018/NĐ-CP)</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-[11px]">
                <div className="p-2 rounded bg-blue-50/80 border border-blue-200">
                  <div className="font-bold text-blue-900">B1. Tiếp nhận hồ sơ</div>
                  <div className="text-blue-700 text-[10px] mt-0.5">Một cửa cấp Giấy hẹn Mẫu 01 kèm QR tra cứu</div>
                </div>
                <div className="p-2 rounded bg-indigo-50/80 border border-indigo-200">
                  <div className="font-bold text-indigo-900">B2. Thẩm định pháp lý</div>
                  <div className="text-indigo-700 text-[10px] mt-0.5">Kiểm tra văn bằng, Đề án. Thiếu phát Mẫu 02</div>
                </div>
                <div className="p-2 rounded bg-amber-50/80 border border-amber-200">
                  <div className="font-bold text-amber-900">B3. Thẩm định thực địa</div>
                  <div className="text-amber-700 text-[10px] mt-0.5">Đoàn liên ngành GD - Y tế - PCCC lập Biên bản</div>
                </div>
                <div className="p-2 rounded bg-sky-50/80 border border-sky-200">
                  <div className="font-bold text-sky-900">B4. Lập Tờ trình</div>
                  <div className="text-sky-700 text-[10px] mt-0.5">Công chức chuyên môn trình Chủ tịch UBND</div>
                </div>
                <div className="p-2 rounded bg-purple-50/80 border border-purple-200">
                  <div className="font-bold text-purple-900">B5. Ký số điện tử</div>
                  <div className="text-purple-700 text-[10px] mt-0.5">Chủ tịch UBND Phường ký số SmartCA Quyết định</div>
                </div>
                <div className="p-2 rounded bg-emerald-50/80 border border-emerald-200">
                  <div className="font-bold text-emerald-900">B6. Trả kết quả</div>
                  <div className="text-emerald-700 text-[10px] mt-0.5">Trả QĐ &amp; Cấp phép, lập Phiếu Mẫu 05</div>
                </div>
              </div>
            </div>
          </div>

          {/* Cảnh báo Kỷ cương Công vụ Một cửa nếu có hồ sơ trễ hạn (Nghị định 61/2018/NĐ-CP) */}
          {hoSoTTHCGiaoDucList.some((h) => calculateSlaStatus(h.ngayHenTra, h.trangThai).status === "QUA_HAN") && (
            <div className="bg-red-50 border-l-4 border-red-600 p-3.5 rounded-r-md shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <AlertOctagon className="size-5 text-red-600 shrink-0 mt-0.5 animate-bounce" />
                <div>
                  <h4 className="text-xs font-bold text-red-900 uppercase">
                    Cảnh báo Kỷ cương Công vụ Một cửa (Nghị định 61/2018/NĐ-CP &amp; Nghị định 107/2021/NĐ-CP)
                  </h4>
                  <p className="text-xs text-red-700 mt-0.5 leading-relaxed">
                    Hiện có hồ sơ đã <strong>quá hạn hẹn trả kết quả</strong>. Cán bộ Một cửa và Cán bộ chuyên môn thụ lý có trách nhiệm lập ngay <strong>Phiếu xin lỗi và hẹn lại ngày trả kết quả (Mẫu số 04)</strong> trình Lãnh đạo UBND Phường ký số phát hành cho công dân.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setFilterSlaTTHC("QUA_HAN")}
                className="shrink-0 px-3 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors"
              >
                <Timer className="size-3.5" />
                <span>Lọc hồ sơ Quá hạn</span>
              </button>
            </div>
          )}

          {/* Bộ lọc & Tìm kiếm Hồ sơ TTHC */}
          <div className="bg-white rounded-md border border-gray-200 p-3 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="size-3.5 absolute left-2.5 top-2.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm theo mã hồ sơ, tên cơ sở, người nộp, CCCD, SĐT..."
                  value={searchTTHC}
                  onChange={(e) => setSearchTTHC(e.target.value)}
                  className="w-full rounded border border-gray-300 pl-8 pr-3 py-1.5 text-xs outline-none focus:border-[#dd4b39]"
                />
              </div>

              <select
                value={filterThuTucTTHC}
                onChange={(e) => setFilterThuTucTTHC(e.target.value)}
                className="rounded border border-gray-300 px-2.5 py-1.5 text-xs outline-none bg-white font-medium"
              >
                <option value="ALL">Tất cả thủ tục hành chính</option>
                <option value="TTHC-GD-BGD/01">Thành lập nhóm trẻ độc lập tư thục</option>
                <option value="TTHC-GD-BGD/02">Thành lập lớp mẫu giáo độc lập</option>
                <option value="TTHC-GD-BGD/03">Chuyển địa điểm &amp; quy mô cơ sở</option>
                <option value="TTHC-GD-BGD/04">Hỗ trợ tiền ăn trưa &amp; chi phí học tập</option>
              </select>

              <select
                value={filterTrangThaiTTHC}
                onChange={(e) => setFilterTrangThaiTTHC(e.target.value)}
                className="rounded border border-gray-300 px-2.5 py-1.5 text-xs outline-none bg-white font-medium"
              >
                <option value="ALL">Tất cả trạng thái hồ sơ</option>
                <option value="MOI_TIEP_NHAN">Mới tiếp nhận (B1)</option>
                <option value="DANG_THAM_DINH">Đang thẩm định hồ sơ (B2)</option>
                <option value="YEU_CAU_BO_SUNG">Yêu cầu bổ sung - Mẫu 02 (B2)</option>
                <option value="KIEM_TRA_THUC_DIA">Kiểm tra thực địa liên ngành (B3)</option>
                <option value="CHO_PHE_DUYET">Chờ Lãnh đạo ký số (B4/B5)</option>
                <option value="DA_PHE_DUYET">Đã ký số Quyết định (B5)</option>
                <option value="DA_TRA_KET_QUA">Đã trả kết quả cho dân (B6)</option>
              </select>

              <select
                value={filterSlaTTHC}
                onChange={(e) => setFilterSlaTTHC(e.target.value as any)}
                className="rounded border border-gray-300 px-2.5 py-1.5 text-xs outline-none bg-white font-semibold text-gray-800"
              >
                <option value="ALL">Tất cả tiến độ hạn (SLA)</option>
                <option value="CON_HAN">Đang còn hạn</option>
                <option value="SAP_TRE_HAN">⚠️ Sắp đến hạn (≤ 3 ngày)</option>
                <option value="QUA_HAN">🚨 Quá hạn hẹn trả (Cần lập Mẫu 04)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-[11px]">
                Tìm thấy <strong>{filteredTTHCList.length}</strong> / {hoSoTTHCGiaoDucList.length} hồ sơ
              </span>
              {(searchTTHC || filterThuTucTTHC !== "ALL" || filterTrangThaiTTHC !== "ALL" || filterSlaTTHC !== "ALL") && (
                <button
                  onClick={() => {
                    setSearchTTHC("");
                    setFilterThuTucTTHC("ALL");
                    setFilterTrangThaiTTHC("ALL");
                    setFilterSlaTTHC("ALL");
                  }}
                  className="px-2 py-1 text-[11px] rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold cursor-pointer"
                >
                  Xóa lọc
                </button>
              )}
            </div>
          </div>

          {/* Danh sách Hồ sơ TTHC Giáo dục */}
          <div className="space-y-3">
            {filteredTTHCList.map((hoSo) => {
              const countNop = hoSo.thanhPhanHoSo.filter((t) => t.daNop).length;
              const totalGiayTo = hoSo.thanhPhanHoSo.length;
              const isDuGiayTo = countNop === totalGiayTo;

              return (
                <div
                  key={hoSo.id}
                  className="bg-white rounded-lg border border-gray-200 p-4 shadow-xs hover:border-[#dd4b39]/50 transition-colors space-y-3"
                >
                  {/* Top: Mã hồ sơ + Tên TTHC + Status Badge */}
                  <div className="flex flex-wrap items-start justify-between gap-2 border-b border-gray-100 pb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-black text-sm px-2.5 py-0.5 rounded bg-gray-100 text-gray-800 border border-gray-300">
                          {hoSo.maHoSo}
                        </span>

                        {hoSo.hinhThucNop === "TRUC_TIEP_MOT_CUA" ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                            <Building className="size-3" />
                            Một cửa trực tiếp
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                            <ExternalLink className="size-3" />
                            Cổng DVC Quốc gia
                          </span>
                        )}

                        {/* Status Badges */}
                        {hoSo.trangThai === "MOI_TIEP_NHAN" && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
                            1. Mới tiếp nhận
                          </span>
                        )}
                        {hoSo.trangThai === "DANG_THAM_DINH" && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-300">
                            2. Đang thẩm định hồ sơ
                          </span>
                        )}
                        {hoSo.trangThai === "YEU_CAU_BO_SUNG" && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-800 border border-red-300 flex items-center gap-1">
                            <AlertCircle className="size-3 text-red-600" />
                            2. Yêu cầu bổ sung hồ sơ (Mẫu 02)
                          </span>
                        )}
                        {hoSo.trangThai === "KIEM_TRA_THUC_DIA" && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                            <ShieldCheck className="size-3 text-amber-700" />
                            3. Kiểm tra thực địa liên ngành
                          </span>
                        )}
                        {hoSo.trangThai === "CHO_PHE_DUYET" && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-900 border border-purple-300 flex items-center gap-1">
                            <Stamp className="size-3 text-purple-700" />
                            4. Đã có Tờ trình · Chờ ký số
                          </span>
                        )}
                        {hoSo.trangThai === "DA_PHE_DUYET" && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                            <BadgeCheck className="size-3.5 text-emerald-700" />
                            5. Đã ký số Quyết định · Chờ trả dân
                          </span>
                        )}
                        {hoSo.trangThai === "DA_TRA_KET_QUA" && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gray-100 text-gray-800 border border-gray-300 flex items-center gap-1">
                            <CheckCheck className="size-3.5 text-gray-600" />
                            6. Đã hoàn tất trả kết quả
                          </span>
                        )}
                      </div>

                      <h3 className="font-extrabold text-sm text-gray-900">{hoSo.tenThuTuc}</h3>
                    </div>

                    <div className="flex flex-col items-end gap-1 text-right">
                      {(() => {
                        const sla = calculateSlaStatus(hoSo.ngayHenTra, hoSo.trangThai);
                        return (
                          <>
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] border ${sla.badgeClass}`}>
                              <span className={`size-1.5 rounded-full ${sla.dotClass}`} />
                              <span>{sla.label}</span>
                            </span>
                            <div className="text-gray-600 text-xs">
                              Hẹn trả: <strong className="font-mono text-gray-900">{hoSo.ngayHenTra}</strong>
                            </div>
                            <div className="text-[10px] text-gray-400">
                              Tiếp nhận: {hoSo.ngayTiepNhan}
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Body 2 columns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {/* Cột 1: Thông tin công dân & Cơ sở */}
                    <div className="space-y-1.5 bg-gray-50/70 p-3 rounded border border-gray-200">
                      <div>
                        <span className="text-gray-500">Người nộp hồ sơ:</span>{" "}
                        <strong className="text-gray-900 uppercase">{hoSo.nguoiNop}</strong>
                        <span className="ml-2 font-mono text-gray-600">({hoSo.soDienThoai})</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Số CCCD / VNeID:</span>{" "}
                        <strong className="font-mono text-gray-800">{hoSo.cccd}</strong>
                        <span className="ml-2 text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded font-bold">
                          Đã đối soát CSDL Dân cư
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Cơ sở đề nghị:</span>{" "}
                        <strong className="text-emerald-800">{hoSo.tenCoSoDeNghi}</strong>
                      </div>
                      <div>
                        <span className="text-gray-500">Địa chỉ hoạt động:</span>{" "}
                        <span className="text-gray-700">{hoSo.diaDiemCoSo}</span>
                      </div>
                      <div className="text-[11px] text-gray-500 pt-1 border-t border-gray-200/60 flex items-center justify-between">
                        <span>Cán bộ Một cửa: <strong>{hoSo.canBoTiepNhan}</strong></span>
                        <span>Thụ lý: <strong>{hoSo.canBoThuLy}</strong></span>
                      </div>
                    </div>

                    {/* Cột 2: Tiến độ giấy tờ & Tờ trình/Quyết định */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-700">Thành phần hồ sơ tiếp nhận:</span>
                        <span
                          className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                            isDuGiayTo ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {countNop}/{totalGiayTo} giấy tờ hợp lệ
                        </span>
                      </div>

                      {/* Document tags */}
                      <div className="flex flex-wrap gap-1 text-[10px]">
                        {hoSo.thanhPhanHoSo.map((gt) => (
                          <span
                            key={gt.id}
                            className={`px-1.5 py-0.5 rounded border flex items-center gap-1 ${
                              gt.daNop
                                ? "bg-white text-gray-700 border-gray-200"
                                : "bg-red-50 text-red-700 border-red-200 font-bold"
                            }`}
                            title={gt.ghiChu || gt.tenGiayTo}
                          >
                            {gt.daNop ? (
                              <Check className="size-2.5 text-emerald-600" />
                            ) : (
                              <X className="size-2.5 text-red-600" />
                            )}
                            <span className="max-w-[170px] truncate">{gt.tenGiayTo}</span>
                          </span>
                        ))}
                      </div>

                      {/* Khối cảnh báo yêu cầu bổ sung nếu có */}
                      {hoSo.trangThai === "YEU_CAU_BO_SUNG" && hoSo.lyDoBoSung && (
                        <div className="p-2 rounded bg-red-50 border border-red-200 text-red-800 text-[11px]">
                          <div className="font-bold flex items-center gap-1">
                            <AlertTriangle className="size-3 text-red-600" />
                            Nội dung yêu cầu bổ sung (Mẫu số 02):
                          </div>
                          <div className="mt-0.5">{hoSo.lyDoBoSung}</div>
                          {hoSo.hanBoSung && (
                            <div className="mt-1 text-[10px] text-red-700 font-semibold">
                              Hạn công dân nộp lại: {hoSo.hanBoSung}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Khối hiển thị Phiếu xin lỗi nếu có (Mẫu 04) */}
                      {hoSo.phieuXinLoi && (
                        <div className="p-2.5 rounded bg-amber-50 border border-amber-300 text-amber-900 text-[11px] space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="font-bold flex items-center gap-1 text-amber-800">
                              <AlertOctagon className="size-3.5 text-amber-700" />
                              <span>Phiếu xin lỗi &amp; Hẹn lại ngày trả ({hoSo.phieuXinLoi.soPhieu}):</span>
                            </div>
                            <button
                              onClick={() => {
                                setViewingPhieuXinLoi(hoSo);
                                setInputLyDoXinLoi(hoSo.phieuXinLoi?.lyDo || "");
                                setInputNgayHenMoi(hoSo.phieuXinLoi?.ngayHenMoi || "");
                              }}
                              className="px-2 py-0.5 rounded bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] cursor-pointer"
                            >
                              Xem Mẫu 04
                            </button>
                          </div>
                          <div className="text-gray-700">Lý do chậm: <em>{hoSo.phieuXinLoi.lyDo}</em></div>
                          <div className="text-amber-800 font-semibold flex items-center gap-1">
                            <Calendar className="size-3 text-red-600" />
                            <span>Hẹn trả lại mới:</span>
                            <span className="font-mono font-bold text-red-700">{hoSo.phieuXinLoi.ngayHenMoi}</span>
                            <span className="text-[10px] text-gray-500">({hoSo.phieuXinLoi.nguoiKy})</span>
                          </div>
                        </div>
                      )}

                      {/* Khối hiển thị Biên bản thực địa nếu có */}
                      {hoSo.ketQuaThucDia && (
                        <div className="p-2 rounded bg-emerald-50/80 border border-emerald-200 text-emerald-900 text-[11px]">
                          <div className="font-bold flex items-center gap-1">
                            <CheckCircle2 className="size-3 text-emerald-600" />
                            Biên bản kiểm tra liên ngành số {hoSo.ketQuaThucDia.bienBanSo} ({hoSo.ketQuaThucDia.ngayKiemTra}):
                          </div>
                          <div className="mt-0.5 line-clamp-2 text-[10px] text-emerald-800">
                            {hoSo.ketQuaThucDia.noiDungKiemTra}
                          </div>
                        </div>
                      )}

                      {/* Khối hiển thị Quyết định đã ký số */}
                      {hoSo.quyetDinh && hoSo.quyetDinh.daKySo && (
                        <div className="p-2 rounded bg-amber-50/80 border border-amber-200 text-amber-900 text-[11px] flex items-center justify-between">
                          <div>
                            <span className="font-bold text-[#b91c1c]">Quyết định số: {hoSo.quyetDinh.soQuyetDinh}</span>
                            <div className="text-[10px] text-gray-600 font-mono mt-0.5">
                              Ký bởi: {hoSo.quyetDinh.nguoiKy} · Mã CA: {hoSo.quyetDinh.maXacThucKySo}
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold text-[10px]">
                            ĐÃ KÝ SỐ
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Bar (Thanh nút nghiệp vụ hành chính giấy tờ) */}
                  <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5 text-xs">
                      {/* Nút Giấy hẹn Một cửa */}
                      <button
                        onClick={() => setViewingGiayHen(hoSo)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded border border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold transition-colors cursor-pointer"
                        title="Xem và In Giấy tiếp nhận hồ sơ và Hẹn trả kết quả theo Nghị định 61/2018/NĐ-CP"
                      >
                        <FileText className="size-3.5 text-blue-600" />
                        <span>Giấy hẹn (Mẫu 01)</span>
                      </button>

                      {/* Nút Phiếu yêu cầu bổ sung */}
                      <button
                        onClick={() => {
                          setViewingPhieuBoSung(hoSo);
                          setInputLyDoBoSung(hoSo.lyDoBoSung || "");
                          setInputHanBoSung(hoSo.hanBoSung || "");
                        }}
                        className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded border font-bold transition-colors cursor-pointer ${
                          hoSo.trangThai === "YEU_CAU_BO_SUNG"
                            ? "bg-red-100 border-red-300 text-red-800"
                            : "border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-700"
                        }`}
                        title="Xem/Lập Phiếu yêu cầu bổ sung, hoàn thiện hồ sơ theo Thông tư 01/2018/TT-VPCP"
                      >
                        <AlertCircle className="size-3.5 text-red-600" />
                        <span>Phiếu bổ sung (Mẫu 02)</span>
                      </button>

                      {/* Nút Phiếu xin lỗi Mẫu 04 nếu hồ sơ Quá hạn hoặc đã lập */}
                      {(() => {
                        const sla = calculateSlaStatus(hoSo.ngayHenTra, hoSo.trangThai);
                        if (hoSo.phieuXinLoi) {
                          return (
                            <button
                              onClick={() => {
                                setViewingPhieuXinLoi(hoSo);
                                setInputLyDoXinLoi(hoSo.phieuXinLoi?.lyDo || "");
                                setInputNgayHenMoi(hoSo.phieuXinLoi?.ngayHenMoi || "");
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold transition-colors cursor-pointer"
                              title="Xem Phiếu xin lỗi và hẹn lại ngày trả kết quả (Mẫu số 04 theo Nghị định 61/2018/NĐ-CP)"
                            >
                              <AlertOctagon className="size-3.5 text-amber-700" />
                              <span>Phiếu xin lỗi (Mẫu 04)</span>
                            </button>
                          );
                        }
                        if (sla.status === "QUA_HAN") {
                          return (
                            <button
                              onClick={() => {
                                setViewingPhieuXinLoi(hoSo);
                                setInputLyDoXinLoi("Do quy trình kiểm tra thực địa liên ngành và đối soát hồ sơ phòng cháy chữa cháy cần thêm thời gian xác minh thực tế");
                                const d = new Date();
                                d.setDate(d.getDate() + 5);
                                setInputNgayHenMoi(d.toLocaleDateString("vi-VN"));
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded border border-red-500 bg-red-600 hover:bg-red-700 text-white font-extrabold shadow-xs transition-colors cursor-pointer animate-pulse"
                              title="Hồ sơ đã quá hạn! Bắt buộc phát hành Phiếu xin lỗi và hẹn lại ngày trả kết quả theo NĐ 61/2018/NĐ-CP"
                            >
                              <AlertOctagon className="size-3.5 text-white" />
                              <span>Lập Phiếu xin lỗi (Mẫu 04)</span>
                            </button>
                          );
                        }
                        return null;
                      })()}

                      {/* Nút Biên bản thực địa */}
                      <button
                        onClick={() => {
                          setViewingBienBanThucDia(hoSo);
                          if (hoSo.ketQuaThucDia) {
                            setInputThucDiaTruongDoan(hoSo.ketQuaThucDia.truongDoan);
                            setInputThucDiaYTe(hoSo.ketQuaThucDia.daiDienYTe);
                            setInputThucDiaPCCC(hoSo.ketQuaThucDia.daiDienCongAnPCCC);
                            setInputThucDiaKetLuan(hoSo.ketQuaThucDia.ketLuan);
                            setInputThucDiaNoiDung(hoSo.ketQuaThucDia.noiDungKiemTra);
                          }
                        }}
                        className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded border font-bold transition-colors cursor-pointer ${
                          hoSo.ketQuaThucDia
                            ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                            : "border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-700"
                        }`}
                        title="Xem/Ghi Biên bản kiểm tra thẩm định thực tế liên ngành (GD-Y tế-PCCC)"
                      >
                        <ShieldCheck className="size-3.5 text-emerald-600" />
                        <span>Biên bản thực địa</span>
                      </button>

                      {/* Nút Tờ trình UBND */}
                      <button
                        onClick={() => {
                          setViewingToTrinh(hoSo);
                          if (hoSo.toTrinh) {
                            setInputSoToTrinh(hoSo.toTrinh.soToTrinh);
                            setInputNoiDungToTrinh(hoSo.toTrinh.noiDungTrinh);
                          }
                        }}
                        className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded border font-bold transition-colors cursor-pointer ${
                          hoSo.toTrinh
                            ? "bg-sky-50 border-sky-300 text-sky-800"
                            : "border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-700"
                        }`}
                        title="Xem/Soạn Tờ trình của công chức trình Lãnh đạo UBND Phường"
                      >
                        <Send className="size-3.5 text-sky-600" />
                        <span>Tờ trình UBND</span>
                      </button>

                      {/* Nút Quyết định Ký số */}
                      <button
                        onClick={() => setViewingQuyetDinh(hoSo)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded border font-bold transition-colors cursor-pointer ${
                          hoSo.quyetDinh?.daKySo
                            ? "bg-amber-50 border-amber-300 text-amber-900"
                            : hoSo.trangThai === "CHO_PHE_DUYET"
                            ? "bg-purple-100 border-purple-300 text-purple-900 animate-pulse"
                            : "border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-700"
                        }`}
                        title="Xem và Ký số điện tử Quyết định cho phép thành lập"
                      >
                        <Stamp className="size-3.5 text-[#dd4b39]" />
                        <span>
                          {hoSo.quyetDinh?.daKySo ? "Xem QĐ đã Ký số" : "Ký số Quyết định"}
                        </span>
                      </button>

                      {/* Nút Phiếu kiểm soát */}
                      <button
                        onClick={() => setViewingPhieuKiemSoat(hoSo)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded border border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-600 font-semibold transition-colors cursor-pointer"
                        title="Xem Phiếu kiểm soát quá trình giải quyết hồ sơ (Mẫu số 05/NĐ-61)"
                      >
                        <History className="size-3.5 text-gray-500" />
                        <span>Kiểm soát (Mẫu 05)</span>
                      </button>
                    </div>

                    {/* Quick Step Switcher */}
                    <div className="flex items-center gap-1 text-xs">
                      <span className="text-[11px] text-gray-400">Chuyển bước:</span>
                      {hoSo.trangThai === "MOI_TIEP_NHAN" && (
                        <button
                          onClick={() => {
                            appStore.updateHoSoTTHCGiaoDucStatus(hoSo.id, "DANG_THAM_DINH");
                            toast.success("Đã chuyển hồ sơ sang bước: Thẩm định chuyên môn!");
                          }}
                          className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[11px] font-bold cursor-pointer"
                        >
                          → Thẩm định
                        </button>
                      )}
                      {hoSo.trangThai === "DANG_THAM_DINH" && (
                        <button
                          onClick={() => {
                            appStore.updateHoSoTTHCGiaoDucStatus(hoSo.id, "KIEM_TRA_THUC_DIA");
                            toast.success("Đã xếp lịch kiểm tra thực tế liên ngành!");
                          }}
                          className="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[11px] font-bold cursor-pointer"
                        >
                          → Kiểm tra thực địa
                        </button>
                      )}
                      {hoSo.trangThai === "KIEM_TRA_THUC_DIA" && (
                        <button
                          onClick={() => {
                            setViewingToTrinh(hoSo);
                          }}
                          className="px-2 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded text-[11px] font-bold cursor-pointer"
                        >
                          → Lập Tờ trình
                        </button>
                      )}
                      {hoSo.trangThai === "CHO_PHE_DUYET" && (
                        <button
                          onClick={() => {
                            setViewingQuyetDinh(hoSo);
                          }}
                          className="px-2 py-1 bg-[#dd4b39] hover:bg-[#c23321] text-white rounded text-[11px] font-bold cursor-pointer"
                        >
                          → Ký số ngay
                        </button>
                      )}
                      {hoSo.trangThai === "DA_PHE_DUYET" && (
                        <button
                          onClick={() => {
                            appStore.updateHoSoTTHCGiaoDucStatus(hoSo.id, "DA_TRA_KET_QUA");
                            toast.success("Đã xác nhận trả kết quả cho công dân thành công!");
                          }}
                          className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold cursor-pointer"
                        >
                          ✓ Trả kết quả
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredTTHCList.length === 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500 text-xs">
                <FileText className="size-8 mx-auto text-gray-400 mb-2" />
                <div className="font-bold text-sm text-gray-700">Không tìm thấy hồ sơ TTHC nào</div>
                <div className="mt-1">Thử thay đổi từ khóa tìm kiếm hoặc bấm &quot;Tiếp nhận Hồ sơ TTHC Mới&quot;.</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 1: THẨM ĐỊNH CẤP PHÉP NHÓM TRẺ MẦM NON TƯ THỤC */}
      {showAddMamNonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-xl w-full border border-gray-300 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-[#dd4b39] text-white px-4 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Baby className="size-4" />
                <h3 className="font-bold text-sm">Thẩm định &amp; Ban hành Quyết định Cho phép Thành lập Nhóm trẻ</h3>
              </div>
              <button onClick={() => setShowAddMamNonModal(false)} className="text-white/80 hover:text-white">
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleCreateMamNon} className="p-4 space-y-3 text-xs overflow-y-auto flex-1">
              <div className="bg-amber-50 p-2.5 rounded border border-amber-200 text-[11px] text-amber-900">
                <strong>Căn cứ thẩm quyền:</strong> Chủ tịch UBND cấp xã cho phép thành lập nhóm trẻ, lớp mẫu giáo độc lập sau khi có biên bản kiểm tra thực tế đủ điều kiện theo <strong>Thông tư 49/2021/TT-BGDĐT</strong>.
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Tên cơ sở mầm non <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Nhóm trẻ độc lập Hoa Hướng Dương..."
                  value={tenCoSo}
                  onChange={(e) => setTenCoSo(e.target.value)}
                  className="w-full rounded border border-gray-300 p-2 text-xs outline-none focus:border-[#dd4b39]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Loại hình</label>
                  <select
                    value={loaiHinh}
                    onChange={(e) => setLoaiHinh(e.target.value as any)}
                    className="w-full rounded border border-gray-300 p-2 text-xs outline-none"
                  >
                    <option value="NHOM_TRE_DOC_LAP">Nhóm trẻ độc lập tư thục (&lt; 36 tháng)</option>
                    <option value="LOP_MAU_GIAO_DOC_LAP">Lớp mẫu giáo độc lập (3 - 5 tuổi)</option>
                    <option value="TRUONG_MAM_NON_TU_THUC">Trường mầm non tư thục</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Khu phố quản lý</label>
                  <select
                    value={khuPho}
                    onChange={(e) => setKhuPho(e.target.value)}
                    className="w-full rounded border border-gray-300 p-2 text-xs outline-none"
                  >
                    <option value="Khu phố 1">Khu phố 1</option>
                    <option value="Khu phố 2">Khu phố 2</option>
                    <option value="Khu phố 3">Khu phố 3</option>
                    <option value="Khu phố 4">Khu phố 4</option>
                    <option value="Khu phố 5">Khu phố 5</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Chủ cơ sở (Đại diện pháp luật) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Họ và tên chủ cơ sở"
                    value={chuCoSo}
                    onChange={(e) => setChuCoSo(e.target.value)}
                    className="w-full rounded border border-gray-300 p-2 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Người phụ trách chuyên môn</label>
                  <input
                    type="text"
                    placeholder="Văn bằng sư phạm mầm non"
                    value={phuTrach}
                    onChange={(e) => setPhuTrach(e.target.value)}
                    className="w-full rounded border border-gray-300 p-2 text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Địa chỉ trụ sở hoạt động</label>
                <input
                  type="text"
                  placeholder="Số nhà, tên đường, khu phố..."
                  value={diaChi}
                  onChange={(e) => setDiaChi(e.target.value)}
                  className="w-full rounded border border-gray-300 p-2 text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Số trẻ nhận giữ</label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={soTre}
                    onChange={(e) => setSoTre(Number(e.target.value))}
                    className="w-full rounded border border-gray-300 p-2 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Số giáo viên/bảo mẫu</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={soGiaoVien}
                    onChange={(e) => setSoGiaoVien(Number(e.target.value))}
                    className="w-full rounded border border-gray-300 p-2 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Diện tích nuôi dạy (m²)</label>
                  <input
                    type="number"
                    min="30"
                    value={dienTich}
                    onChange={(e) => setDienTich(Number(e.target.value))}
                    className="w-full rounded border border-gray-300 p-2 text-xs outline-none"
                  />
                </div>
              </div>

              {/* Checklist điều kiện theo quy định */}
              <div className="p-3 bg-gray-50 rounded border border-gray-200 space-y-2">
                <div className="font-bold text-gray-800 text-xs">Biên bản thẩm định liên ngành (Checklist điều kiện):</div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasCamera}
                    onChange={(e) => setHasCamera(e.target.checked)}
                    className="size-4 rounded text-[#dd4b39]"
                  />
                  <span>Hệ thống Camera an ninh kết nối trực tuyến cho phụ huynh xem</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasBepMotChieu}
                    onChange={(e) => setHasBepMotChieu(e.target.checked)}
                    className="size-4 rounded text-[#dd4b39]"
                  />
                  <span>Bếp ăn bán trú thiết kế 1 chiều, lưu mẫu thức ăn 24h</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasPccc}
                    onChange={(e) => setHasPccc(e.target.checked)}
                    className="size-4 rounded text-[#dd4b39]"
                  />
                  <span>Đảm bảo an toàn PCCC (bình chữa cháy, tiêu lệnh, lối thoát thứ 2)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasGiaoVienChuan}
                    onChange={(e) => setHasGiaoVienChuan(e.target.checked)}
                    className="size-4 rounded text-[#dd4b39]"
                  />
                  <span>100% giáo viên có bằng Cao đẳng Sư phạm Mầm non trở lên (Luật GD 2019)</span>
                </label>
              </div>

              <div className="pt-2 border-t border-gray-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddMamNonModal(false)}
                  className="px-3 py-1.5 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#dd4b39] hover:bg-[#c23321] text-white font-bold shadow-xs flex items-center gap-1.5"
                >
                  <FileCheck className="size-4" />
                  <span>Ban hành Quyết định Cấp phép</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: XEM HỒ SƠ PHÁP LÝ & QUYẾT ĐỊNH THÀNH LẬP CHUẨN THỂ THỨC HÀNH CHÍNH */}
      {viewingMn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full border border-gray-300 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-[#222d32] text-white px-4 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="size-4 text-amber-400" />
                <h3 className="font-bold text-sm">Hồ sơ Pháp lý &amp; Quyết định Thành lập Mầm non</h3>
              </div>
              <button onClick={() => setViewingMn(null)} className="text-white/80 hover:text-white">
                <X className="size-4" />
              </button>
            </div>

            <div className="p-5 text-xs overflow-y-auto space-y-4 font-serif bg-amber-50/20" id="quyet-dinh-mn-content">
              {/* Thể thức văn bản hành chính Việt Nam */}
              <div className="flex justify-between items-start border-b border-gray-300 pb-3 text-center font-sans">
                <div>
                  <div className="font-bold text-[11px] uppercase text-gray-700">UBND THÀNH PHỐ THỦ DẦU MỘT</div>
                  <div className="font-extrabold text-xs uppercase text-[#dd4b39]">UBND PHƯỜNG PHÚ CƯỜNG</div>
                  <div className="text-[10px] text-gray-500 font-mono mt-0.5">Số: {viewingMn.soQuyetDinhCapPhep}</div>
                </div>
                <div>
                  <div className="font-bold text-[11px] uppercase text-gray-800">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                  <div className="font-bold text-[11px] text-gray-700 underline">Độc lập - Tự do - Hạnh phúc</div>
                  <div className="text-[10px] text-gray-500 italic mt-0.5">
                    Thủ Dầu Một, ngày {viewingMn.ngayCapPhep}
                  </div>
                </div>
              </div>

              <div className="text-center py-2">
                <div className="text-sm font-extrabold text-gray-900 uppercase">QUYẾT ĐỊNH</div>
                <div className="text-xs font-bold text-gray-700 mt-1">
                  Về việc cho phép thành lập và hoạt động giáo dục đối với {viewingMn.tenCoSo}
                </div>
                <div className="text-xs font-extrabold text-gray-900 mt-0.5">CHỦ TỊCH ỦY BAN NHÂN DÂN PHƯỜNG PHÚ CƯỜNG</div>
              </div>

              <div className="space-y-1.5 text-justify text-gray-700 leading-relaxed font-sans text-xs">
                <p className="italic">
                  Căn cứ Luật Tổ chức chính quyền địa phương ngày 19 tháng 6 năm 2015;
                </p>
                <p className="italic">
                  Căn cứ Luật Giáo dục ngày 14 tháng 6 năm 2019;
                </p>
                <p className="italic">
                  Căn cứ Nghị định số 46/2017/NĐ-CP và Nghị định số 135/2018/NĐ-CP của Chính phủ quy định về điều kiện đầu tư và hoạt động trong lĩnh vực giáo dục;
                </p>
                <p className="italic">
                  Căn cứ Thông tư số 49/2021/TT-BGDĐT của Bộ Giáo dục và Đào tạo ban hành Quy chế tổ chức và hoạt động của nhóm trẻ độc lập, lớp mẫu giáo độc lập;
                </p>
                <p className="italic">
                  Xét Biên bản thẩm định thực tế ngày {viewingMn.ngayCapPhep} của Đoàn thẩm định liên ngành phường,
                </p>

                <div className="text-center font-bold text-gray-900 py-1 uppercase">QUYẾT ĐỊNH:</div>

                <p>
                  <strong>Điều 1.</strong> Cho phép <strong>{viewingMn.chuCoSo}</strong> thành lập và tổ chức hoạt động giáo dục đối với:
                </p>
                <ul className="list-disc pl-5 space-y-0.5 text-gray-800">
                  <li>Tên cơ sở: <strong>{viewingMn.tenCoSo}</strong> (Mã số: {viewingMn.maCoSo})</li>
                  <li>Địa chỉ: {viewingMn.diaChi} ({viewingMn.khuPho})</li>
                  <li>Quy mô nuôi giữ: Tối đa <strong>{viewingMn.soTreDangGiu} trẻ em</strong></li>
                  <li>Diện tích phòng học: <strong>{viewingMn.dienTichPhongHocM2} m²</strong></li>
                  <li>Số lượng giáo viên/bảo mẫu: <strong>{viewingMn.soGiaoVienBaoMau} người</strong></li>
                </ul>

                <p>
                  <strong>Điều 2.</strong> Người phụ trách chuyên môn: <strong>{viewingMn.nguoiPhuTrachChuyenMon}</strong>. Cơ sở chịu sự quản lý Nhà nước của UBND Phường Phú Cường và hướng dẫn chuyên môn của Phòng Giáo dục và Đào tạo Thành phố Thủ Dầu Một.
                </p>

                <p>
                  <strong>Điều 3.</strong> Quyết định này có hiệu lực kể từ ngày ký. Công chức Văn hóa - Xã hội, Trưởng Công an phường, Trưởng Khu phố và bà/ông <strong>{viewingMn.chuCoSo}</strong> chịu trách nhiệm thi hành Quyết định này./.
                </p>
              </div>

              {/* Chữ ký số hóa */}
              <div className="flex justify-between items-end pt-4 border-t border-gray-200 font-sans">
                <div className="text-[10px] text-gray-500">
                  <div className="font-bold">Nơi nhận:</div>
                  <div>- Như Điều 3;</div>
                  <div>- Phòng GD&amp;ĐT TP (để b/c);</div>
                  <div>- Lưu: VT, VH-XH.</div>
                </div>

                <div className="text-center">
                  <div className="font-bold text-xs uppercase text-gray-800">TM. ỦY BAN NHÂN DÂN</div>
                  <div className="font-bold text-xs uppercase text-gray-800">CHỦ TỊCH</div>
                  <div className="size-16 mx-auto my-1 rounded-full border-2 border-red-500 flex items-center justify-center text-[9px] font-bold text-red-600 rotate-[-12deg] bg-red-50/50">
                    ĐÃ KÝ ĐÓNG DẤU
                  </div>
                  <div className="font-bold text-xs text-gray-900">Nguyễn Văn Hiệp</div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-gray-100 border-t border-gray-200 flex items-center justify-between shrink-0">
              <span className="text-xs text-gray-500 font-mono">Trích lục từ Cơ sở dữ liệu Cấp phép Mầm non UBND Phường</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    exportDocAsWord(
                      `Quyet_dinh_thanh_lap_${viewingMn.maCoSo}`,
                      "quyet-dinh-mn-content"
                    )
                  }
                  className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Download className="size-3.5" />
                  <span>Tải Word (.doc)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toast.success("Đang gửi lệnh in Quyết định thành lập...");
                    window.print();
                  }}
                  className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <Printer className="size-3.5" />
                  <span>In Quyết định</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewingMn(null)}
                  className="px-3 py-1.5 rounded border border-gray-300 text-gray-700 hover:bg-white font-bold text-xs"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: GHI BIÊN BẢN KIỂM TRA LIÊN NGÀNH AN TOÀN MẦM NON */}
      {inspectingMn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full border border-gray-300 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-[#0073b7] text-white px-4 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <FileCheck className="size-4" />
                <h3 className="font-bold text-sm">Biên bản Kiểm tra Liên ngành An toàn Mầm non</h3>
              </div>
              <button onClick={() => setInspectingMn(null)} className="text-white/80 hover:text-white">
                <X className="size-4" />
              </button>
            </div>

            <div className="p-4 space-y-3 text-xs overflow-y-auto flex-1">
              <div className="bg-blue-50 p-2.5 rounded border border-blue-200">
                <div className="font-bold text-gray-900 text-xs">{inspectingMn.tenCoSo}</div>
                <div className="text-[11px] text-gray-600 mt-0.5">
                  Địa chỉ: {inspectingMn.diaChi} · Chủ cơ sở: {inspectingMn.chuCoSo}
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Đợt kiểm tra</label>
                <select
                  value={dotKiemTra}
                  onChange={(e) => setDotKiemTra(e.target.value)}
                  className="w-full rounded border border-gray-300 p-2 text-xs outline-none"
                >
                  <option value="KIEM_TRA_DINH_KY_DAU_NAM">Kiểm tra định kỳ đầu năm học 2026 - 2027</option>
                  <option value="KIEM_TRA_VSATTP">Kiểm tra chuyên đề Vệ sinh an toàn thực phẩm &amp; Bếp ăn</option>
                  <option value="KIEM_TRA_PCCC">Kiểm tra an toàn PCCC &amp; Cứu nạn cứu hộ</option>
                  <option value="KIEM_TRA_DOT_XUAT">Kiểm tra đột xuất phòng chống bạo hành trẻ</option>
                </select>
              </div>

              {/* Bảng checklist 5 tiêu chí */}
              <div className="p-3 bg-gray-50 rounded border border-gray-200 space-y-2">
                <div className="font-bold text-gray-800 text-xs">Nội dung đánh giá 5 tiêu chí (Thông tư 49/2021/TT-BGDĐT):</div>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checkCamera}
                    onChange={(e) => setCheckCamera(e.target.checked)}
                    className="size-4 rounded text-blue-600 mt-0.5"
                  />
                  <div>
                    <span className="font-semibold text-gray-800">1. Hệ thống Camera giám sát trực tuyến</span>
                    <p className="text-[10px] text-gray-500">Hoạt động rõ nét 24/7, phụ huynh truy cập xem trực tiếp ổn định</p>
                  </div>
                </label>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checkBep}
                    onChange={(e) => setCheckBep(e.target.checked)}
                    className="size-4 rounded text-blue-600 mt-0.5"
                  />
                  <div>
                    <span className="font-semibold text-gray-800">2. Bếp ăn một chiều &amp; Lưu mẫu thức ăn 24h</span>
                    <p className="text-[10px] text-gray-500">Hợp đồng thực phẩm nguồn gốc rõ ràng, dụng cụ inox hợp vệ sinh</p>
                  </div>
                </label>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checkPccc}
                    onChange={(e) => setCheckPccc(e.target.checked)}
                    className="size-4 rounded text-blue-600 mt-0.5"
                  />
                  <div>
                    <span className="font-semibold text-gray-800">3. An toàn Phòng cháy chữa cháy (PCCC)</span>
                    <p className="text-[10px] text-gray-500">Bình chữa cháy còn hạn kiểm định, lối thoát nạn thứ 2 thông thoáng</p>
                  </div>
                </label>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checkTyLeGv}
                    onChange={(e) => setCheckTyLeGv(e.target.checked)}
                    className="size-4 rounded text-blue-600 mt-0.5"
                  />
                  <div>
                    <span className="font-semibold text-gray-800">4. Trình độ giáo viên &amp; Định mức nuôi giữ</span>
                    <p className="text-[10px] text-gray-500">Giáo viên đạt chuẩn CĐ sư phạm MN, không vượt quá sĩ số quy định</p>
                  </div>
                </label>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checkVeSinhYTe}
                    onChange={(e) => setCheckVeSinhYTe(e.target.checked)}
                    className="size-4 rounded text-blue-600 mt-0.5"
                  />
                  <div>
                    <span className="font-semibold text-gray-800">5. Vệ sinh môi trường &amp; Y tế học đường</span>
                    <p className="text-[10px] text-gray-500">Đồ chơi khử khuẩn hàng tuần, có tủ thuốc sơ cấp cứu ban đầu</p>
                  </div>
                </label>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Kết luận của Đoàn kiểm tra</label>
                <select
                  value={inspectResult}
                  onChange={(e) => setInspectResult(e.target.value as any)}
                  className="w-full rounded border border-gray-300 p-2 text-xs outline-none font-bold"
                >
                  <option value="DAT_CHUAN_AN_TOAN">Đạt chuẩn an toàn (Được tiếp tục hoạt động bình thường)</option>
                  <option value="NHAC_NHO_KHAC_PHUC">Nhắc nhở khắc phục tồn tại (Thời hạn 15 ngày có tái kiểm tra)</option>
                  <option value="TAM_DINH_CHI">Tạm đình chỉ hoạt động để khắc phục vi phạm</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Ghi chú cụ thể &amp; Kiến nghị của Đoàn</label>
                <textarea
                  rows={3}
                  value={inspectNotes}
                  onChange={(e) => setInspectNotes(e.target.value)}
                  placeholder="Ghi nhận các điểm đạt và các điểm cơ sở cần khắc phục bổ sung..."
                  className="w-full rounded border border-gray-300 p-2 text-xs outline-none"
                />
              </div>

              <div className="pt-2 border-t border-gray-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setInspectingMn(null)}
                  className="px-3 py-1.5 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={handleSaveInspect}
                  className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Check className="size-3.5" />
                  <span>Ký lưu Biên bản kiểm tra</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: BÁO CÁO TỰ KIỂM TRA ĐẠT CHUẨN PCGD-XMC */}
      {showBaoCaoPhoCapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full border border-gray-300 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-purple-900 text-white px-4 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <BookOpen className="size-4" />
                <h3 className="font-bold text-sm">Báo cáo Tự kiểm tra Đạt chuẩn Phổ cập Giáo dục &amp; Xóa mù chữ Năm 2026</h3>
              </div>
              <button onClick={() => setShowBaoCaoPhoCapModal(false)} className="text-white/80 hover:text-white">
                <X className="size-4" />
              </button>
            </div>

            <div className="p-5 text-xs overflow-y-auto space-y-4 font-serif bg-purple-50/20" id="bao-cao-pho-cap-content">
              <div className="flex justify-between items-start border-b border-gray-300 pb-3 text-center font-sans">
                <div>
                  <div className="font-bold text-[11px] uppercase text-gray-700">BAN CHỈ ĐẠO PCGD - XMC</div>
                  <div className="font-extrabold text-xs uppercase text-purple-900">PHƯỜNG PHÚ CƯỜNG</div>
                  <div className="text-[10px] text-gray-500 font-mono mt-0.5">Số: 18/BC-BCĐPC</div>
                </div>
                <div>
                  <div className="font-bold text-[11px] uppercase text-gray-800">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                  <div className="font-bold text-[11px] text-gray-700 underline">Độc lập - Tự do - Hạnh phúc</div>
                  <div className="text-[10px] text-gray-500 italic mt-0.5">Phú Cường, ngày 10 tháng 10 năm 2026</div>
                </div>
              </div>

              <div className="text-center py-1">
                <div className="text-sm font-extrabold text-gray-900 uppercase">BÁO CÁO</div>
                <div className="text-xs font-bold text-gray-700 mt-0.5">
                  Tự kiểm tra kết quả Phổ cập giáo dục, Xóa mù chữ năm 2026
                </div>
              </div>

              <div className="space-y-2 text-justify text-gray-700 leading-relaxed font-sans text-xs">
                <p>
                  Thực hiện Nghị định số 20/2014/NĐ-CP ngày 24/3/2014 của Chính phủ và Thông tư số 07/2016/TT-BGDĐT ngày 22/3/2016 của Bộ trưởng Bộ Giáo dục và Đào tạo, Ban chỉ đạo Phổ cập giáo dục - Xóa mù chữ phường Phú Cường báo cáo kết quả như sau:
                </p>

                <div className="font-bold text-gray-900">I. CÔNG TÁC LÃNH ĐẠO, CHỈ ĐẠO VÀ ĐIỀU TRA:</div>
                <p>
                  Đảng ủy, UBND phường đã kiện toàn Ban chỉ đạo PCGD-XMC do đồng chí Phó Chủ tịch UBND phường làm Trưởng ban. Hằng năm chỉ đạo cán bộ chuyên trách và các trường học phối hợp với Công an phường rà soát dữ liệu dân cư Đề án 06, cập nhật 100% trẻ từ 0 - 18 tuổi và người trong độ tuổi 15 - 60 vào phần mềm PCGD-XMC quốc gia.
                </p>

                <div className="font-bold text-gray-900">II. KẾT QUẢ ĐỐI CHIẾU TIÊU CHUẨN CÔNG NHẬN:</div>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>1. Phổ cập GD Mầm non cho trẻ 5 tuổi:</strong> Tổng số trẻ 5 tuổi điều tra: 382 trẻ; Huy động ra lớp: 381 trẻ (<strong>99,74%</strong>, vượt chuẩn QG quy định ≥ 95%). 100% trẻ được học 2 buổi/ngày theo chương trình GDMN.
                  </li>
                  <li>
                    <strong>2. Phổ cập GD Tiểu học Mức độ 3:</strong> Trẻ 6 tuổi vào lớp 1: 100%; Tỷ lệ trẻ 11 tuổi hoàn thành chương trình tiểu học đạt <strong>99,68%</strong> (Chuẩn Mức 3 quy định ≥ 90%).
                  </li>
                  <li>
                    <strong>3. Phổ cập GD Trung học cơ sở Mức độ 3:</strong> Tỷ lệ thanh thiếu niên từ 15 đến 18 tuổi có bằng tốt nghiệp THCS đạt <strong>99,39%</strong> (Chuẩn Mức 3 quy định ≥ 95%).
                  </li>
                  <li>
                    <strong>4. Xóa mù chữ Mức độ 2:</strong> Người trong độ tuổi 15 - 60 biết chữ đạt <strong>99,96%</strong> (quy định ≥ 98%).
                  </li>
                </ul>

                <div className="font-bold text-gray-900">III. KẾT LUẬN VÀ KIẾN NGHỊ:</div>
                <p>
                  Căn cứ các tiêu chuẩn hiện hành, phường Phú Cường <strong>ĐỦ ĐIỀU KIỆN ĐẠT CHUẨN</strong>: Phổ cập giáo dục mầm non cho trẻ 5 tuổi; Phổ cập giáo dục tiểu học Mức độ 3; Phổ cập giáo dục THCS Mức độ 3; Xóa mù chữ Mức độ 2 năm 2026.
                </p>
                <p>
                  Kính đề nghị UBND Thành phố Thủ Dầu Một và Phòng Giáo dục &amp; Đào tạo thành phố tiến hành kiểm tra công nhận chính thức./.
                </p>
              </div>

              {/* Chữ ký số hóa */}
              <div className="flex justify-between items-end pt-3 border-t border-gray-200 font-sans">
                <div className="text-[10px] text-gray-500">
                  <div className="font-bold">Nơi nhận:</div>
                  <div>- UBND TP. Thủ Dầu Một;</div>
                  <div>- Phòng GD&amp;ĐT TP;</div>
                  <div>- Đảng ủy, HĐND phường;</div>
                  <div>- Lưu: BCĐ.</div>
                </div>

                <div className="text-center">
                  <div className="font-bold text-xs uppercase text-gray-800">TM. BAN CHỈ ĐẠO PCGD-XMC</div>
                  <div className="font-bold text-xs uppercase text-purple-900">TRƯỞNG BAN</div>
                  <div className="text-[10px] text-gray-500 italic mt-0.5">(Phó Chủ tịch UBND Phường)</div>
                  <div className="size-14 mx-auto my-1 rounded-full border border-purple-500 flex items-center justify-center text-[8px] font-bold text-purple-700 bg-purple-50">
                    ĐÃ DUYỆT BÁO CÁO
                  </div>
                  <div className="font-bold text-xs text-gray-900">Lê Hoàng Nam</div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-gray-100 border-t border-gray-200 flex items-center justify-between shrink-0">
              <span className="text-xs text-gray-500 font-mono">Dữ liệu kết xuất từ Hệ thống PCGD-XMC Quốc gia</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    exportDocAsWord(
                      "Bao_cao_18_BC_Ban_chi_dao_pho_cap_giao_duc",
                      "bao-cao-pho-cap-content"
                    )
                  }
                  className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Download className="size-3.5" />
                  <span>Tải Word (.doc)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toast.success("Đang gửi lệnh in Báo cáo Tự kiểm tra PCGD-XMC...");
                    window.print();
                  }}
                  className="px-3 py-1.5 rounded bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Printer className="size-3.5" />
                  <span>In Báo cáo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowBaoCaoPhoCapModal(false)}
                  className="px-3 py-1.5 rounded border border-gray-300 text-gray-700 hover:bg-white font-bold text-xs cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: ĐIỀU PHỐI ATGT CỔNG TRƯỜNG HỌC */}
      {editingSchoolAtgt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full border border-gray-300 overflow-hidden">
            <div className="bg-amber-600 text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrafficCone className="size-4" />
                <h3 className="font-bold text-sm">Điều phối ATGT Cổng trường học</h3>
              </div>
              <button onClick={() => setEditingSchoolAtgt(null)} className="text-white/80 hover:text-white">
                <X className="size-4" />
              </button>
            </div>

            <div className="p-4 space-y-3 text-xs">
              <div className="bg-amber-50 p-2.5 rounded border border-amber-200">
                <div className="font-bold text-gray-900 text-xs">{editingSchoolAtgt.tenTruong}</div>
                <div className="text-[11px] text-gray-600 mt-0.5">{editingSchoolAtgt.diaChi}</div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Khung giờ cao điểm phân luồng</label>
                <input
                  type="text"
                  value={gioPhanLuong}
                  onChange={(e) => setGioPhanLuong(e.target.value)}
                  placeholder="VD: 06:45 - 07:15 & 16:45 - 17:30"
                  className="w-full rounded border border-gray-300 p-2 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Lực lượng phối hợp ứng trực</label>
                <input
                  type="text"
                  value={lucLuongAtgt}
                  onChange={(e) => setLucLuongAtgt(e.target.value)}
                  placeholder="VD: Công an phường + Dân quân tự vệ + Đoàn thanh niên"
                  className="w-full rounded border border-gray-300 p-2 text-xs outline-none"
                />
              </div>

              <div className="pt-2 border-t border-gray-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingSchoolAtgt(null)}
                  className="px-3 py-1.5 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleSaveSchoolAtgt}
                  className="px-4 py-1.5 rounded bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Check className="size-3.5" />
                  <span>Lưu phương án</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: MỞ LỚP CHUYÊN ĐỀ TRUNG TÂM HỌC TẬP CỘNG ĐỒNG */}
      {showAddLopHocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full border border-gray-300 overflow-hidden">
            <div className="bg-indigo-700 text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="size-4" />
                <h3 className="font-bold text-sm">Mở Lớp Chuyên đề Trung tâm Học tập cộng đồng Phường</h3>
              </div>
              <button onClick={() => setShowAddLopHocModal(false)} className="text-white/80 hover:text-white">
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleCreateLopHoc} className="p-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Tên chuyên đề bồi dưỡng / tập huấn <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Kỹ năng phòng chống đuối nước, Dịch vụ công số, Kỹ năng số..."
                  value={tenChuyenDe}
                  onChange={(e) => setTenChuyenDe(e.target.value)}
                  className="w-full rounded border border-gray-300 p-2 text-xs outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Báo cáo viên / Giảng viên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Họ tên, học vị, cơ quan"
                    value={giangVien}
                    onChange={(e) => setGiangVien(e.target.value)}
                    className="w-full rounded border border-gray-300 p-2 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Số lượng học viên dự kiến</label>
                  <input
                    type="number"
                    min="10"
                    max="300"
                    value={soHocVien}
                    onChange={(e) => setSoHocVien(Number(e.target.value))}
                    className="w-full rounded border border-gray-300 p-2 text-xs outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Thời gian tổ chức</label>
                  <input
                    type="text"
                    placeholder="VD: Sáng Thứ Bảy, ngày 28/10/2026"
                    value={thoiGianLop}
                    onChange={(e) => setThoiGianLop(e.target.value)}
                    className="w-full rounded border border-gray-300 p-2 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Địa điểm</label>
                  <input
                    type="text"
                    value={diaDiemLop}
                    onChange={(e) => setDiaDiemLop(e.target.value)}
                    className="w-full rounded border border-gray-300 p-2 text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Mục tiêu &amp; Kết quả đầu ra dự kiến</label>
                <textarea
                  rows={3}
                  value={mucTieuLop}
                  onChange={(e) => setMucTieuLop(e.target.value)}
                  placeholder="Mục tiêu đào tạo, đối tượng thụ hưởng..."
                  className="w-full rounded border border-gray-300 p-2 text-xs outline-none"
                />
              </div>

              <div className="pt-2 border-t border-gray-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddLopHocModal(false)}
                  className="px-3 py-1.5 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Send className="size-3.5" />
                  <span>Phát hành Kế hoạch Mở lớp</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 7: TIẾP NHẬN HỒ SƠ TTHC GIÁO DỤC MỚI TẠI QUẦY MỘT CỬA            */}
      {/* ========================================================================= */}
      {showTiepNhanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full border border-gray-300 overflow-hidden max-h-[92vh] flex flex-col">
            <div className="bg-[#dd4b39] text-white px-5 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <FileSignature className="size-5" />
                <h3 className="font-bold text-sm sm:text-base">
                  Tiếp nhận Hồ sơ Thủ tục Hành chính Giáo dục (Một Cửa)
                </h3>
              </div>
              <button
                onClick={() => setShowTiepNhanModal(false)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleTiepNhanHoSoMoi} className="p-5 space-y-4 text-xs overflow-y-auto flex-1">
              <div className="bg-red-50 p-3 rounded border border-red-200 text-red-900 leading-relaxed">
                <strong>Quy định tiếp nhận Một cửa (Nghị định 61/2018/NĐ-CP):</strong> Kiểm tra tính đầy đủ, hợp lệ của thành phần hồ sơ. Sau khi lưu, hệ thống tự động sinh Mã hồ sơ điện tử và cấp Giấy tiếp nhận hồ sơ &amp; hẹn trả kết quả (Mẫu số 01) có mã QR tra cứu.
              </div>

              {/* Thủ tục & Kênh nộp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Thủ tục hành chính yêu cầu <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={thuTucChon}
                    onChange={(e) => handleSelectThuTuc(e.target.value)}
                    className="w-full rounded border border-gray-300 p-2 text-xs font-semibold bg-white outline-none focus:border-[#dd4b39]"
                  >
                    <option value="TTHC-GD-BGD/01">Cho phép thành lập nhóm trẻ độc lập tư thục (15 ngày)</option>
                    <option value="TTHC-GD-BGD/02">Cho phép thành lập lớp mẫu giáo độc lập (15 ngày)</option>
                    <option value="TTHC-GD-BGD/03">Chuyển địa điểm và mở rộng quy mô nhóm lớp (10 ngày)</option>
                    <option value="TTHC-GD-BGD/04">Hỗ trợ tiền ăn trưa trẻ em &amp; chi phí học tập (07 ngày)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Hình thức tiếp nhận</label>
                  <select
                    value={hinhThucMoi}
                    onChange={(e) => setHinhThucMoi(e.target.value as any)}
                    className="w-full rounded border border-gray-300 p-2 text-xs bg-white outline-none"
                  >
                    <option value="TRUC_TIEP_MOT_CUA">Trực tiếp tại Quầy Một cửa Phường</option>
                    <option value="DVC_TRUC_TUYEN_QUOC_GIA">Nộp qua Cổng Dịch vụ công Quốc gia / Tỉnh</option>
                  </select>
                </div>
              </div>

              {/* Thông tin căn cứ pháp lý & thời hạn giải quyết của thủ tục đã chọn */}
              {(() => {
                const cfg = THU_TUC_GD_CONFIGS[thuTucChon] || THU_TUC_GD_CONFIGS["TTHC-GD-BGD/01"];
                return (
                  <div className="p-3 bg-blue-50/70 border border-blue-200 rounded text-blue-900 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                    <div>
                      <span className="text-blue-700 font-medium">Căn cứ pháp lý:</span>
                      <strong className="block text-gray-900 mt-0.5">{cfg.canCuPhapLy}</strong>
                    </div>
                    <div>
                      <span className="text-blue-700 font-medium">Thời hạn giải quyết:</span>
                      <strong className="block text-gray-900 mt-0.5 font-mono">{cfg.thoiHanNgayLamViec} ngày làm việc ({cfg.thoiHanNgayLich} ngày)</strong>
                    </div>
                    <div>
                      <span className="text-blue-700 font-medium">Lệ phí giải quyết:</span>
                      <strong className="block text-emerald-700 mt-0.5 font-bold">Miễn phí (0 đồng)</strong>
                    </div>
                  </div>
                );
              })()}

              {/* Người nộp, Số điện thoại, CCCD */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Họ và tên người nộp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Bà Lê Thị Kim Tuyến"
                    value={nguoiNopMoi}
                    onChange={(e) => setNguoiNopMoi(e.target.value)}
                    className="w-full rounded border border-gray-300 p-2 text-xs outline-none focus:border-[#dd4b39]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Số điện thoại liên hệ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: 0903.887.665"
                    value={sdtMoi}
                    onChange={(e) => setSdtMoi(e.target.value)}
                    className="w-full rounded border border-gray-300 p-2 text-xs outline-none focus:border-[#dd4b39]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Số CCCD / Định danh VNeID</label>
                  <input
                    type="text"
                    placeholder="12 chữ số CCCD"
                    value={cccdMoi}
                    onChange={(e) => setCccdMoi(e.target.value)}
                    className="w-full rounded border border-gray-300 p-2 text-xs font-mono outline-none"
                  />
                </div>
              </div>

              {/* Tên cơ sở mầm non, Địa điểm & Khu phố */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-gray-700 mb-1">
                    Tên cơ sở giáo dục đề nghị thành lập <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Nhóm trẻ tư thục Hoa Hướng Dương"
                    value={tenCoSoMoi}
                    onChange={(e) => setTenCoSoMoi(e.target.value)}
                    className="w-full rounded border border-gray-300 p-2 text-xs outline-none focus:border-[#dd4b39]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Khu phố địa bàn</label>
                  <select
                    value={khuPhoMoi}
                    onChange={(e) => setKhuPhoMoi(e.target.value)}
                    className="w-full rounded border border-gray-300 p-2 text-xs bg-white outline-none"
                  >
                    <option value="Khu phố 1">Khu phố 1</option>
                    <option value="Khu phố 2">Khu phố 2</option>
                    <option value="Khu phố 3">Khu phố 3</option>
                    <option value="Khu phố 4">Khu phố 4</option>
                    <option value="Khu phố 5">Khu phố 5</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Địa điểm đặt trụ sở nhóm trẻ</label>
                <input
                  type="text"
                  placeholder="Số nhà, tên đường, khu phố, Phường Phú Cường"
                  value={diaDiemCoSoMoi}
                  onChange={(e) => setDiaDiemCoSoMoi(e.target.value)}
                  className="w-full rounded border border-gray-300 p-2 text-xs outline-none"
                />
              </div>

              {/* Bảng kê thành phần hồ sơ động theo thủ tục đã chọn */}
              {(() => {
                const cfg = THU_TUC_GD_CONFIGS[thuTucChon] || THU_TUC_GD_CONFIGS["TTHC-GD-BGD/01"];
                return (
                  <div>
                    <div className="font-bold text-gray-800 uppercase text-[11px] mb-2 flex items-center justify-between">
                      <span>Kiểm tra danh mục thành phần hồ sơ tiếp nhận ({cfg.standardDocs.length} loại giấy tờ):</span>
                      <span className="text-[10px] text-gray-500 italic">Tích chọn các giấy tờ công dân nộp</span>
                    </div>

                    <div className="border border-gray-200 rounded p-2.5 space-y-2 bg-gray-50/50 max-h-60 overflow-y-auto">
                      {cfg.standardDocs.map((doc, idx) => (
                        <label
                          key={doc.id}
                          className="flex items-start gap-2.5 p-2 rounded hover:bg-white border border-transparent hover:border-gray-200 transition-colors cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={!!checkedGiayToMoi[doc.id]}
                            onChange={(e) =>
                              setCheckedGiayToMoi({ ...checkedGiayToMoi, [doc.id]: e.target.checked })
                            }
                            className="mt-0.5 rounded text-[#dd4b39] size-4 shrink-0"
                          />
                          <div className="text-gray-800 text-xs">
                            <div>
                              <strong>{idx + 1}. {doc.tenGiayTo}</strong>{" "}
                              {doc.batBuoc ? (
                                <span className="text-red-600 font-bold text-[10px] uppercase ml-1">
                                  (*) Bắt buộc
                                </span>
                              ) : (
                                <span className="text-gray-500 font-normal italic text-[10px] ml-1">
                                  (Nếu có)
                                </span>
                              )}
                            </div>
                            {doc.ghiChu && (
                              <div className="text-[11px] text-gray-500 mt-0.5">
                                Quy cách: {doc.ghiChu} · Số lượng: {doc.soLuong} bản
                              </div>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })()}

              <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
                <span className="text-[11px] text-gray-500 italic">
                  * Hệ thống sẽ tự động cấp mã hồ sơ điện tử và in Giấy hẹn trả kết quả.
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowTiepNhanModal(false)}
                    className="px-3 py-1.5 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded bg-[#dd4b39] hover:bg-[#c23321] text-white font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <FileSignature className="size-4" />
                    <span>Tiếp nhận &amp; Cấp Giấy hẹn (Mẫu 01)</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 8: GIẤY TIẾP NHẬN HỒ SƠ VÀ HẸN TRẢ KẾT QUẢ (MẪU SỐ 01/NĐ-61)      */}
      {/* ========================================================================= */}
      {viewingGiayHen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white text-gray-900 rounded-lg shadow-2xl max-w-3xl w-full border border-gray-300 max-h-[92vh] flex flex-col">
            {/* Topbar No-print */}
            <div className="flex items-center justify-between px-6 py-3 border-b bg-gray-50 rounded-t-lg no-print shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="size-5 text-[#dd4b39]" />
                <h3 className="font-bold text-sm sm:text-base text-gray-800">
                  Giấy tiếp nhận hồ sơ và Hẹn trả kết quả (Mẫu số 01 - Nghị định 61/2018/NĐ-CP)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => exportDocAsWord(`Giay_hen_${viewingGiayHen.maHoSo}`, "giay-hen-content")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded shadow-xs cursor-pointer transition-colors"
                  title="Xuất văn bản Giấy hẹn sang tệp Word (.doc) chuẩn thể thức NĐ 30/2020"
                >
                  <Download className="size-4" />
                  Xuất Word (.doc)
                </button>
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#00a65a] hover:bg-[#008d4c] text-white text-xs font-bold rounded shadow-xs cursor-pointer transition-colors"
                >
                  <Printer className="size-4" />
                  In giấy hẹn (Ctrl+P)
                </button>
                <button
                  onClick={() => setViewingGiayHen(null)}
                  className="p-1 hover:bg-gray-200 text-gray-500 rounded cursor-pointer"
                  title="Đóng"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            {/* Nội dung Mẫu số 01 */}
            <div className="p-8 overflow-y-auto font-serif text-[13px] leading-relaxed select-text flex-1" id="giay-hen-content">
              {/* Quốc hiệu & Tiêu ngữ */}
              <div className="grid grid-cols-2 text-center pb-4 border-b border-gray-400">
                <div>
                  <div className="font-bold uppercase text-[12px]">UBND THÀNH PHỐ THỦ DẦU MỘT</div>
                  <div className="font-bold uppercase text-[13px] text-[#b91c1c]">ỦY BAN NHÂN DÂN PHƯỜNG PHÚ CƯỜNG</div>
                  <div className="text-[11px] font-sans font-medium text-gray-700">Bộ phận Tiếp nhận và Trả kết quả (Một cửa)</div>
                  <div className="text-[11px] font-sans italic mt-1">Số hồ sơ: <span className="font-mono font-bold text-black">{viewingGiayHen.maHoSo}</span></div>
                </div>
                <div>
                  <div className="font-bold uppercase text-[12px]">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                  <div className="font-bold text-[13px]">Độc lập - Tự do - Hạnh phúc</div>
                  <div className="text-[11px] italic font-sans mt-2">Phú Cường, ngày {viewingGiayHen.ngayTiepNhan.split('/')[0]} tháng {viewingGiayHen.ngayTiepNhan.split('/')[1]} năm {viewingGiayHen.ngayTiepNhan.split('/')[2]}</div>
                </div>
              </div>

              {/* Tiêu đề */}
              <div className="text-center my-5">
                <h2 className="text-lg font-bold uppercase tracking-wide text-gray-900">
                  GIẤY TIẾP NHẬN HỒ SƠ VÀ HẸN TRẢ KẾT QUẢ
                </h2>
                <div className="text-xs italic text-gray-600 font-sans">
                  (Mẫu số 01 - Ban hành kèm theo Nghị định số 61/2018/NĐ-CP của Chính phủ)
                </div>
              </div>

              {/* Thông tin hồ sơ & người nộp */}
              <div className="space-y-2 border border-gray-300 p-4 rounded bg-gray-50/50 mb-4 font-sans text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600">Đơn vị tiếp nhận:</span>{" "}
                    <strong className="text-gray-900">Bộ phận Một cửa - UBND Phường Phú Cường</strong>
                  </div>
                  <div>
                    <span className="text-gray-600">Mã quản lý hồ sơ:</span>{" "}
                    <strong className="text-gray-900 font-mono">{viewingGiayHen.maHoSo}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600">Họ và tên người nộp hồ sơ:</span>{" "}
                    <strong className="text-[#b91c1c] text-sm uppercase">{viewingGiayHen.nguoiNop}</strong>
                  </div>
                  <div>
                    <span className="text-gray-600">Số điện thoại:</span>{" "}
                    <strong className="font-mono text-gray-900">{viewingGiayHen.soDienThoai}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600">Số CCCD / Định danh:</span>{" "}
                    <strong className="font-mono text-gray-900">{viewingGiayHen.cccd}</strong>
                  </div>
                  <div>
                    <span className="text-gray-600">Tên cơ sở đề nghị:</span>{" "}
                    <strong className="text-emerald-800">{viewingGiayHen.tenCoSoDeNghi}</strong>
                  </div>
                </div>

                <div>
                  <span className="text-gray-600">Địa chỉ hoạt động cơ sở:</span>{" "}
                  <span className="text-gray-900 font-medium">{viewingGiayHen.diaDiemCoSo}</span>
                </div>

                <div>
                  <span className="text-gray-600">Thủ tục hành chính yêu cầu:</span>{" "}
                  <strong className="text-gray-900">{viewingGiayHen.tenThuTuc}</strong>
                </div>
              </div>

              {/* Thành phần hồ sơ đã nộp */}
              <div className="mb-4">
                <div className="font-bold text-xs uppercase mb-1.5 text-gray-800 font-sans">
                  1. Danh mục thành phần hồ sơ tiếp nhận gồm:
                </div>
                <table className="w-full text-xs font-sans border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700">
                      <th className="border border-gray-300 p-1.5 w-10 text-center">STT</th>
                      <th className="border border-gray-300 p-1.5 text-left">Tên loại giấy tờ, văn bản</th>
                      <th className="border border-gray-300 p-1.5 w-20 text-center">Số lượng</th>
                      <th className="border border-gray-300 p-1.5 w-28 text-center">Tình trạng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewingGiayHen.thanhPhanHoSo.map((gt, idx) => (
                      <tr key={gt.id}>
                        <td className="border border-gray-300 p-1.5 text-center">{idx + 1}</td>
                        <td className="border border-gray-300 p-1.5">{gt.tenGiayTo}</td>
                        <td className="border border-gray-300 p-1.5 text-center">{gt.soLuong} bản</td>
                        <td className="border border-gray-300 p-1.5 text-center">
                          {gt.daNop ? (
                            <span className="text-emerald-700 font-bold">✓ Đã tiếp nhận</span>
                          ) : (
                            <span className="text-red-600 font-bold">✗ Chưa nộp</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Thời gian hẹn trả kết quả */}
              <div className="grid grid-cols-2 gap-4 border border-dashed border-gray-400 p-3 rounded bg-amber-50/50 mb-5 font-sans">
                <div>
                  <div className="text-xs text-gray-600">Thời gian tiếp nhận hồ sơ:</div>
                  <div className="text-sm font-bold text-gray-800">{viewingGiayHen.ngayTiepNhan} (Giờ hành chính)</div>
                </div>
                <div>
                  <div className="text-xs text-[#b91c1c] font-bold">Thời gian hẹn trả kết quả giải quyết:</div>
                  <div className="text-sm font-extrabold text-[#b91c1c]">{viewingGiayHen.ngayHenTra} (Trước 17h00)</div>
                  <div className="text-[11px] text-gray-500 italic">Địa điểm: Bộ phận Một cửa - UBND Phường Phú Cường</div>
                </div>
              </div>

              {/* Khối Mã QR Đánh giá Dịch vụ công */}
              <div className="border-2 border-[#dd4b39] rounded-lg p-3.5 bg-red-50/40 my-5 font-sans">
                <div className="flex items-center gap-4">
                  <div className="size-24 bg-white border-2 border-gray-800 rounded p-1 shrink-0 flex flex-col items-center justify-center">
                    <QrCode className="size-20 text-gray-900" />
                  </div>
                  <div className="flex-1 text-xs">
                    <div className="font-bold text-sm text-[#b91c1c] flex items-center gap-1.5">
                      <CheckCircle2 className="size-4 text-[#b91c1c]" />
                      QUÉT MÃ QR ĐỂ TRA CỨU TIẾN ĐỘ &amp; ĐÁNH GIÁ SỰ HÀI LÒNG
                    </div>
                    <div className="text-gray-700 mt-1 leading-relaxed">
                      Công dân có thể sử dụng Camera điện thoại hoặc ứng dụng <strong>Zalo</strong> quét mã QR để kiểm tra kết quả thẩm định, nhận thông báo lịch kiểm tra thực địa hoặc đánh giá tinh thần phục vụ của Cán bộ Một cửa.
                    </div>
                    <div className="text-[10px] text-gray-500 italic mt-0.5">
                      Mã hồ sơ tra cứu: <span className="font-mono font-bold text-blue-700">{viewingGiayHen.maHoSo}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chữ ký hai bên */}
              <div className="grid grid-cols-2 text-center pt-3 font-sans">
                <div>
                  <div className="font-bold text-xs uppercase text-gray-800">NGƯỜI NỘP HỒ SƠ</div>
                  <div className="text-[11px] italic text-gray-500">(Ký và ghi rõ họ tên)</div>
                  <div className="h-16" />
                  <div className="font-semibold text-xs text-gray-800 uppercase">{viewingGiayHen.nguoiNop}</div>
                </div>
                <div>
                  <div className="font-bold text-xs uppercase text-gray-800">CÁN BỘ TIẾP NHẬN HỒ SƠ</div>
                  <div className="text-[11px] italic text-gray-500">(Ký điện tử xác thực)</div>
                  <div className="h-16 flex items-center justify-center text-emerald-700 font-semibold italic text-[11px]">
                    (Đã xác thực chữ ký điện tử một cửa)
                  </div>
                  <div className="font-bold text-xs text-gray-900">{viewingGiayHen.canBoTiepNhan}</div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-3 border-t bg-gray-50 rounded-b-lg no-print">
              <span className="text-xs text-gray-500 font-sans">
                Mẫu số 01/DVC · Bộ phận Tiếp nhận &amp; Trả kết quả UBND Phường Phú Cường
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => exportDocAsWord(`Giay_hen_${viewingGiayHen.maHoSo}`, "giay-hen-content")}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="size-4" />
                  Tải file Word (.doc)
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-[#dd4b39] hover:bg-[#c23321] text-white text-xs font-bold rounded shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="size-4" />
                  In giấy hẹn
                </button>
                <button
                  onClick={() => setViewingGiayHen(null)}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-semibold rounded cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 9: PHIẾU YÊU CẦU BỔ SUNG, HOÀN THIỆN HỒ SƠ (MẪU SỐ 02/TT-01/2018) */}
      {/* ========================================================================= */}
      {viewingPhieuBoSung && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white text-gray-900 rounded-lg shadow-2xl max-w-2xl w-full border border-gray-300 max-h-[92vh] flex flex-col">
            <div className="bg-amber-600 text-white px-5 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <AlertCircle className="size-5" />
                <h3 className="font-bold text-sm sm:text-base">
                  Phiếu yêu cầu bổ sung, hoàn thiện hồ sơ (Mẫu số 02)
                </h3>
              </div>
              <button
                onClick={() => setViewingPhieuBoSung(null)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handlePhatHanhPhieuBoSung} className="p-6 space-y-4 text-xs overflow-y-auto font-sans flex-1" id="phieu-bo-sung-content">
              <div className="p-3 bg-amber-50 border border-amber-300 rounded text-amber-900">
                <strong>Nguyên tắc công vụ (Khoản 2 Điều 17 Nghị định 61/2018/NĐ-CP):</strong> Cơ quan giải quyết TTHC chỉ được yêu cầu bổ sung, hoàn thiện hồ sơ <strong>một lần duy nhất</strong> bằng Phiếu yêu cầu Mẫu số 02. Nội dung hướng dẫn phải cụ thể, rõ ràng, nêu rõ căn cứ pháp lý.
              </div>

              <div className="border border-gray-300 rounded p-3 bg-gray-50/60 space-y-1.5">
                <div>
                  <span className="text-gray-500">Mã hồ sơ:</span>{" "}
                  <strong className="font-mono text-gray-900">{viewingPhieuBoSung.maHoSo}</strong>
                </div>
                <div>
                  <span className="text-gray-500">Họ và tên người nộp:</span>{" "}
                  <strong className="text-gray-900 uppercase">{viewingPhieuBoSung.nguoiNop}</strong> ({viewingPhieuBoSung.soDienThoai})
                </div>
                <div>
                  <span className="text-gray-500">Thủ tục:</span>{" "}
                  <strong className="text-gray-900">{viewingPhieuBoSung.tenThuTuc}</strong>
                </div>
                <div>
                  <span className="text-gray-500">Cơ sở đề nghị:</span>{" "}
                  <strong className="text-emerald-800">{viewingPhieuBoSung.tenCoSoDeNghi}</strong>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  Nội dung chi tiết yêu cầu bổ sung, hoàn thiện <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={inputLyDoBoSung}
                  onChange={(e) => setInputLyDoBoSung(e.target.value)}
                  placeholder="Ghi rõ từng văn bản, giấy tờ còn thiếu hoặc chưa đúng quy định (VD: Hợp đồng thuê địa điểm chưa đủ 3 năm; Bổ sung chứng nhận tập huấn VSATTP của cấp dưỡng...)"
                  className="w-full rounded border border-gray-300 p-2.5 text-xs outline-none focus:border-amber-600 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-800 mb-1">
                    Thời hạn người dân hoàn thiện bổ sung
                  </label>
                  <input
                    type="text"
                    value={inputHanBoSung}
                    onChange={(e) => setInputHanBoSung(e.target.value)}
                    placeholder="VD: 25/10/2026 (Trong vòng 07 ngày)"
                    className="w-full rounded border border-gray-300 p-2 text-xs outline-none focus:border-amber-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-800 mb-1">Cán bộ hướng dẫn</label>
                  <input
                    type="text"
                    readOnly
                    value="ThS. Trần Thị Kim Oanh (Công chức GD-ĐT)"
                    className="w-full rounded border border-gray-300 p-2 text-xs bg-gray-100 text-gray-600"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      exportDocAsWord(
                        `Phieu_yeu_cau_bo_sung_${viewingPhieuBoSung.maHoSo}`,
                        "phieu-bo-sung-content"
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-gray-300 bg-white hover:bg-gray-100 text-blue-700 font-bold cursor-pointer"
                  >
                    <Download className="size-3.5" />
                    Xuất Word (.doc)
                  </button>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 font-bold cursor-pointer"
                  >
                    <Printer className="size-3.5" />
                    In Phiếu Mẫu 02
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setViewingPhieuBoSung(null)}
                    className="px-3 py-1.5 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold cursor-pointer"
                  >
                    Đóng
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="size-3.5" />
                    <span>Phát hành Phiếu yêu cầu bổ sung</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 10: BIÊN BẢN KIỂM TRA THẨM ĐỊNH THỰC ĐỊA LIÊN NGÀNH                 */}
      {/* ========================================================================= */}
      {viewingBienBanThucDia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white text-gray-900 rounded-lg shadow-2xl max-w-3xl w-full border border-gray-300 max-h-[92vh] flex flex-col">
            <div className="bg-teal-700 text-white px-5 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-5" />
                <h3 className="font-bold text-sm sm:text-base">
                  {viewingBienBanThucDia.maThuTuc === "TTHC-GD-BGD/04"
                    ? "Biên bản Họp Thẩm định Hồ sơ Xét duyệt Hỗ trợ Chi phí Học tập & Tiền ăn trưa (NĐ 105 & 81)"
                    : "Biên bản Kiểm tra Thẩm định Thực địa Liên ngành (Thông tư 49/2021)"}
                </h3>
              </div>
              <button
                onClick={() => setViewingBienBanThucDia(null)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSaveThucDia} className="p-6 space-y-4 text-xs overflow-y-auto font-sans flex-1" id="bien-ban-thuc-dia-content">
              <div className="p-3 bg-teal-50 border border-teal-200 rounded text-teal-900 text-xs">
                {viewingBienBanThucDia.maThuTuc === "TTHC-GD-BGD/04" ? (
                  <div>
                    <strong>Hội đồng xét duyệt chính sách cấp xã/phường (theo Nghị định 81/2021/NĐ-CP &amp; 105/2020/NĐ-CP):</strong> Thẩm tra danh sách học sinh, đối chiếu Sổ hộ nghèo/cận nghèo và thông tin thường trú/tạm trú trên Hệ thống VNeID/Đề án 06 trước khi trình Chủ tịch UBND Phường ban hành Quyết định phê duyệt kinh phí.
                  </div>
                ) : (
                  <div>
                    <strong>Thành phần Đoàn kiểm tra liên ngành:</strong> UBND Phường (Trưởng đoàn), Trạm Y tế (Phụ trách VSATTP &amp; y tế học đường), Công an Phường (Phụ trách PCCC), Ban điều hành Khu phố sở tại.
                  </div>
                )}
              </div>

              {/* Thông tin hồ sơ & cơ sở */}
              <div className="grid grid-cols-2 gap-3 border border-gray-200 rounded p-3 bg-gray-50/60">
                <div>
                  <span className="text-gray-500">Mã hồ sơ:</span>{" "}
                  <strong className="font-mono text-gray-900">{viewingBienBanThucDia.maHoSo}</strong>
                </div>
                <div>
                  <span className="text-gray-500">Người nộp / Đại diện:</span>{" "}
                  <strong className="text-gray-900 uppercase">{viewingBienBanThucDia.nguoiNop}</strong>
                </div>
                <div>
                  <span className="text-gray-500">
                    {viewingBienBanThucDia.maThuTuc === "TTHC-GD-BGD/04" ? "Đơn vị trường học đề nghị:" : "Tên nhóm lớp đề nghị:"}
                  </span>{" "}
                  <strong className="text-emerald-800">{viewingBienBanThucDia.tenCoSoDeNghi}</strong>
                </div>
                <div>
                  <span className="text-gray-500">
                    {viewingBienBanThucDia.maThuTuc === "TTHC-GD-BGD/04" ? "Địa chỉ trường:" : "Địa chỉ thực địa:"}
                  </span>{" "}
                  <span className="text-gray-800 font-medium">{viewingBienBanThucDia.diaDiemCoSo}</span>
                </div>
              </div>

              {/* Thành phần đoàn / Hội đồng */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    {viewingBienBanThucDia.maThuTuc === "TTHC-GD-BGD/04" ? "Chủ tịch Hội đồng xét duyệt" : "Trưởng đoàn (UBND Phường)"}
                  </label>
                  <input
                    type="text"
                    value={inputThucDiaTruongDoan}
                    onChange={(e) => setInputThucDiaTruongDoan(e.target.value)}
                    className="w-full rounded border border-gray-300 p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    {viewingBienBanThucDia.maThuTuc === "TTHC-GD-BGD/04" ? "Thư ký (Công chức GD-ĐT)" : "Đại diện Trạm Y tế"}
                  </label>
                  <input
                    type="text"
                    value={inputThucDiaYTe}
                    onChange={(e) => setInputThucDiaYTe(e.target.value)}
                    className="w-full rounded border border-gray-300 p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    {viewingBienBanThucDia.maThuTuc === "TTHC-GD-BGD/04" ? "Đại diện UBMTTQ / Cán bộ Giảm nghèo" : "Đại diện Công an PCCC"}
                  </label>
                  <input
                    type="text"
                    value={inputThucDiaPCCC}
                    onChange={(e) => setInputThucDiaPCCC(e.target.value)}
                    className="w-full rounded border border-gray-300 p-2 text-xs"
                  />
                </div>
              </div>

              {/* Nội dung kiểm tra thực tế / Thẩm định hồ sơ */}
              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  {viewingBienBanThucDia.maThuTuc === "TTHC-GD-BGD/04"
                    ? "Nội dung họp Hội đồng thẩm tra danh sách đối tượng được hưởng chính sách"
                    : "Nội dung kiểm tra thực tế điều kiện cơ sở mầm non"}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={inputThucDiaNoiDung}
                  onChange={(e) => setInputThucDiaNoiDung(e.target.value)}
                  placeholder={
                    viewingBienBanThucDia.maThuTuc === "TTHC-GD-BGD/04"
                      ? "Hội đồng tiến hành rà soát 12 hồ sơ của học sinh xin trợ cấp ăn trưa và chi phí học tập học kỳ I năm học 2026-2027. Đối chiếu thông tin thường trú, sổ hộ nghèo, cận nghèo trên cơ sở dữ liệu VNeID. Tất cả 12 học sinh đều đúng đối tượng, đủ điều kiện hưởng trợ cấp tổng số tiền 18.600.000 đ..."
                      : "Ghi nhận diện tích phòng nuôi dưỡng, hệ thống camera, bình chữa cháy, lối thoát nạn phụ, tủ thuốc sơ cấp cứu, bếp ăn bán trú và điều kiện vệ sinh môi trường..."
                  }
                  className="w-full rounded border border-gray-300 p-2 text-xs font-sans"
                />
              </div>

              {/* Kết luận của đoàn */}
              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  Kết luận của {viewingBienBanThucDia.maThuTuc === "TTHC-GD-BGD/04" ? "Hội đồng xét duyệt" : "Đoàn kiểm tra liên ngành"} <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`p-3 rounded border flex items-center gap-2 cursor-pointer ${
                      inputThucDiaKetLuan === "DAT_YEU_CAU"
                        ? "bg-emerald-50 border-emerald-500 text-emerald-900 font-bold"
                        : "bg-gray-50 border-gray-300 text-gray-700"
                    }`}
                  >
                    <input
                      type="radio"
                      name="ketLuan"
                      checked={inputThucDiaKetLuan === "DAT_YEU_CAU"}
                      onChange={() => setInputThucDiaKetLuan("DAT_YEU_CAU")}
                    />
                    <span>
                      {viewingBienBanThucDia.maThuTuc === "TTHC-GD-BGD/04"
                        ? "ĐỦ ĐIỀU KIỆN (100% nhất trí đề nghị ban hành Quyết định phê duyệt)"
                        : "ĐẠT YÊU CẦU (Đủ điều kiện ban hành Quyết định thành lập)"}
                    </span>
                  </label>

                  <label
                    className={`p-3 rounded border flex items-center gap-2 cursor-pointer ${
                      inputThucDiaKetLuan === "CHUA_DAT_YEU_CAU"
                        ? "bg-red-50 border-red-500 text-red-900 font-bold"
                        : "bg-gray-50 border-gray-300 text-gray-700"
                    }`}
                  >
                    <input
                      type="radio"
                      name="ketLuan"
                      checked={inputThucDiaKetLuan === "CHUA_DAT_YEU_CAU"}
                      onChange={() => setInputThucDiaKetLuan("CHUA_DAT_YEU_CAU")}
                    />
                    <span>
                      {viewingBienBanThucDia.maThuTuc === "TTHC-GD-BGD/04"
                        ? "CHƯA ĐỦ ĐIỀU KIỆN (Yêu cầu xác minh lại đối tượng)"
                        : "CHƯA ĐẠT (Yêu cầu khắc phục / Bổ sung)"}
                    </span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      exportDocAsWord(
                        `Bien_ban_thuc_dia_${viewingBienBanThucDia.maHoSo}`,
                        "bien-ban-thuc-dia-content"
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-gray-300 bg-white hover:bg-gray-100 text-blue-700 font-bold cursor-pointer"
                  >
                    <Download className="size-3.5" />
                    Xuất Word (.doc)
                  </button>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 font-bold cursor-pointer"
                  >
                    <Printer className="size-3.5" />
                    In Biên bản liên ngành
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setViewingBienBanThucDia(null)}
                    className="px-3 py-1.5 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold cursor-pointer"
                  >
                    Đóng
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded bg-teal-700 hover:bg-teal-800 text-white font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="size-3.5" />
                    <span>Lưu Biên bản &amp; Cập nhật tiến độ</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 11: TỜ TRÌNH ĐỀ NGHỊ BAN HÀNH QUYẾT ĐỊNH (NGHỊ ĐỊNH 30/2020)       */}
      {/* ========================================================================= */}
      {viewingToTrinh && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white text-gray-900 rounded-lg shadow-2xl max-w-3xl w-full border border-gray-300 max-h-[92vh] flex flex-col">
            <div className="bg-sky-700 text-white px-5 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Send className="size-5" />
                <h3 className="font-bold text-sm sm:text-base">
                  Tờ trình Đề nghị ban hành Quyết định cho phép thành lập cơ sở
                </h3>
              </div>
              <button
                onClick={() => setViewingToTrinh(null)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSaveToTrinh} className="p-6 space-y-4 text-xs overflow-y-auto font-sans flex-1" id="to-trinh-content">
              <div className="p-3 bg-sky-50 border border-sky-200 rounded text-sky-900">
                <strong>Thể thức Tờ trình hành chính (Nghị định 30/2020/NĐ-CP):</strong> Công chức chuyên môn tham mưu lập Tờ trình trình Lãnh đạo Ủy ban nhân dân Phường xem xét, phê duyệt và ký số ban hành Quyết định thành lập.
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Số Tờ trình</label>
                  <input
                    type="text"
                    value={inputSoToTrinh}
                    onChange={(e) => setInputSoToTrinh(e.target.value)}
                    placeholder="VD: 21/TTr-VHXH"
                    className="w-full rounded border border-gray-300 p-2 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Cơ quan nhận tờ trình</label>
                  <input
                    type="text"
                    readOnly
                    value="Kính trình: Chủ tịch UBND Phường Phú Cường"
                    className="w-full rounded border border-gray-300 p-2 text-xs bg-gray-100 font-semibold text-gray-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Nội dung Tờ trình tham mưu <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={5}
                  required
                  value={inputNoiDungToTrinh}
                  onChange={(e) => setInputNoiDungToTrinh(e.target.value)}
                  placeholder="Kính trình Chủ tịch UBND Phường xem xét ban hành Quyết định cho phép thành lập... Hồ sơ đã được thẩm định đúng theo Thông tư 49/2021/TT-BGDĐT..."
                  className="w-full rounded border border-gray-300 p-2 text-xs font-serif leading-relaxed"
                />
              </div>

              <div className="border border-gray-200 rounded p-3 bg-gray-50/70 space-y-1 text-[11px]">
                <div className="font-bold text-gray-700">Tài liệu kèm theo Tờ trình:</div>
                <div>1. Đơn đề nghị của chủ cơ sở {viewingToTrinh.nguoiNop}</div>
                <div>2. Đề án thành lập và hồ sơ bằng cấp chuyên môn giáo viên</div>
                <div>3. Biên bản kiểm tra thẩm định thực tế liên ngành (Kết luận ĐẠT YÊU CẦU)</div>
                <div>4. Dự thảo Quyết định cho phép thành lập nhóm trẻ</div>
              </div>

              <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      exportDocAsWord(
                        `To_trinh_${viewingToTrinh.maHoSo}`,
                        "to-trinh-content"
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-gray-300 bg-white hover:bg-gray-100 text-blue-700 font-bold cursor-pointer"
                  >
                    <Download className="size-3.5" />
                    Xuất Word (.doc)
                  </button>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 font-bold cursor-pointer"
                  >
                    <Printer className="size-3.5" />
                    In Tờ trình
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setViewingToTrinh(null)}
                    className="px-3 py-1.5 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold cursor-pointer"
                  >
                    Đóng
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded bg-sky-700 hover:bg-sky-800 text-white font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="size-3.5" />
                    <span>Lưu Tờ trình &amp; Chuyển Lãnh đạo ký số</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 12: QUYẾT ĐỊNH CHO PHÉP THÀNH LẬP CÓ KÝ SỐ ĐIỆN TỬ                   */}
      {/* ========================================================================= */}
      {viewingQuyetDinh && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white text-gray-900 rounded-lg shadow-2xl max-w-3xl w-full border border-gray-300 max-h-[92vh] flex flex-col">
            <div className="bg-[#dd4b39] text-white px-6 py-3 flex items-center justify-between no-print shrink-0">
              <div className="flex items-center gap-2">
                <Stamp className="size-5" />
                <h3 className="font-bold text-sm sm:text-base">
                  Quyết định thành lập &amp; Giấy phép hoạt động có Ký số điện tử
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {!viewingQuyetDinh.quyetDinh?.daKySo && (
                  <button
                    onClick={handleKySoQuyetDinh}
                    className="px-3 py-1.5 rounded bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Stamp className="size-3.5" />
                    <span>Tiến hành Ký số điện tử</span>
                  </button>
                )}
                <button
                  onClick={() =>
                    exportDocAsWord(
                      `Quyet_dinh_${(viewingQuyetDinh.quyetDinh?.soQuyetDinh || viewingQuyetDinh.maHoSo).replace(/\//g, "_")}`,
                      "quyet-dinh-content"
                    )
                  }
                  className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-1 cursor-pointer"
                  title="Xuất Quyết định sang tệp Word (.doc) chuẩn thể thức Nghị định 30/2020/NĐ-CP"
                >
                  <Download className="size-3.5" />
                  <span>Xuất Word (.doc)</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="size-3.5" />
                  <span>In Quyết định (Ctrl+P)</span>
                </button>
                <button
                  onClick={() => setViewingQuyetDinh(null)}
                  className="text-white/80 hover:text-white p-1 cursor-pointer"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            {/* Nội dung Quyết định chuẩn thể thức Nghị định 30/2020 */}
            <div className="p-8 overflow-y-auto font-serif text-[13px] leading-relaxed select-text flex-1" id="quyet-dinh-content">
              {/* Quốc hiệu & Đơn vị ban hành */}
              <div className="grid grid-cols-2 text-center pb-4 border-b border-gray-400">
                <div>
                  <div className="font-bold uppercase text-[12px]">ỦY BAN NHÂN DÂN THÀNH PHỐ THỦ DẦU MỘT</div>
                  <div className="font-bold uppercase text-[13px] text-[#b91c1c]">ỦY BAN NHÂN DÂN PHƯỜNG PHÚ CƯỜNG</div>
                  <div className="text-[11px] font-sans mt-1">
                    Số: <strong className="font-mono text-black">{viewingQuyetDinh.quyetDinh?.soQuyetDinh || "175/QĐ-UBND"}</strong>
                  </div>
                </div>
                <div>
                  <div className="font-bold uppercase text-[12px]">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                  <div className="font-bold text-[13px]">Độc lập - Tự do - Hạnh phúc</div>
                  <div className="text-[11px] italic font-sans mt-2">
                    Phú Cường, ngày {viewingQuyetDinh.quyetDinh?.ngayBanHanh || new Date().toLocaleDateString("vi-VN")}
                  </div>
                </div>
              </div>

              {/* Tiêu đề Quyết định */}
              <div className="text-center my-6 space-y-1">
                <h2 className="text-base font-bold uppercase tracking-wide text-gray-900">QUYẾT ĐỊNH</h2>
                <div className="font-bold text-sm text-gray-800">
                  {viewingQuyetDinh.maThuTuc === "TTHC-GD-BGD/04"
                    ? "Về việc phê duyệt danh sách và kinh phí hỗ trợ tiền ăn trưa cho trẻ em mẫu giáo và hỗ trợ chi phí học tập học kỳ I năm học 2026 - 2027 trên địa bàn Phường Phú Cường"
                    : viewingQuyetDinh.maThuTuc === "TTHC-GD-BGD/03"
                    ? `Về việc cho phép chuyển địa điểm và mở rộng quy mô ${viewingQuyetDinh.tenCoSoDeNghi}`
                    : `Về việc cho phép thành lập ${viewingQuyetDinh.tenCoSoDeNghi}`}
                </div>
                <div className="text-xs uppercase font-extrabold text-[#b91c1c] tracking-widest pt-1">
                  CHỦ TỊCH ỦY BAN NHÂN DÂN PHƯỜNG PHÚ CƯỜNG
                </div>
              </div>

              {/* Căn cứ pháp lý */}
              <div className="space-y-1 text-justify text-xs italic text-gray-700 mb-4 font-serif">
                <p>Căn cứ Luật Tổ chức chính quyền địa phương ngày 19 tháng 6 năm 2015; Luật sửa đổi, bổ sung một số điều của Luật Tổ chức Chính phủ và Luật Tổ chức chính quyền địa phương ngày 22 tháng 11 năm 2019;</p>
                <p>Căn cứ Luật Giáo dục ngày 14 tháng 6 năm 2019;</p>
                {viewingQuyetDinh.maThuTuc === "TTHC-GD-BGD/04" ? (
                  <>
                    <p>Căn cứ Nghị định số 105/2020/NĐ-CP ngày 08 tháng 9 năm 2020 của Chính phủ quy định chính sách phát triển giáo dục mầm non;</p>
                    <p>Căn cứ Nghị định số 81/2021/NĐ-CP ngày 27 tháng 8 năm 2021 của Chính phủ quy định về cơ chế thu, quản lý học phí đối với cơ sở giáo dục thuộc hệ thống giáo dục quốc dân và chính sách miễn, giảm học phí, hỗ trợ chi phí học tập;</p>
                    <p>Căn cứ Biên bản họp Hội đồng xét duyệt chính sách trợ cấp xã hội và giáo dục Phường Phú Cường ngày {viewingQuyetDinh.ketQuaThucDia?.ngayKiemTra || "16/10/2026"};</p>
                    <p>Theo đề nghị của Công chức Văn hóa - Xã hội phụ trách Giáo dục tại Tờ trình số {viewingQuyetDinh.toTrinh?.soToTrinh || "18/TTr-VHXH"}.</p>
                  </>
                ) : (
                  <>
                    <p>Căn cứ Nghị định số 46/2017/NĐ-CP ngày 21 tháng 4 năm 2017 của Chính phủ quy định về điều kiện đầu tư và hoạt động trong lĩnh vực giáo dục; Nghị định số 135/2018/NĐ-CP ngày 04 tháng 10 năm 2018 của Chính phủ sửa đổi, bổ sung một số điều của Nghị định 46/2017/NĐ-CP;</p>
                    <p>Căn cứ Thông tư số 49/2021/TT-BGDĐT ngày 31 tháng 12 năm 2021 của Bộ Giáo dục và Đào tạo ban hành Quy chế tổ chức và hoạt động của nhóm trẻ độc lập, lớp mẫu giáo độc lập, lớp mầm non độc lập loại hình dân lập và tư thục;</p>
                    <p>Xét Đơn đề nghị ngày {viewingQuyetDinh.ngayTiepNhan} của bà/ông {viewingQuyetDinh.nguoiNop} và Biên bản kiểm tra thẩm định thực tế của Đoàn kiểm tra liên ngành ngày {viewingQuyetDinh.ketQuaThucDia?.ngayKiemTra || "15/10/2026"};</p>
                    <p>Theo đề nghị của Công chức Văn hóa - Xã hội phụ trách Giáo dục tại Tờ trình số {viewingQuyetDinh.toTrinh?.soToTrinh || "21/TTr-VHXH"}.</p>
                  </>
                )}
              </div>

              <div className="text-center font-bold text-xs uppercase my-2 tracking-wider">QUYẾT ĐỊNH:</div>

              {/* Điều khoản */}
              {viewingQuyetDinh.maThuTuc === "TTHC-GD-BGD/04" ? (
                <div className="space-y-3 text-justify text-xs font-serif leading-relaxed mb-6">
                  <p>
                    <strong>Điều 1.</strong> Phê duyệt danh sách 12 trẻ em mẫu giáo và học sinh thuộc diện hộ nghèo, hộ cận nghèo, mồ côi trên địa bàn Phường Phú Cường được hưởng chính sách hỗ trợ tiền ăn trưa và hỗ trợ chi phí học tập học kỳ I năm học 2026 - 2027.
                  </p>
                  <p className="font-sans">
                    - Tổng kinh phí phê duyệt chi trả: <strong className="text-red-700 font-bold font-mono">18.600.000 đồng</strong> (Mười tám triệu sáu trăm nghìn đồng chẵn).
                  </p>

                  {/* Bảng danh sách chi tiết 12 học sinh */}
                  <div className="font-sans overflow-x-auto my-2 not-italic">
                    <table className="w-full text-[11px] border-collapse border border-gray-400">
                      <thead>
                        <tr className="bg-gray-100 text-gray-800 font-bold text-center">
                          <th className="border border-gray-400 p-1 w-7">STT</th>
                          <th className="border border-gray-400 p-1 text-left">Họ và tên học sinh</th>
                          <th className="border border-gray-400 p-1 w-14">Năm sinh</th>
                          <th className="border border-gray-400 p-1">Lớp / Khu phố</th>
                          <th className="border border-gray-400 p-1 text-left">Diện chính sách</th>
                          <th className="border border-gray-400 p-1 text-right">Tiền ăn trưa (4T)</th>
                          <th className="border border-gray-400 p-1 text-right">Học tập (4T)</th>
                          <th className="border border-gray-400 p-1 text-right">Tổng nhận</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { stt: 1, name: "Nguyễn Mai Anh", ns: 2021, lop: "Chồi 1 / KP 1", dien: "Hộ nghèo", anTrua: 640000, hocTap: 600000 },
                          { stt: 2, name: "Trần Gia Huy", ns: 2022, lop: "Mầm 2 / KP 3", dien: "Hộ cận nghèo", anTrua: 640000, hocTap: 0 },
                          { stt: 3, name: "Lê Hoàng Phúc", ns: 2020, lop: "Lá 1 / KP 2", dien: "Mồ côi cả cha mẹ", anTrua: 640000, hocTap: 600000 },
                          { stt: 4, name: "Phạm Minh Triết", ns: 2020, lop: "Lá 2 / KP 4", dien: "Hộ nghèo", anTrua: 640000, hocTap: 600000 },
                          { stt: 5, name: "Huỳnh Ngọc Bích", ns: 2021, lop: "Chồi 2 / KP 5", dien: "Hộ nghèo", anTrua: 640000, hocTap: 600000 },
                          { stt: 6, name: "Đặng Quốc Bảo", ns: 2022, lop: "Mầm 1 / KP 6", dien: "Hộ cận nghèo", anTrua: 640000, hocTap: 0 },
                          { stt: 7, name: "Võ Thị Thùy Dung", ns: 2020, lop: "Lá 1 / KP 7", dien: "Hộ nghèo", anTrua: 640000, hocTap: 600000 },
                          { stt: 8, name: "Ngô Minh Khang", ns: 2021, lop: "Chồi 1 / KP 8", dien: "Hộ nghèo", anTrua: 640000, hocTap: 600000 },
                          { stt: 9, name: "Bùi Tuấn Kiệt", ns: 2022, lop: "Mầm 2 / KP 9", dien: "Hộ cận nghèo", anTrua: 640000, hocTap: 0 },
                          { stt: 10, name: "Phan Thanh Thảo", ns: 2020, lop: "Lá 2 / KP 3", dien: "Khuyết tật", anTrua: 640000, hocTap: 600000 },
                          { stt: 11, name: "Dương Đình Trọng", ns: 2021, lop: "Chồi 2 / KP 2", dien: "Hộ nghèo", anTrua: 640000, hocTap: 600000 },
                          { stt: 12, name: "Lâm Gia Như", ns: 2020, lop: "Lá 1 / KP 1", dien: "Hộ nghèo", anTrua: 640000, hocTap: 600000 },
                        ].map((row) => (
                          <tr key={row.stt} className="hover:bg-gray-50">
                            <td className="border border-gray-400 p-1 text-center font-mono">{row.stt}</td>
                            <td className="border border-gray-400 p-1 font-semibold">{row.name}</td>
                            <td className="border border-gray-400 p-1 text-center font-mono">{row.ns}</td>
                            <td className="border border-gray-400 p-1">{row.lop}</td>
                            <td className="border border-gray-400 p-1 text-emerald-800">{row.dien}</td>
                            <td className="border border-gray-400 p-1 text-right font-mono">{row.anTrua.toLocaleString("vi-VN")} đ</td>
                            <td className="border border-gray-400 p-1 text-right font-mono">{row.hocTap.toLocaleString("vi-VN")} đ</td>
                            <td className="border border-gray-400 p-1 text-right font-mono font-bold text-red-700">
                              {(row.anTrua + row.hocTap).toLocaleString("vi-VN")} đ
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-gray-100 font-bold">
                          <td colSpan={5} className="border border-gray-400 p-1 text-center uppercase">
                            Tổng cộng (12 học sinh)
                          </td>
                          <td className="border border-gray-400 p-1 text-right font-mono">7.680.000 đ</td>
                          <td className="border border-gray-400 p-1 text-right font-mono">5.400.000 đ</td>
                          <td className="border border-gray-400 p-1 text-right font-mono text-[#b91c1c] text-xs">
                            18.600.000 đ
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <p>
                    <strong>Điều 2.</strong> Bộ phận Kế toán - Ngân sách UBND Phường phối hợp Hiệu trưởng Trường Mầm non Hoa Mai rút dự toán kinh phí và thực hiện chi trả chế độ hỗ trợ cho phụ huynh học sinh kịp thời, đúng đối tượng và thanh quyết toán theo quy định hiện hành. Thời hạn hoàn thành chi trả trước ngày 10/11/2026.
                  </p>

                  <p>
                    <strong>Điều 3.</strong> Văn phòng HĐND - UBND phường, Bộ phận Kế toán - Ngân sách, Công chức Văn hóa - Xã hội, Hiệu trưởng Trường Mầm non Hoa Mai, Trưởng Ban điều hành các khu phố liên quan và các hộ gia đình có tên tại Điều 1 chịu trách nhiệm thi hành Quyết định này./.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 text-justify text-xs font-serif leading-relaxed mb-6">
                  <p>
                    <strong>Điều 1.</strong> Cho phép thành lập cơ sở mầm non ngoài công lập:
                  </p>
                  <div className="pl-4 space-y-1 font-sans">
                    <div>- Tên gọi cơ sở: <strong className="text-emerald-900 uppercase">{viewingQuyetDinh.tenCoSoDeNghi}</strong></div>
                    <div>- Loại hình: <strong>{viewingQuyetDinh.tenThuTuc.includes("mẫu giáo") ? "Lớp mẫu giáo độc lập tư thục" : "Nhóm trẻ độc lập tư thục"}</strong></div>
                    <div>- Chủ cơ sở / Người đại diện: <strong className="uppercase">{viewingQuyetDinh.nguoiNop}</strong> (CCCD: {viewingQuyetDinh.cccd})</div>
                    <div>- Địa điểm đặt cơ sở: <strong>{viewingQuyetDinh.diaDiemCoSo}</strong></div>
                    <div>- Thời hạn hoạt động: Theo quy định hiện hành của pháp luật về giáo dục.</div>
                  </div>

                  <p>
                    <strong>Điều 2.</strong> {viewingQuyetDinh.tenCoSoDeNghi} có trách nhiệm thực hiện đúng Điều lệ trường mầm non, Quy chế tổ chức hoạt động theo Thông tư số 49/2021/TT-BGDĐT; bảo đảm tuyệt đối an toàn tính mạng, sức khỏe cho trẻ em, phòng chống cháy nổ và vệ sinh an toàn thực phẩm.
                  </p>

                  <p>
                    <strong>Điều 3.</strong> Văn phòng HĐND - UBND phường, Công chức Văn hóa - Xã hội phụ trách Giáo dục, Trưởng Công an phường, Trưởng Trạm Y tế, Trưởng Ban điều hành {viewingQuyetDinh.khuPho} và bà/ông {viewingQuyetDinh.nguoiNop} chịu trách nhiệm thi hành Quyết định này./.
                  </p>
                </div>
              )}

              {/* Nơi nhận & Ký số */}
              <div className="grid grid-cols-2 pt-4 border-t border-gray-300 font-sans">
                <div className="text-[11px] text-gray-600 space-y-0.5">
                  <div className="font-bold text-gray-800">Nơi nhận:</div>
                  <div>- Như Điều 3;</div>
                  <div>- Phòng GD&amp;ĐT TP. Thủ Dầu Một (b/c);</div>
                  <div>- Phòng Tài chính - Kế hoạch TP;</div>
                  <div>- Lãnh đạo UBND phường;</div>
                  <div>- Bộ phận Một cửa (để trả kết quả);</div>
                  <div>- Lưu: VT, VHXH, KT.</div>
                </div>

                <div className="text-center space-y-2">
                  <div className="font-bold text-xs uppercase text-gray-900">CHỦ TỊCH</div>
                  
                  {viewingQuyetDinh.quyetDinh?.daKySo ? (
                    <div className="my-2 flex justify-center">
                      <DigitalSignatureBadge
                        nguoiKy={viewingQuyetDinh.quyetDinh.nguoiKy}
                        chucVu={viewingQuyetDinh.quyetDinh.chucVu}
                        ngayKy={viewingQuyetDinh.quyetDinh.ngayBanHanh}
                        maXacThuc={viewingQuyetDinh.quyetDinh.maXacThucKySo}
                      />
                    </div>
                  ) : (
                    <div className="py-6 border-2 border-dashed border-amber-300 rounded bg-amber-50/60 text-amber-800 text-xs">
                      <div className="font-bold">CHƯA KÝ SỐ ĐIỆN TỬ</div>
                      <div className="text-[11px] text-gray-500 mt-1">Bấm nút &quot;Tiến hành Ký số điện tử&quot; ở trên để phê duyệt</div>
                    </div>
                  )}

                  <div className="font-extrabold text-sm text-gray-900">
                    {viewingQuyetDinh.quyetDinh?.nguoiKy || "TS. Nguyễn Văn Hùng"}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-3 border-t bg-gray-50 rounded-b-lg no-print">
              <span className="text-xs text-gray-500">
                Văn bản hành chính số hóa · Tích hợp Trục liên thông văn bản LGSP Tỉnh Bình Dương
              </span>
              <div className="flex items-center gap-2">
                {!viewingQuyetDinh.quyetDinh?.daKySo && (
                  <button
                    onClick={handleKySoQuyetDinh}
                    className="px-4 py-2 bg-[#dd4b39] hover:bg-[#c23321] text-white text-xs font-bold rounded shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Stamp className="size-4" />
                    Ký số phê duyệt (SmartCA)
                  </button>
                )}
                <button
                  onClick={() =>
                    exportDocAsWord(
                      `Quyet_dinh_${(viewingQuyetDinh.quyetDinh?.soQuyetDinh || viewingQuyetDinh.maHoSo).replace(/\//g, "_")}`,
                      "quyet-dinh-content"
                    )
                  }
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="size-4" />
                  Tải file Word (.doc)
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="size-4" />
                  In Quyết định
                </button>
                <button
                  onClick={() => setViewingQuyetDinh(null)}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-semibold rounded cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 13: PHIẾU KIỂM SOÁT QUÁ TRÌNH GIẢI QUYẾT HỒ SƠ (MẪU SỐ 05/NĐ-61)   */}
      {/* ========================================================================= */}
      {viewingPhieuKiemSoat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white text-gray-900 rounded-lg shadow-2xl max-w-2xl w-full border border-gray-300 max-h-[92vh] flex flex-col">
            <div className="bg-gray-800 text-white px-5 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <History className="size-5" />
                <h3 className="font-bold text-sm sm:text-base">
                  Phiếu Kiểm soát Quá trình Giải quyết Hồ sơ (Mẫu số 05)
                </h3>
              </div>
              <button
                onClick={() => setViewingPhieuKiemSoat(null)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs overflow-y-auto font-sans flex-1" id="phieu-kiem-soat-content">
              <div className="border border-gray-200 rounded p-3 bg-gray-50/70 space-y-1">
                <div>
                  <span className="text-gray-500">Mã hồ sơ theo dõi:</span>{" "}
                  <strong className="font-mono text-gray-900">{viewingPhieuKiemSoat.maHoSo}</strong>
                </div>
                <div>
                  <span className="text-gray-500">Tên thủ tục:</span>{" "}
                  <strong className="text-gray-900">{viewingPhieuKiemSoat.tenThuTuc}</strong>
                </div>
                <div>
                  <span className="text-gray-500">Người nộp:</span>{" "}
                  <strong className="text-gray-900 uppercase">{viewingPhieuKiemSoat.nguoiNop}</strong> · Cơ sở: {viewingPhieuKiemSoat.tenCoSoDeNghi}
                </div>
              </div>

              {/* Bảng luân chuyển các khâu */}
              <table className="w-full text-xs border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="border border-gray-300 p-2 w-10 text-center">STT</th>
                    <th className="border border-gray-300 p-2 text-left">Giai đoạn / Bước xử lý</th>
                    <th className="border border-gray-300 p-2 text-left">Người giao / nhận</th>
                    <th className="border border-gray-300 p-2 text-center w-24">Thời gian</th>
                    <th className="border border-gray-300 p-2 text-center w-28">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-2 text-center">1</td>
                    <td className="border border-gray-300 p-2 font-medium">Tiếp nhận hồ sơ &amp; cấp Giấy hẹn Mẫu 01</td>
                    <td className="border border-gray-300 p-2">{viewingPhieuKiemSoat.canBoTiepNhan}</td>
                    <td className="border border-gray-300 p-2 text-center">{viewingPhieuKiemSoat.ngayTiepNhan}</td>
                    <td className="border border-gray-300 p-2 text-center text-emerald-700 font-bold">Hoàn thành</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2 text-center">2</td>
                    <td className="border border-gray-300 p-2 font-medium">Thẩm định hồ sơ giấy tờ &amp; văn bằng</td>
                    <td className="border border-gray-300 p-2">{viewingPhieuKiemSoat.canBoThuLy}</td>
                    <td className="border border-gray-300 p-2 text-center">{viewingPhieuKiemSoat.ngayTiepNhan}</td>
                    <td className="border border-gray-300 p-2 text-center text-emerald-700 font-bold">
                      {viewingPhieuKiemSoat.trangThai === "YEU_CAU_BO_SUNG" ? "Phát Mẫu 02" : "Hợp lệ"}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2 text-center">3</td>
                    <td className="border border-gray-300 p-2 font-medium">Kiểm tra thực tế điều kiện tại cơ sở</td>
                    <td className="border border-gray-300 p-2">Đoàn liên ngành GD - Y tế - PCCC</td>
                    <td className="border border-gray-300 p-2 text-center">
                      {viewingPhieuKiemSoat.ketQuaThucDia?.ngayKiemTra || "Theo lịch"}
                    </td>
                    <td className="border border-gray-300 p-2 text-center font-bold">
                      {viewingPhieuKiemSoat.ketQuaThucDia ? (
                        <span className="text-emerald-700">Đạt yêu cầu</span>
                      ) : (
                        <span className="text-gray-400">Chưa kiểm tra</span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2 text-center">4</td>
                    <td className="border border-gray-300 p-2 font-medium">Soạn Tờ trình trình Lãnh đạo UBND</td>
                    <td className="border border-gray-300 p-2">{viewingPhieuKiemSoat.canBoThuLy}</td>
                    <td className="border border-gray-300 p-2 text-center">
                      {viewingPhieuKiemSoat.toTrinh?.ngayTrinh || "Theo tiến độ"}
                    </td>
                    <td className="border border-gray-300 p-2 text-center font-bold">
                      {viewingPhieuKiemSoat.toTrinh ? (
                        <span className="text-emerald-700">Đã trình</span>
                      ) : (
                        <span className="text-gray-400">Chờ lập</span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2 text-center">5</td>
                    <td className="border border-gray-300 p-2 font-medium">Ký số điện tử Quyết định thành lập</td>
                    <td className="border border-gray-300 p-2">Chủ tịch UBND Phường</td>
                    <td className="border border-gray-300 p-2 text-center">
                      {viewingPhieuKiemSoat.quyetDinh?.ngayBanHanh || "Hạn trả: " + viewingPhieuKiemSoat.ngayHenTra}
                    </td>
                    <td className="border border-gray-300 p-2 text-center font-bold">
                      {viewingPhieuKiemSoat.quyetDinh?.daKySo ? (
                        <span className="text-emerald-700">Đã ký số CA</span>
                      ) : (
                        <span className="text-amber-600">Chờ duyệt</span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2 text-center">6</td>
                    <td className="border border-gray-300 p-2 font-medium">Trả kết quả tại Một cửa cho người dân</td>
                    <td className="border border-gray-300 p-2">{viewingPhieuKiemSoat.canBoTiepNhan}</td>
                    <td className="border border-gray-300 p-2 text-center">{viewingPhieuKiemSoat.ngayHenTra}</td>
                    <td className="border border-gray-300 p-2 text-center font-bold">
                      {viewingPhieuKiemSoat.trangThai === "DA_TRA_KET_QUA" ? (
                        <span className="text-emerald-700">Đã trả</span>
                      ) : viewingPhieuKiemSoat.trangThai === "DA_PHE_DUYET" ? (
                        <span className="text-blue-700">Sẵn sàng</span>
                      ) : (
                        <span className="text-gray-400">Đang xử lý</span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between px-6 py-3 border-t bg-gray-50 rounded-b-lg no-print">
              <span className="text-xs text-gray-500">Mẫu số 05/NĐ-61 · Kiểm soát thời gian giải quyết hồ sơ</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    exportDocAsWord(
                      `Phieu_kiem_soat_${viewingPhieuKiemSoat.maHoSo}`,
                      "phieu-kiem-soat-content"
                    )
                  }
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="size-3.5" />
                  Xuất Word (.doc)
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-gray-700 hover:bg-gray-800 text-white text-xs font-bold rounded shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="size-3.5" />
                  In phiếu kiểm soát
                </button>
                <button
                  onClick={() => setViewingPhieuKiemSoat(null)}
                  className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-semibold rounded cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 20: PHIẾU XIN LỖI VÀ HẸN LẠI NGÀY TRẢ KẾT QUẢ (MẪU SỐ 04/NĐ-61)   */}
      {/* ========================================================================= */}
      {viewingPhieuXinLoi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white text-gray-900 rounded-lg shadow-2xl max-w-3xl w-full border border-gray-300 max-h-[92vh] flex flex-col">
            {/* Topbar No-print */}
            <div className="flex items-center justify-between px-6 py-3 border-b bg-amber-600 text-white rounded-t-lg no-print shrink-0">
              <div className="flex items-center gap-2">
                <AlertOctagon className="size-5" />
                <h3 className="font-bold text-sm sm:text-base">
                  Phiếu xin lỗi và Hẹn lại ngày trả kết quả (Mẫu số 04 - Nghị định 61/2018/NĐ-CP)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {viewingPhieuXinLoi.phieuXinLoi && (
                  <>
                    <button
                      onClick={() =>
                        exportDocAsWord(
                          `Phieu_xin_loi_${viewingPhieuXinLoi.maHoSo}`,
                          "phieu-xin-loi-content"
                        )
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded shadow-xs cursor-pointer transition-colors"
                      title="Xuất văn bản Mẫu 04 sang tệp Word (.doc) chuẩn thể thức NĐ 30/2020"
                    >
                      <Download className="size-4" />
                      Xuất Word (.doc)
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded shadow-xs cursor-pointer transition-colors"
                    >
                      <Printer className="size-4" />
                      In Phiếu (Ctrl+P)
                    </button>
                  </>
                )}
                <button
                  onClick={() => setViewingPhieuXinLoi(null)}
                  className="text-white/80 hover:text-white p-1 cursor-pointer"
                  title="Đóng"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            {/* Chưa có Phiếu xin lỗi -> Hiển thị form lập */}
            {!viewingPhieuXinLoi.phieuXinLoi ? (
              <form onSubmit={handlePhatHanhPhieuXinLoi} className="p-6 space-y-4 text-xs overflow-y-auto font-sans flex-1">
                <div className="p-3 bg-red-50 border border-red-200 rounded text-red-900 leading-relaxed">
                  <strong>Trách nhiệm công vụ (Khoản 3 Điều 17 Nghị định 61/2018/NĐ-CP):</strong> Trường hợp hồ sơ giải quyết quá thời hạn so với Giấy tiếp nhận hồ sơ và hẹn trả kết quả, cơ quan có thẩm quyền phải phát hành <strong>Phiếu xin lỗi và hẹn lại ngày trả kết quả (Mẫu số 04)</strong> cho tổ chức, công dân, nêu rõ lý do quá hạn và thời gian hẹn trả kết quả mới.
                </div>

                <div className="border border-gray-200 rounded p-3 bg-gray-50/70 space-y-1.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-gray-500">Mã hồ sơ quá hạn:</span>{" "}
                      <strong className="font-mono text-red-700">{viewingPhieuXinLoi.maHoSo}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500">Hẹn trả ban đầu:</span>{" "}
                      <strong className="font-mono text-red-600">{viewingPhieuXinLoi.ngayHenTra}</strong>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Người nộp hồ sơ:</span>{" "}
                    <strong className="text-gray-900 uppercase">{viewingPhieuXinLoi.nguoiNop}</strong> ({viewingPhieuXinLoi.soDienThoai})
                  </div>
                  <div>
                    <span className="text-gray-500">Thủ tục hành chính:</span>{" "}
                    <strong className="text-gray-900">{viewingPhieuXinLoi.tenThuTuc}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500">Cơ sở đề nghị:</span>{" "}
                    <strong className="text-emerald-800">{viewingPhieuXinLoi.tenCoSoDeNghi}</strong> ({viewingPhieuXinLoi.diaDiemCoSo})
                  </div>
                </div>

                {/* Form nhập lý do và ngày hẹn mới */}
                <div className="space-y-2">
                  <label className="block font-bold text-gray-800">
                    Lý do chậm trễ giải quyết hồ sơ <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={inputLyDoXinLoi}
                    onChange={(e) => setInputLyDoXinLoi(e.target.value)}
                    placeholder="Ghi rõ lý do khách quan/chủ quan dẫn đến quá hạn giải quyết hồ sơ..."
                    className="w-full rounded border border-gray-300 p-2.5 text-xs outline-none focus:border-amber-600 font-sans"
                  />
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-gray-600">
                    <span className="text-gray-400">Gợi ý lý do chuẩn công vụ:</span>
                    <button
                      type="button"
                      onClick={() =>
                        setInputLyDoXinLoi(
                          "Do quy trình thẩm định thực địa liên ngành cần phối hợp nhiều đơn vị (Phòng GD-ĐT, Trạm Y tế, Công an PCCC) và chờ kết quả kiểm định an toàn kỹ thuật"
                        )
                      }
                      className="px-2 py-0.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer text-[10px]"
                    >
                      Thực địa liên ngành phối hợp
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setInputLyDoXinLoi(
                          "Do cơ sở cần bổ sung hồ sơ điều kiện an toàn phòng cháy chữa cháy và xác minh thêm chứng chỉ sư phạm mầm non của nhân sự phụ trách"
                        )
                      }
                      className="px-2 py-0.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer text-[10px]"
                    >
                      Bổ sung điều kiện PCCC &amp; bằng cấp
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setInputLyDoXinLoi(
                          "Do khối lượng hồ sơ xét duyệt chính sách đầu năm học tăng cao và hệ thống đối soát dữ liệu dân cư đang đồng bộ dữ liệu"
                        )
                      }
                      className="px-2 py-0.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer text-[10px]"
                    >
                      Đồng bộ CSDL Dân cư
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-800 mb-1">
                      Thời gian hẹn trả kết quả mới <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={inputNgayHenMoi}
                      onChange={(e) => setInputNgayHenMoi(e.target.value)}
                      placeholder="VD: 28/10/2026"
                      className="w-full rounded border border-gray-300 p-2 text-xs font-mono font-bold outline-none focus:border-amber-600"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-800 mb-1">Thẩm quyền ký phát hành</label>
                    <input
                      type="text"
                      readOnly
                      value="TS. Nguyễn Văn Hùng - Chủ tịch UBND Phường Phú Cường"
                      className="w-full rounded border border-gray-300 p-2 text-xs bg-gray-100 font-semibold text-gray-700"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setViewingPhieuXinLoi(null)}
                    className="px-3 py-1.5 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold cursor-pointer"
                  >
                    Đóng
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="size-3.5" />
                    <span>Ký số &amp; Phát hành Phiếu xin lỗi (Mẫu số 04)</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Đã phát hành Phiếu xin lỗi -> Hiển thị văn bản A4 chuẩn thể thức */
              <>
                <div
                  className="p-8 overflow-y-auto font-serif text-[13px] leading-relaxed select-text flex-1"
                  id="phieu-xin-loi-content"
                >
                  {/* Quốc hiệu & Tiêu ngữ */}
                  <div className="grid grid-cols-2 text-center pb-4 border-b border-gray-400">
                    <div>
                      <div className="font-bold uppercase text-[12px]">UBND THÀNH PHỐ THỦ DẦU MỘT</div>
                      <div className="font-bold uppercase text-[13px] text-[#b91c1c]">ỦY BAN NHÂN DÂN PHƯỜNG PHÚ CƯỜNG</div>
                      <div className="text-[11px] font-sans font-medium text-gray-700">Bộ phận Tiếp nhận và Trả kết quả (Một cửa)</div>
                      <div className="text-[11px] font-sans italic mt-1">
                        Số: <strong className="font-mono text-black">{viewingPhieuXinLoi.phieuXinLoi.soPhieu}</strong>
                      </div>
                    </div>
                    <div>
                      <div className="font-bold uppercase text-[12px]">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                      <div className="font-bold text-[13px]">Độc lập - Tự do - Hạnh phúc</div>
                      <div className="text-[11px] italic font-sans mt-2">
                        Phú Cường, ngày {viewingPhieuXinLoi.phieuXinLoi.ngayLap}
                      </div>
                    </div>
                  </div>

                  {/* Tiêu đề */}
                  <div className="text-center my-6">
                    <h2 className="text-lg font-bold uppercase tracking-wide text-gray-900">
                      PHIẾU XIN LỖI VÀ HẸN LẠI NGÀY TRẢ KẾT QUẢ
                    </h2>
                    <div className="text-xs italic text-gray-600 font-sans mt-0.5">
                      (Mẫu số 04 - Ban hành kèm theo Nghị định số 61/2018/NĐ-CP ngày 23/4/2018 của Chính phủ)
                    </div>
                  </div>

                  {/* Kính gửi */}
                  <div className="space-y-3 mb-6 text-[13px]">
                    <div className="font-medium">
                      Kính gửi: Ông/Bà <strong className="uppercase text-gray-900">{viewingPhieuXinLoi.nguoiNop}</strong>
                    </div>
                    <div>
                      Đại diện cho: <strong>{viewingPhieuXinLoi.tenCoSoDeNghi}</strong>
                    </div>
                    <div>
                      Địa chỉ liên hệ: {viewingPhieuXinLoi.diaChiLienHe || viewingPhieuXinLoi.diaDiemCoSo}
                    </div>
                    <div>
                      Số điện thoại: <strong className="font-mono">{viewingPhieuXinLoi.soDienThoai}</strong> · Số CCCD: <strong className="font-mono">{viewingPhieuXinLoi.cccd}</strong>
                    </div>
                  </div>

                  {/* Nội dung trình bày xin lỗi */}
                  <div className="space-y-3 text-[13px] text-justify leading-relaxed">
                    <p>
                      Ngày {viewingPhieuXinLoi.ngayTiepNhan}, Ủy ban nhân dân Phường Phú Cường đã tiếp nhận giải quyết hồ sơ đề nghị <strong>{viewingPhieuXinLoi.tenThuTuc}</strong> của Ông/Bà; Mã số hồ sơ điện tử: <strong className="font-mono">{viewingPhieuXinLoi.maHoSo}</strong>.
                    </p>
                    <p>
                      Thời gian hẹn trả kết quả giải quyết hồ sơ theo Giấy hẹn Mẫu số 01: <strong>{viewingPhieuXinLoi.ngayHenTra}</strong>.
                    </p>
                    <p>
                      Tuy nhiên, đến nay hồ sơ chưa thể hoàn thành giải quyết và trả kết quả cho Ông/Bà theo đúng thời hạn đã hẹn.
                    </p>
                    <div className="p-3 bg-amber-50/80 border-l-4 border-amber-600 rounded-r text-gray-800">
                      <strong>Lý do chậm trễ giải quyết:</strong> {viewingPhieuXinLoi.phieuXinLoi.lyDo}.
                    </div>
                    <p>
                      Sự chậm trễ này đã làm ảnh hưởng đến thời gian, công việc và hoạt động của Ông/Bà, Ủy ban nhân dân Phường Phú Cường thành thật xin lỗi và xin hẹn lại ngày trả kết quả giải quyết hồ sơ như sau:
                    </p>
                    <div className="border border-dashed border-gray-400 p-3 rounded bg-gray-50 text-center font-sans">
                      <div className="text-xs text-gray-600">Thời gian hẹn trả kết quả giải quyết hồ sơ lần này:</div>
                      <div className="text-base font-extrabold text-[#b91c1c] mt-0.5">
                        Ngày {viewingPhieuXinLoi.phieuXinLoi.ngayHenMoi} (Trước 17 giờ 00)
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        Địa điểm nhận kết quả: Bộ phận Tiếp nhận và Trả kết quả (Một cửa) - UBND Phường Phú Cường (Số 01 đường Quang Trung, Phường Phú Cường, TP. Thủ Dầu Một).
                      </div>
                    </div>
                    <p>
                      Rất mong nhận được sự thông cảm và chia sẻ của Ông/Bà./.
                    </p>
                  </div>

                  {/* Chữ ký & Con dấu */}
                  <div className="grid grid-cols-2 text-center pt-8 font-sans">
                    <div className="text-left text-[11px] text-gray-600 space-y-0.5">
                      <div className="font-bold uppercase text-gray-800">Nơi nhận:</div>
                      <div>- Như trên;</div>
                      <div>- Lãnh đạo UBND Phường;</div>
                      <div>- Cán bộ thụ lý hồ sơ;</div>
                      <div>- Lưu: VT, Một cửa.</div>
                    </div>

                    <div className="text-center">
                      <div className="font-bold text-xs uppercase text-gray-900">
                        TM. ỦY BAN NHÂN DÂN
                      </div>
                      <div className="font-bold text-xs uppercase text-[#b91c1c]">CHỦ TỊCH</div>

                      {/* Tem ký số SmartCA */}
                      <div className="py-2 flex justify-center">
                        <DigitalSignatureBadge
                          nguoiKy={viewingPhieuXinLoi.phieuXinLoi.nguoiKy}
                          chucVu="Chủ tịch UBND Phường Phú Cường"
                          ngayKy={viewingPhieuXinLoi.phieuXinLoi.ngayLap}
                          maXacThuc={`CA-PXL-${viewingPhieuXinLoi.id}-2026`}
                        />
                      </div>

                      <div className="font-bold text-xs text-gray-900 mt-1">
                        {viewingPhieuXinLoi.phieuXinLoi.nguoiKy}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Modal Document */}
                <div className="flex items-center justify-between px-6 py-3 border-t bg-gray-50 rounded-b-lg no-print">
                  <span className="text-xs text-gray-500 font-sans">
                    Mẫu số 04/NĐ-61 · Bộ phận Tiếp nhận &amp; Trả kết quả UBND Phường Phú Cường
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        exportDocAsWord(
                          `Phieu_xin_loi_${viewingPhieuXinLoi.maHoSo}`,
                          "phieu-xin-loi-content"
                        )
                      }
                      className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="size-4" />
                      Tải file Word (.doc)
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Printer className="size-4" />
                      In Phiếu xin lỗi
                    </button>
                    <button
                      onClick={() => setViewingPhieuXinLoi(null)}
                      className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-semibold rounded cursor-pointer"
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {/* ========================================================================= */}
      {/* MODAL 14: QUYẾT ĐỊNH TẠM ĐÌNH CHỈ HOẠT ĐỘNG CƠ SỞ MẦM NON (ĐIỀU 11 TT 49)  */}
      {/* ========================================================================= */}
      {viewingDinhChiMn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white text-gray-900 rounded-lg shadow-2xl max-w-3xl w-full border border-gray-300 max-h-[92vh] flex flex-col">
            <div className="bg-[#b91c1c] text-white px-6 py-3 flex items-center justify-between no-print shrink-0">
              <div className="flex items-center gap-2">
                <ShieldAlert className="size-5" />
                <h3 className="font-bold text-sm sm:text-base">
                  Quyết định Tạm đình chỉ Hoạt động Giáo dục (Điều 11 Thông tư 49/2021)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    exportDocAsWord(
                      `Quyet_dinh_dinh_chi_${viewingDinhChiMn.maCoSo}`,
                      "quyet-dinh-dinh-chi-content"
                    )
                  }
                  className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-1 cursor-pointer"
                >
                  <Download className="size-3.5" />
                  <span>Tải Word (.doc)</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="size-3.5" />
                  <span>In Quyết định (Ctrl+P)</span>
                </button>
                <button
                  onClick={() => setViewingDinhChiMn(null)}
                  className="text-white/80 hover:text-white p-1 cursor-pointer"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            <div className="p-8 overflow-y-auto font-serif text-[13px] leading-relaxed select-text flex-1" id="quyet-dinh-dinh-chi-content">
              {/* Quốc hiệu & Đơn vị ban hành */}
              <div className="grid grid-cols-2 text-center pb-4 border-b border-gray-400">
                <div>
                  <div className="font-bold uppercase text-[12px]">ỦY BAN NHÂN DÂN THÀNH PHỐ THỦ DẦU MỘT</div>
                  <div className="font-bold uppercase text-[13px] text-[#b91c1c]">ỦY BAN NHÂN DÂN PHƯỜNG PHÚ CƯỜNG</div>
                  <div className="text-[11px] font-sans mt-1">
                    Số: <strong className="font-mono text-black">89/QĐ-UBND</strong>
                  </div>
                </div>
                <div>
                  <div className="font-bold uppercase text-[12px]">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                  <div className="font-bold text-[13px]">Độc lập - Tự do - Hạnh phúc</div>
                  <div className="text-[11px] italic font-sans mt-2">
                    Phú Cường, ngày {new Date().toLocaleDateString("vi-VN")}
                  </div>
                </div>
              </div>

              {/* Tiêu đề Quyết định */}
              <div className="text-center my-6 space-y-1">
                <h2 className="text-base font-bold uppercase tracking-wide text-gray-900">QUYẾT ĐỊNH</h2>
                <div className="font-bold text-sm text-gray-800">
                  Về việc tạm đình chỉ hoạt động giáo dục đối với {viewingDinhChiMn.tenCoSo}
                </div>
                <div className="text-xs uppercase font-extrabold text-[#b91c1c] tracking-widest pt-1">
                  CHỦ TỊCH ỦY BAN NHÂN DÂN PHƯỜNG PHÚ CƯỜNG
                </div>
              </div>

              {/* Căn cứ pháp lý */}
              <div className="space-y-1 text-justify text-xs italic text-gray-700 mb-4 font-serif">
                <p>Căn cứ Luật Tổ chức chính quyền địa phương ngày 19 tháng 6 năm 2015; Luật sửa đổi, bổ sung một số điều của Luật Tổ chức Chính phủ và Luật Tổ chức chính quyền địa phương ngày 22 tháng 11 năm 2019;</p>
                <p>Căn cứ Luật Giáo dục ngày 14 tháng 6 năm 2019;</p>
                <p>Căn cứ Nghị định số 46/2017/NĐ-CP ngày 21 tháng 4 năm 2017 của Chính phủ quy định về điều kiện đầu tư và hoạt động trong lĩnh vực giáo dục; Nghị định số 135/2018/NĐ-CP ngày 04 tháng 10 năm 2018 của Chính phủ sửa đổi, bổ sung một số điều của Nghị định 46/2017/NĐ-CP;</p>
                <p>Căn cứ Điều 11 Thông tư số 49/2021/TT-BGDĐT ngày 31 tháng 12 năm 2021 của Bộ Giáo dục và Đào tạo ban hành Quy chế tổ chức và hoạt động của nhóm trẻ độc lập, lớp mẫu giáo độc lập, lớp mầm non độc lập;</p>
                <p>Căn cứ Biên bản kiểm tra an toàn phòng cháy, chữa cháy và vệ sinh an toàn thực phẩm số 14/BB-LN ngày {viewingDinhChiMn.ngayKiemTraCuoi} của Đoàn kiểm tra liên ngành UBND Phường Phú Cường;</p>
                <p>Theo đề nghị của Công chức Văn hóa - Xã hội phụ trách Giáo dục.</p>
              </div>

              <div className="text-center font-bold text-xs uppercase my-2 tracking-wider">QUYẾT ĐỊNH:</div>

              {/* Điều khoản */}
              <div className="space-y-2.5 text-justify text-xs font-serif leading-relaxed mb-6">
                <p>
                  <strong>Điều 1.</strong> Tạm đình chỉ hoạt động giáo dục đối với cơ sở giáo dục mầm non ngoài công lập:
                </p>
                <div className="pl-4 space-y-1 font-sans">
                  <div>- Tên cơ sở: <strong className="text-red-700 uppercase">{viewingDinhChiMn.tenCoSo}</strong> (Mã: {viewingDinhChiMn.maCoSo})</div>
                  <div>- Quyết định thành lập số: <strong>{viewingDinhChiMn.soQuyetDinhCapPhep}</strong></div>
                  <div>- Chủ cơ sở: <strong className="uppercase">{viewingDinhChiMn.chuCoSo}</strong> (SĐT: {viewingDinhChiMn.soDienThoai})</div>
                  <div>- Địa điểm: <strong>{viewingDinhChiMn.diaChi}, {viewingDinhChiMn.khuPho}</strong></div>
                  <div>- Thời hạn tạm đình chỉ: <strong className="text-red-700">{inputThoiHanDinhChi} tháng</strong> (kể từ ngày ký Quyết định này).</div>
                  <div>
                    - Lý do tạm đình chỉ:{" "}
                    <strong className="text-red-800">
                      {inputLyDoDinhChi.trim() || viewingDinhChiMn.noiDungKiemTra}
                    </strong>
                  </div>
                </div>

                <p>
                  <strong>Điều 2.</strong> Biện pháp bảo đảm quyền, lợi ích hợp pháp của trẻ em và giáo viên:
                </p>
                <div className="pl-4 space-y-1 font-sans text-gray-800">
                  <div>1. Bà/ông <strong>{viewingDinhChiMn.chuCoSo}</strong> có trách nhiệm dừng ngay việc đón nhận trẻ từ 07 giờ 00 ngày mai; thông báo công khai lý do tạm đình chỉ cho toàn thể cha mẹ của {viewingDinhChiMn.soTreDangGiu} trẻ đang theo học; hoàn trả các khoản học phí, tiền ăn đã thu trước của phụ huynh.</div>
                  <div>2. Giao Công chức Văn hóa - Xã hội chủ trì, phối hợp Hiệu trưởng Trường Mầm non Hướng Dương (công lập) và Ban điều hành {viewingDinhChiMn.khuPho} hỗ trợ, tạo điều kiện thuận lợi nhất để phụ huynh có nguyện vọng gửi trẻ sang các cơ sở mầm non đạt chuẩn lân cận.</div>
                  <div>3. Cơ sở có trách nhiệm khẩn trương khắc phục triệt để các tồn tại về PCCC và bếp ăn bán trú. Sau khi khắc phục xong, lập báo cáo bằng văn bản gửi UBND phường để tổ chức kiểm tra nghiệm thu xem xét cho phép hoạt động trở lại.</div>
                </div>

                <p>
                  <strong>Điều 3.</strong> Chánh Văn phòng HĐND - UBND phường, Công chức Văn hóa - Xã hội, Trưởng Công an phường, Trưởng Trạm Y tế, Trưởng Ban điều hành {viewingDinhChiMn.khuPho} và bà/ông {viewingDinhChiMn.chuCoSo} chịu trách nhiệm thi hành Quyết định này./.
                </p>
              </div>

              {/* Nơi nhận & Ký số */}
              <div className="grid grid-cols-2 pt-4 border-t border-gray-300 font-sans">
                <div className="text-[11px] text-gray-600 space-y-0.5">
                  <div className="font-bold text-gray-800">Nơi nhận:</div>
                  <div>- Như Điều 3;</div>
                  <div>- Sở GD&amp;ĐT tỉnh Bình Dương (b/c);</div>
                  <div>- UBND TP. Thủ Dầu Một (b/c);</div>
                  <div>- Phòng GD&amp;ĐT TP. Thủ Dầu Một;</div>
                  <div>- Lưu: VT, VHXH.</div>
                </div>

                <div className="text-center space-y-2">
                  <div className="font-bold text-xs uppercase text-gray-900">CHỦ TỊCH</div>
                  <div className="my-2 flex justify-center">
                    <DigitalSignatureBadge
                      nguoiKy="TS. Nguyễn Văn Hùng"
                      chucVu="Chủ tịch UBND Phường Phú Cường"
                      ngayKy={new Date().toLocaleDateString("vi-VN")}
                      maXacThuc={`CA-ĐC-${viewingDinhChiMn.id}-${Date.now().toString().slice(-6)}`}
                    />
                  </div>
                  <div className="font-extrabold text-sm text-gray-900">TS. Nguyễn Văn Hùng</div>
                </div>
              </div>
            </div>

            {/* Footer Form cập nhật lý do nếu cần ban hành mới */}
            <div className="p-4 border-t bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-3 no-print">
              <div className="flex-1 w-full text-xs">
                <span className="font-bold text-gray-700">Điều chỉnh lý do &amp; thời hạn đình chỉ:</span>
                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    value={inputLyDoDinhChi}
                    onChange={(e) => setInputLyDoDinhChi(e.target.value)}
                    placeholder="Nhập lý do vi phạm an toàn PCCC, dinh dưỡng, bạo lực trẻ em..."
                    className="flex-1 rounded border border-gray-300 px-2 py-1 text-xs"
                  />
                  <select
                    value={inputThoiHanDinhChi}
                    onChange={(e) => setInputThoiHanDinhChi(Number(e.target.value))}
                    className="rounded border border-gray-300 px-2 py-1 text-xs"
                  >
                    <option value={1}>1 tháng</option>
                    <option value={2}>2 tháng</option>
                    <option value={3}>3 tháng</option>
                    <option value={6}>6 tháng</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() =>
                    exportDocAsWord(
                      `Quyet_dinh_dinh_chi_${viewingDinhChiMn.maCoSo}`,
                      "quyet-dinh-dinh-chi-content"
                    )
                  }
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="size-4" />
                  Tải file Word (.doc)
                </button>
                <button
                  onClick={handleBanHanhQDDinhChi}
                  className="px-4 py-2 bg-[#b91c1c] hover:bg-[#991b1b] text-white text-xs font-bold rounded shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Stamp className="size-4" />
                  Ký số ban hành Quyết định đình chỉ
                </button>
                <button
                  onClick={() => setViewingDinhChiMn(null)}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-semibold rounded cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 15: PHỤC HỒI HOẠT ĐỘNG CƠ SỞ MẦM NON SAU KHẮC PHỤC (ĐIỀU 11 TT 49)    */}
      {/* ========================================================================= */}
      {viewingPhucHoiMn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white text-gray-900 rounded-lg shadow-2xl max-w-3xl w-full border border-gray-300 max-h-[92vh] flex flex-col">
            <div className="bg-emerald-700 text-white px-6 py-3 flex items-center justify-between no-print shrink-0">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-5" />
                <h3 className="font-bold text-sm sm:text-base">
                  Quyết định Cho phép Hoạt động trở lại sau khắc phục (Khoản 4 Điều 11 Thông tư 49/2021)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    exportDocAsWord(
                      `Quyet_dinh_phuc_hoi_${viewingPhucHoiMn.maCoSo}`,
                      "quyet-dinh-phuc-hoi-content"
                    )
                  }
                  className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-1 cursor-pointer"
                >
                  <Download className="size-3.5" />
                  <span>Tải Word (.doc)</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-xs flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="size-3.5" />
                  <span>In Quyết định (Ctrl+P)</span>
                </button>
                <button
                  onClick={() => setViewingPhucHoiMn(null)}
                  className="text-white/80 hover:text-white p-1 cursor-pointer"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            <div className="p-8 overflow-y-auto font-serif text-[13px] leading-relaxed select-text flex-1" id="quyet-dinh-phuc-hoi-content">
              {/* Quốc hiệu & Đơn vị ban hành */}
              <div className="grid grid-cols-2 text-center pb-4 border-b border-gray-400">
                <div>
                  <div className="font-bold uppercase text-[12px]">ỦY BAN NHÂN DÂN THÀNH PHỐ THỦ DẦU MỘT</div>
                  <div className="font-bold uppercase text-[13px] text-emerald-800">ỦY BAN NHÂN DÂN PHƯỜNG PHÚ CƯỜNG</div>
                  <div className="text-[11px] font-sans mt-1">
                    Số: <strong className="font-mono text-black">122/QĐ-UBND</strong>
                  </div>
                </div>
                <div>
                  <div className="font-bold uppercase text-[12px]">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                  <div className="font-bold text-[13px]">Độc lập - Tự do - Hạnh phúc</div>
                  <div className="text-[11px] italic font-sans mt-2">
                    Phú Cường, ngày {new Date().toLocaleDateString("vi-VN")}
                  </div>
                </div>
              </div>

              {/* Tiêu đề Quyết định */}
              <div className="text-center my-6 space-y-1">
                <h2 className="text-base font-bold uppercase tracking-wide text-gray-900">QUYẾT ĐỊNH</h2>
                <div className="font-bold text-sm text-gray-800">
                  Về việc cho phép hoạt động giáo dục trở lại đối với {viewingPhucHoiMn.tenCoSo}
                </div>
                <div className="text-xs uppercase font-extrabold text-emerald-800 tracking-widest pt-1">
                  CHỦ TỊCH ỦY BAN NHÂN DÂN PHƯỜNG PHÚ CƯỜNG
                </div>
              </div>

              {/* Căn cứ pháp lý */}
              <div className="space-y-1 text-justify text-xs italic text-gray-700 mb-4 font-serif">
                <p>Căn cứ Luật Tổ chức chính quyền địa phương ngày 19 tháng 6 năm 2015; Luật sửa đổi, bổ sung một số điều của Luật Tổ chức Chính phủ và Luật Tổ chức chính quyền địa phương ngày 22 tháng 11 năm 2019;</p>
                <p>Căn cứ Luật Giáo dục ngày 14 tháng 6 năm 2019;</p>
                <p>Căn cứ Nghị định số 46/2017/NĐ-CP ngày 21 tháng 4 năm 2017 của Chính phủ quy định về điều kiện đầu tư và hoạt động trong lĩnh vực giáo dục; Nghị định số 135/2018/NĐ-CP ngày 04 tháng 10 năm 2018 của Chính phủ sửa đổi, bổ sung một số điều của Nghị định 46/2017/NĐ-CP;</p>
                <p>Căn cứ Khoản 4 Điều 11 Thông tư số 49/2021/TT-BGDĐT ngày 31 tháng 12 năm 2021 của Bộ Giáo dục và Đào tạo ban hành Quy chế tổ chức và hoạt động của nhóm trẻ độc lập, lớp mẫu giáo độc lập, lớp mầm non độc lập;</p>
                <p>Căn cứ Quyết định số 89/QĐ-UBND ngày 12 tháng 03 năm 2026 của Chủ tịch UBND Phường Phú Cường về việc tạm đình chỉ hoạt động giáo dục đối với {viewingPhucHoiMn.tenCoSo};</p>
                <p>Căn cứ Báo cáo khắc phục tồn tại vi phạm của bà/ông {viewingPhucHoiMn.chuCoSo} và Biên bản kiểm tra nghiệm thu số 25/BB-LN ngày {new Date().toLocaleDateString("vi-VN")} của Đoàn kiểm tra liên ngành UBND Phường Phú Cường;</p>
                <p>Theo đề nghị của Công chức Văn hóa - Xã hội phụ trách Giáo dục.</p>
              </div>

              <div className="text-center font-bold text-xs uppercase my-2 tracking-wider">QUYẾT ĐỊNH:</div>

              {/* Điều khoản */}
              <div className="space-y-2.5 text-justify text-xs font-serif leading-relaxed mb-6">
                <p>
                  <strong>Điều 1.</strong> Cho phép cơ sở giáo dục mầm non ngoài công lập sau đây được tổ chức hoạt động giáo dục trở lại kể từ ngày ký Quyết định này:
                </p>
                <div className="pl-4 space-y-1 font-sans">
                  <div>- Tên cơ sở: <strong className="text-emerald-800 uppercase">{viewingPhucHoiMn.tenCoSo}</strong> (Mã: {viewingPhucHoiMn.maCoSo})</div>
                  <div>- Quyết định thành lập số: <strong>{viewingPhucHoiMn.soQuyetDinhCapPhep}</strong></div>
                  <div>- Chủ cơ sở: <strong className="uppercase">{viewingPhucHoiMn.chuCoSo}</strong> (SĐT: {viewingPhucHoiMn.soDienThoai})</div>
                  <div>- Địa điểm hoạt động: <strong>{viewingPhucHoiMn.diaChi}, {viewingPhucHoiMn.khuPho}</strong></div>
                  <div>- Quy mô tiếp nhận: Tối đa <strong>{viewingPhucHoiMn.soTreDangGiu} trẻ em</strong> ({viewingPhucHoiMn.soGiaoVienBaoMau} giáo viên/bảo mẫu)</div>
                  <div>
                    - Kết luận nghiệm thu khắc phục vi phạm:{" "}
                    <strong className="text-emerald-800">
                      {inputNoiDungPhucHoi.trim() ||
                        "Đã hoàn thành lắp đặt cửa thoát nạn chịu nhiệt, bổ sung đầy đủ bình chữa cháy MFZ4 và phân chia vách nhôm kính khu vực bếp nấu đạt chuẩn 1 chiều. Đoàn liên ngành kiểm tra nghiệm thu đạt chuẩn an toàn."}
                    </strong>
                  </div>
                </div>

                <p>
                  <strong>Điều 2.</strong> Trách nhiệm của chủ cơ sở và các cơ quan liên quan:
                </p>
                <div className="pl-4 space-y-1 font-sans text-gray-800">
                  <div>1. Bà/ông <strong>{viewingPhucHoiMn.chuCoSo}</strong> có trách nhiệm thông báo công khai đến toàn thể phụ huynh về thời gian đón nhận trẻ trở lại; nghiêm túc duy trì thường xuyên các điều kiện về PCCC, bếp ăn một chiều, bảo đảm sĩ số theo quy định và an toàn tuyệt đối tính mạng, thể chất cho trẻ.</div>
                  <div>2. Giao Công chức Văn hóa - Xã hội chủ trì, phối hợp Trạm Y tế và Công an phường tổ chức hậu kiểm định kỳ, kịp thời phát hiện và xử lý nghiêm các trường hợp tái vi phạm.</div>
                </div>

                <p>
                  <strong>Điều 3.</strong> Chánh Văn phòng HĐND - UBND phường, Công chức Văn hóa - Xã hội, Trưởng Công an phường, Trưởng Trạm Y tế, Trưởng Ban điều hành {viewingPhucHoiMn.khuPho} và bà/ông {viewingPhucHoiMn.chuCoSo} chịu trách nhiệm thi hành Quyết định này./.
                </p>
              </div>

              {/* Nơi nhận & Ký số */}
              <div className="grid grid-cols-2 pt-4 border-t border-gray-300 font-sans">
                <div className="text-[11px] text-gray-600 space-y-0.5">
                  <div className="font-bold text-gray-800">Nơi nhận:</div>
                  <div>- Như Điều 3;</div>
                  <div>- Phòng GD&amp;ĐT TP. Thủ Dầu Một (b/c);</div>
                  <div>- Đảng ủy, HĐND phường;</div>
                  <div>- Lưu: VT, VHXH.</div>
                </div>

                <div className="text-center space-y-2">
                  <div className="font-bold text-xs uppercase text-gray-900">CHỦ TỊCH</div>
                  <div className="my-2 flex justify-center">
                    <DigitalSignatureBadge
                      nguoiKy="TS. Nguyễn Văn Hùng"
                      chucVu="Chủ tịch UBND Phường Phú Cường"
                      ngayKy={new Date().toLocaleDateString("vi-VN")}
                      maXacThuc={`CA-PH-${viewingPhucHoiMn.id}-${Date.now().toString().slice(-6)}`}
                    />
                  </div>
                  <div className="font-extrabold text-sm text-gray-900">TS. Nguyễn Văn Hùng</div>
                </div>
              </div>
            </div>

            {/* Footer Form cập nhật kết quả nghiệm thu & Ban hành */}
            <div className="p-4 border-t bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-3 no-print">
              <div className="flex-1 w-full text-xs">
                <span className="font-bold text-gray-700">Ghi chú kết quả nghiệm thu thực tế của Đoàn liên ngành:</span>
                <input
                  type="text"
                  value={inputNoiDungPhucHoi}
                  onChange={(e) => setInputNoiDungPhucHoi(e.target.value)}
                  placeholder="Ghi nhận các hạng mục đã hoàn thành khắc phục (PCCC, bếp 1 chiều, khử khuẩn, camera...)"
                  className="w-full mt-1 rounded border border-gray-300 px-2 py-1 text-xs"
                />
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    exportDocAsWord(
                      `Quyet_dinh_phuc_hoi_${viewingPhucHoiMn.maCoSo}`,
                      "quyet-dinh-phuc-hoi-content"
                    )
                  }
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="size-4" />
                  Tải file Word (.doc)
                </button>
                <button
                  type="button"
                  onClick={handleBanHanhQDPhucHoi}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Stamp className="size-4" />
                  Ký số ban hành QĐ phục hồi hoạt động
                </button>
                <button
                  type="button"
                  onClick={() => setViewingPhucHoiMn(null)}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-semibold rounded cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 16: BÁO CÁO QUẢN LÝ MẦM NON GỬI PHÒNG GD&ĐT (MẪU 32/BC-UBND)          */}
      {/* ========================================================================= */}
      {showBaoCaoQuanLyMamNonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white text-gray-900 rounded-lg shadow-2xl max-w-4xl w-full border border-gray-300 max-h-[92vh] flex flex-col">
            <div className="bg-teal-800 text-white px-6 py-3 flex items-center justify-between no-print shrink-0">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="size-5" />
                <h3 className="font-bold text-sm sm:text-base">
                  Báo cáo Tổng hợp Quản lý Giáo dục Mầm non Ngoài Công lập gửi Phòng GD&amp;ĐT TP (Số 32/BC-UBND)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    exportDocAsWord(
                      "Bao_cao_32_Quan_ly_Mam_non_Phu_Cuong",
                      "bao-cao-mam-non-content"
                    )
                  }
                  className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-1 cursor-pointer"
                >
                  <Download className="size-3.5" />
                  <span>Tải Word (.doc)</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="size-3.5" />
                  <span>In Báo cáo (Ctrl+P)</span>
                </button>
                <button
                  onClick={() => setShowBaoCaoQuanLyMamNonModal(false)}
                  className="text-white/80 hover:text-white p-1 cursor-pointer"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            <div className="p-8 overflow-y-auto font-serif text-[13px] leading-relaxed select-text flex-1" id="bao-cao-mam-non-content">
              {/* Quốc hiệu & Đơn vị ban hành */}
              <div className="grid grid-cols-2 text-center pb-4 border-b border-gray-400">
                <div>
                  <div className="font-bold uppercase text-[12px]">ỦY BAN NHÂN DÂN THÀNH PHỐ THỦ DẦU MỘT</div>
                  <div className="font-bold uppercase text-[13px] text-teal-900">ỦY BAN NHÂN DÂN PHƯỜNG PHÚ CƯỜNG</div>
                  <div className="text-[11px] font-sans mt-1">
                    Số: <strong className="font-mono text-black">32/BC-UBND</strong>
                  </div>
                </div>
                <div>
                  <div className="font-bold uppercase text-[12px]">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                  <div className="font-bold text-[13px]">Độc lập - Tự do - Hạnh phúc</div>
                  <div className="text-[11px] italic font-sans mt-2">
                    Phú Cường, ngày {new Date().toLocaleDateString("vi-VN")}
                  </div>
                </div>
              </div>

              {/* Tiêu đề Báo cáo */}
              <div className="text-center my-6 space-y-1">
                <h2 className="text-base font-bold uppercase tracking-wide text-gray-900">BÁO CÁO</h2>
                <div className="font-bold text-sm text-gray-800">
                  Tình hình quản lý nhà nước đối với các nhóm trẻ, lớp mẫu giáo độc lập tư thục năm 2026
                </div>
                <div className="text-xs italic text-gray-600">
                  (Kính gửi: Phòng Giáo dục và Đào tạo Thành phố Thủ Dầu Một)
                </div>
              </div>

              <div className="space-y-3 text-justify text-xs font-serif leading-relaxed">
                <p>
                  Thực hiện Luật Giáo dục 2019, Nghị định số 46/2017/NĐ-CP và Thông tư số 49/2021/TT-BGDĐT ngày 31/12/2021 của Bộ Giáo dục và Đào tạo; Ủy ban nhân dân Phường Phú Cường báo cáo tình hình quản lý mạng lưới cơ sở giáo dục mầm non ngoài công lập như sau:
                </p>

                <h4 className="font-bold text-sm uppercase text-gray-900 pt-2 font-sans">
                  I. TỔNG HỢP MẠNG LƯỚI &amp; QUY MÔ CHĂM SÓC NUÔI DẠY TRẺ
                </h4>
                <div className="font-sans grid grid-cols-2 sm:grid-cols-4 gap-2 not-italic text-xs">
                  <div className="p-2.5 rounded bg-gray-50 border border-gray-200 text-center">
                    <div className="text-gray-500 text-[11px]">Tổng số cơ sở</div>
                    <div className="text-lg font-bold text-teal-800 font-mono">{mamNonList.length} cơ sở</div>
                  </div>
                  <div className="p-2.5 rounded bg-gray-50 border border-gray-200 text-center">
                    <div className="text-gray-500 text-[11px]">Tổng số trẻ đang giữ</div>
                    <div className="text-lg font-bold text-teal-800 font-mono">
                      {mamNonList.reduce((acc, m) => acc + m.soTreDangGiu, 0)} trẻ
                    </div>
                  </div>
                  <div className="p-2.5 rounded bg-gray-50 border border-gray-200 text-center">
                    <div className="text-gray-500 text-[11px]">Đội ngũ giáo viên/bảo mẫu</div>
                    <div className="text-lg font-bold text-teal-800 font-mono">
                      {mamNonList.reduce((acc, m) => acc + m.soGiaoVienBaoMau, 0)} người
                    </div>
                  </div>
                  <div className="p-2.5 rounded bg-gray-50 border border-gray-200 text-center">
                    <div className="text-gray-500 text-[11px]">Tỷ lệ Camera trực tuyến</div>
                    <div className="text-lg font-bold text-emerald-700 font-mono">100%</div>
                  </div>
                </div>

                <h4 className="font-bold text-sm uppercase text-gray-900 pt-2 font-sans">
                  II. SỔ BỘ CHI TIẾT CÁC CƠ SỞ ĐƯỢC CẤP PHÉP HOẠT ĐỘNG
                </h4>

                <div className="font-sans overflow-x-auto my-2 not-italic">
                  <table className="w-full text-[11px] border-collapse border border-gray-400">
                    <thead>
                      <tr className="bg-gray-100 text-gray-800 font-bold text-center">
                        <th className="border border-gray-400 p-1 w-8">STT</th>
                        <th className="border border-gray-400 p-1 text-left">Tên cơ sở mầm non</th>
                        <th className="border border-gray-400 p-1 text-left">Chủ cơ sở &amp; Phụ trách CM</th>
                        <th className="border border-gray-400 p-1">Số QĐ cấp phép</th>
                        <th className="border border-gray-400 p-1 text-center">Quy mô</th>
                        <th className="border border-gray-400 p-1 text-center">Định mức</th>
                        <th className="border border-gray-400 p-1 text-center">Bếp 1 chiều</th>
                        <th className="border border-gray-400 p-1 text-center">Đánh giá an toàn</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mamNonList.map((mn, idx) => (
                        <tr key={mn.id} className="hover:bg-gray-50">
                          <td className="border border-gray-400 p-1 text-center font-mono">{idx + 1}</td>
                          <td className="border border-gray-400 p-1 font-semibold">
                            {mn.tenCoSo}
                            <div className="text-[10px] text-gray-500">{mn.diaChi} ({mn.khuPho})</div>
                          </td>
                          <td className="border border-gray-400 p-1">
                            <div>{mn.chuCoSo}</div>
                            <div className="text-[10px] text-gray-500">CM: {mn.nguoiPhuTrachChuyenMon}</div>
                          </td>
                          <td className="border border-gray-400 p-1 font-mono text-[10px]">{mn.soQuyetDinhCapPhep}</td>
                          <td className="border border-gray-400 p-1 text-center font-mono">
                            {mn.soTreDangGiu} trẻ / {mn.soGiaoVienBaoMau} GV
                          </td>
                          <td className="border border-gray-400 p-1 text-center font-mono">
                            {(mn.dienTichPhongHocM2 / mn.soTreDangGiu).toFixed(1)} m²/trẻ
                          </td>
                          <td className="border border-gray-400 p-1 text-center">
                            {mn.bepAnMotChieu ? "Đạt chuẩn" : "Chưa đạt"}
                          </td>
                          <td className="border border-gray-400 p-1 text-center font-semibold">
                            <span
                              className={`px-1 py-0.5 rounded text-[10px] ${
                                mn.ketQuaKiemTraCuoi === "DAT_CHUAN_AN_TOAN"
                                  ? "text-emerald-800 bg-emerald-50"
                                  : mn.ketQuaKiemTraCuoi === "NHAC_NHO_KHAC_PHUC"
                                  ? "text-amber-800 bg-amber-50"
                                  : "text-red-800 bg-red-50 font-bold"
                              }`}
                            >
                              {mn.ketQuaKiemTraCuoi === "DAT_CHUAN_AN_TOAN"
                                ? "Đạt chuẩn"
                                : mn.ketQuaKiemTraCuoi === "NHAC_NHO_KHAC_PHUC"
                                ? "Nhắc nhở"
                                : "Tạm đình chỉ"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <h4 className="font-bold text-sm uppercase text-gray-900 pt-2 font-sans">
                  III. ĐỀ XUẤT, KIẾN NGHỊ VỚI PHÒNG GD&amp;ĐT THÀNH PHỐ
                </h4>
                <p>
                  1. Kính đề nghị Phòng GD&amp;ĐT TP. Thủ Dầu Một tiếp tục mở các lớp bồi dưỡng chuyên môn nghiệp vụ về phương pháp giáo dục mầm non tiên tiến, kỹ năng phòng chống tai nạn thương tích và sơ cấp cứu ban đầu cho đội ngũ giáo viên, người nuôi giữ trẻ ngoài công lập trên địa bàn.
                </p>
                <p>
                  2. Hỗ trợ tài liệu chuyên môn và phối hợp thanh tra, kiểm tra định kỳ để nâng cao hơn nữa chất lượng chăm sóc, bảo đảm an toàn tính mạng tuyệt đối cho trẻ em./.
                </p>
              </div>

              {/* Nơi nhận & Ký số */}
              <div className="grid grid-cols-2 pt-6 border-t border-gray-300 font-sans mt-4">
                <div className="text-[11px] text-gray-600 space-y-0.5">
                  <div className="font-bold text-gray-800">Nơi nhận:</div>
                  <div>- Phòng GD&amp;ĐT TP. Thủ Dầu Một (để b/c);</div>
                  <div>- Thường trực Đảng ủy phường (b/c);</div>
                  <div>- Chủ tịch, các PCT UBND phường;</div>
                  <div>- Công an, Trạm Y tế phường;</div>
                  <div>- Lưu: VT, VHXH.</div>
                </div>

                <div className="text-center space-y-2">
                  <div className="font-bold text-xs uppercase text-gray-900">CHỦ TỊCH</div>
                  <div className="my-2 flex justify-center">
                    <DigitalSignatureBadge
                      nguoiKy="TS. Nguyễn Văn Hùng"
                      chucVu="Chủ tịch UBND Phường Phú Cường"
                      ngayKy={new Date().toLocaleDateString("vi-VN")}
                      maXacThuc={`CA-BC32-GD-${Date.now().toString().slice(-6)}`}
                    />
                  </div>
                  <div className="font-extrabold text-sm text-gray-900">TS. Nguyễn Văn Hùng</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-6 py-3 border-t bg-gray-50 rounded-b-lg no-print">
              <span className="text-xs text-gray-500">Báo cáo số 32/BC-UBND · Phường Phú Cường, TP. Thủ Dầu Một</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    exportDocAsWord(
                      "Bao_cao_32_Quan_ly_Mam_non_Phu_Cuong",
                      "bao-cao-mam-non-content"
                    )
                  }
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="size-4" />
                  Tải file Word (.doc)
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="size-4" />
                  In Báo cáo
                </button>
                <button
                  onClick={() => setShowBaoCaoQuanLyMamNonModal(false)}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-semibold rounded cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 17: KẾ HOẠCH & BIÊN BẢN PHỐI HỢP TUYỂN SINH ĐẦU CẤP (SỐ 104/QĐ-UBND) */}
      {/* ========================================================================= */}
      {showKeHoachTuyenSinhModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white text-gray-900 rounded-lg shadow-2xl max-w-4xl w-full border border-gray-300 max-h-[92vh] flex flex-col">
            <div className="bg-sky-800 text-white px-6 py-3 flex items-center justify-between no-print shrink-0">
              <div className="flex items-center gap-2">
                <School className="size-5" />
                <h3 className="font-bold text-sm sm:text-base">
                  Kế hoạch &amp; Quyết định Phân tuyến Tuyển sinh Đầu cấp (Số 104/QĐ-UBND)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    exportDocAsWord(
                      "Ke_hoach_tuyen_sinh_dau_cap_QD104",
                      "tuyen-sinh-plan-content"
                    )
                  }
                  className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-1 cursor-pointer"
                >
                  <Download className="size-3.5" />
                  <span>Tải Word (.doc)</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="size-3.5" />
                  <span>In Kế hoạch (Ctrl+P)</span>
                </button>
                <button
                  onClick={() => setShowKeHoachTuyenSinhModal(false)}
                  className="text-white/80 hover:text-white p-1 cursor-pointer"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            <div className="p-8 overflow-y-auto font-serif text-[13px] leading-relaxed select-text flex-1" id="tuyen-sinh-plan-content">
              {/* Quốc hiệu & Đơn vị ban hành */}
              <div className="grid grid-cols-2 text-center pb-4 border-b border-gray-400">
                <div>
                  <div className="font-bold uppercase text-[12px]">ỦY BAN NHÂN DÂN THÀNH PHỐ THỦ DẦU MỘT</div>
                  <div className="font-bold uppercase text-[13px] text-sky-900">ỦY BAN NHÂN DÂN PHƯỜNG PHÚ CƯỜNG</div>
                  <div className="text-[11px] font-sans mt-1">
                    Số: <strong className="font-mono text-black">104/QĐ-UBND</strong>
                  </div>
                </div>
                <div>
                  <div className="font-bold uppercase text-[12px]">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                  <div className="font-bold text-[13px]">Độc lập - Tự do - Hạnh phúc</div>
                  <div className="text-[11px] italic font-sans mt-2">
                    Phú Cường, ngày 10 tháng 05 năm 2026
                  </div>
                </div>
              </div>

              {/* Tiêu đề Quyết định */}
              <div className="text-center my-6 space-y-1">
                <h2 className="text-base font-bold uppercase tracking-wide text-gray-900">QUYẾT ĐỊNH</h2>
                <div className="font-bold text-sm text-gray-800">
                  Ban hành Kế hoạch phân tuyến tuyển sinh các lớp đầu cấp (Mầm non 5 tuổi, Lớp 1, Lớp 6) năm học 2026 - 2027 trên địa bàn Phường Phú Cường
                </div>
                <div className="text-xs uppercase font-extrabold text-[#b91c1c] tracking-widest pt-1">
                  CHỦ TỊCH ỦY BAN NHÂN DÂN PHƯỜNG PHÚ CƯỜNG
                </div>
              </div>

              <div className="space-y-3 text-justify text-xs font-serif leading-relaxed">
                <p>
                  Căn cứ Luật Giáo dục ngày 14 tháng 6 năm 2019; Căn cứ Kế hoạch tuyển sinh đầu cấp của UBND Thành phố Thủ Dầu Một;
                </p>
                <p>
                  Thực hiện Đề án 06 của Thủ tướng Chính phủ về ứng dụng dữ liệu dân cư và tài khoản định danh điện tử VNeID trong công tác tuyển sinh đầu cấp trực tuyến, bảo đảm huy động 100% trẻ em đúng độ tuổi đến trường và phân luồng hợp lý;
                </p>

                <div className="text-center font-bold text-xs uppercase my-2 tracking-wider">QUYẾT ĐỊNH:</div>

                <p>
                  <strong>Điều 1.</strong> Ban hành kèm theo Quyết định này Kế hoạch phân tuyến tuyển sinh theo địa bàn 9 Khu phố của Phường Phú Cường:
                </p>

                {/* Bảng phân tuyến 9 khu phố */}
                <div className="font-sans overflow-x-auto my-2 not-italic">
                  <table className="w-full text-[11px] border-collapse border border-gray-400">
                    <thead>
                      <tr className="bg-sky-50 text-gray-800 font-bold text-center">
                        <th className="border border-gray-400 p-1.5 text-left">Trường học công lập tiếp nhận</th>
                        <th className="border border-gray-400 p-1.5">Cấp học</th>
                        <th className="border border-gray-400 p-1.5 text-left">Phân tuyến theo Khu phố</th>
                        <th className="border border-gray-400 p-1.5 text-center">Chỉ tiêu</th>
                        <th className="border border-gray-400 p-1.5 text-center">Phương thức tuyển sinh</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-400 p-1.5 font-bold">Trường Mầm non Hướng Dương</td>
                        <td className="border border-gray-400 p-1.5 text-center">Mầm non (5T)</td>
                        <td className="border border-gray-400 p-1.5">Khu phố 1, Khu phố 2, Khu phố 3, Khu phố 4</td>
                        <td className="border border-gray-400 p-1.5 text-center font-bold font-mono">120 trẻ</td>
                        <td className="border border-gray-400 p-1.5 text-center text-indigo-700 font-semibold">100% VNeID trực tuyến</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-400 p-1.5 font-bold">Trường Mầm non Hoa Mai</td>
                        <td className="border border-gray-400 p-1.5 text-center">Mầm non (5T)</td>
                        <td className="border border-gray-400 p-1.5">Khu phố 5, Khu phố 6, Khu phố 7, Khu phố 8, Khu phố 9</td>
                        <td className="border border-gray-400 p-1.5 text-center font-bold font-mono">130 trẻ</td>
                        <td className="border border-gray-400 p-1.5 text-center text-indigo-700 font-semibold">100% VNeID trực tuyến</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-400 p-1.5 font-bold text-blue-900">Trường Tiểu học Phú Cường</td>
                        <td className="border border-gray-400 p-1.5 text-center font-bold">Lớp 1</td>
                        <td className="border border-gray-400 p-1.5">
                          Khu phố 1, Khu phố 2, Khu phố 3, Khu phố 4, Khu phố 5 (Trẻ sinh năm 2020)
                        </td>
                        <td className="border border-gray-400 p-1.5 text-center font-bold font-mono text-emerald-800">240 học sinh (7 lớp)</td>
                        <td className="border border-gray-400 p-1.5 text-center text-indigo-700 font-semibold">Cổng DVC Tuyển sinh Tỉnh</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-400 p-1.5 font-bold text-blue-900">Trường Tiểu học Nguyễn Du</td>
                        <td className="border border-gray-400 p-1.5 text-center font-bold">Lớp 1</td>
                        <td className="border border-gray-400 p-1.5">
                          Khu phố 6, Khu phố 7, Khu phố 8, Khu phố 9 (Trẻ sinh năm 2020)
                        </td>
                        <td className="border border-gray-400 p-1.5 text-center font-bold font-mono text-emerald-800">200 học sinh (6 lớp)</td>
                        <td className="border border-gray-400 p-1.5 text-center text-indigo-700 font-semibold">Cổng DVC Tuyển sinh Tỉnh</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-400 p-1.5 font-bold text-purple-900">Trường THCS Phú Cường</td>
                        <td className="border border-gray-400 p-1.5 text-center font-bold">Lớp 6</td>
                        <td className="border border-gray-400 p-1.5">
                          Toàn bộ 100% học sinh hoàn thành chương trình tiểu học tại TH Phú Cường
                        </td>
                        <td className="border border-gray-400 p-1.5 text-center font-bold font-mono text-emerald-800">240 học sinh (6 lớp)</td>
                        <td className="border border-gray-400 p-1.5 text-center text-indigo-700 font-semibold">Xét tuyển trực tuyến</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p>
                  <strong>Điều 2.</strong> Trách nhiệm của các cơ quan, đơn vị liên quan:
                </p>
                <div className="pl-4 space-y-1 font-sans text-gray-800">
                  <div>- <strong>Công an Phường Phú Cường:</strong> Phối hợp Ban điều hành 9 Khu phố rà soát, làm sạch dữ liệu cư dân, xác thực thông tin định danh VNeID cho 100% phụ huynh và trẻ em trong độ tuổi tuyển sinh.</div>
                  <div>- <strong>Ban Giám hiệu các trường công lập:</strong> Thực hiện công khai kế hoạch phân tuyến, tổ chức đội hình công nghệ số hướng dẫn phụ huynh nộp hồ sơ trực tuyến; tuyệt đối không tiếp nhận học sinh trái tuyến khi chưa giải quyết xong học sinh đúng tuyến.</div>
                  <div>- <strong>Tổ điều phối ATGT cổng trường:</strong> Ban chỉ huy Công an phường bố trí lực lượng Dân quân và Công an thường trực phân luồng tại các cổng trường TH Phú Cường (đường Đoàn Trần Nghiệp) và THCS Phú Cường trong khung giờ 06:45 - 07:15 và 16:45 - 17:30.</div>
                </div>

                <p>
                  <strong>Điều 3.</strong> Văn phòng HĐND - UBND phường, Ban Chỉ huy Công an phường, Hiệu trưởng các trường công lập trên địa bàn và Trưởng Ban điều hành 9 Khu phố chịu trách nhiệm thi hành Quyết định này./.
                </p>
              </div>

              {/* Nơi nhận & Ký số */}
              <div className="grid grid-cols-2 pt-6 border-t border-gray-300 font-sans mt-4">
                <div className="text-[11px] text-gray-600 space-y-0.5">
                  <div className="font-bold text-gray-800">Nơi nhận:</div>
                  <div>- Phòng GD&amp;ĐT TP. Thủ Dầu Một (b/c);</div>
                  <div>- Đảng ủy, HĐND phường;</div>
                  <div>- BGH các trường Mầm non, TH, THCS;</div>
                  <div>- Ban điều hành 9 Khu phố;</div>
                  <div>- Lưu: VT, VHXH.</div>
                </div>

                <div className="text-center space-y-2">
                  <div className="font-bold text-xs uppercase text-gray-900">CHỦ TỊCH</div>
                  <div className="my-2 flex justify-center">
                    <DigitalSignatureBadge
                      nguoiKy="TS. Nguyễn Văn Hùng"
                      chucVu="Chủ tịch UBND Phường Phú Cường"
                      ngayKy="10/05/2026"
                      maXacThuc="CA-TSDC-2026-PC-9871"
                    />
                  </div>
                  <div className="font-extrabold text-sm text-gray-900">TS. Nguyễn Văn Hùng</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-6 py-3 border-t bg-gray-50 rounded-b-lg no-print">
              <span className="text-xs text-gray-500">Quyết định 104/QĐ-UBND · Phân tuyến tuyển sinh 100% qua VNeID</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    exportDocAsWord(
                      "Ke_hoach_tuyen_sinh_dau_cap_QD104",
                      "tuyen-sinh-plan-content"
                    )
                  }
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="size-4" />
                  Tải file Word (.doc)
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="size-4" />
                  In Kế hoạch
                </button>
                <button
                  onClick={() => setShowKeHoachTuyenSinhModal(false)}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-semibold rounded cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 18: QUYẾT ĐỊNH CÔNG NHẬN & BẰNG KHEN GIA ĐÌNH HỌC TẬP (TT 22/2020)   */}
      {/* ========================================================================= */}
      {showCongNhanHocTapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white text-gray-900 rounded-lg shadow-2xl max-w-3xl w-full border border-gray-300 max-h-[92vh] flex flex-col">
            <div className="bg-amber-700 text-white px-6 py-3 flex items-center justify-between no-print shrink-0">
              <div className="flex items-center gap-2">
                <Award className="size-5" />
                <h3 className="font-bold text-sm sm:text-base">
                  Quyết định Công nhận &amp; Bằng Khen Gia đình học tập tiêu biểu (Thông tư 22/2020)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    exportDocAsWord(
                      "Giay_cong_nhan_Gia_dinh_hoc_tap",
                      "bang-khen-content"
                    )
                  }
                  className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-1 cursor-pointer"
                >
                  <Download className="size-3.5" />
                  <span>Tải Word (.doc)</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="size-3.5" />
                  <span>In Bằng khen (Ctrl+P)</span>
                </button>
                <button
                  onClick={() => setShowCongNhanHocTapModal(false)}
                  className="text-white/80 hover:text-white p-1 cursor-pointer"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            <div className="p-8 overflow-y-auto space-y-6 flex-1" id="bang-khen-content">
              {/* PHẦN 1: BẰNG KHEN / GIẤY CÔNG NHẬN TRANG TRỌNG VIỀN HOA VĂN */}
              <div className="border-8 border-double border-amber-600 p-6 bg-gradient-to-b from-amber-50/40 via-white to-amber-50/40 text-center space-y-3 shadow-inner rounded-sm relative">
                <div className="absolute top-2 left-2 text-amber-600 text-lg">✦</div>
                <div className="absolute top-2 right-2 text-amber-600 text-lg">✦</div>
                <div className="absolute bottom-2 left-2 text-amber-600 text-lg">✦</div>
                <div className="absolute bottom-2 right-2 text-amber-600 text-lg">✦</div>

                <div className="font-serif uppercase text-xs font-bold text-gray-800 tracking-wider">
                  CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                </div>
                <div className="font-serif text-xs font-bold text-gray-700">Độc lập - Tự do - Hạnh phúc</div>
                <div className="w-24 h-0.5 bg-amber-600 mx-auto my-1"></div>

                <div className="font-serif uppercase text-[11px] text-gray-600 tracking-widest pt-2">
                  ỦY BAN NHÂN DÂN THÀNH PHỐ THỦ DẦU MỘT
                </div>
                <div className="font-serif uppercase text-sm font-extrabold text-[#b91c1c] tracking-widest">
                  ỦY BAN NHÂN DÂN PHƯỜNG PHÚ CƯỜNG
                </div>

                <div className="py-4">
                  <div className="font-serif uppercase text-2xl font-black text-amber-800 tracking-widest">
                    GIẤY CÔNG NHẬN
                  </div>
                  <div className="font-serif italic text-sm text-gray-700 mt-1">
                    CHỦ TỊCH ỦY BAN NHÂN DÂN PHƯỜNG PHÚ CƯỜNG TẶNG:
                  </div>
                </div>

                <div className="text-xl font-bold uppercase text-red-800 font-serif tracking-wide border-b-2 border-dotted border-amber-500 pb-2 inline-block px-8">
                  GIA ĐÌNH ÔNG NGUYỄN VĂN THÀNH
                </div>
                <div className="text-xs text-gray-600 font-sans">
                  Địa chỉ: Số 42 đường Bạch Đằng, Khu phố 3, Phường Phú Cường
                </div>

                <p className="font-serif italic text-sm text-gray-800 max-w-lg mx-auto py-2 leading-relaxed">
                  &ldquo;Đã có thành tích xuất sắc tiêu biểu trong phong trào xây dựng mô hình <strong>Gia đình học tập</strong> giai đoạn 2021 - 2026, góp phần tích cực xây dựng Phường Phú Cường trở thành Đô thị học tập văn minh, giàu đẹp.&rdquo;
                </p>

                <div className="grid grid-cols-2 pt-6 font-sans text-xs">
                  <div className="text-center space-y-1">
                    <div className="font-bold text-gray-700">HỘI KHUYẾN HỌC PHƯỜNG</div>
                    <div className="text-[11px] text-gray-500">Chủ tịch Hội</div>
                    <div className="h-10"></div>
                    <div className="font-bold text-gray-800">ThS. Lê Hoàng Tuấn</div>
                  </div>

                  <div className="text-center space-y-1">
                    <div className="italic text-gray-500 text-[11px]">
                      Phú Cường, ngày 28 tháng 08 năm 2026
                    </div>
                    <div className="font-bold text-gray-800 uppercase">CHỦ TỊCH UBND PHƯỜNG</div>
                    <div className="flex justify-center my-1">
                      <DigitalSignatureBadge
                        nguoiKy="TS. Nguyễn Văn Hùng"
                        chucVu="Chủ tịch UBND Phường Phú Cường"
                        ngayKy="28/08/2026"
                        maXacThuc="CA-GDHT-2026-PC-4412"
                      />
                    </div>
                    <div className="font-extrabold text-sm text-gray-900">TS. Nguyễn Văn Hùng</div>
                  </div>
                </div>
              </div>

              {/* PHẦN 2: TÓM TẮT QUYẾT ĐỊNH 142/QĐ-UBND */}
              <div className="p-4 bg-gray-50 rounded border border-gray-200 text-xs font-sans space-y-2">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <span className="font-bold text-gray-900">Căn cứ Quyết định số 142/QĐ-UBND ngày 28/08/2026:</span>
                  <span className="font-mono text-emerald-700 font-bold">Tỷ lệ công nhận: 92.5%</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  <div className="p-2 bg-white rounded border border-gray-200 text-center">
                    <div className="text-gray-500 text-[10px]">Gia đình học tập</div>
                    <div className="font-bold text-amber-800">3.840 / 4.150 hộ</div>
                  </div>
                  <div className="p-2 bg-white rounded border border-gray-200 text-center">
                    <div className="text-gray-500 text-[10px]">Dòng họ học tập</div>
                    <div className="font-bold text-amber-800">18 / 20 dòng họ</div>
                  </div>
                  <div className="p-2 bg-white rounded border border-gray-200 text-center">
                    <div className="text-gray-500 text-[10px]">Cộng đồng học tập</div>
                    <div className="font-bold text-emerald-700">9 / 9 khu phố</div>
                  </div>
                  <div className="p-2 bg-white rounded border border-gray-200 text-center">
                    <div className="text-gray-500 text-[10px]">Đơn vị học tập</div>
                    <div className="font-bold text-emerald-700">4 / 4 cơ quan</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-6 py-3 border-t bg-gray-50 rounded-b-lg no-print">
              <span className="text-xs text-gray-500">Mẫu Giấy công nhận chuẩn Bộ Giáo dục &amp; Đào tạo</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    exportDocAsWord(
                      "Giay_cong_nhan_Gia_dinh_hoc_tap",
                      "bang-khen-content"
                    )
                  }
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="size-4" />
                  Tải file Word (.doc)
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="size-4" />
                  In Bằng khen
                </button>
                <button
                  onClick={() => setShowCongNhanHocTapModal(false)}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-semibold rounded cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 19: TRAO HỌC BỔNG KHUYẾN HỌC "THẮP SÁNG ƯỚC MƠ"                    */}
      {/* ========================================================================= */}
      {showTraoHocBongModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white text-gray-900 rounded-lg shadow-2xl max-w-xl w-full border border-gray-300 max-h-[92vh] flex flex-col">
            <div className="bg-rose-700 text-white px-5 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Heart className="size-5" />
                <h3 className="font-bold text-sm sm:text-base">
                  Trao Học bổng Khuyến học &ldquo;Thắp sáng ước mơ&rdquo; Phường Phú Cường
                </h3>
              </div>
              <button
                onClick={() => setShowTraoHocBongModal(false)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleTraoHocBong} className="p-6 space-y-4 text-xs overflow-y-auto font-sans flex-1">
              <div className="p-3 bg-rose-50 border border-rose-200 rounded text-rose-900">
                <strong>Chính sách Khuyến học Phường Phú Cường:</strong> Hỗ trợ kịp thời các em học sinh có hoàn cảnh đặc biệt khó khăn, không để bất kỳ trẻ em nào vì nghèo khó mà phải bỏ học giữa chừng.
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  Họ và tên học sinh được xét trao học bổng <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={tenHocSinhHocBong}
                  onChange={(e) => setTenHocSinhHocBong(e.target.value)}
                  placeholder="VD: Nguyễn Văn Hoàng"
                  className="w-full rounded border border-gray-300 p-2 text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Trường &amp; Lớp theo học</label>
                  <input
                    type="text"
                    value={truongLopHocBong}
                    onChange={(e) => setTruongLopHocBong(e.target.value)}
                    placeholder="VD: Lớp 5A - Tiểu học Phú Cường"
                    className="w-full rounded border border-gray-300 p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Khu phố cư trú</label>
                  <select
                    value={khuPhoHocBong}
                    onChange={(e) => setKhuPhoHocBong(e.target.value)}
                    className="w-full rounded border border-gray-300 p-2 text-xs"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((k) => (
                      <option key={k} value={`Khu phố ${k}`}>
                        Khu phố {k}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Hoàn cảnh gia đình</label>
                <input
                  type="text"
                  value={hoanCanhHocBong}
                  onChange={(e) => setHoanCanhHocBong(e.target.value)}
                  placeholder="VD: Hộ nghèo, mồ côi cha mẹ, khuyết tật vượt khó học giỏi..."
                  className="w-full rounded border border-gray-300 p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Mức học bổng trao tặng</label>
                <select
                  value={mucHocBongVND}
                  onChange={(e) => setMucHocBongVND(Number(e.target.value))}
                  className="w-full rounded border border-gray-300 p-2 text-xs font-bold text-rose-800"
                >
                  <option value={1000000}>1.000.000 đồng (Suất học bổng Hỗ trợ dụng cụ học tập)</option>
                  <option value={1500000}>1.500.000 đồng (Suất học bổng Vượt khó hiếu học)</option>
                  <option value={2000000}>2.000.000 đồng (Suất học bổng Thắp sáng ước mơ học kỳ I)</option>
                  <option value={3000000}>3.000.000 đồng (Suất học bổng Khuyến tài đặc biệt)</option>
                </select>
              </div>

              <div className="p-3 rounded bg-gray-50 border border-gray-200 text-gray-600 text-[11px] space-y-1">
                <div>- Nguồn kinh phí: <strong>Quỹ Khuyến học &amp; Khuyến tài Phường Phú Cường</strong></div>
                <div>- Đơn vị trao: UBND Phường phối hợp Hội Khuyến học Phường và Ban Giám hiệu nhà trường</div>
              </div>

              <div className="pt-3 border-t border-gray-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowTraoHocBongModal(false)}
                  className="px-3 py-1.5 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-rose-700 hover:bg-rose-800 text-white font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Heart className="size-3.5" />
                  <span>Duyệt trao học bổng</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ========================================================================= */}
      {/* MODAL 21: KẾ HOẠCH BẢO ĐẢM TRẬT TỰ ATGT CỔNG TRƯỜNG HỌC (CHỈ THỊ 31/CT-TTg)*/}
      {/* ========================================================================= */}
      {showKeHoachAtgtModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white text-gray-900 rounded-lg shadow-2xl max-w-4xl w-full border border-gray-300 max-h-[92vh] flex flex-col">
            <div className="bg-amber-700 text-white px-6 py-3 flex items-center justify-between no-print shrink-0">
              <div className="flex items-center gap-2">
                <TrafficCone className="size-5" />
                <h3 className="font-bold text-sm sm:text-base">
                  Kế hoạch Phối hợp Bảo đảm Trật tự ATGT Cổng Trường học (Chỉ thị 31/CT-TTg - Số 45/KH-UBND)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    exportDocAsWord(
                      "Ke_hoach_ATGT_cong_truong_Chi_thi_31",
                      "ke-hoach-atgt-content"
                    )
                  }
                  className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-1 cursor-pointer"
                >
                  <Download className="size-3.5" />
                  <span>Tải Word (.doc)</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="size-3.5" />
                  <span>In Kế hoạch (Ctrl+P)</span>
                </button>
                <button
                  onClick={() => setShowKeHoachAtgtModal(false)}
                  className="text-white/80 hover:text-white p-1 cursor-pointer"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            <div className="p-8 overflow-y-auto font-serif text-[13px] leading-relaxed select-text flex-1" id="ke-hoach-atgt-content">
              {/* Quốc hiệu & Đơn vị ban hành */}
              <div className="grid grid-cols-2 text-center pb-4 border-b border-gray-400">
                <div>
                  <div className="font-bold uppercase text-[12px]">ỦY BAN NHÂN DÂN THÀNH PHỐ THỦ DẦU MỘT</div>
                  <div className="font-bold uppercase text-[13px] text-amber-900">ỦY BAN NHÂN DÂN PHƯỜNG PHÚ CƯỜNG</div>
                  <div className="text-[11px] font-sans mt-1">
                    Số: <strong className="font-mono text-black">45/KH-UBND</strong>
                  </div>
                </div>
                <div>
                  <div className="font-bold uppercase text-[12px]">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                  <div className="font-bold text-[13px]">Độc lập - Tự do - Hạnh phúc</div>
                  <div className="text-[11px] italic font-sans mt-2">
                    Phú Cường, ngày 05 tháng 09 năm 2026
                  </div>
                </div>
              </div>

              {/* Tiêu đề Kế hoạch */}
              <div className="text-center my-6 space-y-1">
                <h2 className="text-base font-bold uppercase tracking-wide text-gray-900">KẾ HOẠCH</h2>
                <div className="font-bold text-sm text-gray-800">
                  Phối hợp liên ngành bảo đảm trật tự, an toàn giao thông trước cổng các trường học năm học 2026 - 2027 trên địa bàn Phường Phú Cường
                </div>
                <div className="text-xs italic text-gray-600">
                  (Thực hiện Chỉ thị số 31/CT-TTg ngày 21/12/2023 của Thủ tướng Chính phủ)
                </div>
              </div>

              <div className="space-y-3 text-justify text-xs font-serif leading-relaxed">
                <p>
                  Thực hiện Chỉ thị số 31/CT-TTg ngày 21/12/2023 của Thủ tướng Chính phủ về tăng cường công tác bảo đảm trật tự, an toàn giao thông cho lứa tuổi học sinh trong tình hình mới; Kế hoạch số 88/KH-UBND của Ủy ban nhân dân Thành phố Thủ Dầu Một;
                </p>
                <p>
                  Nhằm chủ động phòng ngừa, kiềm chế tai nạn giao thông và giải quyết triệt để tình trạng ùn tắc giao thông cục bộ trước cổng các trường học trong giờ cao điểm phụ huynh đưa đón học sinh; Ủy ban nhân dân Phường Phú Cường ban hành Kế hoạch phối hợp triển khai cụ thể như sau:
                </p>

                <h4 className="font-bold text-sm uppercase text-gray-900 pt-2 font-sans">
                  I. MỤC ĐÍCH, YÊU CẦU
                </h4>
                <div className="pl-4 space-y-1 font-sans text-gray-800">
                  <div>1. 100% các trường mầm non, tiểu học, trung học cơ sở trên địa bàn phường ký cam kết chấp hành nghiêm Luật Giao thông đường bộ; xây dựng mô hình &ldquo;Cổng trường an toàn giao thông&rdquo;.</div>
                  <div>2. Tuyệt đối không để xảy ra ùn tắc giao thông kéo dài trước cổng trường, đặc biệt tại tuyến đường Đoàn Trần Nghiệp (cổng Trường TH Phú Cường) và đường Yersin / CMT8 trong hai khung giờ cao điểm: <strong>06:45 - 07:15</strong> sáng và <strong>16:45 - 17:30</strong> chiều.</div>
                  <div>3. 100% phụ huynh học sinh ký cam kết đội mũ bảo hiểm đạt chuẩn cho trẻ em từ đủ 6 tuổi trở lên khi tham gia giao thông bằng mô tô, xe gắn máy, xe đạp điện; không giao xe cho học sinh chưa đủ điều kiện theo quy định.</div>
                </div>

                <h4 className="font-bold text-sm uppercase text-gray-900 pt-2 font-sans">
                  II. BẢNG PHÂN CÔNG LỰC LƯỢNG &amp; KHUNG GIỜ PHÂN LUỒNG TẠI CÁC TRƯỜNG ĐIỂM
                </h4>
                <div className="font-sans overflow-x-auto my-2 not-italic">
                  <table className="w-full text-[11px] border-collapse border border-gray-400">
                    <thead>
                      <tr className="bg-amber-50 text-gray-800 font-bold text-center">
                        <th className="border border-gray-400 p-1.5 text-left">Trường học / Địa điểm</th>
                        <th className="border border-gray-400 p-1.5 text-left">Tuyến đường cổng trường</th>
                        <th className="border border-gray-400 p-1.5 text-center">Khung giờ cao điểm</th>
                        <th className="border border-gray-400 p-1.5 text-left">Lực lượng liên ngành trực tiếp</th>
                        <th className="border border-gray-400 p-1.5 text-center">Chỉ huy chốt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {truongCongLapList.map((tr) => (
                        <tr key={tr.id} className="hover:bg-amber-50/30">
                          <td className="border border-gray-400 p-1.5 font-bold">{tr.tenTruong}</td>
                          <td className="border border-gray-400 p-1.5">{tr.diaChi}</td>
                          <td className="border border-gray-400 p-1.5 text-center font-mono font-semibold text-amber-900">
                            {tr.gioCaoDiemPhanLuong || "06:45 - 07:15 & 16:45 - 17:30"}
                          </td>
                          <td className="border border-gray-400 p-1.5">
                            {tr.lucLuongTrucATGT || "Công an phường + Dân quân tự vệ + Đoàn thanh niên"}
                          </td>
                          <td className="border border-gray-400 p-1.5 text-center font-semibold text-gray-700">
                            Cảnh sát khu vực phụ trách
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <h4 className="font-bold text-sm uppercase text-gray-900 pt-2 font-sans">
                  III. PHÂN CÔNG NHIỆM VỤ CỤ THỂ
                </h4>
                <div className="pl-4 space-y-1.5 font-sans text-gray-800">
                  <div>
                    <strong>1. Công an Phường Phú Cường:</strong> Chủ trì bố trí cán bộ, chiến sĩ Cảnh sát trật tự, Cảnh sát khu vực thường xuyên có mặt tại cổng các trường học đúng khung giờ quy định để hướng dẫn, phân luồng; kiên quyết xử lý nghiêm các trường hợp phụ huynh dừng, đỗ xe ô tô, mô tô dưới lòng đường gây cản trở giao thông; phối hợp Đội CSGT Công an Thành phố tuần tra kiểm soát xử lý học sinh điều khiển xe không đúng độ tuổi.
                  </div>
                  <div>
                    <strong>2. Ban Chỉ huy Quân sự Phường (Lực lượng Dân quân):</strong> Huy động lực lượng Dân quân thường trực phối hợp Tổ bảo vệ dân phố các khu phố 1, 2, 3, 5 tham gia điều tiết tại các giao lộ xung quanh cổng trường; hướng dẫn phụ huynh đưa xe vào vị trí dừng đón quy định.
                  </div>
                  <div>
                    <strong>3. Đoàn TNCS Hồ Chí Minh Phường:</strong> Triển khai đội hình tình nguyện viên &ldquo;Cổng trường em an toàn số&rdquo;, hỗ trợ hướng dẫn học sinh qua đường an toàn và tuyên truyền văn hóa giao thông qua bảng quét mã QR Thông điệp ATGT.
                  </div>
                  <div>
                    <strong>4. Hiệu trưởng các trường Mầm non, Tiểu học, THCS:</strong> Mở rộng cổng trường tối đa trước giờ tan học 15 phút để phụ huynh vào sân trường đón học sinh; kẻ vạch sơn phân ô dừng đón xe mô tô trước vỉa hè; đưa nội dung chấp hành ATGT vào tiêu chí thi đua của các lớp học.
                  </div>
                </div>

                <h4 className="font-bold text-sm uppercase text-gray-900 pt-2 font-sans">
                  IV. TỔ CHỨC THỰC HIỆN
                </h4>
                <p>
                  Kinh phí thực hiện trích từ nguồn ngân sách bảo đảm trật tự ATGT của địa phương năm 2026. Định kỳ hằng tháng, Trưởng Công an phường tổng hợp báo cáo tình hình kết quả thực hiện gửi về Thường trực UBND phường để chỉ đạo kịp thời./.
                </p>
              </div>

              {/* Nơi nhận & Ký số */}
              <div className="grid grid-cols-2 pt-6 border-t border-gray-300 font-sans mt-4">
                <div className="text-[11px] text-gray-600 space-y-0.5">
                  <div className="font-bold text-gray-800">Nơi nhận:</div>
                  <div>- UBND TP. Thủ Dầu Một (b/c);</div>
                  <div>- Công an TP. Thủ Dầu Một (để b/c);</div>
                  <div>- Phòng GD&amp;ĐT TP (phối hợp);</div>
                  <div>- Đảng ủy, HĐND phường;</div>
                  <div>- Ban Chỉ huy Công an, Quân sự phường;</div>
                  <div>- BGH các trường Mầm non, TH, THCS;</div>
                  <div>- Lưu: VT, VHXH.</div>
                </div>

                <div className="text-center space-y-2">
                  <div className="font-bold text-xs uppercase text-gray-900">CHỦ TỊCH</div>
                  <div className="my-2 flex justify-center">
                    <DigitalSignatureBadge
                      nguoiKy="TS. Nguyễn Văn Hùng"
                      chucVu="Chủ tịch UBND Phường Phú Cường"
                      ngayKy="05/09/2026"
                      maXacThuc="CA-KH45-ATGT-2026-PC"
                    />
                  </div>
                  <div className="font-extrabold text-sm text-gray-900">TS. Nguyễn Văn Hùng</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-6 py-3 border-t bg-gray-50 rounded-b-lg no-print">
              <span className="text-xs text-gray-500">Kế hoạch số 45/KH-UBND · Phối hợp liên ngành bảo đảm ATGT Cổng trường học</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    exportDocAsWord(
                      "Ke_hoach_ATGT_cong_truong_Chi_thi_31",
                      "ke-hoach-atgt-content"
                    )
                  }
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="size-4" />
                  Tải file Word (.doc)
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="size-4" />
                  In Kế hoạch
                </button>
                <button
                  onClick={() => setShowKeHoachAtgtModal(false)}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-semibold rounded cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
