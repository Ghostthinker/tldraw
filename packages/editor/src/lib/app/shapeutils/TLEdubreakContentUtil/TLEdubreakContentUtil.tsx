import { toDomPrecision } from '@tldraw/primitives'
import {
	TLEdubreakContentShape,
	edubreakContentShapeMigrations,
	edubreakContentShapeTypeValidator,
} from '@tldraw/tlschema'
import { track } from 'signia-react'
import { defineShape } from '../../../config/TLShapeDefinition'
import { TLBoxUtil } from '../TLBoxUtil'
import { HyperlinkButton } from '../shared/HyperlinkButton'

/** @public */
export class TLEdubreakContentUtil extends TLBoxUtil<TLEdubreakContentShape> {
	static type = 'edubreakContent'

	override canEdit = () => true
	override isAspectRatioLocked = () => true

	override defaultProps(): TLEdubreakContentShape['props'] {
		return {
			id: 0,
			title: '',
			body: '',
			opacity: '1',
			w: 100,
			h: 100,
			type: '',
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
		// image.setAttributeNS('http://www.w3.org/1999/xlink', 'href', shape.props.thumbnail)
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

const TLEdubreakContentUtilComponent = track(function TLEdubreakContentUtilComponent(props: {
	shape: TLEdubreakContentShape
	edubreakContentUtil: TLEdubreakContentUtil
}) {
	// const { Spinner } = useEditorComponents()
	const { shape, edubreakContentUtil } = props
	// const [isLoaded, setIsLoaded] = React.useState(false)
	// const showControls =
	// 	edubreakContentUtil.app.getBounds(shape).w * edubreakContentUtil.app.zoomLevel >= 110
	// const asset = shape.props.assetId ? edubreakContentUtil.app.getAssetById(shape.props.assetId) : null
	// const { w, h, time, playing } = shape.props
	// const isEditing = useIsEditing(shape.id)
	// const prefersReducedMotion = usePrefersReducedMotion()
	//
	// const rVideo = React.useRef<HTMLVideoElement>(null!)

	// const handlePlay = React.useCallback<React.ReactEventHandler<HTMLVideoElement>>(
	// 	(e) => {
	// 		const video = e.currentTarget
	//
	// 		edubreakContentUtil.app.updateShapes([
	// 			{
	// 				type: 'edubreakContent',
	// 				id: shape.id,
	// 				props: {
	// 					playing: true,
	// 					time: video.currentTime,
	// 				},
	// 			},
	// 		])
	// 	},
	// 	[shape.id, edubreakContentUtil.app]
	// )

	// const handlePause = React.useCallback<React.ReactEventHandler<HTMLVideoElement>>(
	// 	(e) => {
	// 		const video = e.currentTarget
	//
	// 		edubreakContentUtil.app.updateShapes([
	// 			{
	// 				type: 'edubreakContent',
	// 				id: shape.id,
	// 				props: {
	// 					playing: false,
	// 					time: video.currentTime,
	// 				},
	// 			},
	// 		])
	// 	},
	// 	[shape.id, edubreakContentUtil.app]
	// )

	// const handleSetCurrentTime = React.useCallback<React.ReactEventHandler<HTMLVideoElement>>(
	// 	(e) => {
	// 		const video = e.currentTarget
	//
	// 		if (isEditing) {
	// 			edubreakContentUtil.app.updateShapes([
	// 				{
	// 					type: 'edubreakContent',
	// 					id: shape.id,
	// 					props: {
	// 						time: video.currentTime,
	// 					},
	// 				},
	// 			])
	// 		}
	// 	},
	// 	[isEditing, shape.id, edubreakContentUtil.app]
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

	// If the current time changes and we're not editing the edubreakContent, update the edubreakContent time
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
			<div className="edubreak-content-wrapper">
				<div className="edubreak-content-text-title">{shape.props.title}</div>
				<div className="edubreak-content-text">
					<div dangerouslySetInnerHTML={{ __html: shape.props.body }}></div>
					{'url' in shape.props && shape.props.url && (
						<HyperlinkButton url={shape.props.url} zoomLevel={edubreakContentUtil.app.zoomLevel} />
					)}
				</div>
			</div>
		</>
	)
})
