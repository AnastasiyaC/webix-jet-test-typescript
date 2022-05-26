export default interface IDatatableViewItemId {
	row: number;
	column: string
};

export default interface IActivitiesData {
	id: number;
	ContactID: number;
	Details: string;
	DueDate: string | Date;
	State: string;
	TypeID: number;
	date?: string | Date;
};

export default interface IActivityTypesData {
	id: number;
	Icon: string;
	Value: string;
	value?: string;
};

export default interface IContactsData {
	id: number;
	Address: string;
	Birthday: string | Date;
	Company: string;
	Email: string;
	FirstName: string;
	Job: string;
	LastName: string;
	Phone: string;
	Photo: string;
	Skype: string;
	StartDate: string | Date;
	StatusID: number;
	Website: string;
	BirthdayDate?: string;
	value?: string;
};

