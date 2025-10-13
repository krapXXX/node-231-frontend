import { useEffect, useState } from 'react';
import './App.css';
import Base64 from './base_64.js';
import FeedbackPanel from "./FeedbackPanel.jsx";

const tokenKey = "token-231"

function App() {

  const [token, setToken] = useState(null);
  const [payload, setPayload] = useState(null);
  const [timeBack, setTimeBack] = useState(null);
  useEffect(() => {
    const t = window.localStorage.getItem(tokenKey);
    if (t) {
      setToken(t);
    }
  }, []);

  const timerTick = () => {
    console.log(payload.exp);
  };

  useEffect(() => {
    if (token != null) {
      window.localStorage.setItem(tokenKey, token);
      setPayload(Base64.jwtDecodePayload(token));
    }
    else {
      window.localStorage.removeItem(tokenKey);
      setPayload(null);
    }
  }, [token]);

  useEffect(() => {
    if (payload) {

      const timerTick = () => {
        const time_back = payload.exp - new Date().getTime() / 1000;
        const seconds = Math.max(0, Math.floor(time_back));

        setTimeBack(seconds);

        if (seconds <= 0) {
          setToken(null);
          clearInterval(timer);
        }
      };

      timerTick(); 
      let timer = setInterval(timerTick, 1000);
      return () => clearInterval(timer);
    }
  }, [payload]);

  const request = (url, conf) => new Promise((resolve, reject) => {
    if (url.startsWith('/')) {
      url = "http://localhost:81" + url;
    }
    if (token != null) {
      if (typeof conf == 'undefined') {
        conf = {};
      }
      if (typeof conf.headers == 'undefined') {
        conf.headers = {};
      }
      if (typeof conf.headers["Authorization"] == 'undefined') {
        conf.headers["Authorization"] = "Bearer " + token;
      }
    }
    fetch(url, conf)
      .then(r => r.json())
      .then(j => {
        if (j.status.isSuccess) {
          resolve(j.data);
        } else {
          console.error(j);
          reject(j);
        }
      })
      .catch(reject);
  });

  return token == null ? <GuestMode request={request} setToken={setToken} /> :
    <AuthMode request={request} setToken={setToken} timeBack={timeBack} />;
}

function AuthMode({ request, setToken, timeBack }) {
  const [data, setData] = useState({
    name: "",
    email: "",
    birthdate: "",
    login: "",
    password: "",
    repeat: ""
  });

  const [txt, setTxt] = useState("");
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

  const install = () => {
    request("/api/client/install")
      .then(j => setTxt(JSON.stringify(j)));
  };
  const testAuth1 = () => {
    request("/api/client/login", {
      headers: {
        "Authorization": ""
      }
    })
      .then(setTxt)
      .catch(j => setTxt(j.data));
  }
  const testAuth2 = () => {
    request("/api/client/login", {
      headers: {
        "Authorization": "123"
      }
    })
      .then(setTxt)
      .catch(j => setTxt(j.data));
  }
  const testAuth3 = () => {
    request("/api/client/login", {
      headers: {
        "Authorization": "Bearer 123"
      }
    })
      .then(setTxt)
      .catch(j => setTxt(j.data));
  }
  const testAuth4 = () => {
    request("/api/client/login", {
      headers: {
        "Authorization": "Bearer ~.!.%"
      }
    })
      .then(setTxt)
      .catch(j => setTxt(j.data));
  }
  const testAuth5 = () => {
    const h = btoa("x = 10")
    request("/api/client/login", {
      headers: {
        "Authorization": `Bearer ${h}.${h}.${h}`
      }
    })
      .then(setTxt)
      .catch(j => setTxt(j.data));
  }
  const testAuth6 = () => {
  const h = btoa('"just a string"'); // JSON-рядок, а не об'єкт
  request("/api/client/login", {
    headers: {
      "Authorization": `Bearer ${h}.${h}.${h}`
    }
  })
    .then(setTxt)
    .catch(j => setTxt(j.data));
};
const testAuth7 = () => {
  const h = btoa(JSON.stringify({ alg: "HS256" }));
  request("/api/client/login", {
    headers: {
      "Authorization": `Bearer ${h}.${h}.${h}`
    }
  })
    .then(setTxt)
    .catch(j => setTxt(j.data));
};
const testAuth8 = () => {
  const h = btoa(JSON.stringify({ typ: "JWS", alg: "HS256" }));
  request("/api/client/login", {
    headers: {
      "Authorization": `Bearer ${h}.${h}.${h}`
    }
  })
    .then(setTxt)
    .catch(j => setTxt(j.data));
};
const testAuth9 = () => {
  const h = btoa(JSON.stringify({ typ: "JWT" }));
  request("/api/client/login", {
    headers: {
      "Authorization": `Bearer ${h}.${h}.${h}`
    }
  })
    .then(setTxt)
    .catch(j => setTxt(j.data));
};
const testAuth10 = () => {
  const h = btoa(JSON.stringify({ typ: "JWT", alg: "None" }));
  request("/api/client/login", {
    headers: {
      "Authorization": `Bearer ${h}.${h}.${h}`
    }
  })
    .then(setTxt)
    .catch(j => setTxt(j.data));
};
const testAuth11 = () => {
  const h = btoa(JSON.stringify({ typ: "JWT", alg: "HS256" }));
  request("/api/client/login", {
    headers: {
      "Authorization": `Bearer ${h}.${h}.RANDOM_SIGNATURE`
    }
  })
    .then(setTxt)
    .catch(j => setTxt(j.data));
};

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
      <button onClick={() => setToken(null)}>Exit auth mode</button>
     <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "10px", justifyContent: "center"  }}>
  <span style={{ fontWeight: "bold" }}>
     {timeBack} <br /> Seconds until exit
  </span>
</div>


     <div style={{ border: "1px solid gray", padding: 10, marginTop: 20 }}>
  <h3>Test reject token</h3>

    <button onClick={testAuth1}>Порожній заголовок</button>
    <button onClick={testAuth2} style={{ margin: 5 }}>Неправильна структура заголовку</button>
    <button onClick={testAuth3} style={{ margin: 5 }}>Неправильна схема заголовку</button>
    <button onClick={testAuth4} style={{ margin: 5 }}>Не Base 64</button>
    <button onClick={testAuth5} style={{ margin: 5 }}>Не JSON</button>

    <button onClick={testAuth6}>Header JSON, але не об'єкт</button>
    <button onClick={testAuth7} style={{ margin: 5 }}>Відсутній .typ</button>
    <button onClick={testAuth8} style={{ margin: 5 }}>Неправильний .typ = "JWS"</button>
    <button onClick={testAuth9} style={{ margin: 5 }}>Відсутній .alg</button>
    <button onClick={testAuth10} style={{ margin: 5 }}>Неправильний .alg = "None"</button>
    <button onClick={testAuth11} style={{ margin: 5 }}>Неправильний підпис</button>
</div>


      <div style={{ border: "1px solid gray", padding: 5, marginTop: 10 }}>
        <input type="text" placeholder="Enter name" value={data.name} onChange={e => setData({ ...data, name: e.target.value })} /><br />
        <input type="email" placeholder="Enter email" value={data.email} onChange={e => setData({ ...data, email: e.target.value })} /><br />
        <input type="date" placeholder="Enter birthdate" value={data.birthdate} onChange={e => setData({ ...data, birthdate: e.target.value })} /><br />
        <input type="text" placeholder="Enter login" value={data.login} onChange={e => setData({ ...data, login: e.target.value })} /><br />
        <input type="password" placeholder="Enter password" value={data.password} onChange={e => setData({ ...data, password: e.target.value })} /><br />
        <input type="password" placeholder="Repeat password" value={data.repeat} onChange={e => setData({ ...data, repeat: e.target.value })} /><br />
        <button onClick={register}>Register</button>

      </div>

      <FeedbackPanel request={request} />


      <p>{txt}</p>
    </>
  )
}

function GuestMode({ request, setToken }) {
  const [auth, setAuth] = useState({
    login: "",
    password: ""
  })
  const [txt, setTxt] = useState("");

  const testGetClient = () => {
    request("/api/client/login")
      .then(setTxt)
      .catch(j => {
        setTxt(j.data);
      });
  }
  const onAuthClick = () => {
    console.log(`user-id:${auth.login},password:${auth.password}`);
    const userPass = auth.login + ':' + auth.password;
    const credentials = Base64.encode(userPass);
    console.log(credentials);
    request("/api/client/auth", {
      method: "GET",
      headers: {
        "Authorization": 'Basic ' + credentials
      }
    })
      .then(j => {
        setToken(j);
      })
      .catch(j => {
        setTxt(j.data);
      })


  };


  return <>
    <div style={{ margin: "10px 0", padding: "5px" }}>
      <h2>Автентифікація</h2>
      <label>
        <span>Login </span>
        <input type="text" value={auth.login} onChange={e => setAuth({ ...auth, login: e.target.value })} />
      </label> <br />
      <label>
        <span>Password </span>
        <input type="password" value={auth.password} onChange={e => setAuth({ ...auth, password: e.target.value })} /> <br />
      </label> <br />
      <button onClick={onAuthClick}>Вхід</button>
    </div>
    <button onClick={testGetClient}>GET</button>
    <p>{txt}</p>
  </>
}

export default App;
