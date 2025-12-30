async function loadBriefs() {
  const res = await fetch("./briefs.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load briefs.json");
  return await res.json();
}

function uniq(arr) {
  return Array.from(new Set(arr.filter(Boolean)));
}

function norm(s) {
  return String(s || "").toLowerCase().trim();
}

function matchesQuery(item, q) {
  if (!q) return true;
  const hay = [
    item.title,
    item.category,
    item.format,
    item.description,
    ...(item.tags || []),
  ]
    .filter(Boolean)
    .join(" | ");
  return norm(hay).includes(norm(q));
}

function buildCard(item) {
  const tpl = document.getElementById("card");
  const node = tpl.content.firstElementChild.cloneNode(true);

  node.querySelector("[data-badge]").textContent = `${item.category || "Brief"} · ${String(item.format || "").toUpperCase()}`;
  node.querySelector("[data-date]").textContent = item.date ? item.date : "";
  node.querySelector("[data-title]").textContent = item.title || "Untitled";
  node.querySelector("[data-desc]").textContent = item.description || "";

  const tagsEl = node.querySelector("[data-tags]");
  (item.tags || []).slice(0, 8).forEach((t) => {
    const span = document.createElement("span");
    span.className = "tag";
    span.textContent = t;
    tagsEl.appendChild(span);
  });

  const open = node.querySelector("[data-open]");
  open.href = item.path;

  const copy = node.querySelector("[data-copy]");
  copy.addEventListener("click", async () => {
    const url = new URL(item.path, window.location.href).toString();
    try {
      await navigator.clipboard.writeText(url);
      copy.textContent = "Copied";
      setTimeout(() => (copy.textContent = "Copy link"), 900);
    } catch {
      // Fallback
      window.prompt("Copy link:", url);
    }
  });

  return node;
}

function render(items) {
  const grid = document.getElementById("grid");
  const count = document.getElementById("count");
  grid.innerHTML = "";

  if (!items.length) {
    const empty = document.createElement("div");
    empty.className = "small";
    empty.textContent = "No results. Try a different search/filter.";
    grid.appendChild(empty);
    count.textContent = "0 items";
    return;
  }

  items.forEach((it) => grid.appendChild(buildCard(it)));
  count.textContent = `${items.length} item${items.length > 1 ? "s" : ""}`;
}

function main(all) {
  const q = document.getElementById("q");
  const cat = document.getElementById("cat");
  const fmt = document.getElementById("fmt");

  // Populate category options
  uniq(all.map((x) => x.category))
    .sort((a, b) => String(a).localeCompare(String(b)))
    .forEach((c) => {
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      cat.appendChild(opt);
    });

  function apply() {
    const qq = q.value;
    const cc = cat.value;
    const ff = fmt.value;

    const filtered = all.filter((it) => {
      if (cc && it.category !== cc) return false;
      if (ff && it.format !== ff) return false;
      if (!matchesQuery(it, qq)) return false;
      return true;
    });

    // Recent first if date exists
    filtered.sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
    render(filtered);
  }

  q.addEventListener("input", apply);
  cat.addEventListener("change", apply);
  fmt.addEventListener("change", apply);
  apply();
}

loadBriefs()
  .then(main)
  .catch((err) => {
    const grid = document.getElementById("grid");
    grid.innerHTML = "";
    const div = document.createElement("div");
    div.className = "small";
    div.textContent = `Failed to load briefs: ${err.message}`;
    grid.appendChild(div);
  });


