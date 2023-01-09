import * as React from 'react'
import {Link, Route, Routes} from 'react-router-dom'
import './styles.css'
import SVBBoard from "~SVBBoard";
import {Pencil2Icon} from '@radix-ui/react-icons'
import EdubreakService from "~services/EdubreakService";


export default function App() {
  const [pages, setPages] = React.useState([{
    path: '',
    title: ''
  }]);
  const [isBoard, setIsBoard] = React.useState(false);
  React.useEffect(() => {
    if (EdubreakService.getBoardIDfromURL() !== null) {
      setIsBoard(true)
    } else {
      EdubreakService.getBoards().then((boards) => {
        setPages(boards)
      })
    }
  }, [])
  const [showInput, setShowInput] = React.useState(false)
  const [title, setTitle] = React.useState('');

  async function createPage() {
    let boardID = await EdubreakService.createBoard(title)
    const newPage = {path: '/svb/' + boardID, title: title}
    pages.push(newPage);
    setShowInput(false)
    setPages(pages)
  }

  function showTitleInput() {
    setShowInput(true);
  }

  function setTitleFromInput(event: any) {
    setTitle(event.target.value)
  }

  function _handleKeyDown(e: any) {
    if (e.key === 'Enter') {
      createPage();
    }
  }

  return (
    <main>
      {!isBoard ?
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <div className="header">
                  <div className="header-title">Meine Boards</div>
                  <button className="newPage" onClick={showTitleInput}><Pencil2Icon
                    style={{width: 35, height: 35, color: "#555555"}}/></button>
                </div>
                <ul className="links">
                  {pages.map((page: any, i: any) =>
                    page === '' ? (
                      <p>Keine aktiven Boards verfügbar!</p>
                    ) : (
                      <li key={i}>
                        <Link to={page.path}>{page.title}</Link>
                      </li>
                    )
                  )}
                  {showInput ? <div className="titleInput">
                    <input autoFocus onKeyDown={_handleKeyDown} type="text" onChange={setTitleFromInput}/>
                    <button onClick={createPage}>OK</button>
                  </div> : null}
                </ul>
              </div>
            }
          />
          {pages.map((page: any) =>
            page === '---' ? null : (
              <Route key={page.path} path={page.path} element={<SVBBoard/>}/>
            )
          )}
        </Routes> :
        <SVBBoard/>
      }
    </main>
  )
}
