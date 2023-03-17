window.onload = () => {
	const numericInputs = document.querySelectorAll("input[type=number]")
	numericInputs.forEach(input => input.addEventListener("keydown", e => allowOnlyNumbers(e)))

	const customTip = document.getElementById("tip-custom-input")
	customTip.addEventListener("click", setChecked)
	customTip.addEventListener("change", e => validateInput(e))
	customTip.addEventListener("input", e => validateInput(e))
	customTip.addEventListener("keyup", e => validateInput(e))
	customTip.addEventListener("keydown", e => validateInput(e))

	numericInputs.forEach(input => input.addEventListener("input", update))
	numericInputs.forEach(input => input.addEventListener("keyup", update))
	numericInputs.forEach(input => input.addEventListener("keydown", update))
	numericInputs.forEach(input => input.addEventListener("change", update))

	const tipButtons = document.querySelectorAll("input[name=tip]")
	tipButtons.forEach(button => button.addEventListener("click", update))

	const customLabel = document.querySelector(".custom-label")
	customLabel.addEventListener("click", update)

	const resetButton = document.getElementById("reset")
	resetButton.addEventListener("click", () => reset().then(disableButton))
}

function allowOnlyNumbers(e) {
	const key = e.keyCode
	if (48 <= key && key <= 57) return // 0-9 on keyboard
	if (96 <= key && key <= 105) return // 0-9 on numpad
	if (key == 110 || key == 190) return // . on keyboard and numpad
	if (key == 108 || key == 188) return // , on keyboard and numpad
	if (key == 8 || key == 46) return // backspace, delete
	if (key == 9 || key == 13) return // tab, enter
	if (key == 37 || key == 39) return // left and right arrows
	e.preventDefault()
}

function validateInput(e) {
	const key = e.keyCode
	if (key == 110 || key == 190 || key == 108 || key == 188) e.preventDefault()
	if (e.target.value > 100) {
		e.target.value = 100
	} else if (e.target.value < 0) {
		e.target.value = 0
	}
	document.getElementById("tip-custom").value = e.target.value ? e.target.value : 0
}

function setChecked() {
	document.getElementById("tip-custom").checked = true
}

function calculateTipAmount() {
	const billValue = document.getElementById("bill").value || 0
	const tip = document.querySelector("input[name=tip]:checked")
	const tipValue = tip ? tip.value : 0
	const peopleNumber = document.getElementById("people").value || 0
	peopleWarning(peopleNumber == 0 && (tipValue != 0 || billValue != 0) ? true : false)
	checkReset(billValue == 0 && tipValue == 0 && peopleNumber == 0 ? true : false)
	return peopleNumber == 0 ? 0 : (billValue * tipValue) / 100 / peopleNumber
}

function calculateTotal(tipAmount) {
	const billValue = document.getElementById("bill").value || 0
	const peopleNumber = document.getElementById("people").value || 0
	return peopleNumber == 0 ? 0 : billValue / peopleNumber + tipAmount
}

function update() {
	const tipElement = document.getElementById("tip-amount")
	const tipAmount = calculateTipAmount()
	tipElement.innerHTML = tipAmount.toFixed(2)
	const totalElement = document.getElementById("total")
	const total = calculateTotal(tipAmount)
	totalElement.innerHTML = total.toFixed(2)
}

function peopleWarning(isZero) {
	document.getElementById("alert").style.display = isZero ? "flex" : "none"
}

function checkReset(isDisabled) {
	const resetButton = document.getElementById("reset")
	resetButton.disabled = isDisabled
}

function reset() {
	return new Promise(resolve => {
		document.getElementById("bill").value = ""
		document.getElementById("people").value = ""
		document.getElementById("tip-custom-input").value = ""
		if (document.querySelector("input[name=tip]:checked"))
			document.querySelector("input[name=tip]:checked").checked = false
		document.getElementById("tip-amount").innerHTML = "0.00"
		document.getElementById("total").innerHTML = "0.00"
		document.getElementById("alert").style.display = "none"
		resolve()
	})
}

function disableButton() {
	document.getElementById("reset").disabled = true
}
