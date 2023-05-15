// eslint-disable-next-line import/no-internal-modules
import '@tldraw/tldraw/editor.css'
// eslint-disable-next-line import/no-internal-modules
import '@tldraw/tldraw/ui.css'
import React from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import Pencil from '../../../assets/icons/icon/tool-pencil.svg'
import EdubreakService from '../services/EdubreakService'
import SocialVideoBoard from './SocialVideoBoard'

export default function Dashboard() {
	const [pages, setPages] = React.useState([
		{
			path: '',
			title: '',
		},
	])

	const [isBoard, setIsBoard] = React.useState(false)

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
	const [title, setTitle] = React.useState('')

	function showTitleInput() {
		setShowInput(true)
	}

	function setTitleFromInput(event: any) {
		setTitle(event.target.value)
	}

	function _handleKeyDown(e: any) {
		if (e.key === 'Enter') {
			createPage()
		}
	}

	async function createPage() {
		const boardID = await EdubreakService.createBoard(title)
		const newPage = { path: '/svb/' + boardID, title: title }
		pages.push(newPage)
		setShowInput(false)
		setPages(pages)
	}

	return (
		<main>
			{!isBoard ? (
				<Routes>
					<Route
						path="/"
						element={
							<div>
								<div className="header">
									<div className="header-title">Meine Boards</div>
									<button className="newPage" onClick={showTitleInput}>
										<img src={Pencil} alt={'Pencil'} />
									</button>
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
									{showInput ? (
										<div className="titleInput">
											<input
												autoFocus
												onKeyDown={_handleKeyDown}
												type="text"
												onChange={setTitleFromInput}
											/>
											<button onClick={createPage}>OK</button>
										</div>
									) : null}
								</ul>
							</div>
						}
					/>
					{pages.map((page: any) =>
						page === '---' ? null : (
							<Route key={page.path} path={page.path} element={<SocialVideoBoard />} />
						)
					)}
				</Routes>
			) : (
				<SocialVideoBoard />
			)}
		</main>
	)
}
