// ===== LẤY CÁC PHẦN TỬ DOM CHÍNH =====
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const addProductBtn = document.getElementById('addProductBtn');
const addProductFormContainer = document.getElementById('addProductForm');
const formElement = document.getElementById('formElement');
const errorMsg = document.getElementById('errorMsg');
const productContainer = document.querySelector('.product-container'); // (MỚI) Lấy container chính

// Dùng khi localStorage trống
const defaultProducts = [
    {
        name: 'Card Màn Hình NVIDIA GeForce RTX 4070 Ti',
        img: 'https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/graphic-cards/40-series/rtx-4070-4070ti/geforce-rtx-4070-super-og-1200x630.jpg',
        desc: 'Card đồ họa hiệu năng cao với 12GB GDDR6X, hỗ trợ Ray Tracing và DLSS 3. Hoàn hảo cho gaming 4K và render chuyên nghiệp.',
        specs: '12GB GDDR6X | 7680 CUDA Cores | 285W TDP',
        price: 24990000 
    },
    {
        name: 'Bộ Vi Xử Lý Intel Core i9-14900K',
        img: 'https://nguyencongpc.vn/media/product/25341-14900k.png',
        desc: 'CPU thế hệ 14 với 24 nhân 32 luồng, xung nhịp tối đa 6.0GHz. Sức mạnh vượt trội cho gaming, streaming và công việc sáng tạo nội dung.',
        specs: '24 Cores 32 Threads | Max 6.0GHz | Socket LGA1700',
        price: 15490000
    },
    {
        name: 'RAM Corsair Vengeance DDR5 32GB (2x16GB) 6000MHz',
        img: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_265_3_.png',
        desc: 'Bộ nhớ DDR5 cao cấp với tản nhiệt nhôm nguyên khối, RGB SYNC. Tốc độ 6000MHz, latency thấp, tối ưu cho gaming và đa nhiệm.',
        specs: '32GB (2x16GB) | DDR5 6000MHz | CL30 | RGB',
        price: 4290000
    },
    {
        name: 'Thầy Nam đẹp trai',
        img: 'https://soict.hust.edu.vn/graduation-day/wp-content/uploads/2025/06/LeHaiNam.png',
        desc: 'Trí tuệ nhân tạo ứng dụng (Applied Artificial Intelligence)',
        specs: 'SoICT - HUST',
        price: 0 // Giá 0 VNĐ
    }
];

// HÀM TẢI VÀ HIỂN THỊ SẢN PHẨM TỪ LOCALSTORAGE =====
function loadProducts() {
    // 1. Lấy dữ liệu từ localStorage
    let productsArray = JSON.parse(localStorage.getItem('products'));

    // 2. Kiểm tra
    if (!productsArray || productsArray.length === 0) {
        // Nếu không có gì, dùng dữ liệu mẫu và lưu vào localStorage
        productsArray = defaultProducts;
        localStorage.setItem('products', JSON.stringify(productsArray));
    }

    // 3. Xóa nội dung cũ trong container (đề phòng)
    productContainer.innerHTML = '';

    // 4. Lặp qua mảng và hiển thị
    productsArray.forEach(product => {
        const productElement = createProductElement(product);
        productContainer.appendChild(productElement);
    });
}

// HÀM TẠO MỘT PHẦN TỬ SẢN PHẨM =====
// Hàm helper để tạo HTML cho 1 sản phẩm, tránh lặp code
function createProductElement(product) {
    const newProduct = document.createElement('article');
    
    // Kiểm tra nếu tên là "Thầy Nam đẹp trai" thì dùng h4
    const titleTag = product.name.toLowerCase() === 'thầy nam đẹp trai' ? 'h4' : 'h3';

    // Dùng giá trị từ object 'product'
    newProduct.innerHTML = `
        <${titleTag}>${product.name}</${titleTag}>
        <img src="${product.img || 'https://via.placeholder.com/300x200?text=No+Image'}" alt="${product.name}" style="${product.name.toLowerCase() === 'thầy nam đẹp trai' ? 'width: 200px;' : ''}">
        <p>${product.desc || 'Chưa có mô tả'}</p>
        <p><strong>Thông số:</strong> ${product.specs || 'N/A'}</p>
        <p><strong>Giá:</strong> ${product.price.toLocaleString('vi-VN')} VNĐ</p>
    `;
    return newProduct;
}


// CHỨC NĂNG TÌM KIẾM SẢN PHẨM
// (Không thay đổi so với Bài 4 - Logic này vẫn đúng
// vì nó querySelectorAll mỗi lần chạy)
function searchProducts() {
    const products = document.querySelectorAll('.product-container article');
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    products.forEach(product => {
        const productName = product.querySelector('h3, h4');
        if (productName) {
            const productText = productName.textContent.toLowerCase();
            if (productText.includes(searchTerm)) {
                product.style.display = '';
            } else {
                product.style.display = 'none';
            }
        }
    });
    
    if (searchTerm === '') {
        products.forEach(product => {
            product.style.display = '';
        });
    }
}

if (searchBtn) {
    searchBtn.addEventListener('click', searchProducts);
}
if (searchInput) {
    searchInput.addEventListener('keyup', searchProducts);
}


// ===== CHỨC NĂNG HIỂN THỊ/ẨN FORM THÊM SẢN PHẨM =====
function toggleAddProductForm() {
    if (addProductFormContainer) {
        addProductFormContainer.classList.toggle('hidden');
        if (addProductFormContainer.classList.contains('hidden')) {
            addProductBtn.textContent = 'Thêm sản phẩm';
            errorMsg.style.display = 'none';
        } else {
            addProductBtn.textContent = 'Đóng form';
        }
    }
}

if (addProductBtn) {
    addProductBtn.addEventListener('click', toggleAddProductForm);
}


//  CHỨC NĂNG THÊM SẢN PHẨM MỚI 
if (formElement) {
    formElement.addEventListener('submit', function(event) {
        event.preventDefault(); 
        
        // --- 1. LẤY GIÁ TRỊ TỪ FORM ---
        const productName = document.getElementById('productName').value.trim();
        const productDescription = document.getElementById('productDescription').value.trim();
        const productSpecs = document.getElementById('productSpecs').value.trim();
        const productPriceStr = document.getElementById('productPrice').value.trim();
        const productImage = document.getElementById('productImage').value.trim();
        
        // --- 2. VALIDATE DỮ LIỆU ---
        const productPrice = Number(productPriceStr);
        if (productName === '') {
            errorMsg.textContent = 'Tên sản phẩm không được rỗng.';
            errorMsg.style.display = 'block';
            return; 
        }
        if (isNaN(productPrice) || productPrice <= 0) {
            // Cho phép giá = 0 (cho vui như Thầy Nam)
            if (productPrice !== 0) { 
                 errorMsg.textContent = 'Giá phải là một số hợp lệ (lớn hơn hoặc bằng 0).';
                 errorMsg.style.display = 'block';
                 return;
            }
        }
        errorMsg.style.display = 'none';

        // --- 3. TẠO OBJECT SẢN PHẨM MỚI ---
        const newProductObject = {
            name: productName,
            img: productImage,
            desc: productDescription,
            specs: productSpecs,
            price: productPrice 
        };

        // --- 4. CẬP NHẬT LOCALSTORAGE ---
        // Lấy mảng hiện tại từ storage
        let productsArray = JSON.parse(localStorage.getItem('products'));
        // Thêm object mới vào mảng
        productsArray.push(newProductObject);
        // Lưu mảng đã cập nhật trở lại storage
        localStorage.setItem('products', JSON.stringify(productsArray));

        // --- 5. TẠO PHẦN TỬ MỚI VÀ THÊM VÀO GIAO DIỆN ---
        const newProductElement = createProductElement(newProductObject);
        productContainer.appendChild(newProductElement);
        
        // --- 6. RESET FORM VÀ ẨN ĐI ---
        formElement.reset(); 
        addProductFormContainer.classList.add('hidden'); 
        addProductBtn.textContent = 'Thêm sản phẩm'; 
    });
}


// ===== HIỆU ỨNG BỔ SUNG =====
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

// SỰ KIỆN KHỞI CHẠY KHI TẢI TRANG

document.addEventListener('DOMContentLoaded', loadProducts);

console.log('Script.js đã được tải thành công!');