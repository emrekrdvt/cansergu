const currentUser = JSON.parse(localStorage.getItem("user"));
const mainUrl = "http://localhost:4545/api";
const imgPost = "http://localhost:4545/images/";
const postUrl = "http://localhost:4545/postimg/";
var noAvatar =
  "https://upload.wikimedia.org/wikipedia/commons/9/99/Exampleavatar.png";
var allComment;

if (!localStorage.getItem("user")) window.location.href = "login.html";
else {
  const feedContainer = document.querySelector(".feed__container");

  //profile header
  const profileHeader = document.getElementById("profileNav");
  profileHeader.addEventListener("click", () => {
    window.location.href = `profile.html?username=${currentUser.username}`;
  });

  if (feedContainer) {
    const likePhoto = async (id) => {
      try {
        const response = await fetch(
          `${mainUrl}/post/like/${currentUser.username}/${id}`,
          {
            method: "PATCH",
          }
        );
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };

    document.addEventListener("DOMContentLoaded", async () => {
      //user posts but hepsi
      const feedCard = document.querySelector(".feed__card");
      feedCard.remove();
      const userHeader = document.querySelector(".feed__header");
      const feedPhoto = document.querySelector(".feed__photo");
      const likes = document.getElementById("likes");
      const authorName = document.getElementById("authorName");
      const followPosts = document.getElementById("followingsPost");
      const recentPost = document.getElementById("recentPost");

      try {
        followPosts.addEventListener("click", async () => {
          const response = await fetch(
            `${mainUrl}/post/followingsPost/${currentUser.username}`,
            {
              method: "GET",
            }
          );
          if (response.ok) {
            const responseData = await response.json();
            loadFeed(responseData);
          }
        });
        recentPost.addEventListener("click", async () => {
          const response = await fetch(`${mainUrl}/post`, {
            method: "GET",
          });
          if (response.ok) {
            const responseData = await response.json();

            loadFeed(responseData);
          }
        });
      } catch (error) {}

      document.getElementById("searchBox")
        .addEventListener("input", async (e) => {
          var searchTerm = document.getElementById("searchBox").value;
          try {
            const resp = await fetch(`${mainUrl}/user/regex/${searchTerm}`, {
              method: "GET",
            });
            const data = await resp.json();
            const resultsContainer = document.getElementById("searchResults");
            resultsContainer.innerHTML = "";
            data.forEach((user) => {
              const resultItem = document.createElement("div");
              resultItem.textContent = user.username;
              resultsContainer.appendChild(resultItem);
              resultItem.addEventListener("click", () => {
                window.location.href = `profile.html?username=${user.username}`;
              })
            });
          } catch (error) {}
        });
    });

    document.getElementById("logout").addEventListener("click", () => {
      window.location.href = "login.html";
    });
  }
}

{
  /* <div id="search">
<input type="text" id="searchBox" placeholder="Arama">
</div> */
}
const addSearchElem = (data) => {};

const loadFeed = (responseData) => {
  var feedContainer = document.querySelector(".feed__container");
  while (feedContainer.firstChild) {
    feedContainer.removeChild(feedContainer.firstChild);
  }
  responseData.forEach((post) => {
    const feedCard = document.createElement("div");
    feedCard.classList.add("feed__card");
    feedCard.id = `feed__card_${post._id}`;

    const feedHeader = document.createElement("div");
    feedHeader.classList.add("feed__header");
    const headerImage = document.createElement("img");
    headerImage.classList.add("headerPic");
    const forHref = document.createElement("a");
    forHref.href = `profile.html?username=${post.author.username}`;

    let picBg;
    if (post.author.profilePic) picBg = `${imgPost}${post.author.profilePic}`;
    else picBg = noAvatar;
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
    changeLikes.id = `likePost_${post._id}`;
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
    small.id = `read_${post._id}`;
    small.textContent = "...read more";

    readMore.appendChild(small);
    feedCard.appendChild(readMore);

    if (descText.textContent.length < 100) readMore.style.display = "none";
    feedContainer.appendChild(feedCard);
  });

  responseData.forEach((post) => {
    const likeButon = document.getElementById(`likePost_${post._id}`);
    likeButon.addEventListener("click", () => {
      likePhoto(post._id);
    });
    const readMore = document.getElementById(`read_${post._id}`);
    readMore.addEventListener("click", () => {
      openReadMore(post._id);
    });
    const openThisPhoto = document.getElementById(`${post._id}`);
    openThisPhoto.addEventListener("click", () => {
      openFeedPhoto(post);
    });
  });
};
const openReadMore = (id) => {
  const postCard = document.getElementById(`feed__card_${id}`);
  const feedDesc = postCard.querySelector(".feed__desc");
  feedDesc.classList.toggle("open");
};

const openFeedPhoto = async (post) => {
  const postImg = `http://localhost:4545/postimg/${post.img}`;
  const photoDesc = document.querySelector(".desc__text");

  //ana divi olusturdum
  const photoModal = document.createElement("div");
  photoModal.id = "myOpenModal";
  photoModal.style.display = "flex";
  photoModal.className = `openModal_${post._id}`;

  //ana div icini olusturdum
  const modalContent = document.createElement("div");
  modalContent.className = "modal-content";

  const closeBtn = document.createElement("span");
  closeBtn.id = "closeModal";
  closeBtn.innerHTML = "&times;";

  //img olusturup tiklanan fotonun urlyi gomdum
  const modalImg = document.createElement("img");
  modalImg.className = "modal-img";
  modalImg.src = postImg;

  const authorInfo = document.createElement("div");
  authorInfo.className = "author_info";
  const authorName = document.createElement("h4");
  authorName.innerHTML = currentUser.username;
  const authorDescription = document.createElement("span");
  authorDescription.innerHTML = photoDesc.innerHTML;

  authorInfo.appendChild(authorName);
  authorInfo.appendChild(authorDescription);

  const commentsContainer = document.createElement("div");
  commentsContainer.className = "commentsContainer";

  //duzelt

  try {
    const response = await fetch(`${mainUrl}/comment/${post._id}`, {
      method: "GET",
    });
    if (response.ok) {
      const allComment = await response.json();
      allComment.forEach((comment) => {
        const comment1 = document.createElement("div");
        comment1.className = "comments";
        const commenterImage1 = document.createElement("img");
        commenterImage1.className = "img-src";
        if (comment.author.profilePic)
          commenterImage1.src = `${imgPost}${comment.author.profilePic}`;
        else commenterImage1.src = noAvatar;
        const commentInfo1 = document.createElement("div");
        commentInfo1.className = "comments-info";
        const commenterName1 = document.createElement("h4");
        commenterName1.innerHTML = comment.author.username;
        const commentText1 = document.createElement("span");
        commentText1.id = `commentText_${comment._id}`;
        commentText1.innerHTML = comment.comment;

        commentInfo1.appendChild(commenterName1);
        commentInfo1.appendChild(commentText1);
        comment1.appendChild(commenterImage1);
        comment1.appendChild(commentInfo1);

        const comment1More = document.createElement("img");
        comment1More.src = "../public/images/moreicon.png";
        comment1More.classList.add("commentMore");
        comment1More.id = `commentMore_${comment.author._id}`;
        comment1.appendChild(comment1More);
        comment1More.addEventListener("click", () => {
          comment1More.style.display = "none";
          const res = moreBtnFunc(comment, post);
          comment1.appendChild(res);
        });

        commentsContainer.appendChild(comment1);
      });
    }
  } catch (error) {
    console.log(error);
  }

  // Comment Input Container oluştur
  const commentInputContainer = document.createElement("div");
  commentInputContainer.className = "comment-input-container";

  // Input oluştur
  const commentInput = document.createElement("input");
  commentInput.type = "text";
  commentInput.className = "comment-input";
  commentInput.value = "";

  // "Share" düğmesi oluştur
  const shareButton = document.createElement("button");
  shareButton.classList.add("sharebutton");
  shareButton.innerHTML = "Share";

  commentInputContainer.appendChild(commentInput);
  commentInputContainer.appendChild(shareButton);

  modalContent.appendChild(closeBtn);
  modalContent.appendChild(modalImg);
  modalContent.appendChild(authorInfo);
  photoModal.appendChild(modalContent);
  modalContent.appendChild(commentsContainer);
  modalContent.appendChild(commentInputContainer);
  photoModal.appendChild(modalContent);
  document.body.appendChild(photoModal);

  const closeFeedPhoto = () => {
    const photoModal = document.querySelector(`.openModal_${post._id}`);
    photoModal.remove();
  };

  const close = document.getElementById("closeModal");
  close.addEventListener("click", () => {
    console.log(photoModal.style.display);
    closeFeedPhoto();
  });

  //yorum gondermek icin
  const shareButon = document.querySelector(".sharebutton");
  shareButon.addEventListener("click", async () => {
    const input = document.querySelector(".comment-input");
    const comment = input.value;
    const postId = post._id;
    const author = currentUser._id;

    try {
      const postComment = await fetch(`${mainUrl}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // JSON verisi gönderiyoruz
        },
        body: JSON.stringify({
          comment,
          postId,
          author,
        }),
      });
      if (postComment.ok) input.value = "";
      else {
        alert(`Bir seyler yanlis gitti`);
      }
    } catch (error) {}
  });
};
//end open photo
const moreBtnFunc = (comment, post) => {
  const commentAuthor = comment.author.username;
  const currentUsername = currentUser.username;
  const commentId = comment._id;
  console.log(post.author.username);
  let ehe = 0;
  if (ehe == 1) {
    const deleteOption = document.getElementById("deleteOption");
    const editOption = document.getElementById("editOption");
    deleteOption.remove();
    editOption.remove();
    return 1;
  }
  if (
    commentAuthor == currentUsername ||
    currentUsername == post.author.username
  ) {
    let = 1;
    var deleteOption = document.createElement("a");

    if (
      commentAuthor == currentUsername ||
      currentUsername == post.author.username
    ) {
      deleteOption.href = "#";
      deleteOption.id = "deleteOption";
      deleteOption.innerHTML = "Delete";
      deleteOption.addEventListener("click", async () => {
        try {
          const resp = await fetch(`${mainUrl}/comment/${commentId}`, {
            method: "DELETE",
          });
          if (resp.ok) {
            alert(`Comment deleted succesfully`);
            window.location.reload();
          } else alert(`Somethings get wrong sorry`);
        } catch (error) {
          alert(`Somethings get wrong sorry`);
        }
      });
    }

    // "Düzenle" seçeneğini ekle
    if (commentAuthor == currentUsername) {
      var editOption = document.createElement("a");
      editOption.href = "#";
      editOption.id = "editOption";
      editOption.innerHTML = "Edit";
      editOption.addEventListener("click", async () => {
        var newText = prompt("Enter the new comment:");
        var commentText = document.getElementById(`commentText_${commentId}`);
        console.log(newText);
        try {
          const resp = await fetch(`${mainUrl}/comment/${commentId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ newText }),
          });
          if (resp.ok) commentText.innerHTML = newText;
          else alert(`Somethin went wront`);
        } catch (error) {
          alert(`Somethin went wront`);
        }
      });
    }

    const commentMenu = document.createElement("div");
    commentMenu.classList.add("commentMenu");
    deleteOption && commentMenu.appendChild(deleteOption);
    editOption && commentMenu.appendChild(editOption);
    return commentMenu;
  }
};
