import { useState } from 'react'
import styles from '../styles/SideMenu.module.css'

function SideMenu(){
    const [listState, setListState] = useState(false)
    const handleList = () => {
        setListState(!listState)
    }
    return <>
        <div className={styles.sideMenu}>
            <div className={styles['sideMenu-btn']} tooltip='展开文件列表' onClick={handleList} style={{display: listState === true ? 'none' : 'block'}}>
                <svg t="1687672671822" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1466" width="16" height="16"><path d="M170.667 170.667h682.666a42.667 42.667 0 0 1 0 85.333H170.667a42.667 42.667 0 1 1 0-85.333z m0 298.666h682.666a42.667 42.667 0 0 1 0 85.334H170.667a42.667 42.667 0 0 1 0-85.334z m0 298.667h682.666a42.667 42.667 0 0 1 0 85.333H170.667a42.667 42.667 0 0 1 0-85.333z" p-id="1467" fill="#2c2c2c"></path></svg>
            </div>
            {listState === true ? <div className={styles.fileList}>
                <div className={styles['close-btn']} onClick={handleList} tooltip='收起文件列表'>
                    <span>收起</span>
                </div>
            </div> : null}
        </div>
    </>
}

export default SideMenu