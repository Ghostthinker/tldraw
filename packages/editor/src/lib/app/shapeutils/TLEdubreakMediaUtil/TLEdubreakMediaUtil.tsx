import { toDomPrecision } from '@tldraw/primitives'
import {
	TLEdubreakMediaShape,
	edubreakMediaShapeMigrations,
	edubreakMediaShapeTypeValidator,
} from '@tldraw/tlschema'
import { Card } from 'primereact/card'
import { useEffect } from 'react'
import { track } from 'signia-react'
import { Icon } from '../../../components/primitives/Icon'
import { defineShape } from '../../../config/TLShapeDefinition'
import { usePrefersReducedMotion } from '../../../utils/dom'
import { TLBoxUtil } from '../TLBoxUtil'
import { AssignmentChip } from '../shared/AssignmentChip'
import { TagList } from '../shared/TagList'

/** @public */
export class TLEdubreakMediaUtil extends TLBoxUtil<TLEdubreakMediaShape> {
	static type = 'edubreakMedia'

	override canEdit = () => true
	override isAspectRatioLocked = () => true
	override hideResizeHandles = () => true

	override defaultProps(): TLEdubreakMediaShape['props'] {
		return {
			id: 0,
			title: '',
			body: '',
			thumbnail: '',
			opacity: '1',
			name: '',
			date: '',
			assignment: '',
			tags: [],
			w: 425,
			h: 450,
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
	const { shape, edubreakMediaUtil } = props
	//TODO: implement
	// const showControls =
	// 	edubreakMediaUtil.app.getBounds(shape).w * edubreakMediaUtil.app.zoomLevel >= 110

	const asset = shape.props.assetId ? edubreakMediaUtil.app.getAssetById(shape.props.assetId) : null
	const { w, h, time, playing } = shape.props
	const prefersReducedMotion = usePrefersReducedMotion()

	useEffect(() => {
		document.documentElement.style.setProperty(`--media-height`, `${h}px`)
	}, [])
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

	function openMediaDetails() {
		alert('expand')
	}

	function header() {
		if (shape.props.thumbnail) {
			return (
				<div className="edubreak-media-thumbnail-container">
					<img className="edubreak-media-thumbnail" src={shape.props.thumbnail} />
					<div className="edubreak-media-overlay">
						{shape.props.type === 'video' && <Icon className="edubreak-media-icon" icon="video" />}
						{shape.props.type === 'videocomment' && (
							<Icon className="edubreak-media-icon" icon="comments" />
						)}
					</div>
				</div>
			)
		} else {
			return (
				<div className="edubreak-media-thumbnail-container">
					<img
						className="edubreak-media-thumbnail"
						src="packages/editor/src/lib/app/shapeutils/TLEdubreakMediaUtil/assets/blog_dummy_picture.jpg"
					/>
					<div className="edubreak-media-overlay">
						<Icon className="edubreak-media-icon" icon="blog" />
					</div>
				</div>
			)
		}
	}

	function subTitle() {
		return (
			<>
				<div className="edubreak-media-details">
					<div className="edubreak-media-subtitle text-overflow">
						{shape.props.name} | {shape.props.date}
					</div>
					<AssignmentChip className="edubreak-media-assignment" shape={shape}></AssignmentChip>
				</div>
			</>
		)
	}

	function footer() {
		return (
			<>
				<TagList className="edubreak-media-tags" edubreakTags={shape.props.tags} />
			</>
		)
	}

	return (
		<>
			<div className="edubreak-media">
				<div onClick={() => openMediaDetails()} className="edubreak-content-card-detail-icon">
					<Icon icon="expand-content" />
				</div>
				<Card
					title={shape.props.title}
					subTitle={subTitle}
					header={header}
					footer={footer}
					className="md:w-25rem"
				>
					{shape.props.body && <p>{shape.props.body}</p>}
				</Card>
			</div>
		</>
	)
})
