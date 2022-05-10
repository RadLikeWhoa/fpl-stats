import React, { useContext } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../reducers'
import { getAllPlayers, sort, head, last, reduce, getPointsLabel, thousandsSeparator, round } from '../../utilities'
import { Widget } from '../Widget'
import { FilteredDataContext } from '../Dashboard/Dashboard'
import { StatData } from '../../types'
import { ChangeBadge } from '../ChangeBadge'
import { SiteLink } from '../SiteLink'
import { Player } from '../Player'
import { SwapIcon } from '../SwapIcon'
import { formatFormation } from '../FormationWidget/FormationWidget'
import { Metric } from '../Metric'
import './PointsImprovementsWidget.scss'

const TITLE = 'Points Improvements'

const isValidXi = (players: StatData[]) => {
    const defenders = players.filter(p => p.element.element_type === 2).length >= 3
    const midfielders = players.filter(p => p.element.element_type === 3).length >= 2
    const forwards = players.filter(p => p.element.element_type === 4).length >= 1

    return defenders && midfielders && forwards
}

const getFormation = (positions: string[], players: StatData[]) => {
    return positions
        .slice(1)
        .map(
            position =>
                players.filter(
                    player => player.element.element_type === Number(position) && (player.data[0]?.multiplier || 0) > 0
                ).length
        )
        .join('-')
}

const PointsImprovementsWidget: React.FC = () => {
    const data = useContext(FilteredDataContext)

    const bootstrap = useSelector((state: RootState) => state.bootstrap.data)

    if (!data || !bootstrap) {
        return <Widget title={TITLE} />
    }

    const allPlayers = getAllPlayers(data.stats.data)

    const weeks = data.history.current.map(event => {
        const players = allPlayers
            .filter(player => player.data?.find(el => el.event.id === event.event)?.multiplier !== null)
            .map(player => ({ ...player, data: [player.data?.find(el => el.event.id === event.event)!] }))

        let outfieldXi: StatData[] = players
            .filter(player => (player.data[0]?.multiplier || 0) > 0 && player.element.element_type !== 1)
            .map(player => JSON.parse(JSON.stringify(player)))

        let outfieldBench: StatData[] = players
            .filter(player => (player.data[0]?.multiplier || 0) === 0 && player.element.element_type !== 1)
            .map(player => JSON.parse(JSON.stringify(player)))

        let subsPerformed = 0
        let subs: { in: StatData; out: StatData }[] = []

        do {
            subsPerformed = 0

            let newBench = outfieldBench

            for (let player of outfieldBench) {
                const lowestScore =
                    last(
                        sort(
                            outfieldXi.filter(el => el.data[0].rawPoints !== null),
                            el => el.data[0]?.rawPoints || 0
                        )
                    )?.data[0]?.rawPoints || 0

                if ((player.data[0]?.rawPoints || 0) <= lowestScore) {
                    continue
                }

                const possibleSubs = outfieldXi.filter(player => player.data[0]?.rawPoints === lowestScore)

                for (let sub of possibleSubs) {
                    const proposedXi = [
                        ...outfieldXi.filter(xiPlayer => xiPlayer.element.id !== sub.element.id),
                        player,
                    ]

                    const proposedBench = [
                        ...newBench.filter(benchPlayer => benchPlayer.element.id !== player.element.id),
                        sub,
                    ]

                    if (isValidXi(proposedXi)) {
                        outfieldXi = proposedXi
                        newBench = proposedBench
                        subsPerformed += 1

                        const originalMultiplier = player.data[0]?.multiplier

                        player.data[0].multiplier = sub.data[0].multiplier
                        sub.data[0].multiplier = originalMultiplier

                        subs = [...subs, { in: player, out: sub }]

                        break
                    }
                }
            }

            outfieldBench = newBench
        } while (subsPerformed > 0)

        let gk: StatData = JSON.parse(
            JSON.stringify(
                players.find(player => (player.data[0]?.multiplier || 0) > 0 && player.element.element_type === 1)
            )
        )

        let benchGk: StatData = JSON.parse(
            JSON.stringify(
                players.find(player => (player.data[0]?.multiplier || 0) === 0 && player.element.element_type === 1) ||
                    players.find(player => player.element.element_type === 1)
            )
        )

        if ((benchGk.data[0]?.rawPoints || 0) > (gk.data[0]?.rawPoints || 0)) {
            const temp = gk
            const originalMultiplier = gk.data[0]?.multiplier

            gk = benchGk
            benchGk = temp

            gk.data[0].multiplier = benchGk.data[0].multiplier
            benchGk.data[0].multiplier = originalMultiplier

            subs = [{ in: gk, out: benchGk }, ...subs]
        }

        const rotatedPlayers = [gk, ...outfieldXi]

        const actualCaptain = players.find(player => (player.data[0]?.multiplier || 0) > 1)
        const initialCaptain = rotatedPlayers.find(player => (player.data[0]?.multiplier || 0) > 1)
        const idealCaptain = head(sort(rotatedPlayers, el => el.data[0]?.rawPoints || 0))

        subs = subs.filter(sub => subs.filter(subCheck => subCheck.out.element.id === sub.in.element.id).length === 0)

        return {
            event,
            actualPoints: event.points,
            idealPoints:
                reduce(rotatedPlayers, player => (player.data[0].rawPoints || 0) * (player.data[0].multiplier || 0)) +
                (idealCaptain?.data[0]?.rawPoints || 0) -
                (initialCaptain?.data[0]?.rawPoints || 0),
            actualFormation: getFormation(Object.keys(data.stats.data), players),
            idealFormation: getFormation(Object.keys(data.stats.data), rotatedPlayers),
            actualCaptain,
            idealCaptain,
            subs,
        }
    })

    const totalHits = reduce(data.history.current, el => el.event_transfers_cost)

    const idealTotalPoints = reduce(weeks, week => week.idealPoints) - totalHits
    const totalImprovement = reduce(weeks, week => week.idealPoints - week.actualPoints)

    return (
        <Widget cssClasses="point-improvements-widget" title={TITLE}>
            <div className="widget__detail">
                With optimised rotation and captain picks, you would have improved by{' '}
                <b>{getPointsLabel(thousandsSeparator(totalImprovement))}</b> (
                {round(totalImprovement / data.history.current.length, 1)} <Metric metric="ppw" />
                ), resulting in a total of <b>{getPointsLabel(thousandsSeparator(idealTotalPoints))}</b>.
            </div>
            <ul className="widget__list">
                {weeks.map(week => (
                    <li className="widget__list__item" key={week.event.event}>
                        <div className="point-improvements-widget__detail">
                            <SiteLink event={week.event.event} />
                            <div className="point-improvements-widget__swap">
                                <span>{getPointsLabel(week.actualPoints)}</span>
                                <SwapIcon />
                                <span>{getPointsLabel(week.idealPoints)}</span>
                                <ChangeBadge value={week.idealPoints - week.actualPoints} />
                            </div>
                        </div>
                        {(week.idealCaptain?.data[0].rawPoints || 0) > (week.actualCaptain?.data[0].rawPoints || 0) && (
                            <div className="point-improvements-widget__category" data-category="Captaincy">
                                <div className="point-improvements-widget__swap">
                                    {week.actualCaptain && <Player id={week.actualCaptain.element.id} />}
                                    <SwapIcon />
                                    {week.idealCaptain && <Player id={week.idealCaptain.element.id} />}
                                </div>
                            </div>
                        )}
                        {week.subs.length > 0 && (
                            <div className="point-improvements-widget__category" data-category="Substitutes">
                                {week.actualFormation !== week.idealFormation && (
                                    <div className="point-improvements-widget__swap point-improvements-widget__formation">
                                        {formatFormation(week.actualFormation)}
                                        <SwapIcon />
                                        {formatFormation(week.idealFormation)}
                                    </div>
                                )}
                                {week.subs.map(sub => (
                                    <div
                                        className="point-improvements-widget__swap"
                                        key={`${sub.out.element.id}-${sub.in.element.id}`}
                                    >
                                        <Player id={sub.out.element.id} />
                                        <SwapIcon />
                                        <Player id={sub.in.element.id} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </Widget>
    )
}

export default PointsImprovementsWidget
