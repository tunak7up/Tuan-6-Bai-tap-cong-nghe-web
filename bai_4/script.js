//CHỨC NĂNG TÌM KIẾM SẢN PHẨM

// Lấy các phần tử cần thiết
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

// Hàm tìm kiếm sản phẩm
function searchProducts() {
    // Lấy danh sách sản phẩm khi tìm kiếm
    const products = document.querySelectorAll('.product-container article');
    
    // Lấy giá trị tìm kiếm và chuyển về chữ thường
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    // Duyệt qua tất cả các sản phẩm
    products.forEach(product => {
        // Lấy tên sản phẩm (trong thẻ h3 hoặc h4)
        const productName = product.querySelector('h3, h4');
        
        if (productName) {
            const productText = productName.textContent.toLowerCase();
            
            // Kiểm tra xem tên sản phẩm có chứa từ khóa không
            if (productText.includes(searchTerm)) {
                // Hiển thị sản phẩm
                product.style.display = '';
            } else {
                // Ẩn sản phẩm
                product.style.display = 'none';
            }
        }
    });
    
    // Nếu không nhập gì thì hiển thị tất cả
    if (searchTerm === '') {
        products.forEach(product => {
            product.style.display = '';
        });
    }
}

// Gắn sự kiện click cho nút tìm kiếm
if (searchBtn) {
    searchBtn.addEventListener('click', searchProducts);
}

// Gắn sự kiện keyup cho ô tìm kiếm (tìm kiếm khi gõ)
if (searchInput) {
    searchInput.addEventListener('keyup', function(event) {
        // Tìm kiếm ngay khi gõ
        searchProducts();
    });
}


// CHỨC NĂNG HIỂN THỊ/ẨN FORM THÊM SẢN PHẨM 

// Lấy nút và form thêm sản phẩm
const addProductBtn = document.getElementById('addProductBtn');
const addProductFormContainer = document.getElementById('addProductForm'); // Đổi tên để tránh nhầm lẫn với form bên trong
const formElement = document.getElementById('formElement'); // Lấy thẻ <form>
const errorMsg = document.getElementById('errorMsg'); // Lấy thẻ báo lỗi

// Hàm toggle form
function toggleAddProductForm() {
    if (addProductFormContainer) {
        // Sử dụng classList.toggle để thêm/xóa class 'hidden'
        addProductFormContainer.classList.toggle('hidden');
        
        // Thay đổi text của nút và ẩn lỗi (nếu có)
        if (addProductFormContainer.classList.contains('hidden')) {
            addProductBtn.textContent = 'Thêm sản phẩm';
            errorMsg.style.display = 'none'; // Ẩn lỗi khi đóng form
        } else {
            addProductBtn.textContent = 'Đóng form';
        }
    }
}

// Gắn sự kiện click cho nút thêm sản phẩm
if (addProductBtn) {
    addProductBtn.addEventListener('click', toggleAddProductForm);
}


// CHỨC NĂNG THÊM SẢN PHẨM MỚI 

// Xử lý submit form thêm sản phẩm
if (formElement) { // Lắng nghe sự kiện submit trên thẻ <form>
    formElement.addEventListener('submit', function(event) {
        event.preventDefault(); // Ngăn form submit mặc định
        
        // 1. LẤY GIÁ TRỊ TỪ FORM 
        const productName = document.getElementById('productName').value.trim();
        const productDescription = document.getElementById('productDescription').value.trim();
        const productSpecs = document.getElementById('productSpecs').value.trim();
        const productPriceStr = document.getElementById('productPrice').value.trim();
        const productImage = document.getElementById('productImage').value.trim();
        
        // 2. VALIDATE DỮ LIỆU 
        const productPrice = Number(productPriceStr); // Chuyển giá sang kiểu Số

        if (productName === '') {
            errorMsg.textContent = 'Tên sản phẩm không được rỗng.';
            errorMsg.style.display = 'block';
            return; // Dừng hàm nếu lỗi
        }

        if (isNaN(productPrice) || productPrice <= 0) {
            errorMsg.textContent = 'Giá phải là một số hợp lệ và lớn hơn 0.';
            errorMsg.style.display = 'block';
            return; // Dừng hàm nếu lỗi
        }

        // Nếu tất cả đều hợp lệ, ẩn thông báo lỗi
        errorMsg.style.display = 'none';

        // 3. TẠO PHẦN TỬ SẢN PHẨM MỚI
        const newProduct = document.createElement('article');
        newProduct.innerHTML = `
            <h3>${productName}</h3>
            <img src="${productImage || 'https://via.placeholder.com/300x200?text=No+Image'}" alt="${productName}">
            <p>${productDescription || 'Chưa có mô tả'}</p>
            <p><strong>Thông số:</strong> ${productSpecs || 'N/A'}</p>
            <p><strong>Giá:</strong> ${productPrice.toLocaleString('vi-VN')} VNĐ</p>
        `;
        
        // 4. THÊM SẢN PHẨM VÀO DANH SÁCH
        const productContainer = document.querySelector('.product-container');
        if (productContainer) {
            productContainer.appendChild(newProduct); // Thêm vào cuối danh sách
        }
        
        // 5. RESET FORM VÀ ẨN ĐI 
        formElement.reset(); // Reset nội dung các trường input
        addProductFormContainer.classList.add('hidden'); // Ẩn form
        addProductBtn.textContent = 'Thêm sản phẩm'; // Đổi lại text nút
        
        
    });
}


// HIỆU ỨNG BỔ SUNG 

// Smooth scroll khi click vào menu
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(event) {
        event.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Log để kiểm tra script đã load
console.log('Script.js đã được tải thành công!');
// Xóa log 'products.length' vì 'products' không còn là biến toàn cục