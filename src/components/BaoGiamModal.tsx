import { useState } from "react";
import {
  X,
  FileText,
  AlertTriangle,
  Printer,
  CheckCircle2,
  Calendar,
  User,
  Phone,
  MapPin,
  FileCheck2,
} from "lucide-react";
import { toast } from "sonner";
import { appStore, useAppState } from "@/services/app-state";
import { formatVND, MUC_CHUAN, type HoSo, type BaoGiamItem } from "@/data/mock";
import { DigitalSignatureBadge } from "./DigitalSignatureBadge";

interface BaoGiamModalProps {
  hoSo: HoSo;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function BaoGiamModal({ hoSo, isOpen, onClose, onSuccess }: BaoGiamModalProps) {
  const { currentUser } = useAppState();

  // Form State
  const [ngayTuTran, setNgayTuTran] = useState(new Date().toISOString().slice(0, 10));
  const [noiTuTran, setNoiTuTran] = useState(`Tại nhà riêng, ${hoSo.phuong}, ${hoSo.huyen || "TP. Thủ Dầu Một"}`);
  const [soTrichLucKhaiTu, setSoTrichLucKhaiTu] = useState(`TLKT-${new Date().getFullYear()}/${Math.floor(10 + Math.random() * 90)}`);
  const [ngayCapKhaiTu, setNgayCapKhaiTu] = useState(new Date().toISOString().slice(0, 10));
  const [noiCapKhaiTu, setNoiCapKhaiTu] = useState(`UBND ${hoSo.phuong}`);
  const [nguoiKhaiBao, setNguoiKhaiBao] = useState("");
  const [quanHeVoiNguoiMat, setQuanHeVoiNguoiMat] = useState("Con đẻ");
  const [soCccdNguoiKhai, setSoCccdNguoiKhai] = useState("");
  const [soDienThoaiNguoiKhai, setSoDienThoaiNguoiKhai] = useState("");
  const [diaChiNguoiKhai, setDiaChiNguoiKhai] = useState(`${hoSo.phuong}, ${hoSo.huyen || "TP. Thủ Dầu Một"}`);

  // Chế độ in quyết định
  const [createdBaoGiam, setCreatedBaoGiam] = useState<BaoGiamItem | null>(null);
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nguoiKhaiBao.trim()) {
      toast.error("Vui lòng nhập họ và tên người đứng khai báo / nhận mai táng phí!");
      return;
    }
    if (!soCccdNguoiKhai.trim()) {
      toast.error("Vui lòng nhập số CCCD của người khai báo!");
      return;
    }
    if (!soTrichLucKhaiTu.trim()) {
      toast.error("Vui lòng nhập số trích lục khai tử!");
      return;
    }

    try {
      const result = appStore.baoGiamTuTran({
        hoSoId: hoSo.id,
        ngayTuTran,
        noiTuTran,
        soTrichLucKhaiTu,
        ngayCapKhaiTu,
        noiCapKhaiTu,
        nguoiKhaiBao,
        quanHeVoiNguoiMat,
        soCccdNguoiKhai,
        soDienThoaiNguoiKhai,
        diaChiNguoiKhai,
      });

      setCreatedBaoGiam(result);
      setShowPrintPreview(true);
      toast.success(
        `Đã báo giảm đối tượng ${hoSo.hoTen} thành công! Đã ban hành Quyết định Mai táng phí ${result.soQuyetDinhMaiTang}`
      );
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error(err.message || "Lỗi xử lý báo giảm");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full border border-gray-300 overflow-hidden my-6">
        {/* Header Modal */}
        <div className="bg-[#dd4b39] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="size-5 text-amber-300" />
            <div>
              <h3 className="text-base font-bold uppercase tracking-tight">
                {showPrintPreview
                  ? "Quyết định Trợ cấp Mai táng phí (Mẫu số 02 - NĐ 131/2021)"
                  : "Thủ tục Báo giảm đối tượng & Cấp Mai táng phí"}
              </h3>
              <p className="text-xs text-white/90">
                Đối tượng: <strong className="text-amber-200">{hoSo.hoTen}</strong> (Số hồ sơ:{" "}
                {hoSo.soHoSoTinh || hoSo.id}) · {hoSo.loaiDoiTuong}
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
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {!showPrintPreview ? (
            <form onSubmit={handleSubmit} className="space-y-5 text-sm">
              {/* Cảnh báo pháp lý */}
              <div className="p-3.5 bg-amber-50 border border-amber-300 rounded text-amber-900 text-xs leading-relaxed flex items-start gap-2.5">
                <AlertTriangle className="size-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Lưu ý quan trọng từ Cán bộ quản lý:</strong> Khi thực hiện báo giảm, hệ
                  thống sẽ tự động:
                  <ul className="list-disc ml-5 mt-1 space-y-0.5">
                    <li>Chuyển trạng thái hồ sơ sang <strong>"Đã từ trần"</strong>.</li>
                    <li>Ngừng toàn bộ các khoản trợ cấp hàng tháng từ kỳ chi trả tiếp theo.</li>
                    <li>
                      Tự động tính trợ cấp Mai táng phí bằng <strong>10 tháng mức chuẩn</strong> (
                      {formatVND(10 * MUC_CHUAN)}) và trợ cấp một lần theo quy định.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Phần 1: Thông tin từ trần */}
              <div className="border border-gray-200 rounded-md p-4 bg-gray-50/60">
                <h4 className="font-bold text-[#dd4b39] flex items-center gap-2 mb-3 text-sm">
                  <Calendar className="size-4" />
                  1. THÔNG TIN TRÍCH LỤC KHAI TỬ & THỜI ĐIỂM MẤT
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Ngày từ trần <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={ngayTuTran}
                      onChange={(e) => setNgayTuTran(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:border-[#dd4b39] focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Nơi từ trần <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={noiTuTran}
                      onChange={(e) => setNoiTuTran(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:border-[#dd4b39] focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Số trích lục khai tử <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={soTrichLucKhaiTu}
                      onChange={(e) => setSoTrichLucKhaiTu(e.target.value)}
                      placeholder="VD: 145/TLKT-2026"
                      className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm font-mono focus:border-[#dd4b39] focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Cơ quan cấp trích lục <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={noiCapKhaiTu}
                      onChange={(e) => setNoiCapKhaiTu(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:border-[#dd4b39] focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Phần 2: Thông tin người đại diện đứng nhận mai táng phí */}
              <div className="border border-gray-200 rounded-md p-4 bg-gray-50/60">
                <h4 className="font-bold text-[#3c8dbc] flex items-center gap-2 mb-3 text-sm">
                  <User className="size-4" />
                  2. THÔNG TIN THÂN NHÂN ĐỨNG TÊN NHẬN MAI TÁNG PHÍ
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Họ và tên người nhận <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={nguoiKhaiBao}
                      onChange={(e) => setNguoiKhaiBao(e.target.value)}
                      placeholder="Nhập đầy đủ họ tên thân nhân"
                      className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:border-[#3c8dbc] focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Quan hệ với người có công <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={quanHeVoiNguoiMat}
                      onChange={(e) => setQuanHeVoiNguoiMat(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:border-[#3c8dbc] focus:outline-none"
                    >
                      <option value="Vợ/Chồng">Vợ / Chồng</option>
                      <option value="Con đẻ">Con đẻ</option>
                      <option value="Con nuôi hợp pháp">Con nuôi hợp pháp</option>
                      <option value="Bố/Mẹ đẻ">Bố / Mẹ đẻ</option>
                      <option value="Người đại diện mai táng">Người đảm nhận mai táng hợp pháp</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Số CCCD người nhận <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={soCccdNguoiKhai}
                      onChange={(e) => setSoCccdNguoiKhai(e.target.value)}
                      placeholder="12 chữ số CCCD"
                      className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm font-mono focus:border-[#3c8dbc] focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Số điện thoại liên hệ
                    </label>
                    <input
                      type="text"
                      value={soDienThoaiNguoiKhai}
                      onChange={(e) => setSoDienThoaiNguoiKhai(e.target.value)}
                      placeholder="Số điện thoại di động"
                      className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:border-[#3c8dbc] focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Địa chỉ cư trú của người nhận
                    </label>
                    <input
                      type="text"
                      value={diaChiNguoiKhai}
                      onChange={(e) => setDiaChiNguoiKhai(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:border-[#3c8dbc] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Phần 3: Tự động tính định mức tài chính */}
              <div className="bg-emerald-50 border border-emerald-300 rounded-md p-4">
                <h4 className="font-bold text-emerald-800 text-sm mb-2 flex items-center gap-2">
                  <CheckCircle2 className="size-4" />
                  3. ĐỊNH MỨC KINH PHÍ CHI TRẢ MAI TÁNG PHÍ (NĐ 131/2021/NĐ-CP)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-gray-700">
                  <div className="bg-white p-2.5 rounded border border-emerald-200">
                    <span className="text-gray-500 block">Mức chuẩn trợ cấp:</span>
                    <span className="font-bold text-emerald-700 text-sm">
                      {formatVND(MUC_CHUAN)}
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-emerald-200">
                    <span className="text-gray-500 block">Trợ cấp Mai táng phí (x10):</span>
                    <span className="font-bold text-red-600 text-sm">
                      {formatVND(10 * MUC_CHUAN)}
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-emerald-200 col-span-2 sm:col-span-1">
                    <span className="text-gray-500 block">Trợ cấp một lần (nếu có):</span>
                    <span className="font-bold text-blue-700 text-sm">
                      {formatVND(hoSo.mucTroCap * 3)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Nút hành động */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded font-medium text-sm transition-colors"
                >
                  Hủy thao tác
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-white bg-[#dd4b39] hover:bg-[#c82333] rounded font-bold text-sm shadow-sm transition-colors flex items-center gap-2"
                >
                  <FileCheck2 className="size-4" />
                  Xác nhận Báo giảm & Ban hành Quyết định
                </button>
              </div>
            </form>
          ) : (
            /* Xem và In Quyết định Mai táng phí chuẩn hành chính */
            <div>
              <div
                id="print-section"
                className="bg-white p-8 border border-gray-300 rounded shadow-xs text-[#222] font-serif leading-relaxed"
              >
                {/* Quốc hiệu tiêu ngữ */}
                <div className="flex justify-between items-start border-b-2 border-gray-800 pb-4 mb-6 text-center font-sans">
                  <div>
                    <div className="text-xs uppercase font-semibold">ỦY BAN NHÂN DÂN</div>
                    <div className="text-xs font-bold uppercase">TỈNH BÌNH DƯƠNG</div>
                    <div className="text-[11px] font-bold">SỞ LAO ĐỘNG - TB&XH</div>
                    <div className="text-[10px] text-gray-600 mt-1">
                      Số: {createdBaoGiam?.soQuyetDinhMaiTang}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                    <div className="text-xs font-bold underline">Độc lập - Tự do - Hạnh phúc</div>
                    <div className="text-[11px] italic text-gray-600 mt-1">
                      Thủ Dầu Một, ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm{" "}
                      {new Date().getFullYear()}
                    </div>
                  </div>
                </div>

                {/* Tiêu đề quyết định */}
                <div className="text-center my-5">
                  <h2 className="text-base font-bold uppercase">QUYẾT ĐỊNH</h2>
                  <p className="text-xs italic font-medium">
                    Về việc hưởng trợ cấp mai táng phí đối với thân nhân người có công từ trần
                  </p>
                  <p className="text-[11px] font-bold uppercase mt-1">
                    GIÁM ĐỐC SỞ LAO ĐỘNG - THƯƠNG BINH VÀ XÃ HỘI TỈNH BÌNH DƯƠNG
                  </p>
                </div>

                {/* Căn cứ pháp lý */}
                <div className="text-[11px] italic space-y-1 mb-4 text-gray-700">
                  <p>
                    - Căn cứ Pháp lệnh Ưu đãi người có công với cách mạng số 02/2020/UBTVQH14;
                  </p>
                  <p>
                    - Căn cứ Nghị định số 131/2021/NĐ-CP ngày 30/12/2021 của Chính phủ quy định chi
                    tiết và biện pháp thi hành Pháp lệnh Ưu đãi người có công;
                  </p>
                  <p>
                    - Xét Trích lục khai tử số {createdBaoGiam?.soTrichLucKhaiTu} do{" "}
                    {createdBaoGiam?.noiCapKhaiTu} cấp và đề nghị của Trưởng phòng Lao động - TB&XH{" "}
                    {hoSo.huyen || "TP. Thủ Dầu Một"}.
                  </p>
                </div>

                {/* Nội dung quyết định */}
                <div className="text-center font-bold text-xs uppercase my-3">QUYẾT ĐỊNH:</div>

                <div className="text-xs space-y-2.5">
                  <p>
                    <strong>Điều 1.</strong> Trợ cấp mai táng phí cho thân nhân của người có công
                    với cách mạng:
                  </p>
                  <div className="pl-5 space-y-1 bg-gray-50 p-2.5 rounded border border-gray-200">
                    <div>
                      - Họ và tên người có công đã từ trần: <strong>{hoSo.hoTen}</strong> (Sinh năm:{" "}
                      {hoSo.namSinh || "---"})
                    </div>
                    <div>
                      - Thuộc diện đối tượng: <strong>{hoSo.loaiDoiTuong}</strong> · Mã quản lý:{" "}
                      <strong>{hoSo.soHoSoTinh || hoSo.id}</strong>
                    </div>
                    <div>
                      - Cư trú trước khi mất: {hoSo.phuong}, {hoSo.huyen || "TP. Thủ Dầu Một"}
                    </div>
                    <div>
                      - Từ trần ngày: <strong>{createdBaoGiam?.ngayTuTran}</strong> (Nơi mất:{" "}
                      {createdBaoGiam?.noiTuTran})
                    </div>
                  </div>

                  <p>
                    <strong>Điều 2.</strong> Thân nhân trực tiếp đứng tên nhận trợ cấp mai táng
                    phí:
                  </p>
                  <div className="pl-5 space-y-1 bg-gray-50 p-2.5 rounded border border-gray-200">
                    <div>
                      - Họ và tên thân nhân: <strong>{createdBaoGiam?.nguoiKhaiBao}</strong> (Quan hệ:{" "}
                      {createdBaoGiam?.quanHeVoiNguoiMat})
                    </div>
                    <div>
                      - Số CCCD: <strong>{createdBaoGiam?.soCccdNguoiKhai}</strong> · Điện thoại:{" "}
                      {createdBaoGiam?.soDienThoaiNguoiKhai || "Chưa cung cấp"}
                    </div>
                    <div>- Nơi cư trú: {createdBaoGiam?.diaChiNguoiKhai}</div>
                  </div>

                  <p>
                    <strong>Điều 3.</strong> Số tiền trợ cấp được duyệt chi trả:
                  </p>
                  <div className="pl-5 space-y-1 text-sm font-bold text-red-700 bg-red-50 p-2.5 rounded border border-red-200">
                    <div>
                      1. Tiền trợ cấp Mai táng phí (10 tháng mức chuẩn):{" "}
                      {formatVND(createdBaoGiam?.soTienMaiTangPhi || 20_550_000)}
                    </div>
                    {createdBaoGiam?.troCapMotLan ? (
                      <div className="text-xs text-blue-800">
                        2. Trợ cấp một lần theo chế độ: {formatVND(createdBaoGiam.troCapMotLan)}
                      </div>
                    ) : null}
                    <div className="text-xs text-gray-700 font-normal italic">
                      (Bằng chữ: Hai mươi triệu năm trăm năm mươi nghìn đồng chẵn)
                    </div>
                  </div>

                  <p>
                    <strong>Điều 4.</strong> Quyết định này có hiệu lực kể từ ngày ký. Chánh Văn
                    phòng Sở, Trưởng phòng Lao động - TB&XH {hoSo.huyen || "TP. Thủ Dầu Một"}, Chủ
                    tịch UBND {hoSo.phuong} và ông/bà{" "}
                    <strong>{createdBaoGiam?.nguoiKhaiBao}</strong> chịu trách nhiệm thi hành Quyết
                    định này./.
                  </p>
                </div>

                {/* Phần chữ ký */}
                <div className="mt-8 flex justify-between items-end font-sans">
                  <div className="text-[10px] text-gray-600">
                    <p className="font-bold">Nơi nhận:</p>
                    <p>- Như Điều 4;</p>
                    <p>- Cục Người có công (Bộ LĐTBXH);</p>
                    <p>- Kho bạc Nhà nước tỉnh;</p>
                    <p>- Lưu: VT, NCC.</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold uppercase">KT. GIÁM ĐỐC</p>
                    <p className="text-xs font-bold uppercase text-[#dd4b39]">PHÓ GIÁM ĐỐC</p>
                    <div className="my-2">
                      <DigitalSignatureBadge
                        nguoiKy="TS. Nguyễn Văn Hùng"
                        chucVu="Phó Giám đốc Sở LĐTBXH tỉnh Bình Dương"
                        maXacThuc={`SHA256:MTP-${hoSo.id}`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Nút thao tác sau khi in */}
              <div className="flex items-center justify-between pt-5 border-t border-gray-200 mt-4">
                <button
                  type="button"
                  onClick={() => setShowPrintPreview(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded text-sm font-medium"
                >
                  ← Quay lại sửa thông tin
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="px-4 py-2 bg-[#3c8dbc] text-white hover:bg-[#357ca5] rounded font-bold text-sm flex items-center gap-1.5 shadow-xs"
                  >
                    <Printer className="size-4" />
                    In Quyết định (Mẫu số 02)
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded font-bold text-sm"
                  >
                    Hoàn tất & Đóng
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
