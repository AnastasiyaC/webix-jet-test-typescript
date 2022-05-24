interface filters {
    [key: string]: (obj: any) => boolean;
}

const activitiesFilters: filters = {
	Overdue: obj => obj.State === "Open" && obj.DueDate < new Date(),
	Completed: obj => obj.State === "Close",
	Today: obj => webix.Date.equal(webix.Date.dayStart(obj.DueDate), webix.Date.dayStart(new Date())),
	Tomorrow:obj => {
		const tomorrowDayStart = webix.Date.add(webix.Date.dayStart(new Date()), 1, "day", false);

		return webix.Date.equal(webix.Date.dayStart(obj.DueDate), tomorrowDayStart);
	},
	ThisWeek:obj => {
		const weeekStart = webix.Date.weekStart(new Date());
		const weekEnd = webix.Date.add(webix.Date.weekStart(new Date()), 1, "week", false);

		return obj.DueDate >= weeekStart && obj.DueDate <= weekEnd;
	},
	ThisMonth:obj => {
		const monthStart = webix.Date.monthStart(new Date());
		const monthEnd = webix.Date.add(webix.Date.monthStart(new Date()), 1, "month", false);

		return obj.DueDate >= monthStart && obj.DueDate <= monthEnd;
	}
};

export default activitiesFilters;
