import { toDomPrecision } from '@tldraw/primitives'
import {
	TLEdubreakContentShape,
	edubreakContentShapeMigrations,
	edubreakContentShapeTypeValidator,
} from '@tldraw/tlschema'
import _uniqueId from 'lodash/uniqueId'
import { Chip } from 'primereact/chip'
import { ReactChild, useEffect, useState } from 'react'
import { track } from 'signia-react'
import { Icon } from '../../../components/primitives/Icon'
import { defineShape } from '../../../config/TLShapeDefinition'
import { TLBoxUtil } from '../TLBoxUtil'

/** @public */
export class TLEdubreakContentUtil extends TLBoxUtil<TLEdubreakContentShape> {
	static type = 'edubreakContent'

	override canEdit = () => true
	override canScroll = () => true
	override isAspectRatioLocked = () => true
	override hideResizeHandles = () => true

	override defaultProps(): TLEdubreakContentShape['props'] {
		return {
			id: 0,
			type: '',
			title: '',
			name: '',
			date: '',
			assignment: '',
			tags: [],
			opacity: '1',
			w: 425,
			h: 150,
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
	const { shape } = props
	const [tags, setTags] = useState<ReactChild[]>([])

	useEffect(() => {
		if (shape.props.tags) {
			const tagElements = []
			if (shape.props.tags.length > 0) {
				for (const tag of shape.props.tags) {
					tagElements.push(
						<Chip className="edubreak-content-tag" key={_uniqueId('tag-')} label={tag} />
					)
				}
				setTags(tagElements)
			}
		}
	}, [])

	function getTags() {
		return tags
	}

	function openContentDetails() {
		alert('expand')
	}

	return (
		<>
			<div className="edubreak-content">
				<div onClick={() => openContentDetails()} className="edubreak-content-card-detail-icon">
					{shape.props.type === 'cmap' && <Icon icon="expand-content" />}
					{shape.props.type === 'extern' && <Icon icon="external-link" />}
				</div>
				<div className="icon-container">
					{shape.props.type === 'cmap' && (
						<Icon className="edubreak-content-icon-document" icon="file" />
					)}
					{shape.props.type === 'external-link' && (
						<Icon className="edubreak-content-icon-external-link" icon="external-link" />
					)}
				</div>
				<div className="edubreak-content-text-wrapper">
					<div className="edubreak-content-text-title">{shape.props.title}</div>
					<div className="edubreak-content-text-subtitle">
						{shape.props.name} | {shape.props.date}
					</div>
					<Chip
						className="edubreak-content-assignment"
						key={_uniqueId('content-assignment-')}
						label={shape.props.assignment ? shape.props.assignment : '-'}
						icon={
							<Icon
								className="edubreak-content-assignment-icon"
								key={_uniqueId('content-assignment-icon-')}
								icon={'assignment'}
							/>
						}
					/>
					<div className="edubreak-content-tags">{tags.length > 0 ? getTags() : undefined}</div>
				</div>
			</div>
		</>
	)
})
