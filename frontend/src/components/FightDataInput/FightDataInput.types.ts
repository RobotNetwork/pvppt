export interface FightDataInputProps {
	onSubmit: (jsonData: string) => void;
	onClear?: () => void;
	isLoading: boolean;
	error: string | null;
}


