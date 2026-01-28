import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "./authentication/firebase-config";
import "./nav.css";

function Nav() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <nav className="Nav">
      <ul className="nav-links">
        <Link to="/home"><li>Home</li></Link>
        <Link to="/signup"><li>SignUp</li></Link>
        <Link to="/signin"><li>SignIn</li></Link>
        <Link to="/signout"><li>SignOut</li></Link>
        <Link to="/"><li>Dashboard</li></Link>

        {user && (
          <li className="nav-user">
            {user.email}
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Nav;
