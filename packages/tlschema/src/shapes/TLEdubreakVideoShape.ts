import { defineMigrations } from '@tldraw/tlstore'
import { T } from '@tldraw/tlvalidate'
import { TLAssetId } from '../records/TLAsset'
import { TLOpacityType } from '../style-types'
import { assetIdValidator, opacityValidator } from '../validation'
import { TLBaseShape, createShapeValidator } from './shape-validation'

/** @public */
export type TLEdubreakVideoShapeProps = {
	id: number
	title: string
	body: string
	thumbnail: string
	opacity: TLOpacityType
	w: number
	h: number
	time: number
	playing: boolean
	url: string
	type: string
	assetId: TLAssetId | null
}

/** @public */
export type TLEdubreakVideoShape = TLBaseShape<'edubreakVideo', TLEdubreakVideoShapeProps>

// --- VALIDATION ---
/** @public */
export const edubreakVideoShapeTypeValidator: T.Validator<TLEdubreakVideoShape> =
	createShapeValidator(
		'edubreakVideo',
		T.object({
			id: T.number,
			title: T.string,
			body: T.string,
			thumbnail: T.string,
			opacity: opacityValidator,
			w: T.nonZeroNumber,
			h: T.nonZeroNumber,
			time: T.number,
			playing: T.boolean,
			url: T.string,
			type: T.string,
			assetId: assetIdValidator.nullable(),
		})
	)

// --- MIGRATIONS ---
// STEP 1: Add a new version number here, give it a meaningful name.
// It should be 1 higher than the current version
const Versions = {
	Initial: 0,
	AddUrlProp: 1,
} as const

/** @public */
export const edubreakVideoShapeMigrations = defineMigrations({
	// STEP 2: Update the current version to point to your latest version
	firstVersion: Versions.Initial,
	currentVersion: Versions.AddUrlProp,
	migrators: {
		// STEP 3: Add an up+down migration for the new version here
		[Versions.AddUrlProp]: {
			up: (shape) => {
				return { ...shape, props: { ...shape.props, url: '' } }
			},
			down: (shape) => {
				const { url: _, ...props } = shape.props
				return { ...shape, props }
			},
		},
	},
})
