import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../reducers'
import { Team } from '../Team'
import { Widget } from '../Widget'
import { getAllPlayers, getTotalPoints, sumNumbers } from '../../utilities'
import { Metric } from '../Metric'

const TeamsWidget: React.FC = () => {
    const stats = useSelector((state: RootState) => state.stats.data)
    const bootstrap = useSelector((state: RootState) => state.bootstrap.data)

    if (!stats || !bootstrap) {
        return (
            <Widget title="Teams" />
        )
    }

    const counts = Object.values(stats)
        .reduce((acc: number[], curr) => [ ...acc, ...curr.map(el => el.element.team) ], [])
        .reduce((acc: { [key: number]: number }, curr) => ({ ...acc, [curr]: (acc[Number(curr)] || 0) + 1 }), {})

    const teams = [ ...bootstrap.teams ].sort((a, b) => (counts[b.id] || 0) - (counts[a.id] || 0))

    const allPlayers = getAllPlayers(stats)

    return (
        <Widget title="Teams">
            <ul className="widget__list">
                {teams.map(team => {
                    const players = allPlayers.filter(player => player.element.team === team.id)
                    const points = sumNumbers(players.map(player => getTotalPoints(player)))

                    const positions: Record<string, number> = bootstrap.element_types
                        .reduce((acc, curr) => ({
                            ...acc,
                            [curr.id]: players.filter(player => player.element.element_type === curr.id).length,
                        }), {})

                    return (
                        <li className="widget__list__item" key={team.id}>
                            <Team team={team} />
                            <span>
                                {counts[team.id] || 0}
                                {' '}
                                (
                                    {Object.values(positions).join('-')},
                                    {' '}
                                    {points} pts, {players.length ? (points / players.length).toFixed(1) : 0}
                                    {' '}
                                    <Metric metric="ppp" />
                                )
                            </span>
                        </li>
                    )
                })}
            </ul>
        </Widget>
    )
}

export default TeamsWidget