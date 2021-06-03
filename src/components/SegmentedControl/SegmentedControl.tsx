import React from 'react'
import classNames from 'classnames'
import { Button } from '../Button'
import './SegmentedControl.scss'

type SegmentedOption = {
    label: string
    value: string
}

type Props = {
    label: string
    options: SegmentedOption[]
    selected: string
    setSelected: (value: string) => void
}

const SegmentedControl: React.FC<Props> = (props: Props) => {
    return (
        <div className="segmented-control">
            <label>{props.label}</label>
            {props.options.length > 0 && (
                <div className="segmented-control__options">
                    {props.options.map(option => (
                        <div
                            className={classNames('segmented-control__option', {
                                'segmented-control__option--selected': props.selected === option.value,
                            })}
                        >
                            <Button label={option.label} onClick={() => props.setSelected(option.value)} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default SegmentedControl
