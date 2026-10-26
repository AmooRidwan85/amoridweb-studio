"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".navigation");
  const serviceMenu = document.querySelector(".service-menu");
  const serviceToggle = document.querySelector(".service-toggle");

  // Mobile navigation menu
  if (menuToggle && navigation) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navigation.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
      );

      const icon = menuToggle.querySelector("i");
      if (icon) {
        icon.classList.toggle("fa-bars", !isOpen);
        icon.classList.toggle("fa-xmark", isOpen);
      }
    });

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navigation.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");

        const icon = menuToggle.querySelector("i");
        if (icon) {
          icon.classList.add("fa-bars");
          icon.classList.remove("fa-xmark");
        }
      });
    });
  }

  // Services dropdown on mobile
  if (serviceMenu && serviceToggle) {
    serviceToggle.addEventListener("click", (event) => {
      if (window.matchMedia("(max-width: 800px)").matches) {
        event.preventDefault();

        const isOpen = serviceMenu.classList.toggle("open");
        serviceToggle.setAttribute("aria-expanded", String(isOpen));
      }
    });
  }

  // Hero typewriter
  const typewriter = document.querySelector("#typewriter");

  if (typewriter) {
    const phrases = ["web designer", "web developer"];
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
      typewriter.textContent = phrases[0];
    } else {
      let phraseIndex = 0;
      let characterIndex = 0;
      let deleting = false;

      const typeNextCharacter = () => {
        const phrase = phrases[phraseIndex];

        characterIndex += deleting ? -1 : 1;
        typewriter.textContent = phrase.slice(0, characterIndex);

        let delay = deleting ? 45 : 85;

        if (!deleting && characterIndex === phrase.length) {
          deleting = true;
          delay = 1300;
        } else if (deleting && characterIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          delay = 350;
        }

        window.setTimeout(typeNextCharacter, delay);
      };

      typeNextCharacter();
    }
  }

  // Reveal intro section as it enters the viewport
  const introSection = document.querySelector(".intro-section");

  if (introSection && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            introSection.classList.add("is-visible");
            currentObserver.unobserve(introSection);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(introSection);
  } else {
    introSection?.classList.add("is-visible");
  }

  // Portfolio filters
  const filterButtons = document.querySelectorAll(".work-filter");
  const workTrack = document.querySelector(".work-track");

  if (filterButtons.length && workTrack) {
    const cards = Array.from(workTrack.querySelectorAll(".work-card"));

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const selectedFilter = button.dataset.filter || "all";

        filterButtons.forEach((filterButton) => {
          const isActive = filterButton === button;
          filterButton.classList.toggle("active", isActive);
          filterButton.setAttribute("aria-pressed", String(isActive));
        });

        workTrack.classList.toggle("is-filtered", selectedFilter !== "all");

        cards.forEach((card) => {
          const matches =
            selectedFilter === "all" ||
            card.dataset.category === selectedFilter;

          card.hidden = !matches;
        });
      });
    });
  }

  // Contact form validation and WhatsApp submission
  const contactForm = document.querySelector("#contact-form");
  const formStatus = document.querySelector("#form-status");

  if (contactForm && formStatus) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      formStatus.textContent = "";

      // Run built-in HTML validation (required fields, email format, etc.)
      if (!contactForm.reportValidity()) {
        return;
      }

      const formData = new FormData(contactForm);

      const firstName = String(formData.get("firstName") || "").trim();
      const lastName = String(formData.get("lastName") || "").trim();
      const email = String(formData.get("email") || "").trim();
      const phone = String(formData.get("phone") || "").trim();
      const service = String(formData.get("service") || "").trim();
      const message = String(formData.get("message") || "").trim();

      // Extra validation to reject whitespace-only values
      if (!firstName || !lastName || !email || !service || !message) {
        formStatus.textContent = "Please complete all required fields.";
        return;
      }

      const whatsappMessage = [
        "Contact form enquiry",
        `Name: ${firstName} ${lastName}`,
        `Email: ${email}`,
        `Phone: ${phone || "Not provided"}`,
        `Service: ${service}`,
        `Message: ${message}`,
      ].join("\n");

      const whatsappUrl =
        `https://wa.me/2348139784622?text=${encodeURIComponent(whatsappMessage)}`;

      formStatus.textContent =
        "Your message is ready. WhatsApp will open so you can send it.";

      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    });
  }

  // Newsletter form demo response.
  // Connect this form to an email marketing service to save subscriber addresses.
  const newsletterForm = document.querySelector(".newsletter-form");
  const newsletterStatus = document.querySelector(".subscribe-success");

  if (newsletterForm && newsletterStatus) {
    newsletterForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!newsletterForm.reportValidity()) {
        return;
      }

      newsletterStatus.textContent =
        "Thanks for subscribing. This form needs to be connected to a mailing service to save your email.";
      newsletterForm.reset();
    });
  }
});