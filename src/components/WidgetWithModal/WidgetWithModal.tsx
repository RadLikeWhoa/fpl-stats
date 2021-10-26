import React, { useCallback, useEffect, useState } from 'react'
import { Widget } from '../Widget'
import { ModalInput } from '../ModalInput'
import { Button } from '../Button'
import './WidgetWithModal.scss'

type Props<T> = {
    data: T[]
    title: string
    max: number
    matchesFilter: (item: T, query: string) => boolean
    renderItem: (list: T) => JSX.Element | null
    getItemKey: (item: T) => string | undefined
}

const renderList = <T,>(
    list: T[],
    renderItem: (item: T) => JSX.Element | null,
    getItemKey: (item: T) => string | undefined
): JSX.Element => {
    return (
        <ul className="widget__list">
            {list.map(item => {
                const render = renderItem(item)

                if (!render) {
                    return null
                }

                return (
                    <li className="widget__list__item" key={getItemKey(item)}>
                        {render}
                    </li>
                )
            })}
        </ul>
    )
}

const WidgetWithModal = <T,>(props: Props<T>): React.ReactElement<Props<T>> | null => {
    const [value, setValue] = useState<string>('')
    const [showExtended, setShowExtended] = useState<boolean>(false)

    const callbackRef = useCallback(inputElement => inputElement?.focus(), [])

    const close = useCallback(() => {
        setShowExtended(false)
        setValue('')
    }, [setShowExtended, setValue])

    useEffect(() => {
        const listener = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                close()
            }
        }

        document.addEventListener('keyup', listener)

        return () => document.removeEventListener('keyup', listener)
    }, [close])

    const topData = props.data.slice(0, props.max)
    const filteredData = value ? props.data.filter(item => props.matchesFilter(item, value)) : props.data

    return (
        <>
            <Widget title={props.title} cssClasses="widget-with-modal">
                {topData.length > 0 && (
                    <>
                        {renderList(topData, props.renderItem, props.getItemKey)}
                        {props.data.length > props.max && (
                            <Button label="Show all" onClick={() => setShowExtended(true)} />
                        )}
                    </>
                )}
            </Widget>
            {showExtended && (
                <div className="modal modal--list-widget">
                    <div className="modal__backdrop" onClick={() => close()}></div>
                    <Widget title={props.title} onClose={() => close()}>
                        <ModalInput
                            label="Name"
                            placeholder="Filter by name"
                            id="query"
                            value={value}
                            onChange={value => setValue(value)}
                            innerRef={callbackRef}
                        />
                        <div className="widget__scroller">
                            {filteredData.length > 0 ? (
                                renderList(filteredData, props.renderItem, props.getItemKey)
                            ) : (
                                <div className="widget__empty">No data available.</div>
                            )}
                        </div>
                    </Widget>
                </div>
            )}
        </>
    )
}

export default WidgetWithModal
