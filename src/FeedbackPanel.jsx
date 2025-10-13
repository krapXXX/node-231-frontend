// src/FeedbackPanel.jsx
import { useState } from "react";

export default function FeedbackPanel({ request }) {
  const [txt, setTxt] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  const testGetFeedback = () => {
    request("/api/feedback").then(setTxt);
  };

  const testPostFeedback = () => {
    request("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(form),
    }).then(setTxt);
  };

  const testPutFeedback = () => {
    request("/api/feedback", { method: "PUT" }).then(setTxt);
  };

  const testPatchFeedback = () => {
    request("/api/feedback", { method: "PATCH" }).then(setTxt);
  };

  const testDeleteFeedback = () => {
    request("/api/feedback", { method: "DELETE" }).then(setTxt);
  };

  return (
    <div style={{ border: "1px solid gray", paddingTop: 30, marginTop: 10 }}>
      <button onClick={testGetFeedback}>GET</button>
      <button onClick={testPostFeedback} style={{ marginLeft: 5 }}>
        POST
      </button>
      <button onClick={testPutFeedback} style={{ marginLeft: 5 }}>
        PUT
      </button>
      <button onClick={testPatchFeedback} style={{ marginLeft: 5 }}>
        PATCH
      </button>
      <button onClick={testDeleteFeedback} style={{ marginLeft: 5 }}>
        DELETE
      </button>

      <pre style={{ marginTop: 10, padding: 10 }}>{txt}</pre>
    </div>
  );
}
