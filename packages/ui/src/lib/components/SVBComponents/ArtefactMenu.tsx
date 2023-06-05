import { memo, useState } from 'react'
// import { useReadonly } from '../../hooks/useReadonly'
import { Dialog } from 'primereact/dialog'
import { InputSwitch } from 'primereact/inputswitch'
import { useTranslation } from '../../hooks/useTranslation/useTranslation'
import { Icon } from '../primitives/Icon'

export const ArtefactMenu = memo(function ArtefactMenu() {
	const msg = useTranslation()
	// const isReadonly = useReadonly()
	const [display, setDisplay] = useState(true)
	const position = 'top-right'
	const [onlyMarkedContent, setonlyMarkedContent] = useState(true)

	const onHide = () => {
		setDisplay(false)
	}

	const header = <div className="artefact-menu-header">{msg('artefact-menu.header')}</div>

	function getArtefactMenuContent() {
		return (
			<div className="artefact-menu-content">
				<div className="artefact-menu-content-top">
					<InputSwitch
						checked={onlyMarkedContent}
						onChange={(e) => setonlyMarkedContent(e.value!)}
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
					{/*TODO: add artefacts to list*/}
					{msg('artefact-menu.no-artefacts')}
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
