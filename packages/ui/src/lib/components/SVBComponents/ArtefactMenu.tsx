import { getInbox } from '@tldraw/edubreak'
import { Dialog } from 'primereact/dialog'
import { InputSwitch } from 'primereact/inputswitch'
import { memo, useEffect, useRef, useState } from 'react'
import { useTranslation } from '../../hooks/useTranslation/useTranslation'
import { Spinner } from '../Spinner'
import { Icon } from '../primitives/Icon'
import { Artefact } from './Artefact'

export const ArtefactMenu = memo(function ArtefactMenu() {
	const msg = useTranslation()
	const [loading, setLoading] = useState(true)
	const [display, setDisplay] = useState(true)
	const position = 'top-right'
	const [onlyMarkedContent, setonlyMarkedContent] = useState(true)
	const [artefactsList, _setArtefactsList] = useState<any[]>([])
	const artefactsRef = useRef(artefactsList)

	function setArtefactsList(artefactsList: any[]) {
		artefactsRef.current = artefactsList
		_setArtefactsList(artefactsList)
	}

	const onHide = () => {
		setDisplay(false)
	}

	const onDeleteInboxItem = (e: any) => {
		const newArtefactsList = artefactsRef.current.filter((item: any) => item.id !== e.detail)
		setArtefactsList(newArtefactsList)
	}

	const header = <div className="artefact-menu-header">{msg('artefact-menu.header')}</div>

	function loadArtefacts() {
		getInbox().then((inbox) => {
			try {
				if (inbox !== undefined) {
					const artefactElements = []
					for (const artefact of inbox) {
						artefactElements.push(artefact)
					}
					setArtefactsList(artefactElements)
					window.addEventListener('onDeleteInboxItem', onDeleteInboxItem)
				}
			} catch (e) {
				console.error('### Inbox Error: ', e)
			} finally {
				setLoading(false)
			}
		})
	}

	useEffect(() => {
		loadArtefacts()
		window.addEventListener('onAddArtefactToInbox', loadArtefacts)
	}, [])

	function getArtefactMenuContent() {
		return (
			<div className="artefact-menu-content">
				<div className="artefact-menu-content-top">
					<InputSwitch
						checked={onlyMarkedContent}
						onChange={(e) => setonlyMarkedContent(e.value!)}
						disabled
					/>
					<span className="artefact-menu-content-top-text">
						{msg('artefact-menu.only-show-marked-content')}
					</span>
					<div className="artefact-menu-content-top-icons">
						<Icon className="artefact-menu-content-top-icon" icon={'search'} />
						<Icon className="artefact-menu-content-top-icon" icon={'th-large'} />
						<Icon className="artefact-menu-content-top-icon" icon={'filter-fill'} />
					</div>
				</div>
				<div
					className={
						loading ? 'artefact-menu-content-bottom loading' : 'artefact-menu-content-bottom'
					}
				>
					{loading ? (
						<Spinner className="artefact-spinner" />
					) : artefactsList.length > 0 ? (
						artefactsList.map((artefact) => {
							return <Artefact key={artefact.id} artefact={artefact} />
						})
					) : (
						msg('artefact-menu.no-artefacts')
					)}
				</div>
			</div>
		)
	}

	return (
		<Dialog
			header={header}
			modal={false}
			position={position}
			visible={display}
			onHide={() => onHide()}
			className="artefact-menu"
		>
			{getArtefactMenuContent()}
		</Dialog>
	)
})
