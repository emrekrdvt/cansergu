const loginContainer = document.querySelector(".login-form");
const signupContainer = document.querySelector(".signup-form");

const showSignUp = () => {
  // hangi buona basildiysa o zaten class adim signup-form
  // active ekledim veya aktifi sildim
  loginContainer.classList.remove("active");
  signupContainer.classList.add("active");
};

const showLogin = () => {
  loginContainer.classList.add("active");
  signupContainer.classList.remove("active");
};

const composeErrorMessage = (msg, node) => {
  closeErrorMessage();
  let message = document.createElement("p");
  message.textContent = msg;
  node && node.appendChild(message);
};

//added show last on the class name.
const displayErrorMessage = (node) => {
  node.classList.add("show");
};

const closeErrorMessage = () => {
  const closeBtn = document.querySelectorAll(".close-error-message");
  closeBtn.forEach((e) => {
    e.addEventListener("click", (e) => {
      e.target.closest("div").classList.remove("show");
    });
  });
};

//validate login helper
const validateLogin = (data, node) => {
  let username = data.username && data.username.trim() !== "";
  let password = data.password && data.password.trim().length > 6;

  let msg = "";

  if (!username) {
    msg = "Invalid Username";
    composeErrorMessage(msg, node);
  }
  if (!password) {
    msg = "Invalid Password";
    composeErrorMessage(msg, node);
  }

  if (msg !== "") {
    displayErrorMessage(node.closest("div"));
  }

  return username && password;
};

const validateSignUp = (data, node) => {
  let username = data.username && data.username.trim("") !== "";
  let email = data.email && data.email.match(/^[\w\.]+@([\w-]+\.)+[\w-]/i);
  let pass = data.password && data.password.trim().length > 6;
  let confPass = data.confPassword && data.confPassword.trim().length > 6;

  let msg = "";
  if (!username) {
    msg = "Invalid username";
    composeErrorMessage(msg, node);
  }
  if (!email) {
    msg = "Invalid email";
    composeErrorMessage(msg, node);
  }
  if (!pass) {
    msg = "Invalid password";
    composeErrorMessage(msg, node);
  }
  if (!(pass == confPass)) {
    msg = "Passwords don`t match";
    composeErrorMessage(msg, node);
  }

  if (msg !== "") {
    displayErrorMessage(node.closest("div"));
    return false;
  }
  return true;
};

if (loginContainer) {
  const redirectSignUpBtn = document.getElementById("redirect-signup");
  const redirectLoginBtn = document.getElementById("redirect-login");

  // butona event listener ekledim
  redirectSignUpBtn.addEventListener("click", (e) => {
    showSignUp();
  });
  redirectLoginBtn.addEventListener("click", (e) => {
    showLogin();
  });

  //login onaylamak icin

  const loginForm = document.getElementById("login__form");
  const signupForm = document.getElementById("signup__form");

  //error tutmak
  const loginError = document.querySelector(".login-error-message");
  const signupError = document.querySelector(".signup-error-message");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      let errorMessageNode = loginError.querySelector(".message");
      errorMessageNode.innerHTML = "";

      const username = document.getElementById("login-username").value;
      const password = document.getElementById("login-password").value;

      if (validateLogin({ username, password }, errorMessageNode)) {
        try {
          const response = await fetch("http://localhost:4545/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json", // JSON verisi gönderiyoruz
            },
            body: JSON.stringify({
              username,
              password,
            }),
          });
          if (response.ok) {
            const responseData = await response.json();
            if (responseData.isAtuh) {
              localStorage.setItem("user", JSON.stringify(responseData));
              window.location.href = "feed.html";
            } else {
              composeErrorMessage("Confirm your mail adress", errorMessageNode);
              displayErrorMessage(errorMessageNode.closest("div"));
            }
          } else {
            composeErrorMessage(response.statusText, errorMessageNode);
            displayErrorMessage(errorMessageNode.closest("div"));
          }
        } catch (error) {
          console.error("API çağrısı sırasında bir hata oluştu.", error);
        }
      }
      return;
    });
  }

  if (signupForm) {
    var fileInput;
    const pic = document.getElementById("profile-picture-input");
    const profilePic = document.getElementById("profile-picture");
    pic.addEventListener("change", (e) => {
      fileInput = e.target.files[0];
      console.log(fileInput);
      if (fileInput) {
        const reader = new FileReader();
        reader.onload = (e) => {
          profilePic.src = e.target.result;
        };
        reader.readAsDataURL(fileInput);
      }
    });
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      let errorMessageNode = signupError.querySelector(".message");
      let signupFormData = new FormData(signupForm);
      let username = signupFormData.get("username");
      let email = signupFormData.get("email");
      let password = signupFormData.get("password");
      let confPassword = signupFormData.get("confirm_password");
      let data = { username, email, password, confPassword };

      let postFormData = new FormData();
      postFormData.append("username", username);
      postFormData.append("password", password);
      postFormData.append("email", email);
      if (fileInput) postFormData.append("profilePic", fileInput);
      errorMessageNode.innerHTML = "";
      if (validateSignUp(data, errorMessageNode)) {
        try {
          const response = await fetch(
            "http://localhost:4545/api/auth/signup",
            {
              method: "POST",
              body: postFormData,
            }
          );
          if (response.ok) {
            console.log("Kullanıcı başarıyla kaydedildi.");
          } else {
            console.error("Kayıt sırasında bir hata oluştu.");
          }
        } catch (error) {
          console.error("API çağrısı sırasında bir hata oluştu.", error);
        }
      }
      return;
    });
  }
}
