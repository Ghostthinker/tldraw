import { toDomPrecision } from '@tldraw/primitives'
import {
	TLEdubreakContentShape,
	edubreakContentShapeMigrations,
	edubreakContentShapeTypeValidator,
} from '@tldraw/tlschema'
import * as React from 'react'
import { track } from 'signia-react'
import { HTMLContainer } from '../../../components/HTMLContainer'
import { defineShape } from '../../../config/TLShapeDefinition'
import { useEditorComponents } from '../../../hooks/useEditorComponents'
import { useIsEditing } from '../../../hooks/useIsEditing'
import { usePrefersReducedMotion } from '../../../utils/dom'
import { TLBoxUtil } from '../TLBoxUtil'
import { HyperlinkButton } from '../shared/HyperlinkButton'

/** @public */
export class TLEdubreakContentUtil extends TLBoxUtil<TLEdubreakContentShape> {
	static type = 'edubreakContent'

	override canEdit = () => true
	override isAspectRatioLocked = () => true

	override defaultProps(): TLEdubreakContentShape['props'] {
		return {
			title: '',
			body: '',
			opacity: '1',
			w: 100,
			h: 100,
			assetId: null,
			url: '',
		}
	}

	render(shape: TLEdubreakContentShape) {
		return <TLEdubreakContentUtilComponent shape={shape} edubreakContentUtil={this} />
	}

	indicator(shape: TLEdubreakContentShape) {
		return <rect width={toDomPrecision(shape.props.w)} height={toDomPrecision(shape.props.h)} />
	}

	toSvg(shape: TLEdubreakContentShape) {
		const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
		const image = document.createElementNS('http://www.w3.org/2000/svg', 'image')
		image.setAttributeNS('http://www.w3.org/1999/xlink', 'href', serializeEdubreakContent(shape.id))
		image.setAttribute('width', shape.props.w.toString())
		image.setAttribute('height', shape.props.h.toString())
		g.appendChild(image)

		return g
	}
}

/** @public */
export const TLEdubreakContentShapeDef = defineShape<TLEdubreakContentShape, TLEdubreakContentUtil>(
	{
		type: 'edubreakContent',
		getShapeUtil: () => TLEdubreakContentUtil,
		validator: edubreakContentShapeTypeValidator,
		migrations: edubreakContentShapeMigrations,
	}
)

// Function from v1, could be improved but explicitly using this.model.time (?)
function serializeEdubreakContent(id: string): string {
	const splitId = id.split(':')[1]
	const video = document.querySelector(`.tl-edubreak-content-shape-${splitId}`) as HTMLVideoElement
	if (video) {
		const canvas = document.createElement('canvas')
		canvas.width = video.videoWidth
		canvas.height = video.videoHeight
		canvas.getContext('2d')!.drawImage(video, 0, 0)
		return canvas.toDataURL('image/png')
	} else throw new Error('EdubreakContent with id ' + splitId + ' not found')
}

const TLEdubreakContentUtilComponent = track(function TLEdubreakContentUtilComponent(props: {
	shape: TLEdubreakContentShape
	edubreakContentUtil: TLEdubreakContentUtil
}) {
	const { Spinner } = useEditorComponents()
	const { shape, edubreakContentUtil } = props
	const showControls =
		edubreakContentUtil.app.getBounds(shape).w * edubreakContentUtil.app.zoomLevel >= 110
	const asset = shape.props.assetId
		? edubreakContentUtil.app.getAssetById(shape.props.assetId)
		: null
	const { w, h } = shape.props
	const isEditing = useIsEditing(shape.id)
	const prefersReducedMotion = usePrefersReducedMotion()

	const rVideo = React.useRef<HTMLVideoElement>(null!)

	const handlePlay = React.useCallback<React.ReactEventHandler<HTMLVideoElement>>(
		(e) => {
			const video = e.currentTarget

			edubreakContentUtil.app.updateShapes([
				{
					type: 'edubreakContent',
					id: shape.id,
					props: {
						playing: true,
						time: video.currentTime,
					},
				},
			])
		},
		[shape.id, edubreakContentUtil.app]
	)

	const handlePause = React.useCallback<React.ReactEventHandler<HTMLVideoElement>>(
		(e) => {
			const video = e.currentTarget

			edubreakContentUtil.app.updateShapes([
				{
					type: 'edubreakContent',
					id: shape.id,
					props: {
						playing: false,
						time: video.currentTime,
					},
				},
			])
		},
		[shape.id, edubreakContentUtil.app]
	)

	const handleSetCurrentTime = React.useCallback<React.ReactEventHandler<HTMLVideoElement>>(
		(e) => {
			const video = e.currentTarget

			if (isEditing) {
				edubreakContentUtil.app.updateShapes([
					{
						type: 'edubreakContent',
						id: shape.id,
						props: {
							time: video.currentTime,
						},
					},
				])
			}
		},
		[isEditing, shape.id, edubreakContentUtil.app]
	)

	const [isLoaded, setIsLoaded] = React.useState(false)

	const handleLoadedData = React.useCallback<React.ReactEventHandler<HTMLVideoElement>>(() => {
		setIsLoaded(true)
	}, [])

	React.useEffect(() => {
		if (prefersReducedMotion) {
			const video = rVideo.current
			video.pause()
			video.currentTime = 0
		}
	}, [rVideo, prefersReducedMotion])

	return (
		<>
			<HTMLContainer id={shape.id}>
				<div className="tl-counter-scaled">
					{asset?.props.src ? (
						<video
							ref={rVideo}
							className={`tl-edubreak-content tl-edubreak-content-shape-${
								shape.id.split(':')[1]
							} tl-hitarea-stroke`}
							width="100%"
							height="100%"
							draggable={false}
							playsInline
							autoPlay
							muted
							loop
							disableRemotePlayback
							disablePictureInPicture
							controls={isEditing && showControls}
							onPlay={handlePlay}
							onPause={handlePause}
							onTimeUpdate={handleSetCurrentTime}
							onLoadedData={handleLoadedData}
							hidden={!isLoaded}
						>
							<source src={asset.props.src} />
						</video>
					) : Spinner ? (
						<g transform={`translate(${(w - 38) / 2}, ${(h - 38) / 2})`}>
							<Spinner />
						</g>
					) : null}
				</div>
			</HTMLContainer>
			{'url' in shape.props && shape.props.url && (
				<HyperlinkButton url={shape.props.url} zoomLevel={edubreakContentUtil.app.zoomLevel} />
			)}
		</>
	)
})
