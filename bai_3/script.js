// tim kiem san pham

// Lấy các phần tử cần thiết
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const products = document.querySelectorAll('.product-container article');

// Hàm tìm kiếm sản phẩm
function searchProducts() {
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
        // Nếu nhấn Enter thì tìm kiếm
        if (event.key === 'Enter') {
            searchProducts();
        }
    });
}


// CHỨC NĂNG HIỂN THỊ/ẨN FORM THÊM SẢN PHẨM 

// Lấy nút và form thêm sản phẩm
const addProductBtn = document.getElementById('addProductBtn');
const addProductForm = document.getElementById('addProductForm');

// Hàm toggle (ẩn/hiện) form
function toggleAddProductForm() {
    if (addProductForm) {
        // Sử dụng classList.toggle để thêm/xóa class 'hidden'
        addProductForm.classList.toggle('hidden');
        
        // Thay đổi text của nút
        if (addProductForm.classList.contains('hidden')) {
            addProductBtn.textContent = 'Thêm sản phẩm';
        } else {
            addProductBtn.textContent = 'Đóng form';
        }
    }
}

// Gắn sự kiện click cho nút thêm sản phẩm
if (addProductBtn) {
    addProductBtn.addEventListener('click', toggleAddProductForm);
}


//  CHỨC NĂNG THÊM SẢN PHẨM MỚI 

// Xử lý submit form thêm sản phẩm
if (addProductForm) {
    addProductForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Ngăn form submit mặc định
        
        // Lấy giá trị từ các trường input
        const productName = document.getElementById('productName').value;
        const productDescription = document.getElementById('productDescription').value;
        const productSpecs = document.getElementById('productSpecs').value;
        const productPrice = document.getElementById('productPrice').value;
        const productImage = document.getElementById('productImage').value;
        
        // Tạo article mới cho sản phẩm
        const newProduct = document.createElement('article');
        newProduct.innerHTML = `
            <h3>${productName}</h3>
            <img src="${productImage || 'https://via.placeholder.com/300x200?text=No+Image'}" alt="${productName}">
            <p>${productDescription}</p>
            <p><strong>Thông số:</strong> ${productSpecs}</p>
            <p><strong>Giá:</strong> ${productPrice} VNĐ</p>
        `;
        
        // Thêm sản phẩm mới vào container
        const productContainer = document.querySelector('.product-container');
        if (productContainer) {
            productContainer.appendChild(newProduct);
        }
        
        // Reset form và ẩn đi
        addProductForm.reset();
        addProductForm.classList.add('hidden');
        addProductBtn.textContent = 'Thêm sản phẩm';
        
        // Hiển thị thông báo thành công
        alert('Đã thêm sản phẩm mới thành công!');
        
        // Cập nhật lại danh sách sản phẩm để tìm kiếm hoạt động với sản phẩm mới
        const updatedProducts = document.querySelectorAll('.product-container article');
        products.length = 0;
        updatedProducts.forEach(p => products.push(p));
    });
}


//HIỆU ỨNG BỔ SUNG 

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
console.log('Số sản phẩm tìm thấy:', products.length);