const socket = io();
let myPhone = "";
let currentChat = "";

function register() {
  fetch("/register", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      phone: phone.value,
      password: password.value
    })
  }).then(r=>r.json()).then(res=>{
    alert("Зарегистрирован");
  });
}

function login() {
  fetch("/login", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      phone: phone.value,
      password: password.value
    })
  }).then(r=>r.json()).then(res=>{
    if(res.success){
      myPhone = phone.value;
      document.getElementById("auth").style.display="none";
      document.getElementById("app").style.display="flex";
      loadContacts(res.users);
    } else alert("Ошибка входа");
  });
}

function loadContacts(users){
  const div = document.getElementById("contacts");
  div.innerHTML="";
  users.forEach(u=>{
    if(u.phone !== myPhone){
      const c = document.createElement("div");
      c.className="contact";
      c.innerText=u.phone;
      c.onclick=()=>openChat(u.phone);
      div.appendChild(c);
    }
  });
}

function openChat(phone){
  currentChat = phone;
  document.getElementById("chatTitle").innerText="Чат с " + phone;
  document.getElementById("messages").innerHTML="";
}

function sendMessage(){
  const text = document.getElementById("text").value;
  socket.emit("sendMessage",{from:myPhone,to:currentChat,text});
  document.getElementById("text").value="";
}

socket.on("newMessage", msg=>{
  if(msg.from===myPhone && msg.to===currentChat || msg.to===myPhone && msg.from===currentChat){
    const div=document.createElement("div");
    div.className="message";
    div.innerText=msg.from+": "+msg.text;
    document.getElementById("messages").appendChild(div);
  }
});
