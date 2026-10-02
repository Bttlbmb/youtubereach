// Static reports keep sorting and native dialogs local, without loading the ranking app.
const ranking = document.getElementById("monthly-ranking");
if (ranking) {
  const body = ranking.querySelector("tbody");
  const rows = {
    weighted_reach: Array.from(body.children),
    reach: Array.from(
      document.getElementById("ranking-reach").content.children,
    ),
  };
  const buttons = document.querySelectorAll("[data-report-sort]");
  const labels = {
    weighted_reach: "weighted reach",
    reach: "countries reached",
  };
  let activeSort;
  const savedSort = () =>
    new URL(location.href).searchParams.get("sort") === "reach"
      ? "reach"
      : "weighted_reach";

  function sortRanking(sort, save = false) {
    if (sort === activeSort) return;
    activeSort = sort;
    body.replaceChildren(...rows[sort]);
    document.getElementById("ranking-title").textContent =
      `Top ${rows[sort].length} by ${labels[sort]}`;
    ranking.querySelector("caption").textContent =
      `Music videos ranked by ${labels[sort]}; both scores use the report's calendar month.`;
    for (const button of buttons) {
      const selected = button.dataset.reportSort === sort;
      button.querySelector(".sort-indicator").textContent = selected ? "↓" : "";
      if (button.hasAttribute("aria-pressed")) {
        button.setAttribute("aria-pressed", String(selected));
      } else {
        button
          .closest("th")
          .setAttribute("aria-sort", selected ? "descending" : "none");
      }
    }
    if (save) {
      const url = new URL(location.href);
      if (sort === "reach") url.searchParams.set("sort", sort);
      else url.searchParams.delete("sort");
      history.pushState(null, "", url);
    }
  }

  for (const button of buttons) {
    button.addEventListener("click", () =>
      sortRanking(button.dataset.reportSort, true),
    );
  }
  window.addEventListener("popstate", () => sortRanking(savedSort()));
  sortRanking(savedSort());
}

for (const trigger of document.querySelectorAll(
  ".header-help [aria-controls]",
)) {
  const dialog = document.getElementById(trigger.getAttribute("aria-controls"));
  trigger.addEventListener("click", () => {
    dialog.showModal();
    trigger.setAttribute("aria-expanded", "true");
  });
  dialog
    .querySelector("[data-close-help]")
    .addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => {
    trigger.setAttribute("aria-expanded", "false");
    trigger.focus();
  });
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    ) {
      dialog.close();
    }
  });
}
