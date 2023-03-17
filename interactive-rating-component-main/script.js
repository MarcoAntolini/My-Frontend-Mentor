window.onload = function () {
	const submitButton = document.querySelector(".submit")
	submitButton.addEventListener("click", function () {
		const rating = document.querySelector(".rating-input:checked")
		const ratingValue = rating.value
		const numSpan = document.querySelector("#num")
		numSpan.innerText = ratingValue
		document.querySelector(".form").style.display = "none"
		document.querySelector(".thanks").style.display = "flex"
	})
}
