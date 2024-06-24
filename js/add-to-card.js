
$(document).ready(function() {
  // Add to cart functionality
  $('.add-to-cart-btn').click(function (event) {
    event.preventDefault();
    var name = $(this).data('name');
    var price = Number($(this).data('price'));
    var image = $(this).data('image');
    shoppingCart.addItemToCart(name, price, 1, image);
    displayCart();
  });

  // View item details in modal
  $('.view-btn').click(function (event) {
    event.preventDefault();
    var name = $(this).data('name');
    var price = $(this).data('price');
    var image = $(this).data('image');
    var miles = $(this).data('miles');
    var condition = $(this).data('condition');
    var transmission = $(this).data('transmission');
    var hp = $(this).data('hp');

    $('#itemModalImage').attr('src', image);
    $('#itemModalName').text(name);
    $('#itemModalPrice').text('Price: $' + price);
    $('#itemModalMiles').text('Miles: ' + miles);
    $('#itemModalCondition').text('Condition: ' + condition);
    $('#itemModalTransmission').text('Transmission: ' + transmission);
    $('#itemModalHp').text('Horsepower: ' + hp);

    $('#itemModal').modal('show');
  });

  // Shopping cart functionality (same as your existing code)
  var shoppingCart = (function () {
    var cart = [];

    function Item(name, price, count, image) {
      this.name = name;
      this.price = price;
      this.count = count;
      this.image = image;
    }

    function saveCart() {
      localStorage.setItem('shoppingCart', JSON.stringify(cart));
    }

    function loadCart() {
      cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
    }

    if (localStorage.getItem("shoppingCart") != null) {
      loadCart();
    }

    var obj = {};

    obj.addItemToCart = function (name, price, count, image) {
      for (var item of cart) {
        if (item.name === name) {
          item.count++;
          saveCart();
          return;
        }
      }
      var newItem = new Item(name, price, count, image);
      cart.push(newItem);
      saveCart();
    };

    obj.setCountForItem = function (name, count) {
      for (var item of cart) {
        if (item.name === name) {
          item.count = count;
          break;
        }
      }
      saveCart();
    };

    obj.removeItemFromCart = function (name) {
      for (var item of cart) {
        if (item.name === name) {
          item.count--;
          if (item.count === 0) {
            cart = cart.filter(cartItem => cartItem.name !== name);
          }
          break;
        }
      }
      saveCart();
    };

    obj.removeItemFromCartAll = function (name) {
      cart = cart.filter(item => item.name !== name);
      saveCart();
    };

    obj.clearCart = function () {
      cart = [];
      saveCart();
    };

    obj.totalCount = function () {
      return cart.reduce((total, item) => total + item.count, 0);
    };

    obj.totalCart = function () {
      return cart.reduce((total, item) => total + item.price * item.count, 0).toFixed(2);
    };

    obj.listCart = function () {
      return cart.map(item => {
        var itemCopy = { ...item };
        itemCopy.total = (item.price * item.count).toFixed(2);
        return itemCopy;
      });
    };

    return obj;
  })();

  function displayCart() {
    var cartArray = shoppingCart.listCart();
    var output = "";
    for (var item of cartArray) {
      output += "<tr>"
        + "<td><img src='" + item.image + "' alt='" + item.name + "' style='width: 50px; height: 50px;'></td>"
        + "<td>" + item.name + "</td>"
        + "<td>(" + item.price + ")</td>"
        + "<td><div class='input-group'>"
        + "<input type='number' class='item-count form-control' data-name='" + item.name + "' value='" + item.count + "'>"
        + "</div></td>"
        + "<td><button class='delete-item btn btn-danger' data-name='" + item.name + "'>X</button></td>"
        + " = "
        + "<td>" + item.total + "</td>"
        + "</tr>";
    }
    $('.show-cart').html(output);
    $('.total-cart').html(shoppingCart.totalCart());
    $('.total-count').html(shoppingCart.totalCount());
  }

  // Delete item button
  $('.show-cart').on("click", ".delete-item", function (event) {
    var name = $(this).data('name');
    shoppingCart.removeItemFromCartAll(name);
    displayCart();
  });

  // Item count input
  $('.show-cart').on("change", ".item-count", function (event) {
    var name = $(this).data('name');
    var count = Number($(this).val());
    shoppingCart.setCountForItem(name, count);
    displayCart();
  });

  displayCart();

  //////// UI script start /////////
  $('.tab ul.tabs').addClass('active').find('> li:eq(0)').addClass('current');
  $('.tab ul.tabs li a').on('click', function (g) {
    var tab = $(this).closest('.tab');
    var index = $(this).closest('li').index();
    tab.find('ul.tabs > li').removeClass('current');
    $(this).closest('li').addClass('current');
    tab.find('.tab_content').find('div.tabs_item').not('div.tabs_item:eq(' + index + ')').slideUp();
    tab.find('.tab_content').find('div.tabs_item:eq(' + index + ')').slideDown();
    g.preventDefault();
  });

  $('#search_field').on('keyup', function() {
    var value = $(this).val();
    var patt = new RegExp(value, "i");

    $('.tab_content').find('.col-lg-3').each(function() {
      var $table = $(this);

      if (!($table.find('.featured-item').text().search(patt) >= 0)) {
        $table.not('.thead').hide();
      } else {
        $table.show();
      }
    });
  });
});

