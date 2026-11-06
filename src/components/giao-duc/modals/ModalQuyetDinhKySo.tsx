import React from "react";
import { Stamp, Download, Printer, X } from "lucide-react";
import { toast } from "sonner";
import { type HoSoTTHCGiaoDuc } from "@/data/domain-mock";
import { appStore } from "@/services/app-state";
import { DigitalSignatureBadge } from "@/components/DigitalSignatureBadge";
import { exportDocAsWord } from "../utils";

interface ModalQuyetDinhKySoProps {
  hoSo: HoSoTTHCGiaoDuc | null;
  onClose: () => void;
  onKySoSuccess?: () => void;
}

export const ModalQuyetDinhKySo: React.FC<ModalQuyetDinhKySoProps> = ({
  hoSo,
  onClose,
  onKySoSuccess,
}) => {
  if (!hoSo) return null;

  const handleKySoQuyetDinh = () => {
    const res = appStore.kySoQuyetDinhGiaoDuc(
      hoSo.id,
      "TS. Nguyễn Văn Hùng",
      "Chủ tịch UBND Phường Thủ Dầu Một"
    );
    toast.success("Chủ tịch UBND Phường đã Ký số điện tử thành công!", {
      description: `Đã ban hành Quyết định số ${res.soQuyetDinh} · Mã xác thực CA: ${res.maXacThuc}`,
    });
    if (onKySoSuccess) onKySoSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white text-gray-900 rounded-xl shadow-2xl max-w-3xl w-full border border-gray-200 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-[#dd4b39] text-white px-6 py-3.5 flex items-center justify-between no-print shrink-0 shadow-xs rounded-t-xl">
          <div className="flex items-center gap-2">
            <Stamp className="size-5" />
            <h3 className="font-bold text-sm sm:text-base">
              Quyết định thành lập &amp; Giấy phép hoạt động có Ký số điện tử
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {!hoSo.quyetDinh?.daKySo && (
              <button
                onClick={handleKySoQuyetDinh}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-xs flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Stamp className="size-3.5" />
                <span>Tiến hành Ký số điện tử</span>
              </button>
            )}
            <button
              onClick={() =>
                exportDocAsWord(
                  `Quyet_dinh_${(
                    hoSo.quyetDinh?.soQuyetDinh || hoSo.maHoSo
                  ).replace(/\//g, "_")}`,
                  "quyet-dinh-content"
                )
              }
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-1 cursor-pointer transition-colors"
              title="Xuất Quyết định sang tệp Word (.doc) chuẩn thể thức Nghị định 30/2020/NĐ-CP"
            >
              <Download className="size-3.5" />
              <span>Xuất Word (.doc)</span>
            </button>
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Printer className="size-3.5" />
              <span>In Quyết định (Ctrl+P)</span>
            </button>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-1 rounded-md hover:bg-white/10 cursor-pointer transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Nội dung Quyết định chuẩn thể thức Nghị định 30/2020 */}
        <div
          className="p-8 overflow-y-auto font-serif text-[13px] leading-relaxed select-text flex-1"
          id="quyet-dinh-content"
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
                Số:{" "}
                <strong className="font-mono text-black">
                  {hoSo.quyetDinh?.soQuyetDinh || "175/QĐ-UBND"}
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
                Thủ Dầu Một, ngày{" "}
                {hoSo.quyetDinh?.ngayBanHanh ||
                  new Date().toLocaleDateString("vi-VN")}
              </div>
            </div>
          </div>

          {/* Tiêu đề Quyết định */}
          <div className="text-center my-6 space-y-1">
            <h2 className="text-base font-bold uppercase tracking-wide text-gray-900">
              QUYẾT ĐỊNH
            </h2>
            <div className="font-bold text-sm text-gray-800">
              {hoSo.maThuTuc === "TTHC-GD-BGD/04"
                ? "Về việc phê duyệt danh sách và kinh phí hỗ trợ tiền ăn trưa cho trẻ em mẫu giáo và hỗ trợ chi phí học tập học kỳ I năm học 2026 - 2027 trên địa bàn Phường Thủ Dầu Một"
                : hoSo.maThuTuc === "TTHC-GD-BGD/03"
                ? `Về việc cho phép chuyển địa điểm và mở rộng quy mô ${hoSo.tenCoSoDeNghi}`
                : `Về việc cho phép thành lập ${hoSo.tenCoSoDeNghi}`}
            </div>
            <div className="text-xs uppercase font-extrabold text-[#b91c1c] tracking-widest pt-1">
              CHỦ TỊCH ỦY BAN NHÂN DÂN PHƯỜNG PHÚ CƯỜNG
            </div>
          </div>

          {/* Căn cứ pháp lý */}
          <div className="space-y-1 text-justify text-xs italic text-gray-700 mb-4 font-serif">
            <p>
              Căn cứ Luật Tổ chức chính quyền địa phương ngày 19 tháng 6 năm
              2015; Luật sửa đổi, bổ sung một số điều của Luật Tổ chức Chính phủ
              và Luật Tổ chức chính quyền địa phương ngày 22 tháng 11 năm 2019;
            </p>
            <p>Căn cứ Luật Giáo dục ngày 14 tháng 6 năm 2019;</p>
            {hoSo.maThuTuc === "TTHC-GD-BGD/04" ? (
              <>
                <p>
                  Căn cứ Nghị định số 105/2020/NĐ-CP ngày 08 tháng 9 năm 2020
                  của Chính phủ quy định chính sách phát triển giáo dục mầm non;
                </p>
                <p>
                  Căn cứ Nghị định số 81/2021/NĐ-CP ngày 27 tháng 8 năm 2021 của
                  Chính phủ quy định về cơ chế thu, quản lý học phí đối với cơ sở
                  giáo dục thuộc hệ thống giáo dục quốc dân và chính sách miễn,
                  giảm học phí, hỗ trợ chi phí học tập;
                </p>
                <p>
                  Căn cứ Biên bản họp Hội đồng xét duyệt chính sách trợ cấp xã
                  hội và giáo dục Phường Thủ Dầu Một ngày{" "}
                  {hoSo.ketQuaThucDia?.ngayKiemTra || "16/10/2026"};
                </p>
                <p>
                  Theo đề nghị của Công chức Văn hóa - Xã hội phụ trách Giáo dục
                  tại Tờ trình số {hoSo.toTrinh?.soToTrinh || "18/TTr-VHXH"}.
                </p>
              </>
            ) : (
              <>
                <p>
                  Căn cứ Nghị định số 46/2017/NĐ-CP ngày 21 tháng 4 năm 2017 của
                  Chính phủ quy định về điều kiện đầu tư và hoạt động trong lĩnh
                  vực giáo dục; Nghị định số 135/2018/NĐ-CP ngày 04 tháng 10 năm
                  2018 của Chính phủ sửa đổi, bổ sung một số điều của Nghị định
                  46/2017/NĐ-CP;
                </p>
                <p>
                  Căn cứ Thông tư số 49/2021/TT-BGDĐT ngày 31 tháng 12 năm 2021
                  của Bộ Giáo dục và Đào tạo ban hành Quy chế tổ chức và hoạt
                  động của nhóm trẻ độc lập, lớp mẫu giáo độc lập, lớp mầm non
                  độc lập loại hình dân lập và tư thục;
                </p>
                <p>
                  Xét Đơn đề nghị ngày {hoSo.ngayTiepNhan} của bà/ông{" "}
                  {hoSo.nguoiNop} và Biên bản kiểm tra thẩm định thực tế của Đoàn
                  kiểm tra liên ngành ngày{" "}
                  {hoSo.ketQuaThucDia?.ngayKiemTra || "15/10/2026"};
                </p>
                <p>
                  Theo đề nghị của Công chức Văn hóa - Xã hội phụ trách Giáo dục
                  tại Tờ trình số {hoSo.toTrinh?.soToTrinh || "21/TTr-VHXH"}.
                </p>
              </>
            )}
          </div>

          <div className="text-center font-bold text-xs uppercase my-2 tracking-wider">
            QUYẾT ĐỊNH:
          </div>

          {/* Điều khoản */}
          {hoSo.maThuTuc === "TTHC-GD-BGD/04" ? (
            <div className="space-y-3 text-justify text-xs font-serif leading-relaxed mb-6">
              <p>
                <strong>Điều 1.</strong> Phê duyệt danh sách 12 trẻ em mẫu giáo
                và học sinh thuộc diện hộ nghèo, hộ cận nghèo, mồ côi trên địa
                bàn Phường Thủ Dầu Một được hưởng chính sách hỗ trợ tiền ăn trưa và
                hỗ trợ chi phí học tập học kỳ I năm học 2026 - 2027.
              </p>
              <p className="font-sans">
                - Tổng kinh phí phê duyệt chi trả:{" "}
                <strong className="text-red-700 font-bold font-mono">
                  18.600.000 đồng
                </strong>{" "}
                (Mười tám triệu sáu trăm nghìn đồng chẵn).
              </p>

              {/* Bảng danh sách chi tiết 12 học sinh */}
              <div className="font-sans overflow-x-auto my-2 not-italic">
                <table className="w-full text-[11px] border-collapse border border-gray-400">
                  <thead>
                    <tr className="bg-gray-100 text-gray-800 font-bold text-center">
                      <th className="border border-gray-400 p-1 w-7">STT</th>
                      <th className="border border-gray-400 p-1 text-left">
                        Họ và tên học sinh
                      </th>
                      <th className="border border-gray-400 p-1 w-14">
                        Năm sinh
                      </th>
                      <th className="border border-gray-400 p-1">
                        Lớp / Khu phố
                      </th>
                      <th className="border border-gray-400 p-1 text-left">
                        Diện chính sách
                      </th>
                      <th className="border border-gray-400 p-1 text-right">
                        Tiền ăn trưa (4T)
                      </th>
                      <th className="border border-gray-400 p-1 text-right">
                        Học tập (4T)
                      </th>
                      <th className="border border-gray-400 p-1 text-right">
                        Tổng nhận
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        stt: 1,
                        name: "Nguyễn Mai Anh",
                        ns: 2021,
                        lop: "Chồi 1 / KP 1",
                        dien: "Hộ nghèo",
                        anTrua: 640000,
                        hocTap: 600000,
                      },
                      {
                        stt: 2,
                        name: "Trần Gia Huy",
                        ns: 2022,
                        lop: "Mầm 2 / KP 3",
                        dien: "Hộ cận nghèo",
                        anTrua: 640000,
                        hocTap: 0,
                      },
                      {
                        stt: 3,
                        name: "Lê Hoàng Phúc",
                        ns: 2020,
                        lop: "Lá 1 / KP 2",
                        dien: "Mồ côi cả cha mẹ",
                        anTrua: 640000,
                        hocTap: 600000,
                      },
                      {
                        stt: 4,
                        name: "Phạm Minh Triết",
                        ns: 2020,
                        lop: "Lá 2 / KP 4",
                        dien: "Hộ nghèo",
                        anTrua: 640000,
                        hocTap: 600000,
                      },
                      {
                        stt: 5,
                        name: "Huỳnh Ngọc Bích",
                        ns: 2021,
                        lop: "Chồi 2 / KP 5",
                        dien: "Hộ nghèo",
                        anTrua: 640000,
                        hocTap: 600000,
                      },
                      {
                        stt: 6,
                        name: "Đặng Quốc Bảo",
                        ns: 2022,
                        lop: "Mầm 1 / KP 6",
                        dien: "Hộ cận nghèo",
                        anTrua: 640000,
                        hocTap: 0,
                      },
                      {
                        stt: 7,
                        name: "Võ Thị Thùy Dung",
                        ns: 2020,
                        lop: "Lá 1 / KP 7",
                        dien: "Hộ nghèo",
                        anTrua: 640000,
                        hocTap: 600000,
                      },
                      {
                        stt: 8,
                        name: "Ngô Minh Khang",
                        ns: 2021,
                        lop: "Chồi 1 / KP 8",
                        dien: "Hộ nghèo",
                        anTrua: 640000,
                        hocTap: 600000,
                      },
                      {
                        stt: 9,
                        name: "Bùi Tuấn Kiệt",
                        ns: 2022,
                        lop: "Mầm 2 / KP 9",
                        dien: "Hộ cận nghèo",
                        anTrua: 640000,
                        hocTap: 0,
                      },
                      {
                        stt: 10,
                        name: "Phan Thanh Thảo",
                        ns: 2020,
                        lop: "Lá 2 / KP 3",
                        dien: "Khuyết tật",
                        anTrua: 640000,
                        hocTap: 600000,
                      },
                      {
                        stt: 11,
                        name: "Dương Đình Trọng",
                        ns: 2021,
                        lop: "Chồi 2 / KP 2",
                        dien: "Hộ nghèo",
                        anTrua: 640000,
                        hocTap: 600000,
                      },
                      {
                        stt: 12,
                        name: "Lâm Gia Như",
                        ns: 2020,
                        lop: "Lá 1 / KP 1",
                        dien: "Hộ nghèo",
                        anTrua: 640000,
                        hocTap: 600000,
                      },
                    ].map((row) => (
                      <tr key={row.stt} className="hover:bg-gray-50">
                        <td className="border border-gray-400 p-1 text-center font-mono">
                          {row.stt}
                        </td>
                        <td className="border border-gray-400 p-1 font-semibold">
                          {row.name}
                        </td>
                        <td className="border border-gray-400 p-1 text-center font-mono">
                          {row.ns}
                        </td>
                        <td className="border border-gray-400 p-1">
                          {row.lop}
                        </td>
                        <td className="border border-gray-400 p-1 text-emerald-800">
                          {row.dien}
                        </td>
                        <td className="border border-gray-400 p-1 text-right font-mono">
                          {row.anTrua.toLocaleString("vi-VN")} đ
                        </td>
                        <td className="border border-gray-400 p-1 text-right font-mono">
                          {row.hocTap.toLocaleString("vi-VN")} đ
                        </td>
                        <td className="border border-gray-400 p-1 text-right font-mono font-bold text-red-700">
                          {(row.anTrua + row.hocTap).toLocaleString("vi-VN")} đ
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-100 font-bold">
                      <td
                        colSpan={5}
                        className="border border-gray-400 p-1 text-center uppercase"
                      >
                        Tổng cộng (12 học sinh)
                      </td>
                      <td className="border border-gray-400 p-1 text-right font-mono">
                        7.680.000 đ
                      </td>
                      <td className="border border-gray-400 p-1 text-right font-mono">
                        5.400.000 đ
                      </td>
                      <td className="border border-gray-400 p-1 text-right font-mono text-[#b91c1c] text-xs">
                        18.600.000 đ
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p>
                <strong>Điều 2.</strong> Bộ phận Kế toán - Ngân sách UBND Phường
                phối hợp Hiệu trưởng Trường Mầm non Hoa Mai rút dự toán kinh phí
                và thực hiện chi trả chế độ hỗ trợ cho phụ huynh học sinh kịp
                thời, đúng đối tượng và thanh quyết toán theo quy định hiện hành.
                Thời hạn hoàn thành chi trả trước ngày 10/11/2026.
              </p>

              <p>
                <strong>Điều 3.</strong> Văn phòng HĐND - UBND phường, Bộ phận
                Kế toán - Ngân sách, Công chức Văn hóa - Xã hội, Hiệu trưởng
                Trường Mầm non Hoa Mai, Trưởng Ban điều hành các khu phố liên
                quan và các hộ gia đình có tên tại Điều 1 chịu trách nhiệm thi
                hành Quyết định này./.
              </p>
            </div>
          ) : (
            <div className="space-y-2 text-justify text-xs font-serif leading-relaxed mb-6">
              <p>
                <strong>Điều 1.</strong> Cho phép thành lập cơ sở mầm non ngoài
                công lập:
              </p>
              <div className="pl-4 space-y-1 font-sans">
                <div>
                  - Tên gọi cơ sở:{" "}
                  <strong className="text-emerald-900 uppercase">
                    {hoSo.tenCoSoDeNghi}
                  </strong>
                </div>
                <div>
                  - Loại hình:{" "}
                  <strong>
                    {hoSo.tenThuTuc.includes("mẫu giáo")
                      ? "Lớp mẫu giáo độc lập tư thục"
                      : "Nhóm trẻ độc lập tư thục"}
                  </strong>
                </div>
                <div>
                  - Chủ cơ sở / Người đại diện:{" "}
                  <strong className="uppercase">{hoSo.nguoiNop}</strong> (CCCD:{" "}
                  {hoSo.cccd})
                </div>
                <div>
                  - Địa điểm đặt cơ sở: <strong>{hoSo.diaDiemCoSo}</strong>
                </div>
                <div>
                  - Thời hạn hoạt động: Theo quy định hiện hành của pháp luật về
                  giáo dục.
                </div>
              </div>

              <p>
                <strong>Điều 2.</strong> {hoSo.tenCoSoDeNghi} có trách nhiệm thực
                hiện đúng Điều lệ trường mầm non, Quy chế tổ chức hoạt động theo
                Thông tư số 49/2021/TT-BGDĐT; bảo đảm tuyệt đối an toàn tính
                mạng, sức khỏe cho trẻ em, phòng chống cháy nổ và vệ sinh an toàn
                thực phẩm.
              </p>

              <p>
                <strong>Điều 3.</strong> Văn phòng HĐND - UBND phường, Công chức
                Văn hóa - Xã hội phụ trách Giáo dục, Trưởng Công an phường, Trưởng
                Trạm Y tế, Trưởng Ban điều hành {hoSo.khuPho} và bà/ông{" "}
                {hoSo.nguoiNop} chịu trách nhiệm thi hành Quyết định này./.
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
              <div className="font-bold text-xs uppercase text-gray-900">
                CHỦ TỊCH
              </div>

              {hoSo.quyetDinh?.daKySo ? (
                <div className="my-2 flex justify-center">
                  <DigitalSignatureBadge
                    nguoiKy={hoSo.quyetDinh.nguoiKy}
                    chucVu={hoSo.quyetDinh.chucVu}
                    ngayKy={hoSo.quyetDinh.ngayBanHanh}
                    maXacThuc={hoSo.quyetDinh.maXacThucKySo}
                  />
                </div>
              ) : (
                <div className="py-6 border-2 border-dashed border-amber-300 rounded-lg bg-amber-50/60 text-amber-800 text-xs">
                  <div className="font-bold">CHƯA KÝ SỐ ĐIỆN TỬ</div>
                  <div className="text-[11px] text-gray-500 mt-1">
                    Bấm nút &quot;Tiến hành Ký số điện tử&quot; ở trên để phê
                    duyệt
                  </div>
                </div>
              )}

              <div className="font-extrabold text-sm text-gray-900">
                {hoSo.quyetDinh?.nguoiKy || "TS. Nguyễn Văn Hùng"}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t bg-gray-50 rounded-b-xl no-print">
          <span className="text-xs text-gray-500">
            Văn bản hành chính số hóa · Tích hợp Trục liên thông văn bản LGSP
            Tỉnh Bình Dương
          </span>
          <div className="flex items-center gap-2">
            {!hoSo.quyetDinh?.daKySo && (
              <button
                onClick={handleKySoQuyetDinh}
                className="px-4 py-2 bg-[#dd4b39] hover:bg-[#c23321] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Stamp className="size-4" />
                Ký số phê duyệt (SmartCA)
              </button>
            )}
            <button
              onClick={() =>
                exportDocAsWord(
                  `Quyet_dinh_${(
                    hoSo.quyetDinh?.soQuyetDinh || hoSo.maHoSo
                  ).replace(/\//g, "_")}`,
                  "quyet-dinh-content"
                )
              }
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="size-4" />
              Tải file Word (.doc)
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Printer className="size-4" />
              In Quyết định
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-semibold rounded-lg cursor-pointer transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
