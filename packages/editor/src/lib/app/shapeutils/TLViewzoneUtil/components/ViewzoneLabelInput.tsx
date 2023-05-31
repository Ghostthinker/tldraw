import { TLShapeId, TLViewzoneShape } from '@tldraw/tlschema'
import { forwardRef, useCallback } from 'react'
import { useApp } from '../../../../hooks/useApp'
import { defaultEmptyAs } from '../../../../utils/string'

export const ViewzoneLabelInput = forwardRef<
	HTMLInputElement,
	{ id: TLShapeId; name: string; isEditing: boolean }
>(({ id, name, isEditing }, ref) => {
	const app = useApp()

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === 'Enter') {
				// need to prevent the enter keydown making it's way up to the Idle state
				// and sending us back into edit mode
				e.stopPropagation()
				e.currentTarget.blur()
				app.setEditingId(null)
			}
		},
		[app]
	)

	const handleBlur = useCallback(
		(e: React.FocusEvent<HTMLInputElement>) => {
			const shape = app.getShapeById<TLViewzoneShape>(id)
			if (!shape) return

			const name = shape.props.name
			const value = e.currentTarget.value.trim()
			if (name === value) return

			app.updateShapes(
				[
					{
						id,
						type: 'viewzone',
						props: { name: value },
					},
				],
				true
			)
		},
		[id, app]
	)

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const shape = app.getShapeById<TLViewzoneShape>(id)
			if (!shape) return

			const name = shape.props.name
			const value = e.currentTarget.value
			if (name === value) return

			app.updateShapes(
				[
					{
						id,
						type: 'viewzone',
						props: { name: value },
					},
				],
				true
			)
		},
		[id, app]
	)

	return (
		<div className={`tl-viewzone-label ${isEditing ? 'tl-viewzone-label__editing' : ''}`}>
			<input
				className="tl-viewzone-name-input"
				ref={ref}
				style={{ display: isEditing ? undefined : 'none' }}
				value={name}
				autoFocus
				onKeyDown={handleKeyDown}
				onBlur={handleBlur}
				onChange={handleChange}
			/>
			{defaultEmptyAs(name, 'Viewzone') + String.fromCharCode(8203)}
		</div>
	)
})
