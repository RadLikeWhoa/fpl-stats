import React, { useContext } from 'react'
import { useSelector } from 'react-redux'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { RootState } from '../../reducers'
import { Widget } from '../Widget'
import { getAllPlayers, getShortName, initialCaps } from '../../utilities'
import { FilteredDataContext } from '../Dashboard/Dashboard'

const TITLE = 'Captain Points'

const CaptainPointsWidget: React.FC = () => {
    const data = useContext(FilteredDataContext)

    const bootstrap = useSelector((state: RootState) => state.bootstrap.data)

    if (!data || !bootstrap || !data.history.current.length) {
        return <Widget title={TITLE} />
    }

    const history = data.history
    const players = getAllPlayers(data.stats.data)

    const pointsData = history.current.map((entry, index) => {
        const captain = players.find(player => (player.data?.[index]?.multiplier || 0) > 1)
        const event = bootstrap.events.find(event => event.id === entry.event)

        return {
            name: `GW ${event ? getShortName(event) : entry.event}`,
            points: captain?.data[index].points || 0,
        }
    })

    return (
        <Widget title={TITLE}>
            <div className="chart">
                <ResponsiveContainer height={200} width="100%">
                    <AreaChart data={pointsData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                        <Area type="monotone" dataKey="points" stroke="#177B47" fill="#177B47" fillOpacity="0.75" />
                        <YAxis interval="preserveStartEnd" hide={true} />
                        <XAxis dataKey="name" angle={-90} textAnchor="end" interval="preserveStartEnd" hide={true} />
                        <Tooltip
                            isAnimationActive={false}
                            formatter={(value, name) => [value, initialCaps(name)]}
                            separator=": "
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Widget>
    )
}

export default CaptainPointsWidget
