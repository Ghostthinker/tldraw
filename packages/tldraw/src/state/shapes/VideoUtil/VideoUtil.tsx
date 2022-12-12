import {ChatBubbleIcon, VideoIcon, PlayIcon} from '@radix-ui/react-icons'
import {styled} from '@stitches/react'
import {HTMLContainer, TLBounds, Utils} from '@tldraw/core'
import Vec from '@tldraw/vec'
import * as React from 'react'
import {GHOSTED_OPACITY} from '~constants'
import {TDShapeUtil} from '~state/shapes/TDShapeUtil'
import {
  defaultStyle,
  defaultTextStyle,
  getBoundsRectangle,
  getStickyFontStyle,
  getStickyShapeStyle,
  transformRectangle,
  transformSingleRectangle,
} from '~state/shapes/shared'
import {TDMeta, TDShapeType, TDVideoAsset, TransformInfo, VideoShape} from '~types'
import {stopPropagation} from "~components/stopPropagation";

type T = VideoShape
type E = HTMLDivElement

export class VideoUtil extends TDShapeUtil<T, E> {
  type = TDShapeType.Video as const
  canBind = true
  canEdit = false
  canClone = true

  hideResizeHandles = true

  showCloneHandles = true

  getShape = (props: Partial<T>): T => {
    return Utils.deepMerge<T>(
      {
        id: 'id',
        type: TDShapeType.Video,
        name: 'Video',
        parentId: 'page',
        title: '',
        body: '',
        thumbnail: '',
        model: null,
        childIndex: 1,
        point: [0, 0],
        size: [800, 700],
        rotation: 0,
        style: defaultTextStyle,
      },
      props
    )
  }

  Component = TDShapeUtil.Component<T, E, TDMeta>(
    ({shape, meta, events, isGhost, isBinding, isEditing, onShapeBlur, onShapeChange}, ref) => {
      const font = getStickyFontStyle(shape.style)

      const fontSizeBody = 28

      const {color, fill} = {
        fill: 'white',
        color: 'black',
      }

      const [linkColor, setlinkColor] = React.useState("#000000")

      const [renderVideo, setRenderVideo] = React.useState(false)

      const rContainer = React.useRef<HTMLDivElement>(null)

      const rIsMounted = React.useRef(false)

      const rTitle = React.useRef<HTMLDivElement>(null)

      const rBody = React.useRef<HTMLDivElement>(null)

      const rTextContainer = React.useRef<HTMLDivElement>(null)

      const rVideoContainer = React.useRef<HTMLDivElement>(null)

      const handlePointerDown = React.useCallback((e: React.PointerEvent) => {
        e.stopPropagation()
      }, [])

      const openEdubreakLink = () => {
        window.open(shape.model.campusURL, '_blank', 'noopener,noreferrer');
      }

      // Resize to fit text
      React.useEffect(() => {
        const textContainer = rTextContainer.current!
        const videoContainer = rVideoContainer.current!
        const title = rTitle.current!
        const body = rBody.current!

        const {size} = shape
        const {offsetHeight: currTitleHeight} = title
        const {offsetHeight: currBodyHeight} = body
        const {clientHeight: currTextContainerHeight} = textContainer
        const currTextHeight = currTitleHeight + currBodyHeight + (2 * fontSizeBody)
        const minTextHeight = currTextContainerHeight - PADDING * 2

        if (currTextHeight > minTextHeight) {
          // Snap the size to the text content if the text only when the
          // text is larger than the minimum text height.
          // 25.07.2022 - 10:28 - MK: musste 450 als konstante für das video image einbinden, weil er mir für die höhe hier immer null ausgegeben hat. Wenn das Mal resized werden soll, müssen wir halt noch eine Lösung dafür finden.
          onShapeChange?.({id: shape.id, size: [size[0], 450 + currTextHeight + PADDING * 2]})
          return
        }
      }, [])

      const style = {
        font,
        color,
        textShadow: meta.isDarkMode
          ? `0.5px 0.5px 2px rgba(255, 255, 255,.25)`
          : `0.5px 0.5px 2px rgba(255, 255, 255,.5)`,
      }

      function Icon() {
        if (!shape.body) {
          return <VideoIcon style={{width: 50, height: 50}}/>
        } else {
          return <ChatBubbleIcon style={{width: 50, height: 50}}/>
        }
      }

      React.useEffect(() => {
        window.addEventListener('onRenderVideo', onRenderVideo)
        window.addEventListener('onNotRenderVideo', onNotRenderVideo)
      }, [])

      const onRenderVideo = (e: any) => {
        if (shape.id === e.detail) {
          setRenderVideo(true)
        }
      }

      const onNotRenderVideo = (e: any) => {
        if (shape.id === e.detail) {
          setRenderVideo(false)
        }
      }

      return (
        <HTMLContainer ref={ref} {...events}>
          <StyledVideoContainer
            ref={rContainer}
            isDarkMode={meta.isDarkMode}
            isGhost={isGhost}
            style={{backgroundColor: fill, ...style}}
          >
            {isBinding && (
              <div
                className="tl-binding-indicator"
                style={{
                  position: 'absolute',
                  top: -this.bindingDistance,
                  left: -this.bindingDistance,
                  width: `calc(100% + ${this.bindingDistance * 2}px)`,
                  height: `calc(100% + ${this.bindingDistance * 2}px)`,
                  backgroundColor: 'grey',
                }}
              />
            )}

            <div>
              <div
                ref={rVideoContainer}
                style={{
                  fontSize: 32,
                  fontWeight: 800,
                  position: 'relative',
                  userSelect: 'none',
                }}
              >
                {!renderVideo ?
                  <>
                    <img
                    id="video-img"
                    draggable={false}
                    src={shape.thumbnail}
                    style={{height: 'auto', width: '100%', display: 'block'}}/>
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        display: 'flex',
                        color: 'white',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '0.25em',
                        backgroundColor: '#E20000',
                      }}
                    >
                      <Icon/>
                    </div>
                  </>
                  :
                  /*TODO: remove mocked video src after testing*/
                  <video style={{width: '800px'}} id={"EB-Video_" + shape.id} controls
                         src={'https://evoli-dev.ghostthinker.de/streaming/stream.php?token=hLAh%7Eo0qqOEKA11g.nutylF0LaTLICVelqjQTkcQWJ5%7EL.ol7plby%7EV4wFVv4P48qg64IUV7ELo5SF5bOLb7FaycJ%7EfK%7EagrkIPVgxrdXcNydgS8af8eSMVW3wv132y5C2x5XXN36Zk-'}
                  />
                }
              </div>
            </div>
            <div
              ref={rTextContainer}
              style={{
                padding: '.5em',
              }}
            >
              <div
                ref={rTitle}
                style={{
                  fontSize: 36,
                  fontWeight: 800,
                  pointerEvents: 'none',
                  userSelect: 'none',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  textOverflow: 'ellipsis',
                }}
              >
                {shape.title}
              </div>
              <div
                ref={rBody}
                style={{
                  paddingTop: '2em',
                  fontSize: 28,
                  fontWeight: 400,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'normal',
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  pointerEvents: 'none',
                  userSelect: 'none',
                }}
                dangerouslySetInnerHTML={{__html: shape.body}}
              />
            </div>
            <div id="card-footer" style={{
              width: '100%',
              height: '2em'
            }}>
              <EdubreakLink id='edubreak-link' style={{color: `${linkColor}`}} onClick={openEdubreakLink}
                            onMouseEnter={() => {
                              setlinkColor('#6187ef')
                            }} onMouseLeave={() => {
                setlinkColor('#000000')
              }} onPointerDown={handlePointerDown}
              >
                in edubreak<sup>®</sup> öffnen
              </EdubreakLink>
            </div>
          </StyledVideoContainer>
        </HTMLContainer>
      )
    }
  )

  Indicator = TDShapeUtil.Indicator<T>(({shape}) => {
    const {
      size: [width, height],
    } = shape
    return (
      <rect x={0} y={0} rx={3} ry={3} width={Math.max(1, width)} height={Math.max(1, height)}/>
    )
  })

  getBounds = (shape: T) => {
    return getBoundsRectangle(shape, this.boundsCache)
  }

  shouldRender = (prev: T, next: T) => {
    return next.size !== prev.size || next.style !== prev.style
  }

  transform = (
    shape: T,
    bounds: TLBounds,
    {scaleX, scaleY, transformOrigin}: TransformInfo<T>
  ): Partial<T> => {
    const point = Vec.toFixed([
      bounds.minX +
      (bounds.width - shape.size[0]) * (scaleX < 0 ? 1 - transformOrigin[0] : transformOrigin[0]),
      bounds.minY +
      (bounds.height - shape.size[1]) *
      (scaleY < 0 ? 1 - transformOrigin[1] : transformOrigin[1]),
    ])

    return {
      point,
    }
  }

  transformSingle = (shape: T): Partial<T> => {
    return shape
  }

  getSvgElement = (shape: T, isDarkMode: boolean): SVGElement | void => {
    const bounds = this.getBounds(shape)
    const style = getStickyShapeStyle(shape.style, isDarkMode)

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    rect.setAttribute('width', bounds.width + '')
    rect.setAttribute('height', bounds.height + '')
    rect.setAttribute('fill', style.fill)
    rect.setAttribute('rx', '3')
    rect.setAttribute('ry', '3')

    g.appendChild(rect)
    return g
  }
}

/* -------------------------------------------------- */
/*                       Helpers                      */
/* -------------------------------------------------- */

const PADDING = 16
const MIN_CONTAINER_HEIGHT = 700

const StyledVideoContainer = styled('div', {
  pointerEvents: 'all',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  backgroundColor: 'rgba(255, 220, 100)',
  fontFamily: '"Source Sans Pro", "Lucida Grande", sans-serif !important',
  height: '100%',
  width: '100%',
  borderRadius: '3px',
  perspective: '800px',
  variants: {
    isGhost: {
      false: {opacity: 1},
      true: {transition: 'opacity .2s', opacity: GHOSTED_OPACITY},
    },
    isDarkMode: {
      true: {
        boxShadow:
          '2px 3px 12px -2px rgba(0,0,0,.3), 1px 1px 4px rgba(0,0,0,.3), 1px 1px 2px rgba(0,0,0,.3)',
      },
      false: {
        boxShadow:
          '2px 3px 12px -2px rgba(0,0,0,.2), 1px 1px 4px rgba(0,0,0,.16),  1px 1px 2px rgba(0,0,0,.16)',
      },
    },
  },
})

const EdubreakLink = styled('button', {
  fontSize: 28,
  position: 'absolute',
  right: '.75em',
  bottom: '.5em',
  color: '#000000',
  textDecoration: 'underline',
  backgroundColor: 'transparent',
  backgroundRepeat: 'no-repeat',
  border: 'none',
  cursor: 'pointer',
  overflow: 'hidden',
  outline: 'none'
})
