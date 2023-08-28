import classNames from 'classnames'
import _uniqueId from 'lodash/uniqueId'
import { Chip } from 'primereact/chip'
import { Icon } from '../../../components/primitives/Icon'

export function AssignmentChip({ shape, className }: { shape: any; className?: string }) {
	return (
		<Chip
			className={classNames('edubreak-assignment-chip', className)}
			key={_uniqueId('assignment-chip-')}
			label={shape.props.assignment !== '' ? shape.props.assignment : '-'}
			icon={
				<Icon
					className="edubreak-assignment-chip-icon"
					key={_uniqueId('assignment-chip-icon-')}
					icon={'assignment'}
				/>
			}
		/>
	)
}
