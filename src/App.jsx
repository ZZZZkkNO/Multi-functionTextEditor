import EditArea from "./components/Editarea";
import styles from './styles/index.module.css'
import Toolbar from "./components/Toolbar";
import SideMenu from "./components/SideMenu";
function App() {
  return <div id="editor">
    <div id={styles.navArea}>
      <Toolbar/>
    </div>
    <div id={styles.editorArea}>
      <SideMenu/>
      <div className={styles.container}>
        <EditArea/>
      </div>
    </div>         
  </div>
}

export default App;
