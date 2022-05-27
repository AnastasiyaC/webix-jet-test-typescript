import {JetView} from "webix-jet";

import ActivitiesDatatable from "../commonViews/activitiesDatatable";

interface IActivitiesView extends JetView {};

export default class ActivitiesView extends JetView implements IActivitiesView{
	config(): any {
		return {
			rows: [
				ActivitiesDatatable
			]
		};
	}
}