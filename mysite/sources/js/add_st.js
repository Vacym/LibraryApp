window.onload = function() {
	var firstname = document.querySelector("input[name=firstname]");
	var surname   = document.querySelector("input[name=surname]");
	var lastname  = document.querySelector("input[name=lastname]");
	var class_num = document.querySelector("input[name=class]");
	var class_ltr = document.querySelector("input[name=letter]");

	document.querySelector('#submit').onclick = function () {
		var params = `firstname=${firstname.value}&surname=${surname.value}&lastname=${lastname.value}&class=${class_num.value}&letter=${class_ltr.value}`;
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

	request.open('POST', 'sources/php/check_st.php');
	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	request.send(params);
}