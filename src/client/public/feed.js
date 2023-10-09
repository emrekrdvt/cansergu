if (!localStorage.getItem("user")) window.location.href = "login.html";
else {
  const feedContainer = document.querySelector(".feed__container");

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const mainUrl = "http://localhost:4545/api";

  if (feedContainer) {
    /* readmore acmak icin */
    document.addEventListener("click", async (e) => {
      if (e.target.matches("small")) {
        e.target
          .closest(".feed__card")
          .querySelector(".feed__desc")
          .classList.toggle("open");
      }

      if (e.target.matches("#profileNav")) {
        window.location.href = `profile.html?username=${currentUser.username}`;
      }

      if (e.target.matches("#likePost")) {
        const postId = document.querySelector(".feed__photo").id;
        try {
          const response = await fetch(
            `${mainUrl}/post/like/${currentUser.username}/${postId}`,
            {
              method: "PUT",
            }
          );
          const data = await response.json();
          console.log(data);
        } catch (error) {
          console.log(error);
        }
      }
    });

    document.addEventListener("DOMContentLoaded", async () => {
      //user posts but hepsi
      const feedCard = document.querySelector(".feed__card");
      feedCard.remove();
      const userHeader = document.querySelector(".feed__header");
      const feedPhoto = document.querySelector(".feed__photo");
      const likes = document.getElementById("likes");
      const authorName = document.getElementById("authorName");

      const imgPost = "http://localhost:4545/images/";
      const postUrl = "http://localhost:4545/postimg/";
      try {
        const response = await fetch(`${mainUrl}/post`, {
          method: "GET",
        });

        if (response.ok) {
          const responseData = await response.json();
          console.log(responseData);
          responseData.forEach((post) => {
            const feedContainer = document.querySelector(".feed__container");
            const feedCard = document.createElement("div");
            feedCard.classList.add("feed__card");

            const feedHeader = document.createElement("div");
            feedHeader.classList.add("feed__header");
            const headerImage = document.createElement("img");
            headerImage.classList.add("headerPic");
            const forHref = document.createElement("a");
            forHref.href = `profile.html?username=${post.author.username}`;

            let picBg;
            if (post.author.profilePic)
              picBg = `${imgPost}${post.author.profilePic}`;
            else
              picBg =
                "https://upload.wikimedia.org/wikipedia/commons/9/99/Exampleavatar.png";
            headerImage.src = picBg;
            const headerName = document.createElement("h4");
            headerName.classList.add("bold");
            headerName.textContent = post.author.username;

            feedHeader.appendChild(headerImage);
            feedHeader.appendChild(headerName);
            forHref.appendChild(feedHeader);
            feedCard.appendChild(forHref);

            // post foto
            const postPhoto = document.createElement("div");
            postPhoto.classList.add("feed__photo");
            postPhoto.id = post._id;
            let bg = `url(${postUrl}${post.img})`;
            postPhoto.style.backgroundImage = bg;
            feedCard.appendChild(postPhoto);

            const feedStats = document.createElement("div");
            feedStats.classList.add("feed__stats");

            const statsActions = document.createElement("div");
            statsActions.classList.add("stats__actions");
            const changeLikes = document.createElement("span");
            changeLikes.classList.add("change-likes");
            changeLikes.id = "likePost";
            changeLikes.textContent = "Like";
            const sendComment = document.createElement("span");
            sendComment.classList.add("send-comment");
            sendComment.textContent = "Comment";

            statsActions.appendChild(changeLikes);
            statsActions.appendChild(sendComment);

            const statsNumber = document.createElement("div");
            statsNumber.classList.add("stats__number");
            const likes = document.createElement("span");
            likes.id = "likes";
            likes.textContent = post.likes.length;

            statsNumber.appendChild(likes);

            feedStats.appendChild(statsActions);
            feedStats.appendChild(statsNumber);
            feedCard.appendChild(feedStats);

            //desc bolumu
            const feedDesc = document.createElement("div");
            feedDesc.classList.add("feed__desc");
            const descAuthor = document.createElement("div");
            descAuthor.classList.add("desc__author", "bold");
            descAuthor.id = "authorName";
            descAuthor.textContent = post.author.username;
            const descText = document.createElement("div");
            descText.classList.add("desc__text");
            descText.textContent = post.desc;

            feedDesc.appendChild(descAuthor);
            feedDesc.appendChild(descText);
            feedCard.appendChild(feedDesc);

            const readMore = document.createElement("div");
            readMore.classList.add("read__more");
            const small = document.createElement("small");
            small.textContent = "...read more";

            readMore.appendChild(small);
            feedCard.appendChild(readMore);

            if (descText.textContent.length < 100)
              readMore.style.display = "none";
            feedContainer.appendChild(feedCard);
          });
        }
      } catch (error) {}
    });

    document.getElementById("logout").addEventListener("click", () => {
      window.location.href = "login.html";
    });
  }
}
