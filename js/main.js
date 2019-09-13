function update() {
  var now = moment()
  $('#time').html(now.format('h:mm'));
  $('#date').html(now.format('dddd, MMMM DD'));
}

update();
setInterval(update, 1000);