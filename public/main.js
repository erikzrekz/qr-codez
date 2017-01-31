var db;
var DBOpenRequest = window.indexedDB.open("qrCode", 4);

DBOpenRequest.onsuccess = function(event) {
  db = event.target.result
  getCodes()
};

DBOpenRequest.onupgradeneeded = function(event) { 
  var db = event.target.result
  var objectStore = db.createObjectStore("codes", { autoIncrement: true })
};

function addData(text, dataUrl) {

  var newItem = [{
    dataUrl: dataUrl,
    text: text,
    created: new Date()
  }];

  var transaction = db.transaction(["codes"], "readwrite");

  transaction.oncomplete = function(event) {
    console.log('Complete!')
  };


  transaction.onerror = function(event) {
    console.log('Error', event)
  };

  var objectStore = transaction.objectStore("codes");
  var objectStoreRequest = objectStore.add(newItem[0]);

  objectStoreRequest.onsuccess = function(event) {
    console.log(event)
    
  };
};
 
function getCodes() {

  $('.generated-qr-codes').empty()

  db.transaction(["codes"], "readonly").objectStore("codes").openCursor().onsuccess = function(e) {
    var cursor = e.target.result;
    if (cursor) {
      for (var field in cursor.value) {
        var ul = '<ul>'

        if(field !== 'dataUrl') {
          ul += '<li>'+ field + ':' + cursor.value[field] +'</li>'
        } else {
          ul += '<li><img src="'+ cursor.value[field] +'"></li>'
        }



        ul += '</ul>'

        $('.generated-qr-codes').append(ul)

      }
      cursor.continue();
    }
  }
}


$('#qrCodeButton').click(function(e) {
  e.preventDefault()
  
  var qr = window.qr = new QRious({
    element: document.getElementById('qr'),
    value: $('input#data').val(),
    mime: 'image/png',
    size: 120
  });

  var dataUrl = qr.toDataURL()

  addData($('input#data').val(), qr.toDataURL())

  $.ajax({
    url: '/ipfs',
    type: 'post',
    dataType: 'json',
    data: {
      qrCodeDataUrl: dataUrl
    },
    success: function() {
    }
  });

  $("#qrTitle").removeClass("hidden");
  $("form#qrCode").hide();

  $(".mdl-spinner").addClass("is-active");

  setTimeout(showQr, 3000);

  function showQr() {
    $(".mdl-spinner").removeClass("is-active");
    $("#qrCodeTutorial").removeClass("hidden");
    getCodes()
  }

});
