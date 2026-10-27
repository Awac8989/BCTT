import React, { useState } from "react";
import {
  Baby,
  FileText,
  FileCheck,
  ShieldAlert,
  CheckCircle2,
  FileSpreadsheet,
  Download,
  Printer,
  X,
  Check,
  Stamp,
} from "lucide-react";
import { toast } from "sonner";
import { type CoSoMamNonTuThuc } from "@/data/domain-mock";
import { appStore } from "@/services/app-state";
import { DigitalSignatureBadge } from "@/components/DigitalSignatureBadge";
import { exportDocAsWord } from "../utils";

interface ModalMamNonActionsProps {
  // Modal 1: Thêm / Thẩm định cấp phép
  showAddMamNonModal: boolean;
  setShowAddMamNonModal: (show: boolean) => void;

  // Modal 2: Xem hồ sơ & In Quyết định thành lập
  viewingMn: CoSoMamNonTuThuc | null;
  setViewingMn: (mn: CoSoMamNonTuThuc | null) => void;

  // Modal 3: Ghi biên bản kiểm tra liên ngành
  inspectingMn: CoSoMamNonTuThuc | null;
  setInspectingMn: (mn: CoSoMamNonTuThuc | null) => void;

  // Modal 14: Quyết định tạm đình chỉ hoạt động
  viewingDinhChiMn: CoSoMamNonTuThuc | null;
  setViewingDinhChiMn: (mn: CoSoMamNonTuThuc | null) => void;

  // Modal 15: Phục hồi hoạt động sau khắc phục
  viewingPhucHoiMn: CoSoMamNonTuThuc | null;
  setViewingPhucHoiMn: (mn: CoSoMamNonTuThuc | null) => void;

  // Modal 16: Báo cáo quản lý mầm non Mẫu 32
  showBaoCaoQuanLyMamNonModal: boolean;
  setShowBaoCaoQuanLyMamNonModal: (show: boolean) => void;

  mamNonList: CoSoMamNonTuThuc[];
}

export const ModalMamNonActions: React.FC<ModalMamNonActionsProps> = ({
  showAddMamNonModal,
  setShowAddMamNonModal,
  viewingMn,
  setViewingMn,
  inspectingMn,
  setInspectingMn,
  viewingDinhChiMn,
  setViewingDinhChiMn,
  viewingPhucHoiMn,
  setViewingPhucHoiMn,
  showBaoCaoQuanLyMamNonModal,
  setShowBaoCaoQuanLyMamNonModal,
  mamNonList,
}) => {
  // State form Modal 1
  const [tenCoSo, setTenCoSo] = useState("");
  const [loaiHinh, setLoaiHinh] =
    useState<CoSoMamNonTuThuc["loaiHinh"]>("NHOM_TRE_DOC_LAP");
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

  // State form Modal 3
  const [dotKiemTra, setDotKiemTra] = useState("KIEM_TRA_DINH_KY_DAU_NAM");
  const [inspectResult, setInspectResult] =
    useState<CoSoMamNonTuThuc["ketQuaKiemTraCuoi"]>("DAT_CHUAN_AN_TOAN");
  const [checkCamera, setCheckCamera] = useState(true);
  const [checkBep, setCheckBep] = useState(true);
  const [checkPccc, setCheckPccc] = useState(true);
  const [checkTyLeGv, setCheckTyLeGv] = useState(true);
  const [checkVeSinhYTe, setCheckVeSinhYTe] = useState(true);
  const [inspectNotes, setInspectNotes] = useState("");

  // State form Modal 14 & 15
  const [inputLyDoDinhChi, setInputLyDoDinhChi] = useState("");
  const [inputThoiHanDinhChi, setInputThoiHanDinhChi] = useState(3);
  const [inputNoiDungPhucHoi, setInputNoiDungPhucHoi] = useState("");

  // Handler tạo mầm non mới
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
      noiDungKiemTra:
        "Thẩm định điều kiện thành lập theo Thông tư 49/2021/TT-BGDĐT: Đạt chuẩn cơ sở vật chất, PCCC và bằng cấp giáo viên.",
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

  // Handler Tạm đình chỉ cơ sở mầm non
  const handleBanHanhQDDinhChi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!viewingDinhChiMn) return;
    const lyDo =
      inputLyDoDinhChi.trim() ||
      "Vi phạm quy định an toàn PCCC lối thoát nạn phụ và chưa đạt chuẩn vệ sinh bếp ăn một chiều theo Thông tư 49/2021/TT-BGDĐT";
    const soQD = appStore.dinhChiCoSoMamNon(
      viewingDinhChiMn.id,
      lyDo,
      inputThoiHanDinhChi
    );
    toast.warning("Đã ban hành Quyết định Tạm đình chỉ hoạt động cơ sở!", {
      description: `Số QĐ: ${soQD} · Thời hạn đình chỉ: ${inputThoiHanDinhChi} tháng`,
    });
    setViewingDinhChiMn(null);
    setInputLyDoDinhChi("");
  };

  // Handler Phục hồi cơ sở mầm non
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

  return (
    <>
      {/* MODAL 1: THẨM ĐỊNH CẤP PHÉP NHÓM TRẺ MẦM NON TƯ THỤC */}
      {showAddMamNonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full border border-gray-200 overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#dd4b39] text-white px-5 py-3.5 flex items-center justify-between shrink-0 shadow-xs">
              <div className="flex items-center gap-2">
                <Baby className="size-5" />
                <h3 className="font-bold text-sm sm:text-base">
                  Thẩm định &amp; Ban hành Quyết định Cho phép Thành lập Nhóm trẻ
                </h3>
              </div>
              <button
                onClick={() => setShowAddMamNonModal(false)}
                className="text-white/80 hover:text-white p-1 rounded-md hover:bg-white/10 cursor-pointer transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            <form
              onSubmit={handleCreateMamNon}
              className="p-5 space-y-3.5 text-xs overflow-y-auto flex-1"
            >
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
                <strong>Căn cứ thẩm quyền:</strong> Chủ tịch UBND cấp xã cho phép
                thành lập nhóm trẻ, lớp mẫu giáo độc lập sau khi có biên bản kiểm
                tra thực tế đủ điều kiện theo <strong>Thông tư 49/2021/TT-BGDĐT</strong>.
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
                  className="w-full rounded-lg border border-gray-300 p-2 text-xs outline-none focus:border-[#dd4b39]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Loại hình
                  </label>
                  <select
                    value={loaiHinh}
                    onChange={(e) => setLoaiHinh(e.target.value as any)}
                    className="w-full rounded-lg border border-gray-300 p-2 text-xs outline-none bg-white"
                  >
                    <option value="NHOM_TRE_DOC_LAP">
                      Nhóm trẻ độc lập tư thục (&lt; 36 tháng)
                    </option>
                    <option value="LOP_MAU_GIAO_DOC_LAP">
                      Lớp mẫu giáo độc lập (3 - 5 tuổi)
                    </option>
                    <option value="TRUONG_MAM_NON_TU_THUC">
                      Trường mầm non tư thục
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Khu phố quản lý
                  </label>
                  <select
                    value={khuPho}
                    onChange={(e) => setKhuPho(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 p-2 text-xs outline-none bg-white"
                  >
                    <option value="Khu phố 1">Khu phố 1</option>
                    <option value="Khu phố 2">Khu phố 2</option>
                    <option value="Khu phố 3">Khu phố 3</option>
                    <option value="Khu phố 4">Khu phố 4</option>
                    <option value="Khu phố 5">Khu phố 5</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    className="w-full rounded-lg border border-gray-300 p-2 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Người phụ trách chuyên môn
                  </label>
                  <input
                    type="text"
                    placeholder="Văn bằng sư phạm mầm non"
                    value={phuTrach}
                    onChange={(e) => setPhuTrach(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 p-2 text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Địa chỉ trụ sở hoạt động
                </label>
                <input
                  type="text"
                  placeholder="Số nhà, tên đường, khu phố..."
                  value={diaChi}
                  onChange={(e) => setDiaChi(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-2 text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Số trẻ nhận giữ
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={soTre}
                    onChange={(e) => setSoTre(Number(e.target.value))}
                    className="w-full rounded-lg border border-gray-300 p-2 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Số GV/bảo mẫu
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={soGiaoVien}
                    onChange={(e) => setSoGiaoVien(Number(e.target.value))}
                    className="w-full rounded-lg border border-gray-300 p-2 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Diện tích (m²)
                  </label>
                  <input
                    type="number"
                    min="30"
                    value={dienTich}
                    onChange={(e) => setDienTich(Number(e.target.value))}
                    className="w-full rounded-lg border border-gray-300 p-2 text-xs outline-none"
                  />
                </div>
              </div>

              {/* Checklist điều kiện */}
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
                <div className="font-bold text-gray-800 text-xs">
                  Biên bản thẩm định liên ngành (Checklist điều kiện):
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasCamera}
                    onChange={(e) => setHasCamera(e.target.checked)}
                    className="size-4 rounded text-[#dd4b39]"
                  />
                  <span>Hệ thống Camera an ninh kết nối trực tuyến</span>
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
                  <span>
                    Đảm bảo an toàn PCCC (bình chữa cháy, lối thoát nạn thứ 2)
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasGiaoVienChuan}
                    onChange={(e) => setHasGiaoVienChuan(e.target.checked)}
                    className="size-4 rounded text-[#dd4b39]"
                  />
                  <span>
                    100% giáo viên có bằng Cao đẳng Sư phạm Mầm non trở lên
                  </span>
                </label>
              </div>

              <div className="pt-2 border-t border-gray-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddMamNonModal(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold cursor-pointer transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#dd4b39] hover:bg-[#c23321] text-white font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <FileCheck className="size-4" />
                  <span>Ban hành Quyết định Cấp phép</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: XEM HỒ SƠ PHÁP LÝ & QUYẾT ĐỊNH THÀNH LẬP */}
      {viewingMn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-gray-200 overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#222d32] text-white px-5 py-3.5 flex items-center justify-between shrink-0 shadow-xs">
              <div className="flex items-center gap-2">
                <FileText className="size-5 text-amber-400" />
                <h3 className="font-bold text-sm sm:text-base">
                  Hồ sơ Pháp lý &amp; Quyết định Thành lập Mầm non
                </h3>
              </div>
              <button
                onClick={() => setViewingMn(null)}
                className="text-white/80 hover:text-white p-1 rounded-md hover:bg-white/10 cursor-pointer transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            <div
              className="p-6 text-xs overflow-y-auto space-y-4 font-serif bg-amber-50/20"
              id="quyet-dinh-mn-content"
            >
              <div className="flex justify-between items-start border-b border-gray-300 pb-3 text-center font-sans">
                <div>
                  <div className="font-bold text-[11px] uppercase text-gray-700">
                    UBND THÀNH PHỐ THỦ DẦU MỘT
                  </div>
                  <div className="font-extrabold text-xs uppercase text-[#dd4b39]">
                    UBND PHƯỜNG PHÚ CƯỜNG
                  </div>
                  <div className="text-[10px] text-gray-500 font-mono mt-0.5">
                    Số: {viewingMn.soQuyetDinhCapPhep}
                  </div>
                </div>
                <div>
                  <div className="font-bold text-[11px] uppercase text-gray-800">
                    CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                  </div>
                  <div className="font-bold text-[11px] text-gray-700 underline">
                    Độc lập - Tự do - Hạnh phúc
                  </div>
                  <div className="text-[10px] text-gray-500 italic mt-0.5">
                    Thủ Dầu Một, ngày {viewingMn.ngayCapPhep}
                  </div>
                </div>
              </div>

              <div className="text-center py-2">
                <div className="text-sm font-extrabold text-gray-900 uppercase">
                  QUYẾT ĐỊNH
                </div>
                <div className="text-xs font-bold text-gray-700 mt-1">
                  Về việc cho phép thành lập và hoạt động giáo dục đối với{" "}
                  {viewingMn.tenCoSo}
                </div>
                <div className="text-xs font-extrabold text-gray-900 mt-0.5">
                  CHỦ TỊCH ỦY BAN NHÂN DÂN PHƯỜNG PHÚ CƯỜNG
                </div>
              </div>

              <div className="space-y-1.5 text-justify text-gray-700 leading-relaxed font-sans text-xs">
                <p className="italic">
                  Căn cứ Luật Tổ chức chính quyền địa phương ngày 19 tháng 6 năm
                  2015;
                </p>
                <p className="italic">
                  Căn cứ Luật Giáo dục ngày 14 tháng 6 năm 2019;
                </p>
                <p className="italic">
                  Căn cứ Thông tư số 49/2021/TT-BGDĐT của Bộ Giáo dục và Đào tạo
                  ban hành Quy chế tổ chức và hoạt động của nhóm trẻ độc lập, lớp
                  mẫu giáo độc lập;
                </p>
                <p className="italic">
                  Xét Biên bản thẩm định thực tế ngày {viewingMn.ngayCapPhep} của
                  Đoàn thẩm định liên ngành phường,
                </p>

                <div className="text-center font-bold text-gray-900 py-1 uppercase">
                  QUYẾT ĐỊNH:
                </div>

                <p>
                  <strong>Điều 1.</strong> Cho phép{" "}
                  <strong>{viewingMn.chuCoSo}</strong> thành lập và tổ chức hoạt
                  động giáo dục đối với:
                </p>
                <ul className="list-disc pl-5 space-y-0.5 text-gray-800">
                  <li>
                    Tên cơ sở: <strong>{viewingMn.tenCoSo}</strong> (Mã số:{" "}
                    {viewingMn.maCoSo})
                  </li>
                  <li>
                    Địa chỉ: {viewingMn.diaChi} ({viewingMn.khuPho})
                  </li>
                  <li>
                    Quy mô nuôi giữ: Tối đa{" "}
                    <strong>{viewingMn.soTreDangGiu} trẻ em</strong>
                  </li>
                  <li>
                    Diện tích phòng học:{" "}
                    <strong>{viewingMn.dienTichPhongHocM2} m²</strong>
                  </li>
                  <li>
                    Số lượng giáo viên/bảo mẫu:{" "}
                    <strong>{viewingMn.soGiaoVienBaoMau} người</strong>
                  </li>
                </ul>

                <p>
                  <strong>Điều 2.</strong> Người phụ trách chuyên môn:{" "}
                  <strong>{viewingMn.nguoiPhuTrachChuyenMon}</strong>. Cơ sở
                  chịu sự quản lý Nhà nước của UBND Phường Phú Cường và hướng dẫn
                  chuyên môn của Phòng Giáo dục và Đào tạo Thành phố Thủ Dầu
                  Một.
                </p>

                <p>
                  <strong>Điều 3.</strong> Quyết định này có hiệu lực kể từ ngày
                  ký. Công chức Văn hóa - Xã hội, Trưởng Công an phường, Trưởng
                  Khu phố và bà/ông <strong>{viewingMn.chuCoSo}</strong> chịu
                  trách nhiệm thi hành Quyết định này./.
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
                  <div className="font-bold text-xs uppercase text-gray-800">
                    TM. ỦY BAN NHÂN DÂN
                  </div>
                  <div className="font-bold text-xs uppercase text-gray-800">
                    CHỦ TỊCH
                  </div>
                  <div className="size-16 mx-auto my-1 rounded-full border-2 border-red-500 flex items-center justify-center text-[9px] font-bold text-red-600 rotate-[-12deg] bg-red-50/50">
                    ĐÃ KÝ ĐÓNG DẤU
                  </div>
                  <div className="font-bold text-xs text-gray-900">
                    Nguyễn Văn Hiệp
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-gray-100 border-t border-gray-200 flex items-center justify-between shrink-0">
              <span className="text-xs text-gray-500 font-mono">
                Trích lục từ Cơ sở dữ liệu Cấp phép Mầm non UBND Phường
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    exportDocAsWord(
                      `Quyet_dinh_thanh_lap_${viewingMn.maCoSo}`,
                      "quyet-dinh-mn-content"
                    )
                  }
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Download className="size-3.5" />
                  <span>Tải Word (.doc)</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Printer className="size-3.5" />
                  <span>In Quyết định</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewingMn(null)}
                  className="px-3.5 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-white font-bold text-xs cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: GHI BIÊN BẢN KIỂM TRA LIÊN NGÀNH */}
      {inspectingMn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-gray-200 overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#0073b7] text-white px-5 py-3.5 flex items-center justify-between shrink-0 shadow-xs">
              <div className="flex items-center gap-2">
                <FileCheck className="size-5" />
                <h3 className="font-bold text-sm sm:text-base">
                  Biên bản Kiểm tra Liên ngành An toàn Mầm non
                </h3>
              </div>
              <button
                onClick={() => setInspectingMn(null)}
                className="text-white/80 hover:text-white p-1 rounded-md hover:bg-white/10 cursor-pointer transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs overflow-y-auto flex-1">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="font-bold text-gray-900 text-xs">
                  {inspectingMn.tenCoSo}
                </div>
                <div className="text-[11px] text-gray-600 mt-0.5">
                  Địa chỉ: {inspectingMn.diaChi} · Chủ cơ sở:{" "}
                  {inspectingMn.chuCoSo}
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Đợt kiểm tra
                </label>
                <select
                  value={dotKiemTra}
                  onChange={(e) => setDotKiemTra(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-2 text-xs outline-none bg-white"
                >
                  <option value="KIEM_TRA_DINH_KY_DAU_NAM">
                    Kiểm tra định kỳ đầu năm học 2026 - 2027
                  </option>
                  <option value="KIEM_TRA_VSATTP">
                    Kiểm tra chuyên đề Vệ sinh an toàn thực phẩm &amp; Bếp ăn
                  </option>
                  <option value="KIEM_TRA_PCCC">
                    Kiểm tra an toàn PCCC &amp; Cứu nạn cứu hộ
                  </option>
                  <option value="KIEM_TRA_DOT_XUAT">
                    Kiểm tra đột xuất phòng chống bạo hành trẻ
                  </option>
                </select>
              </div>

              {/* Bảng checklist 5 tiêu chí */}
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
                <div className="font-bold text-gray-800 text-xs">
                  Nội dung đánh giá 5 tiêu chí (Thông tư 49/2021/TT-BGDĐT):
                </div>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checkCamera}
                    onChange={(e) => setCheckCamera(e.target.checked)}
                    className="size-4 rounded text-blue-600 mt-0.5"
                  />
                  <div>
                    <span className="font-semibold text-gray-800">
                      1. Hệ thống Camera giám sát trực tuyến
                    </span>
                    <p className="text-[10px] text-gray-500">
                      Hoạt động rõ nét 24/7, phụ huynh truy cập xem trực tiếp ổn
                      định
                    </p>
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
                    <span className="font-semibold text-gray-800">
                      2. Bếp ăn một chiều &amp; Lưu mẫu thức ăn 24h
                    </span>
                    <p className="text-[10px] text-gray-500">
                      Hợp đồng thực phẩm nguồn gốc rõ ràng, dụng cụ inox hợp vệ
                      sinh
                    </p>
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
                    <span className="font-semibold text-gray-800">
                      3. An toàn Phòng cháy chữa cháy (PCCC)
                    </span>
                    <p className="text-[10px] text-gray-500">
                      Bình chữa cháy còn hạn kiểm định, lối thoát nạn thứ 2
                      thông thoáng
                    </p>
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
                    <span className="font-semibold text-gray-800">
                      4. Trình độ giáo viên &amp; Định mức nuôi giữ
                    </span>
                    <p className="text-[10px] text-gray-500">
                      Giáo viên đạt chuẩn CĐ sư phạm MN, không vượt quá sĩ số
                      quy định
                    </p>
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
                    <span className="font-semibold text-gray-800">
                      5. Vệ sinh môi trường &amp; Y tế học đường
                    </span>
                    <p className="text-[10px] text-gray-500">
                      Đồ chơi khử khuẩn hàng tuần, có tủ thuốc sơ cấp cứu ban
                      đầu
                    </p>
                  </div>
                </label>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Kết luận của Đoàn kiểm tra
                </label>
                <select
                  value={inspectResult}
                  onChange={(e) => setInspectResult(e.target.value as any)}
                  className="w-full rounded-lg border border-gray-300 p-2 text-xs outline-none font-bold bg-white"
                >
                  <option value="DAT_CHUAN_AN_TOAN">
                    Đạt chuẩn an toàn (Được tiếp tục hoạt động bình thường)
                  </option>
                  <option value="NHAC_NHO_KHAC_PHUC">
                    Nhắc nhở khắc phục tồn tại (Thời hạn 15 ngày có tái kiểm
                    tra)
                  </option>
                  <option value="TAM_DINH_CHI">
                    Tạm đình chỉ hoạt động để khắc phục vi phạm
                  </option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Ghi chú cụ thể &amp; Kiến nghị của Đoàn
                </label>
                <textarea
                  rows={3}
                  value={inspectNotes}
                  onChange={(e) => setInspectNotes(e.target.value)}
                  placeholder="Ghi nhận các điểm đạt và các điểm cơ sở cần khắc phục bổ sung..."
                  className="w-full rounded-lg border border-gray-300 p-2 text-xs outline-none"
                />
              </div>

              <div className="pt-2 border-t border-gray-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setInspectingMn(null)}
                  className="px-3.5 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold cursor-pointer transition-colors"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={handleSaveInspect}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Check className="size-3.5" />
                  <span>Ký lưu Biên bản kiểm tra</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 14: QUYẾT ĐỊNH TẠM ĐÌNH CHỈ HOẠT ĐỘNG */}
      {viewingDinhChiMn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white text-gray-900 rounded-xl shadow-2xl max-w-3xl w-full border border-gray-200 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#b91c1c] text-white px-6 py-3.5 flex items-center justify-between no-print shrink-0 shadow-xs rounded-t-xl">
              <div className="flex items-center gap-2">
                <ShieldAlert className="size-5" />
                <h3 className="font-bold text-sm sm:text-base">
                  Quyết định Tạm đình chỉ Hoạt động Giáo dục (Điều 11 Thông tư
                  49/2021)
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
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Download className="size-3.5" />
                  <span>Tải Word (.doc)</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Printer className="size-3.5" />
                  <span>In Quyết định (Ctrl+P)</span>
                </button>
                <button
                  onClick={() => setViewingDinhChiMn(null)}
                  className="text-white/80 hover:text-white p-1 rounded-md hover:bg-white/10 cursor-pointer transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            <div
              className="p-8 overflow-y-auto font-serif text-[13px] leading-relaxed select-text flex-1"
              id="quyet-dinh-dinh-chi-content"
            >
              {/* Quốc hiệu & Đơn vị ban hành */}
              <div className="grid grid-cols-2 text-center pb-4 border-b border-gray-400">
                <div>
                  <div className="font-bold uppercase text-[12px]">
                    ỦY BAN NHÂN DÂN THÀNH PHỐ THỦ DẦU MỘT
                  </div>
                  <div className="font-bold uppercase text-[13px] text-[#b91c1c]">
                    ỦY BAN NHÂN DÂN PHƯỜNG PHÚ CƯỜNG
                  </div>
                  <div className="text-[11px] font-sans mt-1">
                    Số: <strong className="font-mono text-black">89/QĐ-UBND</strong>
                  </div>
                </div>
                <div>
                  <div className="font-bold uppercase text-[12px]">
                    CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                  </div>
                  <div className="font-bold text-[13px]">
                    Độc lập - Tự do - Hạnh phúc
                  </div>
                  <div className="text-[11px] italic font-sans mt-2">
                    Phú Cường, ngày {new Date().toLocaleDateString("vi-VN")}
                  </div>
                </div>
              </div>

              {/* Tiêu đề Quyết định */}
              <div className="text-center my-6 space-y-1">
                <h2 className="text-base font-bold uppercase tracking-wide text-gray-900">
                  QUYẾT ĐỊNH
                </h2>
                <div className="font-bold text-sm text-gray-800">
                  Về việc tạm đình chỉ hoạt động giáo dục đối với{" "}
                  {viewingDinhChiMn.tenCoSo}
                </div>
                <div className="text-xs uppercase font-extrabold text-[#b91c1c] tracking-widest pt-1">
                  CHỦ TỊCH ỦY BAN NHÂN DÂN PHƯỜNG PHÚ CƯỜNG
                </div>
              </div>

              {/* Căn cứ pháp lý */}
              <div className="space-y-1 text-justify text-xs italic text-gray-700 mb-4 font-serif">
                <p>
                  Căn cứ Luật Tổ chức chính quyền địa phương ngày 19 tháng 6 năm
                  2015; Luật sửa đổi, bổ sung một số điều của Luật Tổ chức Chính
                  phủ và Luật Tổ chức chính quyền địa phương ngày 22 tháng 11 năm
                  2019;
                </p>
                <p>Căn cứ Luật Giáo dục ngày 14 tháng 6 năm 2019;</p>
                <p>
                  Căn cứ Điều 11 Thông tư số 49/2021/TT-BGDĐT ngày 31 tháng 12
                  năm 2021 của Bộ Giáo dục và Đào tạo ban hành Quy chế tổ chức và
                  hoạt động của nhóm trẻ độc lập, lớp mẫu giáo độc lập;
                </p>
                <p>
                  Căn cứ Biên bản kiểm tra an toàn phòng cháy, chữa cháy và vệ
                  sinh an toàn thực phẩm số 14/BB-LN ngày{" "}
                  {viewingDinhChiMn.ngayKiemTraCuoi} của Đoàn kiểm tra liên
                  ngành UBND Phường Phú Cường;
                </p>
                <p>
                  Theo đề nghị của Công chức Văn hóa - Xã hội phụ trách Giáo dục.
                </p>
              </div>

              <div className="text-center font-bold text-xs uppercase my-2 tracking-wider">
                QUYẾT ĐỊNH:
              </div>

              {/* Điều khoản */}
              <div className="space-y-2.5 text-justify text-xs font-serif leading-relaxed mb-6">
                <p>
                  <strong>Điều 1.</strong> Tạm đình chỉ hoạt động giáo dục đối
                  với cơ sở giáo dục mầm non ngoài công lập:
                </p>
                <div className="pl-4 space-y-1 font-sans">
                  <div>
                    - Tên cơ sở:{" "}
                    <strong className="text-red-700 uppercase">
                      {viewingDinhChiMn.tenCoSo}
                    </strong>{" "}
                    (Mã: {viewingDinhChiMn.maCoSo})
                  </div>
                  <div>
                    - Quyết định thành lập số:{" "}
                    <strong>{viewingDinhChiMn.soQuyetDinhCapPhep}</strong>
                  </div>
                  <div>
                    - Chủ cơ sở:{" "}
                    <strong className="uppercase">
                      {viewingDinhChiMn.chuCoSo}
                    </strong>{" "}
                    (SĐT: {viewingDinhChiMn.soDienThoai})
                  </div>
                  <div>
                    - Địa điểm:{" "}
                    <strong>
                      {viewingDinhChiMn.diaChi}, {viewingDinhChiMn.khuPho}
                    </strong>
                  </div>
                  <div>
                    - Thời hạn tạm đình chỉ:{" "}
                    <strong className="text-red-700">
                      {inputThoiHanDinhChi} tháng
                    </strong>{" "}
                    (kể từ ngày ký Quyết định này).
                  </div>
                  <div>
                    - Lý do tạm đình chỉ:{" "}
                    <strong className="text-red-800">
                      {inputLyDoDinhChi.trim() ||
                        viewingDinhChiMn.noiDungKiemTra}
                    </strong>
                  </div>
                </div>

                <p>
                  <strong>Điều 2.</strong> Biện pháp bảo đảm quyền, lợi ích hợp
                  pháp của trẻ em và giáo viên:
                </p>
                <div className="pl-4 space-y-1 font-sans text-gray-800">
                  <div>
                    1. Bà/ông <strong>{viewingDinhChiMn.chuCoSo}</strong> có
                    trách nhiệm dừng ngay việc đón nhận trẻ từ 07 giờ 00 ngày
                    mai; thông báo công khai lý do tạm đình chỉ cho toàn thể cha
                    mẹ của {viewingDinhChiMn.soTreDangGiu} trẻ đang theo học;
                    hoàn trả các khoản học phí, tiền ăn đã thu trước của phụ
                    huynh.
                  </div>
                  <div>
                    2. Giao Công chức Văn hóa - Xã hội chủ trì, phối hợp Hiệu
                    trưởng Trường Mầm non Hướng Dương (công lập) và Ban điều hành{" "}
                    {viewingDinhChiMn.khuPho} hỗ trợ, tạo điều kiện thuận lợi
                    nhất để phụ huynh có nguyện vọng gửi trẻ sang các cơ sở mầm
                    non đạt chuẩn lân cận.
                  </div>
                  <div>
                    3. Cơ sở có trách nhiệm khẩn trương khắc phục triệt để các
                    tồn tại về PCCC và bếp ăn bán trú. Sau khi khắc phục xong,
                    lập báo cáo bằng văn bản gửi UBND phường để tổ chức kiểm tra
                    nghiệm thu xem xét cho phép hoạt động trở lại.
                  </div>
                </div>

                <p>
                  <strong>Điều 3.</strong> Chánh Văn phòng HĐND - UBND phường,
                  Công chức Văn hóa - Xã hội, Trưởng Công an phường, Trưởng Trạm
                  Y tế, Trưởng Ban điều hành {viewingDinhChiMn.khuPho} và bà/ông{" "}
                  {viewingDinhChiMn.chuCoSo} chịu trách nhiệm thi hành Quyết định
                  này./.
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
                  <div className="font-bold text-xs uppercase text-gray-900">
                    CHỦ TỊCH
                  </div>
                  <div className="my-2 flex justify-center">
                    <DigitalSignatureBadge
                      nguoiKy="TS. Nguyễn Văn Hùng"
                      chucVu="Chủ tịch UBND Phường Phú Cường"
                      ngayKy={new Date().toLocaleDateString("vi-VN")}
                      maXacThuc={`CA-ĐC-${viewingDinhChiMn.id}-${Date.now()
                        .toString()
                        .slice(-6)}`}
                    />
                  </div>
                  <div className="font-extrabold text-sm text-gray-900">
                    TS. Nguyễn Văn Hùng
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Form cập nhật lý do */}
            <div className="p-4 border-t bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-3 no-print rounded-b-xl">
              <div className="flex-1 w-full text-xs">
                <span className="font-bold text-gray-700">
                  Điều chỉnh lý do &amp; thời hạn đình chỉ:
                </span>
                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    value={inputLyDoDinhChi}
                    onChange={(e) => setInputLyDoDinhChi(e.target.value)}
                    placeholder="Nhập lý do vi phạm an toàn PCCC, dinh dưỡng, bạo lực trẻ em..."
                    className="flex-1 rounded-lg border border-gray-300 px-2 py-1 text-xs outline-none"
                  />
                  <select
                    value={inputThoiHanDinhChi}
                    onChange={(e) =>
                      setInputThoiHanDinhChi(Number(e.target.value))
                    }
                    className="rounded-lg border border-gray-300 px-2 py-1 text-xs bg-white outline-none"
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
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Download className="size-4" />
                  Tải file Word (.doc)
                </button>
                <button
                  onClick={handleBanHanhQDDinhChi}
                  className="px-4 py-2 bg-[#b91c1c] hover:bg-[#991b1b] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Stamp className="size-4" />
                  Ký số ban hành QĐ đình chỉ
                </button>
                <button
                  onClick={() => setViewingDinhChiMn(null)}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-semibold rounded-lg cursor-pointer transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 15: PHỤC HỒI HOẠT ĐỘNG SAU KHẮC PHỤC */}
      {viewingPhucHoiMn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white text-gray-900 rounded-xl shadow-2xl max-w-3xl w-full border border-gray-200 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-emerald-700 text-white px-6 py-3.5 flex items-center justify-between no-print shrink-0 shadow-xs rounded-t-xl">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-5" />
                <h3 className="font-bold text-sm sm:text-base">
                  Quyết định Cho phép Hoạt động trở lại sau khắc phục (Khoản 4
                  Điều 11 Thông tư 49/2021)
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
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Download className="size-3.5" />
                  <span>Tải Word (.doc)</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-xs flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Printer className="size-3.5" />
                  <span>In Quyết định (Ctrl+P)</span>
                </button>
                <button
                  onClick={() => setViewingPhucHoiMn(null)}
                  className="text-white/80 hover:text-white p-1 rounded-md hover:bg-white/10 cursor-pointer transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            <div
              className="p-8 overflow-y-auto font-serif text-[13px] leading-relaxed select-text flex-1"
              id="quyet-dinh-phuc-hoi-content"
            >
              {/* Quốc hiệu & Đơn vị ban hành */}
              <div className="grid grid-cols-2 text-center pb-4 border-b border-gray-400">
                <div>
                  <div className="font-bold uppercase text-[12px]">
                    ỦY BAN NHÂN DÂN THÀNH PHỐ THỦ DẦU MỘT
                  </div>
                  <div className="font-bold uppercase text-[13px] text-emerald-800">
                    ỦY BAN NHÂN DÂN PHƯỜNG PHÚ CƯỜNG
                  </div>
                  <div className="text-[11px] font-sans mt-1">
                    Số:{" "}
                    <strong className="font-mono text-black">
                      122/QĐ-UBND
                    </strong>
                  </div>
                </div>
                <div>
                  <div className="font-bold uppercase text-[12px]">
                    CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                  </div>
                  <div className="font-bold text-[13px]">
                    Độc lập - Tự do - Hạnh phúc
                  </div>
                  <div className="text-[11px] italic font-sans mt-2">
                    Phú Cường, ngày {new Date().toLocaleDateString("vi-VN")}
                  </div>
                </div>
              </div>

              {/* Tiêu đề Quyết định */}
              <div className="text-center my-6 space-y-1">
                <h2 className="text-base font-bold uppercase tracking-wide text-gray-900">
                  QUYẾT ĐỊNH
                </h2>
                <div className="font-bold text-sm text-gray-800">
                  Về việc cho phép hoạt động giáo dục trở lại đối với{" "}
                  {viewingPhucHoiMn.tenCoSo}
                </div>
                <div className="text-xs uppercase font-extrabold text-emerald-800 tracking-widest pt-1">
                  CHỦ TỊCH ỦY BAN NHÂN DÂN PHƯỜNG PHÚ CƯỜNG
                </div>
              </div>

              {/* Căn cứ pháp lý */}
              <div className="space-y-1 text-justify text-xs italic text-gray-700 mb-4 font-serif">
                <p>
                  Căn cứ Luật Tổ chức chính quyền địa phương ngày 19 tháng 6 năm
                  2015; Luật sửa đổi, bổ sung một số điều của Luật Tổ chức Chính
                  phủ và Luật Tổ chức chính quyền địa phương ngày 22 tháng 11 năm
                  2019;
                </p>
                <p>Căn cứ Luật Giáo dục ngày 14 tháng 6 năm 2019;</p>
                <p>
                  Căn cứ Khoản 4 Điều 11 Thông tư số 49/2021/TT-BGDĐT ngày 31
                  tháng 12 năm 2021 của Bộ Giáo dục và Đào tạo ban hành Quy chế
                  tổ chức và hoạt động của nhóm trẻ độc lập, lớp mẫu giáo độc
                  lập;
                </p>
                <p>
                  Căn cứ Quyết định số 89/QĐ-UBND ngày 12 tháng 03 năm 2026 của
                  Chủ tịch UBND Phường Phú Cường về việc tạm đình chỉ hoạt động
                  giáo dục đối với {viewingPhucHoiMn.tenCoSo};
                </p>
                <p>
                  Căn cứ Báo cáo khắc phục tồn tại vi phạm của bà/ông{" "}
                  {viewingPhucHoiMn.chuCoSo} và Biên bản kiểm tra nghiệm thu số
                  25/BB-LN ngày {new Date().toLocaleDateString("vi-VN")} của Đoàn
                  kiểm tra liên ngành UBND Phường Phú Cường;
                </p>
                <p>
                  Theo đề nghị của Công chức Văn hóa - Xã hội phụ trách Giáo dục.
                </p>
              </div>

              <div className="text-center font-bold text-xs uppercase my-2 tracking-wider">
                QUYẾT ĐỊNH:
              </div>

              {/* Điều khoản */}
              <div className="space-y-2.5 text-justify text-xs font-serif leading-relaxed mb-6">
                <p>
                  <strong>Điều 1.</strong> Cho phép cơ sở giáo dục mầm non ngoài
                  công lập sau đây được tổ chức hoạt động giáo dục trở lại kể từ
                  ngày ký Quyết định này:
                </p>
                <div className="pl-4 space-y-1 font-sans">
                  <div>
                    - Tên cơ sở:{" "}
                    <strong className="text-emerald-800 uppercase">
                      {viewingPhucHoiMn.tenCoSo}
                    </strong>{" "}
                    (Mã: {viewingPhucHoiMn.maCoSo})
                  </div>
                  <div>
                    - Quyết định thành lập số:{" "}
                    <strong>{viewingPhucHoiMn.soQuyetDinhCapPhep}</strong>
                  </div>
                  <div>
                    - Chủ cơ sở:{" "}
                    <strong className="uppercase">
                      {viewingPhucHoiMn.chuCoSo}
                    </strong>{" "}
                    (SĐT: {viewingPhucHoiMn.soDienThoai})
                  </div>
                  <div>
                    - Địa điểm hoạt động:{" "}
                    <strong>
                      {viewingPhucHoiMn.diaChi}, {viewingPhucHoiMn.khuPho}
                    </strong>
                  </div>
                  <div>
                    - Quy mô tiếp nhận: Tối đa{" "}
                    <strong>{viewingPhucHoiMn.soTreDangGiu} trẻ em</strong> (
                    {viewingPhucHoiMn.soGiaoVienBaoMau} giáo viên/bảo mẫu)
                  </div>
                  <div>
                    - Kết luận nghiệm thu khắc phục vi phạm:{" "}
                    <strong className="text-emerald-800">
                      {inputNoiDungPhucHoi.trim() ||
                        "Đã hoàn thành lắp đặt cửa thoát nạn chịu nhiệt, bổ sung đầy đủ bình chữa cháy MFZ4 và phân chia vách nhôm kính khu vực bếp nấu đạt chuẩn 1 chiều. Đoàn liên ngành kiểm tra nghiệm thu đạt chuẩn an toàn."}
                    </strong>
                  </div>
                </div>

                <p>
                  <strong>Điều 2.</strong> Trách nhiệm của chủ cơ sở và các cơ
                  quan liên quan:
                </p>
                <div className="pl-4 space-y-1 font-sans text-gray-800">
                  <div>
                    1. Bà/ông <strong>{viewingPhucHoiMn.chuCoSo}</strong> có
                    trách nhiệm thông báo công khai đến toàn thể phụ huynh về
                    thời gian đón nhận trẻ trở lại; nghiêm túc duy trì thường
                    xuyên các điều kiện về PCCC, bếp ăn một chiều, bảo đảm sĩ số
                    theo quy định và an toàn tuyệt đối tính mạng, thể chất cho
                    trẻ.
                  </div>
                  <div>
                    2. Giao Công chức Văn hóa - Xã hội chủ trì, phối hợp Trạm Y
                    tế và Công an phường tổ chức hậu kiểm định kỳ, kịp thời phát
                    hiện và xử lý nghiêm các trường hợp tái vi phạm.
                  </div>
                </div>

                <p>
                  <strong>Điều 3.</strong> Chánh Văn phòng HĐND - UBND phường,
                  Công chức Văn hóa - Xã hội, Trưởng Công an phường, Trưởng Trạm
                  Y tế, Trưởng Ban điều hành {viewingPhucHoiMn.khuPho} và bà/ông{" "}
                  {viewingPhucHoiMn.chuCoSo} chịu trách nhiệm thi hành Quyết định
                  này./.
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
                  <div className="font-bold text-xs uppercase text-gray-900">
                    CHỦ TỊCH
                  </div>
                  <div className="my-2 flex justify-center">
                    <DigitalSignatureBadge
                      nguoiKy="TS. Nguyễn Văn Hùng"
                      chucVu="Chủ tịch UBND Phường Phú Cường"
                      ngayKy={new Date().toLocaleDateString("vi-VN")}
                      maXacThuc={`CA-PH-${viewingPhucHoiMn.id}-${Date.now()
                        .toString()
                        .slice(-6)}`}
                    />
                  </div>
                  <div className="font-extrabold text-sm text-gray-900">
                    TS. Nguyễn Văn Hùng
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Form cập nhật kết quả nghiệm thu */}
            <div className="p-4 border-t bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-3 no-print rounded-b-xl">
              <div className="flex-1 w-full text-xs">
                <span className="font-bold text-gray-700">
                  Ghi chú kết quả nghiệm thu thực tế của Đoàn liên ngành:
                </span>
                <input
                  type="text"
                  value={inputNoiDungPhucHoi}
                  onChange={(e) => setInputNoiDungPhucHoi(e.target.value)}
                  placeholder="Ghi nhận các hạng mục đã hoàn thành khắc phục (PCCC, bếp 1 chiều, khử khuẩn, camera...)"
                  className="w-full mt-1 rounded-lg border border-gray-300 px-2.5 py-1 text-xs outline-none"
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
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Download className="size-4" />
                  Tải file Word (.doc)
                </button>
                <button
                  type="button"
                  onClick={handleBanHanhQDPhucHoi}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Stamp className="size-4" />
                  Ký số ban hành QĐ phục hồi
                </button>
                <button
                  type="button"
                  onClick={() => setViewingPhucHoiMn(null)}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-semibold rounded-lg cursor-pointer transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 16: BÁO CÁO QUẢN LÝ MẦM NON (MẪU 32/BC-UBND) */}
      {showBaoCaoQuanLyMamNonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white text-gray-900 rounded-xl shadow-2xl max-w-4xl w-full border border-gray-200 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-teal-800 text-white px-6 py-3.5 flex items-center justify-between no-print shrink-0 shadow-xs rounded-t-xl">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="size-5" />
                <h3 className="font-bold text-sm sm:text-base">
                  Báo cáo Tổng hợp Quản lý Giáo dục Mầm non Ngoài Công lập (Số
                  32/BC-UBND)
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
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Download className="size-3.5" />
                  <span>Tải Word (.doc)</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Printer className="size-3.5" />
                  <span>In Báo cáo (Ctrl+P)</span>
                </button>
                <button
                  onClick={() => setShowBaoCaoQuanLyMamNonModal(false)}
                  className="text-white/80 hover:text-white p-1 rounded-md hover:bg-white/10 cursor-pointer transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            <div
              className="p-8 overflow-y-auto font-serif text-[13px] leading-relaxed select-text flex-1"
              id="bao-cao-mam-non-content"
            >
              {/* Quốc hiệu & Đơn vị ban hành */}
              <div className="grid grid-cols-2 text-center pb-4 border-b border-gray-400">
                <div>
                  <div className="font-bold uppercase text-[12px]">
                    ỦY BAN NHÂN DÂN THÀNH PHỐ THỦ DẦU MỘT
                  </div>
                  <div className="font-bold uppercase text-[13px] text-teal-900">
                    ỦY BAN NHÂN DÂN PHƯỜNG PHÚ CƯỜNG
                  </div>
                  <div className="text-[11px] font-sans mt-1">
                    Số:{" "}
                    <strong className="font-mono text-black">32/BC-UBND</strong>
                  </div>
                </div>
                <div>
                  <div className="font-bold uppercase text-[12px]">
                    CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                  </div>
                  <div className="font-bold text-[13px]">
                    Độc lập - Tự do - Hạnh phúc
                  </div>
                  <div className="text-[11px] italic font-sans mt-2">
                    Phú Cường, ngày {new Date().toLocaleDateString("vi-VN")}
                  </div>
                </div>
              </div>

              {/* Tiêu đề Báo cáo */}
              <div className="text-center my-6 space-y-1">
                <h2 className="text-base font-bold uppercase tracking-wide text-gray-900">
                  BÁO CÁO
                </h2>
                <div className="font-bold text-sm text-gray-800">
                  Tình hình quản lý nhà nước đối với các nhóm trẻ, lớp mẫu giáo
                  độc lập tư thục năm 2026
                </div>
                <div className="text-xs italic text-gray-600">
                  (Kính gửi: Phòng Giáo dục và Đào tạo Thành phố Thủ Dầu Một)
                </div>
              </div>

              <div className="space-y-3 text-justify text-xs font-serif leading-relaxed">
                <p>
                  Thực hiện Luật Giáo dục 2019, Nghị định số 46/2017/NĐ-CP và
                  Thông tư số 49/2021/TT-BGDĐT ngày 31/12/2021 của Bộ Giáo dục
                  và Đào tạo; Ủy ban nhân dân Phường Phú Cường báo cáo tình hình
                  quản lý mạng lưới cơ sở giáo dục mầm non ngoài công lập như
                  sau:
                </p>

                <h4 className="font-bold text-sm uppercase text-gray-900 pt-2 font-sans">
                  I. TỔNG HỢP MẠNG LƯỚI &amp; QUY MÔ CHĂM SÓC NUÔI DẠY TRẺ
                </h4>
                <div className="font-sans grid grid-cols-2 sm:grid-cols-4 gap-2 not-italic text-xs">
                  <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200 text-center">
                    <div className="text-gray-500 text-[11px]">
                      Tổng số cơ sở
                    </div>
                    <div className="text-lg font-bold text-teal-800 font-mono">
                      {mamNonList.length} cơ sở
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200 text-center">
                    <div className="text-gray-500 text-[11px]">
                      Tổng số trẻ đang giữ
                    </div>
                    <div className="text-lg font-bold text-teal-800 font-mono">
                      {mamNonList.reduce((acc, m) => acc + m.soTreDangGiu, 0)}{" "}
                      trẻ
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200 text-center">
                    <div className="text-gray-500 text-[11px]">
                      Đội ngũ giáo viên/bảo mẫu
                    </div>
                    <div className="text-lg font-bold text-teal-800 font-mono">
                      {mamNonList.reduce(
                        (acc, m) => acc + m.soGiaoVienBaoMau,
                        0
                      )}{" "}
                      người
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200 text-center">
                    <div className="text-gray-500 text-[11px]">
                      Tỷ lệ Camera trực tuyến
                    </div>
                    <div className="text-lg font-bold text-emerald-700 font-mono">
                      100%
                    </div>
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
                        <th className="border border-gray-400 p-1 text-left">
                          Tên cơ sở mầm non
                        </th>
                        <th className="border border-gray-400 p-1 text-left">
                          Chủ cơ sở &amp; Phụ trách CM
                        </th>
                        <th className="border border-gray-400 p-1">
                          Số QĐ cấp phép
                        </th>
                        <th className="border border-gray-400 p-1 text-center">
                          Quy mô
                        </th>
                        <th className="border border-gray-400 p-1 text-center">
                          Định mức
                        </th>
                        <th className="border border-gray-400 p-1 text-center">
                          Bếp 1 chiều
                        </th>
                        <th className="border border-gray-400 p-1 text-center">
                          Đánh giá an toàn
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {mamNonList.map((mn, idx) => (
                        <tr key={mn.id} className="hover:bg-gray-50">
                          <td className="border border-gray-400 p-1 text-center font-mono">
                            {idx + 1}
                          </td>
                          <td className="border border-gray-400 p-1 font-semibold">
                            {mn.tenCoSo}
                            <div className="text-[10px] text-gray-500">
                              {mn.diaChi} ({mn.khuPho})
                            </div>
                          </td>
                          <td className="border border-gray-400 p-1">
                            <div>{mn.chuCoSo}</div>
                            <div className="text-[10px] text-gray-500">
                              CM: {mn.nguoiPhuTrachChuyenMon}
                            </div>
                          </td>
                          <td className="border border-gray-400 p-1 font-mono text-[10px]">
                            {mn.soQuyetDinhCapPhep}
                          </td>
                          <td className="border border-gray-400 p-1 text-center font-mono">
                            {mn.soTreDangGiu} trẻ / {mn.soGiaoVienBaoMau} GV
                          </td>
                          <td className="border border-gray-400 p-1 text-center font-mono">
                            {(
                              mn.dienTichPhongHocM2 / mn.soTreDangGiu
                            ).toFixed(1)}{" "}
                            m²/trẻ
                          </td>
                          <td className="border border-gray-400 p-1 text-center">
                            {mn.bepAnMotChieu ? "Đạt chuẩn" : "Chưa đạt"}
                          </td>
                          <td className="border border-gray-400 p-1 text-center font-semibold">
                            <span
                              className={`px-1 py-0.5 rounded text-[10px] ${
                                mn.ketQuaKiemTraCuoi === "DAT_CHUAN_AN_TOAN"
                                  ? "text-emerald-800 bg-emerald-50"
                                  : mn.ketQuaKiemTraCuoi ===
                                    "NHAC_NHO_KHAC_PHUC"
                                  ? "text-amber-800 bg-amber-50"
                                  : "text-red-800 bg-red-50 font-bold"
                              }`}
                            >
                              {mn.ketQuaKiemTraCuoi === "DAT_CHUAN_AN_TOAN"
                                ? "Đạt chuẩn"
                                : mn.ketQuaKiemTraCuoi ===
                                  "NHAC_NHO_KHAC_PHUC"
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
                  1. Kính đề nghị Phòng GD&amp;ĐT TP. Thủ Dầu Một tiếp tục mở các
                  lớp bồi dưỡng chuyên môn nghiệp vụ về phương pháp giáo dục mầm
                  non tiên tiến, kỹ năng phòng chống tai nạn thương tích và sơ
                  cấp cứu ban đầu cho đội ngũ giáo viên, người nuôi giữ trẻ
                  ngoài công lập trên địa bàn.
                </p>
                <p>
                  2. Hỗ trợ tài liệu chuyên môn và phối hợp thanh tra, kiểm tra
                  định kỳ để nâng cao hơn nữa chất lượng chăm sóc, bảo đảm an
                  toàn tính mạng tuyệt đối cho trẻ em./.
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
                  <div className="font-bold text-xs uppercase text-gray-900">
                    CHỦ TỊCH
                  </div>
                  <div className="my-2 flex justify-center">
                    <DigitalSignatureBadge
                      nguoiKy="TS. Nguyễn Văn Hùng"
                      chucVu="Chủ tịch UBND Phường Phú Cường"
                      ngayKy={new Date().toLocaleDateString("vi-VN")}
                      maXacThuc={`CA-BC32-GD-${Date.now().toString().slice(-6)}`}
                    />
                  </div>
                  <div className="font-extrabold text-sm text-gray-900">
                    TS. Nguyễn Văn Hùng
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-6 py-3 border-t bg-gray-50 rounded-b-xl no-print">
              <span className="text-xs text-gray-500">
                Báo cáo số 32/BC-UBND · Phường Phú Cường, TP. Thủ Dầu Một
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    exportDocAsWord(
                      "Bao_cao_32_Quan_ly_Mam_non_Phu_Cuong",
                      "bao-cao-mam-non-content"
                    )
                  }
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Download className="size-4" />
                  Tải file Word (.doc)
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Printer className="size-4" />
                  In Báo cáo
                </button>
                <button
                  onClick={() => setShowBaoCaoQuanLyMamNonModal(false)}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-semibold rounded-lg cursor-pointer transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
