if (localStorage.getItem("user")) {
  document.addEventListener("DOMContentLoaded", async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const mainUrl = "http://localhost:4545";
    const profilePic = document.querySelector(".profile__thumbnail");
    const photoUrl = `${mainUrl}/images/${user.profilePic}`;
    const postUrl = `${mainUrl}/postimg/`;
    const username = document.querySelector(".profile__headline");
    const desc = document.querySelector("#p__desc");
    const following = document.querySelector("#user__following");
    const posts = document.querySelector("#user__post");
    const followers = document.querySelector("#user__followers");
    let postsLength = 0;

    profilePic.style.backgroundImage = `url(${photoUrl})`;
    username.textContent = user.username;
    desc.innerText = user.desc ? user.desc : "";
    following.textContent =
      user.followings.length > 0 ? user.followings.length : 0;
    followers.textContent =
      user.followers.length > 0 ? user.followers.length : 0;

    const profilePosts = document.querySelector(".profile__posts");
    const deleteThis = document.querySelector(".profile__post");
    deleteThis.remove();
    //fetch all users posts
    try {
      const response = await fetch(
        `http://localhost:4545/api/post/${user._id}`,
        {
          method: "GET",
        }
      );
      if (response.ok) {
        const responseData = await response.json();
        posts.textContent = responseData.length;
        postsLength = responseData.length;
        responseData.forEach((e) => {
          const postDiv = document.createElement("div");
          postDiv.classList.add("profile__post");
          postDiv.style.backgroundImage = `url(${postUrl + e.img})`;
          profilePosts.appendChild(postDiv);
        });
      }
    } catch (error) {
      console.error("API çağrısı sırasında bir hata oluştu.", error);
    }

    const checkPostCount = document.querySelector(".profile__posts");
    console.log(postsLength);
    if (postsLength <= 2) {
      checkPostCount.classList.add("lessTwo");
    } else {
      const check = checkPostCount.classList.contains("lessTwo");
      console.log(check);
      check && checkPostCount.classList.remove("lessTwo");
    }

    document.getElementById("logout").addEventListener("click", () => {
      window.location.href = "login.html";
    });
  });
} else {
  window.location.href = "login.html";
}
