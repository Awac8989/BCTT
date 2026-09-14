import { useState } from "react";
import {
  X,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Download,
  RotateCcw,
  Building,
  CreditCard,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { appStore, useAppState } from "@/services/app-state";
import { formatVND } from "@/data/mock";

interface DoiSoatBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// Dữ liệu đối soát mẫu từ các ngân hàng
const SAMPLE_BANK_FILES = [
  {
    bankName: "Vietcombank CN Bình Dương",
    fileName: "VCB_DoiSoat_TroCap_T092026_Dot1.csv",
    recordsCount: 8,
    records: [
      {
        maGiaoDich: "UNC-VCB-20260905-0812",
        soHoSoTinh: "BD/16720-1",
        cccd: "074045001923",
        soTien: 2_055_000,
        trangThai: "THÀNH_CÔNG" as const,
      },
      {
        maGiaoDich: "UNC-VCB-20260905-1550",
        soHoSoTinh: "BD/16705-1",
        cccd: "074052007788",
        soTien: 5_404_650,
        trangThai: "THÀNH_CÔNG" as const,
      },
      {
        maGiaoDich: "UNC-VCB-20260905-9981",
        soHoSoTinh: "BD/16701-1",
        cccd: "074030008899",
        soTien: 8_220_000,
        trangThai: "THẤT_BẠI" as const,
        lyDoLoi: "Tài khoản bị tạm khóa (Báo tử từ trần)",
      },
      {
        maGiaoDich: "UNC-VCB-20260905-7721",
        soHoSoTinh: "BD/16718-1",
        cccd: "074048002841",
        soTien: 2_055_000,
        trangThai: "THÀNH_CÔNG" as const,
      },
    ],
  },
  {
    bankName: "Agribank Bình Dương / Bắc Tân Uyên",
    fileName: "AGRI_DoiSoat_ChiTra_202609.csv",
    recordsCount: 6,
    records: [
      {
        maGiaoDich: "UNC-AGR-20260905-0922",
        soHoSoTinh: "BD/16718-1",
        cccd: "074048002841",
        soTien: 2_055_000,
        trangThai: "THÀNH_CÔNG" as const,
      },
      {
        maGiaoDich: "UNC-AGR-20260905-1882",
        soHoSoTinh: "BD/16707-1",
        cccd: "074043003344",
        soTien: 2_055_000,
        trangThai: "THÀNH_CÔNG" as const,
      },
      {
        maGiaoDich: "UNC-AGR-20260905-0012",
        soHoSoTinh: "BD/16715-1",
        cccd: "074050004455",
        soTien: 2_055_000,
        trangThai: "THẤT_BẠI" as const,
        lyDoLoi: "Sai thông tin tên chủ tài khoản và CCCD",
      },
    ],
  },
  {
    bankName: "Tổng Công ty Bưu điện Việt Nam (VNPost Bình Dương)",
    fileName: "VNPOST_KetQua_ChiTra_TienMat_T09.xlsx",
    recordsCount: 5,
    records: [
      {
        maGiaoDich: "VNP-20260905-004",
        soHoSoTinh: "BD/16715-1",
        cccd: "074050004455",
        soTien: 2_055_000,
        trangThai: "THÀNH_CÔNG" as const,
      },
      {
        maGiaoDich: "VNP-20260905-006",
        soHoSoTinh: "BD/16711-1",
        cccd: "074049006677",
        soTien: 2_055_000,
        trangThai: "THÀNH_CÔNG" as const,
      },
      {
        maGiaoDich: "VNP-20260905-011",
        soHoSoTinh: "BD/16709-1",
        cccd: "074044001122",
        soTien: 2_055_000,
        trangThai: "THÀNH_CÔNG" as const,
      },
    ],
  },
];

export function DoiSoatBankModal({ isOpen, onClose, onSuccess }: DoiSoatBankModalProps) {
  const { chiTraList } = useAppState();
  const [selectedFileIdx, setSelectedFileIdx] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultStats, setResultStats] = useState<{
    total: number;
    successCount: number;
    failCount: number;
    totalSuccessAmount: number;
    totalFailAmount: number;
  } | null>(null);

  if (!isOpen) return null;

  const currentFile = SAMPLE_BANK_FILES[selectedFileIdx]!;

  const handleRunReconciliation = () => {
    setIsProcessing(true);

    setTimeout(() => {
      try {
        const stats = appStore.doiSoatGiaoDichNganHang(currentFile.records);
        setResultStats(stats);
        setIsProcessing(false);
        toast.success(
          `Đối soát thành công! Khớp ${stats.successCount} giao dịch, phát hiện ${stats.failCount} trường hợp cần xử lý.`
        );
        if (onSuccess) onSuccess();
      } catch (err: any) {
        setIsProcessing(false);
        toast.error(err.message || "Lỗi xử lý đối soát");
      }
    }, 800);
  };

  const handleExportReport = () => {
    if (!resultStats) return;
    const content = `CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\nĐộc lập - Tự do - Hạnh phúc\n\nBIÊN BẢN ĐỐI SOÁT CHI TRẢ TRỢ CẤP NGƯỜI CÓ CÔNG\nĐơn vị phối hợp: ${currentFile.bankName}\nTệp đối soát: ${currentFile.fileName}\nThời gian đối soát: ${new Date().toLocaleString("vi-VN")}\n\n1. TỔNG SỐ LƯỢNG GIAO DỊCH: ${resultStats.total}\n2. KHỚP THÀNH CÔNG: ${resultStats.successCount} món (Số tiền: ${formatVND(resultStats.totalSuccessAmount)})\n3. THẤT BẠI / TỒN ĐỌNG: ${resultStats.failCount} món (Số tiền: ${formatVND(resultStats.totalFailAmount)})\n\nBiên bản được lập tự động từ Hệ thống Quản lý Hồ sơ Người có công tỉnh Bình Dương.`;

    const blob = new Blob(["\uFEFF" + content], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Bien_ban_doi_soat_${currentFile.fileName.replace(/\.[^/.]+$/, "")}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Đã tải xuống Biên bản đối soát tài chính!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full border border-gray-300 overflow-hidden my-6">
        {/* Modal Header */}
        <div className="bg-[#3c8dbc] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <UploadCloud className="size-5 text-sky-200" />
            <div>
              <h3 className="text-base font-bold uppercase tracking-tight">
                Module Đối Soát Chi Trả Tự Động (Bank Reconciliation)
              </h3>
              <p className="text-xs text-white/90">
                Khớp nối kết quả chuyển khoản ngân hàng (Đề án 06) & Bưu điện chi trả
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-sm">
          {!resultStats ? (
            <>
              {/* Giới thiệu tính năng */}
              <div className="p-3.5 bg-sky-50 border border-sky-200 rounded text-sky-900 text-xs leading-relaxed">
                <strong>Quy trình đối soát tự động:</strong> Thay vì rà soát từng dòng thủ công
                trên giấy, cán bộ chọn file sao kê điện tử từ Ngân hàng / Bưu điện. Hệ thống sẽ tự
                động khớp mã hồ sơ, số CCCD, tài khoản và số tiền để cập nhật trạng thái chi trả và
                phát hiện các khoản tiền bị treo do tài khoản lỗi hoặc đối tượng đã từ trần.
              </div>

              {/* Chọn nguồn file đối soát */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">
                  1. Chọn đơn vị đối tác & Tệp kết quả chi trả:
                </label>
                <div className="grid grid-cols-1 gap-2.5">
                  {SAMPLE_BANK_FILES.map((f, idx) => (
                    <div
                      key={f.fileName}
                      onClick={() => setSelectedFileIdx(idx)}
                      className={`p-3 rounded border cursor-pointer transition-all flex items-center justify-between ${
                        selectedFileIdx === idx
                          ? "border-[#3c8dbc] bg-sky-50/70 shadow-xs ring-1 ring-[#3c8dbc]"
                          : "border-gray-200 hover:border-gray-300 bg-gray-50/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`size-9 rounded-full flex items-center justify-center shrink-0 ${
                            selectedFileIdx === idx
                              ? "bg-[#3c8dbc] text-white"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          <Building className="size-4" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-800 text-xs">{f.bankName}</div>
                          <div className="text-[11px] font-mono text-gray-500 flex items-center gap-1.5 mt-0.5">
                            <FileSpreadsheet className="size-3 text-emerald-600" />
                            {f.fileName}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 text-[10px] font-semibold rounded border border-gray-200">
                          {f.records.length} giao dịch
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Xem trước các giao dịch trong file */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">
                  2. Xem trước giao dịch trong tệp:
                </label>
                <div className="border border-gray-200 rounded overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-gray-100 text-gray-700 border-b border-gray-200 font-semibold">
                      <tr>
                        <th className="p-2">Mã GD</th>
                        <th className="p-2">Mã hồ sơ</th>
                        <th className="p-2 text-right">Số tiền</th>
                        <th className="p-2 text-center">Báo cáo ngân hàng</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-mono">
                      {currentFile.records.map((r) => (
                        <tr key={r.maGiaoDich} className="hover:bg-gray-50">
                          <td className="p-2 font-semibold text-gray-800">{r.maGiaoDich}</td>
                          <td className="p-2">{r.soHoSoTinh}</td>
                          <td className="p-2 text-right font-bold text-gray-900">
                            {formatVND(r.soTien)}
                          </td>
                          <td className="p-2 text-center">
                            {r.trangThai === "THÀNH_CÔNG" ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                Báo có thành công
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800">
                                Lỗi: {r.lyDoLoi}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Nút thực hiện */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded font-medium text-xs transition-colors"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleRunReconciliation}
                  className="px-5 py-2 text-white bg-[#3c8dbc] hover:bg-[#357ca5] rounded font-bold text-xs shadow-xs transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <RotateCcw className="size-4 animate-spin" />
                      Đang xử lý đối soát tự động...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="size-4" />
                      Khớp lệnh đối soát ngay
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            /* Kết quả đối soát thành công */
            <div className="space-y-4">
              <div className="text-center p-4 bg-emerald-50 border border-emerald-300 rounded-lg">
                <CheckCircle2 className="size-10 text-emerald-600 mx-auto mb-2" />
                <h4 className="text-base font-bold text-emerald-800 uppercase">
                  Đã hoàn tất đối soát tài chính
                </h4>
                <p className="text-xs text-emerald-700 mt-1">
                  Đã đối soát tệp <strong className="font-mono">{currentFile.fileName}</strong> với cơ
                  sở dữ liệu chi trả thực tế
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-emerald-50/70 p-3 rounded border border-emerald-200">
                  <div className="text-gray-600 mb-1">Giao dịch khớp thành công:</div>
                  <div className="text-xl font-bold text-emerald-700 font-mono">
                    {resultStats.successCount} / {resultStats.total}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1">
                    Tổng tiền đã chi: <strong>{formatVND(resultStats.totalSuccessAmount)}</strong>
                  </div>
                </div>

                <div className="bg-amber-50/70 p-3 rounded border border-amber-200">
                  <div className="text-gray-600 mb-1">Giao dịch thất bại / Tồn đọng:</div>
                  <div className="text-xl font-bold text-red-600 font-mono">
                    {resultStats.failCount} / {resultStats.total}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1">
                    Tiền chưa phát: <strong>{formatVND(resultStats.totalFailAmount)}</strong>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded border border-gray-200 text-xs text-gray-700">
                <strong>Hành động hệ thống đã thực thi:</strong>
                <ul className="list-disc ml-5 mt-1 space-y-0.5">
                  <li>Tự động đánh dấu trạng thái <strong>"ĐÃ CHI TRẢ"</strong> cho các bản ghi khớp.</li>
                  <li>Cập nhật ngày chi trả và mã ủy nhiệm chi (UNC) vào lịch sử người hưởng.</li>
                  <li>
                    Đánh dấu cờ <strong>"TỒN ĐỌNG"</strong> kèm lý do chi tiết cho các trường hợp
                    tài khoản lỗi hoặc đối tượng đã từ trần để cán bộ liên hệ xác minh.
                  </li>
                </ul>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleExportReport}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded font-semibold text-xs flex items-center gap-1.5 border border-gray-300"
                >
                  <Download className="size-3.5" />
                  Xuất biên bản đối soát (.TXT)
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-xs"
                >
                  Đóng & Cập nhật danh sách
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
