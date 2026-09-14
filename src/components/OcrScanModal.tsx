import { useState } from "react";
import {
  X,
  Scan,
  Sparkles,
  FileText,
  CheckCircle2,
  Image as ImageIcon,
  ArrowRight,
  Zap,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";

interface OcrScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyData?: (extractedData: Record<string, any>) => void;
}

const SAMPLE_DOCS = [
  {
    id: "DOC-01",
    title: "Bằng Tổ quốc ghi công - Liệt sĩ Hồ Văn Lên",
    loai: "Bằng Tổ quốc ghi công",
    namCap: "1977",
    previewText: "Cộng hòa Xã hội Chủ nghĩa Việt Nam - Thủ tướng Chính phủ cấp Bằng Tổ quốc ghi công cho Liệt sĩ Hồ Văn Lên...",
    extracted: {
      hoTen: "Hồ Văn Lên",
      biDanh: "Bảy Lên",
      namSinh: "1926",
      queQuan: "Xã Chánh Hiệp, Châu Thành, Thủ Dầu Một, Sông Bé",
      ngayHySinh: "07/1949",
      thoiKy: "Kháng Pháp (từ 19/08/1945 - 20/07/1954)",
      soBangToQuocGhiCong: "GC887K",
      qdCapBangSo: "1312TTga",
      chucVu: "Ủy viên Ban tuyên huấn tỉnh",
      coQuanDonViKhiHySinh: "Ban Tuyên giáo tỉnh Sông Bé",
      loaiDoiTuong: "Thân nhân liệt sĩ",
    },
  },
  {
    id: "DOC-02",
    title: "Giấy báo tử Liệt sĩ số 239/07 - Ban Tuyên giáo",
    loai: "Giấy báo tử",
    namCap: "1977",
    previewText: "Giấy báo tử đồng chí hy sinh trên đường đi công tác về đơn vị bị địch càn quét bắn hy sinh tại An Mỹ...",
    extracted: {
      hoTen: "Hồ Văn Lên",
      giayBaoTu: "239/07",
      donViCapGiayBaoTu: "Ban Tuyên giáo tỉnh Sông Bé",
      noiHySinh: "An Mỹ, Châu Thành",
      truongHopHySinh: "Trên đường đi công tác về đơn vị bị địch càn quét bắn đồng chí hy sinh",
    },
  },
  {
    id: "DOC-03",
    title: "Biên bản Giám định Y khoa Thương tật 61%",
    loai: "Biên bản giám định thương tật",
    namCap: "2018",
    previewText: "Hội đồng Giám định Y khoa tỉnh Bình Dương kết luận tỷ lệ tổn thương cơ thể do vết thương chiến tranh...",
    extracted: {
      hoTen: "Nguyễn Văn Thành",
      loaiDoiTuong: "Thương binh",
      tyLeTonThuong: 61,
      mucTroCap: 5404650,
      phuCapPhucVu: 0,
      ghiChuThamDinh: "Vết thương xuyên thấu cẳng chân phải, cắt cụt 1/3 dưới cẳng chân. Tỷ lệ suy giảm KNLĐ 61%.",
    },
  },
];

export function OcrScanModal({ isOpen, onClose, onApplyData }: OcrScanModalProps) {
  const [selectedDocIdx, setSelectedDocIdx] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanCompleted, setScanCompleted] = useState(false);

  if (!isOpen) return null;

  const currentDoc = SAMPLE_DOCS[selectedDocIdx]!;

  const handleStartScan = () => {
    setIsScanning(true);
    setScanCompleted(false);

    setTimeout(() => {
      setIsScanning(false);
      setScanCompleted(true);
      toast.success("AI OCR đã trích xuất thành công toàn bộ thông tin từ tài liệu!");
    }, 1200);
  };

  const handleApply = () => {
    if (onApplyData) {
      onApplyData(currentDoc.extracted);
      toast.success("Đã tự động điền các trường thông tin vào hồ sơ!");
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full border border-gray-300 overflow-hidden my-6">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-violet-700 via-indigo-700 to-blue-700 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles className="size-4 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-bold uppercase tracking-tight flex items-center gap-2">
                Trích Xuất Dữ Liệu Tự Động Bằng AI / OCR Số Hóa
                <span className="px-2 py-0.5 bg-amber-400 text-slate-900 text-[10px] font-black rounded uppercase">
                  Đề án 06
                </span>
              </h3>
              <p className="text-xs text-white/90">
                Nhận dạng ảnh scan Bằng Tổ quốc ghi công & Giấy báo tử cũ thời kháng chiến
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
          {/* Giới thiệu */}
          <div className="p-3 bg-violet-50 border border-violet-200 rounded text-violet-900 text-xs leading-relaxed flex items-start gap-2.5">
            <Zap className="size-4 text-violet-600 shrink-0 mt-0.5" />
            <div>
              <strong>Điểm nhấn công nghệ trong đồ án:</strong> Tài liệu kháng chiến cũ (thập niên
              1950 - 1975) thường bị ố vàng, mờ nét. Công nghệ OCR chuyên dụng phân tích và trích
              xuất tự động các trường: Họ tên, Năm sinh, Đơn vị, Ngày hy sinh, Số quyết định... giúp
              tiết kiệm 90% thời gian nhập liệu thủ công của cán bộ Một cửa.
            </div>
          </div>

          {/* Chọn tài liệu scan mẫu */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">
              1. Chọn tài liệu scan lịch sử để thử nghiệm nhận dạng:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {SAMPLE_DOCS.map((doc, idx) => (
                <div
                  key={doc.id}
                  onClick={() => {
                    setSelectedDocIdx(idx);
                    setScanCompleted(false);
                  }}
                  className={`p-3 rounded border cursor-pointer transition-all ${
                    selectedDocIdx === idx
                      ? "border-violet-600 bg-violet-50/60 shadow-xs ring-1 ring-violet-600"
                      : "border-gray-200 hover:border-gray-300 bg-gray-50/50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="size-3.5 text-violet-600" />
                    <span className="font-bold text-xs text-gray-800 line-clamp-1">{doc.loai}</span>
                  </div>
                  <div className="text-[11px] text-gray-600 line-clamp-2">{doc.title}</div>
                  <div className="text-[10px] text-gray-400 font-mono mt-1">Năm cấp: {doc.namCap}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Khung mô phỏng quét OCR */}
          <div className="border border-gray-300 rounded-lg p-4 bg-slate-900 text-white relative overflow-hidden">
            {isScanning && (
              <div className="absolute inset-0 bg-violet-900/40 z-10 flex flex-col items-center justify-center">
                {/* Laser scan bar animation */}
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />
                <div className="text-cyan-300 font-mono text-xs font-bold mt-3 flex items-center gap-2">
                  <RotateCcw className="size-4 animate-spin" />
                  Đang phân tích mẫu ký tự quang học (OCR) & Nhận diện ngữ nghĩa AI...
                </div>
              </div>
            )}

            <div className="flex items-center justify-between border-b border-slate-700 pb-2 mb-3 text-xs text-slate-300">
              <span className="flex items-center gap-1.5 font-semibold text-amber-300">
                <ImageIcon className="size-3.5" />
                Tệp scan: {currentDoc.title}
              </span>
              <span className="font-mono text-[11px] text-slate-400">Độ phân giải: 300 DPI · Màu 24-bit</span>
            </div>

            <div className="bg-amber-100/90 text-slate-900 p-4 rounded font-serif text-xs border border-amber-300 relative shadow-inner min-h-[90px]">
              <div className="text-center font-bold uppercase text-[11px] text-red-700 mb-1">
                {currentDoc.loai.toUpperCase()}
              </div>
              <p className="italic text-[11px] leading-relaxed line-clamp-3">"{currentDoc.previewText}"</p>
              <div className="text-[10px] text-gray-500 mt-2 text-right">
                Tài liệu lưu trữ · Sở LĐTBXH Bình Dương
              </div>
            </div>

            {/* Nút trigger quét */}
            <div className="mt-3 flex items-center justify-between pt-2">
              <div className="text-xs text-slate-400">
                {scanCompleted ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="size-3.5" />
                    Độ tin cậy nhận diện: 98.6% (Đạt tiêu chuẩn số hóa)
                  </span>
                ) : (
                  "Nhấn nút để chạy thuật toán nhận dạng"
                )}
              </div>
              <button
                type="button"
                disabled={isScanning}
                onClick={handleStartScan}
                className="px-4 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors disabled:opacity-50"
              >
                <Scan className="size-3.5" />
                {scanCompleted ? "Quét lại" : "Khởi chạy OCR AI"}
              </button>
            </div>
          </div>

          {/* Kết quả trích xuất JSON có cấu trúc */}
          {scanCompleted && (
            <div className="border border-emerald-300 rounded-lg p-3.5 bg-emerald-50/50">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-xs uppercase text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-emerald-600" />
                  Dữ liệu trích xuất thành công sẵn sàng điền form:
                </h4>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-200 text-emerald-900 rounded font-bold">
                  {Object.keys(currentDoc.extracted).length} trường dữ liệu
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {Object.entries(currentDoc.extracted).map(([key, val]) => (
                  <div key={key} className="bg-white p-2 rounded border border-emerald-200">
                    <span className="text-gray-500 block text-[10px] font-mono">{key}:</span>
                    <span className="font-bold text-gray-800 line-clamp-1">{String(val)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded font-medium text-xs transition-colors"
            >
              Hủy
            </button>
            <button
              type="button"
              disabled={!scanCompleted}
              onClick={handleApply}
              className="px-5 py-2 text-white bg-violet-700 hover:bg-violet-800 rounded font-bold text-xs shadow-xs transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="size-4 text-amber-300" />
              Tự động điền dữ liệu vào biểu mẫu hồ sơ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
