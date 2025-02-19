


function createNepaliDropdown(id, options) {
  const select = document.getElementById(id);

  // Assuming options is an array of strings
  options.forEach(option => {
    const optionElement = document.createElement('option');
    optionElement.textContent = option;
    select.appendChild(optionElement);
  });
}

// Define options for each dropdown
const loanWorkOptions = ['छान्नुहोस', '... ... ...', 'ब्यक्तिगत', 'ब्यापार', 'आकस्मिक', 'साना ब्यावसायी', 'ब्यक्तिगत जमानी', 'कृषि', 'भेहिकल'];
const ltypeOptions = ['छान्नुहोस', '... ... ...', 'ब्यक्तिगत', 'ब्यापार', 'आकस्मिक', 'साना ब्यावसायी', 'ब्यक्तिगत जमानी', 'कृषि', 'भेहिकल'];
const pogapaAOptions = ['छान्नुहोस', '... ... ...', 'गा.पा.', 'न.पा.', 'म.न.पा.', 'उप.म.न.पा.'];
const pogapaOptions = ['छान्नुहोस', '... ... ...', 'गा.पा.', 'न.पा.', 'म.न.पा.', 'उप.म.न.पा.'];
const togapaz1Options = ['छान्नुहोस', '... ... ...', 'गा.पा.', 'न.पा.', 'म.न.पा.', 'उप.म.न.पा.'];
const togapaz5Options = ['छान्नुहोस', '... ... ...', 'गा.पा.', 'न.पा.', 'म.न.पा.', 'उप.म.न.पा.'];
const togapaz6Options = ['छान्नुहोस', '... ... ...', 'गा.पा.', 'न.पा.', 'म.न.पा.', 'उप.म.न.पा.'];
const togapa1Options = ['छान्नुहोस', '... ... ...', 'गा.पा.', 'न.पा.', 'म.न.पा.', 'उप.म.न.पा.'];
const togapa5Options = ['छान्नुहोस', '... ... ...', 'गा.पा.', 'न.पा.', 'म.न.पा.', 'उप.म.न.पा.'];
const togapa6Options = ['छान्नुहोस', '... ... ...', 'गा.पा.', 'न.पा.', 'म.न.पा.', 'उप.म.न.पा.'];





const mpdtpOptions = ['छान्नुहोस', '... ... ...', "दैनिक", "मासिक", "त्रैमासिक", "एकमुष्ट", "मासिक ब्याज भुक्तानी"];


// Create dropdowns
createNepaliDropdown('loanWork', loanWorkOptions);
createNepaliDropdown('ltype', ltypeOptions);
createNepaliDropdown('pogapaA', pogapaAOptions);
createNepaliDropdown('pogapa', pogapaOptions);
createNepaliDropdown('mperiodtype', mpdtpOptions);
createNepaliDropdown('togapaz1', togapaz1Options);
createNepaliDropdown('togapaz5', togapaz5Options);
createNepaliDropdown('togapaz6', togapaz6Options);
createNepaliDropdown('togapa1', togapa1Options);
createNepaliDropdown('togapa5', togapa5Options);
createNepaliDropdown('togapa6', togapa6Options);


function createDropdown(id, start, end) {
  const select = document.getElementById(id);

  for (let i = start; i <= end; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = convertToDevanagari(i);
    select.appendChild(option);
  }
}

function convertToDevanagari(number) {
  const devanagariNumerals = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  const numberStr = number.toString();
  let devanagariStr = '';
  for (let i = 0; i < numberStr.length; i++) {
    const digit = numberStr[i];
    devanagariStr += devanagariNumerals[digit];
  }
  return devanagariStr;
}

createDropdown('pward', 1, 32); 
createDropdown('tward', 1, 32); 
createDropdown('mperiodtime', 1, 32); 
createDropdown('housefloor', 1, 32); 
createDropdown('togapaz2', 1, 32); 
createDropdown('togapaz3', 1, 32); 
createDropdown('togapaz4', 1, 32); 
createDropdown('togapa2', 1, 32); 
createDropdown('togapa3', 1, 32); 
createDropdown('togapa4', 1, 32); 
createDropdown('myage', 16, 80);


function convertToWords(number){
    var str = number.toString();
    var length = str.length;
    var nepaliStr = [];
    if(length > 3){

       // get last three digits of given number 
       var lastThree = str.lastThree();

       // remove last three digit and take remaining digits
       var remStr = str.removeLastThree();

       // get length of remaining digits in number
       var remStrLength = remStr.length;

       // make a array 
       var remStrips = lastThree.sliceToTwo().concat(remStr.sliceToTwo());
       
       console.log(remStrips)
       //reverse the array and join
       nepaliStr = remStrips.reverseAndJoin();
   }
   else{

     remStrips = str.sliceToTwo();
     nepaliStr = remStrips.reverseAndJoin();
}

return nepaliStr;

}

function convertToNepaliDigit(number){
   var number = number.toString();
   var sliced = [];
   var numberLength = number.length
   var nepali_digits = ['०','१','२','३','४','५','६','७','८','९' ];
       for(i=0; i< numberLength; i++){
       sliced.push(nepali_digits[number.substr(number.length - 1)]);
       number = number.slice(0,-1);
   }
   return sliced.reverse().join('').toString();
}

function convertToNepaliText(number){
   var number = number.toString();
   var number_before_decimal = number.split(".")[0]
   var number_after_decimal = number.split(".")[1]
   var text1 = convertToWords(number_before_decimal);
   var text2 = "";
   if(typeof number_after_decimal !== "undefined"){
       text2 = convertToWords(number_after_decimal);
       return text1 + " दशमलव " + text2;
   }
   else{
       return text1;
   }

}

function convertToNepaliNumber(number){
   var number = number.toString();
   var number_before_decimal = number.split(".")[0]
   var number_after_decimal = number.split(".")[1]
   var text1 = convertToNepaliDigit(number_before_decimal);
   var text2 = "";
   if(typeof number_after_decimal !== "undefined"){
       text2 = convertToNepaliDigit(number_after_decimal);
       return text1 + "." + text2;
   }
   else{
       return text1;
   }

}


function convertToCommaNumber(number){
   var number = number.toString();
   var number_before_decimal = number.split(".")[0]
   var number_after_decimal = number.split(".")[1]
   var text1 = commafy(number_before_decimal);
   var text2 = "";
   if(typeof number_after_decimal !== "undefined"){
       text2 =  number_after_decimal;
       return text1 + "<b>।</b>" + text2;
   }
   else{
       return text1;
   }

}

function commafy(number){

var str = number.toString();
    var length = str.length;
    if(length > 3){

       // get last three digits of given number 
       var lastThree = str.lastThree();

       // remove last three digit and take remaining digits
       var number = str.slice(0, -3);
       var sliced = [];
       var numberLength = number.length
           for(i=0; 1 <= number.length; i++){
             sliced.push(number.substr(number.length - 2));
             number = number.slice(0,-2);
           }
       
       // make a array 
       var remStrips = sliced.reverse().join(",")+","+lastThree;
       return remStrips;
   }
   else{

     return str;
}

}


String.prototype.lastThree = function(){
	return this.substr(this.length - 3);
};
String.prototype.sliceToTwo = function(){
	var sliced = [];
	var number = this;
	var numberLength = number.length
		for(i=0; 1 <= number.length; i++){
          sliced.push(parseInt(number.substr(number.length - 2)).toString());
          number = number.slice(0,-2);
        }
	return sliced;
}
String.prototype.removeLastThree = function(){
	return this.slice(0,-3);
};

String.prototype.stringifyValues = function(){
	var digits = ['', 'एक', 'दुई' ,'तीन', 'चार', 'पाँच' , 'छ', 'सात' , 'आठ' , 'नौ' , 'दश', 'एघार', 'बाह्र ', 
	'तेह्र', 'चौध', 'पन्ध्र', 'शोह्र', 'सत्र', 'अठार', 'उन्नाइस', 'बीस', 'एक्काइस', 'बाइस', 'तेइस', 'चौबीस', 'पच्चीस', 
	'छब्बिस', 'सत्ताइस', 'अठ्ठाइस', 'उन्नतीस', 'तीस', 'एकतीस', 'बत्तीस', 'तेत्तिस', 'चौतीस', 'पैँतीस', 'छत्तिस', 'सैँतीस', 
	'अठ्तीस', 'उन्नचालीस', 'चालीस', 'एकचालीस', 'बयालीस', 'त्रिचालिस', 'चौवालीस', 'पैँतालीस', 'छयालीस', 'सतचालिस', 
	'अठचालीस', 'उन्नपचास', 'पचास', 'एकाउन्न', 'बाउन्न', 'त्रिपन्न', 'चौवन्न', 'पचपन्न', 'छपन्न', 'सन्ताउन्न', 'अन्ठाउन्न', 
	'उन्नसाठी', 'साठी', 'एकसठ्ठी', 'बैसठ्ठी', 'त्रिसठ्ठी', 'चौसठ्ठी', 'पैसठ्ठी', 'छैसठ्ठी', 'सतसठ्ठी', 'अठसठ्ठी', 'उनान्सत्तरी', 
	'सत्तरी', 'एकहत्तर', 'बहत्तर', 'तिरहत्तर', 'चौरहत्तर', 'पचहत्तर', 'छहत्तर', 'सतहत्तर', 'अठहत्तर', 'उनानअसी', 'असी', 
	 'एकासी', 'बयासी', 'त्रियासी', 'चौरासी', 'पचासी', 'छयासी', 'सतासी', 'अठासी', 'उनान्नब्बे', 'नब्बे', 'एकानब्बे',
	  'बयानब्बे', 'त्रियानब्बे', 'चौरानब्बे', 'पन्चानब्बे', 'छयानब्बे', 'सन्तानब्बे', 'अन्ठानब्बे', 'उनान्सय', 'सय' ];
	return digits[this];

};


String.prototype.stringifyPlace = function(){
	var place = [ '', 'सय','हजार', 'लाख', 'करोड', 'अरब', 'खरब', 'निल', 'पद्म', 'संख्य' ];
	return place[this];
};

Array.prototype.reverseAndJoin = function(){
	 var list = [];
	 this.forEach(function(value, i){
 		if(parseInt(value) == 0){
 			list.push('');}
 		else if( i < 1){
			list.push(value.stringifyValues());
 		}
 		else{
 			list.push(value.stringifyValues()+" "+ i.toString().stringifyPlace());
 		}
 	});
    return list.reverse().join(" ");
}
document.getElementById("convert").addEventListener("click", convertIt);

function convertIt() {
  // List of input IDs to process
  var inputIds = ["Qno", "Qmob", "Lper"];
  
  // Loop through each input ID
  inputIds.forEach(function(inputId) {
    var input = document.getElementById(inputId).value;
    var outputIds = getOutputIds(inputId);
    var output = convertToNepaliNumber(input);
    // var output = input; // Just echoing the input for demonstration purposes

    // Update each output element with the output value
    outputIds.forEach(function(outputId) {
      var outputElement = document.getElementById(outputId);
      outputElement.innerHTML = output;
    });
  });
}

function getOutputIds(inputId) {
  // Define mapping of input IDs to output IDs
  var outputIdsMap = {
    "Qno": ["vmob", "tmob", "Jno"],
    "Qmob": ["umob", "smob"],
    "Lper": ["Cper", "Dper", "Eper"]
    // Add more mappings as needed
  };

  // Return the corresponding output IDs for the given input ID
  return outputIdsMap[inputId] || [];
}

function limitInputLength(input, maxLength) {
  if (input.value.length > maxLength) {
    input.value = input.value.slice(0, maxLength);
  }
}
window.onload = function() {
    document.getElementById("convert").addEventListener("click", convertIt);

    function convertIt() {
        var input = document.getElementById("tcsh").value;
        var output = convertToNepaliText(input);
        var output2 = convertToNepaliNumber(input);

        // Show and update the output in separate containers
        var outputElement = document.getElementById("cashDetail");
        var output2Element = document.getElementById("output2");
        var output3Element = document.getElementById("output3");
        var output4Element = document.getElementById("output4");
        var output5Element = document.getElementById("output5");
        var cashDetail2Element = document.getElementById("cashDetail2");
        var cashDetail3Element = document.getElementById("cashDetail3");
        var cashDetail4Element = document.getElementById("cashDetail4");

        outputElement.innerHTML = output;
        output2Element.innerHTML = convertToCommaNumber(output2);

        // Duplicate the value of output2 to more containers (output3)
        output3Element.innerHTML = convertToCommaNumber(output2);
        output4Element.innerHTML = convertToCommaNumber(output2);
        output5Element.innerHTML = convertToCommaNumber(output2);

        // Duplicate the value of output2 to more containers (cashDetail2 to cashDetail4)
        cashDetail2Element.innerHTML = (output);
        cashDetail3Element.innerHTML = (output);
        cashDetail4Element.innerHTML = (output);
    }
}
function convertKarja(number) {
    // ... your existing code for handling the click ...

    if (number === 1) {
      // Do something when "कर्जाको" is clicked
      // For example, hide the "karjaSection" div
      document.getElementById("karjaSection").style.display = "none";
    } else if (number === 2) {
      // Do something when "आवश्यकता" is clicked
      // For example, alert a message
      alert("के तपाइ कर्जा Amount Modify or Edit गर्न चाहनुहुन्छ।");

      // Show the "karjaSection" div
      document.getElementById("karjaSection").style.display = "block";
    } else if (number === 3) {
      document.getElementById("karjaSlash").style.display = "none";
  }  
  }
document.addEventListener('DOMContentLoaded', function () {
    const handleInputChange = (element, target) => {
      element.addEventListener('change', () => {
        target.innerHTML = element.value;
      });
    };
  
    const loanWork = document.getElementById('loanWork');
    const lwtype = document.getElementById('lwtype');
    handleInputChange(loanWork, lwtype);
  
    const ltype = document.getElementById('ltype');
    const loantype = document.getElementById('loantype');
    const loan1type = document.getElementById('loan1type');
    handleInputChange(ltype, loantype);
    handleInputChange(ltype, loan1type);
  });
  
  $(document).ready(function () {
    var datePickerOptions1 = {
        dateFormat: "%y/%m/%d",
        closeOnDateSelect: true,
        defaultDate: "20, 07 20, 2020"
    };

    var datePickerOptions2 = {
        dateFormat: "%y साल %M महिना %d गते %Dबार",
        closeOnDateSelect: true,
        defaultDate: "20, 07 20, 2020"
    };

    var datePickerOptions3 = {
        dateFormat: "%y/%m/%d",
        closeOnDateSelect: true,
        defaultDate: "20, 07 20, 2020"
    };

    var datePickerOptions4 = {
        dateFormat: "%y साल %M महिना %d गते %Dबार",
        closeOnDateSelect: true,
        defaultDate: "20, 07 20, 2020"
    };
    $("#date1").nepaliDatePicker(datePickerOptions1);
    $("#date2").nepaliDatePicker(datePickerOptions2);
    $("#date3").nepaliDatePicker(datePickerOptions3);
    $("#date4").nepaliDatePicker(datePickerOptions4);

    $("#convert1").on("click", function () {
        var selectedDate = $("#date1").val();
        $("#tdate, #t1date, #exdate, #ex1date").text(selectedDate);
    });
    $("#convert2").on("click", function () {
        var selectedDate = $("#date2").val();
        $("#tfdate, #t1fdate, #efxdate").text(selectedDate);
    });
    $("#convert3").on("click", function () {
        var selectedDate = $("#date3").val();
        $("#t2date, #x2date, #e2date").text(selectedDate);
    });
    $("#convert4").on("click", function () {
        var selectedDate = $("#date4").val();
        $("#tf2date, #y2date, #ef2xdate").text(selectedDate);
    });
});

document.getElementById("convert").addEventListener("click", convertIt);

    function convertIt() {
      // List of input IDs to process
      var inputIds = ["Qno", "aQmob", "Lper", "aLper"];
      
      // Loop through each input ID
      inputIds.forEach(function(inputId) {
        var input = document.getElementById(inputId).value;
        var outputIds = getOutputIds(inputId);
    var output = convertToNepaliNumber(input);
        // var output = input; // Just echoing the input for demonstration purposes
        // Update each output element with the output value
        outputIds.forEach(function(outputId) {
          // var outputElement

          var outputElement = document.getElementById(outputId);
          outputElement.innerHTML = output;
        });
      });
    }

    function getOutputIds(inputId) {
  // Define mapping of input IDs to output IDs
  var outputIdsMap = {
    "Qno": ["vmob", "tmob", "Jno"],
    "aQmob": ["umob", "smob"], // Corrected the output IDs
    "Lper": ["Cper", "Dper", "Eper"],
    "aLper": ["aCper", "aDper", "aEper"],
    // Add more mappings as needed
  };
  function convertToNepaliNumber(input) {
  return input; // Simply echoing the input for demonstration purposes
}


  // Return the corresponding output IDs for the given input ID
  return outputIdsMap[inputId] || [];
}
    function limitInputLength(input, maxLength) {
      if (input.value.length > maxLength) {
        input.value = input.value.slice(0, maxLength);
      }
    }



function limitInputLength(input, maxLength) {
      if (input.value.length > maxLength) {
        input.value = input.value.slice(0, maxLength);
      }
    }
    const fnameInput = document.getElementById('fname');

    fnameInput.addEventListener('input', () => {
      if (fnameInput.scrollWidth > fnameInput.clientWidth) {
        fnameInput.style.fontSize = '15px';
      } else {
        fnameInput.style.fontSize = '20px';
      }
    });
  
