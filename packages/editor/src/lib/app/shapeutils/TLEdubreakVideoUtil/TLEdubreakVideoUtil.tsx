import { toDomPrecision } from '@tldraw/primitives'
import {
	TLEdubreakVideoShape,
	edubreakVideoShapeMigrations,
	edubreakVideoShapeTypeValidator,
} from '@tldraw/tlschema'
import { track } from 'signia-react'
import { defineShape } from '../../../config/TLShapeDefinition'
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
		image.setAttributeNS('http://www.w3.org/1999/xlink', 'href', shape.props.thumbnail)
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

const TLEdubreakVideoUtilComponent = track(function TLEdubreakVideoUtilComponent(props: {
	shape: TLEdubreakVideoShape
	edubreakVideoUtil: TLEdubreakVideoUtil
}) {
	// const { Spinner } = useEditorComponents()
	const { shape, edubreakVideoUtil } = props
	// const [isLoaded, setIsLoaded] = React.useState(false)
	// const showControls =
	// 	edubreakVideoUtil.app.getBounds(shape).w * edubreakVideoUtil.app.zoomLevel >= 110
	// const asset = shape.props.assetId ? edubreakVideoUtil.app.getAssetById(shape.props.assetId) : null
	// const { w, h, time, playing } = shape.props
	// const isEditing = useIsEditing(shape.id)
	// const prefersReducedMotion = usePrefersReducedMotion()
	//
	// const rVideo = React.useRef<HTMLVideoElement>(null!)

	// const handlePlay = React.useCallback<React.ReactEventHandler<HTMLVideoElement>>(
	// 	(e) => {
	// 		const video = e.currentTarget
	//
	// 		edubreakVideoUtil.app.updateShapes([
	// 			{
	// 				type: 'edubreakVideo',
	// 				id: shape.id,
	// 				props: {
	// 					playing: true,
	// 					time: video.currentTime,
	// 				},
	// 			},
	// 		])
	// 	},
	// 	[shape.id, edubreakVideoUtil.app]
	// )

	// const handlePause = React.useCallback<React.ReactEventHandler<HTMLVideoElement>>(
	// 	(e) => {
	// 		const video = e.currentTarget
	//
	// 		edubreakVideoUtil.app.updateShapes([
	// 			{
	// 				type: 'edubreakVideo',
	// 				id: shape.id,
	// 				props: {
	// 					playing: false,
	// 					time: video.currentTime,
	// 				},
	// 			},
	// 		])
	// 	},
	// 	[shape.id, edubreakVideoUtil.app]
	// )

	// const handleSetCurrentTime = React.useCallback<React.ReactEventHandler<HTMLVideoElement>>(
	// 	(e) => {
	// 		const video = e.currentTarget
	//
	// 		if (isEditing) {
	// 			edubreakVideoUtil.app.updateShapes([
	// 				{
	// 					type: 'edubreakVideo',
	// 					id: shape.id,
	// 					props: {
	// 						time: video.currentTime,
	// 					},
	// 				},
	// 			])
	// 		}
	// 	},
	// 	[isEditing, shape.id, edubreakVideoUtil.app]
	// )

	// const handleLoadedData = React.useCallback<React.ReactEventHandler<HTMLVideoElement>>(
	// 	(e) => {
	// 		const video = e.currentTarget
	// 		if (time !== video.currentTime) {
	// 			video.currentTime = time
	// 		}
	//
	// 		if (!playing) {
	// 			video.pause()
	// 		}
	//
	// 		setIsLoaded(true)
	// 	},
	// 	[playing, time]
	// )

	// If the current time changes and we're not editing the edubreakVideo, update the edubreakVideo time
	// React.useEffect(() => {
	// 	const video = rVideo.current
	//
	// 	if (!video) return
	//
	// 	if (isLoaded && !isEditing && time !== video.currentTime) {
	// 		video.currentTime = time
	// 	}
	// }, [isEditing, isLoaded, time])
	//
	// React.useEffect(() => {
	// 	if (prefersReducedMotion) {
	// 		const video = rVideo.current
	// 		video.pause()
	// 		video.currentTime = 0
	// 	}
	// }, [rVideo, prefersReducedMotion])

	return (
		<>
			<div className="edubreak-video-wrapper">
				<img
					width={shape.props.w}
					height={shape.props.h - 400}
					src={shape.props.thumbnail}
					alt={'Thumbnail'}
					draggable={false}
				/>
				<div className="edubreak-text">
					<div>{shape.props.title}</div>
					{'url' in shape.props && shape.props.url && (
						<HyperlinkButton url={shape.props.url} zoomLevel={edubreakVideoUtil.app.zoomLevel} />
					)}
				</div>
			</div>
		</>
	)
})
