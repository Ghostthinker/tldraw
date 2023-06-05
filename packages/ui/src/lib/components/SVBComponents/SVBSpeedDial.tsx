import { SpeedDial } from 'primereact/speeddial'
import { Tooltip } from 'primereact/tooltip'
import { track } from 'signia-react'
import { useTranslation } from '../../hooks/useTranslation/useTranslation'

/** @public */
interface SVBSpeedDialProps {
	onAddFromEdubreak: () => void
}

export const SVBSpeedDial = track(function SVBSpeedDial(props: SVBSpeedDialProps) {
	const ADD_FROM_EDUBREAK = 'add_from_edubreak'
	const UPLOAD_CONTENT = 'upload_content'
	const CREATE_SCREEN_RECORDING = 'create_screen_recording'
	const IMPORT_MEDIA = 'import_media'
	const SHARE_BOARD = 'share_board'

	const msg = useTranslation()

	function handleSpeedDialClick(action: string) {
		// TODO: hier button actions einfuegen
		switch (action) {
			case ADD_FROM_EDUBREAK:
				props.onAddFromEdubreak()
				break
			case UPLOAD_CONTENT:
				console.log('upload')
				break
			case CREATE_SCREEN_RECORDING:
				console.log('screen recording')
				break
			case IMPORT_MEDIA:
				console.log('import')
				break
			case SHARE_BOARD:
				console.log('share')
				break
		}
	}

	const dialItems = [
		{
			label: msg('action-svb.add-from-edubreak'),
			icon: (
				<svg
					className="speeddial-action-icon"
					viewBox="-3 -3 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					\n' + '
					<path
						className={'eb-icon-out'}
						d="M12.2917 0.132217C12.8583 -0.182711 13.4974 0.0727725 13.5 0.815192V10.2112C13.5 11.1977 13.2602 11.6568 12.5012 12.1273L2.15188 17.8618C1.58263 18.1767 0.90269 17.9516 0.900055 17.2066V7.81063C0.897419 7.06821 1.06477 6.35615 1.89888 5.89451L12.2917 0.132217Z"
						fill="white"
					/>
					\n' + '
					<path
						className={'eb-icon-out'}
						d="M15.9696 2.76744L13.5 3.66986V10.8L16.0299 9.88642C16.6245 9.67321 17.1 9.30505 17.1 8.55138V3.4269C17.1 2.86165 16.563 2.55547 15.9684 2.76744"
						fill="white"
					/>
					\n' + '
					<path
						className={'eb-icon-in'}
						d="M13.5 3.60001L4.75137 6.59504C4.11007 6.81407 3.59455 7.42785 3.60008 7.96777V13.3313C3.60423 13.87 4.17641 14.1298 4.81771 13.9107L5.67875 13.6153V15.3L7.8749 12.864L13.4987 10.9373V3.60001H13.5Z"
						fill="#023047"
					/>
					\n' + '
				</svg>
			),
			command: () => {
				handleSpeedDialClick(ADD_FROM_EDUBREAK)
			},
		},
		{
			label: msg('action-svb.upload-content'),
			icon: (
				<svg
					className="speeddial-action-icon"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
				>
					<g id="cloud-upload">
						<path d="M17.5,18.25a.75.75,0,0,1,0-1.5c1.66,0,2.25-.83,2.25-3.18a3.57,3.57,0,0,0-3.25-3.25,3.34,3.34,0,0,0-1,.18.74.74,0,0,1-1-.49A5.25,5.25,0,0,0,4.25,11.57c0,3.44.76,5.18,2.25,5.18a.75.75,0,0,1,0,1.5C4,18.25,2.75,16,2.75,11.57a6.75,6.75,0,0,1,13-2.68,4.4,4.4,0,0,1,.8-.07,5.07,5.07,0,0,1,4.75,4.75C21.25,14.85,21.25,18.25,17.5,18.25Z" />
						<path d="M14.83,15.65a.77.77,0,0,1-.53-.22L12,13.13l-2.3,2.3a.75.75,0,0,1-1.06-1.06l2.83-2.83a.74.74,0,0,1,1.06,0l2.83,2.83a.75.75,0,0,1,0,1.06A.79.79,0,0,1,14.83,15.65Z" />
						<path d="M12,19.18a.75.75,0,0,1-.75-.75V12.07a.75.75,0,0,1,1.5,0v6.36A.75.75,0,0,1,12,19.18Z" />
					</g>
				</svg>
			),
			command: () => {
				handleSpeedDialClick(UPLOAD_CONTENT)
			},
		},
		{
			label: msg('action-svb.create-screen-recording'),
			icon: (
				<svg
					className="speeddial-action-icon"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
				>
					<g id="video">
						<path d="M13,18.75H6A2.75,2.75,0,0,1,3.25,16V8A2.75,2.75,0,0,1,6,5.25h7A2.75,2.75,0,0,1,15.75,8v8A2.75,2.75,0,0,1,13,18.75Zm-7-12A1.25,1.25,0,0,0,4.75,8v8A1.25,1.25,0,0,0,6,17.25h7A1.25,1.25,0,0,0,14.25,16V8A1.25,1.25,0,0,0,13,6.75Z" />
						<g id="_Path_" data-name="&lt;Path&gt;">
							<path d="M20,16.75a.79.79,0,0,1-.39-.11l-5-3a.75.75,0,0,1-.36-.64V11a.75.75,0,0,1,.36-.64l5-3a.74.74,0,0,1,.76,0,.75.75,0,0,1,.38.65v8a.75.75,0,0,1-.38.65A.71.71,0,0,1,20,16.75Zm-4.25-4.17,3.5,2.1V9.32l-3.5,2.1Z" />
						</g>
					</g>
				</svg>
			),
			command: () => {
				handleSpeedDialClick(CREATE_SCREEN_RECORDING)
			},
		},
		{
			label: msg('action-svb.import-media'),
			icon: (
				<svg
					className="speeddial-action-icon"
					id="file-import"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
				>
					<path d="M12.44,14.75H3.75c-.41,0-.75-.34-.75-.75s.34-.75,.75-.75H12.44l-1.72-1.72c-.29-.29-.29-.77,0-1.06s.77-.29,1.06,0l3,3c.07,.07,.12,.15,.16,.24,.08,.18,.08,.39,0,.57-.04,.09-.09,.17-.16,.24l-3,3c-.15,.15-.34,.22-.53,.22s-.38-.07-.53-.22c-.29-.29-.29-.77,0-1.06l1.72-1.72Zm8.56-5.25v8.5c0,1.52-1.23,2.75-2.75,2.75h-7.5c-1.52,0-2.75-1.23-2.75-2.75v-1c0-.41,.34-.75,.75-.75s.75,.34,.75,.75v1c0,.69,.56,1.25,1.25,1.25h7.5c.69,0,1.25-.56,1.25-1.25v-7.75h-4.75c-.41,0-.75-.34-.75-.75V4.75h-3.25c-.69,0-1.25,.56-1.25,1.25v5c0,.41-.34,.75-.75,.75s-.75-.34-.75-.75V6c0-1.52,1.23-2.75,2.75-2.75h4c.2,0,.39,.08,.53,.22l5.5,5.5c.14,.14,.22,.33,.22,.53Zm-5.5-.75h2.94l-2.94-2.94v2.94Z" />
				</svg>
			),
			command: () => {
				handleSpeedDialClick(IMPORT_MEDIA)
			},
		},
		{
			label: msg('action-svb.share-board'),
			icon: (
				<svg
					className="speeddial-action-icon"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
				>
					<g id="share-alt">
						<path d="M17.5,14.25a3.24,3.24,0,0,0-2.62,1.35L9.59,13a3.39,3.39,0,0,0,.16-1,3.39,3.39,0,0,0-.16-1L14.88,8.4a3.23,3.23,0,1,0-.63-1.9A2.94,2.94,0,0,0,14.3,7L8.83,9.75a3.19,3.19,0,0,0-2.33-1,3.25,3.25,0,0,0,0,6.5,3.19,3.19,0,0,0,2.33-1L14.3,17a2.94,2.94,0,0,0-.05.51,3.25,3.25,0,1,0,3.25-3.25Zm0-9.5A1.75,1.75,0,1,1,15.75,6.5,1.76,1.76,0,0,1,17.5,4.75Zm-11,9A1.75,1.75,0,1,1,8.25,12,1.76,1.76,0,0,1,6.5,13.75Zm11,5.5a1.75,1.75,0,1,1,1.75-1.75A1.76,1.76,0,0,1,17.5,19.25Z" />
					</g>
				</svg>
			),
			command: () => {
				handleSpeedDialClick(SHARE_BOARD)
			},
		},
	]
	return (
		<>
			<Tooltip target=".speeddial-bottom-right .p-speeddial-action" position="left" />
			<SpeedDial
				model={dialItems}
				direction="up"
				className="speeddial-bottom-right right-0 bottom-0"
			/>
		</>
	)
})
