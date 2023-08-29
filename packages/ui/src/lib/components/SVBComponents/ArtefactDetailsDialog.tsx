import { Dialog } from 'primereact/dialog'
import { memo, useState } from 'react'
import { useTranslation } from '../../hooks/useTranslation/useTranslation'

export const ArtefactDetailsDialog = memo(function ArtefactDetailsDialog() {
	const msg = useTranslation()
	const [loading, setLoading] = useState(true)
	const [display, setDisplay] = useState(true)

	// TODO: 29.08.2023 - 12:34 - MK: Das ist die Basis-Komponente für SVB-31. Es wurde alle aufbereitet, sodass hier dann weitergearbeitet werden kann.

	const onHide = () => {
		setDisplay(false)
	}

	return (
		<Dialog
			modal={true}
			position={'center'}
			visible={display}
			onHide={() => onHide()}
			className="artefact-details-dialog"
		></Dialog>
	)
})
