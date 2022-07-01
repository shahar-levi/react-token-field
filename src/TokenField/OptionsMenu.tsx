import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import classes from './../styles.module.css'

export interface OptionsRef {
  next: () => void
  back: () => void
  value: () => string
  isChildOf: (elm: Element) => boolean
}

export interface OptionsProps {
  value: string
  position: { left: number; top: number } | null
  onSelectedValue: (value: string) => void
  selectedClassName?: string
  renderOptions?: (value: string) => React.ReactElement
}

const OptionsMenu = React.forwardRef<OptionsRef, OptionsProps>(
  (
    { value, onSelectedValue, position, selectedClassName, renderOptions },
    ref
  ) => {
    const [index, setIndex] = useState(-1)
    const containerRef = useRef<HTMLDivElement | null>(null)
    const optionElement: React.ReactElement | null = renderOptions
      ? renderOptions(value)
      : null

    const elements: React.ReactElement[] = React.Children.map(
      optionElement?.props.children,
      (child: React.ReactElement, i: number) =>
        React.cloneElement(child, {
          key: i,
          tabIndex: -1,
          onClick: () => onSelectedValue(child.props['data-value']),
          className:
            i === index
              ? `${selectedClassName || classes.selectedOption} ${
                  child.props.className || ''
                }`
              : `${child.props.className || ''}`
        })
    )

    useEffect(() => {
      containerRef.current?.children[index]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest'
      })
    }, [index])

    useImperativeHandle(ref, () => ({
      next: () => {
        setIndex((index) => (index + 1) % elements.length)
      },
      isChildOf: isChildOf,
      back: () => {
        setIndex((index) =>
          index - 1 < 0 ? elements.length - 1 : (index - 1) % elements.length
        )
      },
      value: () =>
        value && elements?.length ? elements[index].props['data-value'] : ''
    }))
    useEffect(() => {
      setIndex(0)
    }, [value])

    function isChildOf(elm: HTMLElement | Element | null | undefined): boolean {
      if (elm?.className === classes.reactTokenField) {
        return false
      } else if (elm === containerRef.current) {
        return true
      }
      return isChildOf(elm?.parentElement)
    }

    function renderOptionElement(): React.ReactNode {
      if (optionElement) {
        return React.createElement(optionElement.type, {
          ...optionElement.props,
          children: elements,
          ref: containerRef
        })
      }
      return null
    }

    return value && elements && elements.length > 0 ? (
      <div
        className={classes.options}
        style={{
          top: position?.top,
          left: position?.left
        }}
      >
        {renderOptionElement()}
      </div>
    ) : null
  }
)
export default OptionsMenu
