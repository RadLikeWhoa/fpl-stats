import React from 'react'
import { useSelector } from 'react-redux'
import { Widget } from '../Widget'
import { RootState } from '../../reducers'
import { ChangeBadge } from '../ChangeBadge'

const TITLE = 'Milestones'

const MilestonesWidget: React.FC = () => {
    const milestones = useSelector((state: RootState) => state.milestones.data)
    const entry = useSelector((state: RootState) => state.entry.data)

    if (!milestones || !entry) {
        return <Widget title={TITLE} />
    }

    return (
        <Widget title={TITLE}>
            <ul className="widget__list">
                <li className="widget__list__item">
                    <span>First Place</span>
                    <ChangeBadge value={entry.summary_overall_points - milestones[0].total} />
                </li>
                {milestones.length >= 2 && (
                    <li className="widget__list__item">
                        <span>Top 1K</span>
                        <ChangeBadge value={entry.summary_overall_points - milestones[1].total} />
                    </li>
                )}
                {milestones.length >= 3 && (
                    <li className="widget__list__item">
                        <span>Top 10K</span>
                        <ChangeBadge value={entry.summary_overall_points - milestones[2].total} />
                    </li>
                )}
                {milestones.length >= 4 && (
                    <li className="widget__list__item">
                        <span>Top 100K</span>
                        <ChangeBadge value={entry.summary_overall_points - milestones[3].total} />
                    </li>
                )}
                {milestones.length === 5 && (
                    <li className="widget__list__item">
                        <span>Top 1M</span>
                        <ChangeBadge value={entry.summary_overall_points - milestones[4].total} />
                    </li>
                )}
            </ul>
        </Widget>
    )
}

export default MilestonesWidget
