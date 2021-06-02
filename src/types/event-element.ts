import { ElementExplanation } from './element-explanation'
import { ElementStats } from './element-stats'

export type EventElement = {
    id: number
    stats: ElementStats
    explain: ElementExplanation[]
}
