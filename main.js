// Brief form -> prefilled email (static hosting, no backend needed)
const form = document.getElementById("briefForm");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(form));
    const subject = `Automation audit: ${d.company || d.name}`;
    const body = [
      `Name: ${d.name}`,
      `Company / website: ${d.company || "-"}`,
      `Budget: ${d.budget}`,
      `Timeline: ${d.timeline}`,
      "",
      "What should run on autopilot:",
      d.task,
    ].join("\n");
    window.location.href = `mailto:naghiayman@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

// Gentle reveal on scroll
const els = document.querySelectorAll(".section h2, .pain article, .offer, .case, .steps li, .care, .form");
if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  els.forEach((el) => el.classList.add("reveal"));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { rootMargin: "0px 0px -8% 0px" });
  els.forEach((el) => io.observe(el));
}
