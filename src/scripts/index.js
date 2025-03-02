// this script contains code which runs on the homepage

// toggles between a card section's expanded and collapsed state
function toggleAllCardsVisible(section) {
	const cards = section.querySelectorAll(".card");
	if (section.classList.contains("section-show-all")) {
		cards.forEach(card => {
			card.style.display = "block";
		});
		section.style.height = section.scrollHeight + "px";
	} else {
		cards.forEach(card => {
			card.style.display = null;
		});
		const initialHeight = section.scrollHeight;  // expanded height
		section.style.transition = "none";  // disable transitions temporarily
		section.style.height = null;  // remove inline property to collapse element to auto height
		const finalHeight = section.scrollHeight;  // get collapsed height

		requestAnimationFrame(() => {  // on the next frame, reset to expanded height and re-enable transitions
			section.style.height = initialHeight + "px";
			section.style.transition = null;
			requestAnimationFrame(() => {  // on the next frame, transition height
				section.style.height = finalHeight + "px";
			});
		});
	}
}

// implement a maximum width for the cards so that they don't get too large
// it is necessary to do this with JavaScript because css custom properties can't be used in container size queries
// without this section, the layout still works fine although cards have no maximum size
// TODO: need to change these to px as they change depending on the font
const leftMargin = parseInt(window.getComputedStyle(document.documentElement).getPropertyValue("--left-margin").split("rem")[0])
const gridGap = parseInt(window.getComputedStyle(document.documentElement).getPropertyValue("--grid-gap").split("rem")[0]);
const cardMinWidth = parseInt(window.getComputedStyle(document.documentElement).getPropertyValue("--card-min-width").split("rem")[0]);
const cardMaxWidth = parseInt(window.getComputedStyle(document.documentElement).getPropertyValue("--card-max-width").split("rem")[0]);

// min width for a layout with given number of columns to fit
const twoColumnMin = leftMargin + 2 * (gridGap + cardMinWidth);
const threeColumnMin = leftMargin + 3 * (gridGap + cardMinWidth);
// max width of a layout with given number of columns
const oneColumnMax = leftMargin + gridGap + cardMaxWidth;
const twoColumnMax = leftMargin + 2 * (gridGap + cardMaxWidth);
const threeColumnMax = leftMargin + 3 * (gridGap + cardMaxWidth);

// add container queries with the above sizes
document.head.appendChild(document.createElement("style")).innerHTML = `
		@container card-section (min-width: ${threeColumnMin}rem) {
			section {
				max-width: min(100%, ${threeColumnMax}rem);
			}

			.card:nth-child(n+4) {
				display: none;
			}
		}

		@container card-section (max-width: ${threeColumnMin}rem) {
			section {
				max-width: min(100%, ${twoColumnMax}rem);
			}

			.card:nth-child(n+3) {
				display: none;
			}
		}

		@container card-section (max-width: ${twoColumnMin}rem) {
			section {
				max-width: min(100%, ${oneColumnMax}rem);
			}

			.card:nth-child(n+2) {
				display: none;
			}
		}`;


// set initial heights of card sections to enable transitions
// TODO bug: resize page, then spacing at the bottom of the sections is incorrect until they are opened and closed once
document.querySelectorAll("section").forEach(section => {
	section.style.height = section.scrollHeight + "px";
});


// set initial vertical offset for card title
document.querySelectorAll(".card-content").forEach(cardContent => {
	// TODO bug: this doesn't run for cards that aren't shown initially
	const title = cardContent.querySelector(".card-title");
	cardContent.style.setProperty("--title-height", title.clientHeight.toString() + "px")
});

// set up event listener for expanding/collapsing card sections
document.querySelectorAll(".section-show-more").forEach(element => {
	element.addEventListener("click", event => {
		const section = event.target.parentElement.parentElement;
		section.classList.toggle("section-show-all");
		toggleAllCardsVisible(section);
	})
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
