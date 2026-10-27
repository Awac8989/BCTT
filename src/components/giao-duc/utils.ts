import { toast } from "sonner";
import { type TrangThaiHoSoGD } from "@/data/domain-mock";

// Helper chuyển chuỗi ngày dd/mm/yyyy sang đối tượng Date chuẩn
export function parseDateVN(dateStr: string): Date {
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
export function calculateSlaStatus(ngayHenTra: string, trangThai: TrangThaiHoSoGD) {
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
export function exportDocAsWord(filename: string, elementId: string) {
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
