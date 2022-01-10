import React from 'react'
import classNames from 'classnames'
import { StatAggregateTotals, StatData } from '../../types'
import './StatComparison.scss'

interface Props {
    left: StatData
    right: StatData
    label: string
    columnClass?: string
    stat: keyof StatAggregateTotals
    compare: (left: number, right: number) => boolean
}

const StatComparison: React.FC<Props> = (props: Props) => {
    const leftValue = props.left.aggregates.totals[props.stat]
    const rightValue = props.right.aggregates.totals[props.stat]

    return (
        <li className="stat-comparison">
            <div className={classNames('stat-comparison__label', props.columnClass)}>{props.label}</div>
            <div
                className={classNames('stat-comparison__left', props.columnClass, {
                    'stat-comparison__left--highlight': props.compare(leftValue, rightValue),
                })}
            >
                <span>{leftValue}</span>
            </div>
            <div
                className={classNames('stat-comparison__right', props.columnClass, {
                    'stat-comparison__right--highlight': props.compare(rightValue, leftValue),
                })}
            >
                <span>{rightValue}</span>
            </div>
        </li>
    )
}

export default StatComparison
