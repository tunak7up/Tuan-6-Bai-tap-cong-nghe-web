// ===== LẤY CÁC PHẦN TỬ DOM CHÍNH =====
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const addProductBtn = document.getElementById('addProductBtn');
const addProductFormContainer = document.getElementById('addProductForm');
const formElement = document.getElementById('formElement');
const errorMsg = document.getElementById('errorMsg');
const productContainer = document.querySelector('.product-container');

// (Xóa mảng defaultProducts ở đây, vì đã chuyển sang products.json)

// ===== HÀM TẠO MỘT PHẦN TỬ SẢN PHẨM =====
// Hàm helper để tạo HTML cho 1 sản phẩm
function createProductElement(product) {
    const newProduct = document.createElement('article');
    const titleTag = product.name.toLowerCase() === 'thầy nam đẹp trai' ? 'h4' : 'h3';

    newProduct.innerHTML = `
        <${titleTag}>${product.name}</${titleTag}>
        <img src="${product.img || 'https://via.placeholder.com/300x200?text=No+Image'}" alt="${product.name}" style="${product.name.toLowerCase() === 'thầy nam đẹp trai' ? 'width: 200px;' : ''}">
        <p>${product.desc || 'Chưa có mô tả'}</p>
        <p><strong>Thông số:</strong> ${product.specs || 'N/A'}</p>
        <p><strong>Giá:</strong> ${product.price.toLocaleString('vi-VN')} VNĐ</p>
    `;
    return newProduct;
}

// ===== HÀM HIỂN THỊ DANH SÁCH SẢN PHẨM RA MÀN HÌNH =====
// Tách hàm này ra từ loadProducts
function renderProducts(productsArray) {
    productContainer.innerHTML = ''; // Xóa nội dung cũ
    productsArray.forEach(product => {
        const productElement = createProductElement(product);
        productContainer.appendChild(productElement);
    });
}

// ===== HÀM TẢI SẢN PHẨM (TỪ LOCALSTORAGE HOẶC FETCH) =====
// Chuyển thành hàm async để dùng await
async function loadProducts() {
    let productsArray = JSON.parse(localStorage.getItem('products'));

    if (!productsArray || productsArray.length === 0) {
        // Nếu localStorage trống, fetch từ file JSON
        try {
            console.log('LocalStorage trống, đang tải dữ liệu từ products.json...');
            const response = await fetch('./products.json');
            
            if (!response.ok) {
                // Nếu fetch lỗi (vd: file 404), ném ra lỗi
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            productsArray = await response.json();
            
            // Lưu dữ liệu vừa fetch vào localStorage cho lần tải sau
            localStorage.setItem('products', JSON.stringify(productsArray));
            console.log('Đã tải và lưu dữ liệu seed vào LocalStorage.');

        } catch (error) {
            console.error('Không thể tải dữ liệu sản phẩm:', error);
            productContainer.innerHTML = '<p style="color: red; text-align: center;">Lỗi: Không thể tải danh sách sản phẩm. Vui lòng kiểm tra console.</p>';
            return; // Dừng hàm nếu có lỗi
        }
    }

    // Hiển thị sản phẩm ra màn hình
    renderProducts(productsArray);
}


// ===== CHỨC NĂNG TÌM KIẾM SẢN PHẨM =====
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


// ===== CHỨC NĂNG THÊM SẢN PHẨM MỚI =====
if (formElement) {
    formElement.addEventListener('submit', function(event) {
        event.preventDefault(); 
        
        const productName = document.getElementById('productName').value.trim();
        const productDescription = document.getElementById('productDescription').value.trim();
        const productSpecs = document.getElementById('productSpecs').value.trim();
        const productPriceStr = document.getElementById('productPrice').value.trim();
        const productImage = document.getElementById('productImage').value.trim();
        
        const productPrice = Number(productPriceStr);
        if (productName === '') {
            errorMsg.textContent = 'Tên sản phẩm không được rỗng.';
            errorMsg.style.display = 'block';
            return; 
        }
        if (isNaN(productPrice) || (productPrice < 0)) { 
             errorMsg.textContent = 'Giá phải là một số hợp lệ (lớn hơn hoặc bằng 0).';
             errorMsg.style.display = 'block';
             return;
        }
        errorMsg.style.display = 'none';

        const newProductObject = {
            name: productName,
            img: productImage,
            desc: productDescription,
            specs: productSpecs,
            price: productPrice 
        };

        let productsArray = JSON.parse(localStorage.getItem('products'));
        productsArray.push(newProductObject);
        localStorage.setItem('products', JSON.stringify(productsArray));

        const newProductElement = createProductElement(newProductObject);
        productContainer.appendChild(newProductElement);
        
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

// ===== SỰ KIỆN KHỞI CHẠY KHI TẢI TRANG =====
document.addEventListener('DOMContentLoaded', loadProducts);

console.log('Script.js (Bài 6 - Fetch) đã được tải thành công!');