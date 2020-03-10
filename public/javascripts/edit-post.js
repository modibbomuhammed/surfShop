
	
	let editForm = document.getElementById('editForm');
		editForm.addEventListener('submit', (event) => {
			let imageUpload = document.getElementById('imageUpload')
			let lengthOfUploads = imageUpload.files.length
			let img = document.querySelectorAll('.imageDeleteCheckBox:checked')
			let numOfDeletedImages = img.length
			
			if(numOfExistImages - numOfDeletedImages + lengthOfUploads > 4){
				event.preventDefault()
				alert('You can\'t have more than 4 pictures. You need to remove ' + (numOfExistImages - numOfDeletedImages + lengthOfUploads - 4) + ' pictures')
			}
		})	
	
