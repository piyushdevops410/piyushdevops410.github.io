(() => {
  const header = document.querySelector("[data-header]");
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const year = document.querySelector("[data-year]");

  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Theme (dark / light) ---------- */
  const getTheme = () =>
    document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";

  const setTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("theme", theme); } catch (e) {}
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "light" ? "#f6f4fe" : "#0a0b16");
    if (themeToggle) {
      themeToggle.setAttribute(
        "aria-label",
        theme === "light" ? "Switch to dark mode" : "Switch to light mode"
      );
    }
  };

  if (themeToggle) {
    setTheme(getTheme());
    themeToggle.addEventListener("click", () => {
      setTheme(getTheme() === "light" ? "dark" : "light");
    });
  }

  /* ---------- Header shadow on scroll ---------- */
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
    });
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
      });
    });
  }

  /* ---------- Active section in menu while scrolling ---------- */
  if (nav) {
    const navLinks = [...nav.querySelectorAll('a[href^="#"]')];
    const sections = navLinks
      .map((link) => {
        const id = link.getAttribute("href")?.slice(1);
        const el = id ? document.getElementById(id) : null;
        return el ? { id, el, link } : null;
      })
      .filter(Boolean);

    const setActive = (id) => {
      navLinks.forEach((link) => {
        const match = link.getAttribute("href") === `#${id}`;
        link.classList.toggle("is-active", match);
        if (match) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
      });
    };

    const activateFromScroll = () => {
      const headerOffset = header?.offsetHeight || 74;
      const probe = window.scrollY + headerOffset + 24;
      let current = sections[0]?.id || "";

      for (const item of sections) {
        if (item.el.offsetTop <= probe) current = item.id;
      }

      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 48) {
        current = sections[sections.length - 1]?.id || current;
      }

      if (window.scrollY < 80) {
        navLinks.forEach((link) => {
          link.classList.remove("is-active");
          link.removeAttribute("aria-current");
        });
        return;
      }

      if (current) setActive(current);
    };

    activateFromScroll();
    window.addEventListener("scroll", activateFromScroll, { passive: true });
    window.addEventListener("resize", activateFromScroll);
  }

  /* ---------- Scroll reveal ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Experience counter ---------- */
  const countEl = document.querySelector("[data-count]");
  if (countEl) {
    const target = Number(countEl.getAttribute("data-count") || "6");
    const animate = () => {
      const start = performance.now();
      const duration = 1100;
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        countEl.textContent = String(Math.round(target * eased));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    if ("IntersectionObserver" in window) {
      const cio = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            animate();
            cio.disconnect();
          });
        },
        { threshold: 0.4 }
      );
      cio.observe(countEl);
    } else {
      animate();
    }
  }

  /* ---------- Skill bars ---------- */
  const skillBars = document.querySelectorAll("[data-skill-bar]");
  if (skillBars.length) {
    const animateBars = () => {
      skillBars.forEach((bar, i) => {
        window.setTimeout(() => bar.classList.add("is-animated"), i * 70);
      });
    };

    if ("IntersectionObserver" in window) {
      const sio = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            animateBars();
            sio.disconnect();
          });
        },
        { threshold: 0.25 }
      );
      const graph = document.querySelector(".skills-graph");
      if (graph) sio.observe(graph);
      else animateBars();
    } else {
      animateBars();
    }
  }

  /* ---------- Project screenshot viewer ---------- */
  const box = document.querySelector("[data-lightbox]");
  if (box) {
    const img = box.querySelector("[data-lb-img]");
    const prev = box.querySelector("[data-lb-prev]");
    const next = box.querySelector("[data-lb-next]");
    let shots = [];
    let idx = 0;
    let opener = null;

    const show = () => {
      const s = shots[idx];
      img.src = s.src;
      img.alt = s.alt || "";
      const many = shots.length > 1;
      prev.hidden = !many;
      next.hidden = !many;
    };
    const open = (list, from) => {
      shots = list; idx = 0; opener = from;
      show();
      box.hidden = false;
      document.body.style.overflow = "hidden";
      box.querySelector("[data-lb-close]").focus();
    };
    const close = () => {
      box.hidden = true;
      img.removeAttribute("src");
      document.body.style.overflow = "";
      if (opener) opener.focus();
    };
    const step = (d) => { idx = (idx + d + shots.length) % shots.length; show(); };

    document.querySelectorAll("[data-gallery]").forEach((fig) => {
      let list = [];
      try { list = JSON.parse(fig.getAttribute("data-gallery") || "[]"); } catch (e) {}
      if (!list.length) return;
      const go = () => open(list, fig);
      fig.addEventListener("click", go);
      fig.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); }
      });
    });

    box.querySelector("[data-lb-close]").addEventListener("click", close);
    prev.addEventListener("click", () => step(-1));
    next.addEventListener("click", () => step(1));
    box.addEventListener("click", (e) => { if (e.target === box) close(); });
    document.addEventListener("keydown", (e) => {
      if (box.hidden) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft" && shots.length > 1) step(-1);
      if (e.key === "ArrowRight" && shots.length > 1) step(1);
    });
  }
})();
