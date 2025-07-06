// this script runs on the lecture notes page

// make nav links highlight on scroll (progressive enhancement)
const OFFSET = 25; // maximum distance in pixels that the section heading can be from the top of the page to trigger an update

function highlightCurrentSection(currentSectionLink) { // focus the current section nav link
    pageNavLinks.forEach(link => {
        link.classList.remove("page-nav-focus");
    });
    currentSectionLink.classList.add("page-nav-focus");
}

function findCurrentSection() { // find which section we are currently looking at
    const currentSection = linksAndPositions.reduce((acc, curr) => (curr.top() > acc.top() && curr.top() <= OFFSET) ? curr : acc);
    highlightCurrentSection(currentSection.navLink);
}

const pageNavLinks = document.querySelectorAll(".ltx_in_page_navbar li a");
const sectionAnchors = document.querySelectorAll(".section-anchor");
const linksAndPositions = [...sectionAnchors].map(anchor => ({navLink: document.getElementById(`page-nav-${anchor.id}`), top: () => anchor.getBoundingClientRect().top}));

findCurrentSection(); // on page load, highlight current section
document.addEventListener("scroll", findCurrentSection, true);

// when buttons are clicked, disable the scroll event listener and highlight current section immediately
pageNavLinks.forEach(link => {
    link.addEventListener("click", event => {
        document.removeEventListener("scroll", findCurrentSection, true);
        highlightCurrentSection(event.target);
    });
});
sectionAnchors.forEach(anchor => {
    anchor.addEventListener("click", event => {
        document.removeEventListener("scroll", findCurrentSection, true);        
        highlightCurrentSection(document.getElementById(`page-nav-${event.target.parentElement.parentElement.id}`));
    });
});

// scrollend event adds back scroll event listener after it is removed by button press
document.addEventListener("scrollend", () => {
    findCurrentSection();
    document.addEventListener("scroll", findCurrentSection, true);
}, true);
