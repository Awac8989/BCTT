import { useState } from "react";
import { X, Printer, QrCode, CheckCircle, Clock, FileText, Phone, MapPin, User } from "lucide-react";
import type { HoSo } from "@/data/mock";

interface GiayHenModalProps {
  hoSo: HoSo;
  onClose: () => void;
}

export function GiayHenModal({ hoSo, onClose }: GiayHenModalProps) {
  const [ngayTiepNhan] = useState("05/09/2026");
  const [ngayHenTra] = useState("20/09/2026"); // 15 ngày làm việc

  // Đường link công dân quét mã QR để đánh giá dịch vụ công
  const maSo = hoSo.soHoSoTinh || hoSo.id;
  const surveyUrl = typeof window !== "undefined"
    ? `${window.location.origin}/khao-sat?maHoSo=${encodeURIComponent(maSo)}&kenh=QR_PHIEU_HEN`
    : `/khao-sat?maHoSo=${maSo}&kenh=QR_PHIEU_HEN`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white text-[#111827] rounded-lg shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col border border-gray-300">
        {/* Modal Top Bar (Sẽ ẩn khi bấm in) */}
        <div className="flex items-center justify-between px-6 py-3 border-b bg-gray-50 rounded-t-lg no-print">
          <div className="flex items-center gap-2">
            <FileText className="size-5 text-[#dd4b39]" />
            <h3 className="font-bold text-base text-gray-800">
              Giấy tiếp nhận hồ sơ và Hẹn trả kết quả (Kèm Mã QR Đánh giá)
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#00a65a] hover:bg-[#008d4c] text-white text-xs font-semibold rounded shadow-xs transition-colors"
            >
              <Printer className="size-4" />
              In giấy hẹn (Ctrl+P)
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-200 text-gray-500 rounded transition-colors"
              title="Đóng"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Nội dung Mẫu Giấy Tiếp Nhận & Hẹn Trả Kết Quả Chuẩn Nghị định 61/2018/NĐ-CP */}
        <div className="p-8 overflow-y-auto font-serif text-[13px] leading-relaxed select-text" id="giay-hen-content">
          {/* Quốc hiệu & Đơn vị tiếp nhận */}
          <div className="grid grid-cols-2 text-center pb-4 border-b border-gray-400">
            <div>
              <div className="font-bold uppercase text-[12px]">UBND TỈNH BÌNH DƯƠNG</div>
              <div className="font-bold uppercase text-[13px] text-[#b91c1c]">SỞ LAO ĐỘNG - THƯƠNG BINH VÀ XÃ HỘI</div>
              <div className="text-[11px] font-sans font-medium text-gray-700">Bộ phận Tiếp nhận và Trả kết quả (Một cửa)</div>
              <div className="text-[11px] font-sans italic mt-1">Số hồ sơ: <span className="font-mono font-bold text-black">{hoSo.soHoSoTinh || hoSo.id}</span></div>
            </div>
            <div>
              <div className="font-bold uppercase text-[12px]">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
              <div className="font-bold text-[13px]">Độc lập - Tự do - Hạnh phúc</div>
              <div className="text-[11px] italic font-sans mt-2">Thủ Dầu Một, ngày {ngayTiepNhan.split('/')[0]} tháng {ngayTiepNhan.split('/')[1]} năm {ngayTiepNhan.split('/')[2]}</div>
            </div>
          </div>

          {/* Tiêu đề giấy hẹn */}
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
                <span className="text-gray-600">Bộ phận tiếp nhận:</span>{" "}
                <strong className="text-gray-900">Một cửa Phòng LĐTBXH TP. Thủ Dầu Một</strong>
              </div>
              <div>
                <span className="text-gray-600">Mã quản lý Tỉnh:</span>{" "}
                <strong className="text-gray-900 font-mono">{hoSo.soHoSoTinh || hoSo.id}</strong>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-gray-600">Họ và tên người có công / Liệt sĩ:</span>{" "}
                <strong className="text-[#b91c1c] text-sm uppercase">{hoSo.hoTen}</strong>
              </div>
              <div>
                <span className="text-gray-600">Đối tượng:</span>{" "}
                <strong className="text-gray-900">{hoSo.loaiDoiTuong}</strong>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-gray-600">Số CCCD / Định danh:</span>{" "}
                <strong className="font-mono text-gray-900">{hoSo.cccd}</strong>
              </div>
              <div>
                <span className="text-gray-600">Số thẻ BHYT:</span>{" "}
                <strong className="font-mono text-gray-900">{hoSo.soBhyt || "Đang cấp đổi"}</strong>
              </div>
            </div>

            <div>
              <span className="text-gray-600">Địa chỉ thường trú / Quê quán:</span>{" "}
              <span className="text-gray-900 font-medium">{hoSo.queQuan || hoSo.truQuan || hoSo.diaChiTiepNhan || "Thủ Dầu Một, Bình Dương"}</span>
            </div>

            <div>
              <span className="text-gray-600">Thủ tục hành chính yêu cầu:</span>{" "}
              <strong className="text-gray-900">
                {hoSo.loaiDoiTuong.includes("Liệt sĩ")
                  ? "Xác nhận & thực hiện chính sách trợ cấp ưu đãi thân nhân Liệt sĩ theo Nghị định 131/2021/NĐ-CP"
                  : "Giám định thương tật & giải quyết chế độ trợ cấp ưu đãi Người có công"}
              </strong>
            </div>
          </div>

          {/* Thành phần hồ sơ đã nộp */}
          <div className="mb-4">
            <div className="font-bold text-xs uppercase mb-1.5 text-gray-800 font-sans">
              1. Thành phần hồ sơ tiếp nhận gồm:
            </div>
            <table className="w-full text-xs font-sans border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="border border-gray-300 p-1.5 w-10 text-center">STT</th>
                  <th className="border border-gray-300 p-1.5 text-left">Tên loại giấy tờ, văn bản</th>
                  <th className="border border-gray-300 p-1.5 w-24 text-center">Số lượng</th>
                  <th className="border border-gray-300 p-1.5 w-28 text-center">Bản chính / Sao</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-1.5 text-center">1</td>
                  <td className="border border-gray-300 p-1.5">Đơn đề nghị hưởng chế độ chính sách người có công (Mẫu số 01)</td>
                  <td className="border border-gray-300 p-1.5 text-center">01 bản</td>
                  <td className="border border-gray-300 p-1.5 text-center font-medium text-blue-700">Bản chính</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-1.5 text-center">2</td>
                  <td className="border border-gray-300 p-1.5">Bằng Tổ quốc ghi công / Giấy báo tử / Biên bản vết thương</td>
                  <td className="border border-gray-300 p-1.5 text-center">01 bản</td>
                  <td className="border border-gray-300 p-1.5 text-center font-medium text-emerald-700">Bản gốc kiểm tra</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-1.5 text-center">3</td>
                  <td className="border border-gray-300 p-1.5">Bản sao CCCD và Giấy xác nhận thông tin cư trú (Đề án 06)</td>
                  <td className="border border-gray-300 p-1.5 text-center">01 bản</td>
                  <td className="border border-gray-300 p-1.5 text-center">Đối chiếu VNeID</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Thời gian hẹn trả kết quả */}
          <div className="grid grid-cols-2 gap-4 border border-dashed border-gray-400 p-3 rounded bg-amber-50/50 mb-5 font-sans">
            <div>
              <div className="text-xs text-gray-600">Thời gian tiếp nhận hồ sơ:</div>
              <div className="text-sm font-bold text-gray-800">{ngayTiepNhan} (Giờ hành chính)</div>
            </div>
            <div>
              <div className="text-xs text-[#b91c1c] font-bold">Thời gian hẹn trả kết quả giải quyết:</div>
              <div className="text-sm font-extrabold text-[#b91c1c]">{ngayHenTra} (Trước 17h00)</div>
              <div className="text-[11px] text-gray-500 italic">Địa điểm: Bộ phận Một cửa - UBND TP. Thủ Dầu Một</div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* KHỐI MÃ QR CODE ĐÁNH GIÁ SỰ HÀI LÒNG CỦA CÔNG DÂN (ĐIỂM TRỌNG TÂM)       */}
          {/* ========================================================================= */}
          <div className="border-2 border-[#dd4b39] rounded-lg p-4 bg-red-50/40 my-6 font-sans">
            <div className="flex items-center gap-4">
              {/* Mô phỏng hình ảnh Mã QR lớn sắc nét */}
              <div className="size-28 bg-white border-2 border-gray-800 rounded p-1.5 shrink-0 shadow-xs flex flex-col items-center justify-center">
                <div className="size-full bg-contain bg-center bg-no-repeat relative flex items-center justify-center">
                  <QrCode className="size-22 text-gray-900" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-[#dd4b39] text-white text-[8px] font-bold px-1 rounded">DVC</div>
                  </div>
                </div>
              </div>

              {/* Hướng dẫn người dân quét mã */}
              <div className="flex-1 text-xs">
                <div className="font-bold text-sm text-[#b91c1c] flex items-center gap-1.5">
                  <CheckCircle className="size-4 text-[#b91c1c]" />
                  QUÉT MÃ QR ĐỂ ĐÁNH GIÁ SỰ HÀI LÒNG CỦA CÔNG DÂN
                </div>
                <div className="text-gray-700 mt-1 leading-relaxed">
                  Để nâng cao chất lượng phục vụ Người có công, kính mời Bác/Cô/Chú/Anh/Chị sử dụng ứng dụng <strong>Zalo</strong> hoặc <strong>Camera điện thoại</strong> quét mã QR bên cạnh để đánh giá về:
                </div>
                <ul className="list-disc list-inside text-gray-800 mt-1 space-y-0.5 font-medium text-[11px]">
                  <li>Thái độ phục vụ và tinh thần trách nhiệm của cán bộ tiếp nhận</li>
                  <li>Thời gian giải quyết và tính công khai, minh bạch của thủ tục</li>
                </ul>
                <div className="text-[10px] text-gray-500 italic mt-1">
                  Đường dẫn trực tiếp: <span className="font-mono text-blue-700 underline">{surveyUrl}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chữ ký hai bên */}
          <div className="grid grid-cols-2 text-center pt-3 font-sans">
            <div>
              <div className="font-bold text-xs uppercase text-gray-800">NGƯỜI NỘP HỒ SƠ</div>
              <div className="text-[11px] italic text-gray-500">(Ký và ghi rõ họ tên)</div>
              <div className="h-20" />
              <div className="font-semibold text-xs text-gray-800">{hoSo.hoTen}</div>
            </div>
            <div>
              <div className="font-bold text-xs uppercase text-gray-800">CÁN BỘ TIẾP NHẬN HỒ SƠ</div>
              <div className="text-[11px] italic text-gray-500">(Ký, đóng dấu chức danh)</div>
              <div className="h-20 flex items-center justify-center text-gray-400 italic text-[11px]">
                (Đã ký điện tử Một cửa)
              </div>
              <div className="font-bold text-xs text-gray-900">Nguyễn Văn An</div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t bg-gray-50 rounded-b-lg no-print">
          <span className="text-xs text-gray-500 font-sans">
            Mẫu số 01/DVC · Hệ thống CSDL Người có công Bình Dương
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-[#dd4b39] hover:bg-[#c23321] text-white text-xs font-bold rounded shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Printer className="size-4" />
              In giấy hẹn cho công dân
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-semibold rounded transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
