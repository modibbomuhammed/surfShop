
	
	let editForm = document.getElementById('editForm');
		editForm.addEventListener('submit', (event) => {
			console.log('hello')
			let imageUpload = document.getElementById('imageUpload')
			let lengthOfUploads = imageUpload.files.length
			let img = document.querySelectorAll('.imageDeleteCheckbox:checked')
			let numOfDeletedImages = img.length
			console.log(numOfDeletedImages)
			if(numOfExistImages - numOfDeletedImages + lengthOfUploads > 4){
				event.preventDefault()
				alert('You can\'t have more than 4 pictures. You need to remove ' + (numOfExistImages - numOfDeletedImages + lengthOfUploads - 4) + ' pictures')
			}
		})	
	
