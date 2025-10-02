import { useState } from 'react';
import './App.css';

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [txt, setTxt] = useState("");


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
        // fallback for old-style feedback responses
        resolve(j);
      }
    })
    .catch(err => reject(err));
});

  const testGetClient = () => {
    request("/api/client").then(setTxt);
  };

  const testPostClient = () => {
    request("/api/client", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({ name, email, phone })
    })
      .then(setTxt)
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

  // --- FeedbackController methods ---
   // --- FeedbackController methods ---
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


  return (
    <>
      <h1>API Tester</h1>

      <h2>ClientController</h2>
      <button onClick={testGetClient}>GET</button>
      <button onClick={testPostClient}>POST</button>
      <button onClick={testPutClient}>PUT</button>
      <button onClick={testPatchClient}>PATCH</button>
      <button onClick={testDeleteClient}>DELETE</button>

      <div style={{ margin: "10px 0", padding: "5px" }}>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Name"
        /><br />
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
        /><br />
        <input
          type="tel"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          placeholder="Phone"
        /><br />
      </div>

      <h2>FeedbackController</h2>
      <button onClick={testGetFeedback}>GET</button>
      <button onClick={testPostFeedback}>POST</button>
      <button onClick={testPutFeedback}>PUT</button>
      <button onClick={testPatchFeedback}>PATCH</button>
      <button onClick={testDeleteFeedback}>DELETE</button>

      <pre style={{ marginTop: 20, padding: 10 }}>{txt}</pre>
    </>
  );
}

export default App;
