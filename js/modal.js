function handleClick(e) {
	const targetId = e.target.id;
	const targetTag = e.target.tagName;

	const modal = document.getElementById('myModal');
	const isModalVisible = modal.style.display === 'flex' ? true : false;

	if (targetTag === 'IMG' && !isModalVisible) {
		const imgElement = document.getElementById(targetId);
		const imgSrc = imgElement.src;
		const modalImg = document.getElementsByClassName('modal-content')[0];

		// Display the modal
		modal.style.display = 'flex';

		// Change the source
		modalImg.src = imgSrc;

		// When the modal is active, we prevent scrolling
		document.body.style.overflow = 'hidden';

		const span = document.getElementsByClassName('close')[0];

		span.onclick = function() { 
		  modal.style.display = 'none';
		}
	} else {
		// Hide modal, reset styles
		modal.style.display = 'none';
		document.body.style.overflow = 'auto';
	}
}