interface IStateData {
	State: string;
};

interface IDueDateData {
	DueDate: Date
};

interface IInnerData extends IStateData, IDueDateData {};

interface IFilters {
    Overdue: (obj: IInnerData) => boolean;
	Completed: (obj: IStateData) => boolean;
	Today: (obj: IDueDateData) => boolean;
	Tomorrow: (obj: IDueDateData) => boolean;
	ThisWeek: (obj: IDueDateData) => boolean;
	ThisMonth: (obj: IDueDateData) => boolean;
}

const activitiesFilters: IFilters = {
	Overdue: (obj: IInnerData): boolean => obj.State === "Open" && obj.DueDate < new Date(),
	Completed: (obj: IStateData): boolean => obj.State === "Close",
	Today: (obj: IDueDateData): boolean => webix.Date.equal(webix.Date.dayStart(obj.DueDate), webix.Date.dayStart(new Date())),
	Tomorrow: (obj: IDueDateData): boolean => {
		const tomorrowDayStart = webix.Date.add(webix.Date.dayStart(new Date()), 1, "day", false);

		return webix.Date.equal(webix.Date.dayStart(obj.DueDate), tomorrowDayStart);
	},
	ThisWeek: (obj: IDueDateData): boolean => {
		const weeekStart = webix.Date.weekStart(new Date());
		const weekEnd = webix.Date.add(webix.Date.weekStart(new Date()), 1, "week", false);

		return obj.DueDate >= weeekStart && obj.DueDate <= weekEnd;
	},
	ThisMonth: (obj: IDueDateData): boolean => {
		const monthStart = webix.Date.monthStart(new Date());
		const monthEnd = webix.Date.add(webix.Date.monthStart(new Date()), 1, "month", false);

		return obj.DueDate >= monthStart && obj.DueDate <= monthEnd;
	}
};

export default activitiesFilters;
