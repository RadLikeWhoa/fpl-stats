import React from 'react'
import classNames from 'classnames'
import { useSelector } from 'react-redux'
import { RootState } from '../../reducers'
import './Widget.scss'

type Props = {
    title?: string
    children?: React.ReactNode
}

const Widget: React.FC<Props> = (props: Props) => {
    const id = useSelector((state: RootState) => state.settings.id)

    return (
        <div className={classNames('widget', {
            'widget--cloaked': !id,
        })}>
            {props.title && (
                <h2 className="widget__title">{props.title}</h2>
            )}
            <div className="widget__content">
                {props.children}
            </div>
        </div>
    )
}

export default Widget