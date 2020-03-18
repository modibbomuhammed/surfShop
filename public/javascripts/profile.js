// let newPassVal
// let confirmationVal
// const form = document.querySelector('form')
// const newPass = document.getElementById('new-password')
// const confirmation = document.getElementById('password-confirmation')
// const validationMessage = document.getElementById('validation-message')

// function validatePassword(message, add, remove){
// 	validationMessage.textContent = message;
// 	validationMessage.classList.add(add);
// 	validationMessage.classList.remove(remove);
// }
	

// 	confirmation.addEventListener('input', function(e){
// 		// e.preventDefault() not needed
// 		newPassVal = newPass.value
// 		confirmationVal = confirmation.value
// 		if(newPassVal !== confirmationVal){
// 			validatePassword("Password Doesn't Match", 'color-red', 'color-green')
// 		} else {
// 			validatePassword('Password Matches', 'color-green', 'color-red')
// 		}
// 	})


// form.addEventListener('submit', e => {
// 	newPassVal = newPass.value
// 	confirmationVal = confirmation.value
// 	console.log(newPassVal, confirmationVal)
// 	if(newPassVal !== confirmationVal){
// 		e.preventDefault();
// 		const error = document.getElementById('error');
		
// 		if(!error) {
// 			const flashErrorH1 = document.createElement('h1');
// 			flashErrorH1.classList.add('color-red');
// 			flashErrorH1.setAttribute('id', 'error');
// 			flashErrorH1.textContent = 'Passwords must match!';
// 			const navbar = document.getElementById('navbar');
// 			navbar.parentNode.insertBefore(flashErrorH1, navbar.nextSibling);
// 		}
// 	} else {
// 		console.log('say hello')
// 	}
// })
	
	


let newPasswordValue;
let confirmationValue;
const submitbtn = document.querySelector('#update-profile')
// const form = document.querySelector('form');
const newPassword = document.getElementById('new-password');
const confirmation = document.getElementById('password-confirmation');
const validationMessage = document.getElementById('validation-message');
function validatePasswords(message, add, remove) {
		validationMessage.textContent = message;
		validationMessage.classList.add(add);
		validationMessage.classList.remove(remove);
}
confirmation.addEventListener('input', e => {
	e.preventDefault();
	newPasswordValue = newPassword.value;
	confirmationValue = confirmation.value;
	if (newPasswordValue !== confirmationValue) {
	  validatePasswords('Passwords must match!', 'color-red', 'color-green');
		submitbtn.setAttribute('disabled', true)
	} else {
		validatePasswords('Passwords match!', 'color-green', 'color-red');
		submitbtn.removeAttribute('disabled')
	}
});

// form.addEventListener('click', e => {
// 	if (newPasswordValue !== confirmationValue) { 
// 		e.preventDefault();
// 		const error = document.getElementById('error');
// 		if(!error) {
// 			const flashErrorH1 = document.createElement('h1');
// 			flashErrorH1.classList.add('color-red');
// 			flashErrorH1.setAttribute('id', 'error');
// 			flashErrorH1.textContent = 'Passwords must match!';
// 			const navbar = document.getElementById('navbar');
// 			navbar.parentNode.insertBefore(flashErrorH1, navbar.nextSibling);
// 		}
// 	}
// });