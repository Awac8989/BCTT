import { useState } from "react";
import {
  X,
  Printer,
  FileText,
  CheckCircle2,
  Calendar,
  Building,
  Users,
  AlertCircle,
  Eye,
  Clock,
  Send,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { type HoSo } from "@/data/mock";
import { DigitalSignatureBadge } from "@/components/DigitalSignatureBadge";
import { appStore } from "@/services/app-state";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  hoSo: HoSo | null;
  onCompleteNiemYet?: () => void;
}

export function BienBanNiemYetModal({ isOpen, onClose, hoSo, onCompleteNiemYet }: Props) {
  const [activeForm, setActiveForm] = useState<"THONG_BAO" | "BIEN_BAN">("BIEN_BAN");
  const [soNgayDaNiemYet, setSoNgayDaNiemYet] = useState(15);
  const [soYKienPhanAnh, setSoYKienPhanAnh] = useState(0);
  const [yKienGhiNhan, setYKienGhiNhan] = useState("Nhân dân khu phố hoàn toàn đồng thuận, không có khiếu nại, tố cáo.");

  if (!isOpen || !hoSo) return null;

  const now = new Date();
  const namHienTai = now.getFullYear();
  const soThongBao = `TB-UBND/${namHienTai}/${hoSo.id.replace(/\D/g, "").slice(-3) || "042"}`;
  const soBienBan = `BB-UBND/${namHienTai}/${hoSo.id.replace(/\D/g, "").slice(-3) || "042"}`;

  // Thời gian niêm yết 15 ngày theo quy định
  const ngayBatDau = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);
  const ngayKetThuc = now;

  const handlePrint = () => {
    window.print();
  };

  const handleXacNhanHoanThanh = () => {
    appStore.updateProfileStatus(
      hoSo.id,
      "ĐANG_THẨM_ĐỊNH",
      `Đã hoàn thành niêm yết công khai 15 ngày tại UBND Phường Phú Cường và Nhà văn hóa Khu phố theo Biên bản số ${soBienBan}. Không có đơn thư phản ánh.`,
    );
    toast.success("Đã hoàn tất thủ tục niêm yết công khai 15 ngày!", {
      description: `Hồ sơ ${hoSo.hoTen} đã đủ điều kiện chuyển sang bước Lập Tờ trình đề nghị cấp Huyện.`,
    });
    if (onCompleteNiemYet) onCompleteNiemYet();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-md shadow-2xl max-w-4xl w-full border border-gray-300 overflow-hidden my-4 text-[#222]">
        {/* HEADER ĐIỀU KHIỂN (Ẩn khi in) */}
        <div className="no-print bg-[#00a65a] text-white px-5 py-3 flex flex-wrap items-center justify-between gap-2 border-b border-emerald-800">
          <div className="flex items-center gap-2">
            <FileText className="size-5" />
            <div>
              <div className="font-bold text-sm uppercase">
                Quy trình Niêm yết Công khai 15 ngày tại Cơ sở (Cấp Xã/Phường)
              </div>
              <div className="text-[11px] text-emerald-100">
                Theo Điều 13, 24, 38 Nghị định số 131/2021/NĐ-CP của Chính phủ quy định chi tiết Pháp lệnh Ưu đãi người có công
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white text-emerald-800 hover:bg-emerald-50 text-xs font-bold shadow-xs cursor-pointer"
            >
              <Printer className="size-3.5" />
              <span>In Biên bản (A4)</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded p-1 text-white hover:bg-white/20"
              title="Đóng cửa sổ"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* THANH CHỌN BIỂU MẪU & TIẾN ĐỘ 15 NGÀY (Ẩn khi in) */}
        <div className="no-print bg-emerald-50/70 border-b border-emerald-200 px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveForm("THONG_BAO")}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                activeForm === "THONG_BAO"
                  ? "bg-[#00a65a] text-white shadow-xs"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
              }`}
            >
              1. Thông báo Niêm yết công khai (Mẫu 15)
            </button>
            <button
              type="button"
              onClick={() => setActiveForm("BIEN_BAN")}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                activeForm === "BIEN_BAN"
                  ? "bg-[#00a65a] text-white shadow-xs"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
              }`}
            >
              2. Biên bản Kết thúc Niêm yết 15 ngày
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-emerald-900 font-semibold">
              <Clock className="size-4 text-emerald-600" />
              <span>Thời hạn niêm yết:</span>
              <span className="font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-mono">
                {soNgayDaNiemYet}/15 ngày (Đạt yêu cầu)
              </span>
            </div>
            <button
              type="button"
              onClick={handleXacNhanHoanThanh}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#dd4b39] hover:bg-[#c23321] text-white font-bold shadow-xs cursor-pointer text-xs"
            >
              <CheckCircle2 className="size-3.5" />
              <span>Xác nhận kết thúc 15 ngày &amp; Trình duyệt</span>
            </button>
          </div>
        </div>

        {/* NỘI DUNG VĂN BẢN CHUẨN THỂ THỨC HÀNH CHÍNH (A4) */}
        <div className="p-8 sm:p-12 font-serif text-[13px] leading-relaxed text-[#111] bg-white print:p-6">
          {/* QUỐC HUY / TIÊU NGỮ */}
          <div className="grid grid-cols-2 gap-4 border-b pb-4 mb-6 font-sans">
            <div className="text-center">
              <div className="font-bold text-[12px] uppercase">ỦY BAN NHÂN DÂN PHƯỜNG PHÚ CƯỜNG</div>
              <div className="font-bold text-[11px] text-gray-700 uppercase">HỘI ĐỒNG XÉT DUYỆT CHÍNH SÁCH NCC</div>
              <div className="text-[11px] text-gray-600 mt-1 font-mono">
                Số: {activeForm === "THONG_BAO" ? soThongBao : soBienBan}
              </div>
            </div>

            <div className="text-center">
              <div className="font-bold text-[12px] uppercase">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
              <div className="font-bold text-[12px] underline">Độc lập - Tự do - Hạnh phúc</div>
              <div className="text-[11px] italic text-gray-600 mt-1">
                Phú Cường, ngày {now.getDate()} tháng {now.getMonth() + 1} năm {namHienTai}
              </div>
            </div>
          </div>

          {/* DẠNG 1: THÔNG BÁO NIÊM YẾT CÔNG KHAI */}
          {activeForm === "THONG_BAO" && (
            <div className="space-y-4">
              <div className="text-center my-4 font-sans">
                <h2 className="text-base font-bold uppercase tracking-wide">
                  THÔNG BÁO
                </h2>
                <div className="font-bold text-sm uppercase text-emerald-900 mt-1">
                  Về việc niêm yết công khai danh sách đề nghị xác nhận người có công với cách mạng
                </div>
                <div className="text-xs italic text-gray-600 mt-0.5">
                  (Căn cứ Nghị định số 131/2021/NĐ-CP ngày 30/12/2021 của Chính phủ)
                </div>
              </div>

              <p className="indent-6 text-justify">
                Thực hiện quy định tại Pháp lệnh Ưu đãi người có công với cách mạng và Nghị định số 131/2021/NĐ-CP của Chính phủ quy định chi tiết và biện pháp thi hành Pháp lệnh;
              </p>

              <p className="indent-6 text-justify">
                Ủy ban nhân dân Phường Phú Cường thông báo về việc niêm yết công khai hồ sơ đề nghị công nhận và giải quyết chế độ ưu đãi người có công với cách mạng đối với trường hợp sau:
              </p>

              <div className="my-4 border border-gray-300 rounded overflow-hidden font-sans text-xs">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-100 font-bold border-b border-gray-300">
                    <tr>
                      <th className="p-2.5 text-center w-10">STT</th>
                      <th className="p-2.5">Họ và tên</th>
                      <th className="p-2.5">Năm sinh / CCCD</th>
                      <th className="p-2.5">Nơi cư trú</th>
                      <th className="p-2.5">Diện đối tượng đề nghị</th>
                      <th className="p-2.5 text-center">Tỷ lệ tổn thương</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2.5 text-center font-mono font-bold">1</td>
                      <td className="p-2.5 font-bold uppercase">{hoSo.hoTen}</td>
                      <td className="p-2.5 font-mono">{hoSo.namSinh} · {hoSo.cccd}</td>
                      <td className="p-2.5">{hoSo.phuong}, {hoSo.huyen}, tỉnh Bình Dương</td>
                      <td className="p-2.5 font-semibold text-emerald-800">{hoSo.loaiDoiTuong}</td>
                      <td className="p-2.5 text-center font-mono font-bold text-red-700">
                        {hoSo.tyLeThuongTat > 0 ? `${hoSo.tyLeThuongTat}%` : "Liệt sĩ"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="space-y-2">
                <p>
                  <strong>1. Thời gian niêm yết:</strong> 15 ngày liên tục, kể từ ngày <strong>{ngayBatDau.toLocaleDateString("vi-VN")}</strong> đến hết ngày <strong>{ngayKetThuc.toLocaleDateString("vi-VN")}</strong>.
                </p>
                <p>
                  <strong>2. Địa điểm niêm yết:</strong>
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Bảng tin công khai Trụ sở UBND Phường Phú Cường (Số 01 đường Yersin, Phường Phú Cường).</li>
                  <li>Bảng thông tin Nhà văn hóa Khu phố nơi công dân cư trú.</li>
                  <li>Cổng thông tin điện tử UBND Phường Phú Cường.</li>
                </ul>
                <p>
                  <strong>3. Tiếp nhận ý kiến đóng góp:</strong>
                </p>
                <p className="indent-6 text-justify">
                  Trong thời gian niêm yết 15 ngày, các tổ chức, đoàn thể và nhân dân trên địa bàn nếu phát hiện hồ sơ có vấn đề chưa rõ ràng, khai man, giả mạo thời gian hoạt động cách mạng hoặc mạo nhận danh nghĩa người có công xin gửi ý kiến bằng văn bản về Ủy ban nhân dân phường Phú Cường (qua Cán bộ phụ trách Lao động - Thương binh và Xã hội) để kiểm tra, xác minh theo quy định của pháp luật.
                </p>
              </div>

              {/* CHỮ KÝ */}
              <div className="grid grid-cols-2 gap-4 mt-8 pt-4 font-sans">
                <div className="text-left text-xs">
                  <div className="font-bold">Nơi nhận:</div>
                  <div className="text-[11px] text-gray-600 mt-1 space-y-0.5">
                    <div>- Phòng LĐ-TB&amp;XH TP. Thủ Dầu Một (b/c);</div>
                    <div>- Ban Thường trực UB MTTQ Phường;</div>
                    <div>- Ban điều hành Khu phố;</div>
                    <div>- Lưu: VT, LĐTBXH.</div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="font-bold uppercase text-xs">TM. ỦY BAN NHÂN DÂN PHƯỜNG PHÚ CƯỜNG</div>
                  <div className="font-bold text-xs uppercase text-emerald-800">CHỦ TỊCH</div>
                  <div className="my-2">
                    <DigitalSignatureBadge
                      nguoiKy="Trần Văn Nam"
                      chucVu="Chủ tịch UBND Phường Phú Cường"
                    />
                  </div>
                  <div className="font-bold text-xs">Trần Văn Nam</div>
                </div>
              </div>
            </div>
          )}

          {/* DẠNG 2: BIÊN BẢN KẾT THÚC NIÊM YẾT CÔNG KHAI 15 NGÀY */}
          {activeForm === "BIEN_BAN" && (
            <div className="space-y-4">
              <div className="text-center my-4 font-sans">
                <h2 className="text-base font-bold uppercase tracking-wide">
                  BIÊN BẢN KẾT THÚC NIÊM YẾT CÔNG KHAI
                </h2>
                <div className="font-bold text-xs uppercase text-emerald-900 mt-1">
                  Về việc lấy ý kiến nhân dân đối với hồ sơ đề nghị hưởng chế độ ưu đãi người có công
                </div>
                <div className="text-xs italic text-gray-600 mt-0.5">
                  (Lập hồi 17 giờ 00 phút, ngày {now.getDate()} tháng {now.getMonth() + 1} năm {namHienTai})
                </div>
              </div>

              <p className="indent-6 text-justify">
                Hôm nay, vào hồi 17 giờ 00 phút ngày {now.toLocaleDateString("vi-VN")}, tại Trụ sở Ủy ban nhân dân Phường Phú Cường, thành phố Thủ Dầu Một, tỉnh Bình Dương; Hội đồng xét duyệt chính sách người có công Phường Phú Cường tiến hành lập biên bản kết thúc thời hạn 15 ngày niêm yết công khai hồ sơ đề nghị công nhận người có công đối với ông/bà <strong>{hoSo.hoTen}</strong>.
              </p>

              <div className="space-y-2">
                <div className="font-bold font-sans text-xs uppercase text-gray-800">I. THÀNH PHẦN THAM DỰ:</div>
                <ol className="list-decimal pl-6 space-y-1 font-sans text-xs">
                  <li><strong>Ông Trần Văn Nam</strong> - Chủ tịch UBND Phường Phú Cường - Chủ trì.</li>
                  <li><strong>Bà Nguyễn Thị Lan</strong> - Chủ tịch Ủy ban MTTQ Việt Nam Phường Phú Cường.</li>
                  <li><strong>Ông Lê Văn Hải</strong> - Trưởng ban điều hành Khu phố nơi công dân cư trú.</li>
                  <li><strong>Ông Đoàn Minh Quân</strong> - Công chức Lao động - Thương binh &amp; Xã hội Phường - Thư ký.</li>
                </ol>
              </div>

              <div className="space-y-2">
                <div className="font-bold font-sans text-xs uppercase text-gray-800">II. NỘI DUNG VÀ KẾT QUẢ NIÊM YẾT CÔNG KHAI:</div>
                <p className="indent-6 text-justify">
                  1. Căn cứ Thông báo số {soThongBao} của UBND Phường Phú Cường, danh sách và hồ sơ của ông/bà <strong>{hoSo.hoTen}</strong> (Sinh năm: {hoSo.namSinh}, Số CCCD: {hoSo.cccd}, diện đối tượng: <strong>{hoSo.loaiDoiTuong}</strong>) đã được niêm yết công khai đầy đủ, đúng vị trí quy định trong thời gian liên tục <strong>15 ngày</strong> (từ ngày {ngayBatDau.toLocaleDateString("vi-VN")} đến ngày {ngayKetThuc.toLocaleDateString("vi-VN")}).
                </p>
                <p className="indent-6 text-justify">
                  2. Trong suốt thời gian niêm yết công khai 15 ngày, UBND Phường Phú Cường và Ban điều hành Khu phố <strong>không nhận được bất kỳ đơn thư khiếu nại, tố cáo, phản ánh hay kiến nghị nào</strong> của tổ chức, cá nhân và nhân dân đối với trường hợp của ông/bà {hoSo.hoTen}.
                </p>
                <div className="bg-emerald-50 border border-emerald-300 rounded p-3 text-xs font-sans text-emerald-950">
                  <div className="font-bold flex items-center gap-1.5 text-emerald-800 mb-1">
                    <CheckCircle2 className="size-4" />
                    <span>Ý KIẾN ĐỒNG THUẬN CỦA HỘI ĐỒNG XÉT DUYỆT CƠ SỞ:</span>
                  </div>
                  <div>
                    {yKienGhiNhan} Toàn thể các thành viên Hội đồng tham dự nhất trí 100% hồ sơ hoàn toàn trung thực, đủ điều kiện pháp lý để UBND Phường Phú Cường ban hành Tờ trình đề nghị UBND thành phố Thủ Dầu Một (Phòng LĐ-TB&amp;XH) thẩm định và trình Sở Lao động - TB&amp;XH tỉnh Bình Dương ban hành Quyết định hưởng trợ cấp ưu đãi theo quy định.
                  </div>
                </div>
              </div>

              <p className="indent-6 text-justify">
                Biên bản được thông qua trước toàn thể các thành viên tham dự, tất cả đều nhất trí ký tên và lập thành 04 bản có giá trị pháp lý như nhau (01 bản lưu UBND phường, 01 bản gửi kèm hồ sơ trình cấp Huyện, 01 bản lưu MTTQ, 01 bản lưu Khu phố).
              </p>

              {/* 4 CHỮ KÝ PHÁP LÝ HÀNH CHÍNH */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-4 font-sans text-center text-xs">
                <div>
                  <div className="font-bold uppercase">THƯ KÝ LẬP BIÊN BẢN</div>
                  <div className="text-[10px] italic text-gray-500">(Ký và ghi rõ họ tên)</div>
                  <div className="h-16 flex items-end justify-center font-bold text-gray-800">
                    Đoàn Minh Quân
                  </div>
                </div>

                <div>
                  <div className="font-bold uppercase">TRƯỞNG BAN KHU PHỐ</div>
                  <div className="text-[10px] italic text-gray-500">(Ký và ghi rõ họ tên)</div>
                  <div className="h-16 flex items-end justify-center font-bold text-gray-800">
                    Lê Văn Hải
                  </div>
                </div>

                <div>
                  <div className="font-bold uppercase">CHỦ TỊCH UB MTTQ PHƯỜNG</div>
                  <div className="text-[10px] italic text-gray-500">(Ký và ghi rõ họ tên)</div>
                  <div className="h-16 flex items-end justify-center font-bold text-gray-800">
                    Nguyễn Thị Lan
                  </div>
                </div>

                <div>
                  <div className="font-bold uppercase text-emerald-900">CHỦ TỊCH UBND PHƯỜNG</div>
                  <div className="text-[10px] italic text-gray-500">(Ký số &amp; đóng dấu đỏ)</div>
                  <div className="my-1">
                    <DigitalSignatureBadge
                      nguoiKy="Trần Văn Nam"
                      chucVu="Chủ tịch UBND Phường Phú Cường"
                    />
                  </div>
                  <div className="font-bold text-gray-900">Trần Văn Nam</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

