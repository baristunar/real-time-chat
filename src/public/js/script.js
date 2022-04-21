const socket = io();
const container = document.querySelector(".container");
const usernameForm = document.querySelector(".username-form");
const usernameTextInput = document.querySelector(".username-form__input");
const chatLoggedUser = document.querySelector(".chat-logged-user");
const chatForm = document.querySelector(".chat-form");
const chatTextInput = document.querySelector(".chat-form__input");
const chatMessages = document.querySelector(".chat-messages");
const overlay = document.querySelector(".overlay");
const userTypingDiv = document.querySelector(".chat-user-typing");
let connectedUser = {};

const usernameFormOnSubmit = (e) => {
  e.preventDefault();
  const username = usernameTextInput.value.trim();

  if (username) {
    container.classList.remove("hidden");
    overlay.classList.add("hidden");
    connectedUser.username = username;
    chatLoggedUser.textContent = `${connectedUser.username} olarak giriş yaptınız.`;
  }
};

const chatFormOnSubmit = (e) => {
  e.preventDefault();
  const message = chatTextInput.value.trim();
  if (message) {
    socket.emit("send-message", {
      user: connectedUser,
      message,
    });

    chatTextInput.value = "";
  }
};

const onNewMessage = (data) => {
  userTypingDiv.innerHTML = "";
  const message = `<div class="chat-text">
  <span>${data.user?.username}:</span>  <span>${data.message}</span>
  </div>`;
  chatMessages.innerHTML += message;
  chatMessages.scrollTop = chatMessages.scrollHeight;
  chatTextInput.focus();
};

const chatTextInputOnChange = () => {
  socket.emit("typing", {
    user: connectedUser,
  });
};

const bindEvents = () => {
  usernameForm.addEventListener("submit", usernameFormOnSubmit);
  chatForm.addEventListener("submit", chatFormOnSubmit);
  chatTextInput.addEventListener("keypress", chatTextInputOnChange);
};

const onUserTyping = (data) => {
  userTypingDiv.innerHTML = `<p>${data.user.username} yazıyor..</p>`;
};

bindEvents();

socket.on("connected-user", (user) => {
  connectedUser = {
    ...user,
  };
});

socket.on("new-message", (data) => onNewMessage(data));
socket.on("typing", (user) => onUserTyping(user));
