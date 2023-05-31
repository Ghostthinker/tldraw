import { defineMigrations } from '@tldraw/tlstore'
import { T } from '@tldraw/tlvalidate'
import { TLOpacityType } from '../style-types'
import { opacityValidator } from '../validation'
import { createShapeValidator, TLBaseShape } from './shape-validation'

/** @public */
export type TLViewzoneShapeProps = {
	opacity: TLOpacityType
	w: number
	h: number
	name: string
}

/** @public */
export type TLViewzoneShape = TLBaseShape<'viewzone', TLViewzoneShapeProps>

// --- VALIDATION ---
/** @public */
export const viewzoneShapeTypeValidator: T.Validator<TLViewzoneShape> = createShapeValidator(
	'viewzone',
	T.object({
		opacity: opacityValidator,
		w: T.nonZeroNumber,
		h: T.nonZeroNumber,
		name: T.string,
	})
)

// --- MIGRATIONS ---
// STEP 1: Add a new version number here, give it a meaningful name.
// It should be 1 higher than the current version
const Versions = {
	Initial: 0,
} as const

/** @public */
export const viewzoneShapeMigrations = defineMigrations({
	// STEP 2: Update the current version to point to your latest version
	currentVersion: Versions.Initial,
	firstVersion: Versions.Initial,
	migrators: {
		// STEP 3: Add an up+down migration for the new version here
	},
})
