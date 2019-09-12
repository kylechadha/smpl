function update() {
	var now = moment()
  $('#time').html(now.format('h:mm'));
  $('#date').html(now.format('MM/DD/YY'));
}

update();
setInterval(update, 1000);