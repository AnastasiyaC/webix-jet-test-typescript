import IDataObject from "sources/utils/interfaces";

const activityTypesCollection = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/activitytypes/",
	save: "rest->http://localhost:8096/api/v1/activitytypes/",
	scheme: {
		$init: (obj: IDataObject) => {
			obj.value = obj.Value;
		}
	}
});

export default activityTypesCollection;

