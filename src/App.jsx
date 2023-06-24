import EditArea from "./components/Editarea.jsx";
import styles from './styles/index.module.css'

function App() {
  return <div id="editor">
    <div id={styles.navArea}>
      
    </div>
    <div id={styles.editorArea}>
      <div className={styles.container}>
        <EditArea/>
      </div>
    </div>         
  </div>
}

export default App;
