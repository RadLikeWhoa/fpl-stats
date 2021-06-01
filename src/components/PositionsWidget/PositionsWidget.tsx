import React from 'react'
import { useSelector } from 'react-redux'
import { useMeanValue } from '../../hooks'
import { RootState } from '../../reducers'
import { getTotalPoints, thousandsSeparator, sumNumbers, round, reduce, getPointsLabel } from '../../utilities'
import { Widget } from '../Widget'
import { Metric } from '../Metric';

const PositionsWidget: React.FC = () => {
    const stats = useSelector((state: RootState) => state.stats.data)
    const bootstrap = useSelector((state: RootState) => state.bootstrap.data)

    const meanValue = useMeanValue()

    if (!stats || !bootstrap) {
        return (
            <Widget title="Positions" />
        )
    }

    const positions: Record<string, number> = Object.entries(stats)
        .reduce((acc, [ elementType, elements ]) => ({
            ...acc,
            [elementType]: elements.length,
        }), {})

    return (
        <Widget title="Positions">
            <ul className="widget__list">
                <li className="widget__list__item">
                    <span>Total</span>
                    <span>{reduce(Object.values(positions), el => el)}</span>
                </li>
                {Object.entries(positions).map(([ elementType, elements ]) => {
                    const totalPoints = stats[Number(elementType)].map(player => getTotalPoints(player))

                    return (
                        <li className="widget__list__item" key={elementType}>
                            <span>{bootstrap.element_types.find(el => el.id === Number(elementType))?.plural_name}</span>
                            <span>
                                {elements}
                                {' '}
                                ({getPointsLabel(thousandsSeparator(sumNumbers(totalPoints)))}, {round(meanValue(totalPoints))} <Metric metric="ppp" />)
                            </span>
                        </li>
                    )
                })}
            </ul>
        </Widget>
    )
}

export default PositionsWidget