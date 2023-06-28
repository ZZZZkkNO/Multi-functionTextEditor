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
                <div className={styles['add-btn']}>
                        <svg t="1687939779439" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5417" width="20" height="20"><path d="M512 992C246.912 992 32 777.088 32 512 32 246.912 246.912 32 512 32c265.088 0 480 214.912 480 480 0 265.088-214.912 480-480 480z m0-64c229.76 0 416-186.24 416-416S741.76 96 512 96 96 282.24 96 512s186.24 416 416 416z" fill="#000000" p-id="5418"></path><path d="M256 544a32 32 0 0 1 0-64h512a32 32 0 0 1 0 64H256z" fill="#000000" p-id="5419"></path><path d="M480 256a32 32 0 0 1 64 0v512a32 32 0 0 1-64 0V256z" fill="#000000" p-id="5420"></path></svg>
                </div>
            </div> : null}
        </div>
    </>
}

export default SideMenu