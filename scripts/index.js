// this script contains code which runs on the homepage

// set initial vertical offset for card title
document.querySelectorAll(".card-content").forEach(cardContent => {
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
const scrollSections = [...document.querySelectorAll(".section-wrapper")];
const observer = new IntersectionObserver(entries => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			const sectionIndex = scrollSections.indexOf(entry.target); // check which section has entered viewport (in case page has loaded scrolled down)
			for (let i=0; i <= sectionIndex; i++) { // show all previous sections and the current one
				scrollSections[i].classList.replace("scroll-hidden", "scroll-show");
				const nav = document.getElementById(`${scrollSections[i].children[0].id}-link`);
				nav.classList.replace("scroll-hidden", "scroll-show");
			}
			if (sectionIndex == scrollSections.length - 1) {
				observer.disconnect(); // remove observer when all sections have loaded in
			}
		}
	});
}, {
	threshold: 0.5
});
scrollSections.forEach(section => observer.observe(section));

// remove focus on back to top link when clicked
const backToTopLink = document.querySelector("#back-to-top-link a");
backToTopLink.addEventListener("click", event => {
	document.activeElement.blur();
	event.preventDefault();
  	window.scrollTo(0, 0);
	history.replaceState(null, "", window.location.href.split("#")[0]);
});

// parallax for background
// TODO: replace with CSS when scroll-timeline becomes widely available
const parallaxSpeed = 0.5;
const parallaxBackground = document.getElementById("parallax-background");
window.addEventListener("scroll", () => {
	const distance = window.scrollY;
	parallaxBackground.style.transform = `translateY(${parallaxSpeed * distance}px)`;
});
