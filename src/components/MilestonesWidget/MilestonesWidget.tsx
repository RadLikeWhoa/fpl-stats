import React from 'react'
import { useSelector } from 'react-redux'
import { getPointsLabel, thousandsSeparator } from '../../utilities'
import { Widget } from '../Widget'
import { RootState } from '../../reducers'

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
                    <span>1st</span>
                    <b>{getPointsLabel(thousandsSeparator(entry.summary_overall_points - milestones[0].total))}</b>
                </li>
                {milestones.length >= 2 && (
                    <li className="widget__list__item">
                        <span>10K</span>
                        <b>{getPointsLabel(thousandsSeparator(entry.summary_overall_points - milestones[1].total))}</b>
                    </li>
                )}
                {milestones.length >= 3 && (
                    <li className="widget__list__item">
                        <span>100K</span>
                        <b>{getPointsLabel(thousandsSeparator(entry.summary_overall_points - milestones[2].total))}</b>
                    </li>
                )}
                {milestones.length === 4 && (
                    <li className="widget__list__item">
                        <span>1M</span>
                        <b>{getPointsLabel(thousandsSeparator(entry.summary_overall_points - milestones[3].total))}</b>
                    </li>
                )}
            </ul>
        </Widget>
    )
}

export default MilestonesWidget
