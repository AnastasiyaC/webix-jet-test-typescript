export default interface IActivitiesData {
	id: number;
	ContactID: number;
	Details: string;
	DueDate: string | Date;
	State: string;
	TypeID: number;
	date?: string | Date;
};