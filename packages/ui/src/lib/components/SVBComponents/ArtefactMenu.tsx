import { memo, ReactChild, useEffect, useState } from 'react'
// import { useReadonly } from '../../hooks/useReadonly'
import { getInbox } from '@tldraw/edubreak'
import { Dialog } from 'primereact/dialog'
import { InputSwitch } from 'primereact/inputswitch'
import { useTranslation } from '../../hooks/useTranslation/useTranslation'
import { Icon } from '../primitives/Icon'
import { Artefact } from './Artefact'

export const ArtefactMenu = memo(function ArtefactMenu() {
	const msg = useTranslation()
	// const isReadonly = useReadonly()
	const [display, setDisplay] = useState(true)
	const position = 'top-right'
	const [onlyMarkedContent, setonlyMarkedContent] = useState(true)
	// TODO: get real artifacts here
	const [artefactsList, setArtefactsList] = useState<ReactChild[]>([])

	const onHide = () => {
		setDisplay(false)
	}

	const header = <div className="artefact-menu-header">{msg('artefact-menu.header')}</div>

	useEffect(() => {
		getInbox().then((inbox) => {
			const artefactElements = []
			for (const artefact of inbox) {
				const formatedDate = new Date(artefact.created).toLocaleString('de-DE', {
					day: '2-digit',
					month: '2-digit',
					year: 'numeric',
				})
				const subTitle =
					artefact.author.name.firstname +
					' ' +
					artefact.author.name.lastname +
					' | ' +
					formatedDate
				artefactElements.push(
					<Artefact
						key={artefact.id}
						title={artefact.title}
						subTitle={subTitle}
						tags={artefact.tags}
					/>
				)
			}
			setArtefactsList(artefactElements)
		})
	}, [])

	function getArtefacts() {
		return artefactsList
	}

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
				<div className="artefact-menu-content-bottom">
					{artefactsList.length > 0 ? getArtefacts() : msg('artefact-menu.no-artefacts')}
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
