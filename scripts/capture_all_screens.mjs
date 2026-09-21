import puppeteer from "puppeteer-core";
import path from "node:path";
import fs from "node:fs";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUTPUT_DIR = path.resolve("docs/screenshots");
const BASE_URL = "http://localhost:8081";

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  console.log("=== BẮT ĐẦU CHỤP TẤT CẢ MÀN HÌNH HỆ THỐNG ===");
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--window-size=1440,900",
    ],
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
  });

  const page = await browser.newPage();

  // Helper để chụp và ghi log
  async function take(filename, description) {
    const dest = path.join(OUTPUT_DIR, filename);
    await page.screenshot({ path: dest });
    console.log(`[OK] Đã chụp: ${filename} - ${description}`);
  }

  // 1. Cổng đăng nhập - Admin Cấp Sở
  console.log("\n1. Chụp /login (Cấp Sở)...");
  await page.goto(`${BASE_URL}/login`, { waitUntil: "networkidle2" });
  await sleep(1000);
  const capSoBtn = await page.$('button ::-p-text(ADMIN CẤP SỞ)');
  if (capSoBtn) await capSoBtn.click();
  await sleep(500);
  await take("01_login_cap_so.png", "Cổng Đăng Nhập Admin Cấp Sở");

  // 2. Cổng đăng nhập - Admin Cấp Phòng
  console.log("\n2. Chụp /login (Cấp Phòng)...");
  const capPhongBtn = await page.$('button ::-p-text(ADMIN CẤP PHÒNG)');
  if (capPhongBtn) await capPhongBtn.click();
  await sleep(500);
  await take("02_login_cap_phong.png", "Cổng Đăng Nhập Admin Cấp Phòng");

  // Đăng nhập vào hệ thống
  console.log("\nĐăng nhập vào hệ thống...");
  const loginBtn = await page.$('button ::-p-text(1-Click Đăng nhập ngay)');
  if (loginBtn) {
    await loginBtn.click();
    await sleep(2000);
  }

  // 3. Bảng điều khiển trung tâm
  console.log("\n3. Chụp Dashboard tổng quan...");
  await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle2" });
  await sleep(1500);
  await take("03_dashboard_tong_quan.png", "Bảng điều khiển trung tâm");

  // 4. Biểu đồ kinh phí phân tầng
  console.log("\n4. Chụp Biểu đồ kinh phí...");
  await page.evaluate(() => {
    window.scrollTo({ top: 350, behavior: "instant" });
  });
  await sleep(800);
  await take("04_bieu_do_kinh_phi.png", "Biểu đồ kinh phí chi trả phân tầng theo phường");

  // 5. Chuyển đổi vai trò quản trị (Header Dropdown)
  console.log("\n5. Chụp menu chuyển đổi vai trò...");
  await page.evaluate(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  });
  await sleep(500);
  const avatarBtn = await page.$('button[title*="chuyển đổi vai trò"]');
  if (avatarBtn) {
    await avatarBtn.click();
    await sleep(600);
    await take("05_chuyen_doi_vai_tro.png", "Dropdown chuyển đổi vai trò quản trị trên Header");
    await avatarBtn.click(); // đóng lại
    await sleep(400);
  }

  // 6. Quản lý hồ sơ & Giấy hẹn Một cửa mã QR
  console.log("\n6. Chụp Giấy hẹn Một cửa có Mã QR...");
  await page.goto(`${BASE_URL}/ho-so`, { waitUntil: "networkidle2" });
  await sleep(1500);
  const printHenBtn = await page.$('button[title*="In Giấy tiếp nhận"]');
  if (printHenBtn) {
    await printHenBtn.click();
    await sleep(1000);
    await take("06_giay_hen_mot_cua_qr.png", "Giấy hẹn tiếp nhận Một cửa tích hợp Mã QR Code");
    // Đóng modal giấy hẹn
    await page.keyboard.press("Escape");
    await sleep(500);
  }

  // 7. Cổng đánh giá sự hài lòng công dân (Kiosk / QR)
  console.log("\n7. Chụp Cổng khảo sát CSAT...");
  await page.goto(`${BASE_URL}/khao-sat`, { waitUntil: "networkidle2" });
  await sleep(1500);
  await take("07_cong_dan_danh_gia_csat.png", "Cổng đánh giá sự hài lòng của công dân (Kiosk)");

  // 8. Trung tâm giám sát CSAT & SIPAS cán bộ
  console.log("\n8. Chụp Giám sát CSAT cán bộ...");
  await page.goto(`${BASE_URL}/danh-gia`, { waitUntil: "networkidle2" });
  await sleep(1500);
  await take("08_giam_sat_csat_can_bo.png", "Trung tâm giám sát CSAT & Biểu đồ Radar SIPAS");

  // 9. Quản lý chi trả & Phiếu chi C70a-HD
  console.log("\n9. Chụp Phiếu chi C70a-HD...");
  await page.goto(`${BASE_URL}/chi-tra`, { waitUntil: "networkidle2" });
  await sleep(1500);
  const phieuChiBtn = await page.$('button[title*="In Giấy lĩnh tiền"]');
  if (phieuChiBtn) {
    await phieuChiBtn.click();
    await sleep(1000);
    await take("09_phieu_chi_c70a_hd.png", "Phiếu chi trả trợ cấp Mẫu C70a-HD có mã vạch");
    await page.keyboard.press("Escape");
    await sleep(500);
  }

  // 10. Chi tiết hồ sơ liệt sĩ
  console.log("\n10. Chụp Chi tiết hồ sơ liệt sĩ...");
  await page.goto(`${BASE_URL}/ho-so/BD-16720-1`, { waitUntil: "networkidle2" });
  await sleep(1500);
  await take("10_chi_tiet_ho_so_liet_si.png", "Chi tiết hồ sơ liệt sĩ và thân nhân");

  // 11. Quản lý điều dưỡng
  console.log("\n11. Chụp Quản lý điều dưỡng...");
  await page.goto(`${BASE_URL}/dieu-duong`, { waitUntil: "networkidle2" });
  await sleep(1500);
  await take("11_quan_ly_dieu_duong.png", "Quản lý chỉ tiêu và danh sách điều dưỡng NĐ 131");

  // 12. Bản đồ nhiệt & Phân tích
  console.log("\n12. Chụp Bản đồ nhiệt phân tích...");
  await page.goto(`${BASE_URL}/phan-tich`, { waitUntil: "networkidle2" });
  await sleep(1500);
  await take("12_ban_do_nhiet_phan_tich.png", "Bản đồ nhiệt 14 phường & Phân tích dữ liệu");

  // 13. Dụng cụ chỉnh hình
  console.log("\n13. Chụp Dụng cụ chỉnh hình...");
  await page.goto(`${BASE_URL}/dung-cu-chinh-hinh`, { waitUntil: "networkidle2" });
  await sleep(1500);
  await take("13_dung_cu_chinh_hinh.png", "Quản lý cấp Phương tiện trợ giúp & Dụng cụ chỉnh hình");

  // 14. Bản đồ số nghĩa trang GIS
  console.log("\n14. Chụp Bản đồ số Nghĩa trang GIS...");
  await page.goto(`${BASE_URL}/nghia-trang`, { waitUntil: "networkidle2" });
  await sleep(1500);
  await take("14_ban_do_nghia_trang_gis.png", "Bản đồ số Nghĩa trang Liệt sĩ GIS & Tưởng niệm");

  // 15. Cổng tra cứu trực tuyến công dân
  console.log("\n15. Chụp Cổng tra cứu công dân...");
  await page.goto(`${BASE_URL}/tra-cuu`, { waitUntil: "networkidle2" });
  await sleep(1500);
  // Nhập thử số CCCD để hiển thị timeline tra cứu thực tế
  const cccdInput = await page.$('input[placeholder*="CCCD"]');
  if (cccdInput) {
    await cccdInput.type("074045001923");
    await sleep(300);
    const traCuuBtn = await page.$('button ::-p-text(Tra cứu)');
    if (traCuuBtn) await traCuuBtn.click();
    await sleep(800);
  }
  await take("15_cong_tra_cuu_cong_dan.png", "Cổng dịch vụ tra cứu công dân theo CCCD");

  // 16. Báo giảm từ trần & Mai táng phí Modal
  console.log("\n16. Chụp Modal Báo giảm từ trần...");
  await page.goto(`${BASE_URL}/ho-so`, { waitUntil: "networkidle2" });
  await sleep(1500);
  const baoGiamBtn = await page.$('button[title*="Báo giảm"]');
  if (baoGiamBtn) {
    await baoGiamBtn.click();
    await sleep(1000);
    await take("16_danh_sach_ho_so_bao_giam.png", "Quy trình Báo giảm từ trần & Quyết định Mai táng phí Mẫu 02");
    await page.keyboard.press("Escape");
    await sleep(500);
  }

  // 17. Đối soát ngân hàng Modal
  console.log("\n17. Chụp Modal Đối soát ngân hàng...");
  await page.goto(`${BASE_URL}/chi-tra`, { waitUntil: "networkidle2" });
  await sleep(1500);
  const doiSoatBtn = await page.$('button ::-p-text(Đối soát tự động Ngân hàng)');
  if (doiSoatBtn) {
    await doiSoatBtn.click();
    await sleep(1000);
    await take("17_chi_tra_doi_soat_ngan_hang.png", "Module Đối soát tự động ngân hàng (Bank Reconciliation)");
    await page.keyboard.press("Escape");
    await sleep(500);
  }

  // 18. Quy trình thẩm định số hóa
  console.log("\n18. Chụp Quy trình thẩm định...");
  await page.goto(`${BASE_URL}/tham-dinh`, { waitUntil: "networkidle2" });
  await sleep(1500);
  await take("18_quy_trinh_tham_dinh_so_hoa.png", "Quy trình thẩm định hồ sơ 5 bước Một cửa & Ký số SmartCA");

  // 19. Cấu hình hệ thống
  console.log("\n19. Chụp Cấu hình hệ thống...");
  await page.goto(`${BASE_URL}/he-thong`, { waitUntil: "networkidle2" });
  await sleep(1500);
  await take("19_cau_hinh_he_thong.png", "Cấu hình định mức trợ cấp và tham số hệ thống");

  // 20. Tiếp nhận hồ sơ mới Modal
  console.log("\n20. Chụp Modal Tiếp nhận hồ sơ mới...");
  await page.goto(`${BASE_URL}/ho-so`, { waitUntil: "networkidle2" });
  await sleep(1500);
  const themHsBtn = await page.$('button ::-p-text(Thêm hồ sơ)');
  if (themHsBtn) {
    await themHsBtn.click();
    await sleep(1000);
    await take("20_tiep_nhan_ho_so_moi_modal.png", "Modal Tiếp nhận hồ sơ Người có công mới có Zod Validation");
    await page.keyboard.press("Escape");
    await sleep(500);
  }

  // 21. AI OCR Scan số hóa Modal
  console.log("\n21. Chụp Modal AI OCR Scan số hóa...");
  const ocrBtn = await page.$('button ::-p-text(OCR AI Scan số hóa)');
  if (ocrBtn) {
    await ocrBtn.click();
    await sleep(1000);
    await take("21_ai_ocr_so_hoa_modal.png", "Modal Số hóa AI OCR Bằng Tổ quốc ghi công & Ký số");
    await page.keyboard.press("Escape");
    await sleep(500);
  }

  // Dọn dẹp test_puppeteer.png nếu có
  const testP = path.join(OUTPUT_DIR, "test_puppeteer.png");
  if (fs.existsSync(testP)) {
    fs.unlinkSync(testP);
  }

  await browser.close();
  console.log("\n🎉 HOÀN TẤT CHỤP TOÀN BỘ 21 MÀN HÌNH VÀ MODAL!");
}

run().catch((err) => {
  console.error("Lỗi quá trình chụp màn hình:", err);
  process.exit(1);
});
