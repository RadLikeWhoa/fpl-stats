import React, { useContext } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../reducers'
import { Team as TeamType } from '../../types'
import { getAllPlayers, getPointsLabel, head, last, round, sort } from '../../utilities'
import { FilteredDataContext } from '../Dashboard/Dashboard'
import { Team } from '../Team'
import { Widget } from '../Widget'
import { WidgetWithModal } from '../WidgetWithModal'

const MAX_ITEMS = 5
const TITLE = 'Total Points Contribution by Team'

type TeamContribution = {
    team: TeamType
    points: number
}

const getItemKey = (item: TeamContribution): string => {
    return `${item.team.id}`
}

const matchesFilter = (item: TeamContribution, query: string): boolean => {
    return item.team.name.toLowerCase().includes(query.toLowerCase())
}

const TeamContributionWidget: React.FC = () => {
    const data = useContext(FilteredDataContext)

    const entry = useSelector((state: RootState) => state.entry.data)
    const rawHistory = useSelector((state: RootState) => state.history.data)
    const bootstrap = useSelector((state: RootState) => state.bootstrap.data)

    if (!entry || !data || !rawHistory || !bootstrap) {
        return <Widget title={TITLE} />
    }

    const history = data.history
    const stats = data.stats.data

    const latestPoints = last(history.current)?.total_points || 0
    const totalPoints =
        history.current.length > 1
            ? latestPoints -
              (rawHistory?.current?.find(event => event.event === (head(history.current)?.event || 1))?.total_points ||
                  0)
            : latestPoints

    const contributions = sort(
        Object.entries(
            getAllPlayers(stats).reduce(
                (acc, player) => ({
                    ...acc,
                    [player.element.team]: (acc[player.element.team] || 0) + player.aggregates.totals.points,
                }),
                {} as Record<number, number>
            )
        ).reduce((acc, curr) => {
            const team = bootstrap.teams.find(team => team.id === Number(curr[0]))

            if (!team) {
                return acc
            }

            return [
                ...acc,
                {
                    team,
                    points: curr[1],
                },
            ]
        }, [] as TeamContribution[]),
        el => el.points
    )

    return (
        <WidgetWithModal
            title={TITLE}
            data={contributions}
            max={MAX_ITEMS}
            renderItem={team => (
                <>
                    <Team team={team.team} />
                    <div>
                        <div>
                            <b>{round((team.points / totalPoints) * 100)}%</b>
                        </div>
                        <div className="muted">{getPointsLabel(team.points)}</div>
                    </div>
                </>
            )}
            getItemKey={getItemKey}
            matchesFilter={matchesFilter}
        />
    )
}

export default TeamContributionWidget
