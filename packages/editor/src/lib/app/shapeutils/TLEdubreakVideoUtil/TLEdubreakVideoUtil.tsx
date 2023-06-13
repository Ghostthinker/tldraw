import { toDomPrecision } from '@tldraw/primitives'
import {
	TLEdubreakVideoShape,
	edubreakVideoShapeMigrations,
	edubreakVideoShapeTypeValidator,
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
export class TLEdubreakVideoUtil extends TLBoxUtil<TLEdubreakVideoShape> {
	static type = 'edubreakVideo'

	override canEdit = () => true
	override isAspectRatioLocked = () => true

	override defaultProps(): TLEdubreakVideoShape['props'] {
		return {
			id: 0,
			title: '',
			body: '',
			thumbnail: '',
			opacity: '1',
			w: 100,
			h: 100,
			type: '',
			assetId: null,
			time: 0,
			playing: true,
			url: '',
		}
	}

	render(shape: TLEdubreakVideoShape) {
		return <TLEdubreakVideoUtilComponent shape={shape} edubreakVideoUtil={this} />
	}

	indicator(shape: TLEdubreakVideoShape) {
		return <rect width={toDomPrecision(shape.props.w)} height={toDomPrecision(shape.props.h)} />
	}

	toSvg(shape: TLEdubreakVideoShape) {
		const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
		const image = document.createElementNS('http://www.w3.org/2000/svg', 'image')
		image.setAttributeNS('http://www.w3.org/1999/xlink', 'href', serializeEdubreakVideo(shape.id))
		image.setAttribute('width', shape.props.w.toString())
		image.setAttribute('height', shape.props.h.toString())
		g.appendChild(image)

		return g
	}
}

/** @public */
export const TLEdubreakVideoShapeDef = defineShape<TLEdubreakVideoShape, TLEdubreakVideoUtil>({
	type: 'edubreakVideo',
	getShapeUtil: () => TLEdubreakVideoUtil,
	validator: edubreakVideoShapeTypeValidator,
	migrations: edubreakVideoShapeMigrations,
})

// Function from v1, could be improved but explicitly using this.model.time (?)
function serializeEdubreakVideo(id: string): string {
	const splitId = id.split(':')[1]
	const video = document.querySelector(`.tl-edubreak-video-shape-${splitId}`) as HTMLVideoElement
	if (video) {
		const canvas = document.createElement('canvas')
		canvas.width = video.videoWidth
		canvas.height = video.videoHeight
		canvas.getContext('2d')!.drawImage(video, 0, 0)
		return canvas.toDataURL('image/png')
	} else throw new Error('EdubreakVideo with id ' + splitId + ' not found')
}

const TLEdubreakVideoUtilComponent = track(function TLEdubreakVideoUtilComponent(props: {
	shape: TLEdubreakVideoShape
	edubreakVideoUtil: TLEdubreakVideoUtil
}) {
	const { Spinner } = useEditorComponents()
	const { shape, edubreakVideoUtil } = props
	const showControls =
		edubreakVideoUtil.app.getBounds(shape).w * edubreakVideoUtil.app.zoomLevel >= 110
	const asset = shape.props.assetId ? edubreakVideoUtil.app.getAssetById(shape.props.assetId) : null
	const { w, h, time, playing } = shape.props
	const isEditing = useIsEditing(shape.id)
	const prefersReducedMotion = usePrefersReducedMotion()

	const rVideo = React.useRef<HTMLVideoElement>(null!)

	const handlePlay = React.useCallback<React.ReactEventHandler<HTMLVideoElement>>(
		(e) => {
			const video = e.currentTarget

			edubreakVideoUtil.app.updateShapes([
				{
					type: 'edubreakVideo',
					id: shape.id,
					props: {
						playing: true,
						time: video.currentTime,
					},
				},
			])
		},
		[shape.id, edubreakVideoUtil.app]
	)

	const handlePause = React.useCallback<React.ReactEventHandler<HTMLVideoElement>>(
		(e) => {
			const video = e.currentTarget

			edubreakVideoUtil.app.updateShapes([
				{
					type: 'edubreakVideo',
					id: shape.id,
					props: {
						playing: false,
						time: video.currentTime,
					},
				},
			])
		},
		[shape.id, edubreakVideoUtil.app]
	)

	const handleSetCurrentTime = React.useCallback<React.ReactEventHandler<HTMLVideoElement>>(
		(e) => {
			const video = e.currentTarget

			if (isEditing) {
				edubreakVideoUtil.app.updateShapes([
					{
						type: 'edubreakVideo',
						id: shape.id,
						props: {
							time: video.currentTime,
						},
					},
				])
			}
		},
		[isEditing, shape.id, edubreakVideoUtil.app]
	)

	const [isLoaded, setIsLoaded] = React.useState(false)

	const handleLoadedData = React.useCallback<React.ReactEventHandler<HTMLVideoElement>>(
		(e) => {
			const video = e.currentTarget
			if (time !== video.currentTime) {
				video.currentTime = time
			}

			if (!playing) {
				video.pause()
			}

			setIsLoaded(true)
		},
		[playing, time]
	)

	// If the current time changes and we're not editing the edubreakVideo, update the edubreakVideo time
	React.useEffect(() => {
		const video = rVideo.current

		if (!video) return

		if (isLoaded && !isEditing && time !== video.currentTime) {
			video.currentTime = time
		}
	}, [isEditing, isLoaded, time])

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
							className={`tl-edubreak-video tl-edubreak-video-shape-${
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
				<HyperlinkButton url={shape.props.url} zoomLevel={edubreakVideoUtil.app.zoomLevel} />
			)}
		</>
	)
})
