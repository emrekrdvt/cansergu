const mainUrl = "http://localhost:4545/api";
const currentUser = JSON.parse(localStorage.getItem("user"));
const imgPost = "http://localhost:4545/images/";
{
  const settingsBtn = document.getElementById("settingBtn");
  const settingsForm = document.getElementById("settings__form");
  if (settingsForm) {
    var fileInput;
    const pic = document.getElementById("profile_pic_input");
    const profilePic = document.querySelector(".userProfilePic");
    profilePic.src = `http://localhost:4545/images/${currentUser.profilePic}`;
    let postFormData = new FormData();

    pic.addEventListener("change", (e) => {
      fileInput = e.target.files[0];
      if (fileInput) {
        const reader = new FileReader();
        reader.onload = (e) => {
          profilePic.src = e.target.result;
        };
        reader.readAsDataURL(fileInput);
        postFormData.append("profilePic", fileInput);
      }
    });
    var bio = document.getElementById("settings-bio");
    bio.value = currentUser.bio
    var username = document.getElementById("settings-username");
    username.value = currentUser.username
    var email = document.getElementById("settings-email");
    email.value = currentUser.email
    var p1 = document.getElementById("settings-password");
    var p2 = document.getElementById("settings-password2");

    settingsForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const body = {};
      if (bio.value.length > 0) body.bio = bio.value;
      else {
        if (currentUser.bio) body.bio = currentUser.bio;
        else body.bio = null;
      }

      if (username.value.length > 0) body.username = username.value;
      else body.username = currentUser.username;

      if (email.value.length > 0) body.email = email.value;
      else body.email = currentUser.email;

      if (p1.value.length > 0) body.password = p1.value;
      if (p1.value !== p2.value) return alert(`Sifreler eslesmiyor`);

      try {
        if (fileInput) {
          try {
            const resp = await fetch(
              `${mainUrl}/user/photo/${currentUser.username}`,
              {
                method: "PUT",
                body: postFormData,
              }
            );
            if (resp.ok);
            else return;
          } catch (error) {
            alert(`Profil degistirme hatasi`);
          }
        }
        if (bio.value || username.value || p1.value) {
          try {
            const resp = await fetch(
              `${mainUrl}/user/${currentUser.username}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
              }
            );
            if (resp.ok) {
              const data = await resp.json();
              console.log(data);
              const storedData = JSON.parse(localStorage.getItem("user")) || {};
              const updateData = { ...storedData, ...data };
              localStorage.setItem("user", JSON.stringify(updateData));
              alert(`Profile updated`);
              window.location.href = "feed.html";
            } else {
              alert(`error`);
            }
          } catch (err) {
            alert(`settings error`);
          }
        }
      } catch (err) {
        alert(err);
      }
    });
  }
}
