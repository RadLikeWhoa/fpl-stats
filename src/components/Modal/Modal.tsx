import React from 'react'
import classNames from 'classnames'
import { Button } from '../Button'
import './Modal.scss'

type Props = {
    title: string
    children?: React.ReactNode
    onClose?: () => void
    footer?: React.ReactNode
    cssClasses?: string
}

const Modal: React.FC<Props> = (props: Props) => {
    return (
        <div className={classNames('modal', props.cssClasses)}>
            <div className="modal__backdrop" onClick={() => props.onClose?.()}></div>
            <div className="modal__element">
                <h3 className="modal__header">
                    {props.title}
                    <Button label="X" onClick={() => props.onClose?.()} aria-label="Close" />
                </h3>
                <div className="modal__body">{props.children}</div>
                {props.footer && <footer className="modal__footer">{props.footer}</footer>}
            </div>
        </div>
    )
}

export default Modal
