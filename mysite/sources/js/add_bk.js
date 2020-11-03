window.onload = function() {
	var name    = document.querySelector("input[name=name]");
	var author  = document.querySelector("input[name=author]");
	var genre   = document.querySelector("input[name=genre]");
	var comment = document.querySelector("textarea[name=comment]");

	document.querySelector('#submit').onclick = function () {
		var params = `name=${name.value}&author=${author.value}&genre=${genre.value}&comment=${comment.value}`;
		ajaxGet(params);
	}
}

function ajaxGet(params) {
	var request = new XMLHttpRequest();

	request.onreadystatechange = function() {
		if (request.readyState == 4 && request.status == 200) {
			var res = request.responseText;
			document.querySelector('#result').innerHTML = res;
		}
	}

	request.open('POST', 'sources/php/check_bk.php');
	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	request.send(params);
}