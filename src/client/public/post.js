const postContainer = document.querySelector(".postContainer");

const showPic = (flag) => {
  const showGalery = document.querySelector(".galeryShow");
  const isGalery = showGalery.classList.contains("active");
  const showCamera = document.querySelector(".cameraShow");
  const isCamera = showCamera.classList.contains("active");

  if (flag === 1) {
    showGalery.classList.add("active");
    showCamera.classList.remove("active");
  } else if (flag === 2) {
    showCamera.classList.remove("active");
    showGalery.classList.add("active");
  }
};
const hidePic = () => {
  const showGalery = document.querySelector(".galeryShow");
  const showCamera = document.querySelector(".cameraShow");
  showGalery.classList.remove("active");
  showCamera.classList.remove("active");
};

const createPost = async (fileInput) => {
  const desc = document.querySelector(".desc").value;
  const user = JSON.parse(localStorage.getItem("user"));
  let postFormData = new FormData();
  postFormData.append("postImg", fileInput);
  postFormData.append("desc", desc);
  postFormData.append("authorId", user._id);

  try {
    const response = await fetch("http://localhost:4545/api/post", {
      method: "POST",
      body: postFormData,
    });
    if (response.ok) {
      window.alert("Post has been shared");
    } else {
      window.alert("An error occurred while sharing");
    }
  } catch (error) {
    console.error("API error", error);
  }
};

if (postContainer) {
  const chooseOptions = document.querySelector(".chooseOne");
  const galeryOption = chooseOptions.querySelector(".fromGalery");
  const cameraOption = chooseOptions.querySelector(".fromCamera");
  const picGalery = document.getElementById("fileInputGalery");
  const galeryPhoto = document.querySelector(".galeryPhoto");
  var fileInput;

  picGalery.addEventListener("change", (e) => {
    fileInput = e.target.files[0];
    if (fileInput) {
      const reader = new FileReader();
      reader.onload = (e) => {
        galeryPhoto.src = e.target.result;
        showPic(1);
      };
      reader.readAsDataURL(fileInput);
    }
  });
  const share = document.getElementById("share");
  const cancel = document.getElementById("cancel");

  share.addEventListener("click", (e) => {
    if (fileInput) createPost(fileInput);
    else window.alert("Where is the pic ? ");
  });
  cancel.addEventListener("click", (e) => {
    fileInput.value = "";
    hidePic();
  });
}

{
  const stickerSelection = document.querySelector(".stickerSelection");

  const stickers = ["cat1.png", "cat2.png", "cat3.png", "cat4.png"];

  stickers.forEach((sticker) => {
    const stickerImg = document.createElement("img");
    stickerImg.src = `../public/images/stickers/${sticker}`; // Stickerların bulunduğu dizini güncelleyin

    stickerImg.alt = "Sticker";
    stickerImg.className = "sticker";
    stickerImg.addEventListener("click", () => {
      // Seçilen sticker'ı fotoğrafa ekleyen bir işlevi burada çağırabilirsiniz
      // Örneğin, seçilen sticker'ı textarea içine veya fotoğrafın üstüne ekleyebilirsiniz
    });
    stickerSelection.appendChild(stickerImg);
  });

  // Scroll olayını dinle
  stickerSelection.addEventListener("wheel", (e) => {
    // Mouse tekerleği yukarı kaydırılırsa sola kaydır
    if (e.deltaY < 0) {
      stickerSelection.scrollLeft -= 20; // İstediğiniz kaydırma mesafesini ayarlayabilirsiniz
    }
    // Mouse tekerleği aşağı kaydırılırsa sağa kaydır
    else {
      stickerSelection.scrollLeft += 20; // İstediğiniz kaydırma mesafesini ayarlayabilirsiniz
    }
    // Scroll olayını engelleme
    e.preventDefault();
  });
}
