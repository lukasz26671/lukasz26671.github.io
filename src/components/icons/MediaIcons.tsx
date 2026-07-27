import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const base = {
  viewBox: '0 0 24 24',
  fill: 'currentColor',
  'aria-hidden': true as const,
  width: '1em',
  height: '1em',
}

export function IconPlay(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86a1 1 0 0 0-1.5.86z" />
    </svg>
  )
}

export function IconPause(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M7 5h3a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm7 0h3a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />
    </svg>
  )
}

export function IconPrev(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 5a1 1 0 0 1 1 1v5.38l9.4-6.07A1.2 1.2 0 0 1 18.5 6.2v11.6a1.2 1.2 0 0 1-2.1.89L7 12.62V18a1 1 0 1 1-2 0V6a1 1 0 0 1 1-1z" />
    </svg>
  )
}

export function IconNext(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M18 5a1 1 0 0 0-1 1v5.38L7.6 5.31A1.2 1.2 0 0 0 5.5 6.2v11.6a1.2 1.2 0 0 0 2.1.89L17 12.62V18a1 1 0 1 0 2 0V6a1 1 0 0 0-1-1z" />
    </svg>
  )
}

export function IconShuffle(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M16.5 4.5h2.2v2.2L14.4 11l-1.55-1.55 4.3-4.3h-.65V4.5zm2.2 15h-2.2v-1.15h.65l-4.3-4.3L14.4 13l4.3 4.3V15h2.2v4.5zM3.5 7.2l3.05 3.05 1.55-1.55L5.7 6.3H9V4.5H3.5V10h1.8V7.2zm0 9.6V14H5.3v2.7l2.4-2.4 1.55 1.55-3.05 3.05H3.5z" />
    </svg>
  )
}

export function IconLoop(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M7 7h8.5a3.5 3.5 0 0 1 0 7H14v-2l-3.5 3 3.5 3v-2h1.5a5.5 5.5 0 1 0 0-11H7V3L3.5 6 7 9V7zm3 10H7.5a3.5 3.5 0 0 1 0-7H10v2l3.5-3L10 6v2H7.5a5.5 5.5 0 1 0 0 11H10v2l3.5-3L10 15v2z" />
    </svg>
  )
}

export function IconChevronDown(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6.3 9.3a1 1 0 0 1 1.4 0L12 13.6l4.3-4.3a1 1 0 1 1 1.4 1.4l-5 5a1 1 0 0 1-1.4 0l-5-5a1 1 0 0 1 0-1.4z" />
    </svg>
  )
}

export function IconChevronUp(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6.3 14.7a1 1 0 0 0 1.4 0L12 10.4l4.3 4.3a1 1 0 1 0 1.4-1.4l-5-5a1 1 0 0 0-1.4 0l-5 5a1 1 0 0 0 0 1.4z" />
    </svg>
  )
}

export function IconShare(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
    </svg>
  )
}

export function IconVolume(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 9v6h3.2L12 19.2V4.8L7.2 9H4zm11.5 3a3.5 3.5 0 0 0-1.8-3.05v6.1A3.5 3.5 0 0 0 15.5 12zm-1.8-6.45v1.6A5.5 5.5 0 0 1 17.5 12a5.5 5.5 0 0 1-3.8 5.2v1.6A7.1 7.1 0 0 0 19.3 12a7.1 7.1 0 0 0-5.6-6.45z" />
    </svg>
  )
}
