import { canolicalizeRotation, SelectionEdge, toDomPrecision } from '@tldraw/primitives'
import {
	TLShape,
	TLShapeId,
	TLShapeType,
	TLViewzoneShape,
	viewzoneShapeMigrations,
	viewzoneShapeTypeValidator,
} from '@tldraw/tlschema'
import { SVGContainer } from '../../../components/SVGContainer'
import { defineShape } from '../../../config/TLShapeDefinition'
import { defaultEmptyAs } from '../../../utils/string'
import { TLExportColors } from '../shared/TLExportColors'
import { TLBoxUtil } from '../TLBoxUtil'
import { OnResizeEndHandler } from '../TLShapeUtil'
import { ViewzoneHeading } from './components/ViewzoneHeading'

/** @public */
export class TLViewzoneUtil extends TLBoxUtil<TLViewzoneShape> {
	static type = 'frame'

	override canBind = () => true

	override canEdit = () => true

	override defaultProps(): TLViewzoneShape['props'] {
		return { opacity: '0.5', w: 160 * 2, h: 90 * 2, name: '' }
	}

	override render(shape: TLViewzoneShape) {
		const bounds = this.bounds(shape)

		return (
			<>
				<SVGContainer>
					<rect className="tl-hitarea-stroke" width={bounds.width} height={bounds.height} />
					<rect
						className="tl-viewzone__body"
						width={bounds.width}
						height={bounds.height}
						fill="none"
					/>
				</SVGContainer>
				<ViewzoneHeading
					id={shape.id}
					name={shape.props.name}
					width={bounds.width}
					height={bounds.height}
				/>
			</>
		)
	}

	override toSvg(
		shape: TLViewzoneShape,
		font: string,
		colors: TLExportColors
	): SVGElement | Promise<SVGElement> {
		const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')

		const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
		rect.setAttribute('width', shape.props.w.toString())
		rect.setAttribute('height', shape.props.h.toString())
		rect.setAttribute('fill', colors.solid)
		rect.setAttribute('opacity', shape.props.opacity)
		rect.setAttribute('stroke', colors.fill.black)
		rect.setAttribute('stroke-width', '1')
		rect.setAttribute('rx', '1')
		rect.setAttribute('ry', '1')
		g.appendChild(rect)

		// Text label
		const pageRotation = canolicalizeRotation(this.app.getPageRotationById(shape.id))
		// rotate right 45 deg
		const offsetRotation = pageRotation + Math.PI / 4
		const scaledRotation = (offsetRotation * (2 / Math.PI) + 4) % 4
		const labelSide: SelectionEdge = (['top', 'left', 'bottom', 'right'] as const)[
			Math.floor(scaledRotation)
		]

		let labelTranslate: string
		switch (labelSide) {
			case 'top':
				labelTranslate = ``
				break
			case 'right':
				labelTranslate = `translate(${toDomPrecision(shape.props.w)}px, 0px) rotate(90deg)`
				break
			case 'bottom':
				labelTranslate = `translate(${toDomPrecision(shape.props.w)}px, ${toDomPrecision(
					shape.props.h
				)}px) rotate(180deg)`
				break
			case 'left':
				labelTranslate = `translate(0px, ${toDomPrecision(shape.props.h)}px) rotate(270deg)`
				break
			default:
				labelTranslate = ``
		}

		// Truncate with ellipsis
		const opts = {
			fontSize: 12,
			fontFamily: 'Inter, sans-serif',
			textAlign: 'start' as const,
			width: shape.props.w + 16,
			height: 30,
			padding: 8,
			lineHeight: 1,
			fontStyle: 'normal',
			fontWeight: 'normal',
		}

		let textContent = defaultEmptyAs(shape.props.name, 'Viewzone') + String.fromCharCode(8203)

		const lines = this.app.textMeasure.getTextLines({
			text: textContent,
			wrap: true,
			...opts,
		})

		textContent = lines.length > 1 ? lines[0] + '…' : lines[0]

		const size = this.app.textMeasure.measureText({
			fontSize: 12,
			fontFamily: 'Inter, sans-serif',
			lineHeight: 1,
			fontStyle: 'normal',
			fontWeight: 'normal',
			text: textContent,
			width: 'fit-content',
			maxWidth: 'unset',
			padding: '0px',
		})

		const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
		text.setAttribute('x', '0')
		text.setAttribute('y', -(8 + size.h / 2) + 'px')
		text.setAttribute('font-family', '"Inter", sans-serif')
		text.setAttribute('font-size', '12px')
		text.setAttribute('font-weight', '400')
		text.style.setProperty('transform', labelTranslate)
		text.textContent = textContent

		const textBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
		textBg.setAttribute('x', ' -4px')
		textBg.setAttribute('y', -(16 + size.h) + 'px')
		textBg.setAttribute('width', size.w + 8 + 'px')
		textBg.setAttribute('height', size.h + 8 + 'px')
		textBg.setAttribute('rx', 4 + 'px')
		textBg.setAttribute('ry', 4 + 'px')
		textBg.setAttribute('fill', colors.background)

		g.appendChild(textBg)
		g.appendChild(text)

		return g
	}

	indicator(shape: TLViewzoneShape) {
		const bounds = this.bounds(shape)

		return (
			<rect
				width={toDomPrecision(bounds.width)}
				height={toDomPrecision(bounds.height)}
				className={`tl-viewzone-indicator`}
			/>
		)
	}

	override canReceiveNewChildrenOfType = (_type: TLShapeType) => {
		return true
	}

	override canDropShapes = (_shape: TLViewzoneShape, _shapes: TLShape[]): boolean => {
		return true
	}

	override onDragShapesOver = (
		viewzone: TLViewzoneShape,
		shapes: TLShape[]
	): { shouldHint: boolean } => {
		if (!shapes.every((child) => child.parentId === viewzone.id)) {
			this.app.reparentShapesById(
				shapes.map((shape) => shape.id),
				viewzone.id
			)
			return { shouldHint: true }
		}
		return { shouldHint: false }
	}

	onDragShapesOut = (_shape: TLViewzoneShape, shapes: TLShape[]): void => {
		const parentId = this.app.getShapeById(_shape.parentId)
		const isInGroup = parentId?.type === 'group'

		// If viewzone is in a group, keep the shape
		// moved out in that group
		if (isInGroup) {
			this.app.reparentShapesById(
				shapes.map((shape) => shape.id),
				parentId.id
			)
		} else {
			this.app.reparentShapesById(
				shapes.map((shape) => shape.id),
				this.app.currentPageId
			)
		}
	}

	override onResizeEnd: OnResizeEndHandler<TLViewzoneShape> = (shape) => {
		const bounds = this.app.getPageBounds(shape)!
		const children = this.app.getSortedChildIds(shape.id)

		const shapesToReparent: TLShapeId[] = []

		for (const childId of children) {
			const childBounds = this.app.getPageBoundsById(childId)!
			if (!bounds.includes(childBounds)) {
				shapesToReparent.push(childId)
			}
		}

		if (shapesToReparent.length > 0) {
			this.app.reparentShapesById(shapesToReparent, this.app.currentPageId)
		}
	}
}

/** @public */
export const TLViewzoneShapeDef = defineShape<TLViewzoneShape, TLViewzoneUtil>({
	type: 'viewzone',
	getShapeUtil: () => TLViewzoneUtil,
	validator: viewzoneShapeTypeValidator,
	migrations: viewzoneShapeMigrations,
})
