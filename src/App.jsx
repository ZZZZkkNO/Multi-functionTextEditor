import EditArea from "./components/Editarea";
import styles from './styles/index.module.css'
import Toolbar from "./components/Toolbar";
import SideMenu from "./components/SideMenu";
import { connect } from "react-redux";
import action from "./store/actions";
import { useRef } from "react";

function App(props) {
  const { blur } = props
  const flag = useRef()
  const handeBlur = (e) => {
    if(flag.current.flag === true) return
    flag.current.changeFlag()
    blur()  
}
  return <div id="editor">
    <div id={styles.navArea}>
      <Toolbar/>
    </div>
    <div id={styles.editorArea} onClick={handeBlur}>
      <SideMenu/>
      <div className={styles.container}>
        <EditArea ref={flag}/>
      </div>
    </div>         
  </div>
}

export default connect(null, action.edit)(App);
