import { useState } from 'react';
import './App.css';
import Base64 from './base_64.js';
function App() {
  const [data, setData] = useState({
    name:"",
    email:"",
    birthdate:"",
    login:"",
    password:"",
    repeat:""
  });

 const [txt, setTxt] = useState("");

const [auth, setAuth] = useState({
    login: "",
    password: ""
  })


const request = (url, conf) => new Promise((resolve, reject) => {
  if (url.startsWith('/')) {
    url = "http://localhost:81" + url;
  }
  fetch(url, conf)
    .then(r => r.json())
    .then(j => {
      if (j.status && j.status.isSuccess) {
        resolve(j.data ?? j);
      } else {
        resolve(j);
      }
    })
    .catch(err => reject(err));
});
 const register = () => {
  if (!data.name || !data.email || !data.login || !data.password || !data.repeat) {
    alert("Заповніть усі поля!");
    return;
  }
  if (data.password !== data.repeat) {
    alert("Паролі не співпадають!");
    return;
  }

  request("/api/client", {
    method: "POST",
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(data)
  })
  .then(j => {
    // якщо бекенд кинув помилку про логін
    if (typeof j === "string" && j.includes("login") && j.includes("taken")) {
      alert(j);
      setTxt(j);
      return;
    }

    if (j.error) {
      alert("Помилка: " + j.error);
      setTxt(JSON.stringify(j));
    } else {
      alert("Успішна реєстрація!");
      setTxt(JSON.stringify(j));

      // очищаємо форму
      setData({
        name: "",
        email: "",
        birthdate: "",
        login: "",
        password: "",
        repeat: ""
      });
    }
  })
  .catch(err => {
    alert("Помилка: " + err);
  });
};

  const testGetClient = () => {
    request("/api/client/login").then(setTxt);
  };

  const testPostClient = () => {
    request("/api/client", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(data)
    })
      .then(j => setTxt(JSON.stringify(j)));
    // .then(r => {
    //   if (r.status !== 200) {
    //     setTxt(`Сервер відповів помилкою ${r.status}`);
    //   } else {
    //     let ct = r.headers.get("Content-Type");
    //     if (typeof ct === 'string' && ct.startsWith("application/json")) {
    //       r.json().then(j => setTxt(JSON.stringify(j)));
    //     } else {
    //       setTxt(`Відповідь Сервера не є JSON '${ct}'`);
    //     }
    //   }
    // });
  };

  const testPutClient = () => {
    request("/api/client", { method: 'PUT' })
      .then(setTxt);
  };

  const testPatchClient = () => {
    request("/api/client", { method: 'PATCH' })
      .then(setTxt);
  };

  const testDeleteClient = () => {
    request("/api/client", { method: 'DELETE' })
      .then(setTxt);
  };

  const testGetFeedback = () => {
    request("/api/feedback").then(setTxt);
  };

   const testPostFeedback = () => {
    request("/api/feedback", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({ name, email, phone })
    })
      .then(setTxt)
  
  };

  const testPutFeedback = () => {
    request("/api/feedback", { method: "PUT" })
      .then(setTxt);
  };

  const testPatchFeedback = () => {
    request("/api/feedback", { method: "PATCH" })
      .then(setTxt);
  };

  const testDeleteFeedback = () => {
    request("/api/feedback", { method: "DELETE" })
      .then(setTxt);
  };

  const install=() => {
     request("/api/client/install")
     .then(j => setTxt(JSON.stringify(j)));
  };
const onAuthClick=()=>
{
  console.log(`user-id:${auth.login},password:${auth.password}`);
const userPass = auth.login+':'+auth.password;
const credentials= Base64.encode(userPass);
console.log(credentials);
request("/api/client/auth",{
  method:"GET",
  headers:{"Authorization":'Basic '+credentials}
})
     .then(j => setTxt(JSON.stringify(j)));

}
  return (
    <>
      <h1>API Tester</h1>

      <h2>ClientController</h2>
      <button onClick={testGetClient}>GET</button>
      <button onClick={testPostClient}>POST</button>
      <button onClick={testPutClient}>PUT</button>
      <button onClick={testPatchClient}>PATCH</button>
      <button onClick={testDeleteClient}>DELETE</button>

      <button onClick={install}>INSTALL</button>


      <div style={{ margin: "10px 0", padding: "5px" }}>
      <input type="text" placeholder="Enter name" value={data.name} onChange={e => setData({ ...data, name: e.target.value })} /><br />
<input type="email" placeholder="Enter email" value={data.email} onChange={e => setData({ ...data, email: e.target.value })} /><br />
<input type="date" placeholder="Enter birthdate" value={data.birthdate} onChange={e => setData({ ...data, birthdate: e.target.value })} /><br />
<input type="text" placeholder="Enter login" value={data.login} onChange={e => setData({ ...data, login: e.target.value })} /><br />
<input type="password" placeholder="Enter password" value={data.password} onChange={e => setData({ ...data, password: e.target.value })} /><br />
<input type="password" placeholder="Repeat password" value={data.repeat} onChange={e => setData({ ...data, repeat: e.target.value })} /><br />
<button onClick={register}>Register</button>

      </div>

      <h2>FeedbackController</h2>
      <button onClick={testGetFeedback}>GET</button>
      <button onClick={testPostFeedback}>POST</button>
      <button onClick={testPutFeedback}>PUT</button>
      <button onClick={testPatchFeedback}>PATCH</button>
      <button onClick={testDeleteFeedback}>DELETE</button>

      <pre style={{ marginTop: 20, padding: 10 }}>{txt}</pre>

        <div style={{ margin: "10px 0", padding: "5px" }}>
        <h2>Автентифікація</h2>
        <label>
          <span>Login </span>
          <input type="text" value={auth.login} onChange={e => setAuth({...auth, login:e.target.value})}/>
        </label> <br/>
        <label>
          <span>Password </span>
          <input type="password" value={auth.password} onChange={e => setAuth({...auth, password:e.target.value})}/> <br/>
        </label> <br/>
        <button onClick={onAuthClick}>Вхід</button>
      </div>
      <p>{txt}</p>
    </>

  );
}

export default App;
