const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
// Set strength indicator circle to grey
setIndicator('#ccc'); 

//Set passwordLength
function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;

   //to add styling in slider 
   const min = inputSlider.min;
   const max = inputSlider.max;
   inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}

function setIndicator(color) {
  indicator.style.backgroundColor = color;
  //shadow - HW
}

//For generating Random numbers
function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomInterger() {
  return getRandom(0, 9);
}

function getRandomUppercase() {
  return String.fromCharCode(getRandom(65, 91));
}

function getRandomLowercase() {
  return String.fromCharCode(getRandom(97, 122));
}

function getRandomSymbol() {
  let random = getRandom(0, symbols.length);
  return symbols.charAt(random);
}

//to set color of indicator
function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

//For checking password strength
function passwordStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;
  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNum = true;
  if (symbolsCheck.checked) hasSym = true;

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

//to copying password on clipboard
async function copyPassword() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "copied";
  } catch (e) {
    copyMsg.innerText = "Failed";
  }
  //to make copy wala span visible
  copyMsg.classList.add("active");

  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

function shufflePassword(array) {
  //Fisher Yates Method
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}

function handleCheckboxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) checkCount++;
  });
  // special condition
  if (password.length < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
}

function createPassword(){
  let arrFunction = [];
  password = ''                       //remove old password
  // Put stuffs mentioned from checkbox
  if(uppercaseCheck.checked){
      arrFunction.push(getRandomUppercase)
  }
  if(lowercaseCheck.checked){
      arrFunction.push(getRandomLowercase)
  }
  if(numbersCheck.checked){
      arrFunction.push(getRandomInterger)
  }
  if(symbolsCheck.checked){
      arrFunction.push(getRandomSymbol)
  }
  //for compalsary password
  for(let i = 0 ; i < arrFunction.length ; i++){
      password += arrFunction[i]()
  }

  //for addtional password
  for(let i = 0 ; i < passwordLength-arrFunction.length ; i++){
      let random = getRandom(0 , arrFunction.length)
      password += arrFunction[random]()
  }

  //for shuffle password
  // password = password.split('').sort(()=> Math.random() * 0.5).join('')
  
  password = shufflePassword(Array.from(password));
  
  //to return password
  passwordDisplay.value = password
  passwordStrength()
}

allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckboxChange);
});

inputSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) {
    copyPassword();
  }
});

generateBtn.addEventListener("click", () => {
  // None of the checkbox are selected
  if (checkCount <= 0) return;

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
  password = "";
  createPassword();
});

