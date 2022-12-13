import * as React from 'react'
import {SVGContainer, Utils} from '@tldraw/core'
import {AlignStyle, ColorStyle, DashStyle, FontStyle, SizeStyle, TDMeta, TDShapeType, ViewZoneShape} from '~types'
import {GHOSTED_OPACITY, LABEL_OFFSET} from '~constants'
import {TDShapeUtil} from '../TDShapeUtil'
import {
  defaultTextStyle,
  getBoundsRectangle, getShapeStyle,
  getStickyFontStyle,
  transformRectangle,
  transformSingleRectangle,
} from '~state/shapes/shared'
import {TextLabel} from '../shared/TextLabel'
import {DrawRectangle} from './components/DrawRectangle'
import {BindingIndicator} from './components/BindingIndicator'
import {styled} from '~styles'
import {useTldrawApp} from "~hooks";

type T = ViewZoneShape
type E = HTMLDivElement

export class ViewZoneUtil extends TDShapeUtil<T, E> {
  type = TDShapeType.ViewZone as const

  canBind = true

  canClone = true

  canEdit = true

  getShape = (props: Partial<T>): T => {
    return Utils.deepMerge<T>(
      {
        id: 'id',
        type: TDShapeType.ViewZone,
        name: 'ViewZone',
        parentId: 'page',
        childIndex: 1,
        point: [0, 0],
        size: [1, 1],
        rotation: 0,
        style: defaultTextStyle,
        label: 'Viewzone',
      },
      props
    )
  }

  Component = TDShapeUtil.Component<T, E, TDMeta>(
    (
      {
        shape,
        isEditing,
        isBinding,
        isSelected,
        isGhost,
        meta,
        bounds,
        events,
        onShapeBlur,
        onShapeChange,
      },
      ref
    ) => {
      const { id, size, label = '', labelOffset = LABEL_OFFSET } = shape
      const font = getStickyFontStyle(shape.style)
      const Component = DrawRectangle
      const handleLabelChange = React.useCallback(
        (label: string) => onShapeChange?.({ id, label }),
        [onShapeChange]
      )
      const app = useTldrawApp()

      // Add shadow to view zones
      React.useEffect(() => {
        document.getElementById(shape.id + '_svg')!.style.filter = 'drop-shadow(2px 3px 12px rgba(0,0,0,.3))'
        app.moveToBack()
      }, [])

      return (
        <FullWrapper ref={ref} {...events}>
          <TextLabel
            isEditing={isEditing}
            onChange={handleLabelChange}
            onBlur={onShapeBlur}
            font={font}
            text={label}
            color={ColorStyle.Black}
            offsetX={0}
            offsetY={bounds.height * (-0.5) - labelOffset[1]}
          />
          <SVGContainer id={shape.id + '_svg'} className={'viewzone'} opacity={isGhost ? GHOSTED_OPACITY : 1}>
            {isBinding && <BindingIndicator strokeWidth={0} size={size}/>}
              <Component
                id={id}
                style={{
                  color: meta.isDarkMode ? ColorStyle.Gray : ColorStyle.LightGray,
                  size: SizeStyle.Medium,
                  dash: DashStyle.Solid,
                  font: FontStyle.Sans,
                  textAlign: AlignStyle.Start,
                  isFilled: false,
                  scale: 1
                }}
                size={size}
                isSelected={isSelected}
                isDarkMode={meta.isDarkMode}
              />
          </SVGContainer>
        </FullWrapper>
      )
    }
  )

  Indicator = TDShapeUtil.Indicator<T>(({ shape }) => {
    const { style, size } = shape

    const styles = getShapeStyle(style, false)
    const sw = styles.strokeWidth

    return (
      <rect
        x={sw}
        y={sw}
        rx={1}
        ry={1}
        width={Math.max(1, size[0] - sw * 2)}
        height={Math.max(1, size[1] - sw * 2)}
      />
    )
  })

  getBounds = (shape: T) => {
    return getBoundsRectangle(shape, this.boundsCache)
  }

  shouldRender = (prev: T, next: T) => {
    return next.size !== prev.size || next.style !== prev.style || next.label !== prev.label
  }

  transform = transformRectangle

  transformSingle = transformSingleRectangle
}

const FullWrapper = styled('div', {
  width: '100%',
  height: '100%',
})
