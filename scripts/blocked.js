
// get limitName from URL
const urlParams = new URLSearchParams(window.location.search);
const limitName = urlParams.get('name');
if (limitName) {
    document.getElementById("limitName").textContent = `Blocked by your "${limitName}" limit.`;
}

const svg = document.querySelector("svg");
document.addEventListener("mousemove", (e) => {
    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const angle = Math.atan2(y - rect.height / 2, x - rect.width / 2);
    svg.style.transform = "rotate(" + angle + "rad)";
});