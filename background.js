function update() {
	var time = moment().format('D. MMMM YYYY H:mm:ss');
	console.log(time);
  $('#time').html(time);
}

setInterval(update, 1000);