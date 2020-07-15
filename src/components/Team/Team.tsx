import React from 'react'
import { Team as TeamType } from '../../types'
import './Team.scss'

type Props = {
    team: TeamType
}

const Team: React.FC<Props> = (props: Props) => (
    <div className="team">
        <img
            src={`https://fantasy.premierleague.com/dist/img/shirts/special/shirt_${props.team.code}-66.png`}
            alt={props.team.short_name}
            className="player__shirt"
        />
        <span className="team__name">{props.team.name}</span>
    </div>
)

export default Team