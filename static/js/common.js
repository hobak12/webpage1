$(document).ready(function () {
      $.ajax({
          type: "GET",
          url: "http://spartacodingclub.shop/sparta_api/weather/busan",
          data: {},
          success: function (response) {
           $('#temp').text(response['temp'])
          }
      });
});