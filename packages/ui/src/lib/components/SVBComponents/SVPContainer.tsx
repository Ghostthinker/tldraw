import { Dialog } from 'primereact/dialog'
import { memo, useState } from 'react'
import { useTranslation } from '../../hooks/useTranslation/useTranslation'

/** @public */
interface SVPContainerProps {
	options: any
}

export const SVPContainer = memo(function SVPContainer(props: SVPContainerProps) {
	const msg = useTranslation()
	const [loading, setLoading] = useState(true)
	const [display, setDisplay] = useState(true)
	const position = 'center'

	const onHide = () => {
		setDisplay(false)
		const onCloseExpandedMedia = new CustomEvent('onCloseExpandedMedia')
		window.dispatchEvent(onCloseExpandedMedia)
	}

	function getSVPContainerContent() {
		return (
			<div className="svp-container-content">
				<iframe className="svp-container-iframe" src={props.options.svpURL} allowFullScreen />
			</div>
		)
	}

	return (
		<Dialog
			position={position}
			visible={display}
			onHide={() => onHide()}
			className="svp-container"
			draggable={false}
			modal={true}
		>
			{getSVPContainerContent()}
		</Dialog>
	)
})
