import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../reducers'
import { Widget } from '../Widget'
import { thousandsSeparator, sumNumbers, round, sort, getPointsLabel, getGWCountLabel } from '../../utilities'
import { Metric } from '../Metric'

type FormationInformation = {
    count: number
    points: number
}

const formatFormation = (formation: string) => sumNumbers(formation.split('-').map(position => Number(position))) > 10 ? 'Bench Boost' : formation

const FormationWidget: React.FC = () => {
    const stats = useSelector((state: RootState) => state.stats.data)

    const history = useSelector((state: RootState) => state.history.data)

    if (!stats || !history) {
        return (
            <Widget title="Formations">
                <div className="widget__empty">No data available.</div>
            </Widget>
        )
    }

    const weeks = history.current.length

    const formations = Object
        .values(stats)
        .map(position => {
            const selections = position.map(player => player.data.map(data => data.multiplier))

            return Array.from(Array(weeks).keys()).map((el, index) => selections
                .map(player => (player[index] || 0) > 0)
                .filter(val => !!val)
                .length
            )
        })
        .slice(1)

    const data = Array
        .from(Array(weeks).keys())
        .map((el, index) => formations
            .map(entries => entries[index])
            .join('-')
        )
        .reduce((acc, formation, index) => ({
            ...acc,
            [formation]: {
                count: (acc[formation] ? acc[formation].count : 0) + 1,
                points: (acc[formation] ? acc[formation].points : 0) + history.current[index].points,
            }
        }), {} as Record<string, FormationInformation>)

    return (
        <Widget title="Formations">
            {Object.entries(data).length > 0 ? (
                <ul className="widget__list">
                    {sort(Object.entries(data), el => el[1].count).map(([ formation, information ]) => {
                        return (
                            <li className="widget__list__item" key={formation}>
                                <span>{formatFormation(formation)}</span>
                                <div>
                                    <div>
                                        <b>{getGWCountLabel(information.count)}</b>
                                    </div>
                                    <div className="muted">
                                        {getPointsLabel(thousandsSeparator(information.points))}, {round(information.points / information.count)} <Metric metric="ppg" />
                                    </div>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            ) : (
                <div className="widget__empty">No data available.</div>
            )}
        </Widget>
    )
}

export default FormationWidget