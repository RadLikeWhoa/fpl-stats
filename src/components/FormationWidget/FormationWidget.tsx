import React, { useContext } from 'react'
import { Widget } from '../Widget'
import { thousandsSeparator, sumNumbers, round, sort, getPointsLabel, getGWCountLabel } from '../../utilities'
import { Metric } from '../Metric'
import { useMeanValue } from '../../hooks'
import { FilteredDataContext } from '../Dashboard/Dashboard'

type FormationInformation = {
    count: number
    points: (number | null)[]
}

const TITLE = 'Formations'

export const formatFormation = (formation: string) =>
    sumNumbers(formation.split('-').map(position => Number(position))) > 10 ? 'Bench Boost' : formation

const FormationWidget: React.FC = () => {
    const data = useContext(FilteredDataContext)

    const meanValue = useMeanValue()

    if (!data) {
        return <Widget title={TITLE} />
    }

    const history = data.history
    const stats = data.stats.data

    const weeks = history.current.length

    const formations = Object.values(stats)
        .map(position => {
            const selections = position.map(player => player.data.map(data => data.multiplier))

            return Array.from(Array(weeks).keys()).map(
                (el, index) => selections.map(player => (player[index] || 0) > 0).filter(val => !!val).length
            )
        })
        .slice(1)

    const formationData = Array.from(Array(weeks).keys())
        .map((el, index) => formations.map(entries => entries[index]).join('-'))
        .reduce(
            (acc, formation, index) => ({
                ...acc,
                [formation]: {
                    count: (acc[formation] ? acc[formation].count : 0) + 1,
                    points: [
                        ...(acc[formation] ? acc[formation].points : ([] as number[])),
                        history.current[index].points,
                    ],
                },
            }),
            {} as Record<string, FormationInformation>
        )

    return (
        <Widget title={TITLE}>
            {Object.entries(formationData).length > 0 && (
                <ul className="widget__list">
                    {sort(Object.entries(formationData), el => el[1].count).map(([formation, information]) => {
                        return (
                            <li className="widget__list__item" key={formation}>
                                <span>{formatFormation(formation)}</span>
                                <div>
                                    <div>
                                        <b>{getGWCountLabel(information.count)}</b>
                                    </div>
                                    <div className="muted">
                                        {getPointsLabel(thousandsSeparator(sumNumbers(information.points)))},{' '}
                                        {round(meanValue(information.points))} <Metric metric="ppg" />
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

export default FormationWidget
