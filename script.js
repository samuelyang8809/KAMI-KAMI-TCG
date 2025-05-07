const categoryBar = document.getElementById('categoryBar');
const productGrid = document.getElementById('productGrid');
const modal = document.getElementById('variantModal');
const modalTitle = document.getElementById('modalTitle');
const modalImage = document.getElementById('modalImage');
const modalPrice = document.getElementById('modalPrice');
const variantSelect = document.getElementById('variantSelect');
const cartButton = document.getElementById('cartButton');
let modalQuantity = 1;
let currentVariants = [];
let currentItem = {};
let cart = [];
let currentDiscount = 0;
const data = {
	"商品大項": [{
		大項名稱: "擴散式卡磚",
		大項代號: "spread-frame",
		中項列表: [...["太晶慶典-伊布", "皮卡丘系列", "噴火龍系列", "奇樹系列", "莉莉艾系列", "151系列", "熱門V&Vmax系列", "SV9對戰夥伴", "SV8超電/太晶", "SV7龍騰/星晶", "SV6變幻假面", "SV5緋紅/異度狂野", "SV4a 閃色寶藏", "SV3 黯炎/激狂", "SV2 碟旋/冰雪", "SV1 朱紫/音爆", "Vstar天地萬物", "伊布英雄系列"].map(cat => ({
			中項名稱: cat,
			中項代號: cat.replace(/\s/g, '-').toLowerCase(), // 中項代號自動轉小寫、dash
			中項圖片: './img/demo1.png',
			小項列表: [{
				商品小項名稱: `${cat} Demo商品1`,
				商品小項價格: 100,
				商品小項圖片: './img/demo1.png',
				商品分類名稱: "擴散式卡磚",
				商品分類代號: "spread-frame"
			}, {
				商品小項名稱: `${cat} Demo商品2`,
				商品小項價格: 150,
				商品小項圖片: './img/demo2.png',
				商品分類名稱: "擴散式卡磚",
				商品分類代號: "spread-frame"
			}, {
				商品小項名稱: `${cat} Demo商品3`,
				商品小項價格: 200,
				商品小項圖片: './img/demo3.png',
				商品分類名稱: "擴散式卡磚",
				商品分類代號: "spread-frame"
			}]
		}))]
	}, {
		大項名稱: "卡牌周邊",
		大項代號: "card-accessory",
		中項列表: [{
			中項名稱: "卡牌周邊",
			中項代號: "card-accessory-general",
			中項圖片: './img/demo3.png',
			小項列表: [{
				商品小項名稱: "鑑定卡收納箱",
				商品小項價格: 750,
				商品小項圖片: './img/demo3.png',
				商品分類名稱: "卡牌周邊",
				商品分類代號: "card-accessory"
			}]
		}]
	}, {
		大項名稱: "擴散式鑑定卡殼",
		大項代號: "spread-slab",
		中項列表: [{
			中項名稱: "擴散式鑑定卡殼",
			中項代號: "spread-slab-general",
			中項圖片: './img/demo4.png',
			小項列表: [
				// 可自行補上鑑定卡殼商品
			]
		}]
	}]
};

function loadCategories() {
	const categoryBar = document.getElementById('categoryBar');
	categoryBar.innerHTML = '';
	const introSpan = document.createElement('span');
	introSpan.textContent = '介紹';
	introSpan.onclick = goToIntro;
	categoryBar.appendChild(introSpan);
	data.商品大項.forEach(major => {
		major.中項列表.forEach(mid => {
			const span = document.createElement('span');
			span.textContent = mid.中項名稱;
			span.onclick = () => renderCategory(major, mid);
			categoryBar.appendChild(span);
		});
	});
}

function renderCategory(majorCategory, midCategory) {
	document.getElementById('current-category').innerText = midCategory.中項名稱;
	document.querySelectorAll('.category-bar span').forEach(s => s.classList.remove('active'));
	[...categoryBar.children].forEach(s => {
		if(s.textContent === midCategory.中項名稱) s.classList.add('active');
	});
	productGrid.innerHTML = '';
	midCategory.小項列表.forEach((item) => {
		const div = document.createElement('div');
		div.className = 'card';
		div.innerHTML = `
      <img src="${item.商品小項圖片}" alt="${item.商品小項名稱}" style="border: 4px solid black; border-radius: 10px;">
      <h4>${item.商品小項名稱}</h4>
      <div onclick='openVariantModal(${JSON.stringify(majorCategory)}, ${JSON.stringify(midCategory)}, ${JSON.stringify(item)})' style="color: gray; font-size: 0.9em;">選擇款式</div>
      <div class="price">$${item.商品小項價格}</div>
      
    `;
		productGrid.appendChild(div);
	});
	document.getElementById('introBtn').style.display = 'inline-block';
}

function openVariantModal(majorCategory, midCategory, item) {
	currentVariants = midCategory.小項列表;
	currentItem = item;
	// 初始化Modal內容
	document.getElementById('modalProductName').innerText = item.商品小項名稱;
	document.getElementById('modalProductImage').src = item.商品小項圖片;
	document.getElementById('modalProductPrice').innerText = `$${item.商品小項價格}`;
	document.getElementById('modalQuantity').innerText = 1;
	modalQuantity = 1;
	const variantSelect = document.getElementById('modalVariantSelect');
	variantSelect.innerHTML = '';
	currentVariants.forEach((variant, idx) => {
		const opt = document.createElement('option');
		opt.value = idx;
		opt.textContent = variant.商品小項名稱;
		if(variant.商品小項名稱 === item.商品小項名稱) opt.selected = true;
		variantSelect.appendChild(opt);
	});
	modal.classList.add('show');
}

function updateModal(item) {
	modalTitle.innerText = item.商品小項名稱;
	modalImage.src = item.商品小項圖片;
	modalPrice.innerText = `$${item.商品小項價格}`;
}

function changeVariantInfo() {
	const idx = variantSelect.value;
	const selected = currentVariants[idx];
	currentItem = selected;
	updateModal(selected);
}

function closeModal() {
	const modalContent = modal.querySelector('.variantmodalbk');
	// 加動畫class
	modalContent.classList.add('fade-out');
	setTimeout(() => {
		modal.classList.remove('show');
		modalContent.classList.remove('fade-out');
	}, 500); // 動畫0.5秒後真正隱藏
}

function addToCart() {
	const existIndex = cart.findIndex(p => p.商品小項名稱 === currentItem.商品小項名稱);
	if(existIndex !== -1) {
		cart[existIndex].數量 += 1;
	} else {
		cart.push({...currentItem,
			數量: 1,
				variants: [...currentVariants] // 🔥 把當時的選項列表也存進去
		});
	}
	cartButton.innerText = `購物車 (${cart.reduce((sum, item) => sum + item.數量, 0)})`;
	showAlertModal(`已加入購物車：${currentItem.商品小項名稱}`, true);
	closeModal();
}

function goToIntro() {
	document.getElementById('current-category').innerText = '介紹';
	productGrid.innerHTML = `
      <div class='card'><img src='./img/demo1.png'><h4>擴散式卡磚</h4></div>
      <div class='card'><img src='./img/demo2.png'><h4>擴散式鑑定卡殼</h4></div>
      <div class='card'><img src='./img/demo3.png'><h4>卡牌周邊</h4></div>
    `;
	document.querySelectorAll('.category-bar span').forEach(s => s.classList.remove('active'));
	categoryBar.children[0].classList.add('active');
	document.getElementById('introBtn').style.display = 'none';
}

function toggleCartList() {
	if(cart.length === 0) {
		showAlertModal("購物車是空的喔！", true);
		return;
	}
	const container = document.querySelector('.container');
	const categoryBarWrapper = document.querySelector('.category-bar-wrapper');
	const introBtn = document.getElementById('introBtn');
	const cartPage = document.getElementById('cartPage');
	const fixedBottomBar = document.querySelector('.fixed-bottom-bar');
	// 🔥 首頁淡出
	container.classList.add('fade-out');
	categoryBarWrapper.classList.add('fade-out');
	setTimeout(() => {
		// 淡出完後隱藏首頁元素
		container.style.display = 'none';
		categoryBarWrapper.style.display = 'none';
		introBtn.style.display = 'none';
		fixedBottomBar.style.display = 'none';
		// 移除fade-out class
		container.classList.remove('fade-out');
		categoryBarWrapper.classList.remove('fade-out');
		// 顯示購物車頁
		cartPage.style.display = 'block';
		cartPage.classList.add('fade-in');
		// 1秒後清掉fade-in class
		setTimeout(() => {
			cartPage.classList.remove('fade-in');
		}, 1000);
		// 渲染購物車內容
		renderCartItems();
	}, 500); // 首頁淡出動畫時間
}
const categoryModal = document.getElementById('categoryModal');
const categoryModalGrid = document.getElementById('categoryModalGrid');

function toggleExpand() {
	categoryModal.classList.add('show');
	loadCategoryModal();
}

function updateModalVariantInfo() {
	const selectedIdx = parseInt(document.getElementById('modalVariantSelect').value, 10);
	const selectedVariant = currentVariants[selectedIdx];
	if(selectedVariant) {
		document.getElementById('modalProductName').innerText = selectedVariant.商品小項名稱;
		document.getElementById('modalProductImage').src = selectedVariant.商品小項圖片;
		document.getElementById('modalProductPrice').innerText = `$${selectedVariant.商品小項價格}`;
	}
}

function closeCategoryModal() {
	categoryModal.classList.remove('show');
}

function loadCategoryModal() {
	categoryModalGrid.innerHTML = '';
	data.商品大項.forEach(major => {
		major.中項列表.forEach(mid => {
			const div = document.createElement('div');
			div.className = 'category-card';
			div.innerHTML = `
        <img src="${mid.中項圖片}" alt="${mid.中項名稱}">
        <div>${mid.中項名稱}</div>
      `;
			div.onclick = () => {
				closeCategoryModal();
				renderCategory(major, mid);
			};
			categoryModalGrid.appendChild(div);
		});
	});
}
loadCategories();
goToIntro();
// ✅ 通用 alert Modal 顯示
function showAlertModal(message, autoClose = false) {
	document.getElementById('alertModalMessage').innerText = message;
	document.getElementById('alertModal').classList.add('show');
	if(autoClose) {
		setTimeout(() => {
			closeAlertModal();
		}, 500); // 2秒後自動關閉
	}
}

function closeAlertModal() {
	document.getElementById('alertModal').classList.remove('show');
}
// ✅ 結帳成功 Modal
function showCheckoutModal() {
	document.getElementById('checkoutModal').classList.add('show');
}

function closeCheckoutModal() {
	document.getElementById('checkoutModal').classList.remove('show');
}

function toggleCartList() {
	if(cart.length === 0) {
		showAlertModal("購物車是空的喔！", true);
		return; // 🔥 沒商品直接結束，不做下面的事
	}
	// 🔥 只有購物車有商品時才開始切換畫面
	document.querySelector('.fixed-bottom-bar').style.display = 'none';
	document.querySelector('.mainheader').style.display = 'none';
	document.querySelector('.container').style.display = 'none';
	document.querySelector('.category-bar-wrapper').style.display = 'none';
	document.getElementById('cartPage').style.display = 'block';
	document.getElementById('introBtn').style.display = 'none';
	renderCartItems();
}

function increaseModalQuantity() {
	modalQuantity++;
	document.getElementById('modalQuantity').innerText = modalQuantity;
}

function decreaseModalQuantity() {
	if(modalQuantity > 1) {
		modalQuantity--;
		document.getElementById('modalQuantity').innerText = modalQuantity;
	}
}

function renderCartItems() {
	const cartItems = document.getElementById('cartItems');
	cartItems.innerHTML = '';
	if(cart.length === 0) {
		cartButton.innerText = `購物車 (0)`;
		showAlertModal("購物車清空，返回首頁。", true);
		setTimeout(() => {
			backToHome();
		}, 500);
		return;
	}
	const grouped = {};
	cart.forEach(item => {
		if(!grouped[item.商品分類名稱]) {
			grouped[item.商品分類名稱] = [];
		}
		grouped[item.商品分類名稱].push(item);
	});
	for(const majorName in grouped) {
		const majorDiv = document.createElement('div');
		majorDiv.style.marginBottom = '1.5em';
		const majorHeader = document.createElement('div');
		majorHeader.textContent = majorName;
		majorHeader.style.fontWeight = 'bold';
		majorHeader.style.fontSize = '1.2em';
		majorHeader.style.margin = '1em 0 0.5em 0';
		majorDiv.appendChild(majorHeader);
		grouped[majorName].forEach((item, idx) => {
			const itemDiv = document.createElement('div');
			itemDiv.style.display = 'flex';
			itemDiv.style.alignItems = 'center';
			itemDiv.style.padding = '1em 0';
			itemDiv.style.borderBottom = '1px solid #eee';
			itemDiv.innerHTML = `
  <img src="${item.商品小項圖片}" alt="${item.商品小項名稱}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; margin-right: 1em;">
  <div style="flex: 1;">
    <div style="font-weight: bold;">${item.商品小項名稱}</div>
<select onchange="changeCartVariant(this, ${cart.indexOf(item)})" style="width: 120px; font-size: 0.8em; padding: 0.2em;">
  ${item.variants.map((variant, vIdx) => ` < option value = "${vIdx}"
			$ {
				variant.商品小項名稱 === item.商品小項名稱 ? 'selected' : ''
			} > $ {
				variant.商品小項名稱
			} < /option>
			`).join('')}
</select>
    <div style="color: #e67e22; font-weight: bold;">$${item.商品小項價格}</div>
  </div>
  <div style="display: flex; flex-direction: column; align-items: center; gap: 5px;">
    <div style="display: flex; align-items: center;">
      <button onclick="decreaseItem(${cart.indexOf(item)})" style="width:30px;height:30px;background:#eee;border:none;border-radius:5px;">–</button>
      <div style="width:30px;text-align:center;">${item.數量}</div>
      <button onclick="increaseItem(${cart.indexOf(item)})" style="width:30px;height:30px;background:#eee;border:none;border-radius:5px;">＋</button>
    </div>
  </div>
`;
			majorDiv.appendChild(itemDiv);
		});
		cartItems.appendChild(majorDiv);
	}
	updateCartSummary();
}

function changeCartVariant(selectElement, itemIndex) {
	const selectedIdx = parseInt(selectElement.value, 10);
	const selectedItem = cart[itemIndex];
	const newVariant = selectedItem.variants[selectedIdx];
	if(newVariant) {
		selectedItem.商品小項名稱 = newVariant.商品小項名稱;
		selectedItem.商品小項價格 = newVariant.商品小項價格;
		selectedItem.商品小項圖片 = newVariant.商品小項圖片;
		selectedItem.商品小項規格 = newVariant.商品小項規格 || '單一規格';
	}
	renderCartItems(); // 更新畫面
}

function toggleGroup(button) {
	const midGroup = button.parentElement.nextElementSibling;
	if(midGroup.style.display === 'none') {
		midGroup.style.display = 'block';
		button.textContent = '收合';
	} else {
		midGroup.style.display = 'none';
		button.textContent = '展開';
	}
}

function increaseItem(index) {
	cart[index].數量 += 1;
	renderCartItems();
}

function decreaseItem(index) {
	cart[index].數量 -= 1;
	if(cart[index].數量 <= 0) {
		cart.splice(index, 1); // 數量小於1就刪掉
	}
	renderCartItems();
}

function updateCartSummary() {
	const total = cart.reduce((sum, item) => sum + (item.商品小項價格 * item.數量), 0);
	const discount = total * currentDiscount;
	const finalTotal = total - discount;
	document.getElementById('finalAmount').innerText = finalTotal.toFixed(0);
	cartButton.innerText = `購物車 (${cart.reduce((sum, item) => sum + item.數量, 0)})`;
}

function applyDiscount() {
	const code = document.getElementById('discountCodeInput').value.trim();
	if(code === "PIKA10") {
		currentDiscount = 0.1;
		showAlertModal("成功套用 PIKA10 折扣碼！", true);
	} else if(code === "DRAGON20") {
		currentDiscount = 0.2;
		showAlertModal("成功套用 DRAGON20 折扣碼！", true);
	} else {
		currentDiscount = 0;
		showAlertModal("無效的折扣碼，請重新輸入。", true);
	}
	updateCartSummary();
}

function removeCartItem(index) {
	cart.splice(index, 1);
	renderCartItems();
}

function backToHome() {
	const cartPage = document.getElementById('cartPage');
	const container = document.querySelector('.container');
	const categoryBarWrapper = document.querySelector('.category-bar-wrapper');
	const introBtn = document.getElementById('introBtn');
	const fixedBottomBar = document.querySelector('.fixed-bottom-bar');
	// 🔥 先讓購物車頁 fadeOut
	cartPage.classList.add('fade-out');
	// 🔥 動畫跑完後 0.5秒，做切換
	setTimeout(() => {
		cartPage.style.display = 'none';
		cartPage.classList.remove('fade-out');
		container.style.display = 'block';
		categoryBarWrapper.style.display = 'flex';
		introBtn.style.display = 'inline-block';
		fixedBottomBar.style.display = 'flex';
		// 🔥 首頁加上 fadeIn
		container.classList.add('fade-in');
		categoryBarWrapper.classList.add('fade-in');
		// 🔥 1秒後清除 class（不然重複進來會沒效果）
		setTimeout(() => {
			container.classList.remove('fade-in');
			categoryBarWrapper.classList.remove('fade-in');
		}, 1000);
		// 回首頁重新載入商品分類
		loadCategories();
		goToIntro();
	}, 500);
}

function showToast(message) {
	const toast = document.getElementById('toast');
	toast.innerText = message;
	toast.className = 'show';
	setTimeout(() => {
		toast.className = toast.className.replace('show', '');
	}, 2500);
}

function addToCartFromModal() {
	const selectedIdx = parseInt(document.getElementById('modalVariantSelect').value, 10);
	const selectedVariant = currentVariants[selectedIdx];
	if(selectedVariant) {
		const existIndex = cart.findIndex(p => p.商品小項名稱 === selectedVariant.商品小項名稱);
		if(existIndex !== -1) {
			cart[existIndex].數量 += modalQuantity;
		} else {
			cart.push({...selectedVariant,
				數量: modalQuantity,
					variants: [...currentVariants] // 每筆商品記得帶自己的variants
			});
		}
		cartButton.innerText = `購物車 (${cart.reduce((sum, item) => sum + item.數量, 0)})`;
		showToast(`已加入購物車：${selectedVariant.商品小項名稱}`);
		closeModal();
	}
}

function submitOrder() {
	if(cart.length === 0) {
		showAlertModal("購物車是空的，無法送出訂單。", true);
		return;
	}
	showCheckoutModal();
	cart = [];
	cartButton.innerText = `購物車 (0)`;
	setTimeout(() => {
		closeCheckoutModal();
		backToHome();
	}, 500);
}