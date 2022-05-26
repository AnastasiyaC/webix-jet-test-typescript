import IActivityTypesData from "../utils/interfaces/activityTypesDataInterface";

const activityTypesCollection = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/activitytypes/",
	save: "rest->http://localhost:8096/api/v1/activitytypes/",
	scheme: {
		$init: (obj: IActivityTypesData) => {
			obj.value = obj.Value;
		}
	}
});

export default activityTypesCollection;

