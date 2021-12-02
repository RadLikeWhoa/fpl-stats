import React, { useContext } from 'react'
import { getAllPlayers, getPointsLabel, head, sort } from '../../utilities'
import { Player } from '../Player'
import { Widget } from '../Widget'
import { SwapIcon } from '../SwapIcon'
import { SiteLink } from '../SiteLink'
import { FilteredDataContext } from '../Dashboard/Dashboard'
import { getGWCountLabel } from '../../utilities/strings'
import './CaptainOpportunityWidget.scss'

const TITLE = 'Missed Captaincies'

const CaptainOpportunityWidget: React.FC = () => {
    const data = useContext(FilteredDataContext)

    if (!data) {
        return <Widget title={TITLE} />
    }

    const stats = data.stats.data
    const history = data.history

    const allPlayers = getAllPlayers(stats)

    const improvements = history.current
        .map((el, index) => ({
            event: el.event,
            top: head(sort(allPlayers, el => el.data[index].rawPoints || 0)),
            captain: allPlayers.find(player => (player.data[index].multiplier || 0) > 1),
        }))
        .filter(
            (improvement, index) =>
                improvement.top &&
                improvement.captain &&
                improvement.captain.data[index].rawPoints !== improvement.top.data[index].rawPoints
        )

    const missedPoints = improvements.reduce((acc, improvement) => {
        const captainData = improvement.captain?.data.find(el => el.event.id === improvement.event)
        const topData = improvement.top?.data.find(el => el.event.id === improvement.event)

        return acc + ((topData?.rawPoints || 0) - (captainData?.rawPoints || 0))
    }, 0)

    return (
        <Widget title={TITLE} cssClasses="captain-opportunity-widget">
            {improvements.length > 0 && (
                <>
                    <div className="widget__detail">
                        Missed a total of <b>{getPointsLabel(missedPoints)}</b> accross{' '}
                        <b>{getGWCountLabel(improvements.length, true)}</b>.
                    </div>
                    <ul className="widget__list">
                        {improvements.map(improvement => {
                            const captainData = improvement.captain?.data.find(el => el.event.id === improvement.event)
                            const topData = improvement.top?.data.find(el => el.event.id === improvement.event)

                            return (
                                <li className="widget__list__item" key={captainData?.event.id}>
                                    <div className="captain-opportunity-widget__group">
                                        <Player id={improvement.captain?.element.id || 0} />
                                        <SwapIcon />
                                        <Player id={improvement.top?.element.id || 0} />
                                    </div>
                                    <div className="captain-opportunity-widget__swap-info">
                                        <b>{getPointsLabel((captainData?.rawPoints || 0) * 2)}</b>
                                        <SwapIcon />
                                        <b>{getPointsLabel((topData?.rawPoints || 0) * 2)} </b>
                                        <div>
                                            <SiteLink event={captainData?.event.id} />
                                        </div>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </>
            )}
        </Widget>
    )
}

export default CaptainOpportunityWidget
