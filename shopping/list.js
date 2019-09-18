function appendProductToList(img, name, price) {
    var listItem =
        '<tr>' +
        '<td><input type="checkbox" name="productCheck"></td>' +
        '<td class="cart-product-name">' +
        '<img src="' +
        img +
        '" alt="No Image">' +
        '<span>' +
        name +
        '</span>' +
        '</td>' +
        '<td class="cart-product-price">' +
        price +
        '</td>' +
        '<td class="cart-product-count">' +
        '<span class="reduce">-</span>' +
        '<input class="count-input" type="text" value="1">' +
        '<span class="add">+</span>' +
        '</td>' +
        '<td class="cart-product-subtotal">' + price + '</td>' +
        '<td class="cart-product-operation">' +
        '<span class="delete">删除</span>' +
        '</td>' +
        '</tr>';
    $("#cartTable tbody").append(listItem);

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
        $.each(products, function (i, v) {
            appendProductToList(v.image, v.name, v.price);
        });
    }

}
$("#cartBody").on('click', '.add', function () {
    var input = $(this).prev();
    var inputValue = parseInt(input.val());

    input.val(inputValue + 1);

    countProductSubtotal(
        $(this)
        .parent()
        .parent()
    );
    countProductTotalAmountAndTotalCount();
});

// 点击减少商品数据按钮
$("#cartBody").on('click', '.reduce', function () {
    var input = $(this).next();
    var inputValue = parseInt(input.val());
    inputValue = inputValue > 1 ? inputValue - 1 : inputValue;

    input.val(inputValue);
    countProductSubtotal(
        $(this).parent().parent()
    );
    countProductTotalAmountAndTotalCount();
});

function countProductSubtotal(elem) {
    var productPrice = parseFloat(elem.find(".cart-product-price").text());
    var productCount = parseInt(elem.find(".count-input").val());
    elem.find(".cart-product-subtotal").text((productPrice * productCount).toFixed(2));


}

$("#selectAllProduct").click(function () {
    console.log($("#selectAllProduct").prop("checked"));
    if ($("#selectAllProduct").prop("checked")) {
        $('#cartTable tbody input:checkbox[name="productCheck"]').prop("checked", true);
    }
    countProductTotalAmountAndTotalCount();
});




function countProductTotalAmountAndTotalCount() {
    var selectedTotalCount = 0;
    var selectedTotalAmount = 0;

    // 遍历所有选中的商品
    $('#cartTable tbody input:checkbox[name="productCheck"]:checked').each(
        function (i, v) {
            var productItem = $(this)
                .parent()
                .parent();

            var productCount = productItem.find('.count-input').val();

            selectedTotalCount += parseInt(productCount);

            var productSubtotal = productItem
                .find('.cart-product-subtotal')
                .text();
            selectedTotalAmount += parseFloat(productSubtotal);

        }
    );

    // 设置商品总金额
    $('#selectedTotalAmount').text(selectedTotalAmount.toFixed(2));

    // 设置商品总数量
    $('#selectedTotalCount').text(selectedTotalCount);
}


$("#cartBody").on("click", ".delete", function () {
    var productItem = $(this).parent().parent();
    productItem.remove();
    console.log(productItem);
    countProductTotalAmountAndTotalCount();
});
$('#deleteAllProduct').click(function () {
    var result = confirm('是否确认删除所有产品！');
    if (result == true) {
        // 清空商品列表
        $('#cartTable tbody').empty();

        // 清除本地已经存储数据
        localStorage.removeItem('products');

        // 重新计算商品总金额和总数量
        countProductTotalAmountAndTotalCount();
    }
});
$(function () {
    getData();
    countProductTotalAmountAndTotalCount();
});