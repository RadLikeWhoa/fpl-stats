import React from 'react'
import classNames from 'classnames'
import { useSelector } from 'react-redux'
import { RootState } from '../../reducers'
import './Widget.scss'

type Props = {
    title?: string
    children?: React.ReactNode
    cssClasses?: string
}

const Widget: React.FC<Props> = (props: Props) => {
    const id = useSelector((state: RootState) => state.settings.id)

    return (
        <div className={classNames('widget', props.cssClasses, {
            'widget--cloaked': !id,
        })}>
            {props.title && (
                <h3 className="widget__title">{props.title}</h3>
            )}
            <div className="widget__content">
                {props.children || (
                    <div className="widget__empty">No data available.</div>
                )}
            </div>
        </div>
    )
}

export default Widget