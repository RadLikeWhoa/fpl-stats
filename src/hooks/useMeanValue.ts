import { useSelector } from 'react-redux'
import { RootState } from '../reducers'
import { average, median } from '../utilities'

const useMeanValue: () => (series: number[]) => number = () => {
    const strategy = useSelector((state: RootState) => state.settings.meanStrategy)

    return (series: number[]) => {
        if (strategy === 'average') {
            return average(series)
        }

        return median(series)
    }
}

export default useMeanValue
