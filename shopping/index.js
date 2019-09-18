// 商品 Hover 效果
function productHoverEffect() {
    $('#grid .product .product-detail').hover(
        function () {
            $(this).addClass('animate');
        },
        function () {
            $(this).removeClass('animate');
        }
    );
}
// 切换商品布局
function switchProductLayout() {
    // 点击大风格布局
    $('#gridSelector').on('click', '.large-grid', function () {
        $(this).children('a').addClass('active');
        $('#gridSelector')
            .find('.small-grid a')
            .removeClass('active');

        $('#grid')
            .find('.product')
            .addClass('large');

        // 延时显示效果
        $('#grid .info-large').show();

        $('#grid').find('.product-detail .stats').hide();


        // 解绑事件
        $('#grid .product .product-detail').off('mouseenter');

        return false;
    });

    // 点击小风格布局
    $('#gridSelector').on('click', '.small-grid', function () {
        $(this).find('a').addClass('active');

        $('#gridSelector').find('.large-grid a').removeClass('active');

        $('#grid').find('.product').removeClass('large');

        $('#grid').find('.product-detail .stats').show();

        $('.info-large').fadeOut('fast');

        productHoverEffect();

        return false;
    });
}
// 处理将选择的商品添加到购物车的事件
function handleAddProductToCart() {
    $('#grid').on('click', '.add-product-to-cart,.add-cart-large', function () {

        var productInfo = $(this)
            .parents('.product')
            .find('.product-card');

        // 商品图片
        var productImage = productInfo.find('.product-img').attr('src');

        // 商品名称
        var productName = productInfo.find('.product-name').text();

        // 商品单价
        var productPrice = productInfo.find('.product-price').text();

        var cartTarget = $('#cart');

        // 克隆商品对象
        var cloneProduct = productInfo
            .clone()
            .css(productInfo.offset())
            .appendTo('body');

        // 商品飞入购物车效果
        cloneProduct
            .animate({
                    left: cartTarget.offset().left,
                    top: cartTarget.offset().top + cartTarget.height(),

                    width: '50px',
                    height: '100px'
                },
                500
            )
            .fadeOut('slow', function () {
                var productItem =
                    '<div class="cart-item">' +
                    '<div class="img-wrap">' +
                    '<img src="' +
                    productImage +
                    '" alt="">' +
                    '</div>' +
                    '<span>' +
                    productName +
                    '</span>' +
                    '<strong>' +
                    productPrice +
                    '</strong>' +
                    '</div>';
                var localItems = localStorage.getItem("products");
                var products = JSON.parse(localItems);
                var flag;
                $.each(products, function (i, v) {
                    var name = v.name;
                    if (productName == name) {
                        alert("该商品以添加到购物车！");
                        cloneProduct.remove();
                        flag = true;
                        return false;
                    }
                });
                if (!flag) {
                    $('#cart').append($(productItem));
                    // 删除克隆的商品对象
                    cloneProduct.remove();
                    showCheckedBtn();
                    $('#cart').find("span").hide();
                    saveLocalStorage();
                }
            });

    });

}

function showCheckedBtn() {
    if (!$("#checkout").is(":visible")) {
        $("#checkout").fadeIn("200");
    }
}


function saveLocalStorage() {
    var productData = [];

    $('#cart')
        .find('.cart-item')
        .each(function (i, target) {
            productData.push({
                image: $(target)
                    .find('img')
                    .attr('src'),
                name: $(target)
                    .find('span')
                    .text(),
                price: $(target)
                    .find('strong')
                    .text()
            });
        });

    localStorage.setItem('products', JSON.stringify(productData));

}

function appendProductToCart(img, name, price) {
    var localData =
        '<div class="cart-item">' +
        '<div class="img-wrap">' +
        '<img src="' +
        img +
        '" alt="">' +
        '</div>' +
        '<span>' +
        name +
        '</span>' +
        '<strong>' +
        price +
        '</strong>' +
        '</div>';
    $('#cart').append($(localData));

}

function getData() {
    var localItems = localStorage.getItem("products");
    if (
        localItems !== '' &&
        localItems !== null &&
        localItems !== undefined
    ) {
        var products = [];
        products = JSON.parse(localItems);
        console.log(products);
        showCheckedBtn();

        $.each(products, function (i, v) {
            appendProductToCart(v.image, v.name, v.price);
        });
        $('#cart').find("span").hide();
    }


}
$(function () {

    productHoverEffect();
    switchProductLayout();
    handleAddProductToCart();
    getData();
});