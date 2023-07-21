import EditArea from "./components/Editarea";
import styles from './styles/index.module.css'
import Toolbar from "./components/Toolbar";
import SelectionRect from "./components/SelectionRect";
import SideMenu from "./components/SideMenu";
import { connect } from "react-redux";
import action from "./store/actions";
import React from "react";

function App(props) {
  return <div id="editor">
    <div id={styles.navArea}>
      <Toolbar/>
    </div>
    <div id={styles.editorArea}>
      <SelectionRect/>
      <SideMenu/>
      <div className={styles.container}>
        <EditArea/>
      </div>
    </div>         
  </div>
}

export default connect(null, action.edit)(App);
