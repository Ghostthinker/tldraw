import { defineMigrations } from '@tldraw/tlstore'
import { T } from '@tldraw/tlvalidate'
import { TLAssetId } from '../records/TLAsset'
import { TLOpacityType } from '../style-types'
import { assetIdValidator, opacityValidator } from '../validation'
import { TLBaseShape, createShapeValidator } from './shape-validation'

/** @public */
export type TLEdubreakContentShapeProps = {
	id: number
	title: string
	body: string
	opacity: TLOpacityType
	w: number
	h: number
	type: string
	assetId: TLAssetId | null
	url: string
}

/** @public */
export type TLEdubreakContentShape = TLBaseShape<'edubreakContent', TLEdubreakContentShapeProps>

// --- VALIDATION ---
/** @public */
export const edubreakContentShapeTypeValidator: T.Validator<TLEdubreakContentShape> =
	createShapeValidator(
		'edubreakContent',
		T.object({
			id: T.number,
			title: T.string,
			body: T.string,
			opacity: opacityValidator,
			w: T.nonZeroNumber,
			h: T.nonZeroNumber,
			type: T.string,
			assetId: assetIdValidator.nullable(),
			url: T.string,
		})
	)

// --- MIGRATIONS ---
// STEP 1: Add a new version number here, give it a meaningful name.
// It should be 1 higher than the current version
const Versions = {
	Initial: 0,
	NullAssetId: 1,
} as const

/** @public */
export const edubreakContentShapeMigrations = defineMigrations({
	firstVersion: Versions.Initial,
	// STEP 2: Update the current version to point to your latest version
	currentVersion: Versions.NullAssetId,
	// STEP 3: Add an up+down migration for the new version here
	migrators: {
		[Versions.NullAssetId]: {
			up: (shape: TLEdubreakContentShape) => {
				if (shape.props.assetId === undefined) {
					return { ...shape, props: { ...shape.props, assetId: null } } as typeof shape
				}
				return shape
			},
			down: (shape: TLEdubreakContentShape) => {
				if (shape.props.assetId === null) {
					const { assetId: _, ...props } = shape.props
					return { ...shape, props } as typeof shape
				}
				return shape
			},
		},
	},
})
