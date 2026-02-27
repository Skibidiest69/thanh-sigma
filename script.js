/**
 * --------------------------------------------------------------------------
 * ChemLearn Pro - Hệ thống Điều khiển & Easter Egg Manager
 * --------------------------------------------------------------------------
 * Easter Egg Code: 18 - 36 - 67 - 69
 * Hành động: Đóng giao diện/Xóa màn hình.
 * --------------------------------------------------------------------------
 */

let resizeRAF = null;
// Mảng lưu trữ trình tự nhấn của người dùng
let clickHistory = [];
const EASTER_EGG_CODE = [18, 36, 67, 69];

/**
 * 1. KHỞI TẠO BẢNG TUẦN HOÀN
 */
function initTable() {
    const table = document.getElementById('periodicTable');
    if (!table || typeof elements === 'undefined') return;
    
    table.innerHTML = ""; 

    elements.forEach(el => {
        const div = document.createElement('div');
        div.className = `element ${el.cat || ''}`; 
        
        let row = el.r;
        let col = el.c;

        // TỰ ĐỘNG ĐẨY 2 DÃY DƯỚI:
        if (el.n >= 57 && el.n <= 71) {
            row = 9;
            col = el.n - 57 + 3;
        }
        if (el.n >= 89 && el.n <= 103) {
            row = 10;
            col = el.n - 89 + 3;
        }

        div.style.gridRow = String(row);
        div.style.gridColumn = String(col);
        div.innerHTML = `<span class="number">${el.n}</span><span class="symbol">${el.s}</span>`;
        
        // Sự kiện Click
        div.onclick = (e) => {
            e.stopPropagation();
            // Xử lý Easter Egg trước khi hiện thông tin
            checkEasterEgg(el.n);
            showInfo(el);
        };
        
        table.appendChild(div);
    });

    resizeTable();
}

/**
 * 2. LOGIC KIỂM TRA EASTER EGG (18-36-67-69)
 */
function checkEasterEgg(elementNumber) {
    // Thêm số hiệu nguyên tố vừa ấn vào lịch sử
    clickHistory.push(elementNumber);

    // Chỉ giữ lại 4 số gần nhất để so sánh
    if (clickHistory.length > 4) {
        clickHistory.shift();
    }

    // So sánh chuỗi vừa ấn với mã bí mật
    const isMatch = clickHistory.length === EASTER_EGG_CODE.length && 
                    clickHistory.every((val, index) => val === EASTER_EGG_CODE[index]);

    if (isMatch) {
        triggerSelfDestruct();
    }
}

/**
 * 3. HÀNH ĐỘNG KHI KÍCH HOẠT EASTER EGG
 * Lưu ý: Trình duyệt không cho phép window.close() nếu tab không được mở bằng script.
 * Vì vậy, chúng ta sẽ tạo hiệu ứng "bay màu" và chuyển hướng hoặc xóa trắng.
 */
function triggerSelfDestruct() {
    console.log("Easter Egg Activated: 18-36-67-69");
    
    // Tạo hiệu ứng rung lắc trước khi đóng
    document.body.style.animation = "shake 0.5s infinite";
    
    setTimeout(() => {
        // Xóa sạch nội dung HTML
        document.body.innerHTML = `
            <div style="height:100vh; display:flex; align-items:center; justify-content:center; background:#000; color:#ff0000; font-family:monospace; text-align:center;">
                <div>
                    <h1>HỆ THỐNG TỰ HỦY...</h1>
                    <p>Đang đóng kết nối an toàn.</p>
                </div>
            </div>
        `;
        
        // Cố gắng đóng tab (chỉ hoạt động ở một số trình duyệt hoặc tab popup)
        window.close();
        
        // Nếu không đóng được, chuyển hướng sang trang trắng hoặc Google
        setTimeout(() => {
            window.location.href = "about:blank";
        }, 1500);
    }, 1000);
}

/**
 * 4. HIỂN THỊ CHI TIẾT NGUYÊN TỐ
 */
function showInfo(el) {
    closeSidebar(); 
    document.getElementById("detName").innerText = el.name;
    document.getElementById("detNum").innerText = el.n;
    
    const detMore = document.getElementById("detMore");
    let html = `<table>`;

    if (el.wikiData) {
        const labels = {
            appearance: "Cảm quan",
            mass: "Khối lượng",
            phase: "Trạng thái",
            melting: "Nóng chảy",
            boiling: "Sôi",
            density: "Tỷ trọng",
            discovery: "Phát hiện",
            namedBy: "Đặt tên bởi",
            oxidation: "Số OXH",
            electronegativity: "Độ âm điện",
            category: "Phân loại"
        };

        const categoryTranslations = {
            "alkali": "Kim loại kiềm",
            "alkaline": "Kim loại kiềm thổ",
            "transition": "Kim loại chuyển tiếp",
            "basic-metal": "Kim loại hậu chuyển tiếp",
            "semimetal": "Chất bán kim",
            "nonmetal": "Phi kim",
            "halogen": "Halogen",
            "noble": "Khí hiếm",
            "lanthanide": "Họ Lanthan",
            "actinide": "Họ Actin"
        };

        // Dòng phân loại đầu tiên
        const catVN = categoryTranslations[el.cat] || el.cat;
        html += `<tr><td style="color:var(--accent-color); font-weight:bold;">${labels.category}:</td><td>${catVN}</td></tr>`;

        for (let key in el.wikiData) {
            let value = el.wikiData[key];
            if (value && value !== "unknown") {
                html += `<tr><td>${labels[key] || key}:</td><td>${value}</td></tr>`;
            }
        }
    }
    
    if (el.config) {
        let formattedConfig = el.config.replace(/([spdf])(\d+)/g, '$1<sup>$2</sup>');
        html += `<tr><td>Cấu hình e:</td><td>${formattedConfig}</td></tr>`;
    }

    html += `</table><a href="https://vi.wikipedia.org/wiki/${encodeURIComponent(el.name)}" target="_blank" class="wiki-link" style="display:block; margin-top:15px; color: #888888; text-decoration: none; font-size: 0.9em; font-style: italic; border-top: 1px solid #334155; padding-top:10px;">🔗 Nguồn: Wikipedia</a>`;
    detMore.innerHTML = html;
    document.getElementById("infoPanel").classList.add("active");
    syncResize();
}

/**
 * 5. CĂN CHỈNH KÍCH THƯỚC (RESIZE)
 */
function resizeTable() {
    const table = document.getElementById('periodicTable');
    const content = document.getElementById('mainContent');
    const infoPanel = document.getElementById('infoPanel');

    if (!table || !content) return;

    const isPanelActive = infoPanel && infoPanel.classList.contains('active');
    const sidebarW = 70; 
    const panelW = isPanelActive ? 320 : 0;

    content.style.paddingLeft = `${sidebarW}px`;
    content.style.paddingRight = `${panelW}px`;

    const availW = window.innerWidth - sidebarW - panelW - 40;
    const availH = window.innerHeight - 150;

    const baseW = 960; 
    const baseH = 550; 

    let scale = Math.min(availW / baseW, availH / baseH);
    if (scale > 1.1) scale = 1.1;

    table.style.transform = `scale(${scale})`;
    table.style.height = `${baseH * scale}px`;
}

/**
 * 6. QUẢN LÝ SIDEBAR & OVERLAY
 */
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    if (!sidebar.classList.contains('active')) {
        closeInfo();
        sidebar.classList.add('active');
        document.getElementById('overlay').classList.add('active');
    } else {
        closeSidebar();
    }
}

function closeSidebar() {
    if (document.getElementById('sidebar')) document.getElementById('sidebar').classList.remove('active');
    if (document.getElementById('overlay')) document.getElementById('overlay').classList.remove('active');
    syncResize();
}

function closeInfo() {
    const panel = document.getElementById("infoPanel");
    if (panel) panel.classList.remove("active");
    syncResize();
}

function syncResize() {
    let start = Date.now();
    const step = () => { resizeTable(); if (Date.now() - start < 400) requestAnimationFrame(step); };
    step();
}

/**
 * 7. LẮNG NGHE SỰ KIỆN TOÀN CỤC
 */
window.addEventListener('click', (e) => {
    const panel = document.getElementById("infoPanel");
    const sidebar = document.getElementById("sidebar");
    if (e.target.closest('.close-btn')) { closeInfo(); closeSidebar(); return; }
    if (panel && !panel.contains(e.target) && sidebar && !sidebar.contains(e.target) && !e.target.closest('.element') && !e.target.closest('.toggle-btn')) {
        closeInfo(); closeSidebar();
    }
});

// Thêm animation CSS cho hiệu ứng rung lắc tự hủy
const style = document.createElement('style');
style.innerHTML = `
    @keyframes shake {
        0% { transform: translate(1px, 1px) rotate(0deg); }
        10% { transform: translate(-1px, -2px) rotate(-1deg); }
        20% { transform: translate(-3px, 0px) rotate(1deg); }
        30% { transform: translate(3px, 2px) rotate(0deg); }
        40% { transform: translate(1px, -1px) rotate(1deg); }
        50% { transform: translate(-1px, 2px) rotate(-1deg); }
    }
`;
document.head.appendChild(style);

window.onload = initTable;
window.onresize = () => {
    if (resizeRAF) cancelAnimationFrame(resizeRAF);
    resizeRAF = requestAnimationFrame(resizeTable);
};