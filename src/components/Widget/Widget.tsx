import React from 'react'
import './Widget.scss'
import { Spinner } from '../Spinner'
import classNames from 'classnames'

type Props = {
    title?: string
    children?: React.ReactNode
    loading?: boolean
    cloaked?: boolean
}

const Widget: React.FC<Props> = (props: Props) => (
    <div className={classNames('widget', {
        'widget--cloaked': props.cloaked,
    })}>
        {props.title && (
            <h2 className="widget__title">{props.title}</h2>
        )}
        <div className="widget__content">
            {props.loading && <div className="widget__loading">
                <Spinner />
            </div>}
            {props.children}
        </div>
    </div>
)

export default Widget