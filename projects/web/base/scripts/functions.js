function handleChange(inputField) {
	var inputNumber;
	var inputBase;
	var outputBase;
	var inputTextbox;
	var outputTextbox;
	
	//if(inputField.id == 'numL') {
		inputNumber = document.getElementById('numL').value;
		inputBase = document.getElementById('dropdownL').value;
		outputBase = document.getElementById('dropdownR').value;
		inputTextbox = document.getElementById('numL');
		outputTextbox = document.getElementById('numR');
	//}
	/*if(inputField.id == 'numR') {
		inputNumber = document.getElementById('numR').value;
		inputBase = document.getElementById('dropdownR').value;
		outputBase = document.getElementById('dropdownL').value;
		inputTextbox = document.getElementById('numR');
		outputTextbox = document.getElementById('numL');
	}*/
	
	if(inputNumber == "")
		outputTextbox.value = "";
	else if(checkValid(inputNumber, inputBase) == false)
		outputTextbox.value = "Error";
	else
	{
		var dec = baseToDecimal(inputNumber, inputBase);
		var outputNumber = decimalToBase(dec, outputBase);
		outputTextbox.value = outputNumber;
	}
}

var digits = '0123456789abcdefghijklmnopqrstuvwxyz';

function checkValid(number, radix) {
	number = number.toLowerCase();
	for(var i = 0; i < number.length; i++) {
		if(digits.indexOf(number.charAt(i)) >= radix)
			return false;
		if(digits.indexOf(number.charAt(i)) == -1)
			return false;
	}
	return true;
}

function decimalToBase(dec, radix) {
	if(dec == 0)
		return 0;
	var end = "";
	var mod = 0;
	while(dec != 0) {
		mod = dec % radix;
		end = digits.charAt(mod) + end;
		dec = Math.floor(dec / radix);
	}
	return end;
}

function baseToDecimal(number, radix) {
	number = number.toLowerCase();
	var count = number.length;
	var toReturn = 0;
	var multiplier = 1;
	while(count > 0) {
		toReturn = toReturn + (digits.indexOf(number.substring(count - 1, count)) * multiplier);
		multiplier *= radix;
		count--;
	}
	return toReturn;
}