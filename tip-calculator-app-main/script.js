window.onload = () => {
	const numericInputs = document.querySelectorAll("input[type=number]")
	numericInputs.forEach(input => input.addEventListener("keydown", e => allowOnlyNumbers(e)))
	numericInputs.forEach(input => input.addEventListener("keyup", update))

	const billInput = document.getElementById("bill")
	billInput.addEventListener("keydown", e => validateBillInput(e))
	billInput.addEventListener("input", e => validateBillInput(e))

	const peopleInput = document.getElementById("people")
	peopleInput.addEventListener("keydown", e => validatePeopleInput(e))
	peopleInput.addEventListener("input", e => validatePeopleInput(e))

	const customTip = document.getElementById("tip-custom-input")
	customTip.addEventListener("click", setChecked)
	customTip.addEventListener("keydown", e => validateTipInput(e))
	customTip.addEventListener("input", e => validateTipInput(e))
	customTip.addEventListener("keyup", e => clickLabel(e, customTip))

	const tipButtons = document.querySelectorAll("input[name=tip]")
	tipButtons.forEach(button => button.addEventListener("click", button => update(button.currentTarget)))

	const tipLabels = document.querySelectorAll(".tip-label")
	tipLabels.forEach(label => label.addEventListener("keyup", e => clickLabel(e, label)))

	const customLabel = document.querySelector(".custom-label")
	customLabel.addEventListener("click", update)

	const resetButton = document.getElementById("reset")
	resetButton.addEventListener("click", () => reset().then(disableButton))
}

function allowOnlyNumbers(e) {
	const key = e.keyCode
	if (48 <= key && key <= 57) return // 0-9 on keyboard
	if (96 <= key && key <= 105) return // 0-9 on numpad
	if (key == 108 || key == 188) return // , on keyboard and numpad
	if (key == 8 || key == 46) return // backspace, delete
	if (key == 9 || key == 13) return // tab, enter
	if (key == 37 || key == 39) return // left and right arrows
	e.preventDefault()
}

function validateTipInput(e) {
	preventDecimals(e)
	setInputRange(e, 0, 100)
	document.getElementById("tip-custom").value = e.target.value ? e.target.value : 0
}

function validateBillInput(e) {
	setInputRange(e, 0, 10000)
}

function validatePeopleInput(e) {
	preventDecimals(e)
	setInputRange(e, 0, 100)
}

function preventDecimals(e) {
	const key = e.keyCode
	if (key == 110 || key == 190 || key == 108 || key == 188) e.preventDefault()
}

function setInputRange(e, min, max) {
	if (e.target.value > max) e.target.value = max
	else if (e.target.value < min) e.target.value = min
	else if (e.target.value % 1 != 0) {
		const decimals = e.target.value.split(".")[1].length
		if (decimals > 2) e.target.value = e.target.value.slice(0, -1)
	}
}

function setChecked() {
	document.getElementById("tip-custom").checked = true
}

function update(button) {
	checkButton(button)
	const tipElement = document.getElementById("tip-amount")
	const tipAmount = calculateTipAmount()
	tipElement.innerHTML = tipAmount.toFixed(2)
	const totalElement = document.getElementById("total")
	const total = calculateTotal(tipAmount)
	totalElement.innerHTML = total.toFixed(2)
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
		document.getElementById("tip-custom").value = 0
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

function checkButton(button) {
	if (button && button.type == "radio") {
		document.getElementById("tip-custom-input").value = ""
	}
}

function clickLabel(e, label) {
	if (e.keyCode == 13) label.click()
}
