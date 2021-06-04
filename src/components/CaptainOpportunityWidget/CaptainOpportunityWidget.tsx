import React from 'react'
import { getAllPlayers, getPointsLabel, head, sort } from '../../utilities'
import { Player } from '../Player'
import { Widget } from '../Widget'
import { SwapIcon } from '../SwapIcon'
import { SiteLink } from '../SiteLink'
import { FilteredData } from '../Dashboard/Dashboard'
import './CaptainOpportunityWidget.scss'

const TITLE = 'Missed Captaincies'

type Props = {
    data: FilteredData | undefined
}

const CaptainOpportunityWidget: React.FC<Props> = (props: Props) => {
    if (!props.data) {
        return <Widget title={TITLE} />
    }

    const stats = props.data.stats.data
    const history = props.data.history

    const allPlayers = getAllPlayers(stats)
    const weeks = history.current.length

    const improvements = Array.from(Array(weeks).keys()).map((el, index) => ({
        top: head(sort(allPlayers, el => el.data[index].rawPoints || 0)),
        captain: allPlayers.find(player => (player.data[index].multiplier || 0) > 1),
    }))

    return (
        <Widget title={TITLE} cssClasses="captain-opportunity-widget">
            {improvements.length > 0 && (
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
                                <div className="captain-opportunity-widget__group">
                                    <div className="captain-opportunity-widget__player">
                                        <b>OUT:</b> <Player id={improvement.captain.element.id} />
                                    </div>
                                    <div className="captain-opportunity-widget__player">
                                        <b>IN:</b> <Player id={improvement.top.element.id} />
                                    </div>
                                </div>
                                <div className="captain-opportunity-widget__swap-info">
                                    <b>{getPointsLabel((captainData.rawPoints || 0) * 2)}</b> <SwapIcon />{' '}
                                    <b>{getPointsLabel((topData.rawPoints || 0) * 2)} </b> (
                                    <SiteLink event={captainData.event.id} />)
                                </div>
                            </li>
                        )
                    })}
                </ul>
            )}
        </Widget>
    )
}

export default CaptainOpportunityWidget
