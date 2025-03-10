// this script contains code which runs on the homepage

// set initial vertical offset for card title
document.querySelectorAll(".card-content").forEach(cardContent => {
	// TODO bug: this doesn't run for cards that aren't shown initially
	const title = cardContent.querySelector(".card-title");
	cardContent.style.setProperty("--card-title-height", title.clientHeight.toString() + "px")
});

// set hover animations for cards
document.querySelectorAll(".card").forEach(card => {
	// change rotation on hover
	card.addEventListener("mousemove", event => {
		const boundingRef = event.currentTarget.getBoundingClientRect(); // calling this every time the mouse moves might be bad for performance
		const x = event.clientX - boundingRef.left;
		const y = event.clientY - boundingRef.top;
		const xPercent = x / boundingRef.width;
		const yPercent = y / boundingRef.height;
		const xRotation = (xPercent - 0.5) * 8;
		const yRotation = (0.5 - yPercent) * 8;

		event.currentTarget.style.setProperty("--rotateX", yRotation + "deg");
		event.currentTarget.style.setProperty("--rotateY", xRotation + "deg");
	});

	// reset rotation on leave
	card.addEventListener("mouseleave", event => {
		event.currentTarget.style.setProperty("--rotateX", "0");
		event.currentTarget.style.setProperty("--rotateY", "0");
	});
});

// scroll animations (elements transition into view when they enter the viewport for the first time)
const observer = new IntersectionObserver(entries => {
	entries.forEach(entry => {
		if (entry.isIntersecting && entry.target.classList.contains("scroll-hidden")) {
			entry.target.classList.replace("scroll-hidden", "scroll-show");
			const nav = document.querySelector(`#${entry.target.children[0].id}-link`);
			nav.classList.replace("scroll-hidden", "scroll-show");
		}
	});
}, {
	threshold: 0.5
});

const hiddenScrollSections = document.querySelectorAll(".section-wrapper")
hiddenScrollSections.forEach(element => {observer.observe(element)});
