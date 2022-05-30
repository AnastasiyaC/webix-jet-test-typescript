import IStatusesData from "../utils/interfaces/statusesDataInterface";

const statusesCollection = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/statuses/",
	save: "rest->http://localhost:8096/api/v1/statuses/",
	scheme: {
		$init: (obj: IStatusesData) => {
			obj.value = obj.Value;
		}
	}
});

export default statusesCollection;
