import React, { useContext } from 'react'
import { useSelector } from 'react-redux'
import { useMeanValue } from '../../hooks'
import { RootState } from '../../reducers'
import { thousandsSeparator, sumNumbers, round, reduce, getPointsLabel, pluralise } from '../../utilities'
import { Widget } from '../Widget'
import { Metric } from '../Metric'
import { FilteredDataContext } from '../Dashboard/Dashboard'

const TITLE = 'Positions'

const PositionsWidget: React.FC = () => {
    const data = useContext(FilteredDataContext)

    const bootstrap = useSelector((state: RootState) => state.bootstrap.data)

    const meanValue = useMeanValue()

    if (!data || !bootstrap) {
        return <Widget title={TITLE} />
    }

    const stats = data.stats.data

    const positions: Record<string, number> = Object.entries(stats).reduce(
        (acc, [elementType, elements]) => ({
            ...acc,
            [elementType]: elements.length,
        }),
        {}
    )

    return (
        <Widget title={TITLE}>
            {Object.entries(positions).length > 0 && (
                <ul className="widget__list">
                    <li className="widget__list__item">
                        <span>Total</span>
                        <b>
                            {pluralise(
                                reduce(Object.values(positions), el => el),
                                'Player',
                                'Players'
                            )}
                        </b>
                    </li>
                    {Object.entries(positions).map(([elementType, elements]) => {
                        const totalPoints = stats[Number(elementType)].map(player => player.aggregates.totals.points)

                        return (
                            <li className="widget__list__item" key={elementType}>
                                <span>
                                    {bootstrap.element_types.find(el => el.id === Number(elementType))?.plural_name}
                                </span>
                                <div>
                                    <div>
                                        <b>{pluralise(elements, 'Player', 'Players')}</b>
                                    </div>
                                    <div className="muted">
                                        {getPointsLabel(thousandsSeparator(sumNumbers(totalPoints)))},{' '}
                                        {round(meanValue(totalPoints))} <Metric metric="ppp" />
                                    </div>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            )}
        </Widget>
    )
}

export default PositionsWidget
