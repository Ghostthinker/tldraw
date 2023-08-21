import { Box2d, toDomPrecision, Vec2d } from '@tldraw/primitives'
import {
	edubreakMediaShapeMigrations,
	edubreakMediaShapeTypeValidator,
	TLEdubreakMediaShape,
} from '@tldraw/tlschema'
import { Card } from 'primereact/card'
import * as React from 'react'
import { useEffect } from 'react'
import { track } from 'signia-react'
import { Icon } from '../../../components/primitives/Icon'
import { defineShape } from '../../../config/TLShapeDefinition'
import { AssignmentChip } from '../shared/AssignmentChip'
import { TagList } from '../shared/TagList'
import { TLShapeUtil } from '../TLShapeUtil'
import { BlogPicture } from './assets/BlogPicture'

const MEDIA_SIZE = 425

/** @public */
export class TLEdubreakMediaUtil extends TLShapeUtil<TLEdubreakMediaShape> {
	static type = 'edubreakMedia'

	override canEdit = () => false
	override isAspectRatioLocked = () => true
	override hideResizeHandles = () => true
	override hideSelectionBoundsFg = () => true
	override hideSelectionBoundsBg = () => true

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
			playing: false,
			url: '',
		}
	}

	getHeight(shape: TLEdubreakMediaShape) {
		let height = shape.props.h
		if (shape.props.tags.length > 0) {
			height = height + 25
		}
		if (shape.props.body) {
			height = height + 70
		}
		return height
	}

	getBounds(shape: TLEdubreakMediaShape) {
		const height = this.getHeight(shape)
		return new Box2d(0, 0, MEDIA_SIZE, height)
	}

	getOutline(shape: TLEdubreakMediaShape) {
		return this.bounds(shape).corners
	}

	getCenter(_shape: TLEdubreakMediaShape) {
		return new Vec2d(MEDIA_SIZE / 2, this.getHeight(_shape) / 2)
	}

	render(shape: TLEdubreakMediaShape) {
		return (
			<div
				style={{
					position: 'absolute',
					width: MEDIA_SIZE,
					height: this.getHeight(shape),
				}}
			>
				<TLEdubreakMediaUtilComponent shape={shape} edubreakMediaUtil={this} />
			</div>
		)
	}

	indicator(shape: TLEdubreakMediaShape) {
		return (
			<rect width={toDomPrecision(MEDIA_SIZE)} height={toDomPrecision(this.getHeight(shape))} />
		)
	}

	toSvg(shape: TLEdubreakMediaShape) {
		const bounds = this.bounds(shape)

		const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
		const image = document.createElementNS('http://www.w3.org/2000/svg', 'image')
		image.setAttributeNS('http://www.w3.org/1999/xlink', 'href', shape.props.thumbnail)
		image.setAttribute('width', MEDIA_SIZE.toString())
		image.setAttribute('height', bounds.height.toString())
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
	const showVideoElement =
		edubreakMediaUtil.app.zoomLevel * 100 >= 110 &&
		edubreakMediaUtil.app.isShapeInViewport(shape.id)

	const rVideo = React.useRef<HTMLVideoElement>(null!)
	const [showVideoControls, setShowVideoControls] = React.useState(false)

	useEffect(() => {
		// TODO: 16.08.2023 - MK: workaround for click handling of buttons inside shapes. Think of a better solution later ¯\_(ツ)_/¯
		window.addEventListener('onCardButtonClick', async (e) => {
			// @ts-ignoree
			if (e.detail === 'mediaDetails-' + shape.id) {
				openMediaDetails()
			}
			// @ts-ignore
			if (e.detail === 'playButton-' + shape.id) {
				await rVideo.current.play()
			}
		})
	}, [])

	useEffect(() => {
		// reset video element -> playing = false and time = 0
		if (!showVideoElement) {
			setShowVideoControls(false)
			edubreakMediaUtil.app.updateShapes([
				{
					type: 'edubreakMedia',
					id: shape.id,
					props: {
						playing: false,
						time: 0,
					},
				},
			])
		}
	}, [showVideoElement])

	const handlePause = React.useCallback<React.ReactEventHandler<HTMLMediaElement>>(
		(e) => {
			const media = e.currentTarget

			edubreakMediaUtil.app.updateShapes([
				{
					type: 'edubreakMedia',
					id: shape.id,
					props: {
						playing: false,
						time: media.currentTime,
					},
				},
			])
		},
		[shape.id, edubreakMediaUtil.app]
	)

	async function handlePlay() {
		await rVideo.current.play()
		setShowVideoControls(true)
		edubreakMediaUtil.app.updateShapes([
			{
				type: 'edubreakMedia',
				id: shape.id,
				props: {
					playing: true,
					time: rVideo.current.currentTime,
				},
			},
		])
	}

	function openMediaDetails() {
		alert('expand Media')
	}

	function header() {
		if (shape.props.thumbnail) {
			return (
				<div className="edubreak-media-thumbnail-container">
					{!showVideoElement ? (
						<>
							<img className="edubreak-media-thumbnail" src={shape.props.thumbnail} />
							<div className="edubreak-media-overlay">
								{shape.props.type === 'video' && (
									<Icon className="edubreak-media-icon" icon="video" />
								)}
								{shape.props.type === 'videocomment' && (
									<Icon className="edubreak-media-icon" icon="comments" />
								)}
							</div>
						</>
					) : (
						<>
							<video
								ref={rVideo}
								id={'video-' + shape.id}
								onPause={handlePause}
								onPlay={handlePlay}
								className="edubreak-media-video"
								controls={showVideoControls}
							>
								<source src="http://media.w3.org/2010/05/sintel/trailer.mp4" />
							</video>
							{!shape.props.playing && !showVideoControls && (
								<div
									onClick={handlePlay}
									className="edubreak-media-video-overlay"
									aria-details={'playButton-' + shape.id}
								>
									<Icon className="edubreak-media-video-icon" icon="playhead" />
								</div>
							)}
						</>
					)}
				</div>
			)
		} else {
			return (
				<div className="edubreak-media-thumbnail-container">
					<BlogPicture className="edubreak-media-thumbnail" />
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
				<div className="edubreak-media-card-detail-icon" aria-details={'mediaDetails-' + shape.id}>
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
