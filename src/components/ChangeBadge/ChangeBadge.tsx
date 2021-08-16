import React from 'react'
import classNames from 'classnames'
import { getPointsLabel, round, thousandsSeparator } from '../../utilities'
import './ChangeBadge.scss'

type Props = {
    value: number
}

const ChangeBadge: React.FC<Props> = (props: Props) => {
    return (
        <div className={classNames('change-badge', { 'change-badge--negative': props.value < 0 })}>
            {props.value >= 0 ? '+' : '-'} {getPointsLabel(thousandsSeparator(round(Math.abs(props.value))))}
        </div>
    )
}

export default ChangeBadge
