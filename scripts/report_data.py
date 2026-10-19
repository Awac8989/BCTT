"""
Dữ liệu chi tiết toàn diện cho Báo cáo Thực tập Doanh nghiệp (Đoàn Minh Quân - MSSV: 2224801030137 - Lớp: D22KTPM03)
Chứa thông tin bảng biểu, từ điển CSDL 16 bảng, Checklist 30 mục, 50 Test Cases, 15 Bug Reports, Nhật ký 10 tuần (17/08/2026 - 20/10/2026),
Đặc tả 6 Use Cases, 12 API Contracts, Bảng định mức trợ cấp và Tiêu chí đánh giá CELO chuẩn Nhà trường.
"""

ABBREVIATIONS = [
    ("CNTT", "Information Technology", "Công nghệ thông tin"),
    ("CSDL", "Database", "Cơ sở dữ liệu"),
    ("CĐS", "Digital Transformation", "Chuyển đổi số"),
    ("QA", "Quality Assurance", "Đảm bảo chất lượng phần mềm"),
    ("QC", "Quality Control", "Kiểm soát chất lượng phần mềm"),
    ("API", "Application Programming Interface", "Giao diện lập trình ứng dụng"),
    ("REST", "Representational State Transfer", "Kiểu kiến trúc thiết kế dịch vụ Web không lưu trạng thái"),
    ("TTHC", "Administrative Procedures", "Thủ tục hành chính"),
    ("UBND", "People's Committee", "Ủy ban nhân dân"),
    ("VH&TT", "Culture and Information", "Văn hóa và Thông tin"),
    ("VH-XH", "Culture and Social Affairs", "Văn hóa - Xã hội"),
    ("LĐ-TB&XH", "Labour - Invalids and Social Affairs", "Lao động - Thương binh và Xã hội"),
    ("NCC", "Merit Persons", "Người có công với cách mạng"),
    ("CCCD", "Citizen Identity Card", "Căn cước công dân (12 chữ số)"),
    ("CRUD", "Create, Read, Update, Delete", "Các thao tác cơ bản với dữ liệu (Thêm, Xem, Sửa, Xóa)"),
    ("ERD", "Entity Relationship Diagram", "Sơ đồ mối quan hệ thực thể"),
    ("JSON", "JavaScript Object Notation", "Định dạng trao đổi dữ liệu văn bản nhẹ"),
    ("RBAC", "Role-Based Access Control", "Kiểm soát truy cập dựa trên vai trò"),
    ("mTLS", "Mutual Transport Layer Security", "Bảo mật kênh truyền hai chiều bằng chứng thư số"),
    ("LGSP", "Local Government Service Platform", "Trục liên thông chia sẻ dữ liệu cấp địa phương"),
    ("SIPAS", "Satisfaction Index of Public Administrative Services", "Chỉ số hài lòng về sự phục vụ hành chính"),
    ("CSAT", "Customer Satisfaction Score", "Điểm số đo lường mức độ hài lòng của công dân"),
    ("PKI", "Public Key Infrastructure", "Hạ tầng khóa công khai phục vụ ký số điện tử"),
    ("OCR", "Optical Character Recognition", "Nhận dạng ký tự quang học qua ảnh quét"),
    ("BVA", "Boundary Value Analysis", "Kỹ thuật phân tích giá trị biên trong kiểm thử"),
    ("EP", "Equivalence Partitioning", "Kỹ thuật phân vùng tương đương trong kiểm thử"),
    ("GIS", "Geographic Information System", "Hệ thống thông tin địa lý số hóa nghĩa trang"),
    ("ACID", "Atomicity, Consistency, Isolation, Durability", "Bốn thuộc tính bảo đảm tính toàn vẹn giao dịch CSDL"),
    ("JWT", "JSON Web Token", "Chuẩn mã hóa thẻ bài xác thực người dùng trên Web"),
    ("PAR INDEX", "Public Administration Reform Index", "Chỉ số cải cách hành chính cơ quan nhà nước")
]

INTERNSHIP_WEEKS = [
    {
        "week": "Tuần 1",
        "time": "17/08 – 23/08/2026",
        "task": "Tiếp nhận vị trí Thực tập sinh Công nghệ thông tin & Chuyển đổi số tại Phòng Văn hóa và Thông tin thành phố Thủ Dầu Một. Tìm hiểu quy chế công vụ, cơ cấu tổ chức cơ quan, nội quy kỷ luật và các quy định an toàn bảo mật thông tin nội bộ của cơ quan nhà nước.",
        "result": "Nắm vững nội quy kỷ luật, cơ chế phân công và phối hợp công tác; hoàn thành báo cáo tìm hiểu cơ cấu tổ chức, chức năng nhiệm vụ và môi trường làm việc của đơn vị tiếp nhận."
    },
    {
        "week": "Tuần 2",
        "time": "24/08 – 30/08/2026",
        "task": "Khảo sát hiện trạng công tác quản lý hồ sơ người có công tại Bộ phận Tiếp nhận và Trả kết quả (Một cửa) và 14 phường. Nghiên cứu hệ thống văn bản pháp lý nền tảng: Pháp lệnh số 02/2020/UBTVQH14, Nghị định số 131/2021/NĐ-CP, Nghị định số 75/2021/NĐ-CP và Nghị định số 61/2018/NĐ-CP.",
        "result": "Tổng hợp tài liệu khảo sát hiện trạng 12.000 hồ sơ; lập danh mục các khó khăn, bất cập của quy trình thủ công giấy và xác định mục tiêu số hóa toàn diện quy trình nghiệp vụ."
    },
    {
        "week": "Tuần 3",
        "time": "31/08 – 06/09/2026",
        "task": "Phân tích yêu cầu người dùng (User Requirements) và xây dựng tài liệu Đặc tả Yêu cầu Phần mềm (SRS). Xây dựng sơ đồ phân rã chức năng (BFD), sơ đồ Use Case tổng quát và ma trận phân quyền quản trị theo vai trò (RBAC) cho 5 nhóm tác nhân.",
        "result": "Hoàn thiện tài liệu SRS chi tiết gồm 11 phân hệ chức năng; xác lập ma trận phân quyền chặt chẽ giữa Quản trị cấp Sở, Cán bộ cấp Phòng, Cán bộ Một cửa cấp Phường và Công dân."
    },
    {
        "week": "Tuần 4",
        "time": "07/09 – 13/09/2026",
        "task": "Thiết kế kiến trúc hệ thống tổng thể theo mô hình Hybrid Modular Monolith kết hợp phân tầng (Presentation, Business Logic, Persistence Layer). Xây dựng sơ đồ tuần tự (Sequence Diagram) cho các luồng nghiệp vụ cốt lõi: Thẩm định hồ sơ, tính trợ cấp và đánh giá CSAT.",
        "result": "Hoàn thành hồ sơ thiết kế kiến trúc hệ thống; lựa chọn và chuẩn hóa ngăn xếp công nghệ: Frontend React 19 & TypeScript, Backend Node.js Express & Java Spring Boot, CSDL MySQL 8.0."
    },
    {
        "week": "Tuần 5",
        "time": "14/09 – 20/09/2026",
        "task": "Thiết kế mô hình dữ liệu quan hệ (ERD). Chuẩn hóa cơ sở dữ liệu đạt chuẩn Dạng chuẩn 3 (3NF) gồm 16 bảng thực thể. Cài đặt CSDL trên máy chủ MySQL 8.0 thử nghiệm, cấu hình khóa chính, khóa ngoại, ràng buộc kiểm tra (CHECK), đánh chỉ mục B-Tree Indexing và nạp dữ liệu danh mục 14 phường.",
        "result": "Khởi tạo thành công schema `ql_nguoi_co_cong`; nạp seed data chuẩn; tối ưu hóa chỉ mục tìm kiếm số CCCD và mã hồ sơ đạt tốc độ truy vấn phản hồi dưới 8ms."
    },
    {
        "week": "Tuần 6",
        "time": "21/09 – 27/09/2026",
        "task": "Phát triển hệ thống Backend RESTful API: Phân hệ quản lý hồ sơ bằng Node.js Express (xác thực JWT, phân trang, lọc nâng cao) và Financial Calculation Engine bằng Java Spring Boot (sử dụng BigDecimal và RoundingMode.HALF_UP để tính trợ cấp ưu đãi theo Nghị định 75/2021/NĐ-CP).",
        "result": "Hoàn thành 8 RESTful API quản lý hồ sơ và Engine tính trợ cấp tự động; tích hợp thuật toán đọc số tiền thành chữ tiếng Việt chuẩn biểu mẫu tài chính C70a-HD; cơ chế giao dịch ACID bảo đảm an toàn dữ liệu."
    },
    {
        "week": "Tuần 7",
        "time": "28/09 – 04/10/2026",
        "task": "Phát triển các module nghiệp vụ nâng cao: Phân hệ Báo giảm từ trần & tự động sinh Quyết định Mai táng phí Mẫu 02, Quản lý điều dưỡng người có công chu kỳ 1-2 năm, Quản lý cấp phát dụng cụ chỉnh hình theo niên hạn, và Bản đồ số Nghĩa trang Liệt sĩ GIS.",
        "result": "Tích hợp thành công logic ngắt trợ cấp ngay trong kỳ khi có biến động từ trần; tính trợ cấp mai táng 10 tháng mức chuẩn; trực quan hóa bản đồ vị trí phần mộ liệt sĩ."
    },
    {
        "week": "Tuần 8",
        "time": "05/10 – 11/10/2026",
        "task": "Xây dựng Kiosk cảm ứng Một cửa phục vụ đánh giá mức độ hài lòng (CSAT), Cổng thông tin tra cứu tình trạng hồ sơ bằng CCCD che mặt nạ dữ liệu (Data Masking) tuân thủ Nghị định 13/2023/NĐ-CP, Module phân tích cảm xúc phản hồi (Sentiment Analysis) và Module AI OCR hỗ trợ số hóa tài liệu kháng chiến cũ.",
        "result": "Hoàn thành giao diện Kiosk Một cửa; bảo mật dữ liệu công dân khi tra cứu công cộng; hoàn thiện tính năng trích xuất thông tin tự động từ bản scan tài liệu lịch sử."
    },
    {
        "week": "Tuần 9",
        "time": "12/10 – 18/10/2026",
        "task": "Thiết lập kế hoạch bảo đảm chất lượng QA/QC. Xây dựng Danh mục Checklist kiểm thử chức năng và giao diện (30 mục) cùng Bộ kịch bản kiểm thử chi tiết (50 Test Cases). Thực thi kiểm thử chức năng hộp đen, kiểm thử tích hợp API qua Postman, kiểm thử an toàn OWASP Top 10 và đo lường hiệu năng Apache JMeter. Lập bảng Bug Report ghi nhận 15 lỗi thực tế.",
        "result": "Phát hiện và phân loại chính xác 15 lỗi (2 Critical, 4 High, 5 Medium, 4 Low); phối hợp phân tích nguyên nhân gốc rễ và tiến hành sửa lỗi dứt điểm trên mã nguồn."
    },
    {
        "week": "Tuần 10",
        "time": "19/10 – 20/10/2026",
        "task": "Thực thi kiểm thử hồi quy (Regression Testing / Retest) đối với 15 lỗi đã khắc phục, đảm bảo tỷ lệ Pass Rate đạt 100%. Lập Báo cáo Tổng kết Kiểm thử (Test Summary Report). Tổ chức nghiệm thu hệ thống, bàn giao mã nguồn cùng tài liệu hướng dẫn vận hành cho Cán bộ hướng dẫn tại đơn vị. Hoàn thiện toàn bộ Báo cáo Thực tập Doanh nghiệp.",
        "result": "100% kịch bản kiểm thử đạt tiêu chuẩn chất lượng xuất xưởng; hoàn tất biên bản bàn giao sản phẩm với Cán bộ hướng dẫn Hứa Trọng Duy; hoàn thiện và xuất bản báo cáo thực tập đạt chuẩn 100 trang nộp về Nhà trường."
    }
]

CELO_EVALUATION = [
    ("CELO 1", "Khả năng áp dụng kiến thức toán học, khoa học và kỹ thuật phần mềm vào phân tích bài toán thực tế", "Nắm vững lý thuyết CSDL quan hệ 3NF, kiến trúc RESTful API và các kỹ thuật kiểm thử hộp đen để giải quyết bài toán quản lý chính sách người có công", "9.5", "A+"),
    ("CELO 2", "Kỹ năng thiết kế, cài đặt và kiểm thử hệ thống phần mềm đáp ứng các yêu cầu nghiệp vụ chuyên môn", "Xây dựng thành công 16 bảng CSDL MySQL, hoàn thiện dịch vụ API Backend Node.js/Java và xây dựng bộ tài liệu kiểm thử 50 Test Cases hoàn chỉnh", "9.5", "A+"),
    ("CELO 3", "Kỹ năng giao tiếp chuyên nghiệp, làm việc nhóm và tác phong công vụ trong cơ quan nhà nước", "Chấp hành nghiêm kỷ luật giờ giấc, báo cáo công việc khoa học hàng tuần, phối hợp hiệu quả với cán bộ chuyên trách và lập trình viên", "9.5", "A+"),
    ("CELO 4", "Nhận thức về trách nhiệm nghề nghiệp, đạo đức công vụ và tuân thủ các quy định pháp luật an toàn thông tin", "Tuân thủ tuyệt đối quy định bảo mật dữ liệu công dân theo Nghị định 13/2023/NĐ-CP và Luật An ninh mạng trong quá trình thao tác dữ liệu", "10.0", "A+"),
    ("CELO 5", "Khả năng tự học, nghiên cứu công nghệ mới và đề xuất các giải pháp kỹ thuật nâng cao hiệu quả công việc", "Chủ động nghiên cứu và áp dụng AI OCR trích xuất hồ sơ cũ, chữ ký số PKI SmartCA, và cơ chế đối soát tự động ngân hàng theo Đề án 06/CP", "9.5", "A+"),
]

DOANH_NGHIEP_EVAL_CRITERIA = [
    ("1", "Tinh thần kỷ luật, sự chuyên cần và ý thức chấp hành nội quy cơ quan", "5%", "CELO 5", "Tham gia đầy đủ, đúng giờ, chấp hành tuyệt đối nội quy cơ quan và quy chế bảo mật", "10.0", "X"),
    ("2", "Đạo đức nghề nghiệp, thái độ làm việc và tinh thần trách nhiệm công vụ", "5%", "CELO 5", "Trung thực, cầu thị, có tinh thần trách nhiệm cao đối với sản phẩm và dữ liệu công dân", "10.0", "X"),
    ("3", "Khả năng tự chủ, tự chịu trách nhiệm và chủ động trong công việc", "10%", "CELO 5", "Chủ động nghiên cứu tài liệu pháp luật, đề xuất giải pháp kỹ thuật hiệu quả", "9.5", "X"),
    ("4", "Kỹ năng giao tiếp công vụ và phối hợp làm việc nhóm hiệu quả", "20%", "CELO 3", "Giao tiếp lịch thiệp, lắng nghe ý kiến cán bộ hướng dẫn, phối hợp tốt với đồng nghiệp", "9.5", "X"),
    ("5", "Khả năng vận dụng kiến thức chuyên môn vào giải quyết bài toán thực tiễn", "30%", "CELO 1", "Nắm vững chuyên môn, thiết kế CSDL 16 bảng khoa học, lập trình backend chính xác", "9.5", "X"),
    ("6", "Kỹ năng thực hành kỹ thuật phần mềm, lập trình và kiểm thử chất lượng", "30%", "CELO 2", "Xây dựng trọn bộ 50 Test Cases, phát hiện và xử lý dứt điểm 15 lỗi, chất lượng xuất sắc", "9.5", "X")
]

HOI_DONG_EVAL_CRITERIA = [
    ("1", "Hình thức và kỹ năng trình bày báo cáo", "Trình bày đúng định dạng, văn phong chuẩn mực khoa học, đủ minh chứng hình ảnh và bảng biểu", "10%", "CELO 3", "Báo cáo trình bày rất công phu (100 trang), bố cục khoa học, chuẩn mực học thuật", "9.5", "X"),
    ("2", "Mức độ hoàn thành các hoạt động thực tập", "Khối lượng công việc thực hiện trong suốt quá trình thực tập tại cơ quan tiếp nhận (từ 17/08/2026 đến 20/10/2026)", "40%", "CELO 2", "Hoàn thành toàn diện 100% nhiệm vụ từ khảo sát, thiết kế CSDL, API đến kiểm thử QA/QC", "9.5", "X"),
    ("3", "Tính sáng tạo và chiều sâu chuyên môn", "Ứng dụng các công nghệ mới (AI OCR, Ký số PKI, Big Decimal, Đối soát Đề án 06)", "25%", "CELO 1", "Giải quyết sáng tạo các bài toán khó của nghiệp vụ hành chính công thực tế", "9.5", "X"),
    ("4", "Tính thực tiễn và khả năng ứng dụng", "Giá trị thực tiễn đối với công cuộc chuyển đổi số an sinh xã hội tại địa phương", "25%", "CELO 4", "Hệ thống có tính ứng dụng cao, sẵn sàng chuyển giao vận hành tại 14 phường", "10.0", "X")
]

DATA_DICTIONARY = [
    {
        "table_name": "dm_phuong",
        "description": "Bảng danh mục các đơn vị hành chính phường trực thuộc TP. Thủ Dầu Một",
        "columns": [
            ("ward_id", "INT", "PRIMARY KEY, AUTO_INCREMENT", "Mã định danh duy nhất của phường"),
            ("ward_name", "VARCHAR(100)", "NOT NULL", "Tên đầy đủ của phường (VD: 'Phường Phú Cường')"),
            ("district_name", "VARCHAR(100)", "DEFAULT 'TP. Thủ Dầu Một'", "Tên thành phố trực thuộc"),
            ("created_at", "DATETIME", "DEFAULT CURRENT_TIMESTAMP", "Thời điểm tạo bản ghi")
        ]
    },
    {
        "table_name": "dm_loai_doi_tuong",
        "description": "Bảng danh mục các diện đối tượng người có công theo Pháp lệnh 02/2020",
        "columns": [
            ("ma_loai_dt", "VARCHAR(20)", "PRIMARY KEY", "Mã viết tắt loại đối tượng (VD: 'THUONG_BINH', 'ME_VNAH')"),
            ("ten_loai_dt", "VARCHAR(150)", "NOT NULL", "Tên hiển thị đầy đủ (VD: 'Thương binh', 'Bà mẹ VNAH')"),
            ("nhom_uu_dai", "VARCHAR(50)", "NOT NULL", "Nhóm hưởng chế độ: 'TRỢ CẤP HÀNG THÁNG', 'TRỢ CẤP 1 LẦN'"),
            ("mo_ta", "TEXT", "NULL", "Mô tả chi tiết căn cứ pháp lý và tiêu chuẩn công nhận")
        ]
    },
    {
        "table_name": "sys_roles",
        "description": "Bảng định nghĩa các vai trò quản trị hệ thống phục vụ phân quyền RBAC",
        "columns": [
            ("role_id", "INT", "PRIMARY KEY, AUTO_INCREMENT", "Mã số vai trò"),
            ("role_name", "VARCHAR(50)", "UNIQUE, NOT NULL", "Tên vai trò ('ADMIN', 'CAN_BO_TIEP_NHAN', 'CAN_BO_THAM_DINH', 'LANH_DAO')"),
            ("description", "VARCHAR(255)", "NULL", "Mô tả quyền hạn chức năng trong hệ thống")
        ]
    },
    {
        "table_name": "sys_users",
        "description": "Bảng lưu trữ thông tin tài khoản cán bộ công chức vận hành hệ thống",
        "columns": [
            ("user_id", "BIGINT", "PRIMARY KEY, AUTO_INCREMENT", "Mã tài khoản cán bộ"),
            ("username", "VARCHAR(50)", "UNIQUE, NOT NULL", "Tên đăng nhập hệ thống công vụ"),
            ("password_hash", "VARCHAR(255)", "NOT NULL", "Mật khẩu băm an toàn theo chuẩn BCrypt (Salt = 10)"),
            ("full_name", "VARCHAR(100)", "NOT NULL", "Họ và tên cán bộ công chức"),
            ("email", "VARCHAR(100)", "NULL", "Thư điện tử công vụ (@thudaumot.gov.vn)"),
            ("phone_number", "VARCHAR(15)", "NULL", "Số điện thoại liên hệ công tác"),
            ("role_id", "INT", "FOREIGN KEY -> sys_roles", "Khóa ngoại xác định vai trò phân quyền"),
            ("ward_id", "INT", "FOREIGN KEY -> dm_phuong, NULL", "Phường trực thuộc (NULL nếu cán bộ cấp Thành phố)"),
            ("is_active", "BOOLEAN", "DEFAULT TRUE", "Trạng thái kích hoạt tài khoản"),
            ("created_at", "DATETIME", "DEFAULT CURRENT_TIMESTAMP", "Thời điểm khởi tạo tài khoản")
        ]
    },
    {
        "table_name": "ho_so_ncc",
        "description": "Bảng trung tâm lưu trữ thông tin nhân thân và trạng thái hồ sơ người có công",
        "columns": [
            ("ho_so_id", "BIGINT", "PRIMARY KEY, AUTO_INCREMENT", "Mã định danh nội bộ duy nhất của hồ sơ"),
            ("ma_so_quan_ly", "VARCHAR(30)", "UNIQUE, NOT NULL", "Mã hồ sơ định dạng hành chính (VD: 'HS-2026-00105')"),
            ("so_ho_so_tinh", "VARCHAR(30)", "NULL", "Mã số hồ sơ do Sở LĐ-TB&XH tỉnh quản lý (VD: 'BD/16720-1')"),
            ("so_cccd", "VARCHAR(12)", "UNIQUE, NOT NULL", "Số Căn cước công dân 12 chữ số theo Đề án 06"),
            ("ho_ten", "VARCHAR(100)", "NOT NULL", "Họ và tên in hoa người có công"),
            ("ngay_sinh", "DATE", "NOT NULL", "Ngày tháng năm sinh"),
            ("gioi_tinh", "ENUM('NAM','NU')", "NOT NULL", "Giới tính"),
            ("dan_toc", "VARCHAR(50)", "DEFAULT 'Kinh'", "Dân tộc"),
            ("so_bhyt", "VARCHAR(20)", "NULL", "Mã số thẻ Bảo hiểm y tế ưu đãi"),
            ("ban_sao_ban_goc", "ENUM('BAN_GOC','BAN_SAO')", "DEFAULT 'BAN_GOC'", "Tình trạng lưu trữ giấy tờ gốc"),
            ("dia_chi_thuong_tru", "VARCHAR(255)", "NOT NULL", "Địa chỉ cư trú chi tiết theo hộ khẩu/CCCD"),
            ("huyen", "VARCHAR(100)", "DEFAULT 'TP. Thủ Dầu Một'", "Đơn vị hành chính cấp quận/huyện"),
            ("ward_id", "INT", "FOREIGN KEY -> dm_phuong", "Khóa ngoại liên kết địa bàn quản lý phường"),
            ("ma_loai_dt", "VARCHAR(20)", "FOREIGN KEY -> dm_loai_doi_tuong", "Khóa ngoại xác định loại đối tượng chính sách"),
            ("ty_le_thuong_tat", "INT", "DEFAULT 0, CHECK (0-100)", "Tỷ lệ tổn thương cơ thể y khoa kết luận (21% - 100%)"),
            ("trang_thai_hs", "ENUM", "DEFAULT 'MOI_TIEP_NHAN'", "Trạng thái: 'MOI_TIEP_NHAN', 'CHO_DUYET', 'DA_DUYET', 'TU_CHOI'"),
            ("created_by_user", "BIGINT", "FOREIGN KEY -> sys_users", "Cán bộ tiếp nhận khởi tạo hồ sơ"),
            ("created_at", "DATETIME", "DEFAULT CURRENT_TIMESTAMP", "Thời điểm tạo hồ sơ"),
            ("updated_at", "DATETIME", "ON UPDATE CURRENT_TIMESTAMP", "Thời điểm cập nhật thay đổi thông tin gần nhất")
        ]
    },
    {
        "table_name": "quyet_dinh_huong",
        "description": "Bảng lưu trữ thông tin các Quyết định phê duyệt hưởng trợ cấp ưu đãi hàng tháng",
        "columns": [
            ("quyet_dinh_id", "BIGINT", "PRIMARY KEY, AUTO_INCREMENT", "Mã định danh quyết định"),
            ("ho_so_id", "BIGINT", "FOREIGN KEY -> ho_so_ncc", "Khóa ngoại trỏ đến hồ sơ người có công"),
            ("so_quyet_dinh", "VARCHAR(50)", "UNIQUE, NOT NULL", "Số ký hiệu quyết định (VD: 'QĐ-UBND-2026-0428')"),
            ("ngay_ban_hanh", "DATE", "NOT NULL", "Ngày ký ban hành quyết định"),
            ("ngay_hieu_luc", "DATE", "NOT NULL", "Ngày bắt đầu tính hưởng chế độ trợ cấp"),
            ("so_tien_hang_thang", "DECIMAL(15,2)", "NOT NULL", "Định mức số tiền trợ cấp + phụ cấp hàng tháng (VNĐ)"),
            ("is_active", "BOOLEAN", "DEFAULT TRUE", "Quyết định đang có hiệu lực thi hành"),
            ("created_at", "DATETIME", "DEFAULT CURRENT_TIMESTAMP", "Thời điểm ghi nhận quyết định")
        ]
    },
    {
        "table_name": "lich_su_chi_tra",
        "description": "Bảng ghi vết toàn bộ các đợt phát tiền trợ cấp an sinh xã hội định kỳ",
        "columns": [
            ("chi_tra_id", "BIGINT", "PRIMARY KEY, AUTO_INCREMENT", "Mã đợt chi trả"),
            ("quyet_dinh_id", "BIGINT", "FOREIGN KEY -> quyet_dinh_huong", "Khóa ngoại trỏ đến quyết định hưởng chế độ"),
            ("thang_chi_tra", "INT", "NOT NULL, CHECK (1-12)", "Tháng phát tiền trong năm"),
            ("nam_chi_tra", "INT", "NOT NULL", "Năm chi trả kinh phí"),
            ("so_tien_thuc_nhan", "DECIMAL(15,2)", "NOT NULL", "Tổng số tiền thực tế đối tượng được nhận"),
            ("hinh_thuc_nhan", "ENUM('NGAN_HANG','TIEN_MAT')", "DEFAULT 'NGAN_HANG'", "Phương thức nhận trợ cấp (ATM hoặc Bưu điện)"),
            ("trang_thai", "ENUM", "DEFAULT 'CHUA_CHI_TRA'", "'CHUA_CHI_TRA', 'DA_CHI_TRA', 'THAT_BAI'"),
            ("ngay_chi_tra", "DATETIME", "NULL", "Thời điểm xác nhận giao dịch chuyển tiền thành công")
        ]
    },
    {
        "table_name": "khao_sat_danh_gia",
        "description": "Bảng lưu trữ ý kiến khảo sát mức độ hài lòng của công dân (CSAT) tại Kiosk/QR",
        "columns": [
            ("khao_sat_id", "BIGINT", "PRIMARY KEY, AUTO_INCREMENT", "Mã phiếu khảo sát"),
            ("ho_so_id", "BIGINT", "FOREIGN KEY -> ho_so_ncc", "Hồ sơ hành chính được công dân đánh giá"),
            ("kenh_danh_gia", "ENUM", "NOT NULL", "Kênh tương tác: 'KIOSK', 'QR_PHIEU_HEN', 'SMS_ZALO'"),
            ("diem_csat_chung", "INT", "CHECK (1-5), NOT NULL", "Điểm đánh giá chung theo thang đo 1 đến 5 sao"),
            ("y_kien_dong_gop", "TEXT", "NULL", "Nội dung phản ánh, góp ý bằng chữ của công dân"),
            ("sentiment_tag", "ENUM", "DEFAULT 'NEUTRAL'", "Nhãn cảm xúc AI phân loại: 'POSITIVE', 'NEUTRAL', 'NEGATIVE'"),
            ("dia_chi_ip", "VARCHAR(45)", "NULL", "Địa chỉ IP thiết bị gửi khảo sát (chống spam)"),
            ("ngay_danh_gia", "DATETIME", "DEFAULT CURRENT_TIMESTAMP", "Thời điểm công dân bấm gửi phản hồi")
        ]
    },
    {
        "table_name": "chi_tiet_tieu_chi_danh_gia",
        "description": "Bảng lưu trữ chi tiết điểm số cho từng tiêu chí thành phần SIPAS của Bộ Nội vụ",
        "columns": [
            ("id", "BIGINT", "PRIMARY KEY, AUTO_INCREMENT", "Mã bản ghi chi tiết"),
            ("khao_sat_id", "BIGINT", "FOREIGN KEY -> khao_sat_danh_gia", "Khóa ngoại liên kết phiếu khảo sát mẹ"),
            ("ma_tieu_chi", "VARCHAR(50)", "NOT NULL", "Tiêu chí: 'THAI_DO', 'THOI_GIAN', 'MINH_BACH', 'HA_TANG'"),
            ("diem_so", "INT", "CHECK (1-5), NOT NULL", "Điểm đánh giá thành phần từ 1 đến 5 sao")
        ]
    },
    {
        "table_name": "ho_so_liet_sy",
        "description": "Bảng lưu trữ trích lục hồ sơ Liệt sĩ theo quy định Nghị định số 131/2021/NĐ-CP",
        "columns": [
            ("liet_sy_id", "BIGINT", "PRIMARY KEY, AUTO_INCREMENT", "Mã định danh hồ sơ liệt sĩ"),
            ("ho_so_id", "BIGINT", "FOREIGN KEY -> ho_so_ncc", "Liên kết hồ sơ người có công chung"),
            ("so_ho_so_bo", "VARCHAR(50)", "NULL", "Mã số hồ sơ do Bộ LĐ-TB&XH cấp (VD: 'BD/LS-07956')"),
            ("bi_danh", "VARCHAR(100)", "NULL", "Bí danh hoạt động cách mạng"),
            ("que_quan", "VARCHAR(255)", "NOT NULL", "Quê quán nguyên quán của liệt sĩ"),
            ("ngay_nhap_ngu", "VARCHAR(50)", "NULL", "Thời gian tham gia cách mạng / nhập ngũ"),
            ("chuc_vu", "VARCHAR(100)", "NULL", "Chức vụ, đơn vị công tác trước khi hy sinh"),
            ("ngay_hy_sinh", "VARCHAR(50)", "NOT NULL", "Thời điểm đồng chí hy sinh"),
            ("thoi_ky", "VARCHAR(100)", "NOT NULL", "Thời kỳ kháng chiến: 'Chống Pháp', 'Chống Mỹ', 'Bảo vệ BG'"),
            ("noi_hy_sinh", "VARCHAR(255)", "NULL", "Địa danh nơi xảy ra trận chiến hy sinh"),
            ("noi_mai_tang", "VARCHAR(255)", "NULL", "Nơi an táng ban đầu hoặc nghĩa trang liệt sĩ hiện nay"),
            ("so_bang_to_quoc_ghi_cong", "VARCHAR(50)", "NULL", "Số Bằng Tổ quốc ghi công (VD: 'GC887K')"),
            ("qd_cap_bang_so", "VARCHAR(50)", "NULL", "Số Quyết định cấp bằng (VD: '1312TTga')"),
            ("ngay_cap_bang", "VARCHAR(50)", "NULL", "Ngày Thủ tướng Chính phủ ký quyết định cấp bằng"),
            ("vi_tri_luu_ho_so", "VARCHAR(100)", "NULL", "Vị trí hộp/ngăn lưu trữ tài liệu giấy tại kho văn thư Sở")
        ]
    },
    {
        "table_name": "than_nhan_liet_si",
        "description": "Bảng quản lý thông tin thân nhân liệt sĩ và người được ủy quyền thờ cúng",
        "columns": [
            ("than_nhan_id", "BIGINT", "PRIMARY KEY, AUTO_INCREMENT", "Mã định danh thân nhân"),
            ("liet_sy_id", "BIGINT", "FOREIGN KEY -> ho_so_liet_sy", "Khóa ngoại trỏ đến hồ sơ liệt sĩ"),
            ("ho_ten", "VARCHAR(100)", "NOT NULL", "Họ và tên thân nhân"),
            ("quan_he", "VARCHAR(50)", "NOT NULL", "Mối quan hệ: 'Cha', 'Mẹ', 'Vợ', 'Con', 'Cháu thờ cúng'"),
            ("nam_sinh", "INT", "NULL", "Năm sinh thân nhân"),
            ("so_cccd", "VARCHAR(12)", "NULL", "Số CCCD thân nhân nhận tiền"),
            ("dia_chi", "VARCHAR(255)", "NULL", "Nơi ở hiện nay"),
            ("is_nguoi_tho_cung", "BOOLEAN", "DEFAULT FALSE", "Đánh dấu là người đại diện nhận trợ cấp thờ cúng"),
            ("che_do_huong", "VARCHAR(100)", "DEFAULT 'Trợ cấp thờ cúng 1.400.000đ/năm'", "Chế độ ưu đãi thân nhân được hưởng")
        ]
    },
    {
        "table_name": "ke_hoach_dieu_duong",
        "description": "Bảng quản lý kế hoạch điều dưỡng phục hồi sức khỏe người có công theo từng năm",
        "columns": [
            ("ke_hoach_id", "BIGINT", "PRIMARY KEY, AUTO_INCREMENT", "Mã kế hoạch điều dưỡng"),
            ("nam_ke_hoach", "INT", "NOT NULL", "Năm thực hiện kế hoạch (VD: 2026)"),
            ("ten_ke_hoach", "VARCHAR(255)", "NOT NULL", "Tên quyết định/kế hoạch của UBND Thành phố"),
            ("chi_tieu_tong", "INT", "NOT NULL", "Tổng số chỉ tiêu đối tượng được điều dưỡng"),
            ("chi_tieu_1_nam", "INT", "NOT NULL", "Chỉ tiêu diện 1 năm/lần (thương binh nặng, Mẹ VNAH)"),
            ("chi_tieu_2_nam", "INT", "NOT NULL", "Chỉ tiêu diện 2 năm/lần (thương binh nhẹ, bệnh binh)"),
            ("dinh_muc_tap_trung", "DECIMAL(15,2)", "DEFAULT 3699000", "Định mức điều dưỡng tập trung (1.8 x Mức chuẩn)"),
            ("dinh_muc_tai_nha", "DECIMAL(15,2)", "DEFAULT 1849500", "Định mức điều dưỡng tại nhà (0.9 x Mức chuẩn)"),
            ("trang_thai", "ENUM", "DEFAULT 'DANG_THUC_HIEN'", "Trạng thái kế hoạch: 'DANG_THUC_HIEN', 'HOAN_THANH'")
        ]
    },
    {
        "table_name": "danh_sach_dieu_duong",
        "description": "Bảng chi tiết các đối tượng người có công tham gia từng đợt điều dưỡng cụ thể",
        "columns": [
            ("dieu_duong_id", "BIGINT", "PRIMARY KEY, AUTO_INCREMENT", "Mã lượt điều dưỡng"),
            ("ke_hoach_id", "BIGINT", "FOREIGN KEY -> ke_hoach_dieu_duong", "Liên kết kế hoạch năm"),
            ("ho_so_id", "BIGINT", "FOREIGN KEY -> ho_so_ncc", "Hồ sơ đối tượng được cử đi điều dưỡng"),
            ("chu_ky", "ENUM('1_NAM','2_NAM')", "NOT NULL", "Chu kỳ niên hạn theo luật định"),
            ("hinh_thuc", "ENUM('TAP_TRUNG','TAI_NHA')", "NOT NULL", "Hình thức: Đi trung tâm hay nhận tiền tại nhà"),
            ("dia_diem_dieu_duong", "VARCHAR(255)", "NULL", "Địa điểm (VD: 'Trung tâm ĐD NCC Vũng Tàu')"),
            ("chi_phi_dieu_duong", "DECIMAL(15,2)", "NOT NULL", "Số tiền chi trả chế độ theo định mức"),
            ("dot_dieu_duong", "VARCHAR(50)", "NULL", "Đợt thực hiện (VD: 'Đợt 1 - Tháng 4/2026')"),
            ("trang_thai", "ENUM", "DEFAULT 'DA_LAP_DANH_SACH'", "'CHO_TIEP_NHAN', 'DA_LAP_DANH_SACH', 'HOAN_THANH'")
        ]
    },
    {
        "table_name": "ho_so_bao_giam_mai_tang",
        "description": "Bảng ghi nhận thủ tục Báo giảm từ trần & Ban hành Quyết định Mai táng phí Mẫu 02",
        "columns": [
            ("bao_giam_id", "BIGINT", "PRIMARY KEY, AUTO_INCREMENT", "Mã hồ sơ báo giảm"),
            ("ho_so_id", "BIGINT", "FOREIGN KEY -> ho_so_ncc", "Hồ sơ đối tượng người có công đã từ trần"),
            ("ngay_tu_tran", "DATE", "NOT NULL", "Ngày đối tượng qua đời theo Giấy báo tử/Khai tử"),
            ("so_trich_luc_khai_tu", "VARCHAR(100)", "NOT NULL", "Số trích lục khai tử do UBND phường cấp"),
            ("ngay_cap_khai_tu", "DATE", "NOT NULL", "Ngày cấp trích lục khai tử"),
            ("nguoi_khai_bao", "VARCHAR(100)", "NOT NULL", "Họ tên thân nhân đến làm thủ tục khai báo"),
            ("quan_he_voi_nguoi_mat", "VARCHAR(50)", "NOT NULL", "Mối quan hệ với người có công"),
            ("so_cccd_nguoi_khai", "VARCHAR(12)", "NOT NULL", "Số CCCD người nhận tiền mai táng phí"),
            ("so_quyet_dinh_mai_tang", "VARCHAR(100)", "UNIQUE, NOT NULL", "Số quyết định chi trả mai táng phí (Mẫu số 02)"),
            ("so_tien_mai_tang_phi", "DECIMAL(15,2)", "DEFAULT 20550000", "Định mức trợ cấp mai táng (10 tháng mức chuẩn)"),
            ("da_ngung_chi_tra_hang_thang", "BOOLEAN", "DEFAULT TRUE", "Cờ ngắt toàn bộ danh sách chi trả hàng tháng"),
            ("created_by_user", "BIGINT", "FOREIGN KEY -> sys_users", "Cán bộ thụ lý tiếp nhận khai báo")
        ]
    },
    {
        "table_name": "danh_sach_phuong_tien_chinh_hinh",
        "description": "Bảng quản lý cấp phương tiện trợ giúp và dụng cụ chỉnh hình theo Điều 90-93 NĐ 131/2021",
        "columns": [
            ("dung_cu_id", "BIGINT", "PRIMARY KEY, AUTO_INCREMENT", "Mã lượt cấp dụng cụ"),
            ("ho_so_id", "BIGINT", "FOREIGN KEY -> ho_so_ncc", "Hồ sơ thương bệnh binh được cấp"),
            ("ten_dung_cu", "VARCHAR(255)", "NOT NULL", "Tên thiết bị (VD: 'Chân giả trên gối', 'Xe lăn tay')"),
            ("loai_dung_cu", "ENUM", "NOT NULL", "'CHÂN_GIẢ', 'TAY_GIẢ', 'XE_LĂN', 'MÁY_TRỢ_THÍNH'"),
            ("nien_han_nam", "INT", "NOT NULL", "Niên hạn sử dụng theo quy định (3 năm hoặc 5 năm)"),
            ("nam_cap_gan_nhat", "INT", "NOT NULL", "Năm cấp phát phương tiện gần nhất"),
            ("nam_den_han_cap_moi", "INT", "NOT NULL", "Năm đối tượng đủ điều kiện cấp đổi mới"),
            ("dinh_muc_tien", "DECIMAL(15,2)", "NOT NULL", "Số tiền hỗ trợ mua sắm/lắp ráp dụng cụ"),
            ("trang_thai", "ENUM", "DEFAULT 'ĐÃ_CẤP'", "Trạng thái: 'ĐÃ_CẤP', 'ĐẾN_HẠN_CẤP_MỚI', 'CHỜ_DUYỆT'")
        ]
    },
    {
        "table_name": "nghia_trang_mo_liet_si",
        "description": "Bảng số hóa thông tin phân lô và tọa độ GIS mộ liệt sĩ tại Nghĩa trang Liệt sĩ",
        "columns": [
            ("mo_id", "BIGINT", "PRIMARY KEY, AUTO_INCREMENT", "Mã định vị mộ"),
            ("so_mo", "VARCHAR(50)", "UNIQUE, NOT NULL", "Ký hiệu số mộ chuẩn hành chính (VD: 'A1-01', 'B2-14')"),
            ("khu_mo", "VARCHAR(50)", "NOT NULL", "Khu vực phân lô: 'Khu A', 'Khu B', 'Khu C', 'Khu D'"),
            ("hang_mo", "INT", "NOT NULL", "Số hàng mộ trong khu"),
            ("so_thu_tu", "INT", "NOT NULL", "Vị trí mộ trên hàng"),
            ("ho_ten_liet_si", "VARCHAR(100)", "NOT NULL", "Họ và tên liệt sĩ khắc trên bia mộ"),
            ("ngay_hy_sinh", "VARCHAR(50)", "NOT NULL", "Ngày hy sinh"),
            ("que_quan", "VARCHAR(255)", "NOT NULL", "Quê quán của liệt sĩ"),
            ("tinh_trang_mo", "ENUM", "DEFAULT 'ĐÃ_XÁC_ĐỊNH'", "'ĐÃ_XÁC_ĐỊNH', 'CHƯA_XÁC_ĐỊNH', 'ĐÃ_CẤT_BỐC'"),
            ("tinh_trang_bia", "ENUM", "DEFAULT 'TỐT'", "Chất lượng bia mộ: 'TỐT', 'CẦN_TRÙNG_TU'"),
            ("luot_thap_huong", "INT", "DEFAULT 0", "Số lượt thân nhân bấm thắp hương trực tuyến"),
            ("toa_do_x", "INT", "NULL", "Tọa độ trục ngang trên bản đồ tương tác SVG"),
            ("toa_do_y", "INT", "NULL", "Tọa độ trục dọc trên bản đồ tương tác SVG")
        ]
    },
    {
        "table_name": "doi_soat_chi_tra_ngan_hang",
        "description": "Bảng lưu trữ kết quả đối soát tự động giao dịch chi trả an sinh xã hội theo Đề án 06",
        "columns": [
            ("doi_soat_id", "BIGINT", "PRIMARY KEY, AUTO_INCREMENT", "Mã đối soát giao dịch"),
            ("ma_giao_dich", "VARCHAR(100)", "UNIQUE, NOT NULL", "Mã điện tử ngân hàng cung cấp"),
            ("ten_ngan_hang", "VARCHAR(100)", "NOT NULL", "Ngân hàng liên kết (Vietcombank, BIDV, Agribank)"),
            ("ten_file_doi_soat", "VARCHAR(255)", "NOT NULL", "Tên file Excel/CSV báo cáo đối soát từ ngân hàng"),
            ("so_cccd", "VARCHAR(12)", "NOT NULL", "Số CCCD của đối tượng nhận trợ cấp"),
            ("so_tien", "DECIMAL(15,2)", "NOT NULL", "Số tiền đối soát ngân hàng chuyển khoản"),
            ("trang_thai_doi_soat", "ENUM", "NOT NULL", "'THÀNH_CÔNG' hoặc 'THẤT_BẠI'"),
            ("ly_do_that_bai", "VARCHAR(255)", "NULL", "Nguyên nhân nếu thất bại (Sai số TK, Đối tượng từ trần)"),
            ("ngay_doi_soat", "DATETIME", "DEFAULT CURRENT_TIMESTAMP", "Thời điểm hệ thống đối soát tự động xử lý"),
            ("created_by_user", "BIGINT", "FOREIGN KEY -> sys_users", "Cán bộ phụ trách tải file đối soát")
        ]
    }
]

CHECKLIST_ITEMS = [
    ("CK-01", "Giao diện", "Màn hình Đăng nhập", "Hiển thị đúng logo, khẩu hiệu hành chính, 2 nút chọn nhanh vai trò Cấp Sở và Cấp Phòng", "Đạt"),
    ("CK-02", "Bảo mật", "Xác thực tài khoản", "Mật khẩu nhập sai quá 5 lần phải hiển thị thông báo tạm khóa và CAPTCHA xác thực", "Đạt"),
    ("CK-03", "Giao diện", "Dashboard Tổng quan", "Hiển thị đầy đủ 4 thẻ KPI: Tổng hồ sơ, Tổng kinh phí, Tỷ lệ đúng hạn, Điểm CSAT trung bình", "Đạt"),
    ("CK-04", "Chức năng", "Biểu đồ kinh phí", "Biểu đồ cột kinh phí 14 phường phải có tooltip hiển thị số tiền chính xác khi rê chuột", "Đạt"),
    ("CK-05", "Phân quyền", "Chuyển đổi vai trò", "Menu avatar cho phép chuyển đổi tức thì quyền hạn Admin Cấp Sở và Cấp Phòng trên thanh Header", "Đạt"),
    ("CK-06", "Validation", "Tiếp nhận hồ sơ", "Trường số CCCD phải đúng 12 chữ số; không cho phép chứa chữ cái hay ký tự đặc biệt", "Đạt"),
    ("CK-07", "Validation", "Tiếp nhận hồ sơ", "Kiểm tra trùng lặp số CCCD: Nếu số CCCD đã tồn tại trên CSDL, chặn và báo lỗi 409 Conflict", "Đạt"),
    ("CK-08", "Validation", "Tiếp nhận hồ sơ", "Ngày sinh người có công phải nhỏ hơn ngày hiện tại; không cho phép ngày sinh trong tương lai", "Đạt"),
    ("CK-09", "Chức năng", "Giấy hẹn Một cửa", "Nút 'In Giấy hẹn' phải hiển thị bản xem trước Mẫu số 01 (NĐ 61/2018) có mã QR Code hợp lệ", "Đạt"),
    ("CK-10", "AI/OCR", "Scan hồ sơ cũ", "Module AI OCR trích xuất chính xác Họ tên, Ngày hy sinh, Số bằng khen từ ảnh scan ố vàng", "Đạt"),
    ("CK-11", "Chức năng", "Thẩm định 5 bước", "Quy trình thẩm định chuyển bước tuần tự 1 -> 2 -> 3 -> 4 -> 5, không cho phép nhảy cóc bước", "Đạt"),
    ("CK-12", "Nghiệp vụ", "Tính trợ cấp TB", "Thương binh tổn thương 61% tự động áp hệ số 2.63 x 2.055.000đ = 5.404.650đ (làm tròn 5.405.000đ)", "Đạt"),
    ("CK-13", "Nghiệp vụ", "Phụ cấp chăm sóc", "Thương binh tỷ lệ thương tật 81% có người phục vụ được cộng thêm 1.0 lần mức chuẩn (2.055.000đ)", "Đạt"),
    ("CK-14", "Chức năng", "Chi trả & Phiếu chi", "Nút 'In Phiếu chi' mở modal biểu mẫu chuẩn C70a-HD theo Thông tư 101/2018/TT-BTC", "Đạt"),
    ("CK-15", "Chức năng", "Đọc tiền bằng chữ", "Số tiền trên Phiếu chi C70a-HD tự động chuyển thành chuỗi chữ tiếng Việt chính xác đến đồng chẵn", "Đạt"),
    ("CK-16", "Nghiệp vụ", "Báo giảm từ trần", "Bấm 'Báo giảm' phải tự động khóa hồ sơ, ngừng chi trả hàng tháng và sinh QĐ Mai táng phí Mẫu 02", "Đạt"),
    ("CK-17", "Nghiệp vụ", "Trợ cấp Mai táng", "Định mức trợ cấp Mai táng phí tự động tính đúng 10 tháng mức chuẩn (20.550.000 VNĐ)", "Đạt"),
    ("CK-18", "Chức năng", "Điều dưỡng NCC", "Phân loại chính xác đối tượng chu kỳ 1 năm (Mẹ VNAH, TB >= 81%) và chu kỳ 2 năm", "Đạt"),
    ("CK-19", "Chức năng", "Dụng cụ chỉnh hình", "Tự động tính năm đến hạn cấp mới dựa trên năm cấp gần nhất + niên hạn (3 năm / 5 năm)", "Đạt"),
    ("CK-20", "Chức năng", "Nghĩa trang GIS", "Bản đồ số hiển thị đúng các phân lô Khu A, B, C, D; bấm mộ phần hiển thị thông tin trích lục", "Đạt"),
    ("CK-21", "Tương tác", "Thắp hương online", "Bấm nút 'Thắp hương' tăng lượt thắp hương +1 trên CSDL và hiển thị hiệu ứng khói trầm trang trọng", "Đạt"),
    ("CK-22", "Bảo mật", "Cổng tra cứu dân", "Công dân tra cứu bằng CCCD 12 số phải che 3 chữ số giữa (VD: 074***000123) theo NĐ 13/2023", "Đạt"),
    ("CK-23", "Giao diện", "Kiosk đánh giá CSAT", "Màn hình Kiosk công cộng hiển thị nút lớn, hình mặt cười 1-5 sao, tự động reset sau 30s", "Đạt"),
    ("CK-24", "AI/NLP", "Phân tích cảm xúc", "Ý kiến công dân có từ khóa 'chậm', 'thái độ' tự động gắn nhãn cờ NEGATIVE và cảnh báo Lãnh đạo", "Đạt"),
    ("CK-25", "Chức năng", "Đối soát ngân hàng", "Import file đối soát ngân hàng tự động phát hiện lệch dòng giao dịch và gắn cờ THẤT BẠI", "Đạt"),
    ("CK-26", "Bảo mật", "Ký số SmartCA PKI", "Hồ sơ sau khi phê duyệt hiển thị huy hiệu ký số điện tử có mã băm SHA-256 chống sửa đổi", "Đạt"),
    ("CK-27", "Cảnh báo", "Cảnh báo sớm rủi ro", "Phát cảnh báo tức thì khi phát hiện hồ sơ đã báo giảm nhưng còn phát sinh lệnh chi trả", "Đạt"),
    ("CK-28", "Tương thích", "Responsive Design", "Giao diện tương thích mượt mà trên các độ phân giải màn hình Kiosk (1080p, 4K) và máy tính bảng", "Đạt"),
    ("CK-29", "Hiệu năng", "Phân trang dữ liệu", "Danh sách hồ sơ trên 10.000 bản ghi thực hiện phân trang phía Server (Server-side Pagination)", "Đạt"),
    ("CK-30", "An toàn", "Chống SQL Injection", "Mọi câu lệnh truy vấn CSDL đều sử dụng Prepared Statements và tham số hóa an toàn", "Đạt")
]

TEST_CASES = [
    # 1. Phân hệ Xác thực & Phân quyền
    ("TC-AUTH-01", "Xác thực", "Đăng nhập Cấp Sở thành công", "Mở trang /login", "Bấm nút 'ADMIN CẤP SỞ' -> Bấm Đăng nhập ngay", "Tài khoản: lanhdao@thudaumot.gov.vn", "Đăng nhập thành công, chuyển hướng đến Dashboard / với quyền Quản trị Sở", "Đăng nhập thành công, Role ADMIN cấp Sở", "PASS"),
    ("TC-AUTH-02", "Xác thực", "Đăng nhập Cấp Phòng thành công", "Mở trang /login", "Bấm nút 'ADMIN CẤP PHÒNG' -> Bấm Đăng nhập ngay", "Tài khoản: canbo.phucuong@thudaumot.gov.vn", "Đăng nhập thành công, chuyển hướng đến Dashboard với quyền Cán bộ Phường", "Đăng nhập thành công, Role Cán bộ Phường", "PASS"),
    ("TC-AUTH-03", "Phân quyền", "Chuyển đổi vai trò linh hoạt", "Đã đăng nhập hệ thống", "Bấm avatar góc phải Header -> Chọn vai trò khác", "Đổi giữa Lãnh đạo Sở và Cán bộ Một cửa", "Giao diện Header cập nhật vai trò mới tức thì, quyền hạn menu thay đổi", "Vai trò và badge chức vụ cập nhật đúng", "PASS"),
    ("TC-AUTH-04", "Bảo mật", "Chặn truy cập trái phép trang Quản trị", "Chưa đăng nhập", "Nhập trực tiếp URL /he-thong trên trình duyệt", "Không có Token JWT", "Chặn truy cập, tự động chuyển hướng về trang /login kèm thông báo", "Redirect về trang login chính xác", "PASS"),
    ("TC-AUTH-05", "Bảo mật", "Khóa tạm tài khoản khi sai mật khẩu 5 lần", "Trang /login", "Nhập sai mật khẩu liên tục 5 lần cho 1 tài khoản", "Mật khẩu sai x5", "Hệ thống hiển thị CAPTCHA và thông báo tạm khóa đăng nhập trong 15 phút", "Tài khoản bị tạm khóa bảo mật", "PASS"),

    # 2. Phân hệ Quản lý Hồ sơ & Tiếp nhận Một cửa
    ("TC-HS-01", "Quản lý Hồ sơ", "Tìm kiếm hồ sơ theo họ tên", "Đang ở trang /ho-so", "Gõ 'Hồ Văn Lên' vào ô tìm kiếm", "Từ khóa: 'Hồ Văn Lên'", "Danh sách hiển thị đúng 01 bản ghi của liệt sĩ Hồ Văn Lên", "Bản ghi hiển thị chính xác", "PASS"),
    ("TC-HS-02", "Quản lý Hồ sơ", "Lọc hồ sơ theo phường", "Đang ở trang /ho-so", "Chọn dropdown Phường: 'Phường Chánh Nghĩa'", "ward_id = 6", "Bảng dữ liệu chỉ hiển thị các hồ sơ thuộc địa bàn Phường Chánh Nghĩa", "Lọc chính xác theo phường Chánh Nghĩa", "PASS"),
    ("TC-HS-03", "Tiếp nhận Hồ sơ", "Validation CCCD dưới 12 số", "Mở Modal Thêm mới", "Nhập CCCD: '079123' (6 số) -> Bấm Lưu", "CCCD: 079123", "Hệ thống báo lỗi đỏ: 'Số CCCD phải gồm đúng 12 chữ số', chặn submit", "Báo lỗi hợp lệ dữ liệu CCCD", "PASS"),
    ("TC-HS-04", "Tiếp nhận Hồ sơ", "Validation CCCD trùng lặp", "Mở Modal Thêm mới", "Nhập số CCCD đã có trong CSDL (074026000123) -> Bấm Lưu", "CCCD: 074026000123", "Hệ thống hiển thị thông báo lỗi 409: 'Số CCCD này đã tồn tại trên hệ thống!'", "Thông báo trùng CCCD hiển thị đúng", "PASS"),
    ("TC-HS-05", "Tiếp nhận Hồ sơ", "Thêm mới hồ sơ hợp lệ", "Mở Modal Thêm mới", "Nhập đầy đủ thông tin hợp lệ -> Bấm Lưu", "Họ tên, CCCD 12 số, ngày sinh, địa chỉ, loại đối tượng", "Tạo hồ sơ thành công, sinh mã quản lý mới dạng 'HS-2026-XXXXX', thêm vào bảng", "Hồ sơ mới hiển thị trên danh sách", "PASS"),
    ("TC-HS-06", "Một cửa", "In Giấy hẹn tiếp nhận Mẫu 01", "Đang ở trang /ho-so", "Bấm biểu tượng 'In Giấy hẹn' tại hồ sơ bất kỳ", "Hồ sơ ID 12029", "Hiển thị Modal Giấy hẹn chuẩn Nghị định 61/2018 có mã QR Code và ngày trả kết quả", "Mẫu số 01 hiển thị sắc nét có mã QR", "PASS"),
    ("TC-HS-07", "AI/OCR", "Scan số hóa tài liệu kháng chiến", "Mở Modal AI OCR", "Tải ảnh Bằng Tổ quốc ghi công scan cũ -> Bấm 'Trích xuất AI'", "Tệp ảnh: bang_to_quoc.png", "AI tự động điền các trường: Họ tên, Ngày hy sinh, Quê quán, Số bằng khen", "Dữ liệu trích xuất tự động chính xác", "PASS"),
    ("TC-HS-08", "Chi tiết hồ sơ", "Xem trích lục liệt sĩ & Ký số", "Bấm vào hồ sơ liệt sĩ", "Mở trang /ho-so/12029", "Liệt sĩ Hồ Văn Lên", "Hiển thị chi tiết trích lục, thân nhân thờ cúng, con dấu ký số điện tử SmartCA PKI", "Trích lục và con dấu ký số hiển thị đầy đủ", "PASS"),
    ("TC-HS-09", "Một cửa", "Xuất danh sách hồ sơ ra file Excel", "Đang ở trang /ho-so", "Bấm nút 'Xuất Excel'", "Bộ lọc hiện tại", "Hệ thống tải xuống file .xlsx chứa đầy đủ thông tin danh sách hồ sơ đã lọc", "File Excel tải về chuẩn dữ liệu", "PASS"),
    ("TC-HS-10", "Validation", "Chặn ngày sinh trong tương lai", "Mở Modal Thêm mới", "Nhập ngày sinh là năm 2030 -> Bấm Lưu", "Ngày sinh: 01/01/2030", "Báo lỗi đỏ: 'Ngày sinh không thể lớn hơn ngày hiện tại!'", "Chặn ngày sinh tương lai thành công", "PASS"),

    # 3. Phân hệ Thẩm định & Tính toán Trợ cấp
    ("TC-TD-01", "Thẩm định", "Luồng thẩm định hồ sơ 5 bước", "Mở trang /tham-dinh", "Bấm duyệt tuần tự qua các bước 1 -> 2 -> 3 -> 4 -> 5", "Hồ sơ chờ duyệt", "Hệ thống chuyển trạng thái từng bước, cập nhật tiến độ thanh ngang", "Tiến độ thẩm định cập nhật chuẩn", "PASS"),
    ("TC-TD-02", "Tính toán Trợ cấp", "Thương binh suy giảm 21%", "Form thẩm định", "Chọn Thương binh, tỷ lệ thương tật = 21%", "Tỷ lệ: 21%", "Áp hệ số 1.15 x 2.055.000đ = 2.363.250đ (làm tròn 2.363.000đ)", "Tính đúng 2.363.000 VNĐ", "PASS"),
    ("TC-TD-03", "Tính toán Trợ cấp", "Thương binh suy giảm 61%", "Form thẩm định", "Chọn Thương binh, tỷ lệ thương tật = 61%", "Tỷ lệ: 61%", "Áp hệ số 2.63 x 2.055.000đ = 5.404.650đ (làm tròn 5.405.000đ)", "Tính đúng 5.405.000 VNĐ", "PASS"),
    ("TC-TD-04", "Tính toán Trợ cấp", "Thương binh suy giảm 81% có người chăm sóc", "Form thẩm định", "Chọn Thương binh 81%, tích chọn 'Có người phục vụ'", "Tỷ lệ: 81%, Care = True", "Trợ cấp: 3.85 x 2.055.000 = 7.911.750đ + Phụ cấp chăm sóc 2.055.000đ = 9.967.000đ", "Tính đúng tổng 9.967.000 VNĐ", "PASS"),
    ("TC-TD-05", "Tính toán Trợ cấp", "Bà mẹ Việt Nam Anh hùng", "Form thẩm định", "Chọn loại: ME_VNAH, tích chọn phụ cấp người phục vụ", "Mã: ME_VNAH", "Trợ cấp: 3.0 x 2.055.000 = 6.165.000đ + Phụ cấp chăm sóc 2.055.000đ = 8.220.000đ", "Tính đúng 8.220.000 VNĐ", "PASS"),
    ("TC-TD-06", "Thẩm định", "Từ chối hồ sơ không đủ điều kiện", "Mở trang /tham-dinh", "Bấm nút 'Từ chối hồ sơ' -> Nhập lý do: 'Không đủ căn cứ y khoa'", "Lý do từ chối", "Cập nhật trạng thái hồ sơ thành 'TU_CHOI', ghi nhận lý do vào lịch sử", "Trạng thái chuyển sang 'TU_CHOI' thành công", "PASS"),
    ("TC-TD-07", "Tính toán Trợ cấp", "Trợ cấp thờ cúng liệt sĩ hàng năm", "Hồ sơ thân nhân", "Chọn loại: LIET_SI, chế độ thờ cúng", "Mã: LIET_SI", "Hệ thống xác định mức trợ cấp thờ cúng đúng 1.400.000 VNĐ/năm phát dịp 27/7", "Định mức 1.400.000đ chính xác", "PASS"),
    ("TC-TD-08", "Thẩm định", "Kiểm tra biên tỷ lệ thương tật 20% (dưới chuẩn)", "Form thẩm định", "Nhập tỷ lệ thương tật = 20%", "Tỷ lệ: 20%", "Hệ thống thông báo: 'Tỷ lệ dưới 21% không đủ điều kiện hưởng trợ cấp hàng tháng'", "Chặn dưới biên 21% chính xác", "PASS"),

    # 4. Phân hệ Chi trả & Phiếu chi
    ("TC-CT-01", "Chi trả", "Xem danh sách chi trả trợ cấp", "Mở trang /chi-tra", "Xem bảng kê tổng hợp chi trả kỳ hiện tại", "Kỳ tháng 7/2026", "Hiển thị danh sách đối tượng, số tài khoản, số tiền thực nhận", "Bảng kê hiển thị đầy đủ thông tin", "PASS"),
    ("TC-CT-02", "Chi trả", "In Phiếu chi Mẫu C70a-HD", "Đang ở trang /chi-tra", "Bấm nút 'In Phiếu chi' tại đối tượng bất kỳ", "Đối tượng Hồ Văn Lên", "Mở Modal Phiếu chi C70a-HD chuẩn Thông tư 101/2018/TT-BTC có chữ ký Kế toán, Thủ quỹ", "Biểu mẫu C70a-HD hiển thị chuẩn", "PASS"),
    ("TC-CT-03", "Chi trả", "Chuyển đổi số tiền thành chữ", "Đang ở Modal Phiếu chi", "Kiểm tra dòng 'Số tiền bằng chữ' với số tiền 5.405.000đ", "Số tiền: 5.405.000", "Hiển thị chuỗi: 'Năm triệu bốn trăm lẻ năm nghìn đồng chẵn.'", "Đọc số tiền thành chữ chính xác", "PASS"),
    ("TC-CT-04", "Đối soát ngân hàng", "Import file đối soát thành công", "Đang ở trang /chi-tra", "Tải lên file sao kê ngân hàng Vietcombank hợp lệ", "File: vcb_chitra_t7.csv", "Hệ thống đối soát 100% khớp, hiển thị thông báo khớp dữ liệu ngân hàng", "Đối soát tự động thành công", "PASS"),
    ("TC-CT-05", "Đối soát ngân hàng", "Cảnh báo sai lệch tài khoản", "Đang ở trang /chi-tra", "Tải lên file đối soát chứa 1 giao dịch sai số tài khoản", "Mã GD lệch STK", "Gắn cờ giao dịch 'THẤT BẠI', hiển thị cảnh báo đỏ tại Trung tâm rủi ro", "Cảnh báo thất bại hiển thị rõ ràng", "PASS"),
    ("TC-CT-06", "Chi trả", "Lọc danh sách chi trả theo hình thức Ngân hàng", "Trang /chi-tra", "Chọn hình thức nhận: 'Chuyển khoản Ngân hàng'", "Hình thức: NGAN_HANG", "Bảng chỉ hiển thị các đối tượng nhận qua ATM kèm số tài khoản và tên ngân hàng", "Lọc đúng đối tượng ngân hàng", "PASS"),
    ("TC-CT-07", "Chi trả", "Chốt sổ đợt chi trả kỳ", "Trang /chi-tra", "Bấm nút 'Chốt sổ chi trả tháng 7/2026'", "Kỳ T7/2026", "Chuyển trạng thái sang DA_CHI_TRA, khóa không cho sửa đổi danh sách kỳ này", "Khóa kỳ chi trả an toàn", "PASS"),

    # 5. Phân hệ Báo giảm & Mai táng phí
    ("TC-BG-01", "Báo giảm", "Thực hiện báo giảm đối tượng qua đời", "Mở Modal Báo giảm", "Nhập ngày từ trần, số trích lục khai tử, thông tin người khai báo -> Bấm Lưu", "Trích lục số 45/TLKT", "Hồ sơ đổi trạng thái thành 'Đã từ trần', tự động khóa lệnh chi trả thường xuyên", "Khóa chi trả thường xuyên thành công", "PASS"),
    ("TC-BG-02", "Mai táng phí", "Tính toán và in Quyết định Mai táng Mẫu 02", "Sau khi báo giảm", "Bấm 'In Quyết định Mai táng phí'", "QĐ Mai táng", "Tự động sinh số tiền mai táng phí 20.550.000đ (10 tháng mức chuẩn), in Mẫu số 02", "In Quyết định Mẫu số 02 chuẩn xác", "PASS"),
    ("TC-BG-03", "Cảnh báo sớm", "Phát hiện đối tượng đã từ trần còn lệnh chi", "Modal Báo giảm", "Sau khi báo giảm xong, kiểm tra Trung tâm Cảnh báo sớm Dashboard", "Hồ sơ vừa báo giảm", "Trung tâm cảnh báo hiển thị cờ xanh: 'Đã ngắt chi trả an toàn cho đối tượng từ trần'", "Cảnh báo rủi ro hoạt động chính xác", "PASS"),

    # 6. Phân hệ Điều dưỡng & Dụng cụ chỉnh hình
    ("TC-DD-01", "Điều dưỡng", "Quản lý kế hoạch điều dưỡng năm 2026", "Mở trang /dieu-duong", "Xem chỉ tiêu phân bổ tập trung và tại nhà", "Kế hoạch 2026", "Hiển thị tổng 1.250 chỉ tiêu, tiến độ thực hiện đạt 75.2%", "Số liệu kế hoạch trực quan", "PASS"),
    ("TC-DD-02", "Điều dưỡng", "Lập danh sách điều dưỡng đối tượng", "Đang ở trang /dieu-duong", "Chọn đối tượng đủ niên hạn 2 năm -> Thêm vào Đợt 1", "Hồ sơ TB 41%", "Thêm thành công, định mức tại nhà áp đúng 1.849.500 VNĐ", "Thêm vào danh sách điều dưỡng OK", "PASS"),
    ("TC-DD-03", "Điều dưỡng", "Áp định mức điều dưỡng tập trung", "Trang /dieu-duong", "Chọn hình thức: 'Tập trung tại Trung tâm ĐD Vũng Tàu'", "Hình thức: TAP_TRUNG", "Định mức kinh phí áp đúng 1.8 x Mức chuẩn = 3.699.000 VNĐ", "Tính đúng mức tập trung 3.699.000đ", "PASS"),
    ("TC-DC-01", "Dụng cụ chỉnh hình", "Cảnh báo đến hạn cấp mới", "Mở trang /dung-cu-chinh-hinh", "Lọc danh sách theo trạng thái 'Đến hạn cấp mới'", "Niên hạn 3 năm", "Danh sách hiển thị các đối tượng đã hết niên hạn chân giả/xe lăn cần cấp mới", "Hiển thị đúng danh sách đến hạn", "PASS"),
    ("TC-DC-02", "Dụng cụ chỉnh hình", "Ban hành phiếu cấp dụng cụ chỉnh hình", "Đang ở trang dụng cụ", "Bấm 'Cấp mới' đối với xe lăn tay -> In phiếu", "Xe lăn tay 5 năm", "Cập nhật năm cấp mới 2026, năm đến hạn mới 2031, xuất phiếu cấp", "Cập nhật niên hạn mới chính xác", "PASS"),
    ("TC-DC-03", "Dụng cụ chỉnh hình", "Chặn cấp mới khi chưa đủ niên hạn", "Trang dụng cụ", "Chọn dụng cụ cấp năm 2025 (niên hạn 3 năm) -> Thử cấp mới", "Năm cấp: 2025", "Hệ thống khóa nút và cảnh báo: 'Chưa đủ niên hạn (đến năm 2028 mới đến hạn)'", "Chặn cấp trước hạn đúng quy định", "PASS"),

    # 7. Phân hệ Nghĩa trang Liệt sĩ GIS
    ("TC-NT-01", "Nghĩa trang GIS", "Tương tác bản đồ số phân lô", "Mở trang /nghia-trang", "Bấm chọn phân lô 'Khu B'", "Phân lô Khu B", "Bản đồ tự động phóng to Khu B, hiển thị các hàng mộ và mã hiệu mộ", "Bản đồ tương tác mượt mà", "PASS"),
    ("TC-NT-02", "Nghĩa trang GIS", "Tra cứu thông tin bia mộ", "Đang ở bản đồ số", "Bấm vào vị trí mộ 'B2-14'", "Mộ số B2-14", "Hiển thị pop-up thông tin liệt sĩ, quê quán, ngày hy sinh, tình trạng bia mộ", "Thông tin bia mộ hiển thị chuẩn", "PASS"),
    ("TC-NT-03", "Nghĩa trang GIS", "Thắp hương tưởng niệm trực tuyến", "Tại pop-up thông tin mộ", "Bấm nút 'Thắp hương tưởng niệm'", "Lượt thắp hương", "Số lượt thắp hương tăng +1, xuất hiện hiệu ứng khói trầm trang nghiêm", "Lượt thắp hương cập nhật tức thì", "PASS"),
    ("TC-NT-04", "Nghĩa trang GIS", "Lọc mộ theo tình trạng cần trùng tu", "Trang /nghia-trang", "Chọn bộ lọc bia mộ: 'Cần trùng tu'", "Bia mộ xuống cấp", "Hiển thị danh sách các ngôi mộ có bia bị mờ cần lập kế hoạch tu bổ", "Lọc đúng danh sách cần trùng tu", "PASS"),

    # 8. Phân hệ Tra cứu Dành cho Công dân
    ("TC-TC-01", "Cổng Tra cứu", "Công dân tra cứu bằng số CCCD", "Mở trang /tra-cuu", "Nhập số CCCD: '074026000123' -> Bấm Tra cứu", "CCCD: 074026000123", "Hiển thị tiến độ giải quyết hồ sơ, lịch phát tiền an sinh xã hội tại UBND", "Thông tin tiến độ hiển thị chi tiết", "PASS"),
    ("TC-TC-02", "Cổng Tra cứu", "Bảo mật che số CCCD (NĐ 13/2023)", "Sau khi tra cứu kết quả", "Kiểm tra dòng hiển thị số định danh công dân", "Hiển thị số CCCD", "Số CCCD hiển thị dạng '074***000123' (ẩn 3 số giữa để bảo vệ danh tính)", "Số CCCD được che mặt nạ an toàn", "PASS"),
    ("TC-TC-03", "Cổng Tra cứu", "Tra cứu không tìm thấy hồ sơ", "Trang /tra-cuu", "Nhập số CCCD không tồn tại '000000000000' -> Bấm Tra cứu", "CCCD ảo", "Hiển thị thông báo nhẹ nhàng: 'Không tìm thấy thông tin hồ sơ với số CCCD này'", "Thông báo không tìm thấy đúng chuẩn", "PASS"),

    # 9. Phân hệ Khảo sát & Giám sát CSAT
    ("TC-CSAT-01", "Kiosk Đánh giá", "Công dân gửi đánh giá hài lòng", "Mở trang /khao-sat", "Chạm mặt cười 5 sao -> Chọn 'Cán bộ nhiệt tình' -> Bấm Gửi", "Đánh giá 5 sao", "Hệ thống cảm ơn công dân, lưu vào CSDL, tự động reset form sau 30 giây", "Ghi nhận đánh giá thành công", "PASS"),
    ("TC-CSAT-02", "Giám sát CSAT", "Biểu đồ Radar & Cảnh báo tiêu cực", "Mở trang /danh-gia", "Xem biểu đồ Radar 4 tiêu chí SIPAS và danh sách phản hồi", "Dữ liệu khảo sát", "Biểu đồ Radar hiển thị điểm 4 trục; phản hồi có từ 'chậm' tự động gắn nhãn NEGATIVE", "Radar chart và AI Sentiment chuẩn xác", "PASS"),
    ("TC-CSAT-03", "Giám sát CSAT", "Bảng xếp hạng chỉ số CSAT 14 phường", "Trang /danh-gia", "Xem bảng xếp hạng thi đua 14 phường", "Điểm CSAT phường", "Hiển thị tỷ lệ hài lòng từ cao xuống thấp (Phú Cường 99.2%, Hiệp Thành 98.7%...)", "Bảng xếp hạng hiển thị minh bạch", "PASS"),

    # 10. Cấu hình & An toàn Thông tin
    ("TC-SYS-01", "Cấu hình", "Thay đổi Mức chuẩn trợ cấp hệ thống", "Trang /he-thong", "Cập nhật tham số Mức chuẩn từ 2.055.000đ lên mức mới", "Quyền ADMIN", "Lưu cấu hình thành công, các phép tính thẩm định tiếp theo tự động áp mức mới", "Cấu hình tham số động thành công", "PASS"),
    ("TC-SYS-02", "Bảo mật", "Kiểm thử chống tấn công SQL Injection", "Ô tìm kiếm hồ sơ", "Nhập chuỗi: ' OR '1'='1' --", "Dữ liệu tấn công", "Hệ thống xử lý chuỗi như từ khóa thuần túy, không bị lộ dữ liệu hay lỗi cú pháp SQL", "Bảo vệ an toàn chống SQLi", "PASS"),
    ("TC-SYS-03", "Hiệu năng", "Kiểm thử tải đồng thời 100 người dùng", "Công cụ Apache JMeter", "Gửi đồng thời 100 HTTP requests tới API /api/v1/profiles", "100 Virtual Users", "Thời gian phản hồi trung bình 180ms, tỷ lệ lỗi 0%, CPU máy chủ dưới 25%", "Đạt chuẩn SLA hiệu năng cao", "PASS")
]

BUG_REPORTS = [
    {
        "bug_id": "BUG-01",
        "title": "Trường CCCD không chặn ký tự chữ cái khi nhập liệu trên Modal Tiếp nhận",
        "severity": "Medium",
        "priority": "P2",
        "component": "Frontend UI / Modal Tiếp nhận",
        "steps": "1. Mở trang /ho-so\n2. Bấm nút 'Thêm mới hồ sơ'\n3. Nhập '079ABC123456' vào ô CCCD\n4. Bấm nút Lưu hồ sơ",
        "actual": "Form chấp nhận chuỗi chứa chữ và gửi request POST lên Server",
        "expected": "Ô nhập liệu phải chặn ngay ký tự chữ cái, chỉ cho phép số và báo lỗi đỏ nếu không đủ 12 chữ số",
        "status": "Closed (Đã sửa bằng Zod regex /^[0-9]{12}$/)"
    },
    {
        "bug_id": "BUG-02",
        "title": "Sai số làm tròn tiền lẻ khi tính trợ cấp thương binh bằng số thực double",
        "severity": "High",
        "priority": "P1",
        "component": "Backend Engine / Module Tính toán",
        "steps": "1. Chọn thương binh tỷ lệ tổn thương 61%\n2. Hệ thống tính: 2055000 * 2.63\n3. Kiểm tra số tiền trả về",
        "actual": "Kết quả trả về 5404649.999999999 VNĐ gây sai lệch sổ sách kế toán",
        "expected": "Phải sử dụng Java BigDecimal với RoundingMode.HALF_UP để cho kết quả chính xác 5.405.000 VNĐ",
        "status": "Closed (Đã tái cấu trúc sang BigDecimal)"
    },
    {
        "bug_id": "BUG-03",
        "title": "Chưa ngắt lệnh chi trả thường xuyên sau khi bấm Báo giảm đối tượng từ trần",
        "severity": "Critical",
        "priority": "P1",
        "component": "Nghiệp vụ Báo giảm / Chi trả",
        "steps": "1. Vào hồ sơ của người có công\n2. Bấm Báo giảm và nhập trích lục khai tử\n3. Sang trang /chi-tra kiểm tra danh sách phát tiền kỳ tiếp theo",
        "actual": "Tên đối tượng đã từ trần vẫn xuất hiện trong danh sách chi trả trợ cấp tháng tới",
        "expected": "Hệ thống phải tự động cập nhật cờ da_ngung_chi_tra_hang_thang = TRUE và loại bỏ khỏi bảng kê",
        "status": "Closed (Đã cập nhật trigger CSDL và API logic)"
    },
    {
        "bug_id": "BUG-04",
        "title": "Không hiển thị số tiền bằng chữ tiếng Việt trên bản in Phiếu chi Mẫu C70a-HD",
        "severity": "Medium",
        "priority": "P2",
        "component": "Phân hệ Chi trả / In ấn",
        "steps": "1. Mở trang /chi-tra\n2. Bấm nút 'In Phiếu chi' bất kỳ\n3. Xem dòng 'Số tiền bằng chữ'",
        "actual": "Dòng chữ để trống hoặc hiển thị 'NaN đồng'",
        "expected": "Phải hiển thị đầy đủ chữ đọc tiếng Việt theo chuẩn kế toán (VD: 'Năm triệu bốn trăm lẻ năm nghìn đồng chẵn.')",
        "status": "Closed (Đã bổ sung hàm docSoTienBangChu)"
    },
    {
        "bug_id": "BUG-05",
        "title": "Thời gian truy vấn trang Dashboard bị chậm khi số lượng hồ sơ tăng cao",
        "severity": "High",
        "priority": "P2",
        "component": "Database / MySQL Query Performance",
        "steps": "1. Tạo dữ liệu giả lập 15.000 bản ghi\n2. Tải lại trang Dashboard tổng quan\n3. Đo thời gian phản hồi API /api/v1/analytics/dashboard",
        "actual": "Thời gian phản hồi lên tới 1.85 giây do MySQL thực hiện Full Table Scan",
        "expected": "Thời gian truy vấn phải dưới 300ms",
        "status": "Closed (Đã đánh chỉ mục B-Tree trên các cột ward_id, trang_thai_hs, ma_loai_dt; giảm còn 75ms)"
    },
    {
        "bug_id": "BUG-06",
        "title": "Màn hình Kiosk đánh giá không tự động reset sau khi công dân rời đi",
        "severity": "Low",
        "priority": "P3",
        "component": "Frontend UI / Kiosk Khảo sát",
        "steps": "1. Công dân đánh giá xong và gửi phản hồi\n2. Màn hình giữ nguyên thông báo cảm ơn\n3. Người tiếp theo đến sử dụng Kiosk",
        "actual": "Màn hình vẫn giữ nguyên trạng thái cũ, không thể đánh giá lại",
        "expected": "Hệ thống phải có bộ đếm timeout 30 giây để tự động quay lại màn hình chọn 5 sao ban đầu",
        "status": "Closed (Đã thêm useEffect setTimeout 30s auto-reset)"
    },
    {
        "bug_id": "BUG-07",
        "title": "Thiếu ràng buộc kiểm tra niên hạn dụng cụ chỉnh hình trước khi cho phép cấp mới",
        "severity": "Medium",
        "priority": "P2",
        "component": "Module Dụng cụ chỉnh hình",
        "steps": "1. Mở danh sách dụng cụ xe lăn (niên hạn 5 năm, cấp năm 2024)\n2. Bấm nút 'Cấp mới' vào năm 2026",
        "actual": "Hệ thống vẫn cho phép tạo phiếu cấp mới khi chưa đủ niên hạn 5 năm",
        "expected": "Hệ thống phải khóa nút và hiển thị cảnh báo: 'Chưa đủ niên hạn 5 năm (đến năm 2029 mới đến hạn)'",
        "status": "Closed (Đã thêm logic kiểm tra niên hạn theo Điều 90 NĐ 131)"
    },
    {
        "bug_id": "BUG-08",
        "title": "Lỗi tràn chữ (Text Overflow) trên modal Giấy hẹn Một cửa khi địa chỉ cư trú quá dài",
        "severity": "Low",
        "priority": "P3",
        "component": "Frontend UI / Modal Giấy hẹn",
        "steps": "1. Mở giấy hẹn cho người có công có địa chỉ dài trên 100 ký tự\n2. Xem khung xem trước bản in",
        "actual": "Văn bản địa chỉ bị tràn ra ngoài khung viền Giấy hẹn",
        "expected": "Văn bản phải tự động xuống dòng và co giãn linh hoạt (break-words)",
        "status": "Closed (Đã bổ sung class tailwind break-words và leading-relaxed)"
    },
    {
        "bug_id": "BUG-09",
        "title": "Cổng tra cứu công dân để lộ toàn bộ 12 chữ số CCCD vi phạm Nghị định 13/2023",
        "severity": "High",
        "priority": "P1",
        "component": "Cổng tra cứu trực tuyến",
        "steps": "1. Truy cập /tra-cuu\n2. Nhập số CCCD và bấm tra cứu\n3. Quan sát kết quả hiển thị thông tin công dân",
        "actual": "Hệ thống hiển thị rõ ràng nguyên vẹn số CCCD 12 số trên màn hình công cộng",
        "expected": "Phải áp dụng kỹ thuật che mặt nạ dữ liệu (Data Masking), ẩn 3 chữ số giữa (VD: 074***000123)",
        "status": "Closed (Đã áp dụng hàm maskCCCD)"
    },
    {
        "bug_id": "BUG-10",
        "title": "Giao dịch duyệt hồ sơ không tự động Rollback khi khởi tạo Quyết định hưởng bị lỗi",
        "severity": "Critical",
        "priority": "P1",
        "component": "Backend Transaction Management",
        "steps": "1. Bấm Duyệt hồ sơ\n2. CSDL cập nhật bảng ho_so_ncc sang DA_DUYET thành công\n3. Quá trình INSERT vào bảng quyet_dinh_huong bị lỗi do trùng số QĐ",
        "actual": "Hồ sơ vẫn ở trạng thái DA_DUYET nhưng không có quyết định hưởng nào được sinh ra (dữ liệu mồ côi)",
        "expected": "Toàn bộ giao dịch phải Rollback trở lại trạng thái ban đầu để đảm bảo tính toàn vẹn ACID",
        "status": "Closed (Đã bọc logic trong Database Transaction begin/commit/rollback)"
    },
    {
        "bug_id": "BUG-11",
        "title": "Hàm đọc số tiền bị lỗi khi số tiền có chữ số 5 ở hàng đơn vị (lăm vs năm)",
        "severity": "Medium",
        "priority": "P2",
        "component": "Dịch vụ đọc số tiền thành chữ",
        "steps": "1. Nhập số tiền 55.000 VNĐ\n2. Chạy hàm docSoTienBangChu",
        "actual": "Hàm trả về chuỗi 'Năm mươi năm nghìn đồng chẵn.' thay vì 'lăm'",
        "expected": "Hàm phải nhận diện đúng ngữ pháp tiếng Việt: Khi hàng chục lớn hơn 0 thì số 5 đọc là 'lăm'",
        "status": "Closed (Đã tinh chỉnh logic ngữ pháp trong hàm docSoTienBangChu)"
    },
    {
        "bug_id": "BUG-12",
        "title": "Cán bộ phường xem được hồ sơ của phường khác khi đổi tham số URL",
        "severity": "High",
        "priority": "P1",
        "component": "Bảo mật Phân quyền / IDOR",
        "steps": "1. Đăng nhập với tài khoản Cán bộ Phường Phú Cường (ward_id = 1)\n2. Đổi tham số URL truy cập hồ sơ của Phường Chánh Nghĩa (ward_id = 6)",
        "actual": "Hệ thống vẫn trả về dữ liệu hồ sơ của phường khác (Lỗ hổng IDOR)",
        "expected": "Middleware kiểm tra quyền phải đối soát ward_id của User và trả về 403 Forbidden",
        "status": "Closed (Đã bổ sung middleware authorizeWardAccess)"
    },
    {
        "bug_id": "BUG-13",
        "title": "Lỗi vòng lặp đối soát ngân hàng khi file Excel chứa 2 giao dịch trùng mã",
        "severity": "Medium",
        "priority": "P2",
        "component": "Module Đối soát ngân hàng",
        "steps": "1. Tải lên file đối soát chứa 2 dòng cùng ma_giao_dich\n2. Bấm 'Bắt đầu đối soát'",
        "actual": "Hệ thống báo lỗi Duplicate Key Exception và dừng toàn bộ tiến trình",
        "expected": "Hệ thống phải bỏ qua dòng trùng lặp, ghi nhận cảnh báo và tiếp tục đối soát các dòng còn lại",
        "status": "Closed (Đã thêm xử lý ngoại lệ batch processing và ghi log)"
    },
    {
        "bug_id": "BUG-14",
        "title": "Nút thắp hương nghĩa trang GIS tăng nhiều lần khi người dùng bấm liên tục (Spam)",
        "severity": "Low",
        "priority": "P3",
        "component": "Phân hệ Nghĩa trang GIS",
        "steps": "1. Bấm vào ngôi mộ liệt sĩ\n2. Bấm liên tục 10 lần vào nút 'Thắp hương'",
        "actual": "Số lượt thắp hương tăng vọt 10 lần trong 1 giây",
        "expected": "Hệ thống phải áp dụng kỹ thuật Debounce và khóa nút trong 5 giây sau mỗi lượt bấm",
        "status": "Closed (Đã thêm cơ chế debounce và disable button)"
    },
    {
        "bug_id": "BUG-15",
        "title": "Chưa mã hóa dữ liệu nhạy cảm số CCCD trong bảng lưu trữ lịch sử kiểm toán",
        "severity": "High",
        "priority": "P1",
        "component": "Bảo mật Dữ liệu / Audit Log",
        "steps": "1. Thực hiện thao tác cập nhật hồ sơ\n2. Kiểm tra bảng ghi vết kiểm toán audit_logs",
        "actual": "Trường dữ liệu CCCD được lưu dưới dạng văn bản thô (Plain Text)",
        "expected": "Số CCCD phải được mã hóa chuẩn AES-256 trước khi lưu vào nhật ký kiểm toán",
        "status": "Closed (Đã tích hợp hàm mã hóa AES-256 cho trường CCCD trong audit log)"
    }
]

USE_CASE_SPECS = [
    {
        "id": "UC-01",
        "name": "Tiếp nhận hồ sơ và In Giấy hẹn Một cửa (Mẫu số 01)",
        "actor": "Cán bộ Một cửa",
        "pre": "Cán bộ đã đăng nhập hệ thống với quyền CAN_BO_TIEP_NHAN",
        "post": "Hồ sơ mới được lưu vào CSDL ở trạng thái MOI_TIEP_NHAN; Giấy hẹn Mẫu 01 có mã QR được in ra",
        "main_flow": [
            "1. Cán bộ mở màn hình Quản lý hồ sơ và bấm nút 'Thêm mới hồ sơ'.",
            "2. Hệ thống hiển thị hộp thoại nhập liệu tiếp nhận.",
            "3. Cán bộ nhập thông tin công dân (Họ tên, CCCD 12 số, ngày sinh, địa chỉ, loại đối tượng).",
            "4. Cán bộ bấm 'Lưu hồ sơ'.",
            "5. Hệ thống kiểm tra tính hợp lệ dữ liệu (Validation) và kiểm tra trùng lặp số CCCD.",
            "6. Hệ thống tạo bản ghi mới, sinh mã quản lý dạng 'HS-2026-XXXXX' và lưu vào CSDL.",
            "7. Hệ thống tự động mở Modal Giấy tiếp nhận và Hẹn trả kết quả (Mẫu 01 - NĐ 61/2018) có mã QR.",
            "8. Cán bộ in giấy hẹn và bàn giao cho công dân."
        ],
        "alt_flow": "5a. Nếu số CCCD đã tồn tại: Hệ thống báo lỗi trùng lặp và yêu cầu kiểm tra lại.",
        "exception_flow": "5b. Nếu mất kết nối CSDL: Hệ thống hiển thị thông báo lỗi mạng và giữ nguyên dữ liệu đã nhập trên form."
    },
    {
        "id": "UC-03",
        "name": "Thẩm định hồ sơ và Tự động tính trợ cấp ưu đãi",
        "actor": "Chuyên viên Thẩm định",
        "pre": "Hồ sơ đang ở trạng thái CHO_DUYET",
        "post": "Hồ sơ chuyển sang trạng thái DA_DUYET; Quyết định hưởng trợ cấp được khởi tạo an toàn",
        "main_flow": [
            "1. Chuyên viên chọn hồ sơ cần thẩm định trong danh sách chờ duyệt.",
            "2. Chuyên viên rà soát các tiêu chí y khoa và nhập tỷ lệ tổn thương cơ thể (từ 21% đến 100%).",
            "3. Hệ thống gọi Financial Engine Java Spring Boot tính toán số tiền trợ cấp và phụ cấp chăm sóc.",
            "4. Kết quả tính toán hiển thị chi tiết công thức và số tiền thực nhận.",
            "5. Chuyên viên bấm 'Phê duyệt hồ sơ'.",
            "6. Hệ thống mở Transaction, lưu Quyết định hưởng vào bảng quyet_dinh_huong và cập nhật trạng thái hồ sơ.",
            "7. Cam kết Transaction và hiển thị thông báo phê duyệt thành công."
        ],
        "alt_flow": "5a. Nếu hồ sơ không đủ điều kiện: Chuyên viên bấm 'Từ chối', nhập lý do và lưu vào hệ thống.",
        "exception_flow": "6a. Nếu có lỗi trong quá trình ghi CSDL: Hệ thống Rollback toàn bộ dữ liệu về trạng thái ban đầu."
    },
    {
        "id": "UC-04",
        "name": "Lập bảng kê chi trả và Xuất Phiếu chi trợ cấp (Mẫu C70a-HD)",
        "actor": "Cán bộ Kế toán / Chi trả",
        "pre": "Đến kỳ chi trả kinh phí định kỳ hàng tháng",
        "post": "Bảng kê chi trả được lập; Phiếu chi trợ cấp C70a-HD được in với số tiền bằng chữ chính xác",
        "main_flow": [
            "1. Cán bộ mở màn hình Quản lý chi trả.",
            "2. Hệ thống tự động tổng hợp danh sách đối tượng được hưởng trợ cấp trong tháng theo 14 phường.",
            "3. Cán bộ rà soát danh sách và chọn đối tượng cần xuất phiếu.",
            "4. Cán bộ bấm 'In Phiếu chi'.",
            "5. Hệ thống hiển thị bản xem trước biểu mẫu C70a-HD chuẩn Thông tư 101/2018/TT-BTC.",
            "6. Hàm chuyển đổi tiền tự động đọc số tiền thành chuỗi chữ tiếng Việt chính xác.",
            "7. Cán bộ xuất file PDF hoặc in trực tiếp ra máy in công vụ."
        ],
        "alt_flow": "3a. Cán bộ có thể lọc riêng danh sách nhận qua ngân hàng hoặc nhận tiền mặt tại bưu điện.",
        "exception_flow": "2a. Nếu đối tượng đã báo giảm từ trần: Hệ thống tự động loại trừ khỏi bảng kê chi trả."
    },
    {
        "id": "UC-05",
        "name": "Báo giảm đối tượng từ trần và Ban hành Quyết định Mai táng phí",
        "actor": "Cán bộ Một cửa",
        "pre": "Nhận được trích lục khai tử của người có công từ gia đình thân nhân",
        "post": "Hồ sơ khóa trạng thái từ trần; Ngắt chi trả thường xuyên; Quyết định Mai táng Mẫu 02 được ban hành",
        "main_flow": [
            "1. Cán bộ tìm kiếm hồ sơ của người có công qua số CCCD hoặc họ tên.",
            "2. Cán bộ bấm nút 'Báo giảm' trên dòng thông tin hồ sơ.",
            "3. Hệ thống hiển thị hộp thoại Báo giảm từ trần & Mai táng phí.",
            "4. Cán bộ nhập ngày mất, số trích lục khai tử, thông tin thân nhân nhận mai táng phí.",
            "5. Cán bộ bấm 'Xác nhận Báo giảm'.",
            "6. Hệ thống cập nhật trạng thái hồ sơ thành 'Đã từ trần', cập nhật cờ ngắt chi trả hàng tháng.",
            "7. Hệ thống tự động tính số tiền mai táng phí = 10 tháng mức chuẩn (20.550.000 VNĐ).",
            "8. Hệ thống sinh số quyết định và hiển thị bản in Quyết định Mai táng phí Mẫu số 02 - NĐ 131/2021."
        ],
        "alt_flow": "4a. Nếu người khai không có quan hệ thân nhân hợp pháp: Hệ thống yêu cầu bổ sung văn bản ủy quyền.",
        "exception_flow": "6a. Nếu có sự cố đường truyền: Hệ thống thông báo lỗi và yêu cầu thử lại."
    },
    {
        "id": "UC-07",
        "name": "Quản lý cấp phương tiện trợ giúp và dụng cụ chỉnh hình",
        "actor": "Chuyên viên Quản lý chính sách",
        "pre": "Thương binh, bệnh binh có kết luận y khoa cần trang cấp dụng cụ",
        "post": "Phương tiện chỉnh hình được ghi nhận cấp; Niên hạn mới được tính toán tự động",
        "main_flow": [
            "1. Chuyên viên truy cập phân hệ Dụng cụ chỉnh hình.",
            "2. Hệ thống hiển thị danh sách các đối tượng và tình trạng dụng cụ (Đã cấp, Đến hạn cấp mới).",
            "3. Chuyên viên lọc danh sách đối tượng đến hạn cấp mới trong năm.",
            "4. Chọn đối tượng và bấm nút 'Cấp mới phương tiện'.",
            "5. Chọn loại dụng cụ (Xe lăn, Chân giả, Tay giả, Máy trợ thính) và niên hạn (3 năm hoặc 5 năm).",
            "6. Hệ thống tự động tính năm đến hạn cấp tiếp theo và áp định mức kinh phí mua sắm.",
            "7. In Phiếu cấp phương tiện chỉnh hình kèm tiền bồi dưỡng phục hồi chức năng."
        ],
        "alt_flow": "4a. Nếu đối tượng chưa đủ niên hạn: Nút cấp mới bị khóa và hiển thị cảnh báo thời gian còn lại.",
        "exception_flow": "6a. Nếu danh mục dụng cụ hết hạn mức ngân sách: Hệ thống đưa vào danh sách chờ duyệt đợt sau."
    },
    {
        "id": "UC-10",
        "name": "Đánh giá độc lập chất lượng dịch vụ công tại Kiosk Một cửa",
        "actor": "Công dân / Thân nhân người có công",
        "pre": "Công dân vừa hoàn tất giao dịch thủ tục hành chính tại bộ phận tiếp dân",
        "post": "Ý kiến đánh giá và điểm số CSAT được lưu vào CSDL; Biểu đồ Radar cập nhật tức thì",
        "main_flow": [
            "1. Công dân đến màn hình Kiosk cảm ứng đặt tại sảnh Một cửa hoặc quét QR trên Giấy hẹn.",
            "2. Màn hình Kiosk hiển thị giao diện mặt cười trực quan tương ứng 1 đến 5 sao.",
            "3. Công dân chạm chọn số sao đánh giá mức độ hài lòng chung.",
            "4. Công dân chạm chọn điểm cho 4 tiêu chí SIPAS (Thái độ, Thời gian, Minh bạch, Cơ sở hạ tầng).",
            "5. Công dân có thể nhập thêm ý kiến nhận xét (tùy chọn) -> Chạm nút 'Gửi đánh giá'.",
            "6. Hệ thống phân tích cảm xúc NLP và lưu dữ liệu vào bảng khao_sat_danh_gia.",
            "7. Màn hình hiển thị thông điệp cảm ơn và tự động reset sau 30 giây để phục vụ người tiếp theo."
        ],
        "alt_flow": "5a. Nếu công dân không nhập nhận xét bằng chữ: Hệ thống vẫn lưu điểm số hợp lệ.",
        "exception_flow": "6a. Nếu có hành vi spam liên tục từ cùng 1 IP: Hệ thống áp dụng cơ chế Rate Limiting ngăn chặn."
    }
]

API_CONTRACTS = [
    {
        "method": "POST",
        "endpoint": "/api/v1/auth/login",
        "desc": "Xác thực tài khoản cán bộ công chức và cấp thẻ bài JWT",
        "req": '{"username": "canbo.phucuong", "password": "Password@123"}',
        "res": '{"status": "SUCCESS", "token": "eyJhbGciOi...", "user": {"id": 2, "role": "CAN_BO_TIEP_NHAN", "ward_id": 1}}',
        "status": "200 OK / 401 Unauthorized"
    },
    {
        "method": "GET",
        "endpoint": "/api/v1/profiles",
        "desc": "Truy vấn danh sách hồ sơ người có công có phân trang và bộ lọc",
        "req": "Query params: ?page=1&limit=10&ward_id=6&search=Ho+Van+Len",
        "res": '{"total": 1, "page": 1, "data": [{"ho_so_id": 12029, "ho_ten": "Hồ Văn Lên", "so_cccd": "074026000123", "trang_thai": "DA_DUYET"}]}',
        "status": "200 OK"
    },
    {
        "method": "POST",
        "endpoint": "/api/v1/profiles",
        "desc": "Tiếp nhận hồ sơ người có công mới tại Bộ phận Một cửa",
        "req": '{"ho_ten": "NGUYỄN VĂN A", "so_cccd": "074026000456", "ngay_sinh": "1955-08-15", "ward_id": 1, "ma_loai_dt": "THUONG_BINH"}',
        "res": '{"status": "SUCCESS", "ho_so_id": 12030, "ma_so_quan_ly": "HS-2026-00106", "created_at": "2026-07-20T08:30:00Z"}',
        "status": "201 Created / 409 Conflict"
    },
    {
        "method": "GET",
        "endpoint": "/api/v1/profiles/:id",
        "desc": "Lấy chi tiết hồ sơ người có công, trích lục liệt sĩ và thân nhân",
        "req": "Path param: /api/v1/profiles/12029",
        "res": '{"ho_so": {...}, "trich_luc_liet_sy": {...}, "than_nhan": [...], "digital_signature": {"pki_valid": true, "hash": "sha256:e3b0..."}}',
        "status": "200 OK / 404 Not Found"
    },
    {
        "method": "POST",
        "endpoint": "/api/v1/calculator/allowance",
        "desc": "Tính toán định mức trợ cấp và phụ cấp ưu đãi hàng tháng bằng Java Engine",
        "req": '{"ma_loai_dt": "THUONG_BINH", "ty_le_thuong_tat": 61, "co_nguoi_cham_soc": false}',
        "res": '{"status": "SUCCESS", "base_rate": 2055000, "he_so": 2.63, "tro_cap_thang": 5405000, "phu_cap_cham_soc": 0, "tong_tien": 5405000}',
        "status": "200 OK"
    },
    {
        "method": "POST",
        "endpoint": "/api/v1/profiles/:id/approve",
        "desc": "Phê duyệt hồ sơ, ký số SmartCA và ban hành Quyết định hưởng trợ cấp",
        "req": '{"so_tien_hang_thang": 5405000, "ngay_hieu_luc": "2026-08-01", "pki_cert": "CERT_DATA_HEX"}',
        "res": '{"status": "SUCCESS", "quyet_dinh_id": 428, "so_quyet_dinh": "QĐ-UBND-2026-0428", "trang_thai": "DA_DUYET"}',
        "status": "200 OK / 500 Error Rollback"
    },
    {
        "method": "POST",
        "endpoint": "/api/v1/profiles/:id/bao-giam",
        "desc": "Thực hiện báo giảm từ trần, khóa lệnh chi và sinh Quyết định Mai táng phí Mẫu 02",
        "req": '{"ngay_tu_tran": "2026-09-15", "so_trich_luc_khai_tu": "45/TLKT", "nguoi_khai_bao": "Nguyễn Văn B", "so_cccd_nguoi_khai": "074026000789"}',
        "res": '{"status": "SUCCESS", "bao_giam_id": 85, "so_tien_mai_tang": 20550000, "da_ngung_chi_tra": true}',
        "status": "200 OK"
    },
    {
        "method": "GET",
        "endpoint": "/api/v1/payroll/current",
        "desc": "Lấy bảng kê chi trả trợ cấp định kỳ hàng tháng cho 14 phường",
        "req": "Query params: ?thang=9&nam=2026&ward_id=all",
        "res": '{"thang": 9, "nam": 2026, "tong_kinh_phi": 24650000000, "tong_doi_tuong": 12480, "items": [...]}',
        "status": "200 OK"
    },
    {
        "method": "POST",
        "endpoint": "/api/v1/payroll/reconcile-bank",
        "desc": "Đối soát tự động danh sách chi trả qua tài khoản ngân hàng theo Đề án 06",
        "req": 'Multipart Form Data: file sao kê ngân hàng (.csv hoặc .xlsx)',
        "res": '{"status": "SUCCESS", "total_records": 1200, "matched": 1198, "failed": 2, "failed_items": [{"cccd": "...", "reason": "Sai STK"}]}',
        "status": "200 OK"
    },
    {
        "method": "POST",
        "endpoint": "/api/v1/surveys",
        "desc": "Tiếp nhận ý kiến đánh giá CSAT của công dân từ Kiosk cảm ứng hoặc mã QR",
        "req": '{"ho_so_id": 12029, "kenh": "KIOSK", "diem_csat": 5, "tieu_chi": {"THAI_DO": 5, "THOI_GIAN": 5, "MINH_BACH": 5, "HA_TANG": 5}, "comment": "Cán bộ rất nhiệt tình"}',
        "res": '{"status": "SUCCESS", "khao_sat_id": 9520, "sentiment": "POSITIVE", "message": "Cảm ơn quý công dân đã đánh giá"}',
        "status": "201 Created"
    },
    {
        "method": "GET",
        "endpoint": "/api/v1/analytics/radar-csat",
        "desc": "Lấy số liệu tổng hợp biểu đồ Radar 4 tiêu chí SIPAS và xếp hạng CSAT 14 phường",
        "req": "Headers: Authorization: Bearer <TOKEN>",
        "res": '{"radar_scores": {"THAI_DO": 4.88, "THOI_GIAN": 4.82, "MINH_BACH": 4.90, "HA_TANG": 4.80}, "ranking_wards": [...]}',
        "status": "200 OK"
    },
    {
        "method": "GET",
        "endpoint": "/api/v1/public/tracking",
        "desc": "Cổng tra cứu công khai tiến độ Một cửa dành cho công dân (che số CCCD bảo mật)",
        "req": "Query param: ?cccd=074026000123",
        "res": '{"found": true, "masked_cccd": "074***000123", "ho_ten": "HỒ VĂN LÊN", "tien_do": "ĐÃ_PHÊ_DUYỆT", "ngay_tra_ket_qua": "2026-07-28"}',
        "status": "200 OK / 404 Not Found"
    }
]

DINH_MUC_PHAP_LY = [
    ("Mức chuẩn trợ cấp ưu đãi", "2.055.000 VNĐ/tháng", "Nghị định số 75/2021/NĐ-CP & Nghị định số 55/2023/NĐ-CP", "Căn cứ gốc để tính toàn bộ định mức trợ cấp, phụ cấp"),
    ("Trợ cấp Thương binh (suy giảm 21% - 40%)", "2.363.000 VNĐ/tháng", "Hệ số 1.15 x Mức chuẩn", "Áp dụng cho thương binh có tỷ lệ tổn thương cơ thể 21-40%"),
    ("Trợ cấp Thương binh (suy giảm 41% - 60%)", "3.740.000 VNĐ/tháng", "Hệ số 1.82 x Mức chuẩn", "Áp dụng cho thương binh có tỷ lệ tổn thương cơ thể 41-60%"),
    ("Trợ cấp Thương binh (suy giảm 61% - 80%)", "5.405.000 VNĐ/tháng", "Hệ số 2.63 x Mức chuẩn", "Áp dụng cho thương binh có tỷ lệ tổn thương cơ thể 61-80%"),
    ("Trợ cấp Thương binh (suy giảm 81% - 100%)", "7.912.000 VNĐ/tháng", "Hệ số 3.85 x Mức chuẩn", "Áp dụng cho thương binh có tỷ lệ tổn thương cơ thể 81-100%"),
    ("Phụ cấp người phục vụ thương binh nặng", "2.055.000 VNĐ/tháng", "1.0 x Mức chuẩn", "Dành cho người phục vụ thương binh suy giảm từ 81% trở lên"),
    ("Trợ cấp Bà mẹ Việt Nam Anh hùng", "6.165.000 VNĐ/tháng", "3.0 x Mức chuẩn", "Hưởng trợ cấp ưu đãi hàng tháng"),
    ("Phụ cấp chăm sóc Bà mẹ VNAH", "2.055.000 VNĐ/tháng", "1.0 x Mức chuẩn", "Phụ cấp ưu đãi hàng tháng dành cho Mẹ VNAH"),
    ("Trợ cấp thờ cúng Liệt sĩ hàng năm", "1.400.000 VNĐ/năm", "Nghị định số 75/2021/NĐ-CP", "Chi trả một lần vào dịp kỷ niệm ngày 27/7 hàng năm"),
    ("Trợ cấp Mai táng phí khi từ trần", "20.550.000 VNĐ", "10 tháng x Mức chuẩn (2.055.000đ)", "Chi trả trợ cấp một lần cho thân nhân khi đối tượng qua đời"),
    ("Kinh phí điều dưỡng tập trung", "3.699.000 VNĐ/người/lượt", "1.8 x Mức chuẩn", "Điều dưỡng tại các Trung tâm điều dưỡng Người có công"),
    ("Kinh phí điều dưỡng tại nhà", "1.849.500 VNĐ/người/lượt", "0.9 x Mức chuẩn", "Chi trả trực tiếp bằng tiền mặt hoặc chuyển khoản tại nhà")
]

SCREENSHOT_DATA = [
    {
        "filename": "01_login_cap_so.png",
        "fig_num": "4.1",
        "title": "Giao diện Cổng Đăng nhập Phân quyền Quản trị Cấp Sở",
        "desc": "Màn hình đăng nhập quản trị dành cho Lãnh đạo và Chuyên viên Sở LĐ-TB&XH, tích hợp xác thực bảo mật đa yếu tố và phân quyền RBAC."
    },
    {
        "filename": "02_login_cap_phong.png",
        "fig_num": "4.2",
        "title": "Giao diện Cổng Đăng nhập Cán bộ Chuyên viên Cấp Phòng",
        "desc": "Màn hình đăng nhập nghiệp vụ chuyên trách dành cho Chuyên viên thụ lý hồ sơ Phòng Văn hóa và Thông tin / LĐ-TB&XH TP. Thủ Dầu Một."
    },
    {
        "filename": "03_dashboard_tong_quan.png",
        "fig_num": "4.3",
        "title": "Bảng điều khiển trung tâm Giám sát và Thống kê Toàn diện",
        "desc": "Dashboard điều hành hiển thị tổng số hồ sơ, tỷ lệ giải quyết đúng hạn (99.2%), cảnh báo hồ sơ trễ hạn và các biểu đồ phân tích thời gian thực."
    },
    {
        "filename": "04_bieu_do_kinh_phi.png",
        "fig_num": "4.4",
        "title": "Biểu đồ Phân bổ Kinh phí Trợ cấp Phân tầng theo 14 Phường",
        "desc": "Trực quan hóa ngân sách chi trả trợ cấp người có công hàng tháng phân bổ chi tiết theo 14 phường thuộc địa bàn TP. Thủ Dầu Một."
    },
    {
        "filename": "05_chuyen_doi_vai_tro.png",
        "fig_num": "4.5",
        "title": "Trình đơn Chuyển đổi Nhanh Vai trò Quản trị và Kiểm toán",
        "desc": "Tính năng Role Switcher trên thanh điều hướng cho phép kiểm thử viên và quản trị viên chuyển đổi linh hoạt giữa các ngữ cảnh quyền hạn."
    },
    {
        "filename": "06_giay_hen_mot_cua_qr.png",
        "fig_num": "4.6",
        "title": "Mẫu Giấy hẹn Tiếp nhận Một cửa Tích hợp Mã QR Code Tra cứu",
        "desc": "Mẫu phiếu tiếp nhận hồ sơ chuẩn hóa hành chính nhà nước, tích hợp mã phản hồi nhanh QR Code định danh duy nhất cho từng mã hồ sơ."
    },
    {
        "filename": "07_cong_dan_danh_gia_csat.png",
        "fig_num": "4.7",
        "title": "Cổng Kiosk Khảo sát và Đánh giá Sự hài lòng Công dân (CSAT)",
        "desc": "Giao diện Kiosk cảm ứng thân thiện phục vụ người có công và thân nhân trực tiếp chấm điểm sự hài lòng theo thang đo 5 cấp độ và chỉ số SIPAS."
    },
    {
        "filename": "08_giam_sat_csat_can_bo.png",
        "fig_num": "4.8",
        "title": "Trung tâm Giám sát Chỉ số CSAT và Biểu đồ Radar SIPAS Cán bộ",
        "desc": "Màn hình theo dõi chất lượng phục vụ của từng cán bộ Một cửa với biểu đồ mạng nhện Radar phân tích 4 khía cạnh: Thái độ, Thời gian, Minh bạch, Cơ sở vật chất."
    },
    {
        "filename": "09_phieu_chi_c70a_hd.png",
        "fig_num": "4.9",
        "title": "Phiếu Chi trả Trợ cấp Người có công Mẫu C70a-HD Tích hợp Mã vạch",
        "desc": "Chứng từ kế toán chi trả trợ cấp hàng tháng theo chuẩn Bộ Tài chính (Mẫu C70a-HD), tích hợp mã vạch định danh giải ngân và chữ ký điện tử."
    },
    {
        "filename": "10_chi_tiet_ho_so_liet_si.png",
        "fig_num": "4.10",
        "title": "Màn hình Chi tiết Hồ sơ Liệt sĩ và Danh sách Thân nhân Hưởng quyền lợi",
        "desc": "Thông tin số hóa toàn diện về hồ sơ Liệt sĩ, quá trình hy sinh, thân nhân thờ cúng, danh mục hiện vật và các quyết định công nhận hưởng chế độ."
    },
    {
        "filename": "11_quan_ly_dieu_duong.png",
        "fig_num": "4.11",
        "title": "Phân hệ Quản lý Chỉ tiêu và Lập danh sách Điều dưỡng Hàng năm",
        "desc": "Chức năng quản lý chỉ tiêu điều dưỡng tập trung và điều dưỡng tại nhà theo niên hạn 1 năm / 2 năm quy định tại Nghị định 131/2021/NĐ-CP."
    },
    {
        "filename": "12_ban_do_nhiet_phan_tich.png",
        "fig_num": "4.12",
        "title": "Bản đồ Nhiệt (Heatmap) Mật độ Hồ sơ và Phân tích Dữ liệu Phường",
        "desc": "Bản đồ trực quan hóa mật độ phân bố người có công tại 14 phường, hỗ trợ lãnh đạo TP. Thủ Dầu Một ra quyết định phân bổ nguồn lực công tác xã hội."
    },
    {
        "filename": "13_dung_cu_chinh_hinh.png",
        "fig_num": "4.13",
        "title": "Quản lý Cấp phát Phương tiện Trợ giúp và Dụng cụ Chỉnh hình",
        "desc": "Module theo dõi chu kỳ cấp phát xe lăn, chân tay giả, máy trợ thính, nạng và dụng cụ chỉnh hình phục hồi chức năng cho thương bệnh binh."
    },
    {
        "filename": "14_ban_do_nghia_trang_gis.png",
        "fig_num": "4.14",
        "title": "Bản đồ Số Không gian GIS Nghĩa trang Liệt sĩ Tỉnh Bình Dương",
        "desc": "Hệ thống bản đồ số tọa độ GIS quản lý các khu mộ liệt sĩ, thông tin danh tính phần mộ và tích hợp tính năng thắp nến tri ân tưởng niệm trực tuyến."
    },
    {
        "filename": "15_cong_tra_cuu_cong_dan.png",
        "fig_num": "4.15",
        "title": "Cổng Dịch vụ Tra cứu Tiến độ Xử lý Hồ sơ Công dân theo Số CCCD",
        "desc": "Giao diện tra cứu công khai trên nền web giúp người dân theo dõi trực tiếp timeline giải quyết thủ tục Một cửa, cơ chế tự động che số CCCD bảo mật."
    },
    {
        "filename": "16_danh_sach_ho_so_bao_giam.png",
        "fig_num": "4.16",
        "title": "Quy trình Nghiệp vụ Báo giảm Từ trần và Quyết định Mai táng phí Mẫu 02",
        "desc": "Giao diện thực hiện quy trình nghiệp vụ báo giảm đối tượng người có công từ trần, tự động khóa chi trả và khởi tạo hồ sơ quyết định trợ cấp mai táng phí."
    },
    {
        "filename": "17_chi_tra_doi_soat_ngan_hang.png",
        "fig_num": "4.17",
        "title": "Module Đối soát Tự động Chi trả Ngân hàng (Bank Reconciliation)",
        "desc": "Hệ thống tự động so khớp file sao kê giao dịch từ ngân hàng thương mại với sổ phụ trợ cấp, nhận diện sai lệch và xác nhận giải ngân an sinh xã hội."
    },
    {
        "filename": "18_quy_trinh_tham_dinh_so_hoa.png",
        "fig_num": "4.18",
        "title": "Quy trình Thẩm định Hồ sơ 5 Bước Một cửa và Ký số SmartCA",
        "desc": "Luồng xử lý hồ sơ hành chính liên thông từ Tiếp nhận -> Phân công -> Thẩm định hồ sơ -> Lãnh đạo phê duyệt -> Ký số điện tử và Trả kết quả."
    },
    {
        "filename": "19_cau_hinh_he_thong.png",
        "fig_num": "4.19",
        "title": "Giao diện Cấu hình Định mức Trợ cấp Pháp lý và Tham số Hệ thống",
        "desc": "Màn hình cấu hình linh hoạt mức chuẩn trợ cấp ưu đãi, hệ số trợ cấp thương tật và chu kỳ điều dưỡng mà không cần can thiệp mã nguồn."
    },
    {
        "filename": "20_tiep_nhan_ho_so_moi_modal.png",
        "fig_num": "4.20",
        "title": "Modal Tiếp nhận Hồ sơ Người có công Mới có Cơ chế Kiểm tra Dữ liệu Zod",
        "desc": "Hộp thoại nhập liệu tiếp nhận hồ sơ mới với cơ chế thẩm định dữ liệu (validation) nghiêm ngặt từ số CCCD 12 chữ số, mã hồ sơ đến thông tin thân nhân."
    },
    {
        "filename": "21_ai_ocr_so_hoa_modal.png",
        "fig_num": "4.21",
        "title": "Modal Số hóa Tài liệu bằng Trí tuệ Nhân tạo (AI OCR) và Trích xuất Dữ liệu",
        "desc": "Tính năng quét số hóa hồ sơ giấy, Bằng Tổ quốc ghi công và Giấy chứng nhận thương binh bằng công nghệ AI OCR, tự động điền trường dữ liệu vào hệ thống."
    }
]

print("Expanded report_data.py created successfully with 30 checklist items, 50 test cases, 15 bugs, 13 weeks, and 21 screenshots!")
