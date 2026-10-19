import os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches

os.makedirs('docs/diagrams', exist_ok=True)

# Cấu hình font
plt.rcParams['font.sans-serif'] = ['DejaVu Sans', 'Arial', 'Segoe UI']
plt.rcParams['axes.edgecolor'] = '#cbd5e1'

def create_org_chart():
    fig, ax = plt.subplots(figsize=(10, 6), dpi=300)
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 7)
    ax.axis('off')

    # Trưởng phòng
    box_tp = patches.FancyBboxPatch((3.5, 5.5), 3.0, 1.0, boxstyle="round,pad=0.1", ec="#1e3a8a", fc="#1e3a8a")
    ax.add_patch(box_tp)
    ax.text(5.0, 6.0, "TRƯỞNG PHÒNG\n(Phụ trách chung)", color="white", weight="bold", ha="center", va="center", fontsize=10)

    # Phó Trưởng phòng
    box_ptp = patches.FancyBboxPatch((3.5, 3.8), 3.0, 0.9, boxstyle="round,pad=0.1", ec="#2563eb", fc="#2563eb")
    ax.add_patch(box_ptp)
    ax.text(5.0, 4.25, "PHÓ TRƯỞNG PHÒNG\n(Phụ trách CNTT & CĐS)", color="white", weight="bold", ha="center", va="center", fontsize=9.5)

    # 3 Bộ phận chuyên môn
    boxes = [
        ((0.3, 1.5), 2.8, 1.3, "Bộ phận Văn hóa - Gia đình\n& Du lịch\n(Quản lý lễ hội, nếp sống văn minh)", "#0f766e"),
        ((3.6, 1.5), 2.8, 1.3, "Bộ phận Bưu chính, Viễn thông\n& Tuyên truyền\n(Hạ tầng số, tuyên truyền cổ động)", "#0284c7"),
        ((6.9, 1.5), 2.8, 1.3, "Bộ phận CNTT & Chuyển đổi số\n(Vị trí sinh viên thực tập)\n(QL phần mềm, CSDL, QA/QC)", "#7c3aed")
    ]
    for (xy, w, h, text, col) in boxes:
        p = patches.FancyBboxPatch(xy, w, h, boxstyle="round,pad=0.08", ec=col, fc=col)
        ax.add_patch(p)
        ax.text(xy[0] + w/2, xy[1] + h/2, text, color="white", weight="bold", ha="center", va="center", fontsize=8.5)

    # Đường nối
    ax.plot([5.0, 5.0], [5.5, 4.7], color="#64748b", lw=2)
    ax.plot([5.0, 5.0], [3.8, 3.2], color="#64748b", lw=2)
    ax.plot([1.7, 8.3], [3.2, 3.2], color="#64748b", lw=2)
    ax.plot([1.7, 1.7], [3.2, 2.8], color="#64748b", lw=2)
    ax.plot([5.0, 5.0], [3.2, 2.8], color="#64748b", lw=2)
    ax.plot([8.3, 8.3], [3.2, 2.8], color="#64748b", lw=2)

    plt.tight_layout()
    plt.savefig("docs/diagrams/hinh_1_2_so_do_to_chuc.png", dpi=300)
    plt.close()
    print("Done org chart")

def create_testing_process():
    fig, ax = plt.subplots(figsize=(11, 4.5), dpi=300)
    ax.set_xlim(0, 11)
    ax.set_ylim(0, 4)
    ax.axis('off')

    steps = [
        ("Bước 1", "Tiếp nhận\nYêu cầu", "#1e3a8a"),
        ("Bước 2", "Phân tích\nNghiệp vụ", "#2563eb"),
        ("Bước 3", "Xây dựng\nChecklist", "#0284c7"),
        ("Bước 4", "Thiết kế\nTest Cases", "#0d9488"),
        ("Bước 5", "Thực thi Test\n& Bug Report", "#d97706"),
        ("Bước 6", "Kiểm thử lại\n(Retest)", "#ea580c"),
        ("Bước 7", "Báo cáo\nTest Summary", "#16a34a"),
    ]

    for i, (b, title, col) in enumerate(steps):
        x = 0.3 + i * 1.5
        box = patches.FancyBboxPatch((x, 1.2), 1.35, 1.6, boxstyle="round,pad=0.08", ec=col, fc=col)
        ax.add_patch(box)
        ax.text(x + 0.675, 2.4, b, color="#fef08a", weight="bold", ha="center", va="center", fontsize=9)
        ax.text(x + 0.675, 1.7, title, color="white", weight="bold", ha="center", va="center", fontsize=8.5)
        if i < len(steps) - 1:
            ax.annotate('', xy=(x + 1.5, 2.0), xytext=(x + 1.35, 2.0),
                        arrowprops=dict(facecolor='#64748b', edgecolor='#64748b', arrowstyle='->', lw=2))

    plt.tight_layout()
    plt.savefig("docs/diagrams/hinh_2_2_quy_trinh_kiem_thu.png", dpi=300)
    plt.close()
    print("Done testing process")

def create_system_architecture():
    fig, ax = plt.subplots(figsize=(11, 7), dpi=300)
    ax.set_xlim(0, 11)
    ax.set_ylim(0, 8)
    ax.axis('off')

    # 1. Tầng Giao diện
    ax.text(0.5, 7.5, "1. TẦNG TRÌNH DIỄN (CLIENTS - REACT 19 / TYPESCRIPT / TAILWIND CSS)", fontsize=10, weight="bold", color="#1e3a8a")
    clients = [
        ((0.5, 6.2), 3.0, 1.0, "Cán bộ Một cửa & Thẩm định\n(Web Portal Quản lý Hồ sơ)", "#2563eb"),
        ((4.0, 6.2), 3.0, 1.0, "Kiosk Đánh giá CSAT\n(Màn hình cảm ứng Độc lập)", "#0d9488"),
        ((7.5, 6.2), 3.0, 1.0, "Công dân & Thân nhân\n(Tra cứu CCCD & QR Code)", "#7c3aed"),
    ]
    for (xy, w, h, t, c) in clients:
        p = patches.FancyBboxPatch(xy, w, h, boxstyle="round,pad=0.08", ec=c, fc=c)
        ax.add_patch(p)
        ax.text(xy[0] + w/2, xy[1] + h/2, t, color="white", weight="bold", ha="center", va="center", fontsize=8.5)

    # 2. API Gateway
    ax.text(0.5, 5.6, "2. CỔNG ĐIỀU HƯỚNG & BẢO MẬT (API GATEWAY / REVERSE PROXY NGINX)", fontsize=10, weight="bold", color="#1e3a8a")
    gw = patches.FancyBboxPatch((0.5, 4.6), 10.0, 0.8, boxstyle="round,pad=0.08", ec="#334155", fc="#334155")
    ax.add_patch(gw)
    ax.text(5.5, 5.0, "NGINX REVERSE PROXY: SSL Termination (TLS 1.3) | Rate Limiting | CORS | Phân luồng Định tuyến", color="white", weight="bold", ha="center", va="center", fontsize=9)

    # 3. Backend Services
    ax.text(0.5, 4.0, "3. TẦNG DỊCH VỤ NGHIỆP VỤ (BACKEND SERVICES)", fontsize=10, weight="bold", color="#1e3a8a")
    be_node = patches.FancyBboxPatch((0.5, 2.3), 4.7, 1.5, boxstyle="round,pad=0.08", ec="#0284c7", fc="#0284c7")
    ax.add_patch(be_node)
    ax.text(2.85, 3.4, "NODE.JS (EXPRESS.JS ENGINE)", color="#fef08a", weight="bold", ha="center", va="center", fontsize=9.5)
    ax.text(2.85, 2.75, "- Xử lý CRUD hồ sơ, tra cứu I/O cao\n- Authentication & RBAC (JWT)\n- Citizen CSAT Feedback & AI Sentiment\n- Export Báo cáo Excel / PDF Mẫu C70a", color="white", ha="center", va="center", fontsize=8)

    be_java = patches.FancyBboxPatch((5.8, 2.3), 4.7, 1.5, boxstyle="round,pad=0.08", ec="#b45309", fc="#b45309")
    ax.add_patch(be_java)
    ax.text(8.15, 3.4, "JAVA (SPRING BOOT ENGINE)", color="#fef08a", weight="bold", ha="center", va="center", fontsize=9.5)
    ax.text(8.15, 2.75, "- Financial Core Engine (NĐ 75/2021)\n- Tính trợ cấp, phụ cấp chính xác (BigDecimal)\n- Transaction Management (ACID Rollback)\n- LGSP Integration Client (mTLS / OAuth 2.0)", color="white", ha="center", va="center", fontsize=8)

    # 4. Tầng Lưu trữ & Tích hợp
    ax.text(0.5, 1.7, "4. TẦNG CƠ SỞ DỮ LIỆU & TRỤC TÍCH HỢP LIÊN THÔNG", fontsize=10, weight="bold", color="#1e3a8a")
    db = patches.FancyBboxPatch((0.5, 0.4), 4.7, 1.1, boxstyle="round,pad=0.08", ec="#047857", fc="#047857")
    ax.add_patch(db)
    ax.text(2.85, 0.95, "CƠ SỞ DỮ LIỆU MYSQL 8.0 CLUSTER\n(16 Bảng chuẩn 3NF, B-Tree Indexes, ACID)", color="white", weight="bold", ha="center", va="center", fontsize=9)

    lgsp = patches.FancyBboxPatch((5.8, 0.4), 4.7, 1.1, boxstyle="round,pad=0.08", ec="#4338ca", fc="#4338ca")
    ax.add_patch(lgsp)
    ax.text(8.15, 0.95, "TRỤC LIÊN THÔNG DỮ LIỆU LGSP\n(Đồng bộ CSDL Tập trung Sở/Tỉnh & Đề án 06)", color="white", weight="bold", ha="center", va="center", fontsize=9)

    plt.tight_layout()
    plt.savefig("docs/diagrams/hinh_2_1_kien_truc_he_thong.png", dpi=300)
    plt.close()
    print("Done system architecture")

def create_lgsp_diagram():
    fig, ax = plt.subplots(figsize=(10, 5), dpi=300)
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 5)
    ax.axis('off')

    # Left: Hệ thống Phường
    p_phuong = patches.FancyBboxPatch((0.5, 1.5), 2.5, 2.0, boxstyle="round,pad=0.08", ec="#1e3a8a", fc="#1e3a8a")
    ax.add_patch(p_phuong)
    ax.text(1.75, 2.7, "HỆ THỐNG NỘI BỘ\nCẤP PHƯỜNG / THÀNH PHỐ", color="#fef08a", weight="bold", ha="center", va="center", fontsize=9)
    ax.text(1.75, 1.9, "Node.js + Spring Boot\nMySQL 8.0 Nội bộ", color="white", ha="center", va="center", fontsize=8.5)

    # Middle: Trục LGSP
    p_lgsp = patches.FancyBboxPatch((3.8, 1.2), 2.4, 2.6, boxstyle="round,pad=0.08", ec="#0284c7", fc="#0284c7")
    ax.add_patch(p_lgsp)
    ax.text(5.0, 3.2, "TRỤC TÍCH HỢP CHIA SẺ\nDỮ LIỆU LGSP", color="#fef08a", weight="bold", ha="center", va="center", fontsize=9)
    ax.text(5.0, 2.2, "- Kênh truyền mTLS 1.3\n- Xác thực OAuth 2.0\n- Hàng đợi Message Queue\n- Kiểm soát xung đột\n- Ghi vết kiểm toán", color="white", ha="center", va="center", fontsize=8)

    # Right: CSDL Tập trung
    p_so = patches.FancyBboxPatch((7.0, 1.5), 2.5, 2.0, boxstyle="round,pad=0.08", ec="#047857", fc="#047857")
    ax.add_patch(p_so)
    ax.text(8.25, 2.7, "CSDL TẬP TRUNG\nSỞ LĐ-TB&XH / TỈNH", color="#fef08a", weight="bold", ha="center", va="center", fontsize=9)
    ax.text(8.25, 1.9, "Cơ sở dữ liệu Quốc gia\n& Đề án 06/CP", color="white", ha="center", va="center", fontsize=8.5)

    # Arrows
    ax.annotate('', xy=(3.8, 2.8), xytext=(3.0, 2.8),
                arrowprops=dict(facecolor='#0284c7', edgecolor='#0284c7', arrowstyle='->', lw=2))
    ax.annotate('', xy=(3.0, 2.2), xytext=(3.8, 2.2),
                arrowprops=dict(facecolor='#0284c7', edgecolor='#0284c7', arrowstyle='->', lw=2))
    ax.text(3.4, 3.0, "Sync", color="#0f172a", fontsize=8, ha="center")
    ax.text(3.4, 2.0, "Ack", color="#0f172a", fontsize=8, ha="center")

    ax.annotate('', xy=(7.0, 2.8), xytext=(6.2, 2.8),
                arrowprops=dict(facecolor='#047857', edgecolor='#047857', arrowstyle='->', lw=2))
    ax.annotate('', xy=(6.2, 2.2), xytext=(7.0, 2.2),
                arrowprops=dict(facecolor='#047857', edgecolor='#047857', arrowstyle='->', lw=2))
    ax.text(6.6, 3.0, "Export", color="#0f172a", fontsize=8, ha="center")
    ax.text(6.6, 2.0, "Verify", color="#0f172a", fontsize=8, ha="center")

    plt.tight_layout()
    plt.savefig("docs/diagrams/hinh_2_8_so_do_lgsp.png", dpi=300)
    plt.close()
    print("Done lgsp diagram")

create_org_chart()
create_testing_process()
create_system_architecture()
create_lgsp_diagram()
print("All diagrams generated successfully!")
