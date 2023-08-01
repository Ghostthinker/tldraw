import { toDomPrecision } from '@tldraw/primitives'
import {
	TLEdubreakMediaShape,
	edubreakMediaShapeMigrations,
	edubreakMediaShapeTypeValidator,
} from '@tldraw/tlschema'
import { track } from 'signia-react'
import { defineShape } from '../../../config/TLShapeDefinition'
import { TLBoxUtil } from '../TLBoxUtil'
import { HyperlinkButton } from '../shared/HyperlinkButton'

/** @public */
export class TLEdubreakMediaUtil extends TLBoxUtil<TLEdubreakMediaShape> {
	static type = 'edubreakMedia'

	override canEdit = () => true
	override isAspectRatioLocked = () => true

	override defaultProps(): TLEdubreakMediaShape['props'] {
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

	render(shape: TLEdubreakMediaShape) {
		return <TLEdubreakMediaUtilComponent shape={shape} edubreakMediaUtil={this} />
	}

	indicator(shape: TLEdubreakMediaShape) {
		return <rect width={toDomPrecision(shape.props.w)} height={toDomPrecision(shape.props.h)} />
	}

	toSvg(shape: TLEdubreakMediaShape) {
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
export const TLEdubreakMediaShapeDef = defineShape<TLEdubreakMediaShape, TLEdubreakMediaUtil>({
	type: 'edubreakMedia',
	getShapeUtil: () => TLEdubreakMediaUtil,
	validator: edubreakMediaShapeTypeValidator,
	migrations: edubreakMediaShapeMigrations,
})

const TLEdubreakMediaUtilComponent = track(function TLEdubreakMediaUtilComponent(props: {
	shape: TLEdubreakMediaShape
	edubreakMediaUtil: TLEdubreakMediaUtil
}) {
	// const { Spinner } = useEditorComponents()
	const { shape, edubreakMediaUtil } = props
	// const [isLoaded, setIsLoaded] = React.useState(false)
	// const showControls =
	// 	edubreakMediaUtil.app.getBounds(shape).w * edubreakMediaUtil.app.zoomLevel >= 110
	// const asset = shape.props.assetId ? edubreakMediaUtil.app.getAssetById(shape.props.assetId) : null
	// const { w, h, time, playing } = shape.props
	// const isEditing = useIsEditing(shape.id)
	// const prefersReducedMotion = usePrefersReducedMotion()
	//
	// const rMedia = React.useRef<HTMLMediaElement>(null!)

	// const handlePlay = React.useCallback<React.ReactEventHandler<HTMLMediaElement>>(
	// 	(e) => {
	// 		const media = e.currentTarget
	//
	// 		edubreakMediaUtil.app.updateShapes([
	// 			{
	// 				type: 'edubreakMedia',
	// 				id: shape.id,
	// 				props: {
	// 					playing: true,
	// 					time: media.currentTime,
	// 				},
	// 			},
	// 		])
	// 	},
	// 	[shape.id, edubreakMediaUtil.app]
	// )

	// const handlePause = React.useCallback<React.ReactEventHandler<HTMLMediaElement>>(
	// 	(e) => {
	// 		const media = e.currentTarget
	//
	// 		edubreakMediaUtil.app.updateShapes([
	// 			{
	// 				type: 'edubreakMedia',
	// 				id: shape.id,
	// 				props: {
	// 					playing: false,
	// 					time: media.currentTime,
	// 				},
	// 			},
	// 		])
	// 	},
	// 	[shape.id, edubreakMediaUtil.app]
	// )

	// const handleSetCurrentTime = React.useCallback<React.ReactEventHandler<HTMLMediaElement>>(
	// 	(e) => {
	// 		const media = e.currentTarget
	//
	// 		if (isEditing) {
	// 			edubreakMediaUtil.app.updateShapes([
	// 				{
	// 					type: 'edubreakMedia',
	// 					id: shape.id,
	// 					props: {
	// 						time: media.currentTime,
	// 					},
	// 				},
	// 			])
	// 		}
	// 	},
	// 	[isEditing, shape.id, edubreakMediaUtil.app]
	// )

	// const handleLoadedData = React.useCallback<React.ReactEventHandler<HTMLMediaElement>>(
	// 	(e) => {
	// 		const media = e.currentTarget
	// 		if (time !== media.currentTime) {
	// 			media.currentTime = time
	// 		}
	//
	// 		if (!playing) {
	// 			media.pause()
	// 		}
	//
	// 		setIsLoaded(true)
	// 	},
	// 	[playing, time]
	// )

	// If the current time changes and we're not editing the edubreakMedia, update the edubreakMedia time
	// React.useEffect(() => {
	// 	const media = rMedia.current
	//
	// 	if (!media) return
	//
	// 	if (isLoaded && !isEditing && time !== media.currentTime) {
	// 		media.currentTime = time
	// 	}
	// }, [isEditing, isLoaded, time])
	//
	// React.useEffect(() => {
	// 	if (prefersReducedMotion) {
	// 		const media = rMedia.current
	// 		media.pause()
	// 		media.currentTime = 0
	// 	}
	// }, [rMedia, prefersReducedMotion])

	return (
		<>
			<div className="edubreak-media-wrapper">
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
						<HyperlinkButton url={shape.props.url} zoomLevel={edubreakMediaUtil.app.zoomLevel} />
					)}
				</div>
			</div>
		</>
	)
})
