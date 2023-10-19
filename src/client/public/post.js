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
    showCamera.classList.add("active");
    showGalery.classList.remove("active");
  }
};
const hidePic = () => {
  const showGalery = document.querySelector(".galeryShow");
  const showCamera = document.querySelector(".cameraShow");
  showGalery.classList.remove("active");
  showCamera.classList.remove("active");
};

const createPost = async (fileInput) => {
  var desc = document.querySelector(".desc").value;

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
  const pckCamera = document.getElementById("pckCmr");
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

  pckCamera.addEventListener("click", (e) => {
    showPic(2);

    const webCamElement = document.getElementById("webCam");
    const snapBtn = document.querySelector(".snapBtn");
    const canvaElem = document.getElementById("canvas");
    const webcam = new Webcam(webCamElement, "user", canvaElem);
    webcam.start();
    snapBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const webcamCanvas = webcam.snap();
    });
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
    stickerImg.src = `../public/images/stickers/${sticker}`;

    stickerImg.alt = "Sticker";
    stickerImg.className = "sticker";

    stickerImg.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", sticker);
    });

    stickerSelection.appendChild(stickerImg);
  });

  const canvasContainer = document.getElementById("canvas-container");
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");

  canvasContainer.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  canvasContainer.addEventListener("drop", (e) => {
    e.preventDefault();
    const sticker = e.dataTransfer.getData("text/plain");
    const stickerImg = new Image();
    stickerImg.src = `../public/images/stickers/${sticker}`;

    const x = e.clientX - canvasContainer.getBoundingClientRect().left;
    const y = e.clientY - canvasContainer.getBoundingClientRect().top;

    if (x + stickerImg.width / 2 > canvas.width / 2) {
      context.drawImage(
        stickerImg,
        canvas.width - x - stickerImg.width,
        y,
        stickerImg.width,
        stickerImg.height
      );
    } else {
      context.drawImage(stickerImg, x, y, stickerImg.width, stickerImg.height);
    }
  });

  stickerSelection.addEventListener("wheel", (e) => {
    // yukari ise sola kaydir
    if (e.deltaY < 0) {
      stickerSelection.scrollLeft -= 20;
    } else {
      stickerSelection.scrollLeft += 20;
    }
    e.preventDefault();
  });
}
