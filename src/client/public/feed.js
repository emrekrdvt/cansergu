if (!localStorage.getItem("user")) window.location.href = "login.html";
else {
  const feedContainer = document.querySelector(".feed__container");

  if (feedContainer) {
    document.addEventListener("click", (e) => {
      if (e.target.matches("small")) {
        e.target
          .closest(".feed__card")
          .querySelector(".feed__desc")
          .classList.toggle("open");
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    const profileLinks = document.querySelectorAll("[data-username]");
    profileLinks.forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem("user"));

        window.location.href = `profile.html?username=${user.username}`;
      });
    });
  });

  document.getElementById("logout").addEventListener("click", () => {
    window.location.href = "login.html";
  });
}
