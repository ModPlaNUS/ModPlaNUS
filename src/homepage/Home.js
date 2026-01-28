import * as React from "react";
import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import Buttons from "./Buttons";
import { auth, db } from "../authentication/firebase-config";
import firebase from "firebase/compat/app";
import { onSnapshot, updateDoc, doc } from "firebase/firestore";

import "./Home.css";

/* =======================
   Module List
======================= */
export function ModuleList({ modules, setModules }) {
  function toggleCompletion(module, index) {
    const updated = [...modules];
    updated[index] = { ...module, isComplete: !module.isComplete };
    setModules(updated);
  }

  function deleteModule(_, index) {
    setModules(modules.filter((_, i) => i !== index));
  }

  return (
    <table className="module-table">
      <thead>
        <tr>
          <th>No.</th>
          <th>Module</th>
          <th>Grade</th>
          <th>MC</th>
          <th>Completed</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        {modules.map((m, i) => (
          <tr key={`${m.code}-${i}`}>
            <td>{i + 1}</td>
            <td>{m.code}</td>
            <td>{m.grade}</td>
            <td>{m.mc}</td>
            <td>
              <input
                type="checkbox"
                checked={m.isComplete}
                onChange={() => toggleCompletion(m, i)}
              />
            </td>
            <td>
              <input
                type="button"
                value="✕"
                onClick={() => deleteModule(m, i)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* =======================
   Home
======================= */
export default function Home() {
  const [userInfo, setUserInfo] = useState(null);

  const [modsY1S1, setModsY1S1] = useState([]);
  const [modsY1S2, setModsY1S2] = useState([]);
  const [modsY2S1, setModsY2S1] = useState([]);
  const [modsY2S2, setModsY2S2] = useState([]);
  const [modsY3S1, setModsY3S1] = useState([]);
  const [modsY3S2, setModsY3S2] = useState([]);
  const [modsY4S1, setModsY4S1] = useState([]);
  const [modsY4S2, setModsY4S2] = useState([]);

  /* ===== Fetch user data ===== */
  useEffect(() => {
    if (!firebase.auth().currentUser) return;

    return onSnapshot(
      doc(db, "users", firebase.auth().currentUser.uid),
      (snap) => setUserInfo(snap.data())
    );
  }, []);

  /* ===== Populate semesters ===== */
  useEffect(() => {
    if (!userInfo) return;

    setModsY1S1(userInfo.Y1S1Planned || []);
    setModsY1S2(userInfo.Y1S2Planned || []);
    setModsY2S1(userInfo.Y2S1Planned || []);
    setModsY2S2(userInfo.Y2S2Planned || []);
    setModsY3S1(userInfo.Y3S1Planned || []);
    setModsY3S2(userInfo.Y3S2Planned || []);
    setModsY4S1(userInfo.Y4S1Planned || []);
    setModsY4S2(userInfo.Y4S2Planned || []);
  }, [userInfo]);

  /* ===== Save ===== */
  async function handleSave() {
    if (!auth.currentUser) return;

    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      Y1S1Planned: modsY1S1,
      Y1S2Planned: modsY1S2,
      Y2S1Planned: modsY2S1,
      Y2S2Planned: modsY2S2,
      Y3S1Planned: modsY3S1,
      Y3S2Planned: modsY3S2,
      Y4S1Planned: modsY4S1,
      Y4S2Planned: modsY4S2,
    });
  }

  const email = auth.currentUser?.email ?? "Unknown user";

  /* ===== Render ===== */
  return (
    <div className="home">
      <Card className="home-header">
        <Typography>You are logged in as: {email}</Typography>
      </Card>

      <Card className="semester-card">
        <Buttons />
      </Card>

      {[
        ["YEAR 1 SEM 1", modsY1S1, setModsY1S1],
        ["YEAR 1 SEM 2", modsY1S2, setModsY1S2],
        ["YEAR 2 SEM 1", modsY2S1, setModsY2S1],
        ["YEAR 2 SEM 2", modsY2S2, setModsY2S2],
        ["YEAR 3 SEM 1", modsY3S1, setModsY3S1],
        ["YEAR 3 SEM 2", modsY3S2, setModsY3S2],
        ["YEAR 4 SEM 1", modsY4S1, setModsY4S1],
        ["YEAR 4 SEM 2", modsY4S2, setModsY4S2],
      ].map(([title, mods, setter]) => (
        <Card key={title} className="semester-card">
          <Typography variant="h6" className="semester-title">
            {title}
          </Typography>

          {mods.length > 0 ? (
            <ModuleList modules={mods} setModules={setter} />
          ) : (
            <Typography color="text.secondary">No plan</Typography>
          )}

          <Button fullWidth className="save-btn" onClick={handleSave}>
            Save Changes
          </Button>
        </Card>
      ))}
    </div>
  );
}
