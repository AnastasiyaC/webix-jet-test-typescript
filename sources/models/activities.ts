import IActivitiesData from "../utils/interfaces";

const activitiesCollection = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/activities/",
	save: "rest->http://localhost:8096/api/v1/activities/",
	scheme: {
		$init(obj: IActivitiesData) {
			obj.date = obj.DueDate;
			obj.DueDate = new Date(obj.DueDate);
		},
		$save: (obj: IActivitiesData) => {
			const dueDateFormat = webix.Date.dateToStr("%Y-%m-%d %H:%i", false);

			obj.DueDate = dueDateFormat(obj.DueDate);
		}
	}
});

export default activitiesCollection;
