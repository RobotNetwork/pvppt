import { useState, useEffect } from 'react'
import './App.css'
import FightDataInput from './components/FightDataInput'
import FightMetricsDisplay from './components/FightMetricsDisplay'
import FightHistory from './components/FightHistory'
import ConfigurationPanel from './components/ConfigurationPanel'
import Header from './components/Header'
import { FightDataParser } from './utils/fightDataParser'
import { getConfigService } from './utils/configService'
import { createCalculationEngine } from './utils/calculationEngine'
import { FightData, FightHistoryItem, PvpTrackerConfig, CalculationMode } from './types/index'

function App() {
	const [fightData, setFightData] = useState<FightData | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [config, setConfig] = useState<PvpTrackerConfig>(() => getConfigService().getConfig())
	const [calculationMode, setCalculationMode] = useState<CalculationMode>(CalculationMode.DEFAULT)
	const [fightHistory, setFightHistory] = useState<FightHistoryItem[]>(() => {
		const saved = localStorage.getItem('pvpFightHistory')
		if (saved) {
			const parsed = JSON.parse(saved)
			// Add hash to existing fights that don't have it (for backward compatibility)
			return parsed.map((fight: any) => {
				if (!fight.hash && fight.data) {
					// Recreate hash for existing fights using the same algorithm
					const jsonData = JSON.stringify(fight.data)
					let hash = 5381
					for (let i = 0; i < jsonData.length; i++) {
						hash = ((hash << 5) + hash) + jsonData.charCodeAt(i)
					}
					return { ...fight, hash: Math.abs(hash).toString(36) }
				}
				return fight
			})
		}
		return []
	})
	const [selectedFight, setSelectedFight] = useState<FightHistoryItem | null>(null)
	const [duplicateFightId, setDuplicateFightId] = useState<number | null>(null)

	const parser = new FightDataParser()
	const configService = getConfigService()
	const calculationEngine = createCalculationEngine()

	// Load configuration on mount
	useEffect(() => {
		setConfig(configService.getConfig())
	}, [])

	const hashFightData = (jsonData: object): string => {
		// djb2 algorithm
		let hash = 5381
		const str = JSON.stringify(jsonData)
		for (let i = 0; i < str.length; i++) {
			hash = ((hash << 5) + hash) + str.charCodeAt(i) // hash * 33 + c
		}
		return Math.abs(hash).toString(36) // Convert to base36 for shorter strings
	}

	const findDuplicateFight = (jsonData: object): FightHistoryItem | undefined => {
		const newHash = hashFightData(jsonData)
		return fightHistory.find(fight => fight.hash === newHash)
	}

	// Auto-clear error and duplicate highlighting after 3 seconds
	useEffect(() => {
		if (error || duplicateFightId) {
			const timer = setTimeout(() => {
				setError(null)
				setDuplicateFightId(null)
			}, 2000)

			return () => clearTimeout(timer)
		}
	}, [error, duplicateFightId])

	// Save fight history to localStorage whenever it changes
	useEffect(() => {
		localStorage.setItem('pvpFightHistory', JSON.stringify(fightHistory))
	}, [fightHistory])

	const handleFightDataSubmit = async (jsonData: string): Promise<void> => {
		setIsLoading(true)
		setError(null)

		try {
			const parsedData = parser.parseFightData(jsonData)

			// Recalculate metrics based on current calculation mode and config
			let recalculatedData = parsedData
			if (calculationMode !== CalculationMode.DEFAULT) {
				try {
					recalculatedData = await calculationEngine.recalculateMetrics(
						parsedData,
						config,
						calculationMode
					)
				} catch (calcError) {
					console.warn('Failed to recalculate metrics, using original data:', calcError)
					// Continue with original data if recalculation fails
				}
			}

			// Add to fight history
			const newFight: FightHistoryItem = {
				id: Date.now(),
				timestamp: Date.now(),
				data: recalculatedData,
				competitorName: recalculatedData.competitor.name,
				opponentName: recalculatedData.opponent.name,
				hash: hashFightData(JSON.parse(jsonData)) // Add hash to the fight object
			}

			const duplicateFight = findDuplicateFight(JSON.parse(jsonData))
			if (duplicateFight) {
				setError(`This fight is already within your fight history.`)
				setFightData(null)
				// Highlight the duplicate fight in the history
				setSelectedFight(duplicateFight)
				setDuplicateFightId(duplicateFight.id)
			} else {
				setFightHistory(prev => [newFight, ...prev.slice(0, 9999)]) // Keep last 10000 fights
				setFightData(recalculatedData)
				setSelectedFight(newFight)
			}
		} catch (err) {
			setError((err as Error).message)
			setFightData(null)
		} finally {
			setIsLoading(false)
		}
	}

	const handleFightSelect = (fight: FightHistoryItem): void => {
		setSelectedFight(fight)
		setFightData(fight.data)
	}

	const handleClearHistory = (): void => {
		setFightHistory([])
		localStorage.removeItem('pvpFightHistory')
	}

	const handleDeleteFight = (fightId: number): void => {
		setFightHistory(prev => prev.filter(fight => fight.id !== fightId))

		// If the deleted fight was selected, clear the selection
		if (selectedFight && selectedFight.id === fightId) {
			setSelectedFight(null)
			setFightData(null)
		}
	}

	const handleConfigChange = (newConfig: PvpTrackerConfig): void => {
		setConfig(newConfig)
		configService.updateConfig(newConfig)
	}

	const handleCalculationModeChange = (mode: CalculationMode): void => {
		setCalculationMode(mode)
	}

	const getWinner = (fight: FightData): string | null => {
		if (fight.competitor.dead && !fight.opponent.dead) {
			return fight.opponent.name
		} else if (!fight.competitor.dead && fight.opponent.dead) {
			return fight.competitor.name
		}
		return null
	}

	return (
		<div className="app">
			<Header />
			<main className="app-main">
				<div className="config-section" style={{width: 280}}>
					<ConfigurationPanel
						config={config}
						onConfigChange={handleConfigChange}
						calculationMode={calculationMode}
						onCalculationModeChange={handleCalculationModeChange}
					/>
				</div>

				<div className="app-content">
					<div className="input-section">
						<FightDataInput
							onSubmit={handleFightDataSubmit}
							isLoading={isLoading}
							error={error}
						/>
					</div>

					<div className="display-section">
						{fightData && (
							<FightMetricsDisplay
								fightData={fightData}
								parser={parser}
								winner={getWinner(fightData)}
							/>
						)}
					</div>
				</div>

				<div className="history-section">
					<FightHistory
						fights={fightHistory.slice(0, 200)}
						selectedFight={selectedFight}
						onFightSelect={handleFightSelect}
						onClearHistory={handleClearHistory}
						onDeleteFight={handleDeleteFight}
						getWinner={getWinner}
						duplicateFightId={duplicateFightId}
					/>
				</div>
			</main>
		</div>
	)
}

export default App
