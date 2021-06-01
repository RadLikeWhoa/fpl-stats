import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../reducers'
import { getAllPlayers, getPointsLabel, head, sort } from '../../utilities'
import { Player } from '../Player'
import { Widget } from '../Widget'
import { SwapIcon } from '../SwapIcon'
import { SiteLink } from '../SiteLink'
import './CaptainOpportunityWidget.scss'

const CaptainOpportunityWidget: React.FC = () => {
    const stats = useSelector((state: RootState) => state.stats.data)

    const history = useSelector((state: RootState) => state.history.data)

    if (!stats || !history) {
        return (
            <Widget title="Missed Captaincies" />
        )
    }

    const allPlayers = getAllPlayers(stats)
    const weeks = history.current.length

    const improvements = Array.from(Array(weeks).keys()).map((el, index) => ({
        top: head(sort(allPlayers, el => el.data[index].rawPoints || 0)),
        captain: allPlayers.find(player => (player.data[index].multiplier || 0) > 1),
    }))

    return (
        <Widget title="Missed Captaincies" cssClasses="captain-opportunity-widget">
            <ul className="widget__list">
                {improvements.map((improvement, index) => {
                    if (!improvement.captain || !improvement.top) {
                        return null
                    }

                    const captainData = improvement.captain.data[index]
                    const topData = improvement.top.data[index]

                    if (captainData.rawPoints === topData.rawPoints) {
                        return null
                    }

                    return (
                        <li className="widget__list__item" key={captainData.event.id}>
                            <div>
                                <div className="captain-opportunity-widget__player">
                                    <b>OUT:</b> <Player id={improvement.captain.element.id} />
                                </div>
                                <div className="captain-opportunity-widget__player">
                                    <b>IN:</b> <Player id={improvement.top.element.id} />
                                </div>
                            </div>
                            <div className="captain-opportunity-widget__swap-info">
                                <b>{getPointsLabel((captainData.rawPoints || 0) * 2)}</b> <SwapIcon /> <b>{getPointsLabel((topData.rawPoints || 0) * 2)} </b>
                                {' '}
                                (
                                    <SiteLink event={captainData.event.id} />
                                )
                            </div>
                        </li>
                    )
                })}
            </ul>
        </Widget>
    )
}

export default CaptainOpportunityWidget