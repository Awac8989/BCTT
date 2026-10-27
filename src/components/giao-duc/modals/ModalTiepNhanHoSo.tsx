import React, { useState } from "react";
import { FileSignature, X } from "lucide-react";
import { toast } from "sonner";
import {
  type HoSoTTHCGiaoDuc,
  type ThanhPhanGiayTo,
  THU_TUC_GD_CONFIGS,
} from "@/data/domain-mock";
import { appStore } from "@/services/app-state";

interface ModalTiepNhanHoSoProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newHoSo: HoSoTTHCGiaoDuc) => void;
  existingCount: number;
}

export const ModalTiepNhanHoSo: React.FC<ModalTiepNhanHoSoProps> = ({
  isOpen,
  onClose,
  onSuccess,
  existingCount,
}) => {
  const [thuTucChon, setThuTucChon] = useState("TTHC-GD-BGD/01");
  const [nguoiNopMoi, setNguoiNopMoi] = useState("");
  const [sdtMoi, setSdtMoi] = useState("");
  const [cccdMoi, setCccdMoi] = useState("");
  const [diaChiNguoiNopMoi, setDiaChiNguoiNopMoi] = useState("");
  const [tenCoSoMoi, setTenCoSoMoi] = useState("");
  const [diaDiemCoSoMoi, setDiaDiemCoSoMoi] = useState("");
  const [khuPhoMoi, setKhuPhoMoi] = useState("Khu phố 1");
  const [hinhThucMoi, setHinhThucMoi] = useState<
    "TRUC_TIEP_MOT_CUA" | "DVC_TRUC_TUYEN_QUOC_GIA"
  >("TRUC_TIEP_MOT_CUA");
  const [checkedGiayToMoi, setCheckedGiayToMoi] = useState<
    Record<string, boolean>
  >(() => {
    const initChecked: Record<string, boolean> = {};
    THU_TUC_GD_CONFIGS["TTHC-GD-BGD/01"]?.standardDocs.forEach((d) => {
      initChecked[d.id] = d.daNop;
    });
    return initChecked;
  });

  if (!isOpen) return null;

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

  const handleTiepNhanHoSoMoi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nguoiNopMoi.trim() || !sdtMoi.trim() || !tenCoSoMoi.trim()) {
      toast.error(
        "Vui lòng điền đủ tên người nộp, số điện thoại và tên cơ sở/trường học đề nghị!"
      );
      return;
    }

    const config =
      THU_TUC_GD_CONFIGS[thuTucChon] || THU_TUC_GD_CONFIGS["TTHC-GD-BGD/01"];
    const nextIdx = existingCount + 1;
    const newId = `HSO-GD-00${nextIdx}`;
    const newMaHoSo = `HSO-GD-2026-00${nextIdx}`;
    const now = new Date();
    const ngayTiepNhan = now.toLocaleDateString("vi-VN");

    const henTraDate = new Date();
    henTraDate.setDate(henTraDate.getDate() + config.thoiHanNgayLich);
    const ngayHenTra = henTraDate.toLocaleDateString("vi-VN");

    const standardDocs: ThanhPhanGiayTo[] = config.standardDocs.map((doc) => ({
      ...doc,
      daNop: !!checkedGiayToMoi[doc.id],
      ghiChu:
        !checkedGiayToMoi[doc.id] && doc.batBuoc
          ? "Chưa nộp (Cần bổ sung)"
          : doc.ghiChu,
    }));

    const missingRequiredDocs = standardDocs.filter(
      (d) => d.batBuoc && !d.daNop
    );
    const isYeuCauBoSung = missingRequiredDocs.length > 0;
    const lyDoBoSungMoi = isYeuCauBoSung
      ? `Công dân cần bổ sung các giấy tờ bắt buộc theo ${
          config.canCuPhapLy
        }: ${missingRequiredDocs.map((d) => d.tenGiayTo).join("; ")}`
      : undefined;

    const hanBoSungDate = new Date();
    hanBoSungDate.setDate(hanBoSungDate.getDate() + 7);
    const hanBoSungMoi = isYeuCauBoSung
      ? hanBoSungDate.toLocaleDateString("vi-VN")
      : undefined;

    const newHoSo: HoSoTTHCGiaoDuc = {
      id: newId,
      maHoSo: newMaHoSo,
      tenThuTuc: config.tenThuTuc,
      maThuTuc: config.maThuTuc,
      nguoiNop: nguoiNopMoi.trim(),
      soDienThoai: sdtMoi.trim(),
      cccd:
        cccdMoi.trim() ||
        "0740" + Math.floor(10000000 + Math.random() * 90000000),
      diaChiLienHe:
        diaChiNguoiNopMoi.trim() || `${khuPhoMoi}, Phường Phú Cường`,
      tenCoSoDeNghi: tenCoSoMoi.trim(),
      diaDiemCoSo:
        diaDiemCoSoMoi.trim() || `${khuPhoMoi}, Phường Phú Cường`,
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

    onClose();
    onSuccess(newHoSo);
    // Reset form
    setNguoiNopMoi("");
    setSdtMoi("");
    setCccdMoi("");
    setTenCoSoMoi("");
    setDiaDiemCoSoMoi("");
  };

  const cfg =
    THU_TUC_GD_CONFIGS[thuTucChon] || THU_TUC_GD_CONFIGS["TTHC-GD-BGD/01"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-gray-200 overflow-hidden max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-[#dd4b39] text-white px-5 py-3.5 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-1 rounded-md bg-white/10">
              <FileSignature className="size-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base leading-tight">
                Tiếp nhận Hồ sơ TTHC Giáo dục (Một Cửa Điện Tử)
              </h3>
              <p className="text-[11px] text-white/80 font-normal">
                Chuẩn hóa quy trình theo Nghị định số 61/2018/NĐ-CP
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-md hover:bg-white/10 cursor-pointer transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        <form
          onSubmit={handleTiepNhanHoSoMoi}
          className="p-5 space-y-4 text-xs overflow-y-auto flex-1"
        >
          <div className="bg-red-50/80 p-3.5 rounded-lg border border-red-200 text-red-900 leading-relaxed text-[11px]">
            <strong>Quy định tiếp nhận Một cửa (Nghị định 61/2018/NĐ-CP):</strong>{" "}
            Kiểm tra tính đầy đủ, hợp lệ của thành phần hồ sơ. Sau khi lưu, hệ
            thống tự động sinh Mã hồ sơ điện tử và cấp Giấy tiếp nhận hồ sơ
            &amp; hẹn trả kết quả (Mẫu số 01) có mã QR tra cứu.
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
                className="w-full rounded-lg border border-gray-300 p-2 text-xs font-semibold bg-white outline-none focus:border-[#dd4b39] focus:ring-1 focus:ring-[#dd4b39]"
              >
                <option value="TTHC-GD-BGD/01">
                  Cho phép thành lập nhóm trẻ độc lập tư thục (15 ngày)
                </option>
                <option value="TTHC-GD-BGD/02">
                  Cho phép thành lập lớp mẫu giáo độc lập (15 ngày)
                </option>
                <option value="TTHC-GD-BGD/03">
                  Chuyển địa điểm và mở rộng quy mô nhóm lớp (10 ngày)
                </option>
                <option value="TTHC-GD-BGD/04">
                  Hỗ trợ tiền ăn trưa trẻ em &amp; chi phí học tập (07 ngày)
                </option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Hình thức tiếp nhận
              </label>
              <select
                value={hinhThucMoi}
                onChange={(e) => setHinhThucMoi(e.target.value as any)}
                className="w-full rounded-lg border border-gray-300 p-2 text-xs bg-white outline-none focus:border-[#dd4b39]"
              >
                <option value="TRUC_TIEP_MOT_CUA">
                  Trực tiếp tại Quầy Một cửa Phường
                </option>
                <option value="DVC_TRUC_TUYEN_QUOC_GIA">
                  Nộp qua Cổng Dịch vụ công Quốc gia / Tỉnh
                </option>
              </select>
            </div>
          </div>

          {/* Thông tin căn cứ pháp lý & thời hạn */}
          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-blue-900 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
            <div>
              <span className="text-blue-700 font-medium">Căn cứ pháp lý:</span>
              <strong className="block text-gray-900 mt-0.5">
                {cfg.canCuPhapLy}
              </strong>
            </div>
            <div>
              <span className="text-blue-700 font-medium">
                Thời hạn giải quyết:
              </span>
              <strong className="block text-gray-900 mt-0.5 font-mono">
                {cfg.thoiHanNgayLamViec} ngày làm việc ({cfg.thoiHanNgayLich}{" "}
                ngày)
              </strong>
            </div>
            <div>
              <span className="text-blue-700 font-medium">Lệ phí giải quyết:</span>
              <strong className="block text-emerald-700 mt-0.5 font-bold">
                Miễn phí (0 đồng)
              </strong>
            </div>
          </div>

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
                className="w-full rounded-lg border border-gray-300 p-2 text-xs outline-none focus:border-[#dd4b39]"
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
                className="w-full rounded-lg border border-gray-300 p-2 text-xs outline-none focus:border-[#dd4b39]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Số CCCD / Định danh VNeID
              </label>
              <input
                type="text"
                placeholder="12 chữ số CCCD"
                value={cccdMoi}
                onChange={(e) => setCccdMoi(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2 text-xs font-mono outline-none focus:border-[#dd4b39]"
              />
            </div>
          </div>

          {/* Tên cơ sở mầm non, Địa điểm & Khu phố */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-bold text-gray-700 mb-1">
                Tên cơ sở giáo dục đề nghị thành lập{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="VD: Nhóm trẻ tư thục Hoa Hướng Dương"
                value={tenCoSoMoi}
                onChange={(e) => setTenCoSoMoi(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2 text-xs outline-none focus:border-[#dd4b39]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Khu phố địa bàn
              </label>
              <select
                value={khuPhoMoi}
                onChange={(e) => setKhuPhoMoi(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2 text-xs bg-white outline-none focus:border-[#dd4b39]"
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
            <label className="block font-bold text-gray-700 mb-1">
              Địa điểm đặt trụ sở nhóm trẻ
            </label>
            <input
              type="text"
              placeholder="Số nhà, tên đường, khu phố, Phường Phú Cường"
              value={diaDiemCoSoMoi}
              onChange={(e) => setDiaDiemCoSoMoi(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2 text-xs outline-none focus:border-[#dd4b39]"
            />
          </div>

          {/* Bảng kê thành phần hồ sơ */}
          <div>
            <div className="font-bold text-gray-800 uppercase text-[11px] mb-2 flex items-center justify-between">
              <span>
                Kiểm tra danh mục thành phần hồ sơ tiếp nhận (
                {cfg.standardDocs.length} loại giấy tờ):
              </span>
              <span className="text-[10px] text-gray-500 italic">
                Tích chọn các giấy tờ công dân nộp
              </span>
            </div>

            <div className="border border-gray-200 rounded-lg p-2.5 space-y-2 bg-gray-50/50 max-h-56 overflow-y-auto">
              {cfg.standardDocs.map((doc, idx) => (
                <label
                  key={doc.id}
                  className="flex items-start gap-2.5 p-2 rounded-md hover:bg-white border border-transparent hover:border-gray-200 transition-colors cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={!!checkedGiayToMoi[doc.id]}
                    onChange={(e) =>
                      setCheckedGiayToMoi({
                        ...checkedGiayToMoi,
                        [doc.id]: e.target.checked,
                      })
                    }
                    className="mt-0.5 rounded text-[#dd4b39] size-4 shrink-0"
                  />
                  <div className="text-gray-800 text-xs">
                    <div>
                      <strong>
                        {idx + 1}. {doc.tenGiayTo}
                      </strong>{" "}
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

          <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
            <span className="text-[11px] text-gray-500 italic">
              * Hệ thống sẽ tự động cấp mã hồ sơ điện tử và in Giấy hẹn trả kết quả.
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold cursor-pointer transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-[#dd4b39] hover:bg-[#c23321] text-white font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <FileSignature className="size-4" />
                <span>Tiếp nhận &amp; Cấp Giấy hẹn (Mẫu 01)</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
